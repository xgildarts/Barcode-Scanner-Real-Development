const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const db = require('../configuration/db');
const cron = require('node-cron')
const nodemailer = require('nodemailer')
const SALT_ROUNDS = 10
const JWT_SECRET = process.env.TOKEN_KEYWORD;

// ============================================================
// DAILY ATTENDANCE CLEANUP — runs at midnight Manila time
// ============================================================
cron.schedule('* * * * *', () => {
    // Clear regular attendance records older than today
    db.execute(
        `DELETE FROM attendance_record WHERE attendance_date < CURDATE()`,
        [],
        (err, result) => {
            if (err) { console.error('[Cron] Failed to clean attendance_record:', err); return }
            console.log(`[Cron] Deleted ${result.affectedRows} old attendance record(s) at ${new Date().toLocaleString()}`)
        }
    )
    // Clear event attendance records older than today
    db.execute(
        `DELETE FROM event_attendance_record WHERE date < CURDATE()`,
        [],
        (err, result) => {
            if (err) { console.error('[Cron] Failed to clean event_attendance_record:', err); return }
            console.log(`[Cron] Deleted ${result.affectedRows} old event attendance record(s) at ${new Date().toLocaleString()}`)
        }
    )
}, { timezone: 'Asia/Manila' })

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
    teacherId, teacherName
) {
    const inClass = await checkStudentToRegularClass(student_id_number)
    if (!inClass) throw new Error('Student is not registered to this subject.')

    const alreadyIn = await checkStudentIfAlreadyExistsInAttendance(student_id_number)
    if (alreadyIn) throw new Error('Student is already recorded in attendance.')

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

    await sendSMS(student_guardian_number,
        `${student_firstname} ${student_middlename}. ${student_lastname} - Your child has attended school today.`)

    writeActivityLog(teacherId || null, teacherName || null, 'teacher', 'MANUAL_ATTENDANCE', 'Class Attendance', student_id_number, `${student_firstname} ${student_middlename}. ${student_lastname}`, `Manual entry by ${teacherName || 'Unknown Teacher'} — Program: ${student_program}, Year: ${student_year_level}`)
    return 'Attendance recorded successfully!'
}

const clickSendUsername = 'steven.agustin.ecoast@panpacificu.edu.ph';   // from dashboard
const clickSendAPI = 'FA142E33-E8CD-0664-FB80-64EBBE1BAFAC';    // from dashboard

// // Create SMS message object
async function sendSMS(phone, message) {
    try {
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
                        to: phone
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
function writeLoginLog(userId, userName, userEmail, role, status) {
    db.execute(
        'INSERT INTO system_login_logs (user_id, user_name, user_email, role, status) VALUES (?, ?, ?, ?, ?)',
        [userId || null, userName || null, userEmail || null, role, status],
        (err) => { if (err) console.error('[LoginLog]', err) }
    )
}

// actorRole: 'student' | 'teacher' | 'guard' | 'admin' | 'super_admin'
function writeActivityLog(actorId, actorName, actorRole, action, targetType, targetId, targetName, details) {
    db.execute(
        'INSERT INTO system_activity_logs (actor_id, actor_name, actor_role, action, target_type, target_id, target_name, details) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        [actorId || null, actorName || null, actorRole || null, action, targetType || null, String(targetId || ''), targetName || null, details || null],
        (err) => { if (err) console.error('[ActivityLog]', err) }
    )
}

async function studentLogin(email, password, device_id) {

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
                writeLoginLog(null, null, email, 'student', 'FAILED');
                return reject('Invalid email or password');
            }

            const row = result[0];

            // Strict device binding — fingerprint must match what was registered
            if (!await deviceIDChecker(device_id, email)) return reject('This device is not registered to your account. Please contact your administrator to reset your device.')

            // ✅ Compare password
            const isMatch = await comparePassword(password, row.password);

            // Remove password before sending a payload
            delete row.password

            if (isMatch) {
                const token = generateToken(row)
                writeLoginLog(row.student_id, `${row.student_firstname} ${row.student_lastname}`, email, 'student', 'SUCCESS');
                return resolve({ ok: true, message: 'Successfully Login!', token, student_firstname: row.student_firstname });
            }

            writeLoginLog(row.student_id, `${row.student_firstname} ${row.student_lastname}`, email, 'student', 'FAILED');
            return reject('Invalid email or password');
        });
    });
}

