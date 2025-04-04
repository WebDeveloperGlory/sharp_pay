const getStatRoute = require("express").Router();
const { verifyAdminToken, verifySuperAdminToken } = require("../../../modules/appfunctions");
const { connnectDB,generateTransactionRef } = require("../../../modules/imports");


getStatRoute.get('/stats',verifyAdminToken,async (req, res) => {
    const conn = connnectDB();
    const pool = await conn.getConnection();

    try {
        const [userCountResult] = await pool.query('SELECT COUNT(*) AS userCount FROM users');
        const [withdrawalCountResult] = await pool.query('SELECT COUNT(*) AS withdrawalCount FROM withdrawal');
        const [depositCountResult] = await pool.query('SELECT COUNT(*) AS depositCount FROM deposits');
        const [orderCountResult] = await pool.query('SELECT COUNT(*) AS orderCount FROM transactions');

        const stats = {
            users: userCountResult[0].userCount,
            withdrawal: withdrawalCountResult[0].withdrawalCount,
            deposits: depositCountResult[0].depositCount,
            orders: orderCountResult[0].orderCount,
        };

        res.status(200).json({ status: true, data: stats }) ;
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ status: false, message: 'Internal server error' });
    } finally {
        pool.release();
    }
});

module.exports = {
    getStatRoute
}
