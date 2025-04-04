const connnectDB = require("../../../modules/sqldb");
const jwt = require("jsonwebtoken");
const bcryptMe = require("bcrypt");


const adminSigninRoute = require("express").Router();

adminSigninRoute.post("/signin", async (req, res) => {
    const { email, pswd } = req.body;
    if (!email || !pswd)
        return res.status(400).json({ status: false, message: "Invalid data" });
    try {
        const pool = await connnectDB().getConnection();
        const [users] = await pool.query("SELECT * FROM admins WHERE email = ?", [email]) ;
        pool.release();
        if (users.length < 1)
            return res.status(400).json({ status: false, message: "Invalid user" });
        const user = users[0];
        const pswdMatch = await bcryptMe.compare(pswd, user['pswd']);
        if (!pswdMatch)
            return res.status(400).json({ status: false, message: "Invalid credentials" });
        const token = jwt.sign({ id: user['id'], email: user['email'] }, user.id == 1 ? process.env.SUPER_ADMIN_TOKEN : process.env.ADMIN_TOKEN);
        return res.status(201).json({ status: true, message: `Welcome ${user['name']}`, data:{token: token,name:user['name'],role:'Admin'} });
    } catch (e) {
        console.log("catch error ", e);
        return res.status(500).json({ status: false, message: `Internal server error` });
    }
})

module.exports = {
    adminSigninRoute
}