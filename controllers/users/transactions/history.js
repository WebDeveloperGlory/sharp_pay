const { verifyToken } = require("../../../modules/appfunctions");
const imports = require("../../../modules/imports");
const historyRoute = require("express").Router();

historyRoute.get("/history/", verifyToken, async (req, res) => {
    const userId = req.tokenUser.id;

    const conn = imports.connnectDB();
    const pool = await conn.getConnection();
    try {
        // Fetch deposits for the user (limited to maximum 30 rows)
        const [depositResult] = await conn.query('SELECT d.id , d.created_at, d.amount, d.stat , c.coin_name , c.coin_abv , c.logoUrl , c.minDeposit , w.coin_id FROM deposits  d INNER JOIN user_wallets w ON d.wallet_id = w.wallet_id INNER JOIN coins c ON w.coin_id = c.id WHERE d.user_id = ? ORDER BY d.created_at DESC LIMIT 30', [userId]);
        const deposits = depositResult.map(row => ({
            type: 'deposit',
            created_at: row.created_at,
            amount: row.amount,
            status: row.stat,
            coin_name: row.coin_name,
            coin_abv: row.coin_abv,
            id:row.id,
            coin_id:row.coin_id,
            usd_amo: null,
            ngn_amo: null,
            tns_rate:null,
            usd_rate: null,
            minDeposit:row.minDeposit

        }));

        // Fetch withdrawals for the user (limited to maximum 30 rows)
        const [withdrawalResult] = await pool.query('SELECT d.id , d.created_at, d.amount, d.stat , c.coin_name , c.coin_abv , c.logoUrl  , c.minDeposit , w.coin_id  FROM withdrawal  d INNER JOIN user_wallets w ON d.wallet_id = w.wallet_id INNER JOIN coins c ON w.coin_id = c.id WHERE d.user_id = ? ORDER BY d.created_at DESC LIMIT 30', [userId]);
        console.log(withdrawalResult);
        const withdrawals = withdrawalResult.map(row => ({
            type: 'withdrawal',
            created_at: row.created_at,
            amount: row.amount,
            status: row.stat,
            coin_name: row.coin_name,
            coin_abv: row.coin_abv,
            id:row.id,
            coin_id:row.coin_id,
            usd_amo: null,
            ngn_amo: null,
            tns_rate:null,
            usd_rate: null,
            minDeposit:row.minDeposit
        }));
        
        const [fundingResult] = await pool.query('SELECT id, created_at, amount, image_url, stat FROM funding WHERE urs_id = ? ORDER BY created_at DESC LIMIT 30', [userId]);
        const fundingHistory = fundingResult.map(row => ({
            type: 'funding',
            created_at: row.created_at,
            amount: row.amount,
            status: row.stat,
            id: row.id,
            usd_amo: null,
            ngn_amo: null,
            tns_rate:null,
            usd_rate: null,
            minDeposit:0,
            coin_name:null,
            coin_abv: null,
        }));

        const qryPar = "t.ref_id AS id,t.coin_id,t.coin_amo AS amount,t.usd_amo,t.ngn_amo,t.tns_rate,t.usd_rate,t.tns_type AS type,t.stat AS status,t.created_at"
        const sql = `SELECT ${qryPar} , c.coin_name ,c.coin_abv, c.minDeposit FROM transactions t INNER JOIN coins c ON t.coin_id = c.id  WHERE t.urs_id = ?`;

        const [tnsH] = await pool.query(sql, [userId]);

        const history = tnsH.map(th => {
            let obj = {
                ...th,
                type: th.type == 1 ? "Buy" : "sell"
            }
            return obj
        });

        // Combine deposits and withdrawals and history into a single array
        const transactions = [...deposits, ...withdrawals , ...history, ...fundingHistory];

        // Sort the transactions array by created_at date in descending order
        transactions.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

        // Limit the array to a maximum of 30 rows
        const limitedTransactions = transactions.slice(0, 30);

        res.status(200).json({ status: true, data: limitedTransactions });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ status: false, message: 'Internal server error' });
    }
});

module.exports = {
    historyRoute
}
