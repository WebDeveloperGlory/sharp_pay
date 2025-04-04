const { validateEmail } = require("../../../modules/appfunctions");
const { sendAccountDeletionEmail } = require("../../../modules/mailer");
const Sharppay_user = require("../../../modules/user-model");

const deleteAccount = require("express").Router();

/**
 * @swagger
 * /users/delete-account:
 *   post:
 *     summary: Initiates account deletion process
 *     description: This endpoint allows users to request their account to be deleted. Upon successful verification of credentials, the user will receive an email to complete the account deletion process.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - pswd
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: User's registered email address
 *                 example: "user@example.com"
 *               pswd:
 *                 type: string
 *                 format: password
 *                 description: User's account password
 *                 example: "code1234"
 *     responses:
 *       200:
 *         description: Account deletion request processed successfully, user will receive an email for confirmation.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Request being processed, you will get a mail shortly to delete your account"
 *       400:
 *         description: Invalid parameters or credentials
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Invalid parameters"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Internal server error"
 */

deleteAccount.post("/delete-account",async (req,res)=>{
    const {email,pswd} = req.body;
    
    if(!email || !pswd)
        return res.status(400).json({status:false,message:"Invalid parameters"});

    if(!validateEmail(email))
        return res.status(400).json({status:false,message:"Invalid email"});

    const Suser = new Sharppay_user(email,pswd);

    try{
        await Suser.getInfo();
        const sData = Suser.data;
        if(Suser.error)
            return res.status(500).json({status:false,message:Suser.errorMes});

        if(!Suser.status)
            return res.status(400).json({status:false,message:"Invalid credentials"});

        const userInfo = {
            email:email,
            firstN:sData.firstName,
            lastN:sData.lastName,
        }
        await sendAccountDeletionEmail(userInfo);

        return res.status(200).json({status:false,message:"Request being processed you will get a mail shortly to delete your account"});
    }catch(err){
        console.log(err);
        return res.status(500).json({status:false,message:"Internal server error"});
    }
});

module.exports = {
    deleteAccount
}