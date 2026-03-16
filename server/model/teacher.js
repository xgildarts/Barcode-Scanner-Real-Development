const express = require('express')
const services = require('../controller/services')
const multer  = require('multer')
const path    = require('path')
const teacher = express.Router()

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
        services.verifyToken(token)
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
        const result = await services.teacherGetTotalAttendanceRecord(decodedToken.teacher_barcode_scanner_serial_number)
        res.json({ ok: true, message: 'Successfully retrieved data!', content: result })
    } catch(err) {
        res.status(500).json({ ok: false, message: err.message || String(err) })
    }
})

// Subject and Year Level Setter
teacher.put('/teacher_subject_and_year_level_setter', async (req, res) => {
    const { subject, yearLevel } = req.body
    try {
        const token = services.removeBearer(req.headers['authorization'])
        const decodedToken = services.verifyToken(token)
        const result = await services.teacherSubjectAndYearLevelSetter(subject, yearLevel, decodedToken.teacher_barcode_scanner_serial_number)
        services.writeActivityLog(decodedToken.teacher_id, decodedToken.teacher_name, 'teacher', 'SET_SUBJECT_YEAR_LEVEL', 'Class Setup', null, subject, `Set subject: ${subject}, year level: ${yearLevel}`)
        res.json({ ok: true, message: result })
    } catch(err) {
        res.status(500).json({ ok: false, message: err.message || String(err) })
    }
})

// Attendance Insertion
teacher.post('/teacher_attendance_insertion', async (req, res) => {
    const { barcode, teacher_barcode_scanner_serial_number } = req.body

    console.log("Barcode:", barcode)
    console.log("Serial Number:", teacher_barcode_scanner_serial_number)

    try {
        let teacherId = null, teacherName = null
        try {
            const tok = services.removeBearer(req.headers['authorization'])
            const dec = services.verifyToken(tok)
            teacherId   = dec.teacher_id   || null
            teacherName = dec.teacher_name || null
        } catch (_) {}
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
            student_program
        } = result[0]

        // Check regular class
        const exists = await services.checkStudentToRegularClass(student_id_number)

        if (!exists) {
            return res.json({ ok: false, message: 'Student not register to this subject!' })
        }

        // Insert attendance
        const response = await services.insertStudentAttendance(
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
        )

        // Send SMS to Guardian
        await services.sendSMS(student_guardian_number, `${student_firstname} ${student_middlename}. ${student_lastname} Your child has attended school today.`);

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
        // Look up subject name before deleting so the log shows the name not the ID
        let subjectName = `Subject ID: ${subjectID}`
        try {
            const subjects = await services.getStudentSubjects(decodedToken.teacher_id)
            const found = subjects.find(s => String(s.subject_id) === String(subjectID))
            if (found) subjectName = found.subject_name
        } catch (_) {}
        const result = await services.deleteSubject(subjectID)
        services.writeActivityLog(decodedToken.teacher_id, decodedToken.teacher_name, 'teacher', 'DELETE_SUBJECT', 'Subject', null, subjectName, `Deleted subject: ${subjectName}`)
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
        const result = await services.addSubject(program_name, decodedToken.teacher_id)
        services.writeActivityLog(decodedToken.teacher_id, decodedToken.teacher_name, 'teacher', 'ADD_SUBJECT', 'Subject', null, program_name, `Added subject: ${program_name}`)
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

        if (!result.duplicate) services.writeActivityLog(decodedToken.teacher_id || null, decodedToken.teacher_name || null, 'teacher', 'EDIT_STUDENT_RECORD', 'Student', req.body.student_id, `${req.body.firstname} ${req.body.lastname}`, `Edited class record: ${req.body.student_id_number}`)
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
        // Look up student name before deleting so the log shows the name not the ID
        let studentName = `Student Record ID: ${id}`
        try {
            const students = await services.teacherGetStudentRegistered(decodedToken.teacher_barcode_scanner_serial_number)
            const found = students.find(s => String(s.student_id) === String(id))
            if (found) studentName = `${found.student_firstname} ${found.student_lastname}`
        } catch (_) {}
        const result = await services.deleteStudentRegisteredRecord(id)
        services.writeActivityLog(decodedToken.teacher_id, decodedToken.teacher_name, 'teacher', 'DELETE_STUDENT_RECORD', 'Student', null, studentName, `Removed ${studentName} from class`)
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
        const result = await services.updateTeacherPassword(decodedToken.teacher_id, current_password, new_password)
        services.writeActivityLog(decodedToken.teacher_id, decodedToken.teacher_name, 'teacher', 'CHANGE_PASSWORD', 'Teacher', decodedToken.teacher_id, null, 'Teacher changed their password')
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
        const result = await services.updateTeacherName(decodedToken.teacher_id, newName)
        services.writeActivityLog(decodedToken.teacher_id, decodedToken.teacher_name || newName, 'teacher', 'CHANGE_NAME', 'Teacher', decodedToken.teacher_id, newName, `Changed name to: ${newName}`)
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
            decodedToken.teacher_name
        )

        res.json({ ok: true, message: result })
    } catch (err) {
        res.status(500).json({ ok: false, message: err.message || String(err) })
    }
})

// Get attendance event for teacher
teacher.get('/get_event_attendance', async (req, res) => {
    try {
        const token = services.removeBearer(req.headers['authorization'])
        const decodedToken = services.verifyToken(token)
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
        const result = await services.setTeacherLocation(decodedToken.teacher_id, latitude, longitude, radius)
        services.writeActivityLog(decodedToken.teacher_id, decodedToken.teacher_name, 'teacher', 'SET_LOCATION', 'Location', decodedToken.teacher_id, null, `Set location: lat ${latitude}, lng ${longitude}, radius ${radius}m`)
        res.json({ ok: true, message: result })
    } catch (err) {
        res.status(500).json({ ok: false, message: err.message || err })
    }
})

// Export route
module.exports = teacher