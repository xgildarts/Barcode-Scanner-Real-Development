const express = require('express')
const services = require('../controller/services')
const multer  = require('multer')
const path    = require('path')
const teacher = express.Router()

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


teacher.use(express.json())

// ============================================================
// MULTER — Teacher Profile Picture Upload
// ============================================================
const teacherPicStorage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, path.join(__dirname, '../../uploads/profile_pictures/')),
    filename:    (req, file, cb) => {
        const unique = Date.now() + '-' + Math.round(Math.random() * 1e6)
        cb(null, 'teacher-' + unique + path.extname(file.originalname))
    }
})
const uploadTeacherPic = multer({
    storage: teacherPicStorage,
    limits: { fileSize: 10 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
        const allowed = /jpeg|jpg|png|webp/
        const valid   = allowed.test(path.extname(file.originalname).toLowerCase())
                     && allowed.test(file.mimetype)
        valid ? cb(null, true) : cb(new Error('Only JPEG, PNG, or WEBP images are allowed.'))
    }
})

// Debugging API
teacher.get('/', (req, res) => {
    res.send('Teacher API Working!')
})

// ============================================================
// FORGOT PASSWORD (public — no token required)
// ============================================================
teacher.post('/forgot_password/request_otp', async (req, res) => {
    const { email } = req.body
    if (!email) return res.status(400).json({ ok: false, message: 'Email is required.' })
    try {
        const message = await services.sendPasswordResetOTP(email)
        res.json({ ok: true, message })
    } catch (err) {
        res.status(400).json({ ok: false, message: err.message || err })
    }
})

teacher.post('/forgot_password/verify_otp', async (req, res) => {
    const { email, otp } = req.body
    if (!email || !otp) return res.status(400).json({ ok: false, message: 'Email and OTP are required.' })
    try {
        services.verifyPasswordResetOTP(email, otp)
        res.json({ ok: true, message: 'OTP verified.' })
    } catch (err) {
        res.status(400).json({ ok: false, message: err.message || err })
    }
})

teacher.post('/forgot_password/reset_password', async (req, res) => {
    const { email, new_password, confirm_password } = req.body
    if (!email || !new_password || !confirm_password)
        return res.status(400).json({ ok: false, message: 'All fields are required.' })
    if (new_password !== confirm_password)
        return res.status(400).json({ ok: false, message: 'Passwords do not match.' })
    if (new_password.length < 6)
        return res.status(400).json({ ok: false, message: 'Password must be at least 6 characters.' })
    try {
        const message = await services.resetPasswordWithOTP(email, new_password)
        res.json({ ok: true, message })
    } catch (err) {
        res.status(400).json({ ok: false, message: err.message || err })
    }
})

// Get total students
teacher.get('/get_students_total_count', async (req, res) => {
    try {  
        const token = services.removeBearer(req.headers['authorization'])
        const decodedToken = services.verifyToken(token)
        if (!decodedToken) return res.status(401).json({ ok: false, message: 'Invalid or expired token.' })
        const result = await services.teacherGetAllStudentDataTotalCount(decodedToken.teacher_barcode_scanner_serial_number)
        res.json({ ok: true, message: 'Successfully retrieved data!', content: result })
    } catch(err) {
        res.status(500).json({ ok: false, message: err.message || String(err) })
    }
})

// Add Student to Regular Class Records
// Search students from student_accounts
teacher.get('/search_students', async (req, res) => {
    try {
        const token = services.removeBearer(req.headers['authorization'])
        // FIX: verifyToken result was discarded — route was completely unauthenticated
        const decodedToken = services.verifyToken(token)
        if (!decodedToken) return res.status(401).json({ ok: false, message: 'Invalid or expired token.' })
        const query = req.query.q || ''
        const result = await services.searchStudentAccounts(query)
        res.json({ ok: true, content: result })
    } catch (err) {
        res.status(500).json({ ok: false, message: err.message || String(err) })
    }
})

teacher.post('/add_student', async (req, res) => {
    const { 
        student_firstname, 
        student_middlename, 
        student_lastname,
        student_email,
        student_id_number,
        student_program,
        student_year_level,
        student_guardian_number
     } = req.body
    try {
        const token = services.removeBearer(req.headers['authorization'])
        const decodedToken = services.verifyToken(token)
        if (!decodedToken) return res.status(401).json({ ok: false, message: 'Invalid or expired token.' })
        const result = await services.teacherAddStudent(
            student_id_number,
            student_firstname,
            student_middlename,
            student_lastname,
            student_email,
            student_program,
            student_year_level,
            student_guardian_number,
            decodedToken.teacher_barcode_scanner_serial_number,
            decodedToken.teacher_id,
            decodedToken.teacher_name
            )
        res.json({ ok: true, message: 'Successfully added student!', content: result })
    } catch(err) {
        res.status(400).json({ ok: false, message: err.message || 'Failed to add student.' })
    }
})

