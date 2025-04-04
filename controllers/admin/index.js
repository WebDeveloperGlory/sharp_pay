const { actionsRoute } = require("./actions");
const { authRoute } = require("./auth");
const { getDataRoute } = require("./getData");

const adminRoutes = require("express").Router();

adminRoutes.use("/admin",actionsRoute);
adminRoutes.use("/admin",getDataRoute);
adminRoutes.use("/admin",authRoute);

module.exports = {
    adminRoutes
}