const setPasscodeRoute = require("express").Router();
const { verifyToken } = require("../../../modules/appfunctions");
const { connnectDB } = require("../../../modules/imports");
const Sharppay_user = require("../../../modules/user-model");
/**
 * @swagger
 * /users/setpasscode:
 *   post:
 *     summary: Set a passcode for the user
 *     description: Allows a user to set a 6-digit passcode.
 *     parameters:
 *       - in: body
 *         name: body
 *         description: Passcode data
 *         required: true
 *         schema:
 *           type: object
 *           required:
 *             - pscd
 *           properties:
 *             pscd:
 *               type: string
 *               description: 6-digit passcode
 *               example: "123456"
 *     responses:
 *       200:
 *         description: Passcode set successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                   description: Status of the request
 *                 message:
 *                   type: string
 *                   description: Success message
 *       400:
 *         description: Missing or invalid parameters
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                   description: Status of the request
 *                 message:
 *                   type: string
 *                   description: Error message
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                   description: Status of the request
 *                 message:
 *                   type: string
 *                   description: Error message
 */
const validateParams = async (req, res, next) => {
    const user = req.tokenUser;
    const urs_id = user.id;
    const { pscd,} = req.body;

    // Check if all parameters are provided and not empty
    if (!pscd) {
        return res.status(400).json({ status: false, message: 'Missing required parameters' });
    }

    const valiPin = pin =>{
        const pinPattern = /^\d{6}$/;
        return pinPattern.test(pin);
    }
    if (!valiPin(pscd))
        return res.status(400).json({ status: false, message: 'Invalid passcode' });

    try {
        const spuser = new Sharppay_user(user.email);
        await spuser.getInfo();
        console.log(spuser);
        if(valiPin(spuser.passcode)){
            return res.status(400).json({ status: false, message: 'Passcode already set' });
        }
    } catch (err) {
        //console.log(err);
        return res.status(500).json({ status: false, message: 'Server error 5501' });
    }
    next();
};
setPasscodeRoute.post("/setpasscode",verifyToken,validateParams, async (req, res) => {
    const user = req.tokenUser;
    const urs_id = user.id;
    const { pscd,} = req.body;


    const sql = "UPDATE users SET pscd = ? WHERE id = ? "; 
    try{
        const conn  = await connnectDB().getConnection();
        const [resu] = await conn.query(sql, [pscd,urs_id]);

        if(resu){
            return res.status(200).json({ status: true, message: 'success' });
        }else{
            return res.status(500).json({ status: false, message: 'Action failed' });
        }
    }catch(err){
        return res.status(500).json({ status: false, message: 'Server error  5502' });
    }

});

module.exports = {
    setPasscodeRoute
}