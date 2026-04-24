const express = require('express')
const services = require('../controller/services')
const multer  = require('multer')
const path    = require('path')
const student = express.Router()

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


student.use(express.json())

// ============================================================
// MULTER — Student Profile Picture Upload
// ============================================================
const studentPicStorage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, path.join(__dirname, '../../uploads/profile_pictures/')),
    filename:    (req, file, cb) => {
        const unique = Date.now() + '-' + Math.round(Math.random() * 1e6)
        cb(null, 'student-' + unique + path.extname(file.originalname))
    }
})
const uploadStudentPic = multer({
    storage: studentPicStorage,
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
        const allowed = /jpeg|jpg|png|webp/
        const valid   = allowed.test(path.extname(file.originalname).toLowerCase())
                     && allowed.test(file.mimetype)
        valid ? cb(null, true) : cb(new Error('Only JPEG, PNG, or WEBP images are allowed.'))
    }
})

// Get Student Data's
student.get('/student_get_data', async (req, res) => {
    try {
        const token = services.removeBearer(req.headers['authorization'])
        const decodedToken = services.verifyToken(token)
        if (!decodedToken) return res.status(401).json({ ok: false, message: 'Invalid or expired token.' })
        const data = await services.getStudentsData(decodedToken.student_id)
        res.json({ ok: true, message: 'Successfully retrieved data!', contents: data })
    } catch(err) {
        res.status(500).json({ ok: false, message: err.message || String(err) })
    }
})

// Update Student Data
student.put('/student_update_profile', async (req, res) => {
    try {
        const token = services.removeBearer(req.headers['authorization']);
        const decodedToken = services.verifyToken(token);
        if (!decodedToken) return res.status(401).json({ message: 'Unauthorized' });

        const studentId = decodedToken.student_id;

        const result = await services.studentUpdateProfile(studentId, req.body);

        if (result.duplicate) {
            return res.status(409).json({ ok: false, duplicate: true, message: `ID number "${req.body.idNumber}" is already assigned to another student.` });
        }

        const fullName = `${decodedToken.student_firstname} ${decodedToken.student_lastname}`
        services.writeActivityLog(decodedToken.student_id, fullName, 'student', 'UPDATE_PROFILE', 'Student', null, fullName, `Updated profile — ID No: ${req.body.idNumber || decodedToken.student_id_number}`, req.ip, req.body?.device_info || req.headers['x-device-info'] || req.headers['user-agent'])
        res.json({ ok: true, message: 'Profile updated successfully' });

    } catch (error) {
        console.error('Update profile error:', error);
        res.status(500).json({ ok: false, message: error.message || 'Server error' });
    }
})

// Change Student password
student.put('/student_change_password', async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body
        const token = services.removeBearer(req.headers['authorization'])
        const decodedToken = services.verifyToken(token)
        if (!decodedToken) return res.status(401).json({ ok: false, message: 'Invalid or expired token.' })
        const result = await services.updateStudentPassword(currentPassword, newPassword, decodedToken.student_id)
        const fullName = `${decodedToken.student_firstname} ${decodedToken.student_lastname}`
        services.writeActivityLog(decodedToken.student_id, fullName, 'student', 'CHANGE_PASSWORD', 'Student', null, fullName, 'Student changed their password', req.ip, req.body?.device_info || req.headers['x-device-info'] || req.headers['user-agent'])
        res.json({ ok: true, message: result })
    } catch(err) {
        res.status(500).json({ ok: false, message: err.message || String(err) })
    }
})

// Get student barcode
student.get('/student_barcode', async (req, res) => {
    try {
        const token = services.removeBearer(req.headers['authorization'])
        const decodedToken = services.verifyToken(token)
        if (!decodedToken) return res.status(401).json({ ok: false, message: 'Invalid or expired token.' })
        const result = await services.getStudentBarcode(decodedToken.student_id)
        res.json({ ok: true, message: 'Successfully retrieved barcode',  content: result})
    } catch(err) {
        res.status(500).json({ ok: false, message: err.message || String(err) })
    }
})

