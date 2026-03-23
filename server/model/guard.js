const multer = require('multer')
const path   = require('path')

// ── Message file upload (100 MB limit) ──────────────────────
const msgStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        const dir = path.join(__dirname, '../../uploads/message_files/')
        require('fs').mkdirSync(dir, { recursive: true })
        cb(null, dir)
    },
    filename: (req, file, cb) => {
        const ext  = path.extname(file.originalname)
        const base = path.basename(file.originalname, ext).replace(/[^a-zA-Z0-9_-]/g, '_').substring(0, 50)
        cb(null, `msg_${Date.now()}_${base}${ext}`)
    }
})
const uploadMsgFile = multer({
    storage: msgStorage,
    limits: { fileSize: 100 * 1024 * 1024 } // 100 MB
})
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
        const result = await services.guardLogin(email, password, req.ip, req.body.device_info || req.body?.device_info || req.headers['x-device-info'] || req.headers['user-agent']);
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

// Logout
guard.post('/logout', async (req, res) => {
    try {
        const token = services.removeBearer(req.headers['authorization']);
        const decoded = services.verifyToken(token);
        if (decoded) {
            const db = require('../configuration/db');
            db.execute('SELECT guard_email FROM guards WHERE guard_id = ? LIMIT 1', [decoded.guard_id], (err, rows) => {
                const email = (!err && rows.length) ? rows[0].guard_email : null;
                services.writeLogoutLog(decoded.guard_id, decoded.guard_name, email, 'guard', req.ip, req.body?.device_info || req.headers['x-device-info'] || req.headers['user-agent']);
            });
        }
        res.json({ ok: true });
    } catch (_) { res.json({ ok: true }); }
})

module.exports = guard
// ── Messaging ──────────────────────────────────────────────
guard.get('/messages/contacts', async (req, res) => {
    try {
        const tok = services.verifyToken(services.removeBearer(req.headers['authorization']))
        if (!tok) return res.status(401).json({ ok: false })
        const contacts = await services.getMessageContacts(tok.guard_id, 'guard')
        const unread   = await services.getUnreadMessageCount(tok.guard_id, 'guard')
        res.json({ ok: true, contacts, unread })
    } catch (err) { res.status(500).json({ ok: false, message: err.message }) }
})

guard.get('/messages/conversation', async (req, res) => {
    try {
        const tok = services.verifyToken(services.removeBearer(req.headers['authorization']))
        if (!tok) return res.status(401).json({ ok: false })
        const { contact_id, contact_role } = req.query
        await services.markMessagesRead(tok.guard_id, 'guard', parseInt(contact_id), contact_role)
        const messages = await services.getConversation(tok.guard_id, 'guard', parseInt(contact_id), contact_role, 100)
        res.json({ ok: true, messages })
    } catch (err) { res.status(500).json({ ok: false, message: err.message }) }
})

guard.post('/messages/send', uploadMsgFile.single('file'), async (req, res) => {
    try {
        const tok = services.verifyToken(services.removeBearer(req.headers['authorization']))
        if (!tok) return res.status(401).json({ ok: false })
        const { receiver_id, receiver_role, receiver_name, content } = req.body
        if (!content?.trim() && !req.file) return res.status(400).json({ ok: false, message: 'Message cannot be empty.' })
        const senderName = tok.guard_name || 'guard'
        const fileUrl  = req.file ? `/api/v1/uploads/message_files/${req.file.filename}` : null
        const fileName = req.file ? req.file.originalname : null
        const fileType = req.file ? req.file.mimetype : null
        // Fetch profile pictures for sender and receiver
        const getSenderPic = () => new Promise(r => {
            const picMap = { student:'student_profile_picture FROM student_accounts WHERE student_id', teacher:'teacher_profile_picture FROM teacher WHERE teacher_id', admin:'admin_profile_picture FROM admin_accounts WHERE admin_id', super_admin:'super_admin_profile_picture FROM super_admin_accounts WHERE super_admin_id', guard:null }
            const col = picMap['guard']
            if (!col) return r(null)
            require('../configuration/db').execute(`SELECT ${col} = ? LIMIT 1`, [tok.guard_id], (e,rows) => r(rows?.[0]?.[Object.keys(rows[0])[0]] || null))
        })
        const getReceiverPic = () => new Promise(r => {
            const picCols = { student:'student_profile_picture FROM student_accounts WHERE student_id', teacher:'teacher_profile_picture FROM teacher WHERE teacher_id', admin:'admin_profile_picture FROM admin_accounts WHERE admin_id', super_admin:'super_admin_profile_picture FROM super_admin_accounts WHERE super_admin_id', guard:null }
            const col = picCols[receiver_role]
            if (!col) return r(null)
            require('../configuration/db').execute(`SELECT ${col} = ? LIMIT 1`, [receiver_id], (e,rows) => r(rows?.[0]?.[Object.keys(rows[0])[0]] || null))
        })
        const [senderPic, receiverPic] = await Promise.all([getSenderPic(), getReceiverPic()])
        const id = await services.sendMessage(tok.guard_id, 'guard', senderName, receiver_id, receiver_role, receiver_name, content?.trim() || null, fileUrl, fileName, fileType, senderPic, receiverPic)
        res.json({ ok: true, id })
    } catch (err) { res.status(500).json({ ok: false, message: err.message }) }
})

guard.get('/messages/search', async (req, res) => {
    try {
        const tok = services.verifyToken(services.removeBearer(req.headers['authorization']))
        if (!tok) return res.status(401).json({ ok: false })
        const users = await services.searchUsersForMessaging(req.query.q || '', tok.guard_id, 'guard')
        res.json({ ok: true, users })
    } catch (err) { res.status(500).json({ ok: false, message: err.message }) }
})

// ── Message actions ──────────────────────────────────────────
guard.delete('/messages/delete-for-me/:id', async (req, res) => {
    try {
        const tok = services.verifyToken(services.removeBearer(req.headers['authorization']))
        if (!tok) return res.status(401).json({ ok: false })
        await services.deleteMessageForMe(parseInt(req.params.id), tok.guard_id, 'guard')
        res.json({ ok: true })
    } catch (err) { res.status(500).json({ ok: false, message: err.message }) }
})

guard.delete('/messages/unsend/:id', async (req, res) => {
    try {
        const tok = services.verifyToken(services.removeBearer(req.headers['authorization']))
        if (!tok) return res.status(401).json({ ok: false })
        await services.unsendMessage(parseInt(req.params.id), tok.guard_id, 'guard')
        res.json({ ok: true })
    } catch (err) { res.status(500).json({ ok: false, message: err.message }) }
})

guard.post('/messages/pin/:id', async (req, res) => {
    try {
        const tok = services.verifyToken(services.removeBearer(req.headers['authorization']))
        if (!tok) return res.status(401).json({ ok: false })
        const msg = await services.pinMessage(parseInt(req.params.id), tok.guard_id, 'guard')
        res.json({ ok: true, message: msg })
    } catch (err) { res.status(500).json({ ok: false, message: err.message }) }
})