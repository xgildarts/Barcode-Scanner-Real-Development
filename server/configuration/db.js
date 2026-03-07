
const mysql = require('mysql2')
require('dotenv').config();

const connection = mysql.createPool({
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
})

connection.getConnection((err, conn) => {
    if(err) return console.log('Error: ' + err)
    console.log('Connected!')
})

module.exports = connection;