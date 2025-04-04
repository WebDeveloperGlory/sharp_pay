const { dataRoute } = require("./data");

const sharppayRoute = require("express").Router();

sharppayRoute.use("/sharppay",dataRoute);

module.exports = {
    sharppayRoute
}