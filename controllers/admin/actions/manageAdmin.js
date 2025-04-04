const { validateEmail, validatePassword, verifySuperAdminToken, verifyAdminToken } = require("../../../modules/appfunctions");
const connnectDB = require("../../../modules/sqldb");
const bcrypt = require("bcrypt");

const manageAdminRoute = require("express").Router();

manageAdminRoute.post("/create-profile", verifySuperAdminToken ,async (req, res) => {
    const { email, pswd, name } = req.body;

    if (!email || !pswd || !name)
        return res.status(400).json({ status: false, message: "Please pass a valid email , password and name " });
    if (!validateEmail(email))
        return res.status(400).json({ status: false, message: "Invalid email" });

    const securePswd = validatePassword(pswd);

    if (!securePswd.isValid)
        return res.status(400).json({ status: false, message: securePswd.errors[0] });

    if (String(name).length < 3)
        return res.status(400).json({ status: false, message: "Name too short " });

    let pool;
    try {
        pool = await connnectDB().getConnection();

        const hashedPswd = await bcrypt.hash(pswd, 10);

        const [resu] = await pool.query("INSERT INTO admins(name,email,pswd,role) VALUES(? , ? , ?, 'Admin')", [name, email, hashedPswd]);

        if (resu)
            return res.status(200).json({ status: true, message: "Admin successfully created" });
        throw new Error("Failed to run query");
    } catch (err) {
        console.log(err);
        return res.status(500).json({ status: false, message: err || "Process failed" });
    } finally {
        if (pool) { pool.release(); }
    }
});

manageAdminRoute.get("/get-profiles", verifyAdminToken,async(req,res)=>{
    let pool;
    try{
        //
        pool = await connnectDB().getConnection();

        const [admins] = await pool.query("SELECT * FROM admins");

        res.status(200).json({status:true,data:admins});
    }catch(err){
        console.log(err);
        return res.status(500).json({ status: false, message: err || "failed to load team" });
    }finally{
        if(pool){pool.release();}
    }
});

manageAdminRoute.post('/switch-status',verifySuperAdminToken,async (req, res) => {
    const { userId, active } = req.body;
    const client = req.tokenUser;
    if (client.id == userId)
      return res.status(400).json({ status: false, message: "You cannot perform this action" });
    let connection;
    try {
      connection = await connnectDB().getConnection();
      await connection.beginTransaction();
  
      const deactivateQuery = 'UPDATE admins SET status = ? WHERE id = ?';
      const [result] = await connection.query(deactivateQuery, [active == 0 ? 1 : 0, userId]);
  
      if (result.affectedRows === 0) {
        throw new Error(   `Admin user not found or already ${active == 0 ? "activated" : "deactivated"}`);
      }
  
      await connection.commit();
      res.status(200).json({ status: true, message: `Admin user ${active == 0 ? "activated" : "deactivated"}  successfully.` });
    } catch (error) {
      console.error('Error deactivating admin user:', error);
      if (connection) await connection.rollback();
      res.status(500).json({ status: false, message: error.message || `Failed to ${active == 0 ? "activated" : "deactivated"} admin user.` });
    } finally {
      if (connection) connection.release();
    }
  });


manageAdminRoute.post('/delete-profile',verifySuperAdminToken,async (req, res) => {
    const { userId } = req.body;
    const client = req.tokenUser;
    if (client.id == userId)
      return res.status(400).json({ status: false, message: "You cannot perform this action" });
    let connection;
  
    try {
      connection = await connnectDB().getConnection();
  
      const [admin] = await connection.query("SELECT* FROM admins WHERE id = ?", [userId]);
  
      if (admin.length < 1)
        return res.status(400).json({ status: false, message: "Admin user not found or already deleted." });
  
      const target_admin = admin[0];
  
      await connection.beginTransaction();
      const adminData = [target_admin.id,
      target_admin.name,
      target_admin.email,
      target_admin.pswd,
      target_admin.role,
      ]
  
      const insetedQry = await connection.query("INSERT INTO deleted_admins(urs_id,name,email,pswd,role) VALUES(?,?,?,?,?)", adminData);
  
      const deleteQuery = 'DELETE FROM admins WHERE id = ?';
  
      const [result] = await connection.query(deleteQuery, [userId]);
  
      if (result.affectedRows === 0) {
        throw new Error('Failed');
      }
  
      await connection.commit();
      res.status(200).json({ status: true, message: 'Admin user deleted successfully.' });
    } catch (error) {
      console.error('Error deleting admin user:', error);
      if (connection) await connection.rollback();
      res.status(500).json({ status: false, message: error.message || 'Failed to delete admin user.' });
    } finally {
      if (connection) connection.release();
    }
  });

module.exports = {
    manageAdminRoute
}