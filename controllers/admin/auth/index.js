const { registerAdminRoute } = require("./registerUser");
const { adminSigninRoute } = require("./signin");

const authRoute = require("express").Router();

authRoute.use('/auth',adminSigninRoute);
authRoute.use('/auth',registerAdminRoute);

module.exports = {
    authRoute
}