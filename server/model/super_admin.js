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
        const result = await services.superAdminLogin(email, password, req.ip, req.body.device_info || req.body?.device_info || req.headers['x-device-info'] || req.headers['user-agent'])
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

// ============================================================
// MAINTENANCE MODE
// ============================================================

superAdmin.get('/maintenance_status', requireSuperAdmin, async (req, res) => {
    try {
        const value = await services.getSystemSetting('maintenance_mode')
        res.json({ ok: true, maintenance: value === '1' })
    } catch (err) {
        res.status(500).json({ ok: false, message: err.message || err })
    }
})

superAdmin.put('/maintenance_toggle', requireSuperAdmin, async (req, res) => {
    try {
        const current = await services.getSystemSetting('maintenance_mode')
        const newValue = current === '1' ? '0' : '1'
        await services.setSystemSetting('maintenance_mode', newValue)
        const state = newValue === '1' ? 'ON' : 'OFF'
        services.writeActivityLog(req.superAdmin.super_admin_id, req.superAdmin.super_admin_name, 'super_admin', 'MAINTENANCE_TOGGLE', 'System', null, `Maintenance ${state}`, `Maintenance mode turned ${state}`, req.ip, req.body?.device_info || req.headers['x-device-info'] || req.headers['user-agent'])
        res.json({ ok: true, maintenance: newValue === '1', message: `Maintenance mode is now ${state}.` })
    } catch (err) {
        res.status(500).json({ ok: false, message: err.message || err })
    }
})

// ============================================================
// SUPER ADMIN — Admin-equivalent routes
// ============================================================

// Get campus accounts (students, teachers, guards)
superAdmin.get('/get_whole_campus_accounts_count/:table', requireSuperAdmin, async (req, res) => {
    try {
        const result = await services.getWholeCampusAccounts(req.params.table)
        res.json({ ok: true, message: 'Successfully retrieved data!', contents: result })
    } catch (err) {
        res.status(500).json({ ok: false, message: err.message || err })
    }
})

// Program management
superAdmin.post('/add_program', requireSuperAdmin, async (req, res) => {
    const { programName } = req.body
    if (!programName) return res.status(400).json({ ok: false, message: 'Program name is required.' })
    try {
        const message = await services.addProgram(programName)
        services.writeActivityLog(req.superAdmin.super_admin_id, req.superAdmin.super_admin_name, 'super_admin', 'ADD_PROGRAM', 'Program', null, programName, `Added program: ${programName}`, req.ip, req.body?.device_info || req.headers['x-device-info'] || req.headers['user-agent'])
        res.status(201).json({ ok: true, message })
    } catch (err) {
        if (err === 'Program already exists!' || err.message === 'Program already exists!') {
            return res.status(409).json({ ok: false, message: err })
        }
        res.status(500).json({ ok: false, message: err.message || err })
    }
})

superAdmin.delete('/delete_program/:id', requireSuperAdmin, async (req, res) => {
    const programId = req.params.id
    try {
        let programName = `Program ID: ${programId}`
        try {
            const programs = await services.getAllPrograms()
            const found = programs.find(p => String(p.program_id) === String(programId))
            if (found) programName = found.program_name
        } catch (_) {}
        const result = await services.deleteProgram(programId)
        if (result.affectedRows === 0) return res.status(404).json({ ok: false, message: 'Program not found.' })
        services.writeActivityLog(req.superAdmin.super_admin_id, req.superAdmin.super_admin_name, 'super_admin', 'DELETE_PROGRAM', 'Program', null, programName, `Deleted program: ${programName}`, req.ip, req.body?.device_info || req.headers['x-device-info'] || req.headers['user-agent'])
        res.json({ ok: true, message: 'Program deleted successfully.' })
    } catch (err) {
        if (err.code === 'ER_ROW_IS_REFERENCED_2') return res.status(400).json({ ok: false, message: 'Cannot delete: Students are currently enrolled in this program.' })
        res.status(500).json({ ok: false, message: err.message || err })
    }
})

