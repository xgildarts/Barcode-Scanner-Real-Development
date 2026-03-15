const express = require('express')
const services = require('../controller/services')
const multer  = require('multer')
const path    = require('path')
const superAdmin = express.Router()

superAdmin.use(express.json())

// ============================================================
// AUTH MIDDLEWARE — all routes below require a valid super admin token
// ============================================================
function requireSuperAdmin(req, res, next) {
    try {
        const token = services.removeBearer(req.headers['authorization'])
        const decoded = services.verifyToken(token)
        if (!decoded || decoded.role !== 'super_admin') {
            return res.status(401).json({ ok: false, message: 'Unauthorized. Super Admin access required.' })
        }
        req.superAdmin = decoded
        next()
    } catch (err) {
        return res.status(401).json({ ok: false, message: 'Invalid or expired token.' })
    }
}

// ============================================================
// MULTER — Super Admin Profile Picture
// ============================================================
const superAdminPicStorage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, path.join(__dirname, '../../uploads/profile_pictures/')),
    filename:    (req, file, cb) => cb(null, 'superadmin-' + Date.now() + '-' + Math.round(Math.random() * 1e6) + path.extname(file.originalname))
})
const uploadSuperAdminPic = multer({
    storage: superAdminPicStorage,
    limits: { fileSize: 10 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
        const allowed = /jpeg|jpg|png|webp/
        cb(null, allowed.test(path.extname(file.originalname).toLowerCase()) && allowed.test(file.mimetype))
    }
})

// ============================================================
// DEBUG
// ============================================================
superAdmin.get('/', (req, res) => {
    res.send('Super Admin API Working!')
})

// ============================================================
// AUTH — Login (public, no token required)
// ============================================================
superAdmin.post('/login', async (req, res) => {
    const { email, password } = req.body
    if (!email || !password)
        return res.status(400).json({ ok: false, message: 'Email and password are required.' })
    try {
        const result = await services.superAdminLogin(email, password)
        res.json(result)
    } catch (err) {
        res.status(401).json({ ok: false, message: err.message || err })
    }
})

// ============================================================
// AUTH — Verify Token (public)
// ============================================================
superAdmin.post('/verify_token', (req, res) => {
    try {
        const token = services.removeBearer(req.headers['authorization'])
        const decoded = services.verifyToken(token)
        if (!decoded || decoded.role !== 'super_admin') {
            return res.status(401).json({ ok: false, message: 'Invalid or expired token.' })
        }
        res.json({ ok: true, message: 'Valid token.' })
    } catch (err) {
        res.status(401).json({ ok: false, message: 'Invalid or expired token.' })
    }
})

// ============================================================
// PROFILE
// ============================================================

// Get own profile
superAdmin.get('/get_profile', requireSuperAdmin, async (req, res) => {
    try {
        const result = await services.getSuperAdminData(req.superAdmin.super_admin_id)
        res.json({ ok: true, content: result })
    } catch (err) {
        res.status(500).json({ ok: false, message: err.message || err })
    }
})

// Update name
superAdmin.put('/update_name', requireSuperAdmin, async (req, res) => {
    const { newName } = req.body
    if (!newName) return res.status(400).json({ ok: false, message: 'Name is required.' })
    try {
        const result = await services.updateSuperAdminName(req.superAdmin.super_admin_id, newName)
        res.json({ ok: true, message: result })
    } catch (err) {
        res.status(500).json({ ok: false, message: err.message || err })
    }
})

// Change password
superAdmin.put('/change_password', requireSuperAdmin, async (req, res) => {
    const { current_password, new_password, confirm_password } = req.body
    if (!current_password || !new_password || !confirm_password)
        return res.status(400).json({ ok: false, message: 'All fields are required.' })
    if (new_password !== confirm_password)
        return res.status(400).json({ ok: false, message: 'Passwords do not match.' })
    if (new_password.length < 6)
        return res.status(400).json({ ok: false, message: 'Password must be at least 6 characters.' })
    try {
        const result = await services.updateSuperAdminPassword(req.superAdmin.super_admin_id, current_password, new_password)
        res.json({ ok: true, message: result })
    } catch (err) {
        res.status(400).json({ ok: false, message: err.message || err })
    }
})

// Upload profile picture
superAdmin.post('/upload_profile_picture', requireSuperAdmin, uploadSuperAdminPic.single('super_admin_profile_picture'), async (req, res) => {
    if (!req.file) return res.status(400).json({ ok: false, message: 'No file uploaded.' })
    try {
        const filename = await services.updateSuperAdminProfilePicture(req.superAdmin.super_admin_id, req.file.filename)
        res.json({ ok: true, message: 'Profile picture updated!', filename })
    } catch (err) {
        res.status(500).json({ ok: false, message: err.message || err })
    }
})

// ============================================================
// FORGOT PASSWORD (public — no token required)
// ============================================================
superAdmin.post('/forgot_password/request_otp', async (req, res) => {
    const { email } = req.body
    if (!email) return res.status(400).json({ ok: false, message: 'Email is required.' })
    try {
        const result = await services.sendSuperAdminPasswordResetOTP(email)
        res.json({ ok: true, message: result })
    } catch (err) {
        res.status(400).json({ ok: false, message: err.message || err })
    }
})