// Update student barcode
student.put('/update_student_barcode', async (req, res) => {
    try {
        const { barcode, teacher_serial } = req.body  // teacher_serial binds barcode to specific class
        const token = services.removeBearer(req.headers['authorization'])
        const decodedToken = services.verifyToken(token)
        if (!decodedToken) return res.status(401).json({ ok: false, message: 'Invalid or expired token.' })
        const result = await services.updateStudentBarcode(decodedToken.student_id, barcode, teacher_serial || null)
        const fullName = `${decodedToken.student_firstname} ${decodedToken.student_lastname}`
        services.writeActivityLog(decodedToken.student_id, fullName, 'student', 'REGENERATE_BARCODE', 'Student', null, fullName, `Regenerated barcode — ID No: ${decodedToken.student_id_number}`, req.ip, req.body?.device_info || req.headers['x-device-info'] || req.headers['user-agent'])
        res.json({ ok: true, message: result })
    } catch(err) {
        res.status(500).json({ ok: false, message: err.message || String(err) })
    }
})

// Get Student Data
student.get('/get_attendance_history_record', async (req, res) => {
    try {
        const token        = services.removeBearer(req.headers['authorization'])
        const decodedToken = services.verifyToken(token)

        if (!decodedToken) return res.status(401).json({ ok: false, message: 'Invalid or expired token.' })

        // Use student_id (numeric PK) — fallback to student_id_number if needed
        const studentId       = decodedToken.student_id
        const studentIdNumber = decodedToken.student_id_number

        if (!studentId && !studentIdNumber) {
            return res.status(401).json({ ok: false, message: 'Could not identify student from token.' })
        }

        const result = await services.getAttendanceHistoryForStudentOnly(studentId, studentIdNumber)
        res.json({ ok: true, message: 'Successfully retrieved student history attendance!', content: result })
    } catch(err) {
        res.status(500).json({ ok: false, message: err.message || String(err) })
    }
})


// Verify student location against their SPECIFIC teacher's set location
// teacher_serial must be passed from the frontend so we check the right teacher,
// preventing a student from bypassing location check via a different enrolled teacher.
student.post('/verify_location', async (req, res) => {
    const { latitude, longitude, teacher_serial } = req.body

    if (latitude === undefined || longitude === undefined) {
        return res.status(400).json({ ok: false, message: 'latitude and longitude are required.' })
    }

    try {
        const token = services.removeBearer(req.headers['authorization'])
        const decodedToken = services.verifyToken(token)

        const result = await services.verifyStudentLocation(
            decodedToken.student_id_number,
            parseFloat(latitude),
            parseFloat(longitude),
            teacher_serial || null  // pass specific teacher serial to prevent bypass
        )

        if (!result.withinRange) {
            return res.json({
                ok: false,
                withinRange: false,
                message: `You are ${result.distance}m away. Must be within ${result.radius}m to generate a barcode.`,
                distance: result.distance,
                radius: result.radius
            })
        }

        res.json({
            ok: true,
            withinRange: true,
            message: `You are within range (${result.distance}m away).`,
            distance: result.distance,
            radius: result.radius
        })

    } catch (err) {
        res.status(500).json({ ok: false, message: err.message || err })
    }
})


// ============================================================
// STUDENT FORGOT PASSWORD — public routes (no token required)
// ============================================================
student.post('/forgot_password/request_otp', async (req, res) => {
    const { email } = req.body
    if (!email) return res.status(400).json({ ok: false, message: 'Email is required.' })
    try {
        await services.sendStudentPasswordResetOTP(email)
        res.json({ ok: true, message: 'OTP sent to your email.' })
    } catch (err) {
        res.status(400).json({ ok: false, message: err.message })
    }
})

student.post('/forgot_password/verify_otp', (req, res) => {
    const { email, otp } = req.body
    if (!email || !otp) return res.status(400).json({ ok: false, message: 'Email and OTP are required.' })
    try {
        services.verifyStudentPasswordResetOTP(email, otp)
        res.json({ ok: true, message: 'OTP verified.' })
    } catch (err) {
        res.status(400).json({ ok: false, message: err.message })
    }
})

