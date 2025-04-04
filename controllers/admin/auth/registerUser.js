const connnectDB = require("../../../modules/sqldb");
const jwt = require("jsonwebtoken");
// const bcryptMe = require("bcrypt");
const { bcryptMe } = require("../../../modules/appfunctions");
const { validatePassword, validateEmail, validateName, verifySuperAdminToken } = require("../../../modules/appfunctions");


const registerAdminRoute = require("express").Router();

registerAdminRoute.post("/register",verifySuperAdminToken,async (req,res)=>{
    const {email,pswd,name} = req.body;
    const validPswd = validatePassword(pswd);
    if(!validPswd.isValid)
        return res.status(400).json({status:false,message:validPswd.errors[0]});

    if(!validateEmail(email))
        return res.status(400).json({status:false,message:"Invalid email sent"});

    if(!validateName(name))
        return res.status(400).json({status:false,message:"Invalid name sent"});


    try{
        const pool = await connnectDB().getConnection();
        const [users] = await pool.query("SELECT * FROM admins WHERE email = ?",[email]);
        if(users.length > 0)
            return res.status(400).json({status:false,message:"Admin already exists with this email address"});
       
        const hashedPswd = await bcryptMe.hash(pswd,10);
        await pool.query("INSERT INTO admins( name , email , pswd) VALUES(? , ? , ? )",[name,email,hashedPswd]);

        pool.release();
        return res.status(201).json({status:true,message:`Admin successfully registered`});
    }catch(e){
        console.log("catch error ",e);
        return res.status(500).json({status:false,message:`Internal server error`});
    }
})

module.exports = {
    registerAdminRoute
}