const mysql2 = require("mysql2");

const connnectDB = () => {
    return mysql2.createPool({
        // host: "localhost",
        // user: "hlmpffgp_sharppay",
        // password: "rq(H&q+Wj!je",
        // database: "hlmpffgp_sharppay"
        host: process.env.DB_HOST_2,
        user: process.env.DB_USER_2,
        password: process.env.DB_PASS_2,
        database: process.env.DB_NAME_2,
        port: process.env.DB_PORT_2,
        connectTimeout: 10000, // 10 seconds
    }).promise();
}

module.exports = connnectDB;
