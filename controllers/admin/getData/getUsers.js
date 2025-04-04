const getUsersRoute = require("express").Router();
const { verifyAdminToken } = require("../../../modules/appfunctions");
const { connnectDB, generateTransactionRef } = require("../../../modules/imports");

getUsersRoute.get('/users', verifyAdminToken,async (req, res) => {
    const conn = connnectDB();
    const pool = await conn.getConnection();

    try {
        const [result] = await pool.query('SELECT id, email, lastN, firstN, acc_bal AS balance, created_at , is_verified FROM users');

        const users = Promise.all(
            result.map(async user => {
                const [sells] = await pool.query(
                    `SELECT 
                    (SELECT COUNT(id) FROM transactions WHERE urs_id = ?) AS no_t, 
                    (SELECT COUNT(id) FROM deposits WHERE user_id = ?) AS no_dt, 
                    (SELECT COUNT(id) FROM withdrawal WHERE user_id = ?) AS no_wt`,
                 [user.id, user.id, user.id]
                )
                return {
                    id: user.id,
                    name: `${user.firstN} ${user.lastN}`,
                    email: user.email,
                    balance: `${user.balance}`, // assuming balance is a number
                    noT: sells[0]['no_t']+sells[0]['no_dt']+sells[0]['no_wt'], // Number of transactions, assuming you need to calculate this separately
                    status: user.is_verified // assuming status is represented by is_verified field
                }
            })
        );
        res.status(200).json({ status: true, data:await users });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ status: false, message: 'Internal server error' });
    } finally {
        pool.release();
    }
});

module.exports = {
    getUsersRoute
}
