const http = require("http");
const express = require("express");
const cors = require("cors");
const app = express();
const imports = require("../modules/imports");
app.use(express.json());
app.use(cors());
const nodemailer = require("nodemailer");
const server = http.createServer(app);
const PORT = process.env.PORT || 5000;
const bcrypt = require('../modules/imports').bcryptMe;
const saltRounds = 10;
const Sharppay_user = require("../modules/user-model");
const { connect } = require("http2");
const jwt = require("jsonwebtoken");




app.post("/users/signup", async (req, res) => {
    const reqflow = {
        proceed: true,
        updateProceed: function (val) {
            this.proceed = val;
        }
    }
    const serverError = (mes = "Internal server error") => {
        res.status(500).json({ status: false, message: mes });
        reqflow.updateProceed(false);
        res.end();
        return;
    }
    const dbError1 = () => {
        serverError("Error connecting to database");
    }
    const dbError2 = () => {
        serverError("Error querying database");
    }
    console.log("Request gotten");
    const { email, firstName, lastName, phoneNumber, pswd, cpswd, reff } = req.body;
    const requirredAry = [
        [email, 'Email/username'],
        [firstName, "First Name "],
        [lastName, 'Last Name'],
        [phoneNumber, 'Phone Number'],
        [pswd, "Password"],
        [cpswd, "Confirmation Password"]];

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
        console.log("got user chk");
        const pool = await connnectDB.getConnection();
        // sql query to check if user exists 
        var sql = `SELECT * FROM users WHERE email = '${email}' `;

        const [result, fields] = await pool.query(sql);

        var len = result.length;
        if (len > 0) {
            var urs = result[0];
            if (urs['is_verified'] == 1) {
                res.status(200).json({
                    status: false,
                    message: "An account already exists with this email",
                    data: { proceed: 0 }
                });
                reqflow.updateProceed(false);
                return;
            } else {
                res.status(200).json({
                    status: false,
                    message: "An account with pending verification already exists with this email",
                    data: { proceed: 1 }
                });
                reqflow.updateProceed(false);
                return;
            }
        }
        console.log("got user chk end");
    } catch (err) {
        //
        dbError1();
        console.log(err);
        return;
    }

    if (!reqflow.proceed) {
        return;
    }
    // check if passwords match
    if (pswd !== cpswd) {
        res.status(400).json({ status: false, message: "Passwords do not match" });
        res.end();
        reqflow.updateProceed(false);
    }
    if (!reqflow.proceed) {
        return;
    }
    // function to ensure ref id doesn't exist 
    async function checkRef(ref) {
        return new Promise(async function (res, rej) {
            try {
                console.log("got to ref chk");
                if (!reqflow.proceed) {
                    res(false);
                }
                // create a pool connection
                const conn = await connnectDB.getConnection();

                //sql query 

                var sql = `SELECT * FROM users WHERE ref_code = '${ref}'`;
                const [result] = await conn.query(sql);

                if (result.length == 0) {
                    res(false);
                } else {
                    res(true);
                }

            } catch (err) {
                console.log("wheb checking 6 digs");
                dbError2();
                res(false);
            }
        })
    }

    const otp = imports.generateFourDigitNumber();
    const ursId = imports.generateLongCharUserID();
    var refId = imports.generateSixDigitNumber();
    const encryptedPassword = bcrypt.hash(pswd, saltRounds);
    var refExists = await checkRef(refId);
    while (refExists) {
        refId = imports.generateSixDigitNumber();
        console.log("got ref loop chk");
        refExists = await checkRef(refId);
        console.log(refExists, "ref exists");
    }
    if (!reqflow.proceed) {
        return;
    }

    // insert query 
    try {
        console.log("got user insert");
        const connnectDB1 = await connnectDB.getConnection();
        //sql query to insert user
        var sql = `INSERT INTO users(id,email,lastN,firstN,phone,pswd,otp,ref_code,ref_by) VALUES('${ursId}','${email}','${lastName}','${firstName}','${phoneNumber}','${encryptedPassword}','${otp}','${refId}','${reff}')`;
        connnectDB1.query(sql).then(
            (x) => {
                res.status(200).json({ status: true, message: "Account succesfylly created please check your mail for verification code ", data: { process: 1 } });
                res.end();
                const defaultTransport = nodemailer.createTransport({
                    service: "gmail",
                    pool: true,
                    host: "rbx114.truehost.cloud", //<----change
                    port: 587 ,               //<----change
                    secure: false,           //<----change
                    auth: {
                         user: "support@sharppay.ticketmastermr.com",
                        pass: "#One1Two2."
                    },
                    name: "Sharp pay",
                    debug: true,
                    tls:{
                        rejectUnauthorized:false
                    }
                })
                let mailMes = `<h1>Welcome to sharppay</h1><br/><p>Hello ,${firstName} ${lastName} your verification code is <b>${otp}</b></p>`;
                defaultTransport.sendMail({
                    subject: "Account verification",
                    from: "tonynereus@gmail.com",
                    to: email,
                    //html: mailMes,
                    text: `Your code is ${otp}`
                }, (fail, success) => {
                    if (fail) {
                        console.log("error sending mail ", fail);
                    } else {
                        console.log(success.response, "Mail sent !");
                    }
                })
            }
        ).catch(
            (error) => {
                console.log(error);
                dbError2();
            }
        )
    } catch (err) {
        console.log("wheb inserting Q");
        console.log(err);
        dbError1();
    }
});
app.post("/users/resend-otp", async (req, res) => {
    console.log("otp req");
    const { email } = req.body;
    const connectDB = imports.connnectDB();
    try {
        //
        const pool = await connectDB.getConnection();
        const pool2 = await connectDB.getConnection();
        var newOtp = imports.generateFourDigitNumber();
        var sql = `UPDATE users SET otp = '${newOtp}', ogt = DEFAULT WHERE email = '${email}' `;
        pool2.query(sql).then(
            async (x) => {
                sql = `SELECT * FROM users WHERE email = '${email}'`;
                var [row, extra] = await pool.query(sql);
                var mes = "User not found";
                var status = false;
                if (row.length > 0) {
                    status = true;
                    mes = "OTP sent to "+email;
                    var user = row[0];
                    // extra check 
                    var otp = user['otp'];
                    console.log(otp);
                    var firstName = user['firstN'];
                    var lastName = user['lastN'];
                    let mailMes = `<h1>Welcome to sharppay</h1><br/><p>Hello ,${firstName} ${lastName} your verification code is <b>${otp}</b></p>`;
                    const defaultTransport = nodemailer.createTransport({
                        service: "gmail",
                        pool: true,
                        host: "rbx114.truehost.cloud", //<----change
                        port: 587 ,               //<----change
                        secure: false,           //<----change
                        auth: {
                            user: "support@sharppay.ticketmastermr.com",
                            pass: "#One1Two2."
                        },
                        debug: true,
                        tls:{
                            rejectUnauthorized:false
                        },
                        ignoreTLS:true
                    })
                    try{
                        const mailAns = await defaultTransport.sendMail({
                            subject: "Account verification",
                            from: {
                                name: "Sharp pay",
                                address: "info@sharppay.com"
                            },
                            to: email,
                            html: mailMes,
                        });
                        mes = mes +" "+mailAns.response;
                    }catch(err){
                        mes = "Not sent "+err;
                        status = false;
                    }
                }
                res.status(200).json({ status: status, message:mes });
            }
        ).catch(
            (err) => {
                console.log(err);
                res.status(500).json({ status: false, message: "Server error" });
            }
        )
    } catch (err) {
        console.log(err);
        res.status(500).json({ status: false, message: "Server error" });
    }

});
app.post("/users/verify-otp", async (req, res) => {
    const connectDB = imports.connnectDB;
    const reqflow = {
        proceed: true,
        updateProceed: function (val) {
            this.proceed = val;
        }
    }
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
        reqflow.updateProceed(false);
        return;
    } else if (user.isVerified) {
        res.status(201).json({ status: false, message: "This account has already been verified" });
        reqflow.updateProceed(false);
        return;
    } else if (!user.otpValid(otp)) {
        res.status(201).json({ status: false, message: "Invalid otp" });
        reqflow.updateProceed(false);
        return;
    } else {
        const newPool = connectDB();
        const conn = await newPool.getConnection();
        const sql = `UPDATE users SET is_verified = 1 WHERE email = '${email}'`;
        conn.query(sql).then(
            x => {
                res.status(200).json({ status: false, message: "Account successfully verified" });
            }
        ).catch(
            (err) => {
                reqflow.updateProceed(false);
                res.status(500).json({ status: false, message: "Error verifying account" });
                return;
            }
        )
    }

});
app.post("/users/signin", async (req, res) => {
    const connectDB = imports.connnectDB;
    const reqflow = {
        proceed: true,
        updateProceed: function (val) {
            this.proceed = val;
        }
    }
    const { pswd, email } = req.body;
    if (pswd == undefined || String(pswd).length < 4) {
        console.log(pswd);
        res.status(400).json({ status: false, message: "Invalid password sent", data: { proceed: 0 } });
        return;
    }
    if (email == undefined || String(email).length < 4) {
        res.status(400).json({ status: false, message: "Invalid Email sent", data: { proceed: 0 } });
        return;

    }
    const user = new Sharppay_user(email, pswd);
    await user.getInfo();
    if (user.error) {
        res.status(500).json({ status: false, message: user.errorMes });
        reqflow.updateProceed(false);
        return;
    } else if (!user.status) {
        res.status(201).json({ status: false, message: "Invalid login details", data: { proceed: 0 } });
        reqflow.updateProceed(false);
        return;
    } else if (!user.isVerified) {
        res.status(201).json({ status: false, message: "Account not verified.", data: { proceed: 1 } });
        reqflow.updateProceed(false);
        return;
    } else {
        const generateToken = (user) => {
            const token = jwt.sign({ id: user.id, email: user.email }, 'your_secret_key', { expiresIn: "72h" });
            return token;
        };
        const token = generateToken(user.data);
        res.status(200).json({ status: false, message: "Login Successful.", data: { ...user.data, proceed: 2 }, token: token });
        reqflow.updateProceed(false);
        return;
    }

});
app.get("/test/testapp", (req, res) => {
    res.status(200).json({ status: true, message: "Node js set for development !" });
    res.end();
})



server.listen(PORT, () => { console.log("running on port " + PORT) });
