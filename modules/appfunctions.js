const crypto = require('crypto');
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");
const connnectDB = require('./sqldb');

function generateLongCharUserID(length = 32) {
    return crypto.randomBytes(Math.ceil(length / 2))
        .toString('hex') // Convert to hexadecimal format
        .slice(0, length); // Trim to desired length
}
function generateTransactionRef(length = 10) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return "SP-" + result;
}
// Example usage:
const validParameter = (par, mes) => {
    if (par != undefined && par !== "") {
        return true
    }
    return `No valid ${mes} passed`;
}
function generateSixDigitNumber() {
    // Generate a random number between 100000 and 999999 (inclusive)
    return Math.floor(100000 + Math.random() * 900000);
}
function generateFourDigitNumber() {
    // Generate a random number between 1000 and 9999 (inclusive)
    return Math.floor(1000 + Math.random() * 9000);
}
const bcryptMe = {
    hash: function (password, salt = 10) {
        return btoa(password);
    },

    // Function to decode a password
    compare: function (pswd, encodedPassword) {
        return Boolean(pswd == atob(encodedPassword));
    }
}
const defaultTransport = nodemailer.createTransport({
    service: "gmail",
    pool: true,
    // host: "das102.truehost.cloud", //<----change
    port: 587,               //<----change
    auth: {
        user: "tonynereus@gmail.com",
        pass: "tzmrylxtxtmrcrcw"
        // user: "dev@tonyicon.com.ng",
        // pass: "#MillionOne1."
    },
})

function validateName(name) {
    const nameRegex = /^[A-Za-z\s]{2,50}$/;
    return nameRegex.test(name);
}

function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function validatePassword(password) {
    const errors = [];

    if (password.length < 8) {
        errors.push("Password must be at least 8 characters long.");
    }
    if (!/[a-z]/.test(password)) {
        errors.push("Password must contain at least one lowercase letter.");
    }
    if (!/[A-Z]/.test(password)) {
        errors.push("Password must contain at least one uppercase letter.");
    }
    if (!/\d/.test(password)) {
        errors.push("Password must contain at least one digit.");
    }
    if (!/[\W_]/.test(password)) {
        errors.push("Password must contain at least one special character.");
    }

    return {
        isValid: errors.length === 0,
        errors: errors
    };
}

const TokenVerify = (req, res, next, key) => {
    const token = req.headers['authorization'];

    if (!token) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
    const trySuperAdmin = () => {
        jwt.verify(token, process.env.SUPER_ADMIN_TOKEN, (err, decoded) => {
            if (err) {
                return res.status(403).json({ message: 'Invalid token' });
            }

            req.tokenUser = decoded;
            return next();
        });
    }
    jwt.verify(token, key, (err, decoded) => {
        if (err) {
            if (key == process.env.ADMIN_TOKEN) {
                return trySuperAdmin();
            } else {
                return res.status(403).json({ message: 'Invalid token' });
            }
        }

        req.tokenUser = decoded;
        next();
    });
}

const VerifySocketToken = (token)=>{
    var validated = false;
    const profile = {
        admin:false,
        user:{}
    }

    jwt.verify(token, process.env.SUPER_ADMIN_TOKEN, (err, decoded) => {
        if (err) 
            return
        profile.admin = true;
        profile.user = decoded
        validated = true;
    });
    jwt.verify(token, process.env.ADMIN_TOKEN, (err, decoded) => {
        if (err) 
            return
        profile.admin = true;
        profile.user = decoded
        validated = true;
    });
    jwt.verify(token,process.env.USER_TOKEN, (err, decoded) => {
        if (err) 
            return
        profile.admin = false;
        profile.user = decoded
        validated = true;
    });

    if(validated){
        return profile
    }else{
        throw new Error("Unauthorized");
    }
}

const verifyToken = (res, rej, next) => TokenVerify(res, rej, next, process.env.USER_TOKEN);
const verifyAdminToken = (res, rej, next) => TokenVerify(res, rej, next, process.env.ADMIN_TOKEN);
const verifySuperAdminToken = (res, rej, next) => TokenVerify(res, rej, next, process.env.SUPER_ADMIN_TOKEN);


const getAllAdmins = async () => {
    let conn;
    try {
         conn = connnectDB();
        const [rows] = await conn.query('SELECT id, name FROM admins');  // Adjust the query to fit your schema

        return rows;
    }catch(err){
        throw err;
    }finally{
        if(conn){conn.releaseConnection()}
    }
};

const fetchUsers = async () => {
    const conn = connnectDB();
    const pool = await conn.getConnection();
    
    try {
        const [result] = await pool.query(
            'SELECT u.id, u.email, u.lastN, u.firstN, u.is_verified,k.current_level AS level FROM users u LEFT JOIN kyc_status k ON u.id = k.user_id'
        );

        const users = result.map(user => {
            return {
                id: user.id,
                name: `${user.firstN} ${user.lastN}`,
                email: user.email,
                status: user.is_verified,
                kycLevel: user.level == null ? 0:user.level
            }
        })

        // Emit the users to connected admin clients
        return users;
    } catch (error) {
        throw error;
    } finally {
        conn.releaseConnection();
        pool.release();
    }
};



module.exports = {
    validParameter,
    generateSixDigitNumber,
    generateFourDigitNumber,
    generateLongCharUserID,
    generateTransactionRef,
    bcryptMe,
    defaultTransport,
    verifyToken,
    validateEmail,
    validatePassword,
    validateName,
    verifyAdminToken,
    verifySuperAdminToken,
    getAllAdmins,
    VerifySocketToken,
    fetchUsers

}