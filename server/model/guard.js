const express = require('express')
const services = require('../controller/services')
const guard = express.Router()

guard.use(express.json())

// Debugging API
guard.get('/', (req, res) => {
    res.send('guard API Working!')
})

guard.post('/event_attendance', (req, res) => {
    
})



// Export route
module.exports = guard