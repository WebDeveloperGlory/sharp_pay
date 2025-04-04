const imports = require("../../../modules/imports");
const { mailOtp } = require("../../../modules/mailer");
const Sharppay_user = require("../../../modules/user-model");
const jwt = require("jsonwebtoken");
const otpRouter = require("express").Router();


otpRouter.post("/resend-otp", async (req, res) => {
    console.log("otp req");
    const { email } = req.body;
    const connectDB = imports.connnectDB();
    let pool;
    try {
        //
        pool = await connectDB.getConnection();
        var newOtp = imports.generateFourDigitNumber();
        var sql = `UPDATE users SET otp = '${newOtp}', ogt = DEFAULT WHERE email = '${email}' `;

        await pool.query(sql);

        sql = `SELECT * FROM users WHERE email = '${email}'`;
        var [row] = await pool.query(sql);
        if (row.length < 1 )
            throw new Error("Internal Server error");

        var user = row[0];
        await mailOtp(user);
        res.status(200).json({ status: true, message: "OTP sent" });
    } catch (err) {
        console.log(err);
        res.status(500).json({ status: false, message: err || "Server error" });
    }finally{
        if(pool){pool.release();}
    }

});


otpRouter.post("/verify-otp", async (req, res) => {
    const connectDB = imports.connnectDB();
    const { otp, email } = req.body;
    if (otp == undefined || String(otp).length !== 4) {
        res.status(400).json({ status: false, message: "Invalid OTP sent" });
        return;
    }
    if (email == undefined || String(email).length < 4) {
        res.status(400).json({ status: false, message: "Invalid Email sent" });
        return;

    }
    const user = new Sharppay_user(email, "");
    await user.getInfo();
    if (user.error) {
        res.send(500).json({ status: false, message: user.errorMes });
        return;
    } else if (user.isVerified) {
        res.status(201).json({ status: false, message: "This account has already been verified" });
        return;
    } else if (!user.otpValid(otp)) {
        res.status(201).json({ status: false, message: "Invalid otp" });
        return;
    } else {
        const pool = await connectDB.getConnection();
        try {
            await pool.beginTransaction();
            async function generateWalletAddress() {
                const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
                let walletAddress = '';
                for (let i = 0; i < 36; i++) {
                    walletAddress += characters.charAt(Math.floor(Math.random() * characters.length));
                }
                return walletAddress;
            }
            async function getCoins() {
                const [rows] = await pool.query('SELECT id FROM coins');
                return rows.map(row => row.id);
            }
            async function checkWalletExists(walletAddress) {
                const [rows] = await pool.query('SELECT wallet_id FROM user_wallets WHERE wallet_id = ?', [walletAddress]);
                return rows.length > 0;
            }

            async function insertIntoUserWallets(userId, coinId, walletAddress) {
                await pool.query('INSERT INTO user_wallets (user_id, coin_id, wallet_id) VALUES (?, ?, ?)', [userId, coinId, walletAddress]);
            }

            const coinIds = await getCoins();

            for (const coinId of coinIds) {
                let walletAddress;
                do {
                    walletAddress = await generateWalletAddress();
                } while (await checkWalletExists(walletAddress));

                var userId = user.data.id;
                await insertIntoUserWallets(userId, coinId, walletAddress);
                //console.log(`Inserted wallet for user ${userId}, coin ${coinId}: ${walletAddress}`);
            }


            const sql = `UPDATE users SET is_verified = 1 WHERE email = '${email}'`;

            await pool.query(sql);

            await pool.commit();

            const generateToken = (user) => {
                const token = jwt.sign({ id: user.id, email: user.email }, 'your_secret_key', { expiresIn: "72h" });
                return token;
            };

            const token = generateToken(user.data);

            await user.getInfo();


            res.status(200).json({ status: true, message: "Account successfully verified", data: { ...user.data, proceed: 2 }, token: token });


        } catch (error) {
            await pool.rollback();
            console.error('Error:', error);
            res.status(500).json({ status: false, message: "Error verifying account" });
        }
    }

});

module.exports = {
    otpRouter
}