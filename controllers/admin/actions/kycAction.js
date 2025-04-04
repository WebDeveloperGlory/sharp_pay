const express = require("express");
const { verifyAdminToken } = require("../../../modules/appfunctions");
const connectDB = require("../../../modules/sqldb");

const updateKycStatus = express.Router();

const validLevels = [1, 2, 3];

// Route for approving KYC
updateKycStatus.post("/kyc/approve", verifyAdminToken, async (req, res) => {
    const { userId, level } = req.body;
    if (!level || !userId)
        return res.status(400).json({ status: false, message: "Invalid parameters passed" });

    if (!validLevels.includes(Number(level)))
        return res.status(400).json({ status: false, message: "Invalid level parameters passed" });

    let pool;
    try {
        pool = await connectDB().getConnection();

        const tableName = `kyc_level_${level}`;

        const checkValiditySql = `SELECT * FROM ${tableName} WHERE user_id = ? AND status = 1`;

        const [validated] = await pool.query(checkValiditySql, [userId]);

        if (validated.length > 0)
            return res.status(400).json({ status: false, message: "This kyc level has already been approved" });

        let updateStatusSql, updateKycStatusSql;
        // Construct SQL queries based on the level
        await pool.beginTransaction();
        switch (parseInt(level)) {
            case 1:
                updateStatusSql = "UPDATE kyc_level_1 SET status = ? WHERE user_id = ?";
                updateKycStatusSql = "UPDATE kyc_status SET level_1_status = ? , current_level = 1 WHERE user_id = ?";
                break;
            case 2:
                updateStatusSql = "UPDATE kyc_level_2 SET status = ? WHERE user_id = ?";
                updateKycStatusSql = "UPDATE kyc_status SET level_2_status = ? , current_level = 2 WHERE user_id = ?";
                break;
            case 3:
                updateStatusSql = "UPDATE kyc_level_3 SET status = ? WHERE user_id = ?";
                updateKycStatusSql = "UPDATE kyc_status SET level_3_status = ? , current_level = 3 WHERE user_id = ?";
                break;
            default:
                throw new Error("Invalid KYC level");
        }

        const [res1] =  await pool.query(updateStatusSql, [1, userId]);
        const [res2] = await pool.query(updateKycStatusSql, [1, userId]);

        if(res1 && res2){
            await pool.commit();
            return res.status(200).json({ status: true, message: "KYC approved successfully" });
        }else{
            throw new Error("Error updating Kyc");
        }


    } catch (err) {
        console.log(err);
        await pool.rollback();
        return res.status(500).json({ status: false, message: err.message || "Error approving KYC" });
    } finally {
        if (pool) pool.release();
    }
});

// Route for rejecting KYC
updateKycStatus.post("/kyc/reject", verifyAdminToken, async (req, res) => {
    const { userId, level } = req.body;

    if (!level || !userId)
        return res.status(400).json({ status: false, message: "Invalid parameters passed" });

    if (!validLevels.includes(Number(level)))
        return res.status(400).json({ status: false, message: "Invalid level parameters passed" });

    let pool;
    try {
        pool = await connectDB().getConnection();

        const tableName = `kyc_level_${level}`;

        const checkValiditySql = `SELECT * FROM ${tableName} WHERE user_id = ? AND status = 1`;

        const [validated] = await pool.query(checkValiditySql, [userId]);

        if (validated.length > 0)
            return res.status(400).json({ status: false, message: "This kyc level has already been approved" });

        let deleteKycSql, updateKycStatusSql;

        // Construct SQL queries based on the level
        switch (parseInt(level)) {
            case 1:
                deleteKycSql = "DELETE FROM kyc_level_1 WHERE user_id = ?";
                updateKycStatusSql = "UPDATE kyc_status SET level_1_status = ? WHERE user_id = ?";
                break;
            case 2:
                deleteKycSql = "DELETE FROM kyc_level_2 WHERE user_id = ?";
                updateKycStatusSql = "UPDATE kyc_status SET level_2_status = ? WHERE user_id = ?";
                break;
            case 3:
                deleteKycSql = "DELETE FROM kyc_level_3 WHERE user_id = ?";
                updateKycStatusSql = "UPDATE kyc_status SET level_3_status = ? WHERE user_id = ?";
                break;
            default:
                throw new Error("Invalid KYC level");
        }

        await pool.query(deleteKycSql, [userId]);
        await pool.query(updateKycStatusSql, [null, userId]);

        return res.status(200).json({ status: true, message: "KYC rejected and data deleted successfully" });

    } catch (err) {
        console.log(err);
        return res.status(500).json({ status: false, message: err.message || "Error rejecting KYC" });
    } finally {
        if (pool) pool.release();
    }
});

module.exports = {
    updateKycStatus
};
