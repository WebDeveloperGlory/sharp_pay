const { adminRoutes } = require("./controllers/admin");
const { sharppayRoute } = require("./controllers/sharppay");
const { usersRoute } = require("./controllers/users");

const AppRouter = require("express").Router();

AppRouter.use("/",usersRoute);
AppRouter.use("/",adminRoutes);
AppRouter.use("/",sharppayRoute);

module.exports = {
    AppRouter
}