// Get Student Registered
teacher.get('/get_student_registered', async (req, res) => {
    try {  
        const token = services.removeBearer(req.headers['authorization'])
        const decodedToken = services.verifyToken(token)
        if (!decodedToken) return res.status(401).json({ ok: false, message: 'Invalid or expired token.' })
        const result = await services.teacherGetStudentRegistered(decodedToken.teacher_barcode_scanner_serial_number)
        res.json({ ok: true, message: 'Successfully retrieved data!', content: result })
    } catch(err) {
        res.status(500).json({ ok: false, message: err.message || String(err) })
    } 
})

// Get Total Attendance Record
teacher.get('/get_total_attendance_record', async (req, res) => {
    try {  
        const token = services.removeBearer(req.headers['authorization'])
        const decodedToken = services.verifyToken(token)
        if (!decodedToken) return res.status(401).json({ ok: false, message: 'Invalid or expired token.' })
        const result = await services.teacherGetTotalAttendanceRecord(decodedToken.teacher_barcode_scanner_serial_number)
        res.json({ ok: true, message: 'Successfully retrieved data!', content: result })
    } catch(err) {
        res.status(500).json({ ok: false, message: err.message || String(err) })
    }
})

// Subject and Year Level Setter
teacher.put('/teacher_subject_and_year_level_setter', async (req, res) => {
    const { subject, yearLevel, classTime } = req.body
    try {
        const token = services.removeBearer(req.headers['authorization'])
        const decodedToken = services.verifyToken(token)
        if (!decodedToken) return res.status(401).json({ ok: false, message: 'Invalid or expired token.' })
        const result = await services.teacherSubjectAndYearLevelSetter(subject, yearLevel, classTime || null, decodedToken.teacher_barcode_scanner_serial_number)
        services.writeActivityLog(decodedToken.teacher_id, decodedToken.teacher_name, 'teacher', 'SET_SUBJECT_YEAR_LEVEL', 'Class Setup', null, subject, `Set subject: ${subject}, year level: ${yearLevel}, class time: ${classTime || 'not set'}`, req.ip, req.body?.device_info || req.headers['x-device-info'] || req.headers['user-agent'])
        res.json({ ok: true, message: result })
    } catch(err) {
        res.status(500).json({ ok: false, message: err.message || String(err) })
    }
})


// Get current active subject and year level
teacher.get('/get_active_subject', async (req, res) => {
    try {
        const token = services.removeBearer(req.headers['authorization'])
        const decodedToken = services.verifyToken(token)
        if (!decodedToken) return res.status(401).json({ ok: false, message: 'Invalid or expired token.' })
        const result = await services.getActiveSubjectAndYearLevel(decodedToken.teacher_barcode_scanner_serial_number)
        res.json({ ok: true, content: result })
    } catch(err) {
        res.status(500).json({ ok: false, message: err.message || String(err) })
    }
})

// Attendance Insertion
teacher.post('/teacher_attendance_insertion', async (req, res) => {
    const { barcode, teacher_barcode_scanner_serial_number } = req.body

    console.log("Barcode:", barcode)
    console.log("Scanner Serial Number:", teacher_barcode_scanner_serial_number)

    try {
        // Check registration
        const result = await services.checkStudentIfExistsInRegistration(barcode)

        if (result.length === 0) {
            return res.json({ ok: false, message: 'Student not registered' })
        }

        const {
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
        } = result[0]

        // Use the serial embedded in the barcode (student's choice) as the source of truth.
        // Fall back to the scanner's own serial if the barcode has none.
        const resolvedSerial = barcode_teacher_serial || teacher_barcode_scanner_serial_number

        if (!resolvedSerial) {
            return res.json({ ok: false, message: 'No teacher serial number found. Please regenerate your barcode.' })
        }

        console.log("Resolved Serial (from barcode):", resolvedSerial)

        // Look up the teacher that owns this serial number
        const teacherResult = await services.getTeacherBySerial(resolvedSerial)
        if (teacherResult.length === 0) {
            return res.json({ ok: false, message: 'Teacher not found for this barcode. Please regenerate your barcode.' })
        }

        const teacherId   = teacherResult[0].teacher_id
        const teacherName = teacherResult[0].teacher_name

        // Check student is enrolled in the resolved teacher's class
        const exists = await services.checkStudentToRegularClass(student_id_number, resolvedSerial)

        if (!exists) {
            return res.json({ ok: false, message: 'Student not registered in this teacher\'s class!' })
        }

        // Insert attendance under the resolved teacher
        const response = await services.insertStudentAttendance(
            student_id,
            student_id_number,
            student_firstname,
            student_middlename,
            student_lastname,
            student_year_level,
            student_program,
            resolvedSerial,
            teacherId,
            teacherName
        )

        // Send SMS to Guardian
        const smsMiddle = student_middlename ? student_middlename.charAt(0).toUpperCase() + '.' : '';
        const _smsTime = new Date().toLocaleString('en-PH', { timeZone: 'Asia/Manila', hour: '2-digit', minute: '2-digit', hour12: true });
        await services.sendSMS(student_guardian_number, `Pan Pacific University: ${student_firstname}${smsMiddle ? ' ' + smsMiddle : ''} ${student_lastname} attended class today at ${_smsTime}.`);

        res.json({ ok: true, message: response })

    } catch (err) {
        console.error(err)
        res.status(500).json({
            ok: false,
            message: err.message || 'Server error'
        })
    }
})