student.post('/forgot_password/reset_password', async (req, res) => {
    const { email, new_password, confirm_password } = req.body
    if (!email || !new_password || !confirm_password) return res.status(400).json({ ok: false, message: 'All fields are required.' })
    if (new_password !== confirm_password) return res.status(400).json({ ok: false, message: 'Passwords do not match.' })
    if (new_password.length < 8) return res.status(400).json({ ok: false, message: 'Password must be at least 8 characters.' })
    try {
        await services.resetStudentPasswordWithOTP(email, new_password)
        res.json({ ok: true, message: 'Password reset successfully.' })
    } catch (err) {
        res.status(400).json({ ok: false, message: err.message })
    }
})

// Get Year Levels (public — no token required, used on registration page)
student.get('/year_levels', async (req, res) => {
    try {
        const result = await services.getYearLevels();
        res.json({ ok: true, message: 'Successfully retrieved year levels!', content: result })
    } catch(err) {
        res.status(500).json({ ok: false, message: err.message || String(err) })
    }
})

// Get Programs (public — no token required, used on registration page)
student.get('/programs', async (req, res) => {
    try {
        const result = await services.getAllPrograms()
        res.json({ ok: true, message: 'Successfully retrieved programs!', content: result })
    } catch(err) {
        res.status(500).json({ ok: false, message: err.message || String(err) })
    }
})

// Get all teachers this student is enrolled under (for class picker)
student.get('/enrolled_teachers', async (req, res) => {
    try {
        const token = services.removeBearer(req.headers['authorization'])
        const decodedToken = services.verifyToken(token)
        if (!decodedToken) return res.status(401).json({ ok: false, message: 'Invalid or expired token.' })
        const result = await services.getStudentEnrolledTeachers(decodedToken.student_id_number)
        res.json({ ok: true, content: result })
    } catch (err) {
        res.status(500).json({ ok: false, message: err.message || err })
    }
})


// Get all distinct class session dates for the student's enrolled teachers.
// Used by the frontend to synthesize Absent rows for days the student missed
// even when the teacher did not explicitly mark them absent.
student.get('/class_sessions', async (req, res) => {
    try {
        const token = services.removeBearer(req.headers['authorization'])
        const decodedToken = services.verifyToken(token)
        if (!decodedToken) return res.status(401).json({ ok: false, message: 'Invalid or expired token.' })

        const rows = await services.getStudentClassSessions(decodedToken.student_id_number)
        res.json({ ok: true, content: rows })
    } catch (err) {
        res.status(500).json({ ok: false, message: err.message || String(err) })
    }
})


// Logout
student.post('/logout', async (req, res) => {
    try {
        const token = services.removeBearer(req.headers['authorization']);
        const decoded = services.verifyToken(token);
        if (!decoded) return res.status(401).json({ ok: false, message: 'Invalid or expired token.' })
        // FIX: blacklist the token so it cannot be reused after logout
        services.blacklistToken(token)
        services.writeLogoutLog(decoded.student_id, `${decoded.student_firstname} ${decoded.student_lastname}`, decoded.student_email, 'student', req.ip, req.body?.device_info || req.headers['x-device-info'] || req.headers['user-agent']);
        res.json({ ok: true });
    } catch (_) { res.json({ ok: true }); }
})


// Upload Student Profile Picture
student.post('/upload_profile_picture', uploadStudentPic.single('student_profile_picture'), async (req, res) => {
    if (!req.file) return res.status(400).json({ ok: false, message: 'No file uploaded.' })
    try {
        const token       = services.removeBearer(req.headers['authorization'])
        const decoded     = services.verifyToken(token)
        const filename    = await services.updateStudentProfilePicture(decoded.student_id, req.file.filename)
        res.json({ ok: true, message: 'Profile picture updated!', filename })
    } catch (err) {
        res.status(500).json({ ok: false, message: err.message || err })
    }
})

// ── Messaging ──────────────────────────────────────────────
student.get('/messages/contacts', async (req, res) => {
    try {
        const tok = services.verifyToken(services.removeBearer(req.headers['authorization']))
        if (!tok) return res.status(401).json({ ok: false })
        const contacts = await services.getMessageContacts(tok.student_id, 'student')
        const unread   = await services.getUnreadMessageCount(tok.student_id, 'student')
        res.json({ ok: true, contacts, unread })
    } catch (err) { res.status(500).json({ ok: false, message: err.message }) }
})

