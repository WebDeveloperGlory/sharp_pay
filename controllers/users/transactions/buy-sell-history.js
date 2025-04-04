const route = require("express").Router();
const {connnectDB} = require("../../../modules/imports");
const Sharppay_user = require("../../../modules/user-model");
const { verifyToken } = require("../../../modules/appfunctions");

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

route.get("/buy-sell-history",verifyToken,async (req,res)=>{
    const user = req.tokenUser;
   
    //const history = [];
    
    const qryPar  = "t.ref_id AS id,t.coin_id,t.coin_amo,t.usd_amo,t.ngn_amo,t.tns_rate,t.usd_rate,t.tns_type,t.stat,t.created_at"
    const sql = `SELECT ${qryPar} , c.coin_name ,c.coin_abv, c.minDeposit FROM transactions t INNER JOIN coins c ON t.coin_id = c.id  WHERE t.urs_id = ?`;
    try{
       const pool = await connnectDB().getConnection();
       const [tnsH] = await pool.query(sql,[user.id]);

       const history = tnsH.map(th =>{
        let obj =  {
            ...th,
            tns_type: th.tns_type == 1 ? "Buy":"sell"
        }
        return obj
       });
       res.status(200).json(history);

    }catch(err){
        console.log(err);
        res.status(500).json({status:false,message:"Server error 5502"});
    }
})

module.exports = route;