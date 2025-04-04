const getTransactionsRoute = require("express").Router();
const { verifyAdminToken } = require("../../../modules/appfunctions");
const { connnectDB,generateTransactionRef, baseUrl } = require("../../../modules/imports");



getTransactionsRoute.get("/transactions", verifyAdminToken,async (req, res) => {
    const conn = connnectDB();
    const pool = await conn.getConnection();
    try {
        // Fetch deposits for all users
        const [depositResult] = await conn.query(
            `SELECT d.*, c.coin_name, c.coin_abv, c.logoUrl, 
                    c.minDeposit,u.email,u.countryCode , u.phone, u.lastN,u.firstN,n.name AS network_name, n.abv AS network_abv
             FROM deposits d
             INNER JOIN coins c ON d.coin_id = c.id 
             INNER JOIN users u ON d.user_id = u.id 
             INNER JOIN networks n ON d.network_id = n.id 
             ORDER BY d.created_at DESC`
        );

        const deposits = depositResult.map(row => ( {
            id: row.id,
            key: row.id,
            name: row.firstN+" "+row.lastN,
            date: row.created_at,
            transactionType: 'Deposit',
            typeId: 1,
            status: row.stat,
            data:{
                typeId: 1,
                amount:row.amount,
                coin:row.coin_name,
                coin_abv:row.coin_abv,
                coin_logo:row.logoUrl,
                network:row.network_name,
                network_abv:row.network_abv,
                rate:row.trans_rate,
                date: row.created_at,
                status: row.stat,
                email:row.email,
                country_code:row.countryCode,
                phone:row.phone,
                ref:row.trans_ref,
                img:baseUrl+row.trans_img
            }
        }));

        // Fetch withdrawals for all users
        const [withdrawalResult] = await conn.query(
            `SELECT d.id, d.created_at, d.amount, d.stat, d.wallet_addr, c.coin_name, c.coin_abv, c.logoUrl, 
                    c.minDeposit, w.coin_id,u.email,u.countryCode , u.phone, u.lastN , u.firstN
             FROM withdrawal d 
             INNER JOIN user_wallets w ON d.wallet_id = w.wallet_id 
             INNER JOIN coins c ON w.coin_id = c.id 
             INNER JOIN users u ON d.user_id = u.id 
             ORDER BY d.created_at DESC`
        );

        const withdrawals = withdrawalResult.map(row => ({
            id: row.id,
            key: row.id,
            name: row.firstN+" "+row.lastN,
            date: row.created_at,
            transactionType: 'Withdrawal',
            typeId: 2,
            status: row.stat,
            data:{
                typeId: 2,
                amount:row.amount,
                wallet:row.wallet_addr,
                coin:row.coin_name,
                coin_abv:row.coin_abv,
                coin_logo:row.logoUrl,
                // network:row.network_name,
                // network_abv:row.network_abv,
                date: row.created_at,
                status: row.stat,
                email:row.email,
                country_code:row.countryCode,
                phone:row.phone
            }
        }));

        // Fetch transactions for all users
        const qryPar = "t.ref_id AS id, t.coin_id, t.coin_amo AS amount, t.usd_amo, t.ngn_amo, t.tns_rate, t.usd_rate, t.tns_type AS type, t.stat AS status, t.created_at, u.lastN AS user_name";
        const sql = `SELECT ${qryPar}, c.coin_name, c.coin_abv, c.minDeposit 
                     FROM transactions t 
                     INNER JOIN coins c ON t.coin_id = c.id 
                     INNER JOIN users u ON t.urs_id = u.id 
                     ORDER BY t.created_at DESC`;
        const sql1 = `SELECT f.*,u.firstN , u.lastN, u.email , u.countryCode,u.phone , u.acc_bal FROM funding f INNER JOIN users u ON f.urs_id = u.id   
                     ORDER BY f.created_at DESC`;

        const [tnsH] = await conn.query(sql1);

        const transactions = tnsH.map(row => ({
            id: row.id,
            key: row.id,
            name: row.firstN+" "+row.lastN,
            date: row.created_at,
            transactionType: 'Funding',
            typeId: 3,
            status: row.stat,
            data:{
                typeId: 3,
                amount:row.amount,
                date: row.created_at,
                status: row.stat,
                email:row.email,
                country_code:row.countryCode,
                phone:row.phone,
                img:baseUrl+row.image_url
            }
        }));

        // Combine deposits, withdrawals, and transactions into a single array
        const allTransactions = [...deposits, ...withdrawals, ...transactions] ;
        console.log(deposits);

        // Sort the transactions array by created_at date in descending order
        allTransactions.sort((a, b) => new Date(b.date) - new Date(a.date));

        res.status(200).json({ status: true, data: allTransactions.map((data,index)=>({...data,key:index})) });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ status: false, message: 'Internal server error' });
    } finally {
        pool.release();
    }
});

module.exports  = {
    getTransactionsRoute
}