// Get Attendance Record
teacher.get('/teacher_attendance_record', async (req, res) => {
    try {
        const token = services.removeBearer(req.headers['authorization'])
        const decodedToken = services.verifyToken(token)
        if (!decodedToken) return res.status(401).json({ ok: false, message: 'Invalid or expired token.' })
        const result = await services.getStudentAttendanceNow(decodedToken.teacher_barcode_scanner_serial_number)
        res.json({ ok: true, message: 'Successfully retrieved attendance!', content: result })
    } catch(err) {
        res.status(500).json({ ok: false, message: err.message || String(err) })
    }
})

// Get Attendance Record
teacher.get('/teacher_attendance_history_record', async (req, res) => {
    try {
        const token = services.removeBearer(req.headers['authorization'])
        const decodedToken = services.verifyToken(token)
        if (!decodedToken) return res.status(401).json({ ok: false, message: 'Invalid or expired token.' })
        const result = await services.getStudentAttendanceHistory(decodedToken.teacher_barcode_scanner_serial_number)
        res.json({ ok: true, message: 'Successfully retrieved attendance history!', content: result })
    } catch(err) {
        res.status(500).json({ ok: false, message: err.message || String(err) })
    }
})

// Get subjects
teacher.get('/get_subjects', async (req, res) => {
    try {
        const token = services.removeBearer(req.headers['authorization'])
        const decodedToken = services.verifyToken(token)
        if (!decodedToken) return res.status(401).json({ ok: false, message: 'Invalid or expired token.' })
        const result = await services.getStudentSubjects(decodedToken.teacher_id)
        res.json({ ok: true, message: 'Successfully retrieved subjects!', content: result })
    } catch(err) {
        res.status(500).json({ ok: false, message: err.message || String(err) })
    }
})

// Delete Subjects
teacher.delete('/delete_program/:id', async (req, res) => {
    const subjectID = req.params.id
    try {
        const token = services.removeBearer(req.headers['authorization'])
        const decodedToken = services.verifyToken(token)
        if (!decodedToken) return res.status(401).json({ ok: false, message: 'Invalid or expired token.' })
        // Look up subject name before deleting so the log shows the name not the ID
        let subjectName = `Subject ID: ${subjectID}`
        try {
            const subjects = await services.getStudentSubjects(decodedToken.teacher_id)
            const found = subjects.find(s => String(s.subject_id) === String(subjectID))
            if (found) subjectName = found.subject_name
        } catch (_) {}
        const result = await services.deleteSubject(subjectID)
        services.writeActivityLog(decodedToken.teacher_id, decodedToken.teacher_name, 'teacher', 'DELETE_SUBJECT', 'Subject', null, subjectName, `Deleted subject: ${subjectName}`, req.ip, req.body?.device_info || req.headers['x-device-info'] || req.headers['user-agent'])
        res.json({ ok: true, message: 'Successfully retrieved subjects!', content: result })
    } catch(err) {
        res.status(500).json({ ok: false, message: err.message || String(err) })
    }
})

// Add Subject
teacher.post('/programs/add', async (req, res) => {
    const { program_name } = req.body
    try {
        const token = services.removeBearer(req.headers['authorization'])
        const decodedToken = services.verifyToken(token)
        if (!decodedToken) return res.status(401).json({ ok: false, message: 'Invalid or expired token.' })
        const result = await services.addSubject(program_name, decodedToken.teacher_id)
        services.writeActivityLog(decodedToken.teacher_id, decodedToken.teacher_name, 'teacher', 'ADD_SUBJECT', 'Subject', null, program_name, `Added subject: ${program_name}`, req.ip, req.body?.device_info || req.headers['x-device-info'] || req.headers['user-agent'])
        res.json({ ok: true, message: 'Successfully inserted new subject!', content: result })
    } catch(err) {
        res.status(500).json({ ok: false, message: err.message || String(err) })
    }
})

// Get Year Levels
teacher.get('/get_year_levels', async (req, res) => {
    try {
        const token = services.removeBearer(req.headers['authorization'])
        const decodedToken = services.verifyToken(token)
        if (!decodedToken) return res.status(401).json({ ok: false, message: 'Invalid or expired token.' })
        const result = await services.teacherGetYearLevel()
        res.json({ ok: true, message: 'Successfully inserted new subject!', content: result })
    } catch(err) {
        res.status(500).json({ ok: false, message: err.message || String(err) })
    }
});