student.get('/messages/conversation', async (req, res) => {
    try {
        const tok = services.verifyToken(services.removeBearer(req.headers['authorization']))
        if (!tok) return res.status(401).json({ ok: false })
        const { contact_id, contact_role } = req.query
        await services.markMessagesRead(tok.student_id, 'student', parseInt(contact_id), contact_role)
        const messages = await services.getConversation(tok.student_id, 'student', parseInt(contact_id), contact_role, 100)
        res.json({ ok: true, messages })
    } catch (err) { res.status(500).json({ ok: false, message: err.message }) }
})

student.post('/messages/send', uploadMsgFile.single('file'), async (req, res) => {
    try {
        const tok = services.verifyToken(services.removeBearer(req.headers['authorization']))
        if (!tok) return res.status(401).json({ ok: false })
        const { receiver_id, receiver_role, receiver_name, content } = req.body
        if (!content?.trim() && !req.file) return res.status(400).json({ ok: false, message: 'Message cannot be empty.' })
        const senderName = tok.student_firstname || 'student'
        const fileUrl  = req.file ? `/api/v1/uploads/message_files/${req.file.filename}` : null
        const fileName = req.file ? req.file.originalname : null
        const fileType = req.file ? req.file.mimetype : null
        // Fetch profile pictures for sender and receiver
        const getSenderPic = () => new Promise(r => {
            const picMap = { student:'student_profile_picture FROM student_accounts WHERE student_id', teacher:'teacher_profile_picture FROM teacher WHERE teacher_id', admin:'admin_profile_picture FROM admin_accounts WHERE admin_id', super_admin:'super_admin_profile_picture FROM super_admin_accounts WHERE super_admin_id', guard:null }
            const col = picMap['student']
            if (!col) return r(null)
            require('../configuration/db').execute(`SELECT ${col} WHERE student_id = ? LIMIT 1`, [tok.student_id], (e,rows) => r(rows?.[0]?.[Object.keys(rows[0])[0]] || null))
        })
        const getReceiverPic = () => new Promise(r => {
            const picCols = { student:'student_profile_picture FROM student_accounts WHERE student_id', teacher:'teacher_profile_picture FROM teacher WHERE teacher_id', admin:'admin_profile_picture FROM admin_accounts WHERE admin_id', super_admin:'super_admin_profile_picture FROM super_admin_accounts WHERE super_admin_id', guard:null }
            const col = picCols[receiver_role]
            if (!col) return r(null)
            require('../configuration/db').execute(`SELECT ${col} WHERE id = ? LIMIT 1`, [receiver_id], (e,rows) => r(rows?.[0]?.[Object.keys(rows[0])[0]] || null))
        })
        const [senderPic, receiverPic] = await Promise.all([getSenderPic(), getReceiverPic()])
        const replyToId = req.body.reply_to_id ? parseInt(req.body.reply_to_id) : null
        const id = await services.sendMessage(tok.student_id, 'student', senderName, receiver_id, receiver_role, receiver_name, content?.trim() || null, fileUrl, fileName, fileType, senderPic, receiverPic, replyToId)
        res.json({ ok: true, id })
        // Notify receiver via bell
        services.createMsgNotification(
                parseInt(receiver_id), receiver_role,
                tok.student_id, 'student', `${tok.student_firstname} ${tok.student_lastname}`,
                req.file ? 'file' : 'message',
                content?.trim() || (req.file ? req.file.originalname : null),
                null, id
        ).catch(() => {})
    } catch (err) { res.status(500).json({ ok: false, message: err.message }) }
})

student.post('/messages/typing', (req, res) => {
    try {
        const tok = services.verifyToken(services.removeBearer(req.headers['authorization']))
        if (!tok) return res.status(401).json({ ok: false })
        const { contact_id, contact_role } = req.body
        services.setTypingStatus(tok.student_id, 'student', contact_id, contact_role)
        res.json({ ok: true })
    } catch(err) { res.status(500).json({ ok: false }) }
})

