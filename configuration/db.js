const mysql = require('mysql2')
require('dotenv').config();

const connection = mysql.createPool({
    host:              process.env.DB_HOST || 'localhost',
    user:              process.env.DB_USERNAME,
    password:          process.env.DB_PASSWORD,
    database:          process.env.DB_NAME,
    timezone:          '+08:00',
    dateStrings:       true,
    waitForConnections: true,
    connectionLimit:   10,
    queueLimit:        0,
    enableKeepAlive:   true,
    keepAliveInitialDelay: 10000
})

// Force Philippine Time (UTC+8) on every new MySQL connection
// This ensures curtime(), curdate(), NOW() all return PH time
connection.on('connection', (conn) => {
    conn.query("SET time_zone = '+08:00'", (err) => {
        if (err) console.error('[DB] Failed to set timezone:', err.message)
        else console.log('[DB] Timezone set to Asia/Manila (+08:00)')
    })
})

connection.getConnection((err, conn) => {
    if (err) return console.error('[DB] Connection error:', err.message)
    console.log('Connected!')
    conn.release()
})

// ── Prevent pool connection errors from crashing the process ──
// ECONNRESET / PROTOCOL_CONNECTION_LOST are normal when MySQL
// drops idle connections — the pool handles reconnection automatically
connection.on('error', (err) => {
    if (
        err.code === 'ECONNRESET' ||
        err.code === 'PROTOCOL_CONNECTION_LOST' ||
        err.code === 'ENOTFOUND' ||
        err.code === 'ETIMEDOUT' ||
        err.fatal
    ) {
        console.warn('[DB] Pool connection lost, will reconnect automatically:', err.code)
        return  // pool handles reconnection — don't crash
    }
    console.error('[DB] Unexpected pool error:', err)
})

module.exports = connection;