// Year level management
superAdmin.get('/get_year_levels', requireSuperAdmin, async (req, res) => {
    try {
        const result = await services.getYearLevels()
        res.json({ ok: true, message: 'Successfully retrieved year levels!', content: result })
    } catch (err) {
        res.status(500).json({ ok: false, message: err.message || err })
    }
})

superAdmin.post('/add_year_level', requireSuperAdmin, async (req, res) => {
    const { yearLevelName } = req.body
    if (!yearLevelName) return res.status(400).json({ ok: false, message: 'Year level name is required.' })
    try {
        const result = await services.addYearLevel(yearLevelName)
        services.writeActivityLog(req.superAdmin.super_admin_id, req.superAdmin.super_admin_name, 'super_admin', 'ADD_YEAR_LEVEL', 'Year Level', null, yearLevelName, `Added year level: ${yearLevelName}`, req.ip, req.body?.device_info || req.headers['x-device-info'] || req.headers['user-agent'])
        res.status(201).json({ ok: true, message: result })
    } catch (err) {
        res.status(400).json({ ok: false, message: err.message || err })
    }
})

superAdmin.delete('/delete_year_level/:id', requireSuperAdmin, async (req, res) => {
    const id = req.params.id
    try {
        let yearLevelName = `Year Level ID: ${id}`
        try {
            const levels = await services.getYearLevels()
            const found = levels.find(y => String(y.year_level_id) === String(id))
            if (found) yearLevelName = found.year_level_name
        } catch (_) {}
        const result = await services.deleteYearLevel(id)
        services.writeActivityLog(req.superAdmin.super_admin_id, req.superAdmin.super_admin_name, 'super_admin', 'DELETE_YEAR_LEVEL', 'Year Level', null, yearLevelName, `Deleted year level: ${yearLevelName}`, req.ip, req.body?.device_info || req.headers['x-device-info'] || req.headers['user-agent'])
        res.json({ ok: true, message: result })
    } catch (err) {
        res.status(400).json({ ok: false, message: err.message || err })
    }
})

// Student account management
superAdmin.delete('/delete_student_account/:id', requireSuperAdmin, async (req, res) => {
    const id = req.params.id
    try {
        let studentName = `Student ID: ${id}`
        try {
            const all = await services.getWholeCampusAccounts('student_accounts')
            const found = all.find(s => String(s.student_id) === String(id))
            if (found) studentName = `${found.student_firstname} ${found.student_lastname}`
        } catch (_) {}
        const result = await services.adminDeleteStudents(id)
        services.writeActivityLog(req.superAdmin.super_admin_id, req.superAdmin.super_admin_name, 'super_admin', 'DELETE_STUDENT', 'Student', null, studentName, `Deleted student: ${studentName}`, req.ip, req.body?.device_info || req.headers['x-device-info'] || req.headers['user-agent'])
        res.json(result)
    } catch (err) {
        res.status(err.status_code || 500).json(err)
    }
})

superAdmin.put('/edit_student_account/:id', requireSuperAdmin, async (req, res) => {
    const { id_number, firstname, middlename, lastname, program, year_level, email } = req.body
    try {
        const result = await services.adminEditStudentAccounts(req.params.id, id_number, firstname, middlename, lastname, program, year_level, email)
        if (result.ok !== false) services.writeActivityLog(req.superAdmin.super_admin_id, req.superAdmin.super_admin_name, 'super_admin', 'EDIT_STUDENT', 'Student', null, `${firstname} ${lastname}`, `Edited student: ${firstname} ${lastname} — ${program} ${year_level}`, req.ip, req.body?.device_info || req.headers['x-device-info'] || req.headers['user-agent'])
        res.json(result)
    } catch (err) {
        res.status(err.status_code || 500).json(err)
    }
})