student.get('/messages/typing', (req, res) => {
    try {
        const tok = services.verifyToken(services.removeBearer(req.headers['authorization']))
        if (!tok) return res.status(401).json({ ok: false })
        const { contact_id, contact_role } = req.query
        const isTyping = services.getTypingStatus(parseInt(contact_id), contact_role, tok.student_id, 'student')
        res.json({ ok: true, typing: isTyping })
    } catch(err) { res.status(500).json({ ok: false, typing: false }) }
})

student.get('/messages/search', async (req, res) => {
    try {
        const tok = services.verifyToken(services.removeBearer(req.headers['authorization']))
        if (!tok) return res.status(401).json({ ok: false })
        const users = await services.searchUsersForMessaging(req.query.q || '', tok.student_id, 'student')
        res.json({ ok: true, users })
    } catch (err) { res.status(500).json({ ok: false, message: err.message }) }
})

// ── Message actions ──────────────────────────────────────────
student.delete('/messages/delete-for-me/:id', async (req, res) => {
    try {
        const tok = services.verifyToken(services.removeBearer(req.headers['authorization']))
        if (!tok) return res.status(401).json({ ok: false })
        await services.deleteMessageForMe(parseInt(req.params.id), tok.student_id, 'student')
        res.json({ ok: true })
    } catch (err) { res.status(500).json({ ok: false, message: err.message }) }
})

student.delete('/messages/unsend/:id', async (req, res) => {
    try {
        const tok = services.verifyToken(services.removeBearer(req.headers['authorization']))
        if (!tok) return res.status(401).json({ ok: false })
        await services.unsendMessage(parseInt(req.params.id), tok.student_id, 'student')
        res.json({ ok: true })
    } catch (err) { res.status(500).json({ ok: false, message: err.message }) }
})



// GET /messages/notifications
student.get('/messages/notifications', async (req, res) => {
    try {
        const tok = services.verifyToken(services.removeBearer(req.headers['authorization']))
        if (!tok) return res.status(401).json({ ok: false })
        services.cleanOldMsgNotifications()
        const notifs = await services.getMsgNotifications(tok.student_id, 'student', parseInt(req.query.limit) || 30)
        const unread = await services.getUnreadMsgNotifCount(tok.student_id, 'student')
        res.json({ ok: true, notifications: notifs, unread })
    } catch(err) { res.status(500).json({ ok: false, message: err.message }) }
})


// DELETE /messages/notifications/:id
student.delete('/messages/notifications/:id', async (req, res) => {
    try {
        const tok = services.verifyToken(services.removeBearer(req.headers['authorization']))
        if (!tok) return res.status(401).json({ ok: false })
        await services.deleteMsgNotification(parseInt(req.params.id), tok.student_id, 'student')
        res.json({ ok: true })
    } catch(err) { res.status(500).json({ ok: false, message: err.message }) }
})

// POST /messages/notifications/read
student.post('/messages/notifications/read', async (req, res) => {
    try {
        const tok = services.verifyToken(services.removeBearer(req.headers['authorization']))
        if (!tok) return res.status(401).json({ ok: false })
        const ids = req.body.ids || []
        await services.markMsgNotificationsRead(tok.student_id, 'student', ids)
        res.json({ ok: true })
    } catch(err) { res.status(500).json({ ok: false, message: err.message }) }
})

// GET /messages/reaction-notifications
student.get('/messages/reaction-notifications', async (req, res) => {
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
            [after, tok.student_id, 'student'],
            (err, rows) => {
                if (err) return res.json({ ok: true, notifications: [] })
                const parsed = rows.map(r => ({ ...r, meta: r.meta ? (typeof r.meta === 'string' ? JSON.parse(r.meta) : r.meta) : {} }))
                services.enrichReactionNotifications(parsed).then(enriched => { res.json({ ok: true, notifications: enriched }) }).catch(() => res.json({ ok: true, notifications: parsed }))
            }
        )
    } catch(err) { res.status(500).json({ ok: false, message: err.message }) }
})

