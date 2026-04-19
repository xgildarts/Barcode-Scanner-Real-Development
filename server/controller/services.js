const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const db = require('../configuration/db');
const nodemailer = require('nodemailer')
const SALT_ROUNDS = 10
const JWT_SECRET = process.env.TOKEN_KEYWORD;

// ============================================================
// TYPING STATUS — in-memory, no DB needed
// ============================================================
const _typingStore = new Map() // key: "userId:role:contactId:contactRole" → timestamp
const TYPING_TTL_MS = 5000    // 5 seconds

function setTypingStatus(userId, userRole, contactId, contactRole) {
    const key = `${userId}:${userRole}:${contactId}:${contactRole}`
    _typingStore.set(key, Date.now())
}

function getTypingStatus(userId, userRole, contactId, contactRole) {
    // Is userId:userRole currently typing to contactId:contactRole?
    const key = `${userId}:${userRole}:${contactId}:${contactRole}`
    const ts = _typingStore.get(key)
    return !!ts && (Date.now() - ts) < TYPING_TTL_MS
}

// ============================================================
// TOKEN BLACKLIST
// Tokens are added here on logout. verifyToken checks this set
// before accepting any token. Entries auto-expire when the JWT
// itself would have expired, keeping memory bounded.
// ============================================================
const tokenBlacklist = new Map() // token -> expiresAt (ms)

function blacklistToken(token) {
    try {
        const decoded = jwt.decode(token)
        if (decoded && decoded.exp) {
            tokenBlacklist.set(token, decoded.exp * 1000)
        }
    } catch (_) {}
}

function isTokenBlacklisted(token) {
    if (!tokenBlacklist.has(token)) return false
    // If the JWT has already expired naturally, clean it up
    if (Date.now() > tokenBlacklist.get(token)) {
        tokenBlacklist.delete(token)
        return false
    }
    return true
}

// Prune expired entries every hour so the Map doesn't grow indefinitely
setInterval(() => {
    const now = Date.now()
    for (const [token, exp] of tokenBlacklist.entries()) {
        if (now > exp) tokenBlacklist.delete(token)
    }
}, 60 * 60 * 1000)



// ============================================================
// EMAIL / OTP (Forgot Password)
// ============================================================
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: { user: process.env.GMAIL_USER, pass: process.env.GMAIL_PASS }
})

const otpStore = {}
const OTP_EXPIRY_MS = 5 * 60 * 1000

function generateOTP() {
    return Math.floor(100000 + Math.random() * 900000).toString()
}

async function sendPasswordResetOTP(email) {
    const teacher = await new Promise((resolve, reject) => {
        db.execute('SELECT teacher_id, teacher_name FROM teacher WHERE teacher_email = ?', [email],
            (err, rows) => { if (err) return reject(err); resolve(rows[0] ?? null) })
    })
    if (!teacher) throw new Error('No account found with that email address.')
    const otp = generateOTP()
    otpStore[email] = { otp, expiresAt: Date.now() + OTP_EXPIRY_MS }
    await transporter.sendMail({
        from: `"PanPacific University" <${process.env.GMAIL_USER}>`,
        to: email,
        subject: 'Your Password Reset Code',
        html: `<div style="font-family:Arial,sans-serif;max-width:480px;margin:auto;padding:32px;border:1px solid #e0e0e0;border-radius:12px">
            <h2 style="color:#3d6b6b">Password Reset</h2>
            <p>Hello <strong>${teacher.teacher_name}</strong>, use the code below. Expires in <strong>5 minutes</strong>.</p>
            <div style="font-size:36px;font-weight:700;letter-spacing:10px;color:#3d6b6b;text-align:center;padding:24px 0">${otp}</div>
            <p style="color:#999;font-size:12px">If you did not request this, ignore this email.</p></div>`
    })
    return 'OTP sent successfully.'
}

function verifyPasswordResetOTP(email, otp) {
    const record = otpStore[email]
    if (!record) throw new Error('No OTP requested for this email.')
    if (Date.now() > record.expiresAt) { delete otpStore[email]; throw new Error('OTP has expired. Please request a new one.') }
    if (record.otp !== otp) throw new Error('Incorrect OTP. Please try again.')
    otpStore[email].verified = true
    return true
}

async function resetPasswordWithOTP(email, newPassword) {
    const record = otpStore[email]
    if (!record || !record.verified) throw new Error('OTP not verified.')
    if (Date.now() > record.expiresAt) { delete otpStore[email]; throw new Error('OTP has expired. Please start over.') }
    const hashed = await bcrypt.hash(newPassword, SALT_ROUNDS)
    await new Promise((resolve, reject) => {
        db.execute('UPDATE teacher SET teacher_password = ? WHERE teacher_email = ?', [hashed, email],
            (err, result) => { if (err) return reject(err); if (result.affectedRows === 0) return reject(new Error('Teacher not found.')); resolve() })
    })
    delete otpStore[email]
    return 'Password reset successfully.'
}

// ============================================================
// ADMIN FORGOT PASSWORD OTP
// Uses 'admin:' prefix in otpStore to avoid colliding with teacher OTPs
// ============================================================
async function sendAdminPasswordResetOTP(email) {
    const admin = await new Promise((resolve, reject) => {
        db.execute('SELECT admin_id, admin_name FROM admin_accounts WHERE admin_email = ?', [email],
            (err, rows) => { if (err) return reject(err); resolve(rows[0] ?? null) })
    })
    if (!admin) throw new Error('No admin account found with that email address.')
    const otp = generateOTP()
    otpStore[`admin:${email}`] = { otp, expiresAt: Date.now() + OTP_EXPIRY_MS }
    await transporter.sendMail({
        from: `"PanPacific University" <${process.env.GMAIL_USER}>`,
        to: email,
        subject: 'Admin Password Reset Code',
        html: `<div style="font-family:Arial,sans-serif;max-width:480px;margin:auto;padding:32px;border:1px solid #e0e0e0;border-radius:12px">
            <h2 style="color:#3d6b6b">Admin Password Reset</h2>
            <p>Hello <strong>${admin.admin_name}</strong>, use the code below. Expires in <strong>5 minutes</strong>.</p>
            <div style="font-size:36px;font-weight:700;letter-spacing:10px;color:#3d6b6b;text-align:center;padding:24px 0">${otp}</div>
            <p style="color:#999;font-size:12px">If you did not request this, ignore this email.</p></div>`
    })
    return 'OTP sent successfully.'
}

function verifyAdminPasswordResetOTP(email, otp) {
    const record = otpStore[`admin:${email}`]
    if (!record) throw new Error('No OTP requested for this email.')
    if (Date.now() > record.expiresAt) { delete otpStore[`admin:${email}`]; throw new Error('OTP has expired. Please request a new one.') }
    if (record.otp !== otp) throw new Error('Incorrect OTP. Please try again.')
    otpStore[`admin:${email}`].verified = true
    return true
}

async function resetAdminPasswordWithOTP(email, newPassword) {
    const record = otpStore[`admin:${email}`]
    if (!record || !record.verified) throw new Error('OTP not verified.')
    if (Date.now() > record.expiresAt) { delete otpStore[`admin:${email}`]; throw new Error('OTP has expired. Please start over.') }
    const hashed = await bcrypt.hash(newPassword, SALT_ROUNDS)
    await new Promise((resolve, reject) => {
        db.execute('UPDATE admin_accounts SET admin_password = ? WHERE admin_email = ?', [hashed, email],
            (err, result) => { if (err) return reject(err); if (result.affectedRows === 0) return reject(new Error('Admin not found.')); resolve() })
    })
    delete otpStore[`admin:${email}`]
    return 'Password reset successfully.'
}

// ============================================================
// STUDENT FORGOT PASSWORD OTP
// Uses 'student:' prefix in otpStore to avoid collisions
// ============================================================
async function sendStudentPasswordResetOTP(email) {
    const student = await new Promise((resolve, reject) => {
        db.execute('SELECT student_id, student_firstname FROM student_accounts WHERE student_email = ?', [email],
            (err, rows) => { if (err) return reject(err); resolve(rows[0] ?? null) })
    })
    if (!student) throw new Error('No account found with that email address.')
    const otp = generateOTP()
    otpStore[`student:${email}`] = { otp, expiresAt: Date.now() + OTP_EXPIRY_MS }
    await transporter.sendMail({
        from: `"PanPacific University" <${process.env.GMAIL_USER}>`,
        to: email,
        subject: 'Your Password Reset Code',
        html: `<div style="font-family:Arial,sans-serif;max-width:480px;margin:auto;padding:32px;border:1px solid #e0e0e0;border-radius:12px">
            <h2 style="color:#3d6b6b">Password Reset</h2>
            <p>Hello <strong>${student.student_firstname}</strong>, use the code below. Expires in <strong>5 minutes</strong>.</p>
            <div style="font-size:36px;font-weight:700;letter-spacing:10px;color:#3d6b6b;text-align:center;padding:24px 0">${otp}</div>
            <p style="color:#999;font-size:12px">If you did not request this, ignore this email.</p></div>`
    })
    return 'OTP sent successfully.'
}

function verifyStudentPasswordResetOTP(email, otp) {
    const record = otpStore[`student:${email}`]
    if (!record) throw new Error('No OTP requested for this email.')
    if (Date.now() > record.expiresAt) { delete otpStore[`student:${email}`]; throw new Error('OTP has expired. Please request a new one.') }
    if (record.otp !== otp) throw new Error('Incorrect OTP. Please try again.')
    otpStore[`student:${email}`].verified = true
    return true
}

async function resetStudentPasswordWithOTP(email, newPassword) {
    const record = otpStore[`student:${email}`]
    if (!record || !record.verified) throw new Error('OTP not verified.')
    if (Date.now() > record.expiresAt) { delete otpStore[`student:${email}`]; throw new Error('OTP has expired. Please start over.') }
    const hashed = await bcrypt.hash(newPassword, SALT_ROUNDS)
    await new Promise((resolve, reject) => {
        db.execute('UPDATE student_accounts SET password = ? WHERE student_email = ?', [hashed, email],
            (err, result) => { if (err) return reject(err); if (result.affectedRows === 0) return reject(new Error('Student not found.')); resolve() })
    })
    delete otpStore[`student:${email}`]
    return 'Password reset successfully.'
}

// ============================================================
// GUARD FORGOT PASSWORD OTP
// Uses 'guard:' prefix in otpStore to avoid collisions
// ============================================================
async function sendGuardPasswordResetOTP(email) {
    const guard = await new Promise((resolve, reject) => {
        db.execute('SELECT guard_id, guard_name FROM guards WHERE guard_email = ?', [email],
            (err, rows) => { if (err) return reject(err); resolve(rows[0] ?? null) })
    })
    if (!guard) throw new Error('No account found with that email address.')
    const otp = generateOTP()
    otpStore[`guard:${email}`] = { otp, expiresAt: Date.now() + OTP_EXPIRY_MS }
    await transporter.sendMail({
        from: `"PanPacific University" <${process.env.GMAIL_USER}>`,
        to: email,
        subject: 'Your Password Reset Code',
        html: `<div style="font-family:Arial,sans-serif;max-width:480px;margin:auto;padding:32px;border:1px solid #e0e0e0;border-radius:12px">
            <h2 style="color:#3d6b6b">Password Reset</h2>
            <p>Hello <strong>${guard.guard_name}</strong>, use the code below. Expires in <strong>5 minutes</strong>.</p>
            <div style="font-size:36px;font-weight:700;letter-spacing:10px;color:#3d6b6b;text-align:center;padding:24px 0">${otp}</div>
            <p style="color:#999;font-size:12px">If you did not request this, ignore this email.</p></div>`
    })
    return 'OTP sent successfully.'
}

function verifyGuardPasswordResetOTP(email, otp) {
    const record = otpStore[`guard:${email}`]
    if (!record) throw new Error('No OTP requested for this email.')
    if (Date.now() > record.expiresAt) { delete otpStore[`guard:${email}`]; throw new Error('OTP has expired. Please request a new one.') }
    if (record.otp !== otp) throw new Error('Incorrect OTP. Please try again.')
    otpStore[`guard:${email}`].verified = true
    return true
}

async function resetGuardPasswordWithOTP(email, newPassword) {
    const record = otpStore[`guard:${email}`]
    if (!record || !record.verified) throw new Error('OTP not verified.')
    if (Date.now() > record.expiresAt) { delete otpStore[`guard:${email}`]; throw new Error('OTP has expired. Please start over.') }
    const hashed = await bcrypt.hash(newPassword, SALT_ROUNDS)
    await new Promise((resolve, reject) => {
        db.execute('UPDATE guards SET guard_password = ? WHERE guard_email = ?', [hashed, email],
            (err, result) => { if (err) return reject(err); if (result.affectedRows === 0) return reject(new Error('Guard not found.')); resolve() })
    })
    delete otpStore[`guard:${email}`]
    return 'Password reset successfully.'
}

// ============================================================
// LOCATION HELPERS
// ============================================================
function haversineDistance(lat1, lng1, lat2, lng2) {
    const R = 6371000
    const toRad = d => d * Math.PI / 180
    const dLat = toRad(lat2 - lat1)
    const dLng = toRad(lng2 - lng1)
    const a = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}

async function getTeacherLocationBySerial(teacherSerialNumber) {
    return new Promise((resolve, reject) => {
        db.execute('SELECT teacher_location, teacher_location_radius FROM teacher WHERE teacher_barcode_scanner_serial_number = ?',
            [teacherSerialNumber], (err, rows) => { if (err) return reject(err); resolve(rows[0] ?? null) })
    })
}

async function getTeacherSerialByStudentIDNumber(studentIDNumber) {
    return new Promise((resolve, reject) => {
        db.execute('SELECT teacher_barcode_scanner_serial_number FROM student_records_regular_class WHERE student_id_number = ?',
            [studentIDNumber], (err, rows) => { if (err) return reject(err); resolve(rows[0] ?? null) })
    })
}

// teacherSerialNumber is optional — if provided, checks THAT specific teacher's location.
// If omitted, falls back to the first teacher the student is registered under (old behaviour).
// Always pass it from the student app so a student can't bypass by being in a different teacher's range.
async function verifyStudentLocation(studentIDNumber, studentLat, studentLng, teacherSerialNumber) {
    let serial = teacherSerialNumber
    if (!serial) {
        // Fallback: look up the first registered teacher for this student
        const studentTeacher = await getTeacherSerialByStudentIDNumber(studentIDNumber)
        if (!studentTeacher) throw new Error('Student not registered to any class.')
        serial = studentTeacher.teacher_barcode_scanner_serial_number
    }
    const teacherData = await getTeacherLocationBySerial(serial)
    if (!teacherData || !teacherData.teacher_location) throw new Error('Teacher has not set a location yet.')
    const { latitude, longitude } = JSON.parse(teacherData.teacher_location)
    const radius = teacherData.teacher_location_radius || 50
    const distance = Math.round(haversineDistance(latitude, longitude, studentLat, studentLng))
    return { withinRange: distance <= radius, distance, radius }
}

async function setTeacherLocation(teacherID, latitude, longitude, radius) {
    return new Promise((resolve, reject) => {
        db.execute(
            `UPDATE teacher SET teacher_location = ?, teacher_location_radius = ? WHERE teacher_id = ?`,
            [JSON.stringify({ latitude, longitude }), radius, teacherID],
            (err, result) => {
                if (err) return reject(err)
                if (result.affectedRows === 0) return reject(new Error('Teacher not found.'))
                resolve('Location updated.')
            }
        )
    })
}

