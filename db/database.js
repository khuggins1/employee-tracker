

require('dotenv').config();

const mysql = require('mysql2');


//CONNECTION
const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    port: 3306,
    user: process.env.DB_USER,
    password: process.env.DB_PW,
    database: process.env.DB_NAME
});


module.exports = connection;