// Get Programs
teacher.get('/get_programs', async (req, res) => {
    try {
        const token = services.removeBearer(req.headers['authorization'])
        const decodedToken = services.verifyToken(token)
        if (!decodedToken) return res.status(401).json({ ok: false, message: 'Invalid or expired token.' })
        const result = await services.getAllPrograms()
        res.json({ ok: true, message: 'Successfully retrieved subjects!', content: result })
    } catch(err) {
        res.status(500).json({ ok: false, message: err.message || String(err) })
    }
})

// Update Student Record
teacher.put('/update_student_record', async (req, res) => {
    try {
        const token = services.removeBearer(req.headers['authorization'])
        const decodedToken = services.verifyToken(token) || {}

        const {
            student_id,
            student_id_number,
            firstname,
            mi,
            lastname,
            program,
            year_level,
            record_date
        } = req.body

        const result = await services.updateStudentRegisteredRecord(
            student_id,
            student_id_number,
            firstname,
            mi,
            lastname,
            year_level,
            program
        )

        if (!result.duplicate) services.writeActivityLog(decodedToken.teacher_id || null, decodedToken.teacher_name || null, 'teacher', 'EDIT_STUDENT_RECORD', 'Student', req.body.student_id, `${req.body.firstname} ${req.body.lastname}`, `Edited class record: ${req.body.student_id_number}`, req.ip, req.body?.device_info || req.headers['x-device-info'] || req.headers['user-agent'])
        res.json({
            ok: true,
            message: 'Student record updated successfully!',
            content: result
        })

    } catch (err) {
        res.status(500).json({
            ok: false,
            message: err.message || err
        })
    }
})

// Delete Student Record
teacher.delete('/delete_student_record/:id', async (req, res) => {
    const id = req.params.id
    try {
        const token = services.removeBearer(req.headers['authorization'])
        const decodedToken = services.verifyToken(token)
        if (!decodedToken) return res.status(401).json({ ok: false, message: 'Invalid or expired token.' })
        // Look up student name before deleting so the log shows the name not the ID
        let studentName = `Student Record ID: ${id}`
        try {
            const students = await services.teacherGetStudentRegistered(decodedToken.teacher_barcode_scanner_serial_number)
            const found = students.find(s => String(s.student_id) === String(id))
            if (found) studentName = `${found.student_firstname} ${found.student_lastname}`
        } catch (_) {}
        const result = await services.deleteStudentRegisteredRecord(id)
        services.writeActivityLog(decodedToken.teacher_id, decodedToken.teacher_name, 'teacher', 'DELETE_STUDENT_RECORD', 'Student', null, studentName, `Removed ${studentName} from class`, req.ip, req.body?.device_info || req.headers['x-device-info'] || req.headers['user-agent'])
        res.json({ ok: true, message: result})
    } catch(err) {
        res.status(500).json({ ok: false, message: err.message || String(err) })
    }
})

// Get Teacher Data
teacher.get('/get_teacher_data', async (req, res) => {
    try {
        const token = services.removeBearer(req.headers['authorization'])
        const decodedToken = services.verifyToken(token)
        if (!decodedToken) return res.status(401).json({ ok: false, message: 'Invalid or expired token.' })
        const result = await services.getTeacherData(decodedToken.teacher_id)
        res.json({ ok: true, message: 'Successfully retrieved data!', content: result})
    } catch(err) {
        res.status(500).json({ ok: false, message: err.message || String(err) })
    }
})

// Teacher Change Password
teacher.put('/change_password', async (req, res) => {
    const { current_password, new_password } = req.body;
    try {
        const token = services.removeBearer(req.headers['authorization'])
        const decodedToken = services.verifyToken(token)
        if (!decodedToken) return res.status(401).json({ ok: false, message: 'Invalid or expired token.' })
        const result = await services.updateTeacherPassword(decodedToken.teacher_id, current_password, new_password)
        services.writeActivityLog(decodedToken.teacher_id, decodedToken.teacher_name, 'teacher', 'CHANGE_PASSWORD', 'Teacher', decodedToken.teacher_id, null, 'Teacher changed their password', req.ip, req.body?.device_info || req.headers['x-device-info'] || req.headers['user-agent'])
        res.json({ ok: true, message: 'Password updated successfully!', content: result})
    } catch(err) {
        res.status(500).json({ ok: false, message: err.message || String(err) })
    }
})

// Teacher Change Name
teacher.put('/change_teacher_name', async (req, res) => {
    const { newName } = req.body;
    try {
        const token = services.removeBearer(req.headers['authorization'])
        const decodedToken = services.verifyToken(token)
        if (!decodedToken) return res.status(401).json({ ok: false, message: 'Invalid or expired token.' })
        const result = await services.updateTeacherName(decodedToken.teacher_id, newName)
        services.updateMessagesName(decodedToken.teacher_id, 'teacher', newName).catch(() => {})
        services.writeActivityLog(decodedToken.teacher_id, decodedToken.teacher_name || newName, 'teacher', 'CHANGE_NAME', 'Teacher', decodedToken.teacher_id, newName, `Changed name to: ${newName}`, req.ip, req.body?.device_info || req.headers['x-device-info'] || req.headers['user-agent'])
        res.json({ ok: true, message: 'Successfully updated new name!', content: result})
    } catch(err) {
        res.status(500).json({ ok: false, message: err.message || String(err) })
    }
})

