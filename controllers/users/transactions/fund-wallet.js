const express = require("express");
const multer = require("multer");
const fundRoute = express.Router();
const { connnectDB } = require("../../../modules/imports");
const { verifyToken } = require("../../../modules/appfunctions");

// Multer storage configuration
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/'); // Adjust the destination as per your project structure
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + '-' + file.originalname);
    }
});

// Multer file filter to accept only images
const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('Invalid file type. Only images are allowed!'), false);
    }
};

// Multer upload configuration
const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: { fileSize: 1024 * 1024 * 5 } // 5 MB limit
}).single('transactionImage');

/**
 * @swagger
 * /users/fund-wallet:
 *   post:
 *     summary: Fund user wallet
 *     description: Insert a valid amount into the funding table with an optional transaction image
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               amount:
 *                 type: number
 *                 description: The amount to fund
 *                 example: 100.50
 *               transactionImage:
 *                 type: string
 *                 format: binary
 *                 description: The transaction image file
 *     responses:
 *       '200':
 *         description: Successful response with funding details
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
 *                   description: Error message indicating what went wrong
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

fundRoute.post("/fund-wallet", verifyToken, (req, res) => {
    upload(req, res, async (err) => {
        if (err instanceof multer.MulterError) {
            return res.status(400).json({ status: false, message: err.message });
        } else if (err) {
            return res.status(400).json({ status: false, message: err.message });
        }

        const user = req.tokenUser;
        const { amount } = req.body;

        if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
            return res.status(400).json({ status: false, message: "Invalid amount provided" });
        }

        const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;

        const sql = `INSERT INTO funding (urs_id, amount, image_url, stat, created_at, updated_at) VALUES (?, ?, ?, 0, NOW(), NOW())`;

        let pool ;
        try {
            pool = await connnectDB().getConnection();
            await pool.query(sql, [user.id, Math.round(amount), imageUrl]);

            res.status(200).json({ status: true, message: "Fund request initiated" });
        } catch (err) {
            console.log(err);
            res.status(500).json({ status: false, message: "Server error 5502" });
        } finally {
            if(pool){pool.release()};
        }
    });
});


/**
 * @swagger
 * /users/withdraw-naira-fund:
 *   post:
 *     summary: Withdraw funds from user's account
 *     description: Processes a withdrawal request from the user's account balance. Ensures the user has sufficient balance and the specified bank account exists for the user.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               amount:
 *                 type: number
 *                 description: The amount to withdraw
 *                 example: 1000.50
 *               bankAccId:
 *                 type: integer
 *                 description: The ID of the user's bank account to withdraw to
 *                 example: 1
 *     responses:
 *       '200':
 *         description: Successful withdrawal request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                   description: Indicates the success of the operation
 *                 message:
 *                   type: string
 *                   description: Message describing the outcome
 *       '400':
 *         description: Bad request response, possibly due to invalid amount, insufficient balance, or invalid bank account
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                   description: Indicates the failure of the operation
 *                 message:
 *                   type: string
 *                   description: Error message describing what went wrong
 *       '500':
 *         description: Server error response
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                   description: Indicates the failure of the operation
 *                 message:
 *                   type: string
 *                   description: Error message indicating server error
 */

fundRoute.post('/withdraw-naira-fund', verifyToken, async (req, res) => {
    const { amount, bankAccId } = req.body;
    const userId = req.tokenUser.id;

    if (!amount || isNaN(amount) || amount <= 0) {
        return res.status(400).json({ status: false, message: "Invalid amount provided" });
    }

    const conn = connnectDB();
    const pool = await conn.getConnection();

    try {
        await pool.beginTransaction();

        // Verify the bank account exists for the user
        const [bankAccRows] = await pool.query(
            'SELECT * FROM bank_acc_info WHERE id = ? AND urs_id = ?',
            [bankAccId, userId]
        );

        if (bankAccRows.length === 0) {
            return res.status(400).json({ status: false, message: "Bank account not found" });
        }

        // Check if the user has sufficient balance
        const [userRows] = await pool.query('SELECT acc_bal FROM users WHERE id = ?', [userId]);
        const userBalance = userRows[0]?.acc_bal;

        if (userBalance < amount) {
            return res.status(400).json({ status: false, message: "Insufficient balance" });
        }

        // Deduct the amount from the user's balance
        const newBalance = userBalance - amount;
        await pool.query('UPDATE users SET acc_bal = ? WHERE id = ?', [newBalance, userId]);

        // Insert the withdrawal request into the naira_withdrawal table
        await pool.query(
            'INSERT INTO naira_withdrawal (urs_id, amount, bank_acc_id, stat, created_at, updated_at) VALUES (?, ?, ?, 0, NOW(), NOW())',
            [userId, amount, bankAccId]
        );

        await pool.commit();
        res.status(200).json({ status: true, message: "Withdrawal request placed successfully" });
    } catch (err) {
        await pool.rollback();
        console.error('Error:', err);
        res.status(500).json({ status: false, message: "Internal server error" });
    } finally {
        pool.release();
    }
});


module.exports = {
    fundRoute
};