// POST /messages/react/:id
student.post('/messages/react/:id', async (req, res) => {
    try {
        const tok = services.verifyToken(services.removeBearer(req.headers['authorization']))
        if (!tok) return res.status(401).json({ ok: false, message: 'Unauthorized.' })
        const { emoji } = req.body
        const { reactions, msg } = await services.reactToMessage(
            parseInt(req.params.id),
            tok.student_id, 'student',
            emoji || null
        )
        // Determine the OTHER party (not the reactor)
        // If reactor is the message sender → notify receiver, else notify sender
        const receiverId   = String(msg.sender_id) === String(tok.student_id) && msg.sender_role === 'student'
            ? msg.receiver_id : msg.sender_id
        const receiverRole = String(msg.sender_id) === String(tok.student_id) && msg.sender_role === 'student'
            ? msg.receiver_role : msg.sender_role
        // Never notify yourself and never notify super_admin via bell
        const isSelf       = String(receiverId) === String(tok.student_id) && receiverRole === 'student'
        // Write reaction notification for all roles including super_admin
        if (emoji && !isSelf) {
            services.createNotification(
                'reaction',
                'New Reaction',
                `${tok.student_firstname || 'student'} reacted ${emoji} to your message`,
                { reactor_id: tok.student_id, reactor_role: 'student', message_id: parseInt(req.params.id), receiver_id: receiverId, receiver_role: receiverRole, emoji }
            ).catch(() => {})
        }
        res.json({ ok: true, reactions })
        // Notify via bell (skip only self)
        if (emoji && !isSelf) {
            services.createMsgNotification(
                receiverId, receiverRole,
                tok.student_id, 'student', `${tok.student_firstname} ${tok.student_lastname}`,
                'reaction', null, emoji, parseInt(req.params.id)
            ).catch(() => {})
        }
    } catch (err) {
        res.status(500).json({ ok: false, message: err.message })
    }
})

student.post('/messages/pin/:id', async (req, res) => {
    try {
        const tok = services.verifyToken(services.removeBearer(req.headers['authorization']))
        if (!tok) return res.status(401).json({ ok: false })
        const msg = await services.pinMessage(parseInt(req.params.id), tok.student_id, 'student')
        res.json({ ok: true, message: msg })
    } catch (err) { res.status(500).json({ ok: false, message: err.message }) }
})

student.put('/messages/edit/:id', async (req, res) => {
    try {
        const tok = services.verifyToken(services.removeBearer(req.headers['authorization']))
        if (!tok) return res.status(401).json({ ok: false })
        const { content } = req.body
        await services.editMessage(parseInt(req.params.id), tok.student_id, 'student', content)
        res.json({ ok: true })
    } catch (err) { res.status(500).json({ ok: false, message: err.message }) }
})

// ── Contact-Only Guest Messaging (device-locked-out students) ──────────────────
// Uses the scoped guest_token from /authentication/student_contact_request

function verifyGuestToken(req) {
    const token = services.removeBearer(req.headers['authorization']);
    const tok = services.verifyToken(token);
    if (!tok || tok.scope !== 'contact_only') return null;
    return tok;
}

// GET /api/v1/students/contact/admins — list all admins and super admins
student.get('/contact/admins', async (req, res) => {
    try {
        const tok = verifyGuestToken(req);
        if (!tok) return res.status(401).json({ ok: false, message: 'Invalid or insufficient token.' });

        const db = require('../configuration/db');

        const admins = await new Promise((resolve, reject) => {
            db.execute(
                "SELECT admin_id AS id, admin_name AS name, 'admin' AS role, admin_profile_picture AS pic FROM admin_accounts",
                [],
                (err, rows) => err ? reject(err) : resolve(rows)
            );
        });

        const superAdmins = await new Promise((resolve, reject) => {
            db.execute(
                "SELECT super_admin_id AS id, super_admin_name AS name, 'super_admin' AS role, super_admin_profile_picture AS pic FROM super_admin_accounts",
                [],
                (err, rows) => err ? reject(err) : resolve(rows)
            );
        });

        res.json({ ok: true, contacts: [...admins, ...superAdmins] });
    } catch (err) {
        res.status(500).json({ ok: false, message: err.message });
    }
});