superAdmin.put('/reset_student_device/:id', requireSuperAdmin, async (req, res) => {
    const studentId = req.params.id
    try {
        let studentName = `Student ID: ${studentId}`
        try {
            const all = await services.getWholeCampusAccounts('student_accounts')
            const found = all.find(s => String(s.student_id) === String(studentId))
            if (found) studentName = `${found.student_firstname} ${found.student_lastname}`
        } catch (_) {}
        await services.adminResetStudentDevice(studentId)
        services.writeActivityLog(req.superAdmin.super_admin_id, req.superAdmin.super_admin_name, 'super_admin', 'RESET_STUDENT_DEVICE', 'Student', studentId, studentName, `Device binding reset for: ${studentName}`, req.ip, req.body?.device_info || req.headers['x-device-info'] || req.headers['user-agent'])
        res.json({ ok: true, message: `Device binding reset for ${studentName}.` })
    } catch (err) {
        res.status(500).json({ ok: false, message: err.message || err })
    }
})

// Reset student password directly (super admin privilege)
superAdmin.put('/reset_student_password/:id', requireSuperAdmin, async (req, res) => {
    const { new_password } = req.body
    if (!new_password || new_password.length < 6)
        return res.status(400).json({ ok: false, message: 'Password must be at least 6 characters.' })
    try {
        const bcrypt = require('bcrypt')
        const hashed = await bcrypt.hash(new_password, 10)
        await new Promise((resolve, reject) => {
            const db = require('../configuration/db')
            db.execute('UPDATE student_accounts SET password = ? WHERE student_id = ?', [hashed, req.params.id],
                (err, result) => {
                    if (err) return reject(err)
                    if (result.affectedRows === 0) return reject(new Error('Student not found.'))
                    resolve()
                })
        })
        services.writeActivityLog(req.superAdmin.super_admin_id, req.superAdmin.super_admin_name, 'super_admin', 'RESET_STUDENT_PASSWORD', 'Student', req.params.id, null, `Reset password for student ID: ${req.params.id}`, req.ip, req.body?.device_info || req.headers['x-device-info'] || req.headers['user-agent'])
        res.json({ ok: true, message: 'Student password reset successfully.' })
    } catch (err) {
        res.status(500).json({ ok: false, message: err.message || err })
    }
})

// Reset teacher password directly (super admin privilege)
superAdmin.put('/reset_teacher_password/:id', requireSuperAdmin, async (req, res) => {
    const { new_password } = req.body
    if (!new_password || new_password.length < 6)
        return res.status(400).json({ ok: false, message: 'Password must be at least 6 characters.' })
    try {
        const bcrypt = require('bcrypt')
        const hashed = await bcrypt.hash(new_password, 10)
        await new Promise((resolve, reject) => {
            const db = require('../configuration/db')
            db.execute('UPDATE teacher SET teacher_password = ? WHERE teacher_id = ?', [hashed, req.params.id],
                (err, result) => {
                    if (err) return reject(err)
                    if (result.affectedRows === 0) return reject(new Error('Teacher not found.'))
                    resolve()
                })
        })
        services.writeActivityLog(req.superAdmin.super_admin_id, req.superAdmin.super_admin_name, 'super_admin', 'RESET_TEACHER_PASSWORD', 'Teacher', req.params.id, null, `Reset password for teacher ID: ${req.params.id}`, req.ip, req.body?.device_info || req.headers['x-device-info'] || req.headers['user-agent'])
        res.json({ ok: true, message: 'Teacher password reset successfully.' })
    } catch (err) {
        res.status(500).json({ ok: false, message: err.message || err })
    }
})

