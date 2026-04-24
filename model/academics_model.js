/* ============================================================
   ACADEMICS MODEL — server/model/academics.js
   Routes:
     POST   /api/v1/academics/login
     GET    /api/v1/academics/teachers
     GET    /api/v1/academics/subjects
     POST   /api/v1/academics/subjects
     DELETE /api/v1/academics/subjects/:id
     GET    /api/v1/academics/attendance
     POST   /api/v1/teacher/checkin          (called by teacher dashboard)
     POST   /api/v1/teacher/checkout         (called by teacher dashboard)
     GET    /api/v1/teacher/attendance/today (called by teacher dashboard)
     GET    /api/v1/teacher/attendance/my    (called by teacher dashboard)
   ============================================================ */

const express  = require('express');
const services = require('../controller/services');
const db       = require('../configuration/db');
const jwt      = require('jsonwebtoken');
const bcrypt   = require('bcrypt');

const academics = express.Router();
academics.use(express.json());

const JWT_SECRET = process.env.JWT_SECRET || 'attendancesystem_secret';

/* ── JWT middleware ── */
function authAcademics(req, res, next) {
    const header = req.headers['authorization'] || '';
    const token  = header.startsWith('Bearer ') ? header.slice(7) : null;
    if (!token) return res.status(401).json({ ok: false, message: 'Unauthorized.' });
    try {
        req.academics = jwt.verify(token, JWT_SECRET);
        next();
    } catch {
        res.status(401).json({ ok: false, message: 'Token expired or invalid.' });
    }
}

function authTeacher(req, res, next) {
    const header = req.headers['authorization'] || '';
    const token  = header.startsWith('Bearer ') ? header.slice(7) : null;
    if (!token) return res.status(401).json({ ok: false, message: 'Unauthorized.' });
    try {
        req.teacher = jwt.verify(token, JWT_SECRET);
        next();
    } catch {
        res.status(401).json({ ok: false, message: 'Token expired or invalid.' });
    }
}

/* ── Helper: promisify DB query ── */
function query(sql, params = []) {
    return new Promise((resolve, reject) => {
        db.query(sql, params, (err, results) => {
            if (err) reject(err);
            else resolve(results);
        });
    });
}

/* ===========================================================
   ACADEMICS ROUTES
   =========================================================== */

/* POST /api/v1/academics/login */
academics.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password)
            return res.json({ ok: false, message: 'Email and password are required.' });

        const rows = await query(
            'SELECT * FROM academics_accounts WHERE academics_email = ?', [email]
        );
        if (!rows.length)
            return res.json({ ok: false, message: 'Invalid email or password.' });

        const account = rows[0];
        const match   = await bcrypt.compare(password, account.academics_password);
        if (!match)
            return res.json({ ok: false, message: 'Invalid email or password.' });

        const token = jwt.sign(
            { id: account.academics_id, role: 'academics', name: account.academics_name },
            JWT_SECRET,
            { expiresIn: '12h' }
        );

        res.json({
            ok: true,
            token,
            academics_id: account.academics_id,
            name: account.academics_name
        });
    } catch (err) {
        console.error('[Academics Login]', err);
        res.status(500).json({ ok: false, message: 'Server error.' });
    }
});

/* GET /api/v1/academics/teachers */
academics.get('/teachers', authAcademics, async (req, res) => {
    try {
        const teachers = await query(
            `SELECT teacher_id, teacher_name, teacher_email,
                    teacher_barcode_scanner_serial_number
             FROM teacher ORDER BY teacher_name`
        );
        res.json({ ok: true, teachers });
    } catch (err) {
        res.status(500).json({ ok: false, message: err.message });
    }
});

/* GET /api/v1/academics/subjects */
academics.get('/subjects', authAcademics, async (req, res) => {
    try {
        const subjects = await query(
            `SELECT ts.*, t.teacher_name, t.teacher_email
             FROM teacher_subjects ts
             JOIN teacher t ON t.teacher_id = ts.teacher_id
             ORDER BY ts.created_at DESC`
        );
        res.json({ ok: true, subjects });
    } catch (err) {
        res.status(500).json({ ok: false, message: err.message });
    }
});

