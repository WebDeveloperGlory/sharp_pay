const { verifyAdminToken } = require("../../../modules/appfunctions");
const { baseUrl } = require("../../../modules/imports");
const connnectDB = require("../../../modules/sqldb");

const getKyc = require("express").Router();

getKyc.get("/kyc", verifyAdminToken, async (req, res) => {
    let pool;
    try {
        pool = await connnectDB().getConnection();
        const sql = `SELECT k.* , u.email,u.lastN,u.firstN FROM  kyc_status k LEFT JOIN users u ON k.user_id = u.id `;

        // get kycs 
        const [kycs] = await pool.query(sql);
        if (kycs)
            return res.status(200).json({ status: true, data: kycs });
        throw new Error("Error getting data");
    } catch (err) {
        console.log(err);
        return res.status(500).json({ status: false, message: err || "Error getting data" });
    } finally {
        if (pool) { pool.release(); }
    }
});


getKyc.get("/kyc/details/:userId/:level", verifyAdminToken, async (req, res) => {
    const { userId, level } = req.params;
    let pool;
    try {
        pool = await connnectDB().getConnection();
        let sql;

        // Construct the SQL query based on the level
        switch (parseInt(level)) {
            case 1:
                sql = "SELECT * FROM kyc_level_1 WHERE user_id = ?";
                break;
            case 2:
                sql = "SELECT * FROM kyc_level_2 WHERE user_id = ?";
                break;
            case 3:
                sql = "SELECT * FROM kyc_level_3 WHERE user_id = ?";
                break;
            default:
                throw new Error("Invalid KYC level");
        }

        const [kycDetails] = await pool.query(sql, [userId]);
        if (kycDetails.length) {
            const targetDetail = kycDetails[0];

            if(level == 2) {
                targetDetail.passport_image_url = baseUrl + targetDetail.passport_image_url
                targetDetail.id_card_image_url = baseUrl + targetDetail.id_card_image_url
            }

            if(level == 3) {
                targetDetail.bill_image_url = baseUrl + targetDetail.bill_image_url
            }

            return res.status(200).json({ status: true, data: targetDetail });
        }
        throw new Error("No KYC details found for this user at this level");
    } catch (err) {
        console.log(err);
        return res.status(500).json({ status: false, message: err.message || "Error getting KYC details" });
    } finally {
        if (pool) pool.release();
    }
});

module.exports = {
    getKyc
}