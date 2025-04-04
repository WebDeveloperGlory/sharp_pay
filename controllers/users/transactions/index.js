const TransactionRouter = require("express").Router();

const buyCoin = require('./buyCoin');

const sellCoin = require("./sellCoin");
const { historyRoute } = require("./history");
const { depositCoinRoute } = require("./deposit-coin");
const { withdrawRoute } = require("./withdraw");
const { fundRoute } = require("./fund-wallet");

TransactionRouter.use('/',buyCoin);
TransactionRouter.use('/',sellCoin);
TransactionRouter.use('/',historyRoute);
TransactionRouter.use('/',depositCoinRoute);
TransactionRouter.use('/',withdrawRoute);
TransactionRouter.use('/',fundRoute);

module.exports = {
    TransactionRouter
}