/* POST /api/v1/academics/subjects */
academics.post('/subjects', authAcademics, async (req, res) => {
    try {
        const { teacher_id, subject_name, schedule_days, semester_end } = req.body;
        if (!teacher_id || !subject_name || !schedule_days || !semester_end)
            return res.json({ ok: false, message: 'All fields are required.' });

        await query(
            `INSERT INTO teacher_subjects
               (teacher_id, subject_name, schedule_days, semester_end, assigned_by)
             VALUES (?, ?, ?, ?, ?)`,
            [teacher_id, subject_name, schedule_days, semester_end, req.academics.id]
        );
        res.json({ ok: true, message: 'Subject assigned successfully.' });
    } catch (err) {
        res.status(500).json({ ok: false, message: err.message });
    }
});

/* DELETE /api/v1/academics/subjects/:id */
academics.delete('/subjects/:id', authAcademics, async (req, res) => {
    try {
        await query('DELETE FROM teacher_subjects WHERE subject_id = ?', [req.params.id]);
        res.json({ ok: true, message: 'Subject removed.' });
    } catch (err) {
        res.status(500).json({ ok: false, message: err.message });
    }
});

/* GET /api/v1/academics/attendance?date=YYYY-MM-DD&teacher_id=&status= */
academics.get('/attendance', authAcademics, async (req, res) => {
    try {
        const { date, teacher_id, status } = req.query;
        if (!date) return res.json({ ok: false, message: 'Date is required.' });

        let sql = `
            SELECT ta.*, t.teacher_name, t.teacher_email
            FROM teacher_attendance ta
            JOIN teacher t ON t.teacher_id = ta.teacher_id
            WHERE ta.attendance_date = ?`;
        const params = [date];

        if (teacher_id) { sql += ' AND ta.teacher_id = ?'; params.push(teacher_id); }
        if (status)      { sql += ' AND ta.status = ?';     params.push(status); }
        sql += ' ORDER BY t.teacher_name';

        const records = await query(sql, params);
        res.json({ ok: true, records });
    } catch (err) {
        res.status(500).json({ ok: false, message: err.message });
    }
});

/* ===========================================================
   TEACHER ATTENDANCE ROUTES  (mounted separately on teacher model)
   Export these and mount in controller.js under /api/v1/teacher
   =========================================================== */

const teacherAttRouter = express.Router();
teacherAttRouter.use(express.json());

/* GET /api/v1/teacher/attendance/today
   Returns today's scheduled subjects + attendance status for the logged-in teacher */
teacherAttRouter.get('/attendance/today', authTeacher, async (req, res) => {
    try {
        const teacherId = req.teacher.id;

        // Get today's scheduled subjects
        const subjects = await query(
            `SELECT ts.subject_id, ts.subject_name, ts.schedule_days, ts.semester_end
             FROM teacher_subjects ts
             WHERE ts.teacher_id = ?
               AND ts.semester_end >= CURDATE()
               AND FIND_IN_SET(DAYNAME(CURDATE()), ts.schedule_days) > 0`,
            [teacherId]
        );

        // Get today's attendance record
        const att = await query(
            `SELECT * FROM teacher_attendance
             WHERE teacher_id = ? AND attendance_date = CURDATE()`,
            [teacherId]
        );

        // Get teacher's QR serial
        const teacher = await query(
            'SELECT teacher_barcode_scanner_serial_number, teacher_name FROM teacher WHERE teacher_id = ?',
            [teacherId]
        );

        res.json({
            ok: true,
            subjects,
            attendance: att[0] || null,
            qr_serial:  teacher[0]?.teacher_barcode_scanner_serial_number || '',
            teacher_name: teacher[0]?.teacher_name || ''
        });
    } catch (err) {
        res.status(500).json({ ok: false, message: err.message });
    }
});

/* POST /api/v1/teacher/checkin
   Verifies QR serial matches teacher's stored serial, records time-in */
