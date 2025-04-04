const { accRoute } = require("./account");
const { authRoute } = require("./auth");
const { TransactionRouter } = require("./transactions");

const Router = require("express").Router();

Router.use('/users',TransactionRouter);
Router.use("/users",authRoute);
Router.use("/users",accRoute);

module.exports = {
    usersRoute:Router
}