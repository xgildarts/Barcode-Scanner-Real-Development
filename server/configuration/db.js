
const mysql = require('mysql2')

const connection = mysql.createPool({
    user: 'root',
    password: '',
    database: 'barcode_demontration'
})

connection.getConnection((err, conn) => {
    if(err) return console.log('Error: ' + err)
    console.log('Connected!')
})

module.exports = connection;