// Reset guard password directly (super admin privilege)
superAdmin.put('/reset_guard_password/:id', requireSuperAdmin, async (req, res) => {
    const { new_password } = req.body
    if (!new_password || new_password.length < 6)
        return res.status(400).json({ ok: false, message: 'Password must be at least 6 characters.' })
    try {
        const bcrypt = require('bcrypt')
        const hashed = await bcrypt.hash(new_password, 10)
        await new Promise((resolve, reject) => {
            const db = require('../configuration/db')
            db.execute('UPDATE guards SET guard_password = ? WHERE guard_id = ?', [hashed, req.params.id],
                (err, result) => {
                    if (err) return reject(err)
                    if (result.affectedRows === 0) return reject(new Error('Guard not found.'))
                    resolve()
                })
        })
        services.writeActivityLog(req.superAdmin.super_admin_id, req.superAdmin.super_admin_name, 'super_admin', 'RESET_GUARD_PASSWORD', 'Guard', req.params.id, null, `Reset password for guard ID: ${req.params.id}`, req.ip, req.body?.device_info || req.headers['x-device-info'] || req.headers['user-agent'])
        res.json({ ok: true, message: 'Guard password reset successfully.' })
    } catch (err) {
        res.status(500).json({ ok: false, message: err.message || err })
    }
})

// Teacher account management
superAdmin.delete('/delete_teacher_account/:id', requireSuperAdmin, async (req, res) => {
    const id = req.params.id
    try {
        let teacherName = `Teacher ID: ${id}`
        try {
            const all = await services.getWholeCampusAccounts('teacher')
            const found = all.find(t => String(t.teacher_id) === String(id))
            if (found) teacherName = found.teacher_name
        } catch (_) {}
        const result = await services.adminDeleteTeacher(id, 0)
        services.writeActivityLog(req.superAdmin.super_admin_id, req.superAdmin.super_admin_name, 'super_admin', 'DELETE_TEACHER', 'Teacher', null, teacherName, `Deleted teacher: ${teacherName}`, req.ip, req.body?.device_info || req.headers['x-device-info'] || req.headers['user-agent'])
        res.json(result)
    } catch (err) {
        res.status(err.status_code || 500).json(err)
    }
})

superAdmin.put('/edit_teacher_account/:id', requireSuperAdmin, async (req, res) => {
    const { teacher_name, teacher_email, teacher_program } = req.body
    try {
        const result = await services.adminEditTeacherAccounts(req.params.id, teacher_name, teacher_email, teacher_program, 0)
        services.writeActivityLog(req.superAdmin.super_admin_id, req.superAdmin.super_admin_name, 'super_admin', 'EDIT_TEACHER', 'Teacher', null, teacher_name, `Edited teacher: ${teacher_name}`, req.ip, req.body?.device_info || req.headers['x-device-info'] || req.headers['user-agent'])
        res.json(result)
    } catch (err) {
        res.status(err.status_code || 500).json(err)
    }
})

// Guard account management
superAdmin.delete('/delete_guard_account/:id', requireSuperAdmin, async (req, res) => {
    const id = req.params.id
    try {
        let guardName = `Guard ID: ${id}`
        try {
            const all = await services.getWholeCampusAccounts('guards')
            const found = all.find(g => String(g.guard_id) === String(id))
            if (found) guardName = found.guard_name
        } catch (_) {}
        const result = await services.adminDeleteGuard(id, 0)
        services.writeActivityLog(req.superAdmin.super_admin_id, req.superAdmin.super_admin_name, 'super_admin', 'DELETE_GUARD', 'Guard', null, guardName, `Deleted guard: ${guardName}`, req.ip, req.body?.device_info || req.headers['x-device-info'] || req.headers['user-agent'])
        res.json(result)
    } catch (err) {
        res.status(err.status_code || 500).json(err)
    }
})

superAdmin.put('/edit_guard_account/:id', requireSuperAdmin, async (req, res) => {
    const { guard_name, guard_email, guard_designated_location } = req.body
    try {
        const result = await services.adminEditGuardAccounts(req.params.id, guard_name, guard_email, guard_designated_location, 0)
        services.writeActivityLog(req.superAdmin.super_admin_id, req.superAdmin.super_admin_name, 'super_admin', 'EDIT_GUARD', 'Guard', null, guard_name, `Edited guard: ${guard_name}`, req.ip, req.body?.device_info || req.headers['x-device-info'] || req.headers['user-agent'])
        res.json(result)
    } catch (err) {
        res.status(err.status_code || 500).json(err)
    }
})

