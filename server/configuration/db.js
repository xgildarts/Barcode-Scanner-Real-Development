const mysql = require('mysql2')
require('dotenv').config();

const connection = mysql.createPool({
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    timezone: '+08:00',         // Philippine Standard Time (UTC+8)
    dateStrings: true           // Return DATE/TIME columns as strings, not JS Date objects
                                // Prevents UTC conversion shifting dates by -8 hours
})

connection.getConnection((err, conn) => {
    if(err) return console.log('Error: ' + err)
    console.log('Connected!')
})

module.exports = connection;