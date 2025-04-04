const express = require("express");
const depositCoinRoute = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { connnectDB } = require("../../../modules/imports");
const { verifyToken } = require("../../../modules/appfunctions");

// Create uploads directory if it doesn't exist
const uploadDir = path.join(__dirname, "../../../uploads");
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer storage configuration
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname);
        cb(null, `${uniqueSuffix}${ext}`);
    }
});

// Multer file filter to accept only images
const fileFilter = (req, file, cb) => {
    const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (allowedMimeTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new multer.MulterError('LIMIT_UNEXPECTED_FILE', 'Invalid file type. Only JPEG, PNG, GIF, and WEBP images are allowed.'));
    }
};

// Multer upload configuration
const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 } // 5 MB limit
}).single('transactionImage');

// Endpoint to handle file upload and data insertion
depositCoinRoute.post('/deposit-coin', verifyToken, (req, res) => {
    upload(req, res, async (err) => {
        if (err instanceof multer.MulterError) {
            let message = 'File upload error';
            if (err.code === 'LIMIT_FILE_SIZE') {
                message = 'File size exceeds the 5MB limit';
            } else if (err.code === 'LIMIT_UNEXPECTED_FILE') {
                message = err.message;
            }
            return res.status(400).json({ status: false, message });
        } else if (err) {
            return res.status(400).json({ status: false, message: err.message });
        }

        try {
            if (!req.file) {
                return res.status(400).json({ status: false, message: 'Transaction image is required' });
            }

            // Extract data from request body
            const { coinId, networkId, transRef, amount } = req.body;

            // Input validation
            if (!coinId || !networkId || !transRef || !amount) {
                return res.status(400).json({ status: false, message: 'All fields are required: coinId, networkId, transRef, amount' });
            }

            if (isNaN(Number(amount)) || Number(amount) <= 0) {
                return res.status(400).json({ status: false, message: 'Amount must be a positive number' });
            }

            const userId = req.tokenUser.id;

            const conn = connnectDB();
            const pool = await conn.getConnection();
            await pool.beginTransaction();

            // Fetch wallet ID from user_wallets table
            const [walletRows] = await pool.query(
                'SELECT wallet_id, balance FROM user_wallets WHERE user_id = ? AND coin_id = ?',
                [userId, coinId]
            );

            if (walletRows.length === 0) {
                await pool.rollback();
                return res.status(400).json({ status: false, message: 'User wallet not found for the specified coin' });
            }

            const walletId = walletRows[0].wallet_id;

            // Fetch coin rate
            const [coinRows] = await pool.query('SELECT rate FROM coins WHERE id = ?', [coinId]);

            if (coinRows.length === 0) {
                await pool.rollback();
                return res.status(400).json({ status: false, message: 'Invalid coin ID' });
            }

            const rate = coinRows[0].rate;

            // Check if the coin_id and network_id exist in the coin_networks table
            const [networkRows] = await pool.query(
                'SELECT * FROM coin_networks WHERE coin_id = ? AND network_id = ?',
                [coinId, networkId]
            );

            if (networkRows.length === 0) {
                await pool.rollback();
                return res.status(400).json({ status: false, message: 'Invalid network for this currency' });
            }

            // Save the uploaded image URL
            const imageUrl = `/uploads/${req.file.filename}`;

            // Insert data into deposits table
            await pool.query(
                'INSERT INTO deposits (user_id, trans_ref, coin_id, network_id, trans_img, amount, trans_rate, stat) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
                [userId, transRef, coinId, networkId, imageUrl, amount, rate, 0]
            );

            await pool.commit();
            res.status(200).json({ status: true, message: 'Deposit request submitted successfully' });
        } catch (error) {
            console.error('Error:', error);
            if (pool) await pool.rollback();
            res.status(500).json({ status: false, message: 'Internal server error' });
        }
    });
});

module.exports = {
    depositCoinRoute
};
