const express = require('express');
const { verifyToken } = require("../../../modules/appfunctions");
const { connnectDB } = require("../../../modules/imports");
const multer = require('multer');

const kycRoute = express.Router();

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/'); // Ensure this directory exists
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB limit per file
    fileFilter: function (req, file, cb) {
        // Accept only certain file types (e.g., JPEG, PNG)
        if (!file.mimetype.match(/^image\/(jpeg|png)$/)) {
            return cb(new Error('Only .jpeg and .png files are allowed!'), false);
        }
        cb(null, true);
    }
}).fields([{ name: 'passportImage' }, { name: 'idCardImage' }]);

const upload2 = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB limit per file
    fileFilter: function (req, file, cb) {
        // Accept only certain file types (e.g., JPEG, PNG)
        if (!file.mimetype.match(/^image\/(jpeg|png)$/)) {
            return cb(new Error('Only .jpeg and .png files are allowed!'), false);
        }
        cb(null, true);
    }
}).single('billImage'); // Only one file for Level 3


/**
 * @swagger
 * /users/kyc/level-1:
 *   post:
 *     summary: Submit KYC Level 1 information
 *     description: Submit user's basic information to upgrade to KYC Level 1.
 *     tags:
 *       - KYC
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               gender:
 *                 type: string
 *               dateOfBirth:
 *                 type: string
 *                 format: date
 *     responses:
 *       200:
 *         description: Level 1 KYC submitted successfully.
 *       400:
 *         description: Bad request.
 *       500:
 *         description: Internal Server Error.
 */
kycRoute.post('/kyc/level-1', verifyToken, async (req, res) => {
    const userId = req.tokenUser.id;
    const { firstName, lastName, gender, dateOfBirth } = req.body;

    if(String(firstName).length < 3 || String(lastName).length <3)
        return res.status(400).json({status:false,message:"Invalid name provided"});

    if(!['male','female'].includes(String(gender).toLocaleLowerCase()))
        return res.status(400).json({status:false,message:"Invalid gender provided"});

    let pool;
    
    try {
        pool = await connnectDB().getConnection();
        // Check if there's a pending or approved request
        const [existingStatus] = await pool.query("SELECT current_level, level_1_status FROM kyc_status WHERE user_id = ?", [userId]);
        if (existingStatus[0]?.current_level > 0 || existingStatus[0]?.level_1_status === 0) {
            return res.status(400).json({ status: false, message: "You already have a pending or approved Level 1 KYC request." });
        }
        await pool.beginTransaction();

        const inserted = await pool.query("INSERT INTO kyc_level_1 (user_id, first_name, last_name, gender, date_of_birth) VALUES (?, ?, ?, ?, ?)", 
            [userId, firstName, lastName, gender, dateOfBirth]);

        const inseted_kyc = await pool.query("INSERT INTO kyc_status (user_id, current_level, level_1_status) VALUES (?, 0, 0) ON DUPLICATE KEY UPDATE level_1_status = 0, updated_at = NOW()", 
            [userId]);

        if(!inserted || !inseted_kyc){
            throw new Error("db error 5022");
        }

        await pool.commit();

        res.status(200).json({ status: true, message: "Level 1 KYC submitted successfully. Awaiting approval." });
    } catch (err) {
        await pool.rollback();
        console.error("Error: ", err);
        res.status(500).json({ status: false, message: err || "Internal Server Error" });
    } finally {
        if(pool){
            pool.release();
        }
    }
});


/**
 * @swagger
 * /users/kyc/level-2:
 *   post:
 *     summary: Submit KYC Level 2 information
 *     description: Submit user's passport and ID card images to upgrade to KYC Level 2.
 *     tags:
 *       - KYC
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               passportImage:
 *                 type: string
 *                 format: binary
 *               idCardImage:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Level 2 KYC submitted successfully.
 *       400:
 *         description: Bad request.
 *       500:
 *         description: Internal Server Error.
 */
