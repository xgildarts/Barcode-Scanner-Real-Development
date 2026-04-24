const multer = require('multer')
const path   = require('path')

// ── Profile picture upload ─────────────────────────────────
const guardPicStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        const dir = path.join(__dirname, '../../../uploads/profile_pictures/')
        require('fs').mkdirSync(dir, { recursive: true })
        cb(null, dir)
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname) || '.jpg'
        cb(null, `guard-${Date.now()}-${Math.round(Math.random()*1e6)}${ext}`)
    }
})
const uploadGuardPic = multer({
    storage: guardPicStorage,
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) cb(null, true)
        else cb(new Error('Only image files are allowed'))
    }
})

// ── Message file upload (100 MB limit) ──────────────────────
const msgStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        const dir = path.join(__dirname, '../../../uploads/message_files/')
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
        if (!decodedToken) return res.status(401).json({ ok: false, message: 'Invalid or expired token.' })
        const ip         = (req.headers['x-forwarded-for'] || '').split(',')[0].trim() || req.ip || null;
        const deviceInfo = req.body.device_info || req.headers['x-device-info'] || req.headers['user-agent'] || null;
        const result = await services.guardInsertAttendanceRecord(
            barcode,
            status,
            decodedToken.guard_id,
            decodedToken.guard_name,
            decodedToken.guard_location,
            ip,
            deviceInfo)
        res.json(result)
    } catch(err) {
        console.error(err)
        res.status(500).json({ ok: false, message: err })
    }
})



// ============================================================
// GUARD STUDENT SEARCH — search by name or ID number (no barcode needed)
// ============================================================
guard.get('/search_students', async (req, res) => {
    try {
        const token = services.removeBearer(req.headers['authorization'])
        const decodedToken = services.verifyToken(token)
        if (!decodedToken) return res.status(401).json({ ok: false, message: 'Invalid or expired token.' })
        const q = (req.query.q || '').trim()
        if (!q || q.length < 2) return res.json({ ok: true, content: [] })
        const results = await services.searchStudentAccounts(q)
        res.json({ ok: true, content: results })
    } catch (err) {
        res.status(500).json({ ok: false, message: err.message || String(err) })
    }
})

// Record event attendance by student ID number (for students without internet)
guard.post('/event_attendance_by_id', async (req, res) => {
    try {
        const { student_id_number, status } = req.body
        const token = services.removeBearer(req.headers['authorization'])
        const decodedToken = services.verifyToken(token)
        if (!decodedToken) return res.status(401).json({ ok: false, message: 'Invalid or expired token.' })
        const ip2         = (req.headers['x-forwarded-for'] || '').split(',')[0].trim() || req.ip || null;
        const deviceInfo2 = req.body.device_info || req.headers['x-device-info'] || req.headers['user-agent'] || null;
        const result = await services.guardInsertAttendanceRecordByIdNumber(
            student_id_number,
            status,
            decodedToken.guard_id,
            decodedToken.guard_name,
            decodedToken.guard_location,
            ip2,
            deviceInfo2
        )
        res.json(result)
    } catch (err) {
        console.error(err)
        res.status(500).json({ ok: false, message: err.message || String(err) })
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
        if (!decoded) return res.status(401).json({ ok: false, message: 'Invalid or expired token.' })
        // FIX: blacklist the token so it cannot be reused after logout
        services.blacklistToken(token)
        const db = require('../configuration/db');
        db.execute('SELECT guard_email FROM guards WHERE guard_id = ? LIMIT 1', [decoded.guard_id], (err, rows) => {
            const email = (!err && rows.length) ? rows[0].guard_email : null;
            services.writeLogoutLog(decoded.guard_id, decoded.guard_name, email, 'guard', req.ip, req.body?.device_info || req.headers['x-device-info'] || req.headers['user-agent']);
        });
        res.json({ ok: true });
    } catch (_) { res.json({ ok: true }); }
})

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
            const picMap = { student:'student_profile_picture FROM student_accounts WHERE student_id', teacher:'teacher_profile_picture FROM teacher WHERE teacher_id', admin:'admin_profile_picture FROM admin_accounts WHERE admin_id', super_admin:'super_admin_profile_picture FROM super_admin_accounts WHERE super_admin_id', guard:'guard_profile_picture FROM guards WHERE guard_id' }
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
        const replyToId = req.body.reply_to_id ? parseInt(req.body.reply_to_id) : null
        const id = await services.sendMessage(tok.guard_id, 'guard', senderName, receiver_id, receiver_role, receiver_name, content?.trim() || null, fileUrl, fileName, fileType, senderPic, receiverPic, replyToId)
        res.json({ ok: true, id })
        // Notify receiver via bell
        services.createMsgNotification(
                parseInt(receiver_id), receiver_role,
                tok.guard_id, 'guard', tok.guard_name || 'guard',
                req.file ? 'file' : 'message',
                content?.trim() || (req.file ? req.file.originalname : null),
                null, id
        ).catch(() => {})
    } catch (err) { res.status(500).json({ ok: false, message: err.message }) }
})