// GET /api/v1/students/contact/conversation?contact_id=&contact_role=
student.get('/contact/conversation', async (req, res) => {
    try {
        const tok = verifyGuestToken(req);
        if (!tok) return res.status(401).json({ ok: false, message: 'Invalid or insufficient token.' });

        const { contact_id, contact_role } = req.query;
        if (!contact_id || !contact_role) return res.status(400).json({ ok: false, message: 'contact_id and contact_role are required.' });

        await services.markMessagesRead(tok.student_id, 'student', parseInt(contact_id), contact_role);
        const messages = await services.getConversation(tok.student_id, 'student', parseInt(contact_id), contact_role, 100);
        res.json({ ok: true, messages });
    } catch (err) {
        res.status(500).json({ ok: false, message: err.message });
    }
});

// POST /api/v1/students/contact/send
student.post('/contact/send', async (req, res) => {
    try {
        const tok = verifyGuestToken(req);
        if (!tok) return res.status(401).json({ ok: false, message: 'Invalid or insufficient token.' });

        const { receiver_id, receiver_role, receiver_name, content } = req.body;
        if (!content?.trim()) return res.status(400).json({ ok: false, message: 'Message cannot be empty.' });
        if (!['admin', 'super_admin'].includes(receiver_role)) return res.status(403).json({ ok: false, message: 'You can only message admin or super admin.' });

        const senderName = `${tok.student_firstname} ${tok.student_lastname}`;
        const id = await services.sendMessage(
            tok.student_id, 'student', senderName,
            parseInt(receiver_id), receiver_role, receiver_name,
            content.trim(), null, null, null, null, null
        );
        res.json({ ok: true, id });
    } catch (err) {
        res.status(500).json({ ok: false, message: err.message });
    }
});

// POST /api/v1/students/contact/send — file upload support
const uploadContactFile = require('multer')({
    storage: require('multer').diskStorage({
        destination: (req, file, cb) => {
            const dir = require('path').join(__dirname, '../../uploads/message_files/');
            require('fs').mkdirSync(dir, { recursive: true });
            cb(null, dir);
        },
        filename: (req, file, cb) => {
            const unique = Date.now() + '-' + Math.round(Math.random()*1e9);
            cb(null, unique + '-' + file.originalname);
        }
    }),
    limits: { fileSize: 20 * 1024 * 1024 }
});

// Override the basic /contact/send with file-upload capable one
// (the previous plain-JSON one stays as fallback but this handles multipart)
student.post('/contact/send-file', uploadContactFile.single('file'), async (req, res) => {
    try {
        const tok = verifyGuestToken(req);
        if (!tok) return res.status(401).json({ ok: false, message: 'Invalid or insufficient token.' });

        const { receiver_id, receiver_role, receiver_name, content } = req.body;
        if (!content?.trim() && !req.file) return res.status(400).json({ ok: false, message: 'Message cannot be empty.' });
        if (!['admin', 'super_admin'].includes(receiver_role)) return res.status(403).json({ ok: false, message: 'You can only message admin or super admin.' });

        const senderName = `${tok.student_firstname} ${tok.student_lastname}`;
        const fileUrl  = req.file ? `/api/v1/uploads/message_files/${req.file.filename}` : null;
        const fileName = req.file ? req.file.originalname : null;
        const fileType = req.file ? req.file.mimetype : null;
        const id = await services.sendMessage(
            tok.student_id, 'student', senderName,
            parseInt(receiver_id), receiver_role, receiver_name,
            content?.trim() || null, fileUrl, fileName, fileType, null, null
        );
        res.json({ ok: true, id });
    } catch (err) {
        res.status(500).json({ ok: false, message: err.message });
    }
});

// POST /api/v1/students/contact/react/:id  (guest token)
student.post('/contact/react/:id', async (req, res) => {
    try {
        const tok = verifyGuestToken(req)
        if (!tok) return res.status(401).json({ ok: false, message: 'Unauthorized.' })
        const { emoji } = req.body
        const reactions = await services.reactToMessage(
            parseInt(req.params.id),
            tok.student_id, 'student',
            emoji || null
        )
        res.json({ ok: true, reactions })
    } catch (err) {
        res.status(500).json({ ok: false, message: err.message })
    }
})

