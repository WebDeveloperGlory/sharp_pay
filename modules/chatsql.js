const mysql2 = require("mysql2");

let pool;
const chatConnect = () => {
    if (!pool) {
        pool = mysql2.createPool({
            // host: "localhost",
            // user: "hlmpffgp_sharppay",
            // password: "rq(H&q+Wj!je",
            // database: "hlmpffgp_sharppay"
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASS,
            database: process.env.DB_NAME,
        }).promise();
    }

    return mysql2.createPool({
        // host: "localhost",
        // user: "hlmpffgp_sharppay",
        // password: "rq(H&q+Wj!je",
        // database: "hlmpffgp_sharppay"
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: process.env.DB_NAME,
    }).promise();
    // return pool;
}

module.exports = {
    chatConnect
}