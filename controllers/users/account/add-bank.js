const route = require("express").Router();
const { verifyToken } = require("../../../modules/appfunctions");
const { connnectDB } = require("../../../modules/imports");
const Sharppay_user = require("../../../modules/user-model");
/**
 * @swagger
 * /users/add-bank-account:
 *   post:
 *     summary: Add a bank account
 *     description: Add a bank account for a user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - bank_name
 *               - acc_num
 *               - acc_name
 *             properties:
 *               bank_name:
 *                 type: string
 *                 description: The name of the bank
 *               acc_num:
 *                 type: string
 *                 description: The account number
 *               acc_name:
 *                 type: string
 *                 description: The name associated with the account
 *     responses:
 *       '200':
 *         description: Successful response with success message
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                   description: Indicates the status of the response
 *                 message:
 *                   type: string
 *                   description: Success message
 *       '400':
 *         description: Bad request response
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                   description: Indicates the status of the response
 *                 message:
 *                   type: string
 *                   description: Error message indicating bad request
 *       '500':
 *         description: Server error response
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                   description: Indicates the status of the response
 *                 message:
 *                   type: string
 *                   description: Error message indicating
*/
const validateParams = async (req, res, next) => {
    const user = req.tokenUser;
    const urs_id = user.id;
    const { bank_name, acc_num, acc_name } = req.body;

    // Check if all parameters are provided and not empty
    if (!bank_name || !acc_num || !acc_name) {
        return res.status(400).json({ status: false, message: 'Missing required parameters' });
    }

    if (String(acc_num).length != 10)
        return res.status(400).json({ status: false, message: 'Invalid account number' });

    try {
        const conn = await connnectDB().getConnection();
        const sql = `SELECT * FROM bank_acc_info WHERE urs_id = ? AND bank_name = ? AND acc_num = ?`;
        const [resu] = await conn.query(sql, [urs_id, bank_name, acc_num]);
        if (resu.length > 0)
            return res.status(400).json({ status: false, message: 'You have already added this account' });
    } catch (err) {
        //console.log(err);
        return res.status(500).json({ status: false, message: 'Server error 5501' });
    }
    next();
};
route.post("/add-bank-account", validateParams, verifyToken,async (req, res) => {
    const user = req.tokenUser;
    const urs_id = user.id;
    const { bank_name, acc_num, acc_name } = req.body;
    const sql = "INSERT INTO bank_acc_info (urs_id,bank_name, acc_num, acc_name) VALUES(?,?,?,?)"; 
    try{
        const conn  = await connnectDB().getConnection();
        const [resu] = await conn.query(sql, [urs_id, bank_name, acc_num,acc_name]);

        if(resu){
            return res.status(200).json({ status: true, message: 'success' });
        }else{
            return res.status(500).json({ status: false, message: 'Action failed' });
        }
    }catch(err){
        return res.status(500).json({ status: false, message: 'Server error  5502' });
    }

});

module.exports = route;