// ============================================================
// MANUAL ATTENDANCE
// ============================================================
async function manualInsertAttendance(
    student_id, student_id_number, student_firstname, student_middlename,
    student_lastname, student_email, student_year_level, student_guardian_number,
    student_program, teacher_barcode_scanner_serial_number,
    teacherId, teacherName, ip, userAgent
) {
    const inClass = await checkStudentToRegularClass(student_id_number)
    if (!inClass) throw new Error('Student is not registered to this subject.')

    const alreadyIn = await checkStudentIfAlreadyExistsInAttendance(student_id_number, teacher_barcode_scanner_serial_number)
    if (alreadyIn) throw new Error('Student is already recorded in attendance for this class.')

    const subjectData = await checkYearLevelAndSerialNumber(teacher_barcode_scanner_serial_number, student_year_level)
    if (subjectData.length === 0) throw new Error('No subject set for this year level. Please set a subject first.')

    await new Promise((resolve, reject) => {
        db.execute(
            `INSERT INTO attendance_record (student_id, student_id_number, student_firstname, student_middlename, student_lastname, year_level, subject, student_program, teacher_barcode_scanner_serial_number)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [student_id, student_id_number, student_firstname, student_middlename, student_lastname,
                student_year_level, subjectData[0].subject_name_set, student_program, teacher_barcode_scanner_serial_number],
            (err) => { if (err) return reject(err); resolve() }
        )
    })

    await insertStudentAttendanceHistory(
        student_id, student_id_number, student_firstname, student_middlename, student_lastname,
        student_year_level, subjectData[0].subject_name_set, student_program, teacher_barcode_scanner_serial_number
    )

    const _now = new Date().toLocaleString('en-PH', { timeZone: 'Asia/Manila', hour: '2-digit', minute: '2-digit', hour12: true })
    await sendSMS(student_guardian_number,
        `Pan Pacific University: ${student_firstname} ${student_middlename ? student_middlename.charAt(0) + '.' : ''} ${student_lastname} attended ${subjectData[0].subject_name_set} at ${_now} today.`)

    writeActivityLog(teacherId || null, teacherName || null, 'teacher', 'MANUAL_ATTENDANCE', 'Class Attendance', student_id_number, `${student_firstname} ${student_middlename}. ${student_lastname}`, `Manual entry by ${teacherName || 'Unknown Teacher'} — Program: ${student_program}, Year: ${student_year_level}`, ip || null, userAgent || null)
    return 'Attendance recorded successfully!'
}

const clickSendUsername = 'steven.agustin.ecoast@panpacificu.edu.ph';   // from dashboard
const clickSendAPI = 'FA142E33-E8CD-0664-FB80-64EBBE1BAFAC';    // from dashboard

// // Create SMS message object
async function sendSMS(phone, message) {
    try {
        // Normalize Philippine numbers: 09XXXXXXXXX → +639XXXXXXXXX
        // Normalize Philippine mobile numbers to E.164 (+639XXXXXXXXX)
        let normalizedPhone = (phone || '').toString().trim().replace(/[\s\-().]/g, '')
        if (normalizedPhone.startsWith('09') && normalizedPhone.length === 11) {
            // 09XXXXXXXXX → +639XXXXXXXXX
            normalizedPhone = '+63' + normalizedPhone.slice(1)
        } else if (normalizedPhone.startsWith('9') && normalizedPhone.length === 10) {
            // 9XXXXXXXXX → +639XXXXXXXXX
            normalizedPhone = '+63' + normalizedPhone
        } else if (normalizedPhone.startsWith('639') && normalizedPhone.length === 12 && !normalizedPhone.startsWith('+')) {
            // 639XXXXXXXXX → +639XXXXXXXXX (strict: exactly 12 digits)
            normalizedPhone = '+' + normalizedPhone
        } else if (normalizedPhone.startsWith('+639') && normalizedPhone.length === 13) {
            // Already valid E.164 — no change
        } else {
            console.warn('[SMS] Invalid or unrecognized phone format, skipping:', phone)
            return
        }

        const resp = await fetch('https://rest.clicksend.com/v3/sms/send', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Basic ' + Buffer.from(clickSendUsername + ':' + clickSendAPI).toString('base64')
            },
            body: JSON.stringify({
                messages: [
                    {
                        source: 'nodejs',
                        body: message,
                        to: normalizedPhone
                    }
                ]
            })
        });

        const data = await resp.json();
        console.log('SMS Response:', data);
    } catch (err) {
        console.error('Error sending SMS:', err);
    }
}



// Generate Barcode
const generateBarcode = () => {
    const timestamp = Date.now().toString();
    const randomSuffix = Math.floor(1000 + Math.random() * 9000).toString();
    return 'BC' + timestamp + randomSuffix;
}

// Generate Teacher Serial Number
const generateTeacherSerialNumber = () => {
    const timestamp = Date.now().toString();
    const randomSuffix = Math.floor(1000 + Math.random() * 9000).toString();
    return 'TSN' + timestamp + randomSuffix;
}

// Generate Device ID
const generateDeviceID = () => {
    const timestamp = Date.now().toString();
    const randomSuffix = Math.floor(1000 + Math.random() * 9000).toString();
    return 'DEV' + timestamp + randomSuffix;
}

// Hash Password
async function hashPassword(password) {
    return await bcrypt.hash(password, SALT_ROUNDS);
}

// De-hashed Password
async function comparePassword(password, hashedPassword) {
    return await bcrypt.compare(password, hashedPassword);
}

// Find student account duplication
function checkStudentAccountDuplication(email, idNumber) {
    const checkQuery = `
    SELECT 1 FROM student_accounts
    WHERE student_email = ? OR student_id_number = ?
    LIMIT 1
    `;
    return new Promise((resolve, reject) => {
        db.execute(checkQuery, [email, idNumber], async (err, result) => {
            if (err) {
                return reject(err)
            }
            resolve(result.length > 0)
        });
    })
}

// Student Registration
function studentRegistration(
    idNumber,
    firstName,
    middleName,
    lastName,
    email,
    hashedPassword,
    yearLevel,
    guardianContact,
    program,
    locationGenerated,
    barcode,
    deviceID
) {
    const query = `
        INSERT INTO student_accounts (
            student_id_number,
            student_firstname,
            student_middlename,
            student_lastname,
            student_email,
            password,
            student_year_level,
            student_guardian_number,
            student_program,
            location_generated,
            barcode,
            device_id
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const values = [
        idNumber,
        firstName,
        middleName,
        lastName,
        email,
        hashedPassword,
        yearLevel,
        guardianContact,
        program,
        locationGenerated,
        barcode,
        deviceID
    ];

    return new Promise((resolve, reject) => {
        db.execute(query, values, (err, result) => {
            if (err) {
                return reject(err);
            }
            resolve(result);
        });
    });
}

// Student Login

// ============================================================
// LOGGING HELPERS
// ============================================================
function writeLoginLog(userId, userName, userEmail, role, status, ip, userAgent) {
    const cleanIp = (ip || '').replace(/^::ffff:/, '') || null;
    const params  = [userId || null, userName || null, userEmail || null, role, status, cleanIp, userAgent || null];

    function tryInsert(attempt) {
        db.execute(
            'INSERT INTO system_login_logs (user_id, user_name, user_email, role, status, ip_address, device_info) VALUES (?, ?, ?, ?, ?, ?, ?)',
            params,
            (err) => {
                if (!err) return; // success
                console.error('[LoginLog] INSERT failed (attempt ' + attempt + '):', err.message, '| role:', role, '| status:', status);
                if (attempt < 3) {
                    // Retry up to 3 times with a small delay
                    setTimeout(() => tryInsert(attempt + 1), 300 * attempt);
                } else {
                    // Final fallback: insert without ip/device columns in case they don't exist
                    db.execute(
                        'INSERT INTO system_login_logs (user_id, user_name, user_email, role, status) VALUES (?, ?, ?, ?, ?)',
                        [userId || null, userName || null, userEmail || null, role, status],
                        (err2) => {
                            if (err2) {
                                console.error('[LoginLog] Fallback INSERT failed:', err2.message);
                                // Last-resort: minimal insert with only required columns
                                db.execute(
                                    'INSERT INTO system_login_logs (role, status) VALUES (?, ?)',
                                    [role, status],
                                    (err3) => { if (err3) console.error('[LoginLog] Minimal INSERT failed:', err3.message); }
                                );
                            }
                        }
                    );
                }
            }
        );
    }
    tryInsert(1);
}

// actorRole: 'student' | 'teacher' | 'guard' | 'admin' | 'super_admin'
function writeActivityLog(actorId, actorName, actorRole, action, targetType, targetId, targetName, details, ip, userAgent) {
    const cleanIp = (ip || '').replace(/^::ffff:/, '') || null;
    db.execute(
        'INSERT INTO system_activity_logs (actor_id, actor_name, actor_role, action, target_type, target_id, target_name, details, ip_address, device_info) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [actorId || null, actorName || null, actorRole || null, action, targetType || null, String(targetId || ''), targetName || null, details || null, cleanIp, userAgent || null],
        (err) => {
            if (err) {
                // Fallback if columns not yet added
                db.execute(
                    'INSERT INTO system_activity_logs (actor_id, actor_name, actor_role, action, target_type, target_id, target_name, details) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
                    [actorId || null, actorName || null, actorRole || null, action, targetType || null, String(targetId || ''), targetName || null, details || null],
                    (err2) => { if (err2) console.error('[ActivityLog]', err2) }
                )
            }
        }
    )
}

async function studentLogin(email, password, device_id, ip, userAgent) {

    const query = `
        SELECT  
            student_id,
            student_id_number, 
            student_firstname, 
            student_middlename, 
            student_lastname, 
            student_email, 
            password,
            student_year_level,
            student_guardian_number,
            student_program,
            device_id
        FROM student_accounts
        WHERE student_email = ?
        LIMIT 1
    `;

    return new Promise(async (resolve, reject) => {
        db.execute(query, [email], async (err, result) => {

            if (err) return reject({ message: err });

            if (result.length === 0) {
                writeLoginLog(null, null, email, 'student', 'FAILED', ip, userAgent);
                return reject('Invalid email or password');
            }

            const row = result[0];

            // Strict device binding — fingerprint must match what was registered
            if (!await deviceIDChecker(device_id, email)) {
                writeLoginLog(row.student_id, `${row.student_firstname} ${row.student_lastname}`, email, 'student', 'FAILED', ip, userAgent);
                return reject('This device is not registered to your account. Please contact your administrator to reset your device.')
            }

            // ✅ Compare password
            const isMatch = await comparePassword(password, row.password);

            // Remove password before sending a payload
            delete row.password

            if (isMatch) {
                const token = generateToken(row)
                writeLoginLog(row.student_id, `${row.student_firstname} ${row.student_lastname}`, email, 'student', 'SUCCESS', ip, userAgent);
                return resolve({ ok: true, message: 'Successfully Login!', token, student_firstname: row.student_firstname });
            }

            writeLoginLog(row.student_id, `${row.student_firstname} ${row.student_lastname}`, email, 'student', 'FAILED', ip, userAgent);
            return reject('Invalid email or password');
        });
    });
}

// Google Login — finds student by email, skips password check
async function studentGoogleLogin(email, device_id, ip, userAgent) {
    const query = `
        SELECT  
            student_id,
            student_id_number, 
            student_firstname, 
            student_middlename, 
            student_lastname, 
            student_email, 
            student_year_level,
            student_guardian_number,
            student_program,
            device_id
        FROM student_accounts
        WHERE student_email = ?
        LIMIT 1
    `;

    return new Promise((resolve, reject) => {
        db.execute(query, [email], async (err, result) => {
            if (err) return reject({ message: err });
            if (result.length === 0) {
                writeLoginLog(null, null, email, 'student', 'FAILED', ip, userAgent);
                return reject('No account found for this Google email. Please register first.');
            }

            const row = result[0];

            // Strict device binding — fingerprint must match what was registered
            if (!await deviceIDChecker(device_id, email)) {
                writeLoginLog(row.student_id, `${row.student_firstname} ${row.student_lastname}`, email, 'student', 'FAILED', ip, userAgent);
                return reject('This device is not registered to your account. Please contact your administrator to reset your device.');
            }

            const token = generateToken(row);
            writeLoginLog(row.student_id, `${row.student_firstname} ${row.student_lastname}`, email, 'student', 'SUCCESS', ip, userAgent);
            return resolve({
                ok: true,
                message: 'Successfully Login!',
                token,
                student_firstname: row.student_firstname
            });
        });
    });
}

// Get Student Attendance
function getAttendanceHistoryForStudentOnly(studentID, studentIDNumber) {
    return new Promise((resolve, reject) => {
        // JOIN student_accounts for current student name data and
        // JOIN teacher on serial number to show teacher full name instead of student name.
        // JOIN student_records_regular_class to get the date the student was registered
        // under each teacher, and only return records from that date onwards.
        const sql = `
            SELECT
                h.attendance_id AS id, h.student_id, h.student_id_number,
                sa.student_firstname, sa.student_middlename, sa.student_lastname,
                h.year_level, h.subject, h.student_program,
                h.teacher_barcode_scanner_serial_number,
                t.teacher_name,
                h.attendance_date, h.attendance_time, h.attendance_status
            FROM attendance_record h
            LEFT JOIN student_accounts sa
                ON sa.student_id = h.student_id
            LEFT JOIN teacher t
                ON t.teacher_barcode_scanner_serial_number = h.teacher_barcode_scanner_serial_number
            WHERE ${studentID ? 'h.student_id = ?' : 'h.student_id_number = ?'}
            AND h.attendance_date >= (
                SELECT DATE(src.date_created)
                FROM student_records_regular_class src
                WHERE src.student_id_number = h.student_id_number
                AND src.teacher_barcode_scanner_serial_number = h.teacher_barcode_scanner_serial_number
                ORDER BY src.date_created ASC
                LIMIT 1
            )
            ORDER BY h.attendance_date DESC, h.attendance_time DESC
        `;
        const param = studentID ? studentID : studentIDNumber;
        db.execute(sql, [param], (err, result) => {
            if (err) return reject(err)
            // If no rows found by student_id, fall back to student_id_number
            if (result.length === 0 && studentID && studentIDNumber) {
                const sql2 = `
                    SELECT
                        h.attendance_id AS id, h.student_id, h.student_id_number,
                        sa.student_firstname, sa.student_middlename, sa.student_lastname,
                        h.year_level, h.subject, h.student_program,
                        h.teacher_barcode_scanner_serial_number,
                        t.teacher_name,
                        h.attendance_date, h.attendance_time, h.attendance_status
                    FROM attendance_record h
                    LEFT JOIN student_accounts sa
                        ON sa.student_id = h.student_id
                    LEFT JOIN teacher t
                        ON t.teacher_barcode_scanner_serial_number = h.teacher_barcode_scanner_serial_number
                    WHERE h.student_id_number = ?
                    AND h.attendance_date >= (
                        SELECT DATE(src.date_created)
                        FROM student_records_regular_class src
                        WHERE src.student_id_number = h.student_id_number
                        AND src.teacher_barcode_scanner_serial_number = h.teacher_barcode_scanner_serial_number
                        ORDER BY src.date_created ASC
                        LIMIT 1
                    )
                    ORDER BY h.attendance_date DESC, h.attendance_time DESC
                `;
                db.execute(sql2, [studentIDNumber], (err2, result2) => {
                    if (err2) return reject(err2)
                    resolve(result2)
                })
            } else {
                resolve(result)
            }
        })
    })
}

// async function test() {
//     try {
//         const result = await getStudentAttendance(13)
//         console.log(result)
//     } catch(err) {
//         console.log(err)
//     }
// }

// test()

// Generate Token
function generateToken(payload) {
    return jwt.sign(payload, JWT_SECRET, {
        expiresIn: '24h'
    });
}

// Verify Token
function verifyToken(token) {
    try {
        // FIX: check blacklist first — logged-out tokens must be rejected even if still valid
        if (isTokenBlacklisted(token)) return null
        return jwt.verify(token, JWT_SECRET);
    } catch (err) {
        return null;
    }
}


// Remove the prepend Bearer
function removeBearer(authorization) {
    if (!authorization) throw new Error('No authorization header provided.')
    const token = authorization.split(' ')[1]
    return token
}

// Device ID Checker
function deviceIDChecker(deviceID, student_email) {
    return new Promise((resolve, reject) => {
        // Fetch the student's current device_id
        db.execute(
            'SELECT device_id FROM student_accounts WHERE student_email = ? LIMIT 1',
            [student_email],
            (err, results) => {
                if (err) return reject(err)
                if (results.length === 0) return resolve(false)

                const stored = results[0].device_id

                // device_id is NULL — admin has reset the binding.
                // Auto-bind this fingerprint as the new registered device.
                if (stored === null || stored === '') {
                    db.execute(
                        'UPDATE student_accounts SET device_id = ? WHERE student_email = ?',
                        [deviceID, student_email],
                        (updateErr) => {
                            if (updateErr) return reject(updateErr)
                            resolve(true)
                        }
                    )
                    return
                }

                // Normal check — fingerprint must match what's stored
                resolve(stored === deviceID)
            }
        )
    })
}

// Student update profile
function studentUpdateProfile(studentId, profileData) {
    return new Promise((resolve, reject) => {
        const { firstName, middleName, lastName, idNumber, yearLevel, program } = profileData;

        // Check if idNumber is already used by a different student
        db.execute(
            `SELECT student_id FROM student_accounts WHERE student_id_number = ? AND student_id != ?`,
            [idNumber, studentId],
            (err, rows) => {
                if (err) return reject(err);
                if (rows.length > 0) return resolve({ duplicate: true });

                const sql = `
                    UPDATE student_accounts
                    SET student_firstname = ?,
                        student_middlename = ?,
                        student_lastname = ?,
                        student_id_number = ?,
                        student_year_level = ?,
                        student_program = ?
                    WHERE student_id = ?
                `;

                db.execute(
                    sql,
                    [firstName, middleName, lastName, idNumber, yearLevel, program, studentId],
                    (err, result) => {
                        if (err) { console.error('Database update error:', err); return reject(err); }
                        resolve({ duplicate: false, result });
                    }
                );
            }
        );
    });
}

// Get Student Data's
function getStudentsData(studentId) {
    return new Promise((resolve, reject) => {
        const sql = `
            SELECT
                student_id_number,
                student_firstname,
                student_middlename,
                student_lastname,
                student_year_level,
                student_program,
                student_profile_picture
            FROM student_accounts
            WHERE student_id = ?
        `;

        db.execute(
            sql,
            [studentId],
            (err, result) => {
                if (err) {
                    console.error('Database update error:', err);
                    return reject(err);
                }
                resolve(result);
            }
        );
    });
}

// Update Student password
function updateStudentPassword(currentPassword, newPassword, studentId) {

    return new Promise((resolve, reject) => {
        db.execute(
            'SELECT password FROM student_accounts WHERE student_id = ? LIMIT 1',
            [studentId],
            async (err, result) => {

                if (err) return reject(err);
                if (result.length === 0) return reject('Student not found!');

                const isMatch = await bcrypt.compare(currentPassword, result[0].password);
                if (!isMatch) return reject('Current password is incorrect!');

                const hashedPassword = await bcrypt.hash(newPassword, 10);

                db.execute(
                    'UPDATE student_accounts SET password = ? WHERE student_id = ?',
                    [hashedPassword, studentId],
                    (err) => {
                        if (err) return reject(err);
                        resolve('Successfully updated password!');
                    }
                );
            }
        );
    });
}

// Get Student Barcode and Expiration date
function getStudentBarcode(studentID) {
    return new Promise((resolve, reject) => {
        db.execute(
            'SELECT barcode_date_generated, barcode FROM student_accounts WHERE student_id = ?',
            [studentID],
            (err, result) => {
                if (err) return reject(err);
                if (result.length === 0) return reject('No student barcode found!');
                resolve(result[0]);
            }
        );
    });
}

// Update Student Barcode
function updateStudentBarcode(studentID, newBarcode, teacherSerial) {
    return new Promise((resolve, reject) => {
        db.execute(
            'UPDATE student_accounts SET barcode = ?, barcode_date_generated = NOW(), barcode_teacher_serial = ? WHERE student_id = ?',
            [newBarcode, teacherSerial || null, studentID],
            (err, result) => {
                if (err) return reject(err)
                resolve('Student barcode successfully updated!')
            }
        )
    })
}

// Get all programs
function getAllPrograms() {
    return new Promise((resolve, reject) => {
        db.execute('SELECT program_id, program_name, program_date_created FROM program ORDER BY program_id DESC', [], (err, result) => {
            if (err) { return reject(err) }
            resolve(result)
        })
    })
}

// Teacher registration
async function teacherRegistration(fullName, email, password, department, admin_id) {
    const hashedPassword = await hashPassword(password);

    const teacherBarcodeScannerSerialNumber = generateTeacherSerialNumber();

    return new Promise(async (resolve, reject) => {
        const sql = `
            INSERT INTO teacher 
            (teacher_name, teacher_email, teacher_password, teacher_program, teacher_barcode_scanner_serial_number, admin_id) 
            VALUES (?, ?, ?, ?, ?, ?)
        `;

        const emailExists = await emailFinder('teacher_email', email, 'teacher');
        if (emailExists) {
            return reject('Email is already taken!');
        }

        db.execute(
            sql,
            [fullName, email, hashedPassword, department, teacherBarcodeScannerSerialNumber, admin_id],
            (err, result) => {
                if (err) { return reject(err); }
                try {
                    initialTeacherSubjectAndYearLevelSetter('', '', teacherBarcodeScannerSerialNumber);
                    writeActivityLog(admin_id, null, 'admin', 'CREATE_TEACHER', 'Teacher', result.insertId, fullName, `Registered teacher: ${email}, Dept: ${department}`, null, null)
                    resolve('Successfully created new account for teacher');
                } catch (initErr) {
                    console.error('Initialization error:', initErr);
                    resolve('Account created, but failed to initialize state.');
                }
            }
        );
    });
}

// Guard Registration

// Insert a NULL value to subject and year level setter
async function initialTeacherSubjectAndYearLevelSetter(subjectSet = '', yearLevelSet = '', teacherBarcodeScannerSerialNumber) {
    return new Promise((resolve, reject) => {
        db.execute('INSERT INTO subject_and_year_level_setter (subject_name_set, year_level_set, teacher_barcode_scanner_serial_number) VALUES(?, ?, ?)',
            [subjectSet, yearLevelSet, teacherBarcodeScannerSerialNumber],
            (err, result) => {
                if (err) { return reject(err) }
            })
    })
}

// Teacher Login
async function teacherLogin(email, password, ip, userAgent) {

    const query = `
        SELECT  
            teacher_id,
            teacher_name, 
            teacher_program,
            teacher_password,
            teacher_barcode_scanner_serial_number
        FROM teacher
        WHERE teacher_email = ?
        LIMIT 1
    `;

    return new Promise(async (resolve, reject) => {
        db.execute(query, [email], async (err, result) => {

            if (err) return reject({ message: err });

            if (result.length === 0) {
                writeLoginLog(null, null, email, 'teacher', 'FAILED', ip, userAgent);
                return reject('Invalid email or password');
            }

            const row = result[0];

            const isMatch = await comparePassword(password, row.teacher_password);

            // Remove password before sending a payload
            delete row.password

            if (isMatch) {
                const token = generateToken(row)
                writeLoginLog(row.teacher_id, row.teacher_name, email, 'teacher', 'SUCCESS', ip, userAgent);
                return resolve({ ok: true, message: 'Successfully Login!', token, teacher_name: row.teacher_name });
            }

            writeLoginLog(row.teacher_id, row.teacher_name, email, 'teacher', 'FAILED', ip, userAgent);
            return reject('Invalid email or password');
        });
    });
}

// Get All Student Data
async function teacherGetAllStudentDataTotalCount(teacherBarcodeScannerSerialNumber) {
    return new Promise((resolve, reject) => {
        db.execute('SELECT COUNT(student_id) AS total FROM student_records_regular_class WHERE teacher_barcode_scanner_serial_number = ?', [teacherBarcodeScannerSerialNumber], (err, result) => {
            if (err) { return reject(err) }
            resolve(result)
        })
    })
}

// Get Total Student Attendees Right Now
async function teacherGetTotalAttendanceRecord(teacherBarcodeScannerSerialNumber) {
    return new Promise((resolve, reject) => {
        db.execute('SELECT COUNT(attendance_id) as total_attendees FROM attendance_record WHERE teacher_barcode_scanner_serial_number = ?', [teacherBarcodeScannerSerialNumber], (err, result) => {
            if (err) { return reject(err) }
            resolve(result)
        })
    })
}


// Teacher Add Student
// Search students from student_accounts by name, email, or ID number
function searchStudentAccounts(query) {
    return new Promise((resolve, reject) => {
        const like = `%${query}%`;
        db.execute(
            `SELECT 
                student_id,
                student_id_number,
                student_firstname,
                student_middlename,
                student_lastname,
                student_email,
                student_year_level,
                student_program,
                student_guardian_number
            FROM student_accounts
            WHERE student_id_number LIKE ?
               OR student_firstname LIKE ?
               OR student_lastname LIKE ?
               OR student_email LIKE ?
            ORDER BY student_lastname ASC
            LIMIT 20`,
            [like, like, like, like],
            (err, result) => {
                if (err) return reject(err);
                resolve(result);
            }
        );
    });
}

async function teacherAddStudent(
    studentIDNumber,
    studentFirstName,
    studentMiddleName,
    studentLastName,
    studentEmail,
    studentProgram,
    studentYearLevel,
    studentGuardianNumber,
    teacherBarcodeScannerSerialNumber,
    teacherId,
    teacherName
) {
    const existing = await new Promise((resolve, reject) => {
        db.execute(
            'SELECT student_id FROM student_records_regular_class WHERE student_id_number = ? AND teacher_barcode_scanner_serial_number = ?',
            [studentIDNumber, teacherBarcodeScannerSerialNumber],
            (err, rows) => { if (err) return reject(err); resolve(rows) })
    })
    if (existing.length > 0) throw new Error(`Student is already registered in your class.`)

    // Look up guardian number from student_accounts (from their original registration)
    const studentAccount = await new Promise((resolve, reject) => {
        db.execute(
            'SELECT student_guardian_number FROM student_accounts WHERE student_email = ? OR student_id_number = ? LIMIT 1',
            [studentEmail, studentIDNumber],
            (err, rows) => { if (err) return reject(err); resolve(rows[0] || null) }
        )
    })
    const resolvedGuardianNumber = studentAccount ? studentAccount.student_guardian_number : studentGuardianNumber;

    return new Promise((resolve, reject) => {
        db.execute(
            `INSERT INTO student_records_regular_class (
                student_id_number, 
                student_firstname, 
                student_middlename, 
                student_lastname, 
                student_email, 
                student_program, 
                student_year_level, 
                student_guardian_number, 
                teacher_barcode_scanner_serial_number
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                studentIDNumber,
                studentFirstName,
                studentMiddleName,
                studentLastName,
                studentEmail,
                studentProgram,
                studentYearLevel,
                resolvedGuardianNumber,
                teacherBarcodeScannerSerialNumber
            ],
            (err, result) => {
                if (err) return reject(err);
                writeActivityLog(teacherId || null, teacherName || null, 'teacher', 'ADD_STUDENT_TO_CLASS', 'Student', studentIDNumber, `${studentFirstName} ${studentLastName}`, `Added by ${teacherName || 'Unknown Teacher'} — Program: ${studentProgram}, Year: ${studentYearLevel}`, null, null)
                resolve({ message: 'Successfully added new student!' });
            }
        );
    });
}

// Teacher Get Student Registered
async function teacherGetStudentRegistered(teacherBarcodeScannerSerialNumber) {
    return new Promise((resolve, reject) => {
        db.execute(
            `SELECT 
                student_id, 
                student_id_number, 
                student_firstname, 
                student_middlename,
                student_lastname,
                student_email,
                student_year_level,
                student_guardian_number,
                student_program,
                date_created
            FROM student_records_regular_class 
            WHERE teacher_barcode_scanner_serial_number = ?`,
            [teacherBarcodeScannerSerialNumber],
            (err, result) => {
                if (err) return reject(err);
                resolve(result);
            }
        );
    });
}

// Get current active subject and year level for a teacher
function getActiveSubjectAndYearLevel(teacherBarcodeScannerSerialNumber) {
    return new Promise((resolve, reject) => {
        db.execute(
            `SELECT subject_name_set, year_level_set, class_time_set, last_set_at 
             FROM subject_and_year_level_setter 
             WHERE teacher_barcode_scanner_serial_number = ? 
             LIMIT 1`,
            [teacherBarcodeScannerSerialNumber],
            (err, result) => {
                if (err) return reject(err)
                resolve(result[0] || { subject_name_set: '', year_level_set: '', class_time_set: '', last_set_at: null })
            }
        )
    })
}

// Teacher Subject And Year Level Setter
async function teacherSubjectAndYearLevelSetter(subjectSet, yearLevelSet, classTimeSet, teacherBarcodeScannerSerialNumber) {
    return new Promise((resolve, reject) => {
        db.execute(`UPDATE subject_and_year_level_setter 
                    SET subject_name_set = ?, 
                    year_level_set = ?,
                    class_time_set = ?,
                    last_set_at = NOW()
                    WHERE teacher_barcode_scanner_serial_number = ?`,
            [subjectSet, yearLevelSet, classTimeSet || null, teacherBarcodeScannerSerialNumber],
            (err, result) => {
                if (err) { return reject(err) }
                resolve('Successfully set!')
            })
    })
}

// async function test() {
//     try {
//         const result = await checkStudentIfExistsInRegistration('BC17708941329739487');
//         console.log(result);
//     } catch(err) {
//         console.log(err);
//     }
// }

// test();

// Check Student If Exists in Registration
async function checkStudentIfExistsInRegistration(barcode) {
    return new Promise((resolve, reject) => {
        db.execute(`SELECT 
                        student_id,
                        student_id_number,
                        student_firstname,
                        student_middlename,
                        student_lastname,
                        student_email,
                        student_year_level,
                        student_guardian_number,
                        student_program,
                        barcode_teacher_serial
                    FROM student_accounts
                    WHERE barcode = ?`, [barcode],
            (err, result) => {
                if (err) { return reject(err) }
                resolve(result)
            })
    })
}

// Check Student If Exists on Regular class from specific teacher
async function checkStudentToRegularClass(studentIDNumber, teacherSerial) {
    return new Promise((resolve, reject) => {
        // If teacherSerial provided, check that the student is in THIS teacher's class specifically
        const sql = teacherSerial
            ? 'SELECT student_id_number FROM student_records_regular_class WHERE student_id_number = ? AND teacher_barcode_scanner_serial_number = ? LIMIT 1'
            : 'SELECT student_id_number FROM student_records_regular_class WHERE student_id_number = ? LIMIT 1'
        const params = teacherSerial ? [studentIDNumber, teacherSerial] : [studentIDNumber]
        db.execute(sql, params, (err, result) => {
            if (err) return reject(err)
            resolve(result.length > 0)
        })
    })
}

// Check student if already on attendance
async function checkStudentIfAlreadyExistsInAttendance(student_id_number, teacher_barcode_scanner_serial_number) {
    return new Promise((resolve, reject) => {
        db.execute(
            `SELECT 1 FROM attendance_record 
             WHERE student_id_number = ? 
             AND teacher_barcode_scanner_serial_number = ?
             AND DATE(attendance_date) = CURDATE()
             AND subject = (
                 SELECT subject_name_set FROM subject_and_year_level_setter
                 WHERE teacher_barcode_scanner_serial_number = ?
                 LIMIT 1
             )
             LIMIT 1`,
            [student_id_number, teacher_barcode_scanner_serial_number, teacher_barcode_scanner_serial_number],
            (err, result) => {
                if (err) return reject(err)
                resolve(result.length > 0)
            }
        )
    })
}


// Check year level and serial number
function checkYearLevelAndSerialNumber(teacher_barcode_scanner_serial_number, yearLevel) {
    return new Promise((resolve, reject) => {
        db.execute(
            `SELECT subject_name_set, 
             year_level_set 
             FROM subject_and_year_level_setter 
             WHERE teacher_barcode_scanner_serial_number = ? 
             AND year_level_set = ?`,
            [teacher_barcode_scanner_serial_number, yearLevel],
            (err, result) => {
                if (err) return reject(err)
                resolve(result)
            }
        )
    })
}

// Insert student Attendance 
async function insertStudentAttendance(
    student_id,
    student_id_number,
    student_firstname,
    student_middlename,
    student_lastname,
    student_year_level,
    student_program,
    teacher_barcode_scanner_serial_number,
    teacherId,
    teacherName
) {
    // Check if student already exists in attendance for THIS teacher's class
    const exists = await checkStudentIfAlreadyExistsInAttendance(student_id_number, teacher_barcode_scanner_serial_number)
    if (exists) {
        throw new Error('Student already recorded in attendance for this class.')
    }

    // Check teacher serial number + year level
    const result = await checkYearLevelAndSerialNumber(
        teacher_barcode_scanner_serial_number,
        student_year_level
    )

    if (result.length === 0) {
        throw new Error('Year level not authorized for this teacher.')
    }

    // Insert attendance record
    await new Promise((resolve, reject) => {
        db.execute(
            `INSERT INTO attendance_record (
                student_id,
                student_id_number,
                student_firstname,
                student_middlename,
                student_lastname,
                year_level,
                subject,
                student_program,
                teacher_barcode_scanner_serial_number
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                student_id,
                student_id_number,
                student_firstname,
                student_middlename,
                student_lastname,
                student_year_level,
                result[0].subject_name_set,
                student_program,
                teacher_barcode_scanner_serial_number
            ],
            (err) => {
                if (err) return reject(err)
                resolve()
            }
        )
    })

    // Insert attendance history (SAFE to await)
    await insertStudentAttendanceHistory(
        student_id,
        student_id_number,
        student_firstname,
        student_middlename,
        student_lastname,
        student_year_level,
        result[0].subject_name_set,
        student_program,
        teacher_barcode_scanner_serial_number
    )

    writeActivityLog(student_id, `${student_firstname} ${student_middlename}. ${student_lastname}`, 'student', 'CLASS_ATTENDANCE_IN', 'Class Attendance', student_id_number, `${student_firstname} ${student_middlename}. ${student_lastname}`, `Teacher: ${teacherName || 'Unknown'} | Program: ${student_program}, Year: ${student_year_level}`, null, null)
    return 'Successfully inserted student attendance!'
}

// Insert student Attendance History
function insertStudentAttendanceHistory(
    student_id,
    student_id_number,
    student_firstname,
    student_middlename,
    student_lastname,
    student_year_level,
    subject_name_set,
    student_program,
    teacher_barcode_scanner_serial_number
) {
    return new Promise((resolve, reject) => {
        db.execute(
            `INSERT INTO attendance_history_record (
                student_id,
                student_id_number,
                student_firstname,
                student_middlename,
                student_lastname,
                year_level,
                subject,
                student_program,
                teacher_barcode_scanner_serial_number
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                student_id,
                student_id_number,
                student_firstname,
                student_middlename,
                student_lastname,
                student_year_level,
                subject_name_set,
                student_program,
                teacher_barcode_scanner_serial_number
            ],
            (err) => {
                if (err) return reject(err)

                console.log('Successfully inserted student attendance history!')
                resolve(true)
            }
        )
    })
}

// Get Student Attendance Now
async function getStudentAttendanceNow(teacher_barcode_scanner_serial_number, subject = null) {
    return new Promise((resolve, reject) => {
        const sql = subject
            ? 'SELECT * FROM attendance_record WHERE teacher_barcode_scanner_serial_number = ? AND subject = ? ORDER BY attendance_date DESC, attendance_time DESC'
            : 'SELECT * FROM attendance_record WHERE teacher_barcode_scanner_serial_number = ? ORDER BY attendance_date DESC, attendance_time DESC'
        const params = subject
            ? [teacher_barcode_scanner_serial_number, subject]
            : [teacher_barcode_scanner_serial_number]
        db.execute(sql, params, (err, result) => {
            if (err) { return reject(err) }
            resolve(result)
        })
    })
}

// Get Student Attendance History
async function getStudentAttendanceHistory(teacher_barcode_scanner_serial_number) {
    return new Promise((resolve, reject) => {
        db.execute('SELECT * FROM attendance_history_record WHERE teacher_barcode_scanner_serial_number = ? ORDER BY attendance_date DESC, attendance_time DESC', [teacher_barcode_scanner_serial_number], (err, result) => {
            if (err) { return reject(err) }
            resolve(result)
        })
    })
}

// Get Subjects
async function getStudentSubjects(teacherID) {
    return new Promise((resolve, reject) => {
        db.execute('SELECT * FROM subject WHERE teacher_id = ?', [teacherID], (err, result) => {
            if (err) { reject(err) }
            resolve(result)
        })
    })
}

// Delete Subject
async function deleteSubject(subjectID) {
    return new Promise((resolve, reject) => {
        db.execute('DELETE FROM subject WHERE subject_id = ?', [subjectID], (err, result) => {
            if (err) { return reject(err) }
            resolve('Successfully deleted!')
        })
    })
}

// Delete Subject
async function addSubject(subjectName, teacherID) {
    return new Promise((resolve, reject) => {
        db.execute('INSERT INTO subject (subject_name, teacher_id) VALUES(?, ?)', [subjectName, teacherID], (err, result) => {
            if (err) { return reject(err) }
            resolve('Successfully inserted!')
        })
    })
}

// Get Year Levels
async function teacherGetYearLevel() {
    return new Promise((resolve, reject) => {
        db.execute('SELECT * FROM year_level ORDER BY year_level_id DESC', [], (err, result) => {
            if (err) { reject(err) }
            resolve(result)
        })
    })
}

// Update Student Registered Record
function updateStudentRegisteredRecord(
    student_id,
    student_id_number,
    student_firstname,
    student_middlename,
    student_lastname,
    student_year_level,
    student_program
) {
    return new Promise((resolve, reject) => {
        // Check if the id_number is already used by a different student
        db.execute(
            `SELECT student_id FROM student_records_regular_class WHERE student_id_number = ? AND student_id != ?`,
            [student_id_number, student_id],
            (err, rows) => {
                if (err) return reject(err);
                if (rows.length > 0) return resolve({ duplicate: true });

                const query = `
                    UPDATE student_records_regular_class
                    SET
                        student_id_number = ?,
                        student_firstname = ?,
                        student_middlename = ?,
                        student_lastname = ?,
                        student_year_level = ?,
                        student_program = ?
                    WHERE student_id = ?
                `;

                const values = [
                    student_id_number,
                    student_firstname,
                    student_middlename,
                    student_lastname,
                    student_year_level,
                    student_program,
                    student_id
                ];

                db.execute(query, values, (err, result) => {
                    if (err) return reject(err);

                    // Sync student_accounts so the student login reflects the teacher's correction
                    const syncSql = `
                        UPDATE student_accounts
                        SET student_firstname  = ?,
                            student_middlename = ?,
                            student_lastname   = ?,
                            student_year_level = ?,
                            student_program    = ?
                        WHERE student_id_number = ?
                    `;
                    db.execute(
                        syncSql,
                        [student_firstname, student_middlename, student_lastname,
                         student_year_level, student_program, student_id_number],
                        (syncErr) => {
                            if (syncErr) console.warn('[updateStudentRegisteredRecord] student_accounts sync failed:', syncErr.message);
                            resolve({ duplicate: false, result });
                        }
                    );
                });
            }
        );
    });
}

// Delete Student Registered Record
function deleteStudentRegisteredRecord(studentID) {
    return new Promise((resolve, reject) => {
        db.execute('DELETE FROM student_records_regular_class WHERE student_id = ?', [studentID], (err, result) => {
            if (err) { return reject(err) }
            resolve('Student successfully deleted!')
        })
    })
}

// Get Teacher Data
function getTeacherData(teacherID) {
    return new Promise((resolve, reject) => {
        const query = `SELECT 
                            teacher_name, 
                            teacher_email, 
                            teacher_program, 
                            teacher_current_subject, 
                            teacher_location,
                            teacher_location_radius,
                            teacher_barcode_scanner_serial_number,
                            teacher_profile_picture,
                            admin_id
                       FROM teacher 
                       WHERE teacher_id = ?`

        db.execute(query, [teacherID], (err, result) => {
            if (err) { return reject(err) }
            resolve(result)
        })
    })
}

// Update Teacher Profile Picture
function updateStudentProfilePicture(studentID, filename) {
    return new Promise((resolve, reject) => {
        db.execute(
            'UPDATE student_accounts SET student_profile_picture = ? WHERE student_id = ?',
            [filename, studentID],
            (err) => {
                if (err) return reject(err)
                resolve(filename)
            }
        )
    })
}

function updateTeacherProfilePicture(teacherID, filename) {
    return new Promise((resolve, reject) => {
        db.execute(
            'UPDATE teacher SET teacher_profile_picture = ? WHERE teacher_id = ?',
            [filename, teacherID],
            (err, result) => {
                if (err) return reject(err)
                resolve(filename)
            }
        )
    })
}

// Update Teacher Password
function updateTeacherPassword(teacherID, currentPassword, newPassword) {
    return new Promise((resolve, reject) => {
        const query = `SELECT teacher_password FROM teacher WHERE teacher_id = ?`
        db.execute(query, [teacherID], async (err, result) => {
            if (err) { return reject(err) }
            if (result.length === 0) { reject('Unauthorized') }
            const isMatch = await comparePassword(currentPassword, result[0].teacher_password)
            const hashNewPassword = await hashPassword(newPassword, SALT_ROUNDS)
            if (isMatch) {
                db.execute('UPDATE teacher SET teacher_password = ? WHERE teacher_id = ?', [hashNewPassword, teacherID], (err, result) => {
                    if (err) { return reject(err) }
                    if (result.length === 0) { return reject('Update password failed!') }
                    resolve('Successfully update new password!')
                })
            } else {
                return reject('Invalid password!')
            }
        })
    })
}

// Update Teacher Name
function updateTeacherName(teacherID, teacherNewName) {
    return new Promise((resolve, reject) => {
        db.execute('UPDATE teacher SET teacher_name = ? WHERE teacher_id = ?', [teacherNewName, teacherID], (err, result) => {
            if (err) { return reject(err) }
            if (result.affectedRows === 0) { reject('Update failed!') }
            resolve('Successfully update teacher name!')
        })
    })
}

// Get Whole Campus Accounts
// FIX: tableName was interpolated raw into SQL — SQL injection risk.
// Added whitelist here as a defence-in-depth layer.
// The route layer (super_admin.js) also validates, but this ensures no internal
// caller can accidentally pass a user-supplied string.
const ALLOWED_ACCOUNT_TABLES = ['student_accounts', 'teacher', 'guards']
function getWholeCampusAccounts(tableName) {
    if (!ALLOWED_ACCOUNT_TABLES.includes(tableName)) {
        return Promise.reject(new Error(`Invalid table name: ${tableName}`))
    }
    return new Promise((resolve, reject) => {
        db.execute(`SELECT * FROM ${tableName} ORDER BY 1 DESC`, [], (err, result) => {
            if (err) { return reject(err) }
            resolve(result)
        })
    })
}


// Email finder
// WARNING: tableName and columnToFind are interpolated into SQL.
// All current callers use hardcoded string literals — never pass user input here.
const ALLOWED_EMAIL_FINDER_TABLES = {
    'student_accounts': ['student_email'],
    'teacher':          ['teacher_email'],
    'guards':           ['guard_email'],
    'admin_accounts':   ['admin_email'],
    'super_admin':      ['super_admin_email'],
}
function emailFinder(columnToFind, email, tableName) {
    // FIX: Whitelist both table and column to prevent injection if a caller ever
    // passes dynamic values in the future.
    const allowedCols = ALLOWED_EMAIL_FINDER_TABLES[tableName]
    if (!allowedCols || !allowedCols.includes(columnToFind)) {
        return Promise.reject(new Error(`emailFinder: disallowed table/column combination: ${tableName}.${columnToFind}`))
    }
    return new Promise((resolve, reject) => {
        db.query(`SELECT * FROM ${tableName} WHERE ${columnToFind} = ?`, [email], (err, result) => {
            if (err) {
                return reject(err);
            }

            if (result.length > 0) {
                resolve(true);
            } else {
                resolve(false);
            }
        });
    });
}

// Guard registration
async function guardRegistration(
    guard_name,
    guard_email,
    guard_password,
    guard_designated_location,
    admin_id
) {
    return new Promise(async (resolve, reject) => {
        try {
            const emailExists = await emailFinder('guard_email', guard_email, 'guards');

            if (emailExists) {
                return reject('Email already exists!');
            }

            const hashedPassword = await bcrypt.hash(guard_password, SALT_ROUNDS);

            const sql = `
                INSERT INTO guards 
                (guard_name, guard_email, guard_password, guard_designated_location, admin_id)
                VALUES (?, ?, ?, ?, ?)
            `;

            db.query(
                sql,
                [guard_name, guard_email, hashedPassword, guard_designated_location, admin_id],
                (err, result) => {
                    if (err) return reject(err);
                    writeActivityLog(admin_id, null, 'admin', 'CREATE_GUARD', 'Guard', result.insertId, guard_name, `Registered guard: ${guard_email}, Location: ${guard_designated_location}`, null, null)
                    resolve('Successfully registered!');
                }
            );

        } catch (err) {
            reject(err);
        }
    });
}

// Check duplication program
function checkProgramDuplicate(programName) {
    return new Promise((resolve, reject) => {
        const sql = "SELECT * FROM program WHERE program_name = ?";

        db.execute(sql, [programName], (err, result) => {
            if (err) {
                console.error("Database Error:", err);
                return reject(err);
            }
            resolve(result.length > 0);
        });
    });
}

// Add Program
async function addProgram(programName) {
    return new Promise(async (resolve, reject) => {
        try {
            const isDuplicate = await checkProgramDuplicate(programName);

            if (isDuplicate) {
                return reject('Program already exists!');
            }

            const sql = `
                INSERT INTO program (program_name) 
                VALUES (?)
            `;

            db.execute(
                sql,
                [programName],
                (err, result) => {
                    if (err) return reject(err);
                    resolve('Successfully added new program!');
                }
            );

        } catch (err) {
            reject(err);
        }
    });
}

// Delete Program
function deleteProgram(id) {
    return new Promise((resolve, reject) => {
        const sql = "DELETE FROM program WHERE program_id = ?";

        db.execute(sql, [id], (err, result) => {
            if (err) {
                return reject(err);
            }
            resolve(result);
        });
    });
}

// Admin Login
async function adminLogin(email, password, ip, userAgent) {

    const query = `
        SELECT 
            admin_id,
            admin_name, 
            admin_email,
            admin_password
        FROM admin_accounts
        WHERE admin_email = ?
        LIMIT 1
    `;

    return new Promise(async (resolve, reject) => {
        db.execute(query, [email], async (err, result) => {

            if (err) return reject({ message: err });

            if (result.length === 0) {
                writeLoginLog(null, null, email, 'admin', 'FAILED', ip, userAgent);
                return reject('Invalid email or password');
            }

            const row = result[0];

            const isMatch = await comparePassword(password, row.admin_password);

            delete row.admin_password;

            if (isMatch) {
                const token = generateToken(row);
                writeLoginLog(row.admin_id, row.admin_name, row.admin_email, 'admin', 'SUCCESS', ip, userAgent);
                return resolve({
                    ok: true,
                    message: 'Login successful',
                    token,
                    user: {
                        id: row.admin_id,
                        name: row.admin_name,
                        email: row.admin_email
                    }
                });
            }

            writeLoginLog(row.admin_id, row.admin_name, row.admin_email, 'admin', 'FAILED', ip, userAgent);
            return reject('Invalid email or password');
        });
    });
}

// Get Admin data
function getAdminData(adminID) {
    return new Promise((resolve, reject) => {
        db.execute('SELECT admin_id, admin_name, admin_email, admin_profile_picture FROM admin_accounts WHERE admin_id = ?', [adminID], (err, result) => {
            if (err) { return reject(err) }
            resolve(result)
        })
    })
}

// Admin Set Event Name
async function setEventName(eventName, adminID) {
    return new Promise((resolve, reject) => {
        const sql = `
            UPDATE event_setter 
            SET event_name_set = ? WHERE admin_id = ?
        `;
        db.execute(sql, [eventName, adminID], (err, result) => {
            if (err) return reject(err.message);
            resolve('Event updated successfully');
        });
    });
}

// Get active event name for an admin
function getActiveEventName(adminID) {
    return new Promise((resolve, reject) => {
        // Return the latest event set by any admin — events are school-wide
        db.execute(
            'SELECT event_name_set FROM event_setter ORDER BY event_setter_id DESC LIMIT 1',
            [],
            (err, result) => {
                if (err) return reject(err)
                resolve(result[0] || { event_name_set: '' })
            }
        )
    })
}


// Find student if exists in student accounts
async function studentBarcodeFinder(studentBarcode) {
    return new Promise((resolve, reject) => {
        const query = `
        SELECT 
            student_id,
            student_id_number,
            student_firstname,
            student_middlename,
            student_lastname,
            student_email,
            student_year_level,
            student_guardian_number,
            student_program,
            barcode,
            barcode_date_generated,
            device_id
        FROM student_accounts
        WHERE barcode = ?;`
        db.execute(query, [studentBarcode], (err, result) => {
            if (err) { return reject(err) }
            resolve(result[0])
        })
    })
}

// Find if student is already in attendance
async function studentCheckEventIfExists(studentIDNumber, status, eventName) {
    return new Promise((resolve, reject) => {
        // Check duplicate only within the same event — different events allow re-entry
        const sql = `
            SELECT student_id_number 
            FROM event_attendance_record 
            WHERE student_id_number = ? 
            AND status = ? 
            AND event_name = ?
            LIMIT 1
        `;

        db.execute(sql, [studentIDNumber, status, eventName], (err, result) => {
            if (err) { return reject(err); }

            // Returns TRUE if record exists, FALSE if not
            resolve(result.length > 0);
        });
    });
}

// Get Event Setter
async function getEventSet() {
    return new Promise((resolve, reject) => {
        // We order by ID DESC to get the latest event set by Admin
        const query = "SELECT event_name_set, admin_id FROM event_setter ORDER BY event_setter_id DESC LIMIT 1;";

        db.execute(query, [], (err, result) => {
            if (err) { return reject(err) }
            // If no event is set, resolve null
            resolve(result.length > 0 ? result[0] : null)
        })
    })
}

// Insert Event Attendance
async function guardInsertAttendanceRecord(studentBarcode, status, guardID, guardName, guardLocation, ip, userAgent) {
    return new Promise(async (resolve, reject) => {
        try {
            const student = await studentBarcodeFinder(studentBarcode);
            if (!student) {
                return reject('Student does not exist in records!');
            }
            const eventData = await getEventSet();
            if (!eventData || !eventData.event_name_set) {
                return reject('No active event found. Please contact Admin.');
            }
            const alreadyScanned = await studentCheckEventIfExists(student.student_id_number, status, eventData.event_name_set);
            if (alreadyScanned) {
                return reject(`Student has already scanned for ${status} in this event!`);
            }
            const activeEventName = eventData.event_name_set;
            const activeAdminId = eventData.admin_id;
            const insertQuery = `
                INSERT INTO event_attendance_record 
                (student_id, student_name, student_id_number, student_program, student_year_level, event_name, guard_name, guard_location, status, guard_id, admin_id) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `;
            const fullName = `${student.student_firstname} ${student.student_middlename}. ${student.student_lastname}`;
            const values = [
                student.student_id,
                fullName,
                student.student_id_number,
                student.student_program,
                student.student_year_level,
                activeEventName,
                guardName || 'Guard',
                guardLocation,
                status,
                guardID,
                activeAdminId
            ];
            db.execute(insertQuery, values, async (err, result) => {
                if (err) { return reject(err); }

                try {
                    await guardInsertAttendanceHistoryRecord(values);

                    writeActivityLog(guardID, guardName, 'guard', status === 'TIME IN' ? 'EVENT_TIME_IN' : 'EVENT_TIME_OUT', 'Event Attendance', student.student_id_number, fullName, `Event: ${activeEventName} | Location: ${guardLocation}`, ip || null, userAgent || null)

                    // Send SMS notification to guardian
                    const smsAction = status === 'TIME IN' ? 'arrived at' : 'left'
                    if (student.student_guardian_number) {
                        sendSMS(student.student_guardian_number,
                            `Pan Pacific University: ${fullName} has ${smsAction} the event "${activeEventName}" (${status}) at ${guardLocation}.`
                        ).catch(() => {})
                    }

                    resolve({
                        ok: true,
                        message: `${status} Recorded Successfully`,
                        student: fullName,
                        event: activeEventName
                    });
                } catch (historyErr) {
                    console.error("History insert failed:", historyErr);
                    reject(historyErr);
                }
            });
        } catch (error) {
            reject(error);
        }
    });
}

// Guard insert attendance by student ID number (for students without internet — no barcode needed)
async function guardInsertAttendanceRecordByIdNumber(studentIdNumber, status, guardID, guardName, guardLocation, ip, userAgent) {
    return new Promise(async (resolve, reject) => {
        try {
            // Look up student directly by ID number instead of barcode
            const rows = await new Promise((res, rej) => {
                db.execute(
                    `SELECT student_id, student_id_number, student_firstname, student_middlename,
                            student_lastname, student_email, student_year_level,
                            student_guardian_number, student_program
                     FROM student_accounts WHERE student_id_number = ? LIMIT 1`,
                    [studentIdNumber],
                    (err, result) => { if (err) return rej(err); res(result); }
                );
            });

            if (!rows || rows.length === 0) {
                return reject(new Error('Student not found with that ID number.'));
            }

            const student = rows[0];
            const eventData = await getEventSet();
            if (!eventData || !eventData.event_name_set) {
                return reject(new Error('No active event found. Please contact Admin.'));
            }

            const alreadyScanned = await studentCheckEventIfExists(student.student_id_number, status, eventData.event_name_set);
            if (alreadyScanned) {
                return reject(new Error(`Student has already scanned for ${status} in this event!`));
            }

            const activeEventName = eventData.event_name_set;
            const activeAdminId   = eventData.admin_id;
            const fullName = `${student.student_firstname} ${student.student_middlename ? student.student_middlename + '.' : ''} ${student.student_lastname}`.trim();
            const values = [
                student.student_id, fullName, student.student_id_number,
                student.student_program, student.student_year_level,
                activeEventName, guardName || 'Guard', guardLocation,
                status, guardID, activeAdminId
            ];

            const insertQuery = `
                INSERT INTO event_attendance_record
                (student_id, student_name, student_id_number, student_program, student_year_level,
                 event_name, guard_name, guard_location, status, guard_id, admin_id)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

            db.execute(insertQuery, values, async (err) => {
                if (err) return reject(err);
                try {
                    await guardInsertAttendanceHistoryRecord(values);
                    writeActivityLog(guardID, guardName, 'guard',
                        status === 'TIME IN' ? 'EVENT_TIME_IN' : 'EVENT_TIME_OUT',
                        'Event Attendance', student.student_id_number, fullName,
                        `Event: ${activeEventName} | Location: ${guardLocation}`, ip || null, userAgent || null);

                    const smsAction = status === 'TIME IN' ? 'arrived at' : 'left';
                    if (student.student_guardian_number) {
                        sendSMS(student.student_guardian_number,
                            `Pan Pacific University: ${fullName} has ${smsAction} the event "${activeEventName}" (${status}) at ${guardLocation}.`
                        ).catch(() => {});
                    }

                    resolve({ ok: true, message: `${status} Recorded Successfully`, student: fullName, event: activeEventName });
                } catch (historyErr) {
                    reject(historyErr);
                }
            });
        } catch (error) {
            reject(error);
        }
    });
}

// Insert Event Attendance History
async function guardInsertAttendanceHistoryRecord(values) {
    return new Promise((resolve, reject) => {
        try {
            const insertQuery = `
                INSERT INTO event_attendance_history_record 
                (student_id, student_name, student_id_number, student_program, student_year_level, event_name, guard_name, guard_location, status, guard_id, admin_id) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `;

            db.execute(insertQuery, values, (err, result) => {
                if (err) { return reject(err); }
                resolve({
                    ok: true,
                    message: `Recorded Successfully`
                });
            });

        } catch (error) {
            reject(error);
        }
    });
}

// Guard Login
async function guardLogin(email, password, ip, userAgent) {
    return new Promise((resolve, reject) => {
        const query = "SELECT * FROM guards WHERE guard_email = ? LIMIT 1";
        db.execute(query, [email], async (err, result) => {
            if (err) {
                return reject({ message: "Database error", code: 500 });
            }
            if (result.length === 0) {
                writeLoginLog(null, null, email, 'guard', 'FAILED', ip, userAgent);
                return reject({ message: "Account not found", code: 404 });
            }
            const guard = result[0];
            try {
                const isMatch = await comparePassword(password, guard.guard_password);
                if (!isMatch) {
                    writeLoginLog(guard.guard_id, guard.guard_name, email, 'guard', 'FAILED', ip, userAgent);
                    return reject({ message: "Invalid password", code: 401 });
                }
                const payload = {
                    guard_id: guard.guard_id,
                    guard_name: guard.guard_name,
                    guard_location: guard.guard_designated_location,
                    role: 'guard'
                };
                const token = generateToken(payload);
                writeLoginLog(guard.guard_id, guard.guard_name, email, 'guard', 'SUCCESS', ip, userAgent);
                resolve({
                    message: "Login Successful",
                    token: token,
                    guard_name: guard.guard_name
                });

            } catch (error) {
                reject({ message: "Authentication failed", code: 500 });
            }
        });
    });
}

// Get Events
function getAttendanceEventRecords(adminID) {
    return new Promise((resolve, reject) => {
        // Show all event attendance records — events are school-wide and not restricted per admin
        db.execute('SELECT * FROM event_attendance_record ORDER BY date DESC, time DESC', [], (err, result) => {
            if (err) { return reject(err) }
            resolve(result)
        })
    })
}

// Get Events History
function getAttendanceEventHistoryRecords() {
    return new Promise((resolve, reject) => {
        db.execute('SELECT * FROM event_attendance_history_record ORDER BY date DESC, time DESC', [], (err, result) => {
            if (err) { return reject(err) }
            resolve(result)
        })
    })
}

// Get Student Attendance Events for Teacher
const ALLOWED_EVENT_TABLES = ['event_attendance_record', 'event_attendance_history_record']
function getAttendanceEventsForTeacher(teacherID, tableName) {
    // FIX: tableName was interpolated raw — whitelist to prevent SQL injection
    if (!ALLOWED_EVENT_TABLES.includes(tableName)) {
        return Promise.reject(new Error(`Invalid event table: ${tableName}`))
    }
    return new Promise(async (resolve, reject) => {
        try {
            const teacherData = await getTeacherData(teacherID)
            if (!teacherData || teacherData.length === 0) {
                return reject(new Error('Teacher not found'))
            }
            const teacherSerial = teacherData[0].teacher_barcode_scanner_serial_number
            // Only return event attendance records for students the teacher added to their class list
            const query = `
                SELECT e.* FROM ${tableName} e
                INNER JOIN student_records_regular_class s
                    ON e.student_id_number = s.student_id_number
                WHERE s.teacher_barcode_scanner_serial_number = ?
                ORDER BY e.date DESC, e.time DESC
            `
            db.execute(query, [teacherSerial], (err, result) => {
                if (err) { return reject(err) }
                resolve(result)
            })
        } catch (err) {
            reject(err)
        }
    })
}

// Change Admin Name
function changeAdminName(newName, adminID) {
    return new Promise((resolve, reject) => {
        db.execute('UPDATE admin_accounts SET admin_name = ? WHERE admin_id = ?', [newName, adminID], (err, result) => {
            if (err) { return reject(err) }
            resolve({ message: 'Successfully updated!' })
        })
    })
}

function updateAdminPassword(adminID, currentPassword, newPassword) {
    return new Promise((resolve, reject) => {
        db.execute('SELECT admin_password FROM admin_accounts WHERE admin_id = ?', [adminID], async (err, result) => {
            if (err) { return reject({ ok: false, message: err, status_code: 500 }) }
            const match = comparePassword(newPassword, currentPassword);
            if (!match) { return reject({ ok: false, message: 'Invalid password', status_code: 401 }) }
            const hashedPassword = await hashPassword(newPassword)
            db.execute('UPDATE admin_accounts SET admin_password = ? WHERE admin_id = ?', [hashedPassword, adminID], (err, result) => {
                if (err) { return reject({ ok: false, message: err, status_code: 500 }) }
                resolve({ ok: true, message: 'Password updated', status_code: 200 })
            })
        })
    })
}

// Admin delete students account
function adminDeleteStudents(student_id) {
    return new Promise((resolve, reject) => {

        db.getConnection((err, connection) => {
            if (err) return reject({ ok: false, message: "Connection error: " + err, status_code: 500 })

            connection.execute('SELECT student_id_number FROM student_accounts WHERE student_id = ?', [student_id], (err, rows) => {
                if (err) {
                    connection.release()
                    return reject({ ok: false, message: "Database error: " + err, status_code: 500 })
                }
                if (rows.length === 0) {
                    connection.release()
                    return reject({ ok: false, message: "Student not found!", status_code: 401 })
                }

                const student_id_number = rows[0].student_id_number

                connection.beginTransaction((err) => {
                    if (err) {
                        connection.release()
                        return reject({ ok: false, message: "Transaction error: " + err, status_code: 500 })
                    }

                    connection.execute('DELETE FROM student_records_regular_class WHERE student_id_number = ?', [student_id_number], (err) => {
                        if (err) return connection.rollback(() => {
                            connection.release()
                            reject({ ok: false, message: "Database error: " + err, status_code: 500 })
                        })

                        connection.execute('DELETE FROM student_accounts WHERE student_id = ?', [student_id], (err) => {
                            if (err) return connection.rollback(() => {
                                connection.release()
                                reject({ ok: false, message: "Database error: " + err, status_code: 500 })
                            })

                            connection.commit((err) => {
                                connection.release()
                                if (err) return reject({ ok: false, message: "Commit error: " + err, status_code: 500 })
                                writeActivityLog(null, null, 'admin', 'DELETE_STUDENT', 'Student', student_id, null, `Deleted student ID: ${student_id}`, null, null)
                                resolve({ ok: true, message: 'Successfully deleted student account and class records!', status_code: 200 })
                            })
                        })
                    })
                })
            })
        })
    })
}

// Admin delete teachers account
function adminDeleteTeacher(teacher_id, admin_id) {
    return new Promise((resolve, reject) => {
        db.execute('DELETE FROM teacher WHERE teacher_id = ? AND admin_id = ?', [teacher_id, admin_id], (err, result) => {
            if (err) { return reject({ ok: false, message: "Database error: " + err, status_code: 500 }) }
            if (result.length === 0) { return reject({ ok: false, message: "Unauthorized", status_code: 401 }) }
            writeActivityLog(admin_id, null, 'admin', 'DELETE_TEACHER', 'Teacher', teacher_id, null, `Deleted teacher ID: ${teacher_id}`, null, null)
            resolve({ ok: true, message: 'Successfully delete teacher data!', status_code: 200 })
        })
    })
}

// Admin delete guard account
function adminDeleteGuard(guard_id, admin_id) {
    return new Promise((resolve, reject) => {
        db.execute('DELETE FROM guards WHERE guard_id = ?', [guard_id], (err, result) => {
            if (err) return reject({ ok: false, message: 'Database error: ' + err.message, status_code: 500 })
            if (result.affectedRows === 0) return reject({ ok: false, message: 'Guard not found.', status_code: 404 })
            writeActivityLog(admin_id, null, 'admin', 'DELETE_GUARD', 'Guard', guard_id, null, `Deleted guard ID: ${guard_id}`, null, null)
            resolve({ ok: true, message: 'Guard account successfully deleted.', status_code: 200 })
        })
    })
}

// Admin get event program's present
function getPresentPrograms() {
    return new Promise((resolve, reject) => {
        db.execute(
            `   SELECT student_program, COUNT(*) AS total_attended
            FROM event_attendance_record
            WHERE status = 'TIME IN'
            GROUP BY student_program;  `,
            [],
            (err, result) => {
                if (err) {
                    return reject({
                        ok: false,
                        message: err,
                        status_code: 500
                    });
                }

                resolve({
                    ok: true,
                    message: 'Successfully retrieved data!',
                    content: result
                });
            }
        );
    });
}

// Admin edit student accounts
function adminEditStudentAccounts(id, id_number, firstname, middlename, lastname, program, year_level, email, guardian_number) {
    return new Promise((resolve, reject) => {

        // Check if id_number is already used by another student
        db.execute(
            `SELECT student_id FROM student_accounts WHERE student_id_number = ? AND student_id != ?`,
            [id_number, id],
            (err, rows) => {
                if (err) return reject(err)
                if (rows.length > 0) return resolve({ ok: false, duplicate: true, message: `ID number "${id_number}" is already assigned to another student.` })

                // Check if email is already used by another student
                const emailCheck = email
                    ? new Promise((res, rej) => db.execute(
                        `SELECT student_id FROM student_accounts WHERE student_email = ? AND student_id != ?`,
                        [email, id],
                        (err, rows) => err ? rej(err) : res(rows)
                    ))
                    : Promise.resolve([])

                emailCheck.then(emailRows => {
                    if (emailRows.length > 0) return resolve({ ok: false, duplicate_email: true, message: `Email "${email}" is already used by another student.` })

                    // Get old id_number for related table update
                    db.execute(`SELECT student_id_number FROM student_accounts WHERE student_id = ?`, [id], (err, rows) => {
                        if (err) return reject(err)
                        if (rows.length === 0) return reject(new Error('Student not found.'))
                        const old_id_number = rows[0].student_id_number

                        db.getConnection((err, connection) => {
                            if (err) return reject(err)
                            connection.beginTransaction(err => {
                                if (err) { connection.release(); return reject(err) }

                                const updateAccountQuery = `
                                    UPDATE student_accounts SET
                                        student_id_number = ?,
                                        student_firstname = ?,
                                        student_middlename = ?,
                                        student_lastname = ?,
                                        student_program = ?,
                                        student_year_level = ?,
                                        student_email = COALESCE(NULLIF(?, ''), student_email),
                                        student_guardian_number = ?
                                    WHERE student_id = ?`
                                connection.execute(updateAccountQuery,
                                    [id_number, firstname, middlename, lastname, program, year_level, email || '', guardian_number || null, id],
                                    (err, result) => {
                                        if (err) return connection.rollback(() => { connection.release(); reject(err) })
                                        if (result.affectedRows === 0) return connection.rollback(() => { connection.release(); reject(new Error('Student not found.')) })

                                        const updateClassQuery = `
                                            UPDATE student_records_regular_class SET
                                                student_id_number = ?,
                                                student_firstname = ?,
                                                student_middlename = ?,
                                                student_lastname = ?,
                                                student_program = ?,
                                                student_year_level = ?
                                            WHERE student_id_number = ?`
                                        connection.execute(updateClassQuery,
                                            [id_number, firstname, middlename, lastname, program, year_level, old_id_number],
                                            err => {
                                                if (err) return connection.rollback(() => { connection.release(); reject(err) })
                                                connection.commit(err => {
                                                    connection.release()
                                                    if (err) return reject(err)
                                                    resolve({ ok: true, message: 'Student account updated successfully!' })
                                                })
                                            })
                                    })
                            })
                        })
                    })
                }).catch(reject)
            }
        )
    })
}

function adminEditTeacherAccounts(
    id,
    teacher_name,
    teacher_email,
    teacher_program,
    admin_id
) {
    return new Promise((resolve, reject) => {

        // FIX: removed `AND admin_id = ?` — super admin passes admin_id=null/0
        // which caused affectedRows=0 and a false "Teacher not found" error.
        const updateQuery = `
        UPDATE teacher 
        SET 
            teacher_name = ?, 
            teacher_email = ?, 
            teacher_program = ?
        WHERE teacher_id = ?
    `;

        const values = [
            teacher_name,
            teacher_email,
            teacher_program,
            id
        ];

        db.execute(updateQuery, values, (err, result) => {
            if (err) {
                console.error("Database error updating teacher account:", err);
                return reject(err);
            }

            if (result.affectedRows === 0) {
                return reject(new Error("Update failed: Teacher not found or no changes were made."));
            }

            resolve({
                ok: true,
                message: "Teacher account updated successfully!",
                affectedRows: result.affectedRows
            });
        });
    });
}

function adminEditGuardAccounts(
    id,
    guard_name,
    guard_email,
    guard_designated_location,
    admin_id
) {
    return new Promise((resolve, reject) => {

        // FIX: removed `AND admin_id = ?` from WHERE clause.
        // Super admin passes admin_id=0 (no ownership), which caused affectedRows=0
        // and a false "Guard not found" error for every super admin edit.
        // Regular admin edits are already scoped by the route-level auth middleware.
        const updateQuery = `
        UPDATE guards 
        SET 
            guard_name = ?, 
            guard_email = ?, 
            guard_designated_location = ?
        WHERE guard_id = ?
    `;

        const values = [
            guard_name,
            guard_email,
            guard_designated_location,
            id
        ];

        db.execute(updateQuery, values, (err, result) => {
            if (err) {
                console.error("Database error updating guard account:", err);
                return reject(err);
            }

            if (result.affectedRows === 0) {
                return reject(new Error("Update failed: Guard not found or no changes were made."));
            }

            resolve({
                ok: true,
                message: "Guard account updated successfully!",
                affectedRows: result.affectedRows
            });
        });
    });
}

// Debugger
// async function tester() {
//     try {
//        const result = await getPresentPrograms()
//        console.log(result)
//     } catch(err) {
//        console.log(err)
//     }
// }

// tester()


// ============================================================
// YEAR LEVEL CRUD
// ============================================================
function getYearLevels() {
    return new Promise((resolve, reject) => {
        db.execute(
            `SELECT year_level_id, year_level_name, year_level_created FROM year_level ORDER BY year_level_id DESC`,
            [],
            (err, rows) => { if (err) return reject(err); resolve(rows) }
        )
    })
}

function addYearLevel(yearLevelName) {
    return new Promise((resolve, reject) => {
        db.execute(
            `SELECT year_level_id FROM year_level WHERE year_level_name = ?`,
            [yearLevelName],
            (err, rows) => {
                if (err) return reject(err)
                if (rows.length > 0) return reject(new Error('Year level already exists.'))
                db.execute(
                    `INSERT INTO year_level (year_level_name) VALUES (?)`,
                    [yearLevelName],
                    (err2) => { if (err2) return reject(err2); resolve('Year level added successfully.') }
                )
            }
        )
    })
}

function deleteYearLevel(yearLevelId) {
    return new Promise((resolve, reject) => {
        db.execute(
            `DELETE FROM year_level WHERE year_level_id = ?`,
            [yearLevelId],
            (err, result) => {
                if (err) return reject(err)
                if (result.affectedRows === 0) return reject(new Error('Year level not found.'))
                resolve('Year level deleted successfully.')
            }
        )
    })
}

// Export functions
function updateAdminProfilePicture(adminID, filename) {
    return new Promise((resolve, reject) => {
        db.execute(
            'UPDATE admin_accounts SET admin_profile_picture = ? WHERE admin_id = ?',
            [filename, adminID],
            (err) => {
                if (err) return reject(err)
                resolve(filename)
            }
        )
    })
}


// ============================================================
// SUPER ADMIN — Login
// ============================================================
async function superAdminLogin(email, password, ip, userAgent) {
    return new Promise((resolve, reject) => {
        db.execute(
            'SELECT super_admin_id, super_admin_name, super_admin_email, super_admin_password, super_admin_profile_picture FROM super_admin_accounts WHERE super_admin_email = ? LIMIT 1',
            [email],
            async (err, rows) => {
                if (err) return reject(new Error('Database error.'))
                if (rows.length === 0) {
                    writeLoginLog(null, null, email, 'super_admin', 'FAILED', ip, userAgent);
                    return reject(new Error('Invalid email or password.'))
                }
                const row = rows[0]
                const isMatch = await bcrypt.compare(password, row.super_admin_password)
                if (!isMatch) {
                    writeLoginLog(row.super_admin_id, row.super_admin_name, email, 'super_admin', 'FAILED', ip, userAgent);
                    return reject(new Error('Invalid email or password.'))
                }
                delete row.super_admin_password
                const token = jwt.sign(
                    { super_admin_id: row.super_admin_id, super_admin_name: row.super_admin_name, super_admin_email: row.super_admin_email, role: 'super_admin' },
                    JWT_SECRET,
                    { expiresIn: '24h' }
                )
                writeLoginLog(row.super_admin_id, row.super_admin_name, row.super_admin_email, 'super_admin', 'SUCCESS', ip, userAgent);
                resolve({ ok: true, message: 'Login successful.', token, super_admin_name: row.super_admin_name })
            }
        )
    })
}

// ============================================================
// SUPER ADMIN — Profile
// ============================================================
async function getSuperAdminData(superAdminId) {
    return new Promise((resolve, reject) => {
        db.execute(
            'SELECT super_admin_id, super_admin_name, super_admin_email, super_admin_profile_picture, date_account_created FROM super_admin_accounts WHERE super_admin_id = ?',
            [superAdminId],
            (err, rows) => { if (err) return reject(err); resolve(rows[0] ?? null) }
        )
    })
}

async function updateSuperAdminName(superAdminId, newName) {
    return new Promise((resolve, reject) => {
        db.execute(
            'UPDATE super_admin_accounts SET super_admin_name = ? WHERE super_admin_id = ?',
            [newName, superAdminId],
            (err, result) => {
                if (err) return reject(err)
                if (result.affectedRows === 0) return reject(new Error('Super Admin not found.'))
                resolve('Name updated successfully.')
            }
        )
    })
}

async function updateSuperAdminPassword(superAdminId, currentPassword, newPassword) {
    return new Promise((resolve, reject) => {
        db.execute(
            'SELECT super_admin_password FROM super_admin_accounts WHERE super_admin_id = ?',
            [superAdminId],
            async (err, rows) => {
                if (err) return reject(err)
                if (rows.length === 0) return reject(new Error('Super Admin not found.'))
                const isMatch = await bcrypt.compare(currentPassword, rows[0].super_admin_password)
                if (!isMatch) return reject(new Error('Current password is incorrect.'))
                const hashed = await bcrypt.hash(newPassword, SALT_ROUNDS)
                db.execute(
                    'UPDATE super_admin_accounts SET super_admin_password = ? WHERE super_admin_id = ?',
                    [hashed, superAdminId],
                    (err2) => { if (err2) return reject(err2); resolve('Password updated successfully.') }
                )
            }
        )
    })
}

async function updateSuperAdminProfilePicture(superAdminId, filename) {
    return new Promise((resolve, reject) => {
        db.execute(
            'UPDATE super_admin_accounts SET super_admin_profile_picture = ? WHERE super_admin_id = ?',
            [filename, superAdminId],
            (err) => { if (err) return reject(err); resolve(filename) }
        )
    })
}

// ============================================================
// SUPER ADMIN — Forgot Password OTP
// ============================================================
async function sendSuperAdminPasswordResetOTP(email) {
    const superAdmin = await new Promise((resolve, reject) => {
        db.execute('SELECT super_admin_id, super_admin_name FROM super_admin_accounts WHERE super_admin_email = ?', [email],
            (err, rows) => { if (err) return reject(err); resolve(rows[0] ?? null) })
    })
    if (!superAdmin) throw new Error('No account found with that email address.')
    const otp = generateOTP()
    otpStore[`super_admin:${email}`] = { otp, expiresAt: Date.now() + OTP_EXPIRY_MS }
    await transporter.sendMail({
        from: `"PanPacific University" <${process.env.GMAIL_USER}>`,
        to: email,
        subject: 'Super Admin Password Reset Code',
        html: `<div style="font-family:Arial,sans-serif;max-width:480px;margin:auto;padding:32px;border:1px solid #e0e0e0;border-radius:12px">
            <h2 style="color:#1a4545">Super Admin Password Reset</h2>
            <p>Hello <strong>${superAdmin.super_admin_name}</strong>, use the code below. Expires in <strong>5 minutes</strong>.</p>
            <div style="font-size:36px;font-weight:700;letter-spacing:10px;color:#1a4545;text-align:center;padding:24px 0">${otp}</div>
            <p style="color:#999;font-size:12px">If you did not request this, ignore this email.</p></div>`
    })
    return 'OTP sent successfully.'
}

function verifySuperAdminPasswordResetOTP(email, otp) {
    const record = otpStore[`super_admin:${email}`]
    if (!record) throw new Error('No OTP requested for this email.')
    if (Date.now() > record.expiresAt) { delete otpStore[`super_admin:${email}`]; throw new Error('OTP has expired. Please request a new one.') }
    if (record.otp !== otp) throw new Error('Incorrect OTP. Please try again.')
    otpStore[`super_admin:${email}`].verified = true
    return true
}

async function resetSuperAdminPasswordWithOTP(email, newPassword) {
    const record = otpStore[`super_admin:${email}`]
    if (!record || !record.verified) throw new Error('OTP not verified.')
    if (Date.now() > record.expiresAt) { delete otpStore[`super_admin:${email}`]; throw new Error('OTP has expired. Please start over.') }
    const hashed = await bcrypt.hash(newPassword, SALT_ROUNDS)
    await new Promise((resolve, reject) => {
        db.execute('UPDATE super_admin_accounts SET super_admin_password = ? WHERE super_admin_email = ?', [hashed, email],
            (err, result) => { if (err) return reject(err); if (result.affectedRows === 0) return reject(new Error('Super Admin not found.')); resolve() })
    })
    delete otpStore[`super_admin:${email}`]
    return 'Password reset successfully.'
}

// ============================================================
// SUPER ADMIN — Admin Account Management
// ============================================================
async function superAdminGetAllAdmins() {
    return new Promise((resolve, reject) => {
        db.execute(
            'SELECT admin_id, admin_name, admin_email, admin_profile_picture, date_account_created FROM admin_accounts ORDER BY admin_id DESC',
            [],
            (err, rows) => { if (err) return reject(err); resolve(rows) }
        )
    })
}

// ============================================================
// SUPER ADMIN — System-wide Stats
// ============================================================
async function superAdminGetSystemStats() {
    const query = (sql) => new Promise((resolve, reject) => {
        db.execute(sql, [], (err, rows) => { if (err) return reject(err); resolve(rows[0]) })
    })
    const [admins, teachers, guards, students, eventAttendees] = await Promise.all([
        query('SELECT COUNT(*) AS total FROM admin_accounts'),
        query('SELECT COUNT(*) AS total FROM teacher'),
        query('SELECT COUNT(*) AS total FROM guards'),
        query('SELECT COUNT(*) AS total FROM student_accounts'),
        query("SELECT COUNT(*) AS total FROM event_attendance_record WHERE status = 'TIME IN'"),
    ])
    return {
        total_admins: admins.total,
        total_teachers: teachers.total,
        total_guards: guards.total,
        total_students: students.total,
        total_event_attendees: eventAttendees.total,
    }
}


// ============================================================
// SUPER ADMIN — Login Logs (all roles)
// ============================================================
async function superAdminGetLoginLogs(limit) {
    const n = parseInt(limit) || 500
    return new Promise((resolve, reject) => {
        db.execute(
            `SELECT log_id, user_id, user_name, user_email, role, status,
                    IFNULL(ip_address, NULL) AS ip_address,
                    IFNULL(device_info, NULL) AS device_info,
                    DATE_FORMAT(login_at, '%Y-%m-%d %H:%i:%s') AS login_at
             FROM system_login_logs
             ORDER BY login_at DESC
             LIMIT ?`,
            [n],
            (err, rows) => {
                if (err) {
                    // Fallback if new columns don't exist yet
                    db.execute(
                        `SELECT log_id, user_id, user_name, user_email, role, status,
                                NULL AS ip_address, NULL AS device_info,
                                DATE_FORMAT(login_at, '%Y-%m-%d %H:%i:%s') AS login_at
                         FROM system_login_logs
                         ORDER BY login_at DESC
                         LIMIT ?`,
                        [n],
                        (err2, rows2) => { if (err2) return reject(err2); resolve(rows2) }
                    )
                } else {
                    resolve(rows)
                }
            }
        )
    })
}

// ============================================================
// SUPER ADMIN — Activity Logs (all users, all roles)
// ============================================================
async function superAdminGetActivityLogs(limit) {
    const n = parseInt(limit) || 500
    return new Promise((resolve, reject) => {
        db.execute(
            `SELECT log_id, actor_id, actor_name, actor_role, action,
                    target_type, target_id, target_name, details,
                    IFNULL(ip_address, NULL) AS ip_address,
                    IFNULL(device_info, NULL) AS device_info,
                    DATE_FORMAT(performed_at, '%Y-%m-%d %H:%i:%s') AS performed_at
             FROM system_activity_logs
             ORDER BY performed_at DESC
             LIMIT ?`,
            [n],
            (err, rows) => {
                if (err) {
                    // Fallback if new columns don't exist yet
                    db.execute(
                        `SELECT log_id, actor_id, actor_name, actor_role, action,
                                target_type, target_id, target_name, details,
                                NULL AS ip_address, NULL AS device_info,
                                DATE_FORMAT(performed_at, '%Y-%m-%d %H:%i:%s') AS performed_at
                         FROM system_activity_logs
                         ORDER BY performed_at DESC
                         LIMIT ?`,
                        [n],
                        (err2, rows2) => { if (err2) return reject(err2); resolve(rows2) }
                    )
                } else {
                    resolve(rows)
                }
            }
        )
    })
}

// ============================================================
// SUPER ADMIN — System-wide Event Attendance
// ============================================================
async function superAdminGetAllEvents() {
    return new Promise((resolve, reject) => {
        db.execute(
            `SELECT e.student_id_number, e.student_name, e.student_program, e.student_year_level,
                    DATE_FORMAT(e.date,'%Y-%m-%d') AS date, e.time, e.status, e.event_name, a.admin_name
             FROM event_attendance_record e
             LEFT JOIN admin_accounts a ON e.admin_id = a.admin_id
             ORDER BY e.date DESC, e.time DESC`,
            [], (err, rows) => { if (err) return reject(err); resolve(rows) }
        )
    })
}

async function superAdminGetAllEventsHistory() {
    return new Promise((resolve, reject) => {
        db.execute(
            `SELECT e.student_id_number, e.student_name, e.student_program, e.student_year_level,
                    DATE_FORMAT(e.date,'%Y-%m-%d') AS date, e.time, e.status, e.event_name, a.admin_name
             FROM event_attendance_history_record e
             LEFT JOIN admin_accounts a ON e.admin_id = a.admin_id
             ORDER BY e.date DESC, e.time DESC`,
            [], (err, rows) => { if (err) return reject(err); resolve(rows) }
        )
    })
}

// ============================================================
// SUPER ADMIN — Admin Account Management (with activity logging)
// ============================================================
async function superAdminCreateAdmin(adminName, adminEmail, adminPassword) {
    const exists = await new Promise((resolve, reject) => {
        db.execute('SELECT admin_id FROM admin_accounts WHERE admin_email = ? LIMIT 1', [adminEmail],
            (err, rows) => { if (err) return reject(err); resolve(rows.length > 0) })
    })
    if (exists) throw new Error('An admin with this email already exists.')
    const hashed = await bcrypt.hash(adminPassword, SALT_ROUNDS)
    return new Promise((resolve, reject) => {
        db.execute(
            'INSERT INTO admin_accounts (admin_name, admin_email, admin_password) VALUES (?, ?, ?)',
            [adminName, adminEmail, hashed],
            (err, result) => {
                if (err) return reject(err)
                writeActivityLog(null, 'Super Admin', 'super_admin', 'CREATE_ADMIN', 'Admin', result.insertId, adminName, `Created admin: ${adminEmail}`, null, null)
                resolve('Admin account created successfully.')
            }
        )
    })
}

async function superAdminEditAdmin(adminId, adminName, adminEmail) {
    const dup = await new Promise((resolve, reject) => {
        db.execute('SELECT admin_id FROM admin_accounts WHERE admin_email = ? AND admin_id != ? LIMIT 1',
            [adminEmail, adminId], (err, rows) => { if (err) return reject(err); resolve(rows.length > 0) })
    })
    if (dup) throw new Error('Email is already used by another admin.')
    return new Promise((resolve, reject) => {
        db.execute(
            'UPDATE admin_accounts SET admin_name = ?, admin_email = ? WHERE admin_id = ?',
            [adminName, adminEmail, adminId],
            (err, result) => {
                if (err) return reject(err)
                if (result.affectedRows === 0) return reject(new Error('Admin not found.'))
                writeActivityLog(null, 'Super Admin', 'super_admin', 'EDIT_ADMIN', 'Admin', adminId, adminName, `Updated to email: ${adminEmail}`, null, null)
                resolve('Admin account updated successfully.')
            }
        )
    })
}

async function superAdminDeleteAdmin(adminId) {
    return new Promise((resolve, reject) => {
        db.execute('DELETE FROM admin_accounts WHERE admin_id = ?', [adminId],
            (err, result) => {
                if (err) return reject(err)
                if (result.affectedRows === 0) return reject(new Error('Admin not found.'))
                writeActivityLog(null, 'Super Admin', 'super_admin', 'DELETE_ADMIN', 'Admin', adminId, null, `Deleted admin ID: ${adminId}`, null, null)
                resolve('Admin account deleted successfully.')
            }
        )
    })
}

async function superAdminResetAdminPassword(adminId, newPassword) {
    const hashed = await bcrypt.hash(newPassword, SALT_ROUNDS)
    return new Promise((resolve, reject) => {
        db.execute('UPDATE admin_accounts SET admin_password = ? WHERE admin_id = ?', [hashed, adminId],
            (err, result) => {
                if (err) return reject(err)
                if (result.affectedRows === 0) return reject(new Error('Admin not found.'))
                writeActivityLog(null, 'Super Admin', 'super_admin', 'RESET_ADMIN_PASSWORD', 'Admin', adminId, null, `Reset password for admin ID: ${adminId}`, null, null)
                resolve('Admin password reset successfully.')
            }
        )
    })
}

// Get all teachers a student is enrolled under (for class picker on barcode screen)
function getStudentEnrolledTeachers(studentIdNumber) {
    return new Promise((resolve, reject) => {
        db.execute(
            `SELECT DISTINCT t.teacher_id, t.teacher_name, t.teacher_program,
                    t.teacher_barcode_scanner_serial_number,
                    s.subject_name_set AS subject
             FROM student_records_regular_class r
             JOIN teacher t ON t.teacher_barcode_scanner_serial_number = r.teacher_barcode_scanner_serial_number
             LEFT JOIN subject_and_year_level_setter s ON s.teacher_barcode_scanner_serial_number = t.teacher_barcode_scanner_serial_number
             WHERE r.student_id_number = ?`,
            [studentIdNumber],
            (err, rows) => { if (err) return reject(err); resolve(rows) }
        )
    })
}

// Get all distinct class session dates for the student's enrolled teachers.
// Returns every date where ANY student attended class under a teacher this student
// is enrolled with — used to detect unrecorded absences on the student dashboard.
function getStudentClassSessions(studentIdNumber) {
    return new Promise((resolve, reject) => {
        db.execute(
            `SELECT DISTINCT
                ar.subject,
                ar.teacher_barcode_scanner_serial_number,
                DATE(ar.attendance_date) AS class_date
             FROM attendance_record ar
             INNER JOIN student_records_regular_class src
                ON src.teacher_barcode_scanner_serial_number = ar.teacher_barcode_scanner_serial_number
                AND src.student_id_number = ?
             ORDER BY class_date DESC`,
            [studentIdNumber],
            (err, rows) => { if (err) return reject(err); resolve(rows) }
        )
    })
}

// Reset student device binding — clears device_id so student can re-register from a new device
function adminResetStudentDevice(studentId) {
    return new Promise((resolve, reject) => {
        db.execute(
            'UPDATE student_accounts SET device_id = NULL WHERE student_id = ?',
            [studentId],
            (err, result) => {
                if (err) return reject(err)
                if (result.affectedRows === 0) return reject(new Error('Student not found.'))
                resolve('Device binding reset successfully. Student can now log in from a new device.')
            }
        )
    })
}

// Get Teacher by Serial Number
function getTeacherBySerial(teacherSerial) {
    return new Promise((resolve, reject) => {
        db.execute(
            `SELECT teacher_id, teacher_name FROM teacher WHERE teacher_barcode_scanner_serial_number = ? LIMIT 1`,
            [teacherSerial],
            (err, result) => {
                if (err) return reject(err)
                resolve(result)
            }
        )
    })
}

// Update attendance status (Present / Absent / Excused) for an existing record
async function updateAttendanceStatus(attendance_id, new_status, teacher_barcode_scanner_serial_number) {
    return new Promise((resolve, reject) => {
        // Present and Late get the current time (teacher override = now)
        // Absent and Excused clear the time (no scan time makes sense)
        const needsTime = new_status === 'Present' || new_status === 'Late';
        const now = new Date().toLocaleString('sv-SE', { timeZone: 'Asia/Manila' }).slice(11, 19); // "HH:MM:SS" Philippine Time
        const sql = needsTime
            ? `UPDATE attendance_record SET attendance_status = ?, attendance_time = ?, manually_overridden = 1 WHERE attendance_id = ? AND teacher_barcode_scanner_serial_number = ?`
            : `UPDATE attendance_record SET attendance_status = ?, attendance_time = NULL, manually_overridden = 1 WHERE attendance_id = ? AND teacher_barcode_scanner_serial_number = ?`;
        const params = needsTime
            ? [new_status, now, attendance_id, teacher_barcode_scanner_serial_number]
            : [new_status, attendance_id, teacher_barcode_scanner_serial_number];
        db.execute(sql, params, (err, result) => {
            if (err) return reject(err)
            if (result.affectedRows === 0) return reject(new Error('Record not found or not authorized.'))
            resolve('Status updated successfully.')
        })
    })
}

// Insert a manual absent/excused record for a student who has no record yet
async function insertManualStatusRecord(
    student_id, student_id_number, student_firstname, student_middlename,
    student_lastname, student_program, student_year_level, subject,
    teacher_barcode_scanner_serial_number, attendance_status
) {
    return new Promise((resolve, reject) => {
        db.execute(
            `INSERT INTO attendance_record 
             (student_id, student_id_number, student_firstname, student_middlename, student_lastname,
              student_program, year_level, subject, teacher_barcode_scanner_serial_number, attendance_status,
              manually_overridden, attendance_time)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, ?)`,
            [student_id || null, student_id_number, student_firstname, student_middlename || null,
             student_lastname, student_program || null, student_year_level, subject,
             teacher_barcode_scanner_serial_number, attendance_status,
             // Absent and Excused have no scan time — set NULL explicitly to avoid curtime() default
             (attendance_status === 'Absent' || attendance_status === 'Excused') ? null : new Date().toLocaleString('sv-SE', { timeZone: 'Asia/Manila' }).slice(11, 19)],
            (err, result) => {
                if (err) return reject(err)
                resolve({ insertId: result.insertId, message: 'Record inserted successfully.' })
            }
        )
    })
}


// ============================================================
// DAILY EVENT RESET CRON (node-cron)
// Fires every day at midnight Philippine Standard Time (UTC+8).
// What it does:
//   1. Copies any event_attendance_record rows from previous days
//      into event_attendance_history_record (INSERT IGNORE — no duplicates).
//   2. Deletes those stale rows from the live event_attendance_record
//      so it only ever holds today's records.
//   3. Clears event_name_set for all admins in event_setter so each
//      admin must explicitly set a new event the next day.
// ============================================================
const cron = require('node-cron')

async function runDailyEventReset() {
    console.log('[DailyReset] Running daily event reset at', new Date().toISOString())

    const connection = await new Promise((resolve, reject) => {
        db.getConnection((err, conn) => { if (err) return reject(err); resolve(conn) })
    })

    try {
        await new Promise((resolve, reject) => connection.beginTransaction(err => err ? reject(err) : resolve()))

        // Step 1: Find live records from any day before today
        const [stale] = await new Promise((resolve, reject) => {
            connection.execute(
                `SELECT * FROM event_attendance_record WHERE DATE(date) < CURDATE()`,
                [],
                (err, rows) => err ? reject(err) : resolve([rows])
            )
        })

        if (stale.length === 0) {
            console.log('[DailyReset] No stale event records to archive.')
            await new Promise((resolve, reject) => connection.commit(err => err ? reject(err) : resolve()))
            connection.release()
            return
        }

        // Step 2: Copy stale records to history (INSERT IGNORE skips duplicates)
        for (const row of stale) {
            await new Promise((resolve, reject) => {
                connection.execute(
                    `INSERT IGNORE INTO event_attendance_history_record
                     (student_id, student_name, student_id_number, student_program,
                      student_year_level, event_name, guard_name, guard_location,
                      status, guard_id, admin_id, time, date)
                     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                    [
                        row.student_id, row.student_name, row.student_id_number,
                        row.student_program, row.student_year_level, row.event_name,
                        row.guard_name, row.guard_location, row.status,
                        row.guard_id, row.admin_id, row.time, row.date
                    ],
                    (err) => err ? reject(err) : resolve()
                )
            })
        }

        // Step 3: Delete stale rows from the live table
        await new Promise((resolve, reject) => {
            connection.execute(
                `DELETE FROM event_attendance_record WHERE DATE(date) < CURDATE()`,
                [],
                (err) => err ? reject(err) : resolve()
            )
        })

        // Step 4: Clear the active event name for every admin
        await new Promise((resolve, reject) => {
            connection.execute(
                `UPDATE event_setter SET event_name_set = ''`,
                [],
                (err) => err ? reject(err) : resolve()
            )
        })

        await new Promise((resolve, reject) => connection.commit(err => err ? reject(err) : resolve()))
        console.log(`[DailyReset] Archived ${stale.length} record(s), cleared live table and event names.`)

    } catch (err) {
        await new Promise(resolve => connection.rollback(() => resolve()))
        console.error('[DailyReset] Error — transaction rolled back:', err)
    } finally {
        connection.release()
    }
}

// '* * * * *' = every minute — catches stale records within 60s of midnight
// with negligible DB load (exits immediately when no old records are found)
cron.schedule('* * * * *', runDailyEventReset)

console.log('[DailyReset] Cron scheduled — checks every minute for stale event records')




// ── Message Notifications (for all roles: teacher, student, guard, admin, super_admin) ──

function createMsgNotification(receiverId, receiverRole, senderId, senderRole, senderName, type, preview, emoji, messageId) {
    const previewText = preview ? String(preview).substring(0, 100) : null
    return new Promise((resolve) => {
        db.execute(
            `INSERT INTO message_notifications
             (receiver_id, receiver_role, sender_id, sender_role, sender_name, type, preview, emoji, message_id)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [receiverId, receiverRole, senderId, senderRole, senderName, type, previewText, emoji || null, messageId || null],
            (err, result) => {
                if (err) { console.error('[MsgNotif]', err.message); return resolve(null) }
                resolve(result.insertId)
            }
        )
    })
}

function getMsgNotifications(receiverId, receiverRole, limit) {
    const n = parseInt(limit) || 30
    const picQuery = {
        student:     { pic: 'SELECT student_profile_picture AS pic FROM student_accounts WHERE student_id = ? LIMIT 1', name: 'SELECT CONCAT(student_firstname, " ", COALESCE(student_middlename, ""), " ", student_lastname) AS name FROM student_accounts WHERE student_id = ? LIMIT 1' },
        teacher:     { pic: 'SELECT teacher_profile_picture AS pic FROM teacher WHERE teacher_id = ? LIMIT 1', name: 'SELECT teacher_name AS name FROM teacher WHERE teacher_id = ? LIMIT 1' },
        admin:       { pic: 'SELECT admin_profile_picture AS pic FROM admin_accounts WHERE admin_id = ? LIMIT 1', name: 'SELECT admin_name AS name FROM admin_accounts WHERE admin_id = ? LIMIT 1' },
        super_admin: { pic: 'SELECT super_admin_profile_picture AS pic FROM super_admin_accounts WHERE super_admin_id = ? LIMIT 1', name: 'SELECT super_admin_name AS name FROM super_admin_accounts WHERE super_admin_id = ? LIMIT 1' },
        guard:       { pic: 'SELECT guard_profile_picture AS pic FROM guards WHERE guard_id = ? LIMIT 1', name: 'SELECT guard_name AS name FROM guards WHERE guard_id = ? LIMIT 1' }
    }
    return new Promise((resolve) => {
        db.execute(
            `SELECT id, sender_id, sender_role, sender_name, type, preview, emoji, message_id, is_read, created_at
             FROM message_notifications
             WHERE receiver_id = ? AND receiver_role = ?
             ORDER BY created_at DESC LIMIT ?`,
            [receiverId, receiverRole, n],
            async (err, rows) => {
                if (err) { console.error('[MsgNotif]', err.message); return resolve([]) }
                // Attach current sender profile picture AND name (live from account table)
                const withPics = await Promise.all(rows.map(row => new Promise(res => {
                    const q = picQuery[row.sender_role]
                    if (!q || !row.sender_id) return res({ ...row, sender_picture: null })
                    const fetchPic  = new Promise(r => db.execute(q.pic,  [row.sender_id], (e, r2) => r((!e && r2?.length) ? r2[0].pic  : null)))
                    const fetchName = new Promise(r => db.execute(q.name, [row.sender_id], (e, r2) => r((!e && r2?.length) ? r2[0].name?.trim() : null)))
                    Promise.all([fetchPic, fetchName]).then(([pic, name]) => {
                        res({ ...row, sender_picture: pic || null, sender_name: name || row.sender_name })
                    })
                })))
                resolve(withPics)
            }
        )
    })
}

// Update sender/receiver name in messages and notifications when user changes their name
// Get current name for a user from their account table
function getCurrentUserName(userId, userRole) {
    const nameQuery = {
        student:     'SELECT CONCAT(student_firstname, " ", COALESCE(NULLIF(student_middlename,""),""), " ", student_lastname) AS name FROM student_accounts WHERE student_id = ? LIMIT 1',
        teacher:     'SELECT teacher_name AS name FROM teacher WHERE teacher_id = ? LIMIT 1',
        admin:       'SELECT admin_name AS name FROM admin_accounts WHERE admin_id = ? LIMIT 1',
        super_admin: 'SELECT super_admin_name AS name FROM super_admin_accounts WHERE super_admin_id = ? LIMIT 1',
        guard:       'SELECT guard_name AS name FROM guards WHERE guard_id = ? LIMIT 1'
    }
    return new Promise(res => {
        const q = nameQuery[userRole]
        if (!q || !userId) return res(null)
        db.execute(q, [userId], (e, rows) => res((!e && rows?.length) ? rows[0].name?.trim() : null))
    })
}

// Enrich reaction notifications with live reactor names
async function enrichReactionNotifications(notifications) {
    return Promise.all(notifications.map(async n => {
        const meta = n.meta || {}
        if (meta.reactor_id && meta.reactor_role) {
            const liveName = await getCurrentUserName(meta.reactor_id, meta.reactor_role)
            if (liveName) return { ...n, title: liveName }
        }
        return n
    }))
}

function updateMessagesName(userId, userRole, newName) {
    const p = (sql, params) => new Promise(res => db.execute(sql, params, (err) => { if (err) console.error('[updateMessagesName]', err.message); res() }))
    return Promise.all([
        p('UPDATE messages SET sender_name = ? WHERE sender_id = ? AND sender_role = ?', [newName, userId, userRole]),
        p('UPDATE messages SET receiver_name = ? WHERE receiver_id = ? AND receiver_role = ?', [newName, userId, userRole]),
        p('UPDATE message_notifications SET sender_name = ? WHERE sender_id = ? AND sender_role = ?', [newName, userId, userRole]),
    ])
}

function deleteMsgNotification(id, receiverId, receiverRole) {
    return new Promise((resolve) => {
        db.execute(
            'DELETE FROM message_notifications WHERE id = ? AND receiver_id = ? AND receiver_role = ?',
            [id, receiverId, receiverRole],
            (err) => { if (err) console.error('[DeleteNotif]', err.message); resolve() }
        )
    })
}

function getUnreadMsgNotifCount(receiverId, receiverRole) {
    return new Promise((resolve) => {
        db.execute(
            `SELECT COUNT(*) AS cnt FROM message_notifications WHERE receiver_id = ? AND receiver_role = ? AND is_read = 0`,
            [receiverId, receiverRole],
            (err, rows) => resolve(err ? 0 : (rows[0]?.cnt || 0))
        )
    })
}

function markMsgNotificationsRead(receiverId, receiverRole, ids) {
    return new Promise((resolve) => {
        const sql = ids && ids.length
            ? `UPDATE message_notifications SET is_read = 1 WHERE receiver_id = ? AND receiver_role = ? AND id IN (${ids.map(() => '?').join(',')})`
            : `UPDATE message_notifications SET is_read = 1 WHERE receiver_id = ? AND receiver_role = ?`
        const params = ids && ids.length ? [receiverId, receiverRole, ...ids] : [receiverId, receiverRole]
        db.execute(sql, params, (err) => {
            if (err) console.error('[MsgNotif]', err.message)
            resolve()
        })
    })
}

function cleanOldMsgNotifications() {
    db.execute(
        `DELETE FROM message_notifications WHERE created_at < DATE_SUB(NOW(), INTERVAL 7 DAY)`,
        [], (err) => { if (err) console.error('[MsgNotif cleanup]', err.message) }
    )
}

module.exports = {
    blacklistToken,
    isTokenBlacklisted,
    sendSMS,
    adminEditGuardAccounts,
    adminEditTeacherAccounts,
    adminEditStudentAccounts,
    editClassRosterStudent,
    getPresentPrograms,
    adminDeleteGuard,
    adminDeleteTeacher,
    adminDeleteStudents,
    updateAdminPassword,
    changeAdminName,
    getAttendanceEventsForTeacher,
    getAdminData,
    getAttendanceEventHistoryRecords,
    getAttendanceEventRecords,
    guardLogin,
    guardInsertAttendanceRecord,
    guardInsertAttendanceRecordByIdNumber,
    setEventName,
    getEventSet,
    getActiveEventName,
    adminLogin,
    deleteProgram,
    generateBarcode,
    generateDeviceID,
    hashPassword,
    comparePassword,
    checkStudentAccountDuplication,
    studentRegistration,
    studentLogin,
    studentGoogleLogin,
    generateToken,
    verifyToken,
    removeBearer,
    deviceIDChecker,
    studentUpdateProfile,
    getStudentsData,
    updateStudentPassword,
    studentUpdateProfile,
    getStudentBarcode,
    updateStudentBarcode,
    getAllPrograms,
    teacherRegistration,
    teacherLogin,
    teacherGetAllStudentDataTotalCount,
    teacherGetTotalAttendanceRecord,
    searchStudentAccounts,
    teacherAddStudent,
    teacherGetStudentRegistered,
    teacherSubjectAndYearLevelSetter,
    getActiveSubjectAndYearLevel,
    checkStudentIfExistsInRegistration,
    checkStudentToRegularClass,
    insertStudentAttendance,
    checkYearLevelAndSerialNumber,
    getStudentAttendanceNow,
    updateAttendanceStatus,
    insertManualStatusRecord,
    getStudentAttendanceHistory,
    getStudentSubjects,
    deleteSubject,
    addSubject,
    teacherGetYearLevel,
    updateStudentRegisteredRecord,
    deleteStudentRegisteredRecord,
    getTeacherData,
    getTeacherBySerial,
    adminResetStudentDevice,
    updateStudentProfilePicture,
    updateTeacherProfilePicture,
    updateTeacherPassword,
    updateTeacherName,
    getAttendanceHistoryForStudentOnly,
    emailFinder,
    guardRegistration,
    getWholeCampusAccounts,
    addProgram,
    setTeacherLocation,
    verifyStudentLocation,
    getTeacherSerialByStudentIDNumber,
    manualInsertAttendance,
    sendPasswordResetOTP,
    verifyPasswordResetOTP,
    resetPasswordWithOTP,
    sendAdminPasswordResetOTP,
    verifyAdminPasswordResetOTP,
    resetAdminPasswordWithOTP,
    sendStudentPasswordResetOTP,
    verifyStudentPasswordResetOTP,
    resetStudentPasswordWithOTP,
    sendGuardPasswordResetOTP,
    verifyGuardPasswordResetOTP,
    resetGuardPasswordWithOTP,
    addYearLevel,
    deleteYearLevel,
    getYearLevels,
    updateAdminProfilePicture,
    superAdminLogin,
    getSuperAdminData,
    updateSuperAdminName,
    updateSuperAdminPassword,
    updateSuperAdminProfilePicture,
    sendSuperAdminPasswordResetOTP,
    verifySuperAdminPasswordResetOTP,
    resetSuperAdminPasswordWithOTP,
    superAdminGetAllAdmins,
    superAdminCreateAdmin,
    superAdminEditAdmin,
    superAdminDeleteAdmin,
    superAdminResetAdminPassword,
    superAdminGetSystemStats,
    superAdminGetAllEvents,
    superAdminGetAllEventsHistory,
    superAdminGetLoginLogs,
    superAdminGetActivityLogs,
    getStudentEnrolledTeachers,
    getStudentClassSessions,
    writeActivityLog,
    createNotification,
    getNotifications,
    markNotificationsRead,
    getUnreadCount,
    sendMessage,
    setTypingStatus,
    getTypingStatus,
    editMessage,
    unsendMessage,
    deleteMessageForMe,
    pinMessage,
    getConversation,
    getMessageContacts,
    getUnreadMessageCount,
    markMessagesRead,
    searchUsersForMessaging,
    getSubjectClassList,
    addStudentToSubjectClassList,
    removeStudentFromSubjectClassList,
    writeLoginLog,
    writeLogoutLog,
    getSystemSetting,
    setSystemSetting,
    reactToMessage,
    createMsgNotification,
    deleteMsgNotification,
    updateMessagesName,
    enrichReactionNotifications,
    getMsgNotifications,
    getUnreadMsgNotifCount,
    markMsgNotificationsRead,
    cleanOldMsgNotifications
}

function writeLogoutLog(userId, userName, userEmail, role, ip, userAgent) {
    const cleanIp = (ip || '').replace(/^::ffff:/, '') || null;
    const params  = [userId || null, userName || null, userEmail || null, role, 'LOGOUT', cleanIp, userAgent || null];

    function tryInsert(attempt) {
        db.execute(
            'INSERT INTO system_login_logs (user_id, user_name, user_email, role, status, ip_address, device_info) VALUES (?, ?, ?, ?, ?, ?, ?)',
            params,
            (err) => {
                if (!err) return;
                console.error('[LogoutLog] INSERT failed (attempt ' + attempt + '):', err.message);
                if (attempt < 3) {
                    setTimeout(() => tryInsert(attempt + 1), 300 * attempt);
                } else {
                    db.execute(
                        'INSERT INTO system_login_logs (user_id, user_name, user_email, role, status) VALUES (?, ?, ?, ?, ?)',
                        [userId || null, userName || null, userEmail || null, role, 'LOGOUT'],
                        (err2) => { if (err2) console.error('[LogoutLog] Fallback INSERT failed:', err2.message); }
                    );
                }
            }
        );
    }
    tryInsert(1);
}

async function getSystemSetting(key) {
    return new Promise((resolve, reject) => {
        db.execute('SELECT setting_value FROM system_settings WHERE setting_key = ?', [key], (err, rows) => {
            if (err) return reject(err)
            resolve(rows[0]?.setting_value ?? null)
        })
    })
}

async function setSystemSetting(key, value) {
    return new Promise((resolve, reject) => {
        db.execute(
            'INSERT INTO system_settings (setting_key, setting_value) VALUES (?, ?) ON DUPLICATE KEY UPDATE setting_value = ?, updated_at = NOW()',
            [key, value, value],
            (err) => { if (err) return reject(err); resolve() }
        )
    })
}
// ============================================================
// NOTIFICATIONS
// ============================================================

function createNotification(type, title, message, meta) {
    return new Promise((resolve, reject) => {
        const metaStr = meta ? JSON.stringify(meta) : null;
        db.execute(
            `INSERT INTO notifications (type, title, message, meta) VALUES (?, ?, ?, ?)`,
            [type, title, message, metaStr],
            (err, result) => {
                if (err) {
                    db.execute(`
                        CREATE TABLE IF NOT EXISTS notifications (
                            id            INT AUTO_INCREMENT PRIMARY KEY,
                            type          VARCHAR(50)  NOT NULL DEFAULT 'info',
                            title         VARCHAR(255) NOT NULL,
                            message       TEXT,
                            meta          JSON,
                            is_read_admin TINYINT(1)   NOT NULL DEFAULT 0,
                            is_read_super TINYINT(1)   NOT NULL DEFAULT 0,
                            created_at    DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP
                        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
                    `, [], (createErr) => {
                        if (createErr) return reject(createErr);
                        db.execute(
                            `INSERT INTO notifications (type, title, message, meta) VALUES (?, ?, ?, ?)`,
                            [type, title, message, metaStr],
                            (err2, result2) => {
                                if (err2) return reject(err2);
                                resolve(result2.insertId);
                            }
                        );
                    });
                    return;
                }
                resolve(result.insertId);
            }
        );
    });
}

function getNotifications(role, limit) {
    const n = parseInt(limit) || 50;
    const readCol = role === 'super_admin' ? 'is_read_super' : 'is_read_admin';
    return new Promise((resolve) => {
        db.execute(
            `SELECT id, type, title, message, meta, ${readCol} AS is_read,
                    DATE_FORMAT(created_at, '%Y-%m-%d %H:%i:%s') AS created_at
             FROM notifications
             WHERE type != 'reaction'
             ORDER BY created_at DESC LIMIT ?`,
            [n],
            (err, rows) => resolve(err ? [] : rows)
        );
    });
}

function markNotificationsRead(role, ids) {
    const col = role === 'super_admin' ? 'is_read_super' : 'is_read_admin';
    return new Promise((resolve, reject) => {
        if (!ids || ids.length === 0) {
            db.execute(`UPDATE notifications SET ${col} = 1`, [], (err) => err ? reject(err) : resolve());
        } else {
            const ph = ids.map(() => '?').join(',');
            db.execute(`UPDATE notifications SET ${col} = 1 WHERE id IN (${ph})`, ids, (err) => err ? reject(err) : resolve());
        }
    });
}

function getUnreadCount(role) {
    const col = role === 'super_admin' ? 'is_read_super' : 'is_read_admin';
    return new Promise((resolve) => {
        db.execute(`SELECT COUNT(*) AS cnt FROM notifications WHERE ${col} = 0 AND type != 'reaction'`, [],
            (err, rows) => resolve(err ? 0 : (rows[0]?.cnt || 0))
        );
    });
}

// ============================================================
// MESSAGING
// ============================================================

// Auto-create messages table — uses db.query (supports DDL better than db.execute)
db.query(
    `CREATE TABLE IF NOT EXISTS messages (
        id            INT AUTO_INCREMENT PRIMARY KEY,
        sender_id     INT          NOT NULL,
        sender_role   VARCHAR(20)  NOT NULL,
        sender_name   VARCHAR(255) NOT NULL,
        receiver_id   INT          NOT NULL,
        receiver_role VARCHAR(20)  NOT NULL,
        receiver_name VARCHAR(255) NOT NULL,
        content       TEXT,
        file_url      VARCHAR(500) DEFAULT NULL,
        file_name     VARCHAR(255) DEFAULT NULL,
        file_type     VARCHAR(100) DEFAULT NULL,
        is_read                  TINYINT(1)   NOT NULL DEFAULT 0,
        read_at                  DATETIME     DEFAULT NULL,
        is_edited                TINYINT(1)   NOT NULL DEFAULT 0,
        edited_at                DATETIME     DEFAULT NULL,
        is_unsent                TINYINT(1)   NOT NULL DEFAULT 0,
        deleted_for_sender       TINYINT(1)   NOT NULL DEFAULT 0,
        deleted_for_receiver     TINYINT(1)   NOT NULL DEFAULT 0,
        is_pinned                TINYINT(1)   NOT NULL DEFAULT 0,
        forwarded_from_id        INT          DEFAULT NULL,
        sender_profile_picture   VARCHAR(500) DEFAULT NULL,
        receiver_profile_picture VARCHAR(500) DEFAULT NULL,
        created_at               DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`,
    (err) => {
        if (err) {
            console.error('[Messages] Table creation failed:', err.message)
        } else {
            console.log('[Messages] Table ready')
        }
    }
)

// Send a message
// React to a message — stores per-user reactions in JSON column
// Returns { reactions, message } where message has sender/receiver info for notifications
function reactToMessage(messageId, reactorId, reactorRole, emoji) {
    return new Promise((resolve, reject) => {
        db.execute(
            'SELECT id, reactions, sender_id, sender_role, sender_name, receiver_id, receiver_role, receiver_name FROM messages WHERE id = ? LIMIT 1',
            [messageId],
            (err, rows) => {
                if (err) return reject(err)
                if (!rows.length) return reject(new Error('Message not found.'))
                const msg = rows[0]
                let reactions = {}
                try { reactions = JSON.parse(msg.reactions || '{}') } catch(e) { reactions = {} }
                const key = `${reactorRole}_${reactorId}`
                if (emoji) reactions[key] = { reactorId, reactorRole, emoji }
                else        delete reactions[key]
                const json = Object.keys(reactions).length ? JSON.stringify(reactions) : null
                db.execute('UPDATE messages SET reactions = ? WHERE id = ?', [json, messageId], (err2) => {
                    if (err2) return reject(err2)
                    resolve({ reactions, msg })
                })
            }
        )
    })
}

function sendMessage(senderId, senderRole, senderName, receiverId, receiverRole, receiverName, content, fileUrl, fileName, fileType, senderPic, receiverPic, replyToId) {
    return new Promise((resolve, reject) => {
        db.execute(
            `INSERT INTO messages (sender_id, sender_role, sender_name, receiver_id, receiver_role, receiver_name, content, file_url, file_name, file_type, sender_profile_picture, receiver_profile_picture, reply_to_id)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [senderId, senderRole, senderName, receiverId, receiverRole, receiverName, content || null, fileUrl || null, fileName || null, fileType || null, senderPic || null, receiverPic || null, replyToId || null],
            (err, result) => {
                if (err) return reject(err)
                resolve(result.insertId)
            }
        )
    })
}

// Get conversation between two users
function getConversation(userAId, userARole, userBId, userBRole, limit) {
    const n = parseInt(limit) || 50
    // Always fetch current profile pictures from account tables (not stored in message)
    const picQuery = {
        student:     'SELECT student_profile_picture AS pic FROM student_accounts WHERE student_id = ? LIMIT 1',
        teacher:     'SELECT teacher_profile_picture AS pic FROM teacher WHERE teacher_id = ? LIMIT 1',
        admin:       'SELECT admin_profile_picture AS pic FROM admin_accounts WHERE admin_id = ? LIMIT 1',
        super_admin: 'SELECT super_admin_profile_picture AS pic FROM super_admin_accounts WHERE super_admin_id = ? LIMIT 1',
        guard:       'SELECT guard_profile_picture AS pic FROM guards WHERE guard_id = ? LIMIT 1'
    }
    const fetchPic = (role, id) => new Promise(res => {
        const pq = picQuery[role]
        if (!pq) return res(null)
        db.execute(pq, [id], (err, rows) => res((!err && rows?.length) ? rows[0].pic : null))
    })
    return new Promise((resolve) => {
        db.execute(
            `SELECT m.*,
                    r.content       AS reply_content,
                    r.sender_name   AS reply_sender_name,
                    r.file_name     AS reply_file_name,
                    r.is_unsent     AS reply_is_unsent
             FROM messages m
             LEFT JOIN messages r ON r.id = m.reply_to_id
             WHERE (
                m.sender_id = ? AND m.sender_role = ? AND m.receiver_id = ? AND m.receiver_role = ?
                AND m.deleted_for_sender = 0
             ) OR (
                m.sender_id = ? AND m.sender_role = ? AND m.receiver_id = ? AND m.receiver_role = ?
                AND m.deleted_for_receiver = 0
             )
             ORDER BY m.created_at DESC
             LIMIT ?`,
            [userAId, userARole, userBId, userBRole,
             userBId, userBRole, userAId, userARole, n],
            async (err, rows) => {
                if (err) { console.error('[getConversation]', err.message); return resolve([]) }
                // Fetch current pics for both parties once
                const [picA, picB] = await Promise.all([
                    fetchPic(userARole, userAId),
                    fetchPic(userBRole, userBId)
                ])
                const result = rows.reverse().map(m => {
                    const senderIsA = String(m.sender_id) === String(userAId) && m.sender_role === userARole
                    return {
                        ...m,
                        sender_profile_picture:   senderIsA ? picA : picB,
                        receiver_profile_picture: senderIsA ? picB : picA
                    }
                })
                resolve(result)
            }
        )
    })
}


// Delete for me only (sender deletes for themselves, receiver still sees it)
function deleteMessageForMe(messageId, userId, userRole) {
    return new Promise((resolve, reject) => {
        db.execute(
            `SELECT id, sender_id, sender_role, receiver_id, receiver_role FROM messages WHERE id = ? LIMIT 1`,
            [messageId],
            (err, rows) => {
                if (err) return reject(err)
                if (!rows.length) return reject(new Error('Message not found.'))
                const m = rows[0]
                const isSender   = String(m.sender_id)   === String(userId) && m.sender_role   === userRole
                const isReceiver = String(m.receiver_id) === String(userId) && m.receiver_role === userRole
                if (!isSender && !isReceiver) return reject(new Error('Unauthorized.'))
                const col = isSender ? 'deleted_for_sender' : 'deleted_for_receiver'
                db.execute(`UPDATE messages SET ${col} = 1 WHERE id = ?`, [messageId], (err2) => {
                    if (err2) return reject(err2)
                    resolve('Deleted for you.')
                })
            }
        )
    })
}

// Delete for everyone — sender only, leaves "unsent" trace
function unsendMessage(messageId, senderId, senderRole) {
    return new Promise((resolve, reject) => {
        db.execute(
            `SELECT id, file_url FROM messages WHERE id = ? AND sender_id = ? AND sender_role = ? LIMIT 1`,
            [messageId, senderId, senderRole],
            (err, rows) => {
                if (err) return reject(err)
                if (!rows.length) return reject(new Error('Message not found or you are not the sender.'))
                const fileUrl = rows[0].file_url
                db.execute(
                    `UPDATE messages SET content = NULL, file_url = NULL, file_name = NULL, file_type = NULL,
                     is_unsent = 1, deleted_for_sender = 0, deleted_for_receiver = 0 WHERE id = ?`,
                    [messageId],
                    (err2) => {
                        if (err2) return reject(err2)
                        if (fileUrl) {
                            const pathMod = require('path')
                            const fs = require('fs')
                            const fp = pathMod.join(__dirname, '../../', fileUrl.replace('/api/v1/', ''))
                            fs.unlink(fp, () => {})
                        }
                        resolve('Message unsent for everyone.')
                    }
                )
            }
        )
    })
}

// Pin / unpin a message
function pinMessage(messageId, userId, userRole) {
    return new Promise((resolve, reject) => {
        db.execute(
            `SELECT id, sender_id, sender_role, receiver_id, receiver_role, is_pinned FROM messages WHERE id = ? LIMIT 1`,
            [messageId],
            (err, rows) => {
                if (err) return reject(err)
                if (!rows.length) return reject(new Error('Message not found.'))
                const m = rows[0]
                const involved = (String(m.sender_id) === String(userId) && m.sender_role === userRole) ||
                                 (String(m.receiver_id) === String(userId) && m.receiver_role === userRole)
                if (!involved) return reject(new Error('Unauthorized.'))
                const newPin = m.is_pinned ? 0 : 1
                db.execute(`UPDATE messages SET is_pinned = ? WHERE id = ?`, [newPin, messageId], (err2) => {
                    if (err2) return reject(err2)
                    resolve(newPin ? 'Message pinned.' : 'Message unpinned.')
                })
            }
        )
    })
}


// Edit a message — only sender can edit their own non-unsent messages
function editMessage(messageId, senderId, senderRole, newContent) {
    return new Promise((resolve, reject) => {
        if (!newContent?.trim()) return reject(new Error('Message cannot be empty.'))
        db.execute(
            `SELECT id FROM messages WHERE id = ? AND sender_id = ? AND sender_role = ? AND is_unsent = 0 LIMIT 1`,
            [messageId, senderId, senderRole],
            (err, rows) => {
                if (err) return reject(err)
                if (!rows.length) return reject(new Error('Message not found or you are not the sender.'))
                db.execute(
                    `UPDATE messages SET content = ?, is_edited = 1, edited_at = NOW() WHERE id = ?`,
                    [newContent.trim(), messageId],
                    (err2) => {
                        if (err2) return reject(err2)
                        resolve('Message edited.')
                    }
                )
            }
        )
    })
}

// Get all contacts who have exchanged messages with this user + unread count
function getMessageContacts(userId, userRole) {
    // Get distinct contacts — grouped by id+role to avoid duplicate entries
    // when a user changes their name (old messages have old name stored)
    const sql = `
        SELECT
            CASE WHEN sender_id = ? AND sender_role = ? THEN receiver_id   ELSE sender_id   END AS contact_id,
            CASE WHEN sender_id = ? AND sender_role = ? THEN receiver_role ELSE sender_role END AS contact_role,
            MAX(CASE WHEN sender_id = ? AND sender_role = ? THEN receiver_name ELSE sender_name END) AS contact_name
        FROM messages
        WHERE (sender_id = ? AND sender_role = ?) OR (receiver_id = ? AND receiver_role = ?)
        GROUP BY contact_id, contact_role
    `
    return new Promise((resolve) => {
        db.execute(sql,
            [userId, userRole, userId, userRole, userId, userRole, userId, userRole, userId, userRole],
            (err, contacts) => {
                if (err) { console.error('[getMessageContacts]', err.message); return resolve([]) }
                if (!contacts.length) return resolve([])

                // Profile picture lookup map — always fetch current pic from account table
                const picQuery = {
                    student:     'SELECT student_profile_picture AS pic FROM student_accounts WHERE student_id = ? LIMIT 1',
                    teacher:     'SELECT teacher_profile_picture AS pic FROM teacher WHERE teacher_id = ? LIMIT 1',
                    admin:       'SELECT admin_profile_picture AS pic FROM admin_accounts WHERE admin_id = ? LIMIT 1',
                    super_admin: 'SELECT super_admin_profile_picture AS pic FROM super_admin_accounts WHERE super_admin_id = ? LIMIT 1',
                    guard:       'SELECT guard_profile_picture AS pic FROM guards WHERE guard_id = ? LIMIT 1'
                }

                // Name lookup map — always use current name from account tables
                const nameQuery = {
                    student:     'SELECT CONCAT(student_firstname, " ", COALESCE(student_middlename, ""), " ", student_lastname) AS name FROM student_accounts WHERE student_id = ? LIMIT 1',
                    teacher:     'SELECT teacher_name AS name FROM teacher WHERE teacher_id = ? LIMIT 1',
                    admin:       'SELECT admin_name AS name FROM admin_accounts WHERE admin_id = ? LIMIT 1',
                    super_admin: 'SELECT super_admin_name AS name FROM super_admin_accounts WHERE super_admin_id = ? LIMIT 1',
                    guard:       'SELECT guard_name AS name FROM guards WHERE guard_id = ? LIMIT 1'
                }

                const tasks = contacts.map(c => new Promise(res => {
                    db.execute(
                        `SELECT content, sender_id, sender_role, sender_name, created_at,
                                (SELECT COUNT(*) FROM messages
                                 WHERE receiver_id = ? AND receiver_role = ?
                                   AND sender_id = ? AND sender_role = ?
                                   AND is_read = 0) AS unread
                         FROM messages
                         WHERE ((sender_id = ? AND sender_role = ? AND receiver_id = ? AND receiver_role = ?)
                             OR (sender_id = ? AND sender_role = ? AND receiver_id = ? AND receiver_role = ?))
                         ORDER BY created_at DESC LIMIT 1`,
                        [
                            userId, userRole, c.contact_id, c.contact_role,
                            userId, userRole, c.contact_id, c.contact_role,
                            c.contact_id, c.contact_role, userId, userRole
                        ],
                        (err2, rows) => {
                            if (err2 || !rows.length) return res({ ...c, last_message: '', last_sender_name: '', unread: 0, last_message_at: null, contact_profile_picture: null })

                            // Fetch current profile picture from account table (not stored in message)
                            const pq = picQuery[c.contact_role]
                            if (!pq) {
                                return res({
                                    ...c,
                                    last_message:            rows[0].content,
                                    last_sender_name:        rows[0].sender_name,
                                    unread:                  rows[0].unread || 0,
                                    last_message_at:         rows[0].created_at,
                                    contact_profile_picture: null
                                })
                            }
                            db.execute(pq, [c.contact_id], (err3, picRows) => {
                                const currentPic = (!err3 && picRows?.length) ? picRows[0].pic : null
                                const nq = nameQuery[c.contact_role]
                                if (!nq) {
                                    return res({
                                        ...c,
                                        last_message:            rows[0].content,
                                        last_sender_name:        rows[0].sender_name,
                                        unread:                  rows[0].unread || 0,
                                        last_message_at:         rows[0].created_at,
                                        contact_profile_picture: currentPic || null
                                    })
                                }
                                db.execute(nq, [c.contact_id], (err4, nameRows) => {
                                    const currentName = (!err4 && nameRows?.length) ? nameRows[0].name?.trim() : c.contact_name
                                    res({
                                        ...c,
                                        contact_name:            currentName || c.contact_name,
                                        last_message:            rows[0].content,
                                        last_sender_name:        rows[0].sender_name,
                                        unread:                  rows[0].unread || 0,
                                        last_message_at:         rows[0].created_at,
                                        contact_profile_picture: currentPic || null
                                    })
                                })
                            })
                        }
                    )
                }))

                Promise.all(tasks).then(results => {
                    results.sort((a, b) => new Date(b.last_message_at) - new Date(a.last_message_at))
                    resolve(results)
                })
            }
        )
    })
}

// Get unread message count for a user
function getUnreadMessageCount(userId, userRole) {
    return new Promise((resolve) => {
        db.execute(
            `SELECT COUNT(*) AS cnt FROM messages WHERE receiver_id = ? AND receiver_role = ? AND is_read = 0`,
            [userId, userRole],
            (err, rows) => resolve(err ? 0 : (rows[0]?.cnt || 0))
        )
    })
}

// Mark messages as read between two users
function markMessagesRead(receiverId, receiverRole, senderId, senderRole) {
    return new Promise((resolve) => {
        db.execute(
            `UPDATE messages SET is_read = 1, read_at = NOW()
             WHERE receiver_id = ? AND receiver_role = ? AND sender_id = ? AND sender_role = ? AND is_read = 0`,
            [receiverId, receiverRole, senderId, senderRole],
            (err) => { if (err) console.error('[markMessagesRead]', err.message); resolve() }
        )
    })
}

// ============================================================
// SUBJECT CLASS LIST (roster of students per subject)
// ============================================================

function getSubjectClassList(subjectId, teacherSerial) {
    return new Promise((resolve, reject) => {
        db.execute(
            `SELECT scl.id, scl.subject_id, scl.student_id,
                    s.student_id_number, s.student_firstname, s.student_middlename,
                    s.student_lastname, s.student_year_level, s.student_program
             FROM subject_class_list scl
             JOIN student_records_regular_class s
               ON scl.student_id = s.student_id
             WHERE scl.subject_id = ? AND scl.teacher_barcode_scanner_serial_number = ?
             ORDER BY s.student_lastname, s.student_firstname`,
            [subjectId, teacherSerial],
            (err, result) => { if (err) return reject(err); resolve(result); }
        );
    });
}

function addStudentToSubjectClassList(subjectId, studentId, teacherSerial) {
    return new Promise((resolve, reject) => {
        db.execute(
            `INSERT IGNORE INTO subject_class_list (subject_id, student_id, teacher_barcode_scanner_serial_number)
             VALUES (?, ?, ?)`,
            [subjectId, studentId, teacherSerial],
            (err, result) => { if (err) return reject(err); resolve(result); }
        );
    });
}

function removeStudentFromSubjectClassList(id, teacherSerial) {
    return new Promise((resolve, reject) => {
        db.execute(
            `DELETE FROM subject_class_list WHERE id = ? AND teacher_barcode_scanner_serial_number = ?`,
            [id, teacherSerial],
            (err, result) => { if (err) return reject(err); resolve(result); }
        );
    });
}

// Search users to start a new conversation
function searchUsersForMessaging(query, excludeId, excludeRole) {
    const like = `%${query}%`
    const q = (sql, params) => new Promise((res, rej) => {
        db.execute(sql, params, (err, rows) => { if (err) return res([]); res(rows) })
    })
    return Promise.all([
        q(`SELECT student_id AS id, CONCAT(student_firstname,' ',student_lastname) AS name, 'student' AS role, student_email AS email, student_profile_picture AS profile_picture FROM student_accounts WHERE (student_firstname LIKE ? OR student_lastname LIKE ? OR student_email LIKE ?) LIMIT 5`, [like, like, like]),
        q(`SELECT teacher_id AS id, teacher_name AS name, 'teacher' AS role, teacher_email AS email, teacher_profile_picture AS profile_picture FROM teacher WHERE (teacher_name LIKE ? OR teacher_email LIKE ?) LIMIT 5`, [like, like]),
        q(`SELECT admin_id AS id, admin_name AS name, 'admin' AS role, admin_email AS email, admin_profile_picture AS profile_picture FROM admin_accounts WHERE (admin_name LIKE ? OR admin_email LIKE ?) LIMIT 5`, [like, like]),
        q(`SELECT guard_id AS id, guard_name AS name, 'guard' AS role, guard_email AS email, NULL AS profile_picture FROM guards WHERE (guard_name LIKE ? OR guard_email LIKE ?) LIMIT 5`, [like, like]),
        q(`SELECT super_admin_id AS id, super_admin_name AS name, 'super_admin' AS role, super_admin_email AS email, super_admin_profile_picture AS profile_picture FROM super_admin_accounts WHERE (super_admin_name LIKE ? OR super_admin_email LIKE ?) LIMIT 5`, [like, like]),
    ]).then(results => {
        let users = []
        results.forEach(rows => {
            users = users.concat(rows.filter(u => !(u.id === excludeId && u.role === excludeRole)))
        })
        return users.slice(0, 15)
    })
}
// Edit a student directly in student_records_regular_class (class roster only, no student_accounts dependency)
function editClassRosterStudent(studentId, id_number, firstname, middlename, lastname, program, year_level) {
    return new Promise((resolve, reject) => {
        // Check if the new id_number is already used by a DIFFERENT student in the roster
        db.execute(
            `SELECT student_id FROM student_records_regular_class WHERE student_id_number = ? AND student_id != ?`,
            [id_number, studentId],
            (err, rows) => {
                if (err) return reject(err)
                if (rows.length > 0) return resolve({ ok: false, message: `ID number "${id_number}" is already assigned to another student in this roster.` })

                db.execute(
                    `UPDATE student_records_regular_class SET
                        student_id_number = ?,
                        student_firstname = ?,
                        student_middlename = ?,
                        student_lastname = ?,
                        student_program = ?,
                        student_year_level = ?
                    WHERE student_id = ?`,
                    [id_number, firstname, middlename || '', lastname, program, year_level, studentId],
                    (err, result) => {
                        if (err) return reject(err)
                        if (result.affectedRows === 0) return reject(new Error('Student not found in roster.'))
                        resolve({ ok: true, message: 'Student record updated successfully!' })
                    }
                )
            }
        )
    })
}