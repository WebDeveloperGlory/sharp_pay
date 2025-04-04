const { verifyToken } = require('../../../modules/appfunctions');
const withdrawRoute = require('express').Router();
const imports = require("../../../modules/imports");

withdrawRoute.post('/withdraw',verifyToken, async (req, res) => {
    const pool = imports.connnectDB();
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();

        // Extract data from request body
        const { walletId, amount, walletAddress } = req.body;

        if(isNaN(Number(amount)) || Number(amount) < 0)
            return res.status(400).json({ status: false, message: 'Bad Request' });


        if (walletAddress == undefined || walletAddress.length < 10) {
            return res.status(400).json({ status: false, message: 'Invalid wallet address passed' });
        }

        // Get user ID from request token (assuming you have implemented authentication middleware)
        const userId = req.tokenUser.id;

        // Check if the wallet ID matches the user's wallet ID
        const [walletrow] = await pool.query('SELECT * FROM user_wallets WHERE user_id = ? AND wallet_id = ?', [userId, walletId]);
        const walletRow = walletrow[0];
        if (walletrow.length < 1) {
            return res.status(400).json({ status: false, message: 'Could not access your details' });
        }
        if (!walletRow) {
            await connection.rollback();
            return res.status(400).json({ status: false, message: 'Wallet not found for the user' });
        }

        // Check if the balance is sufficient for withdrawal
        if (walletRow.balance < amount) {
            await connection.rollback();
            return res.status(400).json({ status: false, message: 'Insufficient balance' });
        }

        // Update balance in user_wallets table
        const newBalance = walletRow.balance - amount;
        await connection.query('UPDATE user_wallets SET balance = ? WHERE user_id = ? AND wallet_id = ?', [newBalance, userId, walletId]);

        // Insert withdrawal record into withdrawal table
        await connection.query('INSERT INTO withdrawal (user_id, wallet_id, amount, wallet_addr, network, stat) VALUES (?, ?, ?, ?, ?, ?)', [userId, walletId, amount, walletAddress, 'network_value_here', 'pending']);
        await connection.commit();

        res.status(200).json({ status: true, message: 'Withdrawal request submitted successfully' });
    } catch (error) {
        console.error('Error:', error);
        await connection.rollback();
        res.status(500).json({ status: false, message: 'Internal server error' });
    } finally {
        connection.release();
    }
});

module.exports = {
    withdrawRoute
}