guard.post('/messages/typing', (req, res) => {
    try {
        const tok = services.verifyToken(services.removeBearer(req.headers['authorization']))
        if (!tok) return res.status(401).json({ ok: false })
        const { contact_id, contact_role } = req.body
        services.setTypingStatus(tok.guard_id, 'guard', contact_id, contact_role)
        res.json({ ok: true })
    } catch(err) { res.status(500).json({ ok: false }) }
})

guard.get('/messages/typing', (req, res) => {
    try {
        const tok = services.verifyToken(services.removeBearer(req.headers['authorization']))
        if (!tok) return res.status(401).json({ ok: false })
        const { contact_id, contact_role } = req.query
        const isTyping = services.getTypingStatus(parseInt(contact_id), contact_role, tok.guard_id, 'guard')
        res.json({ ok: true, typing: isTyping })
    } catch(err) { res.status(500).json({ ok: false, typing: false }) }
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


// GET /guard/get_data
guard.get('/get_data', async (req, res) => {
    try {
        const tok = services.verifyToken(services.removeBearer(req.headers['authorization']))
        if (!tok) return res.status(401).json({ ok: false, message: 'Unauthorized.' })
        const db = require('../configuration/db')
        db.execute(
            'SELECT guard_id, guard_name, guard_email, guard_designated_location, guard_profile_picture FROM guards WHERE guard_id = ? LIMIT 1',
            [tok.guard_id],
            (err, rows) => {
                if (err) return res.status(500).json({ ok: false, message: err.message })
                if (!rows.length) return res.status(404).json({ ok: false, message: 'Guard not found.' })
                res.json({ ok: true, content: rows[0] })
            }
        )
    } catch (err) { res.status(500).json({ ok: false, message: err.message }) }
})

// POST /guard/upload_profile_picture
guard.post('/upload_profile_picture', uploadGuardPic.single('guard_profile_picture'), async (req, res) => {
    try {
        const tok = services.verifyToken(services.removeBearer(req.headers['authorization']))
        if (!tok) return res.status(401).json({ ok: false, message: 'Unauthorized.' })
        if (!req.file) return res.status(400).json({ ok: false, message: 'No image file provided.' })
        const picUrl = req.file.filename
        const db = require('../configuration/db')
        db.execute(
            'UPDATE guards SET guard_profile_picture = ? WHERE guard_id = ?',
            [picUrl, tok.guard_id],
            (err) => {
                if (err) return res.status(500).json({ ok: false, message: err.message })
                res.json({ ok: true, picture: picUrl })
            }
        )
    } catch (err) { res.status(500).json({ ok: false, message: err.message }) }
})


// GET /messages/notifications
guard.get('/messages/notifications', async (req, res) => {
    try {
        const tok = services.verifyToken(services.removeBearer(req.headers['authorization']))
        if (!tok) return res.status(401).json({ ok: false })
        services.cleanOldMsgNotifications()
        const notifs = await services.getMsgNotifications(tok.guard_id, 'guard', parseInt(req.query.limit) || 30)
        const unread = await services.getUnreadMsgNotifCount(tok.guard_id, 'guard')
        res.json({ ok: true, notifications: notifs, unread })
    } catch(err) { res.status(500).json({ ok: false, message: err.message }) }
})


// DELETE /messages/notifications/:id
guard.delete('/messages/notifications/:id', async (req, res) => {
    try {
        const tok = services.verifyToken(services.removeBearer(req.headers['authorization']))
        if (!tok) return res.status(401).json({ ok: false })
        await services.deleteMsgNotification(parseInt(req.params.id), tok.guard_id, 'guard')
        res.json({ ok: true })
    } catch(err) { res.status(500).json({ ok: false, message: err.message }) }
})

// POST /messages/notifications/read
guard.post('/messages/notifications/read', async (req, res) => {
    try {
        const tok = services.verifyToken(services.removeBearer(req.headers['authorization']))
        if (!tok) return res.status(401).json({ ok: false })
        const ids = req.body.ids || []
        await services.markMsgNotificationsRead(tok.guard_id, 'guard', ids)
        res.json({ ok: true })
    } catch(err) { res.status(500).json({ ok: false, message: err.message }) }
})

// GET /messages/reaction-notifications
guard.get('/messages/reaction-notifications', async (req, res) => {
    try {
        const tok = services.verifyToken(services.removeBearer(req.headers['authorization']))
        if (!tok) return res.status(401).json({ ok: false })
        const after  = parseInt(req.query.after) || 0
        const isSeed = req.query.seed === '1'
        const db = require('../configuration/db')
        // Auto-clean notifications older than 24h to prevent accumulation
        db.execute(
            `DELETE FROM notifications WHERE type = 'reaction' AND created_at < DATE_SUB(NOW(), INTERVAL 24 HOUR)`,
            [], () => {}
        )
        db.execute(
            `SELECT id, type, title, message, meta, created_at FROM notifications
             WHERE type = 'reaction' AND id > ?
             AND CAST(JSON_EXTRACT(meta, '$.receiver_id') AS CHAR) = CAST(? AS CHAR)
             AND JSON_EXTRACT(meta, '$.receiver_role') = ?
             ORDER BY id DESC LIMIT ${isSeed ? 100 : 20}`,
            [after, tok.guard_id, 'guard'],
            (err, rows) => {
                if (err) return res.json({ ok: true, notifications: [] })
                const parsed = rows.map(r => ({ ...r, meta: r.meta ? (typeof r.meta === 'string' ? JSON.parse(r.meta) : r.meta) : {} }))
                services.enrichReactionNotifications(parsed).then(enriched => { res.json({ ok: true, notifications: enriched }) }).catch(() => res.json({ ok: true, notifications: parsed }))
            }
        )
    } catch(err) { res.status(500).json({ ok: false, message: err.message }) }
})

// POST /messages/react/:id
guard.post('/messages/react/:id', async (req, res) => {
    try {
        const tok = services.verifyToken(services.removeBearer(req.headers['authorization']))
        if (!tok) return res.status(401).json({ ok: false, message: 'Unauthorized.' })
        const { emoji } = req.body
        const { reactions, msg } = await services.reactToMessage(
            parseInt(req.params.id),
            tok.guard_id, 'guard',
            emoji || null
        )
        const receiverId   = String(msg.sender_id) === String(tok.guard_id) && msg.sender_role === 'guard'
            ? msg.receiver_id : msg.sender_id
        const receiverRole = String(msg.sender_id) === String(tok.guard_id) && msg.sender_role === 'guard'
            ? msg.receiver_role : msg.sender_role
        const isSelf  = String(receiverId) === String(tok.guard_id) && receiverRole === 'guard'
        if (emoji && !isSelf) {
            services.createNotification(
                'reaction',
                'New Reaction',
                `${tok.guard_name || 'Guard'} reacted ${emoji} to your message`,
                { reactor_id: tok.guard_id, reactor_role: 'guard', message_id: parseInt(req.params.id), receiver_id: receiverId, receiver_role: receiverRole, emoji }
            ).catch(() => {})
        }
        res.json({ ok: true, reactions })
        // Notify via bell (skip only self)
        if (emoji && !isSelf) {
            services.createMsgNotification(
                receiverId, receiverRole,
                tok.guard_id, 'guard', tok.guard_name || 'guard',
                'reaction', null, emoji, parseInt(req.params.id)
            ).catch(() => {})
        }
    } catch (err) {
        res.status(500).json({ ok: false, message: err.message })
    }
})

guard.post('/messages/pin/:id', async (req, res) => {
    try {
        const tok = services.verifyToken(services.removeBearer(req.headers['authorization']))
        if (!tok) return res.status(401).json({ ok: false })
        const msg = await services.pinMessage(parseInt(req.params.id), tok.guard_id, 'guard')
        res.json({ ok: true, message: msg })
    } catch (err) { res.status(500).json({ ok: false, message: err.message }) }
})

guard.put('/messages/edit/:id', async (req, res) => {
    try {
        const tok = services.verifyToken(services.removeBearer(req.headers['authorization']))
        if (!tok) return res.status(401).json({ ok: false })
        const { content } = req.body
        await services.editMessage(parseInt(req.params.id), tok.guard_id, 'guard', content)
        res.json({ ok: true })
    } catch (err) { res.status(500).json({ ok: false, message: err.message }) }
})

module.exports = guard