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

// Attendance inserting
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



// ============================================================
// GUARD FORGOT PASSWORD — public routes (no token required)
// ============================================================
guard.post('/forgot_password/request_otp', async (req, res) => {
    const { email } = req.body
    if (!email) return res.status(400).json({ ok: false, message: 'Email is required.' })
    try {
        await services.sendGuardPasswordResetOTP(email)
        res.json({ ok: true, message: 'OTP sent to your email.' })
    } catch (err) {
        res.status(400).json({ ok: false, message: err.message })
    }
})

guard.post('/forgot_password/verify_otp', (req, res) => {
    const { email, otp } = req.body
    if (!email || !otp) return res.status(400).json({ ok: false, message: 'Email and OTP are required.' })
    try {
        services.verifyGuardPasswordResetOTP(email, otp)
        res.json({ ok: true, message: 'OTP verified.' })
    } catch (err) {
        res.status(400).json({ ok: false, message: err.message })
    }
})

guard.post('/forgot_password/reset_password', async (req, res) => {
    const { email, new_password, confirm_password } = req.body
    if (!email || !new_password || !confirm_password) return res.status(400).json({ ok: false, message: 'All fields are required.' })
    if (new_password !== confirm_password) return res.status(400).json({ ok: false, message: 'Passwords do not match.' })
    if (new_password.length < 6) return res.status(400).json({ ok: false, message: 'Password must be at least 6 characters.' })
    try {
        await services.resetGuardPasswordWithOTP(email, new_password)
        res.json({ ok: true, message: 'Password reset successfully.' })
    } catch (err) {
        res.status(400).json({ ok: false, message: err.message })
    }
})

// Export route
module.exports = guard