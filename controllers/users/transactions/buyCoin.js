const route = require("express").Router();
const { verifyToken } = require("../../../modules/appfunctions");
const { connnectDB, generateTransactionRef } = require("../../../modules/imports");
const { usdt_rate } = require("../../../data.json");
const Sharppay_user = require("../../../modules/user-model");
//const Sharppay_user = require("../../modules/user-model");
/**
 * @swagger
 * /users/buycoin:
 *   post:
 *     summary: sell coins
 *     description: Endpoint for users to buy coins
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - coin_id
 *               - coin_amount
 *               - usd_amo
 *               - ngn_amo
 *               - usd_rate
 *             properties:
 *               coin_id:
 *                 type: number
 *                 description: ID of the coin to buy
 *               coin_amount:
 *                 type: number
 *                 description: Amount of coin to buy
 *               usd_amo:
 *                 type: number
 *                 description: Equivalent USD amount
 *               ngn_amo:
 *                 type: number
 *                 description: Equivalent NGN amount
 *               usd_rate:
 *                 type: number
 *                 description: USD exchange rate
 *     responses:
 *       200:
 *         description: Successful transaction
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                   description: Success message including transaction ID
 *       400:
 *         description: Missing or invalid parameters
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                   description: Error message indicating missing or invalid parameters
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                   description: Server error message
 */

route.post("/buycoin", verifyToken, async (req, res) => {
    const user = req.tokenUser;
    const urs_id = user.id;
    const urs_email = user.email;

    const { coin_id, coin_amount, usd_amo, ngn_amo, usd_rate } = req.body;
    function validateParams(params) {
        const { coin_amount, usd_amo, ngn_amo, usd_rate } = params;

        if (
            typeof coin_amount === 'number' && coin_amount > 0 &&
            typeof usd_amo === 'number' && usd_amo > 0 &&
            typeof ngn_amo === 'number' && ngn_amo > 0 &&
            typeof usd_rate === 'number' && usd_rate > 0
        ) {
            return true;
        }

        return false;
    }

    async function checkRef(ref) {
        return new Promise(async function (res, rej) {
            try {
                // create a pool connection
                const conn = await connnectDB.getConnection();

                //sql query 
                var sql = `SELECT * FROM tansactions WHERE ref_id = '${ref}'`;
                const [result] = await conn.query(sql);

                if (result.length == 0) {
                    res(false);
                } else {
                    res(true);
                }

            } catch (err) {
                rej(false);
            }
        })
    }

    // Check if all parameters are provided and not empty
    if (!coin_id || !coin_amount || !usd_amo || !ngn_amo || !usd_rate)
        return res.status(400).json({ status: false, message: 'Missing required parameters' });


    if (!validateParams(req.body))
        return res.status(400).json({ status: false, message: 'Invalid parameter passed' });



    const csql = "SELECT w.* , c.minDeposit , c.rate FROM user_wallets w INNER JOIN coins c ON w.coin_id = c.id WHERE w.coin_id = ? AND w.user_id = ?";

    const pool = await connnectDB().getConnection();

    const [coin] = await pool.query(csql, [coin_id, urs_id]);

    if (coin.length !== 1)
        return res.status(400).json({ status: false, message: 'coin data not found for this user' });


    const usercoin = coin[0];
    if (usd_amo < usercoin['minDeposit'])
        return res.status(400).json({ status: false, message: `minimum purchase for this coin is $${usercoin['minDeposit']}` });

    const Suser = new Sharppay_user(urs_email);
    const ngn = Math.round(usdt_rate * coin_amount * usercoin['rate']);
    try {
        await Suser.getInfo();
        if (Suser.data.balance < ngn)
            return res.status(400).json({ status: false, message: `insuffient balance` });
    } catch (e) {
        return res.status(500).json({ status: false, message: "Server Error 502" });
    }
    async function checkRef(ref) {
        try {
            // create a pool connection
            const conn = await connnectDB().getConnection();

            //sql query using prepared statements
            const sql = `SELECT * FROM transactions WHERE ref_id = ?`;
            const [result] = await conn.query(sql, [ref]);

            // release the connection
            conn.release();

            return result.length > 0;
        } catch (err) {
            return false;
        }
    }
    async function generateUniqueTransactionRef() {
        let refId = generateTransactionRef();
        let noErr = true;

        while (await checkRef(refId).catch(err => { noErr = false; return false; }) && noErr) {
            refId = generateTransactionRef();
        }

        if (!noErr) {
            throw new Error("Error generating unique transaction reference");
        }

        return refId;
    }

    var refId;

    try {
        refId = await generateUniqueTransactionRef();
    } catch (err) {
        return res.status(500).json({ status: false, message: "Error generating transaction" });
    }

    pool.release();
    var pool2;
    try {
        pool2 = await connnectDB().getConnection();

        await pool2.beginTransaction();

        const newWalBal = Number(usercoin['balance'])  + Number(coin_amount);

        const newBal = Number(Suser.data.balance) - Number(ngn);

        const validAmount = x =>{
            return typeof x == 'number' && !isNaN(x);
        }

        if(!validAmount(newBal) || !validAmount(newWalBal))
            return res.status(400).json({ status: false, message: "Invalid transaction " });

        await pool2.query(
            "UPDATE user_wallets SET balance = ? , WHERE user_id = ? AND coin_id = ? ",
            [newWalBal,urs_id,coin_id]
        );

        await pool2.query(
            "UPDATE users SET acc_bal = ? , WHERE user_id = ? ",
            [newBal,urs_id]
        );

        const insql = "INSERT INTO transactions(ref_id,urs_id,coin_id,coin_amo,usd_amo,ngn_amo,tns_rate,usd_rate,tns_type) VALUES(? , ? , ? , ? , ? ,? ,?,?,?)";
        const [result] = await pool2.query(insql, [refId, urs_id, coin_id, coin_amount, usd_amo, ngn_amo, (coin_amount / usd_amo), usd_rate, 1]);
        if (result) {
            await pool2.commit();
            res.status(200).json({ status: true, message: `Buy transaction opened.  id:\"${refId}\"`, data: { transactionId: refId } });
        } else {
            res.status(500).json({ status: false, message: "Error opening transaction" });
        }
    }catch(e){
        if(pool2){
            await pool2.rollback();
        }
        res.status(500).json({ status: false, message: "Error opening transaction" });
        throw e;
    }
});

module.exports = route;