kycRoute.post('/kyc/level-2', verifyToken, (req, res) => {
    upload(req, res, async function (err) {
        if (err instanceof multer.MulterError) {
            // Multer-specific errors
            return res.status(400).json({ status: false, message: `Multer error: ${err.message}` });
        } else if (err) {
            // Other errors
            return res.status(400).json({ status: false, message: `File upload error: ${err.message}` });
        }

        const userId = req.tokenUser.id;

        // Ensure both files are uploaded
        if (!req.files || !req.files['passportImage'] || !req.files['idCardImage']) {
            return res.status(400).json({ status: false, message: "Both passport image and ID card image are required." });
        }

        const passportImage = req.files['passportImage'][0];
        const idCardImage = req.files['idCardImage'][0];

        const passportImageUrl = `/uploads/${passportImage.filename}`;
        const idCardImageUrl = `/uploads/${idCardImage.filename}`;

        let pool;

        try {
            pool = await connnectDB().getConnection();
            // Check if Level 1 is approved and no pending Level 2 request
            const [existingStatus] = await pool.query("SELECT current_level, level_2_status FROM kyc_status WHERE user_id = ?", [userId]);
            if (existingStatus[0]?.current_level < 1 || existingStatus[0]?.level_2_status === 0) {
                return res.status(400).json({ status: false, message: "You need to complete and get approval for Level 1 before submitting Level 2." });
            }

            await pool.beginTransaction();

            // Insert KYC level 2 data
            const insertedQry = await pool.query("INSERT INTO kyc_level_2 (user_id, passport_image_url, id_card_image_url) VALUES (?, ?, ?)", 
                [userId, passportImageUrl, idCardImageUrl]);

            // Update KYC status
            const updatedQry = await pool.query("UPDATE kyc_status SET level_2_status = 0, updated_at = NOW() WHERE user_id = ?", 
                [userId]);
            
            if(!insertedQry || !updatedQry){
                throw new Error("db error 5022");
            }

            await pool.commit();

            res.status(200).json({ status: true, message: "Level 2 KYC submitted successfully. Awaiting approval." });
        } catch (err) {
            await pool.rollback();
            console.error("Error: ", err);
            res.status(500).json({ status: false, message: err || "Internal Server Error" });
        } finally {
            if(pool){
                pool.release();
            }
        }
    });
});


/**
 * @swagger
 * /users/kyc/level-3:
 *   post:
 *     summary: Submit KYC Level 3 information
 *     description: Submit user's address and bill image to upgrade to KYC Level 3.
 *     tags:
 *       - KYC
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               address:
 *                 type: string
 *               city:
 *                 type: string
 *               state:
 *                 type: string
 *               postalCode:
 *                 type: string
 *               country:
 *                 type: string
 *               billImage:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Level 3 KYC submitted successfully.
 *       400:
 *         description: Bad request.
 *       500:
 *         description: Internal Server Error.
 */
kycRoute.post('/kyc/level-3', verifyToken, (req, res) => {
    upload2(req, res, async function (err) {
        if (err instanceof multer.MulterError) {
            // Multer-specific errors
            return res.status(400).json({ status: false, message: err.message });
        } else if (err) {
            // Other errors
            return res.status(400).json({ status: false, message: err.message || "Error handling upload."});
        }

        const userId = req.tokenUser.id;
        const { address, city, state, postalCode, country } = req.body;

        // Check if the required fields are present
        if (!address || !city || !state || !postalCode || !country) {
            return res.status(400).json({ status: false, message: "All address fields are required." });
        }

        if (!req.file) {
            return res.status(400).json({ status: false, message: "An electronic bill image is required." });
        }

        const billImageUrl = `/uploads/${req.file.filename}`;

        let pool;

        try {
            pool= await connnectDB().getConnection();
            // Check if Level 2 is approved and no pending Level 3 request
            const [existingStatus] = await pool.query("SELECT current_level, level_3_status FROM kyc_status WHERE user_id = ?", [userId]);
            if (existingStatus[0]?.current_level < 2 || existingStatus[0]?.level_3_status === 0) {
                return res.status(400).json({ status: false, message: "You need to complete and get approval for Level 2 before submitting Level 3." });
            }

            await pool.beginTransaction();

            // Insert KYC level 3 data
            const insertedQry = await pool.query(
                "INSERT INTO kyc_level_3 (user_id, address, city, state, postal_code, country, bill_image_url) VALUES (?, ?, ?, ?, ?, ?, ?)", 
                [userId, address, city, state, postalCode, country, billImageUrl]
            );

            // Update KYC status
            const updatedQry = await pool.query("UPDATE kyc_status SET level_3_status = 0, updated_at = NOW() WHERE user_id = ?", [userId]);

            if(!insertedQry || !updatedQry){
                throw new Error("db error 5022");
            }

            await pool.commit();
            res.status(200).json({ status: true, message: "Level 3 KYC submitted successfully. Awaiting approval." });
        } catch (err) {
            await pool.rollback();
            console.error("Error: ", err);
            res.status(500).json({ status: false, message: err || "Internal Server Error" });
        } finally {
            if(pool){pool.release()};
        }
    });
});

module.exports = {
    kycRoute
};