teacherAttRouter.post('/checkin', authTeacher, async (req, res) => {
    try {
        const teacherId = req.teacher.id;
        const { qr_serial } = req.body;

        // Verify QR matches teacher
        const teacher = await query(
            'SELECT teacher_barcode_scanner_serial_number FROM teacher WHERE teacher_id = ?',
            [teacherId]
        );
        if (!teacher.length || teacher[0].teacher_barcode_scanner_serial_number !== qr_serial)
            return res.json({ ok: false, message: 'Invalid QR code. Attendance not recorded.' });

        // Check if already checked in today
        const existing = await query(
            'SELECT * FROM teacher_attendance WHERE teacher_id = ? AND attendance_date = CURDATE()',
            [teacherId]
        );
        if (existing.length && existing[0].time_in)
            return res.json({ ok: false, message: 'You have already checked in today.', attendance: existing[0] });

        // Check if has scheduled subject today
        const scheduled = await query(
            `SELECT COUNT(*) AS cnt FROM teacher_subjects
             WHERE teacher_id = ?
               AND semester_end >= CURDATE()
               AND FIND_IN_SET(DAYNAME(CURDATE()), schedule_days) > 0`,
            [teacherId]
        );
        if (!scheduled[0].cnt)
            return res.json({ ok: false, message: 'You have no scheduled subject today.' });

        // Upsert attendance record
        await query(
            `INSERT INTO teacher_attendance
               (teacher_id, attendance_date, time_in, status, qr_serial)
             VALUES (?, CURDATE(), CURTIME(), 'Present', ?)
             ON DUPLICATE KEY UPDATE
               time_in = CURTIME(), status = 'Present', qr_serial = VALUES(qr_serial)`,
            [teacherId, qr_serial]
        );

        const updated = await query(
            'SELECT * FROM teacher_attendance WHERE teacher_id = ? AND attendance_date = CURDATE()',
            [teacherId]
        );

        res.json({ ok: true, message: 'Check-in recorded successfully!', attendance: updated[0] });
    } catch (err) {
        res.status(500).json({ ok: false, message: err.message });
    }
});

/* POST /api/v1/teacher/checkout */
teacherAttRouter.post('/checkout', authTeacher, async (req, res) => {
    try {
        const teacherId = req.teacher.id;
        const { qr_serial } = req.body;

        // Verify QR
        const teacher = await query(
            'SELECT teacher_barcode_scanner_serial_number FROM teacher WHERE teacher_id = ?',
            [teacherId]
        );
        if (!teacher.length || teacher[0].teacher_barcode_scanner_serial_number !== qr_serial)
            return res.json({ ok: false, message: 'Invalid QR code.' });

        const existing = await query(
            'SELECT * FROM teacher_attendance WHERE teacher_id = ? AND attendance_date = CURDATE()',
            [teacherId]
        );
        if (!existing.length || !existing[0].time_in)
            return res.json({ ok: false, message: 'You have not checked in yet today.' });
        if (existing[0].time_out)
            return res.json({ ok: false, message: 'You have already checked out today.', attendance: existing[0] });

        await query(
            `UPDATE teacher_attendance SET time_out = CURTIME()
             WHERE teacher_id = ? AND attendance_date = CURDATE()`,
            [teacherId]
        );

        const updated = await query(
            'SELECT * FROM teacher_attendance WHERE teacher_id = ? AND attendance_date = CURDATE()',
            [teacherId]
        );

        res.json({ ok: true, message: 'Check-out recorded successfully!', attendance: updated[0] });
    } catch (err) {
        res.status(500).json({ ok: false, message: err.message });
    }
});

/* GET /api/v1/teacher/attendance/my?limit=30 — teacher's own attendance history */
teacherAttRouter.get('/attendance/my', authTeacher, async (req, res) => {
    try {
        const limit   = Math.min(parseInt(req.query.limit) || 30, 100);
        const records = await query(
            `SELECT * FROM teacher_attendance
             WHERE teacher_id = ?
             ORDER BY attendance_date DESC LIMIT ?`,
            [req.teacher.id, limit]
        );
        res.json({ ok: true, records });
    } catch (err) {
        res.status(500).json({ ok: false, message: err.message });
    }
});

/* Export both routers */
module.exports = { academics, teacherAttRouter };
