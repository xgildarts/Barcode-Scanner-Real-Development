const express = require('express')
const services = require('../controller/services')
const program = express.Router()

program.use(express.json())

// Get Student Data's
program.get('/program_get_data', async (req, res) => {
    try {
        const programs = await services.getAllPrograms()
        res.json({ ok: true, message: 'Successfully retrieved data!', content: programs })
    } catch(err) {
        res.status(500).json({ ok: false, message: err })
    }
})


module.exports = program