// Present program counts (for chart)
superAdmin.get('/present_program_counts', requireSuperAdmin, async (req, res) => {
    try {
        const result = await services.getPresentPrograms()
        res.json(result)
    } catch (err) {
        res.status(500).json({ ok: false, message: err.message || err })
    }
})

// ============================================================
// SUPER ADMIN — Event Management
// ============================================================

// Get active event (latest set across all admins)
superAdmin.get('/get_active_event', requireSuperAdmin, async (req, res) => {
    try {
        const result = await services.getEventSet()
        res.json({ ok: true, content: result || { event_name_set: '' } })
    } catch (err) {
        res.status(500).json({ ok: false, message: err.message || err })
    }
})

// Set event name system-wide (updates all admin event setters)
superAdmin.post('/set_event', requireSuperAdmin, async (req, res) => {
    const { event_name } = req.body
    if (!event_name) return res.status(400).json({ ok: false, message: 'Event name is required.' })
    try {
        const db = require('../configuration/db')
        await new Promise((resolve, reject) => {
            db.execute('UPDATE event_setter SET event_name_set = ?', [event_name], (err) => {
                if (err) return reject(err)
                resolve()
            })
        })
        services.writeActivityLog(req.superAdmin.super_admin_id, req.superAdmin.super_admin_name, 'super_admin', 'SET_EVENT', 'Event', null, event_name, `Set system-wide event: ${event_name}`, req.ip, req.body?.device_info || req.headers['x-device-info'] || req.headers['user-agent'])
        res.json({ ok: true, message: 'Event updated successfully.' })
    } catch (err) {
        res.status(500).json({ ok: false, message: err.message || err })
    }
})

// ============================================================
// SUPER ADMIN — Teacher Class Management
// Super admin selects a teacher, then manages that teacher's class
// ============================================================

// Helper — get teacher serial by teacher_id
async function getTeacherSerial(teacherId) {
    const teachers = await services.getWholeCampusAccounts('teacher')
    const teacher = teachers.find(t => String(t.teacher_id) === String(teacherId))
    if (!teacher) throw new Error('Teacher not found.')
    return teacher
}

// Get subjects for a specific teacher
superAdmin.get('/class/get_subjects/:teacher_id', requireSuperAdmin, async (req, res) => {
    try {
        const result = await services.getStudentSubjects(req.params.teacher_id)
        res.json({ ok: true, content: result })
    } catch (err) {
        res.status(500).json({ ok: false, message: err.message || err })
    }
})

// Get all teachers list (for the picker)
superAdmin.get('/class/get_teachers', requireSuperAdmin, async (req, res) => {
    try {
        const result = await services.getWholeCampusAccounts('teacher')
        const teachers = result.map(t => ({
            teacher_id: t.teacher_id,
            teacher_name: t.teacher_name,
            teacher_program: t.teacher_program,
            teacher_barcode_scanner_serial_number: t.teacher_barcode_scanner_serial_number
        }))
        res.json({ ok: true, content: teachers })
    } catch (err) {
        res.status(500).json({ ok: false, message: err.message || err })
    }
})

// Get class attendance now for a teacher
superAdmin.get('/class/attendance_now/:teacher_id', requireSuperAdmin, async (req, res) => {
    try {
        const teacher = await getTeacherSerial(req.params.teacher_id)
        const result = await services.getStudentAttendanceNow(teacher.teacher_barcode_scanner_serial_number)
        res.json({ ok: true, content: result })
    } catch (err) {
        res.status(500).json({ ok: false, message: err.message || err })
    }
})

// Get class attendance history for a teacher
superAdmin.get('/class/attendance_history/:teacher_id', requireSuperAdmin, async (req, res) => {
    try {
        const teacher = await getTeacherSerial(req.params.teacher_id)
        const result = await services.getStudentAttendanceHistory(teacher.teacher_barcode_scanner_serial_number)
        res.json({ ok: true, content: result })
    } catch (err) {
        res.status(500).json({ ok: false, message: err.message || err })
    }
})