superAdmin.post('/forgot_password/verify_otp', (req, res) => {
    const { email, otp } = req.body
    if (!email || !otp) return res.status(400).json({ ok: false, message: 'Email and OTP are required.' })
    try {
        services.verifySuperAdminPasswordResetOTP(email, otp)
        res.json({ ok: true, message: 'OTP verified.' })
    } catch (err) {
        res.status(400).json({ ok: false, message: err.message || err })
    }
})

superAdmin.post('/forgot_password/reset_password', async (req, res) => {
    const { email, new_password, confirm_password } = req.body
    if (!email || !new_password || !confirm_password)
        return res.status(400).json({ ok: false, message: 'All fields are required.' })
    if (new_password !== confirm_password)
        return res.status(400).json({ ok: false, message: 'Passwords do not match.' })
    if (new_password.length < 6)
        return res.status(400).json({ ok: false, message: 'Password must be at least 6 characters.' })
    try {
        const result = await services.resetSuperAdminPasswordWithOTP(email, new_password)
        res.json({ ok: true, message: result })
    } catch (err) {
        res.status(400).json({ ok: false, message: err.message || err })
    }
})

// ============================================================
// ADMIN ACCOUNT MANAGEMENT
// ============================================================

// Get all admins
superAdmin.get('/get_all_admins', requireSuperAdmin, async (req, res) => {
    try {
        const result = await services.superAdminGetAllAdmins()
        res.json({ ok: true, message: 'Successfully retrieved admins!', content: result })
    } catch (err) {
        res.status(500).json({ ok: false, message: err.message || err })
    }
})

// Create new admin
superAdmin.post('/create_admin', requireSuperAdmin, async (req, res) => {
    const { admin_name, admin_email, admin_password } = req.body
    if (!admin_name || !admin_email || !admin_password)
        return res.status(400).json({ ok: false, message: 'Name, email, and password are required.' })
    if (admin_password.length < 6)
        return res.status(400).json({ ok: false, message: 'Password must be at least 6 characters.' })
    try {
        const result = await services.superAdminCreateAdmin(admin_name, admin_email, admin_password)
        res.status(201).json({ ok: true, message: result })
    } catch (err) {
        res.status(400).json({ ok: false, message: err.message || err })
    }
})

// Edit admin
superAdmin.put('/edit_admin/:id', requireSuperAdmin, async (req, res) => {
    const id = req.params.id
    const { admin_name, admin_email } = req.body
    if (!admin_name || !admin_email)
        return res.status(400).json({ ok: false, message: 'Name and email are required.' })
    try {
        const result = await services.superAdminEditAdmin(id, admin_name, admin_email)
        res.json({ ok: true, message: result })
    } catch (err) {
        res.status(400).json({ ok: false, message: err.message || err })
    }
})

// Delete admin
superAdmin.delete('/delete_admin/:id', requireSuperAdmin, async (req, res) => {
    const id = req.params.id
    try {
        const result = await services.superAdminDeleteAdmin(id)
        res.json({ ok: true, message: result })
    } catch (err) {
        res.status(400).json({ ok: false, message: err.message || err })
    }
})

// Reset admin password directly (no OTP — super admin privilege)
superAdmin.put('/reset_admin_password/:id', requireSuperAdmin, async (req, res) => {
    const id = req.params.id
    const { new_password } = req.body
    if (!new_password || new_password.length < 6)
        return res.status(400).json({ ok: false, message: 'Password must be at least 6 characters.' })
    try {
        const result = await services.superAdminResetAdminPassword(id, new_password)
        res.json({ ok: true, message: result })
    } catch (err) {
        res.status(400).json({ ok: false, message: err.message || err })
    }
})

// ============================================================
// SYSTEM-WIDE STATS
// ============================================================
superAdmin.get('/system_stats', requireSuperAdmin, async (req, res) => {
    try {
        const result = await services.superAdminGetSystemStats()
        res.json({ ok: true, content: result })
    } catch (err) {
        res.status(500).json({ ok: false, message: err.message || err })
    }
})


// ============================================================
// SYSTEM-WIDE EVENT ATTENDANCE
// ============================================================
superAdmin.get('/get_all_events', requireSuperAdmin, async (req, res) => {
    try {
        const result = await services.superAdminGetAllEvents()
        res.json({ ok: true, content: result })
    } catch (err) {
        res.status(500).json({ ok: false, message: err.message || err })
    }
})

superAdmin.get('/get_all_events_history', requireSuperAdmin, async (req, res) => {
    try {
        const result = await services.superAdminGetAllEventsHistory()
        res.json({ ok: true, content: result })
    } catch (err) {
        res.status(500).json({ ok: false, message: err.message || err })
    }
})

// ============================================================
// LOGIN LOGS — all roles
// ============================================================
superAdmin.get('/login_logs', requireSuperAdmin, async (req, res) => {
    const limit = parseInt(req.query.limit) || 500
    try {
        const result = await services.superAdminGetLoginLogs(limit)
        res.json({ ok: true, content: result })
    } catch (err) {
        res.status(500).json({ ok: false, message: err.message || err })
    }
})

// ============================================================
// ACTIVITY LOGS — all users
// ============================================================
superAdmin.get('/activity_logs', requireSuperAdmin, async (req, res) => {
    const limit = parseInt(req.query.limit) || 500
    try {
        const result = await services.superAdminGetActivityLogs(limit)
        res.json({ ok: true, content: result })
    } catch (err) {
        res.status(500).json({ ok: false, message: err.message || err })
    }
})

module.exports = superAdmin