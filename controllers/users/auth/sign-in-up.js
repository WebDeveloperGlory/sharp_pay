const sgin_in_up_route = require("express").Router();

const imports = require("../../../modules/imports");
const { mailOtp } = require("../../../modules/mailer");
const Sharppay_user = require("../../../modules/user-model");
const bcrypt = imports.bcryptMe;
const saltRounds = 10;
const jwt = require('jsonwebtoken');


sgin_in_up_route.post("/signin", async (req, res) => {
    const { pswd, email } = req.body;
    if (pswd == undefined || String(pswd).length < 4)
        return res.status(400).json({ status: false, message: "Invalid password sent", data: { proceed: 0 } });

    if (email == undefined || String(email).length < 4)
        return res.status(400).json({ status: false, message: "Invalid Email sent", data: { proceed: 0 } });


    try {
        const user = new Sharppay_user(email, pswd);
        await user.getInfo();
        if (user.error) {
            res.status(500).json({ status: false, message: user.errorMes });
            return;
        } else if (!user.status) {
            res.status(201).json({ status: false, message: "Invalid login details", data: { proceed: 0 } });
            return;
        } else if (!user.isVerified) {
            res.status(201).json({ status: false, message: "Account not verified.", data: { proceed: 1 } });
            return;
        } else {
            const generateToken = (user) => {
                const token = jwt.sign({ id: user.id, email: user.email }, process.env.USER_TOKEN, { expiresIn: "72h" });
                return token;
            };
            const token = generateToken(user.data);
            res.status(200).json({ status: true, message: "Login Successful.", data: { ...user.data, proceed: 2 }, token: token });
            return;
        }
    } catch (e) {
        console.log(e);
        return res.status(500).json({ status: false, message: "Internal server error" })
    }

});


sgin_in_up_route.post("/signup", async (req, res) => {

    console.log("Request gotten");
    const { email, firstName, lastName, countryCode, phoneNumber, pswd, cpswd, reff } = req.body;
    const requirredAry = [
        [email, 'Email/username'],
        [firstName, "First Name "],
        [lastName, 'Last Name'],
        [phoneNumber, 'Phone Number'],
        [pswd, "Password"],
        [cpswd, "Confirmation Password"],
        [countryCode, "Country Code"]
    ];

    // loop through required array to endure all parameters are present and not empty'
    for (var i = 0; i < requirredAry.length; i++) {
        var elm = requirredAry[i];
        var imp = imports.validParameter(elm[0], elm[1]);
        if (imp && typeof imp == "boolean") {
            continue;
        }
        res.status(400).json({ status: false, message: imp });
        return;
    }
    // additional parameter checks here 
    const connnectDB = imports.connnectDB();

    // try block to check if user exists 
    try {
        // create connection pool 
        const pool = await connnectDB.getConnection();
        // sql query to check if user exists 
        var sql = `SELECT * FROM users WHERE email = '${email}' `;

        const [result, fields] = await pool.query(sql);

        var len = result.length;
        if (len > 0) {
            var urs = result[0];
            if (urs['is_verified'] == 1) {
                return res.status(200).json({
                    status: false,
                    message: "An account already exists with this email",
                    data: { proceed: 0 }
                });
            } else {
                return res.status(200).json({
                    status: false,
                    message: "An account with pending verification already exists with this email",
                    data: { proceed: 1 }
                });
            }
        }
        pool.release();
    } catch (err) {
        return res.status(500).json({ status: false, message: "Internal server error" });
    }

    // check if passwords match
    if (pswd !== cpswd)
        return res.status(400).json({ status: false, message: "Passwords do not match" });
    // function to ensure ref id doesn't exist 
    async function checkRef(ref) {
        return new Promise(async function (res, rej) {
            try {
                console.log("got to ref chk");
                // create a pool connection
                const conn = await connnectDB.getConnection();

                //sql query 

                var sql = `SELECT * FROM users WHERE ref_code = '${ref}'`;
                const [result] = await conn.query(sql);
                conn.release();

                if (result.length == 0) {
                    res(false);
                } else {
                    res(true);
                }

            } catch (err) {
                rej(false);
            }
        })
    }
    const otp = imports.generateFourDigitNumber();
    const ursId = imports.generateLongCharUserID();
    var refId = imports.generateSixDigitNumber();
    const encryptedPassword = bcrypt.hash(pswd, saltRounds);
    try {
        var refExists = await checkRef(refId);
        while (refExists) {
            refId = imports.generateSixDigitNumber();
            console.log("got ref loop chk");
            refExists = await checkRef(refId);
            console.log(refExists, "ref exists");
        }
    } catch (e) {
        return res.status(500).json({ status: false, message: "Error processing referral " })
    }

    // insert query 
    let connnectDB1;
    try {
        //console.log("got user insert");
        connnectDB1 = await connnectDB.getConnection();
        connnectDB1.beginTransaction();
        //sql query to insert user
        var sql = `INSERT INTO users(id,email,lastN,firstN,countryCode,phone,pswd,otp,ref_code,ref_by) VALUES('${ursId}','${email}','${lastName}','${firstName}','${countryCode}','${phoneNumber}','${encryptedPassword}','${otp}','${refId}','${reff}')`;
        await connnectDB1.query(sql);

        const mailData = { firstN: firstName, lastN: lastName, otp: otp };

        await mailOtp(mailData);

        await connnectDB1.commit();

        res.status(200).json({ status: true, message: "Account succesfylly created please check your mail for verification code", data: { process: 1 } });

        console.log(success.response, "Mail sent !");
    } catch (err) {
        await connnectDB1.rollback();
        res.status(500).json({ status: false, message: err || "Account registration failed \" error 500. \" " });
    } finally {
        if (connnectDB1) { connnectDB1.release() }
    }
});

module.exports = {
    sgin_in_up_route
}