teacher.post('/manual_attendance', async (req, res) => {
    const {
        student_id,
        student_id_number,
        student_firstname,
        student_middlename,
        student_lastname,
        student_email,
        student_year_level,
        student_guardian_number,
        student_program
    } = req.body

    try {
        const token = services.removeBearer(req.headers['authorization'])
        const decodedToken = services.verifyToken(token)

        const result = await services.manualInsertAttendance(
            student_id,
            student_id_number,
            student_firstname,
            student_middlename,
            student_lastname,
            student_email,
            student_year_level,
            student_guardian_number,
            student_program,
            decodedToken.teacher_barcode_scanner_serial_number,
            decodedToken.teacher_id,
            decodedToken.teacher_name,
            req.ip,
            req.body?.device_info || req.headers['x-device-info'] || req.headers['user-agent']
        )

        res.json({ ok: true, message: result })
    } catch (err) {
        res.status(500).json({ ok: false, message: err.message || String(err) })
    }
})

// Update attendance status for an existing record (Present / Absent / Excused)
teacher.put('/update_attendance_status/:attendance_id', async (req, res) => {
    try {
        const token = services.removeBearer(req.headers['authorization'])
        const decodedToken = services.verifyToken(token)
        if (!decodedToken) return res.status(401).json({ ok: false, message: 'Invalid or expired token.' })
        const { attendance_id } = req.params
        const { status } = req.body

        const allowedStatuses = ['Present', 'Absent', 'Late', 'Excused']
        if (!allowedStatuses.includes(status)) {
            return res.status(400).json({ ok: false, message: 'Invalid status value.' })
        }

        const result = await services.updateAttendanceStatus(
            attendance_id,
            status,
            decodedToken.teacher_barcode_scanner_serial_number
        )
        res.json({ ok: true, message: result })
    } catch (err) {
        res.status(500).json({ ok: false, message: err.message || String(err) })
    }
})

// Insert a manual Absent or Excused record for a student with no existing record
teacher.post('/insert_manual_status', async (req, res) => {
    try {
        const token = services.removeBearer(req.headers['authorization'])
        const decodedToken = services.verifyToken(token)
        if (!decodedToken) return res.status(401).json({ ok: false, message: 'Invalid or expired token.' })
        const {
            student_id, student_id_number, student_firstname, student_middlename,
            student_lastname, student_program, student_year_level, subject, status
        } = req.body

        const allowedStatuses = ['Present', 'Absent', 'Late', 'Excused']
        if (!allowedStatuses.includes(status)) {
            return res.status(400).json({ ok: false, message: 'Invalid status value.' })
        }

        const result = await services.insertManualStatusRecord(
            student_id, student_id_number, student_firstname, student_middlename,
            student_lastname, student_program, student_year_level, subject,
            decodedToken.teacher_barcode_scanner_serial_number, status
        )
        res.json({ ok: true, message: result.message, insertId: result.insertId })
    } catch (err) {
        res.status(500).json({ ok: false, message: err.message || String(err) })
    }
})

// Get attendance event for teacher
teacher.get('/get_event_attendance', async (req, res) => {
    try {
        const token = services.removeBearer(req.headers['authorization'])
        const decodedToken = services.verifyToken(token)
        if (!decodedToken) return res.status(401).json({ ok: false, message: 'Invalid or expired token.' })
        const result = await services.getAttendanceEventsForTeacher(decodedToken.teacher_id, 'event_attendance_record')
        res.json({ ok: true, message: 'Successfully retrieved events record!', content: result})
    } catch(err) {
        res.status(500).json({ ok: false, message: err.message || String(err) })
    }
})

// Get attendance event history for teacher
teacher.get('/get_event_attendance_history', async (req, res) => {
    try {
        const token = services.removeBearer(req.headers['authorization'])
        const decodedToken = services.verifyToken(token)
        if (!decodedToken) return res.status(401).json({ ok: false, message: 'Invalid or expired token.' })
        const result = await services.getAttendanceEventsForTeacher(decodedToken.teacher_id, 'event_attendance_history_record')
        res.json({ ok: true, message: 'Successfully retrieved events record!', content: result})
    } catch(err) {
        res.status(500).json({ ok: false, message: err.message || String(err) })
    }
})



// Upload Teacher Profile Picture
teacher.post('/upload_profile_picture', uploadTeacherPic.single('teacher_profile_picture'), async (req, res) => {
    if (!req.file) return res.status(400).json({ ok: false, message: 'No file uploaded.' })
    try {
        const token = services.removeBearer(req.headers['authorization'])
        const decodedToken = services.verifyToken(token)
        if (!decodedToken) return res.status(401).json({ ok: false, message: 'Invalid or expired token.' })
        const filename = await services.updateTeacherProfilePicture(decodedToken.teacher_id, req.file.filename)
        res.json({ ok: true, message: 'Profile picture updated!', filename })
    } catch (err) {
        res.status(500).json({ ok: false, message: err.message || err })
    }
})