// PUT /api/v1/students/contact/edit/:id
student.put('/contact/edit/:id', async (req, res) => {
    try {
        const tok = verifyGuestToken(req);
        if (!tok) return res.status(401).json({ ok: false, message: 'Invalid or insufficient token.' });
        const { content } = req.body;
        await services.editMessage(parseInt(req.params.id), tok.student_id, 'student', content);
        res.json({ ok: true });
    } catch (err) { res.status(500).json({ ok: false, message: err.message }); }
});

// DELETE /api/v1/students/contact/delete-for-me/:id
student.delete('/contact/delete-for-me/:id', async (req, res) => {
    try {
        const tok = verifyGuestToken(req);
        if (!tok) return res.status(401).json({ ok: false, message: 'Invalid or insufficient token.' });
        await services.deleteMessageForMe(parseInt(req.params.id), tok.student_id, 'student');
        res.json({ ok: true });
    } catch (err) { res.status(500).json({ ok: false, message: err.message }); }
});

// DELETE /api/v1/students/contact/unsend/:id
student.delete('/contact/unsend/:id', async (req, res) => {
    try {
        const tok = verifyGuestToken(req);
        if (!tok) return res.status(401).json({ ok: false, message: 'Invalid or insufficient token.' });
        await services.unsendMessage(parseInt(req.params.id), tok.student_id, 'student');
        res.json({ ok: true });
    } catch (err) { res.status(500).json({ ok: false, message: err.message }); }
});

// POST /api/v1/students/contact/pin/:id
student.post('/contact/pin/:id', async (req, res) => {
    try {
        const tok = verifyGuestToken(req);
        if (!tok) return res.status(401).json({ ok: false, message: 'Invalid or insufficient token.' });
        const msg = await services.pinMessage(parseInt(req.params.id), tok.student_id, 'student');
        res.json({ ok: true, message: msg });
    } catch (err) { res.status(500).json({ ok: false, message: err.message }); }
});
// Event check-in info — verify QR token and return event details (no location check yet)
student.post('/event_checkin_info', async (req, res) => {
    try {
        const token = services.removeBearer(req.headers['authorization'])
        const decodedToken = services.verifyToken(token)
        if (!decodedToken) return res.status(401).json({ ok: false, message: 'Invalid or expired token.' })
        const { qr_token } = req.body
        if (!qr_token) return res.status(400).json({ ok: false, message: 'QR token is required.' })
        const event = await services.getEventByQRToken(qr_token)
        if (!event) return res.status(404).json({ ok: false, message: 'Invalid or expired QR code.' })
        if (!event.event_name_set) return res.status(404).json({ ok: false, message: 'No active event found.' })
        if (!event.event_location) return res.status(400).json({ ok: false, message: 'Event location has not been set yet. Contact admin.' })
        res.json({ ok: true, event_name: event.event_name_set, radius: event.event_location_radius || 50 })
    } catch (err) {
        res.status(500).json({ ok: false, message: err.message || String(err) })
    }
})

// Event self check-in via QR scan
student.post('/event_self_checkin', async (req, res) => {
    try {
        const token = services.removeBearer(req.headers['authorization'])
        const decodedToken = services.verifyToken(token)
        if (!decodedToken) return res.status(401).json({ ok: false, message: 'Invalid or expired token.' })
        const { qr_token, status, latitude, longitude } = req.body
        if (!qr_token) return res.status(400).json({ ok: false, message: 'QR token is required.' })
        if (!status || !['TIME IN', 'TIME OUT'].includes(status)) return res.status(400).json({ ok: false, message: 'Invalid status.' })
        if (latitude == null || longitude == null) return res.status(400).json({ ok: false, message: 'Location is required for check-in.' })
        const result = await services.studentSelfEventCheckIn(
            decodedToken.student_id, status, qr_token,
            parseFloat(latitude), parseFloat(longitude),
            req.ip, req.body?.device_info || req.headers['x-device-info'] || req.headers['user-agent']
        )
        res.json(result)
    } catch (err) {
        res.status(400).json({ ok: false, message: err.message || String(err) })
    }
})

module.exports = student