// Add student to teacher's class roster
superAdmin.post('/class/add_student/:teacher_id', requireSuperAdmin, async (req, res) => {
    try {
        const teacher = await getTeacherSerial(req.params.teacher_id)
        const { student_firstname, student_middlename, student_lastname, student_email,
                student_id_number, student_program, student_year_level, student_guardian_number } = req.body
        const result = await services.teacherAddStudent(
            student_id_number, student_firstname, student_middlename, student_lastname,
            student_email, student_program, student_year_level, student_guardian_number,
            teacher.teacher_barcode_scanner_serial_number, teacher.teacher_id, teacher.teacher_name
        )
        services.writeActivityLog(req.superAdmin.super_admin_id, req.superAdmin.super_admin_name, 'super_admin', 'ADD_STUDENT_TO_CLASS', 'Student', null, `${student_firstname} ${student_lastname}`, `Added ${student_firstname} ${student_lastname} to ${teacher.teacher_name}'s class`, req.ip, req.body?.device_info || req.headers['x-device-info'] || req.headers['user-agent'])
        res.json({ ok: true, message: 'Student added to class!', content: result })
    } catch (err) {
        res.status(400).json({ ok: false, message: err.message || err })
    }
})

// Edit a student record in teacher's class roster
superAdmin.put('/class/edit_student/:student_id', requireSuperAdmin, async (req, res) => {
    const { id_number, firstname, middlename, lastname, program, year_level } = req.body
    try {
        const result = await services.adminEditStudentAccounts(req.params.student_id, id_number, firstname, middlename, lastname, program, year_level)
        services.writeActivityLog(req.superAdmin.super_admin_id, req.superAdmin.super_admin_name, 'super_admin', 'EDIT_STUDENT_RECORD', 'Student', null, `${firstname} ${lastname}`, `Edited class roster student: ${firstname} ${lastname}`, req.ip, req.body?.device_info || req.headers['x-device-info'] || req.headers['user-agent'])
        res.json(result)
    } catch (err) {
        res.status(err.status_code || 500).json(err)
    }
})

// Delete a student from teacher's class roster
superAdmin.delete('/class/delete_student/:student_id', requireSuperAdmin, async (req, res) => {
    try {
        let studentName = `Student ID: ${req.params.student_id}`
        try {
            const all = await services.getWholeCampusAccounts('student_accounts')
            const found = all.find(s => String(s.student_id) === String(req.params.student_id))
            if (found) studentName = `${found.student_firstname} ${found.student_lastname}`
        } catch (_) {}
        const result = await services.deleteStudentRegisteredRecord(req.params.student_id)
        services.writeActivityLog(req.superAdmin.super_admin_id, req.superAdmin.super_admin_name, 'super_admin', 'DELETE_STUDENT_RECORD', 'Student', null, studentName, `Removed ${studentName} from class roster`, req.ip, req.body?.device_info || req.headers['x-device-info'] || req.headers['user-agent'])
        res.json({ ok: true, message: result })
    } catch (err) {
        res.status(500).json({ ok: false, message: err.message || err })
    }
})

// Get class roster for a teacher
superAdmin.get('/class/roster/:teacher_id', requireSuperAdmin, async (req, res) => {
    try {
        const teacher = await getTeacherSerial(req.params.teacher_id)
        const result = await services.teacherGetStudentRegistered(teacher.teacher_barcode_scanner_serial_number)
        res.json({ ok: true, content: result })
    } catch (err) {
        res.status(500).json({ ok: false, message: err.message || err })
    }
})

// Get active subject and year level for a teacher
superAdmin.get('/class/active_subject/:teacher_id', requireSuperAdmin, async (req, res) => {
    try {
        const teacher = await getTeacherSerial(req.params.teacher_id)
        const result = await services.getActiveSubjectAndYearLevel(teacher.teacher_barcode_scanner_serial_number)
        res.json({ ok: true, content: result })
    } catch (err) {
        res.status(500).json({ ok: false, message: err.message || err })
    }
})