// Verify Student Location against teacher's set location
teacher.post('/verify_student_location', async (req, res) => {
    const { latitude, longitude } = req.body
    if (latitude === undefined || longitude === undefined) {
        return res.status(400).json({ ok: false, message: 'latitude and longitude are required.' })
    }
    try {
        const token = services.removeBearer(req.headers['authorization'])
        const decodedToken = services.verifyToken(token)
        if (!decodedToken) return res.status(401).json({ ok: false, message: 'Invalid or expired token.' })
        const result = await services.verifyStudentLocation(
            decodedToken.teacher_barcode_scanner_serial_number,
            parseFloat(latitude),
            parseFloat(longitude)
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

// Set Teacher Location
teacher.post('/set_location', async (req, res) => {
    const { latitude, longitude, radius } = req.body
    if (!latitude || !longitude || !radius) {
        return res.status(400).json({ ok: false, message: 'latitude, longitude, and radius are required.' })
    }
    try {
        const token = services.removeBearer(req.headers['authorization'])
        const decodedToken = services.verifyToken(token)
        if (!decodedToken) return res.status(401).json({ ok: false, message: 'Invalid or expired token.' })
        const result = await services.setTeacherLocation(decodedToken.teacher_id, latitude, longitude, radius)
        services.writeActivityLog(decodedToken.teacher_id, decodedToken.teacher_name, 'teacher', 'SET_LOCATION', 'Location', decodedToken.teacher_id, null, `Set location: lat ${latitude}, lng ${longitude}, radius ${radius}m`, req.ip, req.body?.device_info || req.headers['x-device-info'] || req.headers['user-agent'])
        res.json({ ok: true, message: result })
    } catch (err) {
        res.status(500).json({ ok: false, message: err.message || err })
    }
})

// Export route

// Logout
teacher.post('/logout', async (req, res) => {
    try {
        const token = services.removeBearer(req.headers['authorization']);
        const decoded = services.verifyToken(token);
        // FIX: blacklist the token so it cannot be reused after logout
        services.blacklistToken(token)
        if (decoded) {
            const db = require('../configuration/db');
            db.execute('SELECT teacher_email FROM teacher WHERE teacher_id = ? LIMIT 1', [decoded.teacher_id], (err, rows) => {
                const email = (!err && rows.length) ? rows[0].teacher_email : null;
                services.writeLogoutLog(decoded.teacher_id, decoded.teacher_name, email, 'teacher', req.ip, req.body?.device_info || req.headers['x-device-info'] || req.headers['user-agent']);
            });
        }
        res.json({ ok: true });
    } catch (_) { res.json({ ok: true }); }
})

module.exports = teacher
// ── Messaging ──────────────────────────────────────────────
teacher.get('/messages/contacts', async (req, res) => {
    try {
        const tok = services.verifyToken(services.removeBearer(req.headers['authorization']))
        if (!tok) return res.status(401).json({ ok: false })
        const contacts = await services.getMessageContacts(tok.teacher_id, 'teacher')
        const unread   = await services.getUnreadMessageCount(tok.teacher_id, 'teacher')
        res.json({ ok: true, contacts, unread })
    } catch (err) { res.status(500).json({ ok: false, message: err.message }) }
})

teacher.get('/messages/conversation', async (req, res) => {
    try {
        const tok = services.verifyToken(services.removeBearer(req.headers['authorization']))
        if (!tok) return res.status(401).json({ ok: false })
        const { contact_id, contact_role } = req.query
        await services.markMessagesRead(tok.teacher_id, 'teacher', parseInt(contact_id), contact_role)
        const messages = await services.getConversation(tok.teacher_id, 'teacher', parseInt(contact_id), contact_role, 100)
        res.json({ ok: true, messages })
    } catch (err) { res.status(500).json({ ok: false, message: err.message }) }
})

teacher.post('/messages/send', uploadMsgFile.single('file'), async (req, res) => {
    try {
        const tok = services.verifyToken(services.removeBearer(req.headers['authorization']))
        if (!tok) return res.status(401).json({ ok: false })
        const { receiver_id, receiver_role, receiver_name, content } = req.body
        if (!content?.trim() && !req.file) return res.status(400).json({ ok: false, message: 'Message cannot be empty.' })
        const senderName = tok.teacher_name || 'teacher'
        const fileUrl  = req.file ? `/api/v1/uploads/message_files/${req.file.filename}` : null
        const fileName = req.file ? req.file.originalname : null
        const fileType = req.file ? req.file.mimetype : null
        // Fetch profile pictures for sender and receiver
        const getSenderPic = () => new Promise(r => {
            const picMap = { student:'student_profile_picture FROM student_accounts WHERE student_id', teacher:'teacher_profile_picture FROM teacher WHERE teacher_id', admin:'admin_profile_picture FROM admin_accounts WHERE admin_id', super_admin:'super_admin_profile_picture FROM super_admin_accounts WHERE super_admin_id', guard:null }
            const col = picMap['teacher']
            if (!col) return r(null)
            require('../configuration/db').execute(`SELECT ${col} = ? LIMIT 1`, [tok.teacher_id], (e,rows) => r(rows?.[0]?.[Object.keys(rows[0])[0]] || null))
        })
        const getReceiverPic = () => new Promise(r => {
            const picCols = { student:'student_profile_picture FROM student_accounts WHERE student_id', teacher:'teacher_profile_picture FROM teacher WHERE teacher_id', admin:'admin_profile_picture FROM admin_accounts WHERE admin_id', super_admin:'super_admin_profile_picture FROM super_admin_accounts WHERE super_admin_id', guard:null }
            const col = picCols[receiver_role]
            if (!col) return r(null)
            require('../configuration/db').execute(`SELECT ${col} = ? LIMIT 1`, [receiver_id], (e,rows) => r(rows?.[0]?.[Object.keys(rows[0])[0]] || null))
        })
        const [senderPic, receiverPic] = await Promise.all([getSenderPic(), getReceiverPic()])
        const id = await services.sendMessage(tok.teacher_id, 'teacher', senderName, receiver_id, receiver_role, receiver_name, content?.trim() || null, fileUrl, fileName, fileType, senderPic, receiverPic)
        res.json({ ok: true, id })
        // Notify receiver via bell
        services.createMsgNotification(
                parseInt(receiver_id), receiver_role,
                tok.teacher_id, 'teacher', tok.teacher_name || 'teacher',
                req.file ? 'file' : 'message',
                content?.trim() || (req.file ? req.file.originalname : null),
                null, id
        ).catch(() => {})
    } catch (err) { res.status(500).json({ ok: false, message: err.message }) }
})

teacher.get('/messages/search', async (req, res) => {
    try {
        const tok = services.verifyToken(services.removeBearer(req.headers['authorization']))
        if (!tok) return res.status(401).json({ ok: false })
        const users = await services.searchUsersForMessaging(req.query.q || '', tok.teacher_id, 'teacher')
        res.json({ ok: true, users })
    } catch (err) { res.status(500).json({ ok: false, message: err.message }) }
})

// ── Message actions ──────────────────────────────────────────
teacher.delete('/messages/delete-for-me/:id', async (req, res) => {
    try {
        const tok = services.verifyToken(services.removeBearer(req.headers['authorization']))
        if (!tok) return res.status(401).json({ ok: false })
        await services.deleteMessageForMe(parseInt(req.params.id), tok.teacher_id, 'teacher')
        res.json({ ok: true })
    } catch (err) { res.status(500).json({ ok: false, message: err.message }) }
})

teacher.delete('/messages/unsend/:id', async (req, res) => {
    try {
        const tok = services.verifyToken(services.removeBearer(req.headers['authorization']))
        if (!tok) return res.status(401).json({ ok: false })
        await services.unsendMessage(parseInt(req.params.id), tok.teacher_id, 'teacher')
        res.json({ ok: true })
    } catch (err) { res.status(500).json({ ok: false, message: err.message }) }
})



// GET /messages/notifications
teacher.get('/messages/notifications', async (req, res) => {
    try {
        const tok = services.verifyToken(services.removeBearer(req.headers['authorization']))
        if (!tok) return res.status(401).json({ ok: false })
        services.cleanOldMsgNotifications()
        const notifs = await services.getMsgNotifications(tok.teacher_id, 'teacher', parseInt(req.query.limit) || 30)
        const unread = await services.getUnreadMsgNotifCount(tok.teacher_id, 'teacher')
        res.json({ ok: true, notifications: notifs, unread })
    } catch(err) { res.status(500).json({ ok: false, message: err.message }) }
})


// DELETE /messages/notifications/:id
teacher.delete('/messages/notifications/:id', async (req, res) => {
    try {
        const tok = services.verifyToken(services.removeBearer(req.headers['authorization']))
        if (!tok) return res.status(401).json({ ok: false })
        await services.deleteMsgNotification(parseInt(req.params.id), tok.teacher_id, 'teacher')
        res.json({ ok: true })
    } catch(err) { res.status(500).json({ ok: false, message: err.message }) }
})

// POST /messages/notifications/read
teacher.post('/messages/notifications/read', async (req, res) => {
    try {
        const tok = services.verifyToken(services.removeBearer(req.headers['authorization']))
        if (!tok) return res.status(401).json({ ok: false })
        const ids = req.body.ids || []
        await services.markMsgNotificationsRead(tok.teacher_id, 'teacher', ids)
        res.json({ ok: true })
    } catch(err) { res.status(500).json({ ok: false, message: err.message }) }
})

// GET /messages/reaction-notifications
teacher.get('/messages/reaction-notifications', async (req, res) => {
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
            [after, tok.teacher_id, 'teacher'],
            (err, rows) => {
                if (err) return res.json({ ok: true, notifications: [] })
                const parsed = rows.map(r => ({ ...r, meta: r.meta ? (typeof r.meta === 'string' ? JSON.parse(r.meta) : r.meta) : {} }))
                services.enrichReactionNotifications(parsed).then(enriched => { res.json({ ok: true, notifications: enriched }) }).catch(() => res.json({ ok: true, notifications: parsed }))
            }
        )
    } catch(err) { res.status(500).json({ ok: false, message: err.message }) }
})

// POST /messages/react/:id
teacher.post('/messages/react/:id', async (req, res) => {
    try {
        const tok = services.verifyToken(services.removeBearer(req.headers['authorization']))
        if (!tok) return res.status(401).json({ ok: false, message: 'Unauthorized.' })
        const { emoji } = req.body
        const { reactions, msg } = await services.reactToMessage(
            parseInt(req.params.id),
            tok.teacher_id, 'teacher',
            emoji || null
        )
        // Determine the OTHER party (not the reactor)
        // If reactor is the message sender → notify receiver, else notify sender
        const receiverId   = String(msg.sender_id) === String(tok.teacher_id) && msg.sender_role === 'teacher'
            ? msg.receiver_id : msg.sender_id
        const receiverRole = String(msg.sender_id) === String(tok.teacher_id) && msg.sender_role === 'teacher'
            ? msg.receiver_role : msg.sender_role
        // Never notify yourself and never notify super_admin via bell
        const isSelf       = String(receiverId) === String(tok.teacher_id) && receiverRole === 'teacher'
        // Write reaction notification for all roles including super_admin
        if (emoji && !isSelf) {
            services.createNotification(
                'reaction',
                'New Reaction',
                `${tok.teacher_name || 'teacher'} reacted ${emoji} to your message`,
                { reactor_id: tok.teacher_id, reactor_role: 'teacher', message_id: parseInt(req.params.id), receiver_id: receiverId, receiver_role: receiverRole, emoji }
            ).catch(() => {})
        }
        res.json({ ok: true, reactions })
        // Notify via bell (skip only self)
        if (emoji && !isSelf) {
            services.createMsgNotification(
                receiverId, receiverRole,
                tok.teacher_id, 'teacher', tok.teacher_name || 'teacher',
                'reaction', null, emoji, parseInt(req.params.id)
            ).catch(() => {})
        }
    } catch (err) {
        res.status(500).json({ ok: false, message: err.message })
    }
})

teacher.post('/messages/pin/:id', async (req, res) => {
    try {
        const tok = services.verifyToken(services.removeBearer(req.headers['authorization']))
        if (!tok) return res.status(401).json({ ok: false })
        const msg = await services.pinMessage(parseInt(req.params.id), tok.teacher_id, 'teacher')
        res.json({ ok: true, message: msg })
    } catch (err) { res.status(500).json({ ok: false, message: err.message }) }
})

teacher.put('/messages/edit/:id', async (req, res) => {
    try {
        const tok = services.verifyToken(services.removeBearer(req.headers['authorization']))
        if (!tok) return res.status(401).json({ ok: false })
        const { content } = req.body
        await services.editMessage(parseInt(req.params.id), tok.teacher_id, 'teacher', content)
        res.json({ ok: true })
    } catch (err) { res.status(500).json({ ok: false, message: err.message }) }
})
// ============================================================
// SUBJECT CLASS LIST ROUTES
// ============================================================

// Get students in a subject's class list
teacher.get('/subject-class-list/:subjectId', async (req, res) => {
    try {
        const token = services.removeBearer(req.headers['authorization'])
        const decoded = services.verifyToken(token)
        const result = await services.getSubjectClassList(req.params.subjectId, decoded.teacher_barcode_scanner_serial_number)
        res.json({ ok: true, content: result })
    } catch (err) {
        res.status(500).json({ ok: false, message: err.message || String(err) })
    }
})

// Add a student to a subject's class list
teacher.post('/subject-class-list/add', async (req, res) => {
    try {
        const token = services.removeBearer(req.headers['authorization'])
        const decoded = services.verifyToken(token)
        const { subjectId, studentId } = req.body
        await services.addStudentToSubjectClassList(subjectId, studentId, decoded.teacher_barcode_scanner_serial_number)
        res.json({ ok: true, message: 'Student added to class list!' })
    } catch (err) {
        res.status(500).json({ ok: false, message: err.message || String(err) })
    }
})

// Remove a student from a subject's class list
teacher.delete('/subject-class-list/remove/:id', async (req, res) => {
    try {
        const token = services.removeBearer(req.headers['authorization'])
        const decoded = services.verifyToken(token)
        await services.removeStudentFromSubjectClassList(req.params.id, decoded.teacher_barcode_scanner_serial_number)
        res.json({ ok: true, message: 'Student removed from class list!' })
    } catch (err) {
        res.status(500).json({ ok: false, message: err.message || String(err) })
    }
})