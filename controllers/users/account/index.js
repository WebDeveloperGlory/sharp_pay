const getAccountDetails = require("./accountDetails");
const addBankAccount = require("./add-bank");
const { kycRoute } = require("./kyc");

const accRoute = require("express").Router();

accRoute.use("/",getAccountDetails);
accRoute.use("/",addBankAccount);
accRoute.use("/",kycRoute);


module.exports = {
    accRoute
}