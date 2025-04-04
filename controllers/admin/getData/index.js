const { getStatRoute } = require("./getStat");
const { getTransactionsRoute } = require("./getTransactions");
const { getUsersRoute } = require("./getUsers");
const { getKyc } = require("./kyc");

const getDataRoute = require("express").Router();


getDataRoute.use("/data",getStatRoute);
getDataRoute.use("/data",getTransactionsRoute);
getDataRoute.use("/data",getUsersRoute);
getDataRoute.use("/data",getKyc);


module.exports = {
    getDataRoute
}