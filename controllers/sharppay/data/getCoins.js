const getCoinsRoute = require("express").Router();
const imports = require("../../../modules/imports")

/**
 * @swagger
 * /sharppay/getcoins:
 *   get:
 *     summary: Get coins and their networks
 *     description: Retrieve a list of coins and their associated networks
 *     responses:
 *       '200':
 *         description: Successful response with list of coins and their networks
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                   description: Indicates the status of the response
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: number
 *                         description: The ID of the coin
 *                       name:
 *                         type: string
 *                         description: The name of the coin
 *                       networks:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                             network_id:
 *                               type: number
 *                               description: The ID of the network
 *                             network_name:
 *                               type: string
 *                               description: The name of the network
 */

getCoinsRoute.get("/getcoins",async (req,res)=>{
    try {
        const conn = imports.connnectDB();
        const pool = await conn.getConnection();
        const sql = "SELECT * FROM coins";
        const [result, qry] = await pool.query(sql);

        const ans = await Promise.all(result.map(async (cur) => {
            const sql2 = `SELECT * FROM coin_networks cn RIGHT JOIN networks nk ON cn.network_id = nk.id WHERE cn.coin_id = '${cur.id}' `;
            const [resu, qry] = await pool.query(sql2);
            cur.networks = resu;
            return cur;
        }));

        //console.log(ans, "ddd");
        res.status(200).json({ status: true, data: ans });

    } catch (err) {
        res.status(500).json({ status: false, message: "Server error" });
        console.log(err);
    }
})

module.exports = {
    getCoinsRoute
}