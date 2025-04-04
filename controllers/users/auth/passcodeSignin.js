const passcodeSigninRoute = require("express").Router();
const { connnectDB } = require("../../../modules/imports");
const Sharppay_user = require("../../../modules/user-model");
const jwt = require("jsonwebtoken");
/**
 * @swagger
 * /users/signin/passcode:
 *   post:
 *     summary: Signin user with passcode 
 *     description: Allows a user to sign in with a 6-digit passcode.
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
 *             email:
 *               type: string
 *               description: valid email address
 *               example: "example@gmail.com"
 *             pscd:
 *               type: string
 *               description: 6-digit passcode
 *               example: "123456"
 *     responses:
 *       200:
 *         description: Signin with passcode  successful
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
 *                 data:
 *                   type: object
 *                   description: user  information 
 *                 token:
 *                   type: string
 *                   description: reqest  token
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
const validateParams = async (req, res) => {
    const { pscd,email} = req.body;

    // Check if all parameters are provided and not empty
    if (!pscd || !email) {
        return res.status(400).json({ status: false, message: 'Missing required parameters' });
    }

    const valiPin = pin =>{
        const pinPattern = /^\d{6}$/;
        return pinPattern.test(pin);
    }
    if (!valiPin(pscd))
        return res.status(400).json({ status: false, message: 'Invalid passcode' });

    try {
        const spuser = new Sharppay_user(email,"",pscd);
        await spuser.getInfo();
        console.log(spuser);
        

        if (spuser.error) {
            res.status(500).json({ status: false, message: user.errorMes });
            return;
        } else if (!spuser.status) {
            res.status(400).json({ status: false, message: "Invalid login details !!", data: { proceed: 0 } });
            return;
        } else if (!spuser.isVerified) {
            res.status(201).json({ status: false, message: "Account not verified.", data: { proceed: 1 } });
            return;
        } else {
            const generateToken = (user) => {
                const token = jwt.sign({ id: user.id, email: user.email }, process.env.USER_TOKEN, { expiresIn: "72h" });
                return token;
            };
            const token = generateToken(spuser.data);
            res.status(200).json({ status: true, message: "Login Successful.", data: { ...spuser.data, proceed: 2 }, token: token });
            return;
        }
    
    } catch (err) {
        console.log(err);
        return res.status(500).json({ status: false, message: 'Server error 5501' });
    }
};
passcodeSigninRoute.post("/signin/passcode", validateParams);

module.exports = {
    passcodeSigninRoute
}