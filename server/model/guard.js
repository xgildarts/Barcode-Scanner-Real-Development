const express = require('express')
const services = require('../controller/services')
const guard = express.Router()

guard.use(express.json())

// Debugging API
guard.get('/', (req, res) => {
    res.send('guard API Working!')
})

// Guard Login
guard.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const result = await services.guardLogin(email, password);
        console.log(result)
        res.json({ 
            ok: true, 
            token: result.token, 
            guard_name: result.name 
        });
    } catch (err) {
        res.status(401).json({ ok: false, message: err });
    }
});

// Continue here tomorrow
guard.post('/event_attendance', async (req, res) => {
    try {
        const { barcode, status } = req.body
        const token = services.removeBearer(req.headers['authorization'])
        const decodedToken = services.verifyToken(token)
        const result = await services.guardInsertAttendanceRecord(
            barcode,
            status,
            decodedToken.guard_id,
            decodedToken.guard_name,
            decodedToken.guard_location)
        res.json(result)
    } catch(err) {
        console.error(err)
        res.status(500).json({ ok: false, message: err })
    }
})



// Export route
module.exports = guard