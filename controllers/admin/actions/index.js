const { updateKycStatus } = require("./kycAction");
const { manageAdminRoute } = require("./manageAdmin");
const { transactionActionRoute } = require("./transactionAction");

const actionsRoute = require("express").Router();

actionsRoute.use("/actions",transactionActionRoute);
actionsRoute.use("/actions",manageAdminRoute);
actionsRoute.use("/actions",updateKycStatus);

module.exports = {
    actionsRoute
}