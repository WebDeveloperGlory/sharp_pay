const transactionActionRoute = require("express").Router();
const { verifyAdminToken } = require("../../../modules/appfunctions");
const { connnectDB, generateTransactionRef } = require("../../../modules/imports");


transactionActionRoute.post("/transaction/confirm", verifyAdminToken, async (req, res) => {
    const { transactionId, transactionType } = req.body;
    const adminUser = req.tokenUser;
    const adminId = adminUser.id;

    if (!transactionId || !transactionType) {
        return res.status(400).json({ status: false, message: "Transaction ID and type are required" });
    }

    const conn = connnectDB();
    const pool = await conn.getConnection();
    try {
        let tableName;
        if (transactionType === 'deposit') {
            tableName = 'deposits';
            const [depo] = await pool.query("SELECT d.coin_id , d.user_id,d.amount , w.balance , w.wallet_id AS wallet FROM deposits d INNER JOIN user_wallets w ON d.user_id = w.user_id AND d.coin_id = w.coin_id  WHERE d.id = ? AND d.stat = ?", [transactionId, 0]);
            if (depo.length !== 1) {
                //pool.release();
                return res.status(400).json({ status: false, message: "Transaction not found" });
            }
            const deposit = depo[0];
            if (!deposit.balance && deposit.balance !== 0) {
                return res.status(400).json({ status: false, message: "Invalid balance" });
            }
            pool.release();
            const newBal = Number(deposit.amount) + Number(deposit.balance);
            if (isNaN(newBal))
                return res.status(500).json({ status: false, message: "Error processing transaction" });
            var pool2;
            try {
                pool2 = await conn.getConnection();
                await pool2.beginTransaction();

                const [balanced] = await pool2.query("UPDATE user_wallets SET balance = ? WHERE wallet_id = ?", [newBal, deposit.wallet]);
                const [record] = await pool2.query("UPDATE deposits SET stat = 1 , attended_by = ?  WHERE id = ?", [adminId, transactionId]);
                console.log(adminId, transactionId);

                if (balanced.affectedRows == 1 && record.affectedRows == 1) {
                    await pool2.commit();
                    res.status(200).json({ status: true, message: "Deposit confirmed" });
                } else {
                    await pool2.rollback();
                    res.status(500).json({ status: false, message: "Error confirming deposit" });
                }

            } catch (e) {
                if (pool2) {
                    await pool2.rollback();
                    pool2.release();
                }
                throw e;
            }
        } else if (transactionType === 'withdrawal') {
            tableName = 'withdrawal';
            const [result] = await conn.query(`UPDATE ${tableName} SET stat = 1 , attended_by = ? WHERE id = ? AND stat = 0`, [adminId, transactionId]);

            if (result.affectedRows === 0) {
                return res.status(400).json({ status: false, message: "Transaction has already been attended to or does not exist" });
            }

            res.status(200).json({ status: true, message: "Withdrawal confirmed" });
        } else if (transactionType === "funding") {
            tableName = 'funding';

            const [users] = await conn.query(`SELECT f.* , u.acc_bal AS balance FROM funding f INNER JOIN users u ON f.urs_id = u.id WHERE f.id = ? AND f.stat = 0`, [transactionId]);
            if (users.length === 0) {
                pool.release();
                return res.status(400).json({ status: false, message: "Transaction has already been attended to or does not exist" });
            }
            const user = users[0];
            const newBal = Number(user.balance) + Number(user.amount);
            if (isNaN(newBal)) {
                pool.release();
                return res.status(500).json({ status: true, message: "Error processing transaction" });
            }

            pool.release();
            var pool2;
            try {
                pool2 = await conn.getConnection();
                await pool2.query("UPDATE users SET acc_bal = ? WHERE id = ?", [newBal, user.urs_id]);
                await pool2.query("UPDATE funding SET stat = 1 , attended_by = ? WHERE id = ?", [adminId, transactionId]);
                await pool2.commit();
                return res.status(200).json({ status: true, message: "Account funded" });
            } catch (e) {
                if (pool2) {
                    pool2.release();
                }
                throw e;
            }
        } else {
            return res.status(400).json({ status: false, message: "Invalid transaction type" });
        }



    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ status: false, message: 'Internal server error' });
    } finally {
        // console.log("damn");
        pool.release();
    }
});

// Deny transaction
transactionActionRoute.post("/transaction/deny", verifyAdminToken, async (req, res) => {
    const { transactionId, transactionType } = req.body;
    const adminUser = req.tokenUser;
    const adminId = adminUser.id;

    if (!transactionId || !transactionType) {
        return res.status(400).json({ status: false, message: "Transaction ID and type are required" });
    }

    const conn = connnectDB();
    const pool = await conn.getConnection();
    try {
        let tableName;
        if (transactionType === 'deposit') {
            tableName = 'deposits';
            const [result] = await conn.query(`UPDATE ${tableName} SET stat = 2 , attended_by = ? WHERE id = ? AND stat = 0`, [transactionId, adminId]);

            if (result.affectedRows === 0) {
                return res.status(400).json({ status: false, message: "Transaction has already been attended to or does not exist" });
            }

            res.status(200).json({ status: true, message: "Deposit successfully denied" });
        } else if (transactionType === 'withdrawal') {
            tableName = 'withdrawal';
            const pool = await conn.getConnection();

            const [withdrawals] = await pool.query(`SELECT w.amount, w.wallet_id , u.balance  FROM ${tableName} w INNER JOIN user_wallets u ON w.wallet_id = u.wallet_id WHERE w.id = ? AND w.stat = 0`, [transactionId])
            if (withdrawals.length !== 1)
                return res.status(400).json({ status: false, message: "Transaction has already been attended to or does not exist" });
            const withH = withdrawals[0];
            const amount = withH.amount;
            const balance = withH.balance;
            const newBal = Number(amount) + Number(balance);


            if (!amount || !balance || isNaN(newBal))
                return res.status(400).json({ status: false, message: "Error processing request" });

            try {
                await pool.beginTransaction();

                const [record] = await pool.query(`UPDATE ${tableName} SET stat = 2 , attended_by = ? WHERE id = ? AND stat = 0`, [ adminId,transactionId]);
                const [balanced] = await pool.query(`UPDATE user_wallets SET balance = ?  WHERE wallet_id = ?`, [newBal, withH.wallet_id]);
                if (balanced.affectedRows == 1 && record.affectedRows == 1) {
                    await pool.commit();
                    res.status(200).json({ status: true, message: "Deposit successfully denied" });
                } else {
                    console.log(record.affectedRows,balanced.affectedRows);
                    await pool.rollback();
                    res.status(500).json({ status: false, message: "Failed to transaction" });
                }
            } catch (e) {
                await pool.rollback();
                throw e;
            }
        } else if (transactionType === 'funding') {
            tableName = 'funding';
            const [result] = await conn.query(`UPDATE ${tableName} SET stat = 2 , attended_by = ? WHERE id = ? AND stat = 0`, [transactionId, adminId]);

            if (result.affectedRows === 0) {
                return res.status(400).json({ status: false, message: "Transaction has already been attended to or does not exist" });
            }

            res.status(200).json({ status: true, message: "Account funding successfully denied" });
        } else {
            return res.status(400).json({ status: false, message: "Invalid transaction type" });
        }

    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ status: false, message: 'Internal server error' });
    } finally {
        pool.release();
        conn.releaseConnection();
    }
});

module.exports = {
    transactionActionRoute
}
