const connnectDB = require("./imports").connnectDB;
// const bcrypt = require("./imports").bcryptMe;
const bcrypt = require("bcrypt");
const saltRounds = 10;

class Sharppay_user {
    email = "";
    conn = connnectDB();
    isVerified = false; // if account is verified 
    isValid = false;  // if user with email exists 
    status = false;  // if password is verified and user actions can be performed
    error = false; // if any error occured with user info and action
    errorMes = undefined; //holds error message
    otp = null;
    data = {}
    password = undefined;
    passcode = undefined;
    pscd = undefined
    // other info
    constructor(email, password,passcode) {
        this.email = email;
        this.password = password;
        this.pscd = passcode
    }
    setVerified(ans) {
        typeof ans == "boolean" ? this.isVerified = ans : null;
    }
    setValid(ans) {
        typeof ans == "boolean" ? this.isValid = ans : null;
    }
    setStatus(ans) {
        typeof ans == "boolean" ? this.status = ans : null;
    }
    setData(obj) {
        typeof obj == "object" ? this.data = obj : null;
    }
    async getInfo() {
        return new Promise(async (res, rej) => {
            var pool = await this.conn.getConnection();
            var sql = `SELECT u.* , k.current_level AS level FROM users u LEFT JOIN kyc_status k ON u.id = k.user_id WHERE u.email = '${this.email}' `;
            try {
                var [rows, info] = await pool.query(sql);
                // console.log("Imm 3",rows);
                if (rows.length > 0) {
                    this.setValid(true);
                    const user = rows[0];
                    var pswd = user['pswd'];
                    this.passcode = user['pscd'];
                    sql = `SELECT w.balance , w.coin_id , w.wallet_id , c.coin_name , c.coin_abv , c.logoUrl , c.rate FROM user_wallets w INNER JOIN coins c ON w.coin_id = c.id WHERE w.user_id = '${user['id']}' `;
                    const [wallets,useless] = await pool.query(sql);
                    if (user[['is_verified']] == 1) {
                        this.setVerified(true);
                    }
                    const bsql = "SELECT bank_name , acc_name , acc_num FROM bank_acc_info WHERE urs_id = ?";
                    const [banks,useless1] = await pool.query(bsql,[user['id']]);
                    //console.log(this.password,"nd",pswd);
                    const pswdMatch = this.password ? await bcrypt.compare(this.password, pswd):false;
                    console.log(pswdMatch,"password match");
                    this.otp = user['otp'];
                    const obj = {
                        id:user['id'],
                        firstName:user['firstN'],
                        lastName:user['lastN'],
                        countryCode:user['countryCode'],
                        phone:user['phone'],
                        referralId:user['ref_code'],
                        referredBy:user['ref_by'] == 0 ? "":user['ref_by'],
                        balance:user['acc_bal'],
                        banks:banks,
                        wallets:wallets,
                        email:this.email,
                        kyc_level: user['level'] == null ? 0:user['level']
                    }
                    this.setData(obj);
                    if (pswdMatch) {
                        this.setStatus(true);
                    }else if(this.pscd == user['pscd'] && (this.pscd !== undefined || this.pscd !== '')){
                            //console.log("no sehh");
                            this.setStatus(true);
                        } 
                    else {
                        console.log(this.pscd,"mpascode");
                        this.setStatus(false);
                    }

                } else {
                    this.setValid(false);
                    this.setData({});
                    this.setVerified(false);
                }
                res(true);
            } catch (err) {
                this.error = true;
                console.log(err,"errr ");
                res(true);
            }finally{
                pool.release();
            }
        })
    }
    otpValid(otp = undefined) {
        console.log("hee", this.otp);
        if (otp != undefined && otp != null) {
            if (otp == this.otp && this.otp != null) {
                return true;
            } else {
                return false;
            }
        } else {
            return false;
        }
    }
}
module.exports = Sharppay_user;
