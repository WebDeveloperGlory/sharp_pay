const { getCoinsRoute } = require("./getCoins");

const dataRoute = require("express").Router();

dataRoute.use('/',getCoinsRoute);

module.exports = {
    dataRoute
}