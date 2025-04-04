const route = require("express").Router();
const { verifyToken } = require("../../../modules/appfunctions");
const imports = require("../../../modules/imports");
const Sharppay_user = require("../../../modules/user-model");

/**
 * @swagger
 * /users/get-account-details:
 *   get:
 *     summary: Get user account details
 *     description: Retrieve details of the user's account
 *     responses:
 *       '200':
 *         description: Successful response with user account details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                   description: Indicates the status of the response
 *                 data:
 *                   type: object
 *                   properties:
 *                     userId:
 *                       type: string
 *                       description: The ID of the user
 *                     email:
 *                       type: string
 *                       description: The email address of the user
 * 
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
 *                   description: Error message indicating server error
 */

route.get("/get-account-details",verifyToken ,async (req,res)=>{
    const user = req.tokenUser;
    const spuser = new Sharppay_user(user.email);
    await spuser.getInfo();
    if (spuser.isValid) {
        res.status(200).json(spuser.data);
    } else {
        res.status(500).json({ status: false, message: "Server error" });
    }
})

module.exports = route;