// Google Login — finds student by email, skips password check
async function studentGoogleLogin(email, device_id) {
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
            if (result.length === 0) return reject('No account found for this Google email. Please register first.');

            const row = result[0];

            // Strict device binding — fingerprint must match what was registered
            if (!await deviceIDChecker(device_id, email)) {
                return reject('This device is not registered to your account. Please contact your administrator to reset your device.');
            }

            const token = generateToken(row);
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
function getAttendanceHistoryForStudentOnly(studentID) {
    return new Promise((resolve, reject) => {
        db.execute('SELECT * FROM attendance_history_record WHERE student_id = ?', [studentID], (err, result) => {
            if (err) { return reject(err) }
            resolve(result)
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
        return jwt.verify(token, JWT_SECRET);
    } catch (err) {
        return null;
    }
}


// Remove the prepend Bearer
function removeBearer(authorization) {
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
                student_program
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
        db.execute('SELECT program_id, program_name, program_date_created FROM program', [], (err, result) => {
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
            reject('Email is already taken!');
        }

        db.execute(
            sql,
            [fullName, email, hashedPassword, department, teacherBarcodeScannerSerialNumber, admin_id],
            (err, result) => {
                if (err) { return reject(err); }
                try {
                    initialTeacherSubjectAndYearLevelSetter('', '', teacherBarcodeScannerSerialNumber);
                    writeActivityLog(admin_id, null, 'admin', 'CREATE_TEACHER', 'Teacher', result.insertId, fullName, `Registered teacher: ${email}, Dept: ${department}`)
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
async function teacherLogin(email, password) {

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
                writeLoginLog(null, null, email, 'teacher', 'FAILED');
                return reject('Invalid email or password');
            }

            const row = result[0];

            const isMatch = await comparePassword(password, row.teacher_password);

            // Remove password before sending a payload
            delete row.password

            if (isMatch) {
                const token = generateToken(row)
                writeLoginLog(row.teacher_id, row.teacher_name, email, 'teacher', 'SUCCESS');
                return resolve({ ok: true, message: 'Successfully Login!', token, teacher_name: row.teacher_name });
            }

            writeLoginLog(row.teacher_id, row.teacher_name, email, 'teacher', 'FAILED');
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
                writeActivityLog(teacherId || null, teacherName || null, 'teacher', 'ADD_STUDENT_TO_CLASS', 'Student', studentIDNumber, `${studentFirstName} ${studentLastName}`, `Added by ${teacherName || 'Unknown Teacher'} — Program: ${studentProgram}, Year: ${studentYearLevel}`)
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

// Teacher Subject And Year Level Setter
async function teacherSubjectAndYearLevelSetter(subjectSet, yearLevelSet, teacherBarcodeScannerSerialNumber) {
    return new Promise((resolve, reject) => {
        db.execute(`UPDATE subject_and_year_level_setter 
                    SET subject_name_set = ?, 
                    year_level_set = ? 
                    WHERE teacher_barcode_scanner_serial_number = ?`,
            [subjectSet, yearLevelSet, teacherBarcodeScannerSerialNumber],
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
async function checkStudentIfAlreadyExistsInAttendance(student_id_number) {
    return new Promise((resolve, reject) => {
        db.execute(
            'SELECT 1 FROM attendance_record WHERE student_id_number = ? LIMIT 1',
            [student_id_number],
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
    // Check if student already exists in attendance
    const exists = await checkStudentIfAlreadyExistsInAttendance(student_id_number)
    if (exists) {
        throw new Error('Student already recorded in attendance.')
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

    writeActivityLog(student_id, `${student_firstname} ${student_middlename}. ${student_lastname}`, 'student', 'CLASS_ATTENDANCE_IN', 'Class Attendance', student_id_number, `${student_firstname} ${student_middlename}. ${student_lastname}`, `Teacher: ${teacherName || 'Unknown'} | Program: ${student_program}, Year: ${student_year_level}`)
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
async function getStudentAttendanceNow(teacher_barcode_scanner_serial_number) {
    return new Promise((resolve, reject) => {
        db.execute('SELECT * FROM attendance_record WHERE teacher_barcode_scanner_serial_number = ?', [teacher_barcode_scanner_serial_number], (err, result) => {
            if (err) { return reject(err) }
            resolve(result)
        })
    })
}

// Get Student Attendance History
async function getStudentAttendanceHistory(teacher_barcode_scanner_serial_number) {
    return new Promise((resolve, reject) => {
        db.execute('SELECT * FROM attendance_history_record WHERE teacher_barcode_scanner_serial_number = ?', [teacher_barcode_scanner_serial_number], (err, result) => {
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
        db.execute('SELECT * FROM year_level', [], (err, result) => {
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
                    resolve({ duplicate: false, result });
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
                            teacher_profile_picture
                       FROM teacher 
                       WHERE teacher_id = ?`

        db.execute(query, [teacherID], (err, result) => {
            if (err) { return reject(err) }
            resolve(result)
        })
    })
}

// Update Teacher Profile Picture
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
function getWholeCampusAccounts(tableName) {
    return new Promise((resolve, reject) => {
        db.execute(`SELECT * FROM ${tableName}`, [], (err, result) => {
            if (err) { return reject(err) }
            resolve(result)
        })
    })
}



// Email finder
function emailFinder(columnToFind, email, tableName) {
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
                    writeActivityLog(admin_id, null, 'admin', 'CREATE_GUARD', 'Guard', result.insertId, guard_name, `Registered guard: ${guard_email}, Location: ${guard_designated_location}`)
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
async function adminLogin(email, password) {

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
                writeLoginLog(null, null, email, 'admin', 'FAILED');
                return reject('Invalid email or password');
            }

            const row = result[0];

            const isMatch = await comparePassword(password, row.admin_password);

            delete row.admin_password;

            if (isMatch) {
                const token = generateToken(row);
                writeLoginLog(row.admin_id, row.admin_name, row.admin_email, 'admin', 'SUCCESS');
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

            writeLoginLog(row.admin_id, row.admin_name, row.admin_email, 'admin', 'FAILED');
            return reject('Invalid email or password');
        });
    });
}

// Get Admin data
function getAdminData(adminID) {
    return new Promise((resolve, reject) => {
        db.execute('SELECT admin_id, admin_name, admin_email, admin_profile_picture FROM admin_accounts;', [], (err, result) => {
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
async function studentCheckEventIfExists(studentIDNumber, status) {
    return new Promise((resolve, reject) => {
        // No date check needed because the table is wiped daily
        const sql = `
            SELECT student_id_number 
            FROM event_attendance_record 
            WHERE student_id_number = ? 
            AND status = ? 
            LIMIT 1
        `;

        db.execute(sql, [studentIDNumber, status], (err, result) => {
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
        const query = "SELECT event_name_set FROM event_setter;";

        db.execute(query, [], (err, result) => {
            if (err) { return reject(err) }
            // If no event is set, resolve null
            resolve(result.length > 0 ? result[0] : null)
        })
    })
}

// Insert Event Attendance
async function guardInsertAttendanceRecord(studentBarcode, status, guardID, guardName, guardLocation) {
    return new Promise(async (resolve, reject) => {
        try {
            const student = await studentBarcodeFinder(studentBarcode);
            if (!student) {
                return reject('Student does not exist in records!');
            }
            const alreadyScanned = await studentCheckEventIfExists(student.student_id_number, status);
            if (alreadyScanned) {
                return reject(`Student has already scanned for ${status}!`);
            }
            const eventData = await getEventSet();
            if (!eventData || !eventData.event_name_set) {
                return reject('No active event found. Please contact Admin.');
            }
            const activeEventName = eventData.event_name_set;
            const insertQuery = `
                INSERT INTO event_attendance_record 
                (student_id, student_name, student_id_number, student_program, student_year_level, event_name, guard_name, guard_location, status, guard_id) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
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
                guardID
            ];
            db.execute(insertQuery, values, async (err, result) => {
                if (err) { return reject(err); }

                try {
                    await guardInsertAttendanceHistoryRecord(values);

                    writeActivityLog(guardID, guardName, 'guard', status === 'TIME IN' ? 'EVENT_TIME_IN' : 'EVENT_TIME_OUT', 'Event Attendance', student.student_id_number, fullName, `Event: ${activeEventName} | Location: ${guardLocation}`)
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

// Insert Event Attendance History
async function guardInsertAttendanceHistoryRecord(values) {
    return new Promise((resolve, reject) => {
        try {
            const insertQuery = `
                INSERT INTO event_attendance_history_record 
                (student_id, student_name, student_id_number, student_program, student_year_level, event_name, guard_name, guard_location, status, guard_id) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
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
async function guardLogin(email, password) {
    return new Promise((resolve, reject) => {
        const query = "SELECT * FROM guards WHERE guard_email = ? LIMIT 1";
        db.execute(query, [email], async (err, result) => {
            if (err) {
                return reject({ message: "Database error", code: 500 });
            }
            if (result.length === 0) {
                writeLoginLog(null, null, email, 'guard', 'FAILED');
                return reject({ message: "Account not found", code: 404 });
            }
            const guard = result[0];
            try {
                const isMatch = await comparePassword(password, guard.guard_password);
                if (!isMatch) {
                    writeLoginLog(guard.guard_id, guard.guard_name, email, 'guard', 'FAILED');
                    return reject({ message: "Invalid password", code: 401 });
                }
                const payload = {
                    guard_id: guard.guard_id,
                    guard_name: guard.guard_name,
                    guard_location: guard.guard_designated_location,
                    role: 'guard'
                };
                const token = generateToken(payload);
                writeLoginLog(guard.guard_id, guard.guard_name, email, 'guard', 'SUCCESS');
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
        db.execute('SELECT * FROM event_attendance_record WHERE admin_id = ?', [adminID], (err, result) => {
            if (err) { return reject(err) }
            resolve(result)
        })
    })
}

// Get Events History
function getAttendanceEventHistoryRecords(adminID) {
    return new Promise((resolve, reject) => {
        db.execute('SELECT * FROM event_attendance_history_record WHERE admin_id = ?', [adminID], (err, result) => {
            if (err) { return reject(err) }
            resolve(result)
        })
    })
}

// Get Student Attendance Events for Teacher
function getAttendanceEventsForTeacher(teacherID, tableName) {
    return new Promise(async (resolve, reject) => {
        const teacherData = await getTeacherData(teacherID)
        db.execute(`SELECT * FROM ${tableName} WHERE student_program = ?`, [teacherData[0].teacher_program], (err, result) => {
            if (err) { return reject(err) }
            resolve(result)
        })
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
                                writeActivityLog(null, null, 'admin', 'DELETE_STUDENT', 'Student', student_id, null, `Deleted student ID: ${student_id}`)
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
            writeActivityLog(admin_id, null, 'admin', 'DELETE_TEACHER', 'Teacher', teacher_id, null, `Deleted teacher ID: ${teacher_id}`)
            resolve({ ok: true, message: 'Successfully delete teacher data!', status_code: 200 })
        })
    })
}

// Admin delete guard account
function adminDeleteGuard(teacher_id, admin_id) {
    return new Promise((resolve, reject) => {
        db.execute('DELETE FROM guards WHERE guard_id = ? AND admin_id = ?', [teacher_id, admin_id], (err, result) => {
            if (err) { return reject({ ok: false, message: "Database error: " + err, status_code: 500 }) }
            if (result.length === 0) { return reject({ ok: false, message: "Unauthorized", status_code: 401 }) }
            writeActivityLog(admin_id, null, 'admin', 'DELETE_GUARD', 'Guard', teacher_id, null, `Deleted guard ID: ${teacher_id}`)
            resolve({ ok: true, message: 'Successfully delete teacher data!', status_code: 200 })
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
function adminEditStudentAccounts(
    id,
    id_number,
    firstname,
    middlename,
    lastname,
    program,
    year_level
) {
    return new Promise((resolve, reject) => {

        // Check if id_number is already used by another student
        db.execute(
            `SELECT student_id FROM student_accounts WHERE student_id_number = ? AND student_id != ?`,
            [id_number, id],
            (err, rows) => {
                if (err) return reject(err)
                if (rows.length > 0) {
                    return resolve({ ok: false, duplicate: true, message: `ID number "${id_number}" is already assigned to another student.` })
                }

                // Get the OLD student_id_number so we can match in regular class
                db.execute('SELECT student_id_number FROM student_accounts WHERE student_id = ?', [id], (err, rows) => {
                    if (err) return reject(err)
                    if (rows.length === 0) return reject(new Error('Student not found.'))

                    const old_id_number = rows[0].student_id_number

                    db.getConnection((err, connection) => {
                        if (err) return reject(err)

                        connection.beginTransaction((err) => {
                            if (err) {
                                connection.release()
                                return reject(err)
                            }

                            // Update student_accounts
                            const updateAccountQuery = `
                                UPDATE student_accounts 
                                SET 
                                    student_id_number = ?, 
                                    student_firstname = ?, 
                                    student_middlename = ?, 
                                    student_lastname = ?, 
                                    student_program = ?, 
                                    student_year_level = ?
                                WHERE student_id = ?
                            `
                            connection.execute(updateAccountQuery, [id_number, firstname, middlename, lastname, program, year_level, id], (err, result) => {
                                if (err) return connection.rollback(() => { connection.release(); reject(err) })
                                if (result.affectedRows === 0) return connection.rollback(() => { connection.release(); reject(new Error('Update failed: Student not found.')) })

                                // Update student_records_regular_class
                                const updateClassQuery = `
                                    UPDATE student_records_regular_class 
                                    SET 
                                        student_id_number = ?, 
                                        student_firstname = ?, 
                                        student_middlename = ?, 
                                        student_lastname = ?, 
                                        student_program = ?, 
                                        student_year_level = ?
                                    WHERE student_id_number = ?
                                `
                                connection.execute(updateClassQuery, [id_number, firstname, middlename, lastname, program, year_level, old_id_number], (err) => {
                                    if (err) return connection.rollback(() => { connection.release(); reject(err) })

                                    connection.commit((err) => {
                                        connection.release()
                                        if (err) return reject(err)
                                        resolve({ ok: true, message: 'Student account updated successfully!' })
                                    })
                                })
                            })
                        })
                    })
                })
            }
        )
    })
}

// Admin edit student accounts
function adminEditTeacherAccounts(
    id,
    teacher_name,
    teacher_email,
    teacher_program,
    admin_id
) {
    return new Promise((resolve, reject) => {

        const updateQuery = `
        UPDATE teacher 
        SET 
            teacher_name = ?, 
            teacher_email = ?, 
            teacher_program = ?
        WHERE teacher_id = ? AND admin_id = ?
    `;

        const values = [
            teacher_name,
            teacher_email,
            teacher_program,
            id,
            admin_id
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

        const updateQuery = `
        UPDATE guards 
        SET 
            guard_name = ?, 
            guard_email = ?, 
            guard_designated_location = ?
        WHERE guard_id = ? AND admin_id = ?
    `;

        const values = [
            guard_name,
            guard_email,
            guard_designated_location,
            id,
            admin_id
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
            `SELECT year_level_id, year_level_name, year_level_created FROM year_level ORDER BY year_level_id ASC`,
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
async function superAdminLogin(email, password) {
    return new Promise((resolve, reject) => {
        db.execute(
            'SELECT super_admin_id, super_admin_name, super_admin_email, super_admin_password, super_admin_profile_picture FROM super_admin_accounts WHERE super_admin_email = ? LIMIT 1',
            [email],
            async (err, rows) => {
                if (err) return reject(new Error('Database error.'))
                if (rows.length === 0) {
                    writeLoginLog(null, null, email, 'super_admin', 'FAILED');
                    return reject(new Error('Invalid email or password.'))
                }
                const row = rows[0]
                const isMatch = await bcrypt.compare(password, row.super_admin_password)
                if (!isMatch) {
                    writeLoginLog(row.super_admin_id, row.super_admin_name, email, 'super_admin', 'FAILED');
                    return reject(new Error('Invalid email or password.'))
                }
                delete row.super_admin_password
                const token = jwt.sign(
                    { super_admin_id: row.super_admin_id, super_admin_name: row.super_admin_name, super_admin_email: row.super_admin_email, role: 'super_admin' },
                    JWT_SECRET,
                    { expiresIn: '24h' }
                )
                writeLoginLog(row.super_admin_id, row.super_admin_name, row.super_admin_email, 'super_admin', 'SUCCESS');
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
            'SELECT admin_id, admin_name, admin_email, admin_profile_picture, date_account_created FROM admin_accounts ORDER BY admin_id ASC',
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
                    DATE_FORMAT(login_at, '%Y-%m-%d %H:%i:%s') AS login_at
             FROM system_login_logs
             ORDER BY login_at DESC
             LIMIT ?`,
            [n], (err, rows) => { if (err) return reject(err); resolve(rows) }
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
                    DATE_FORMAT(performed_at, '%Y-%m-%d %H:%i:%s') AS performed_at
             FROM system_activity_logs
             ORDER BY performed_at DESC
             LIMIT ?`,
            [n], (err, rows) => { if (err) return reject(err); resolve(rows) }
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
                writeActivityLog(null, 'Super Admin', 'super_admin', 'CREATE_ADMIN', 'Admin', result.insertId, adminName, `Created admin: ${adminEmail}`)
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
                writeActivityLog(null, 'Super Admin', 'super_admin', 'EDIT_ADMIN', 'Admin', adminId, adminName, `Updated to email: ${adminEmail}`)
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
                writeActivityLog(null, 'Super Admin', 'super_admin', 'DELETE_ADMIN', 'Admin', adminId, null, `Deleted admin ID: ${adminId}`)
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
                writeActivityLog(null, 'Super Admin', 'super_admin', 'RESET_ADMIN_PASSWORD', 'Admin', adminId, null, `Reset password for admin ID: ${adminId}`)
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

module.exports = {
    sendSMS,
    adminEditGuardAccounts,
    adminEditTeacherAccounts,
    adminEditStudentAccounts,
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
    setEventName,
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
    checkStudentIfExistsInRegistration,
    checkStudentToRegularClass,
    insertStudentAttendance,
    checkYearLevelAndSerialNumber,
    getStudentAttendanceNow,
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
    writeActivityLog,
    writeLoginLog
}