// Set subject and year level for a teacher
superAdmin.put('/class/set_subject/:teacher_id', requireSuperAdmin, async (req, res) => {
    const { subject, yearLevel } = req.body
    try {
        const teacher = await getTeacherSerial(req.params.teacher_id)
        const result = await services.teacherSubjectAndYearLevelSetter(subject, yearLevel, teacher.teacher_barcode_scanner_serial_number)
        services.writeActivityLog(req.superAdmin.super_admin_id, req.superAdmin.super_admin_name, 'super_admin', 'SET_SUBJECT_YEAR_LEVEL', 'Class Setup', teacher.teacher_id, subject, `SuperAdmin set subject: ${subject}, year level: ${yearLevel} for teacher: ${teacher.teacher_name}`, req.ip, req.body?.device_info || req.headers['x-device-info'] || req.headers['user-agent'])
        res.json({ ok: true, message: result })
    } catch (err) {
        res.status(500).json({ ok: false, message: err.message || err })
    }
})

// Set classroom location for a teacher
superAdmin.put('/class/set_location/:teacher_id', requireSuperAdmin, async (req, res) => {
    const { latitude, longitude, radius } = req.body
    if (!latitude || !longitude || !radius) {
        return res.status(400).json({ ok: false, message: 'latitude, longitude, and radius are required.' })
    }
    try {
        const teacher = await getTeacherSerial(req.params.teacher_id)
        const result = await services.setTeacherLocation(teacher.teacher_id, latitude, longitude, radius)
        services.writeActivityLog(req.superAdmin.super_admin_id, req.superAdmin.super_admin_name, 'super_admin', 'SET_LOCATION', 'Location', teacher.teacher_id, null, `SuperAdmin set location for teacher: ${teacher.teacher_name} — lat ${latitude}, lng ${longitude}, radius ${radius}m`, req.ip, req.body?.device_info || req.headers['x-device-info'] || req.headers['user-agent'])
        res.json({ ok: true, message: result })
    } catch (err) {
        res.status(500).json({ ok: false, message: err.message || err })
    }
})

// Manual attendance entry for a teacher's class
superAdmin.post('/class/manual_attendance/:teacher_id', requireSuperAdmin, async (req, res) => {
    const {
        student_id, student_id_number, student_firstname, student_middlename,
        student_lastname, student_email, student_year_level, student_guardian_number,
        student_program
    } = req.body
    try {
        const teacher = await getTeacherSerial(req.params.teacher_id)
        const result = await services.manualInsertAttendance(
            student_id, student_id_number, student_firstname, student_middlename,
            student_lastname, student_email, student_year_level, student_guardian_number,
            student_program, teacher.teacher_barcode_scanner_serial_number,
            teacher.teacher_id, teacher.teacher_name
        )
        res.json({ ok: true, message: result })
    } catch (err) {
        res.status(500).json({ ok: false, message: err.message || err })
    }
})

// Search students (for manual entry picker)
superAdmin.get('/class/search_students', requireSuperAdmin, async (req, res) => {
    try {
        const query = req.query.q || ''
        const result = await services.searchStudentAccounts(query)
        res.json({ ok: true, content: result })
    } catch (err) {
        res.status(500).json({ ok: false, message: err.message || err })
    }
})


// ============================================================
// LOGOUT — record in login logs
// ============================================================
superAdmin.post('/logout', requireSuperAdmin, (req, res) => {
    const { super_admin_id, super_admin_name, super_admin_email } = req.superAdmin;
    services.writeLogoutLog(super_admin_id, super_admin_name, super_admin_email, 'super_admin', req.ip, req.body?.device_info || req.headers['x-device-info'] || req.headers['user-agent']);
    res.json({ ok: true, message: 'Logged out.' });
})

module.exports = superAdmin