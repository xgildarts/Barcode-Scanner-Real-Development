const express = require('express')
const services = require('../controller/services')
const teacher = express.Router()

teacher.use(express.json())

// Debugging API
teacher.get('/', (req, res) => {
    res.send('Teacher API Working!')
})

// Get total students
teacher.get('/get_students_total_count', async (req, res) => {
    try {  
        const token = services.removeBearer(req.headers['authorization'])
        const decodedToken = services.verifyToken(token)
        const result = await services.teacherGetAllStudentDataTotalCount(decodedToken.teacher_barcode_scanner_serial_number)
        res.json({ ok: true, message: 'Successfully retrieved data!', content: result })
    } catch(err) {
        res.status(500).json({ ok: false, message: err })
    }
})

// Add Student to Regular Class Records
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
            decodedToken.teacher_barcode_scanner_serial_number
            )
        res.json({ ok: true, message: 'Successfully added student!', content: result })
    } catch(err) {

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
        res.status(500).json({ ok: false, message: err })
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
        res.status(500).json({ ok: false, message: err })
    }
})

// Subject and Year Level Setter
teacher.put('/teacher_subject_and_year_level_setter', async (req, res) => {
    const { subject, yearLevel } = req.body
    try {
        const token = services.removeBearer(req.headers['authorization'])
        const decodedToken = services.verifyToken(token)
        const result = await services.teacherSubjectAndYearLevelSetter(subject, yearLevel, decodedToken.teacher_barcode_scanner_serial_number)
        res.json({ ok: true, message: result })
    } catch(err) {
        res.status(500).json({ ok: false, message: err })
    }
})

// Attendance Insertion
teacher.post('/teacher_attendance_insertion', async (req, res) => {
    const { barcode, teacher_barcode_scanner_serial_number } = req.body

    console.log("Barcode:", barcode)
    console.log("Serial Number:", teacher_barcode_scanner_serial_number)

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
            teacher_barcode_scanner_serial_number
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
        res.status(500).json({ ok: false, message: err })
    }
})

// Get Attendance Record
teacher.get('/teacher_attendance_history_record', async (req, res) => {
    try {
        const token = services.removeBearer(req.headers['authorization'])
        const decodedToken = services.verifyToken(token)
        const result = await services.getStudentAttendanceNow(decodedToken.teacher_barcode_scanner_serial_number)
        res.json({ ok: true, message: 'Successfully retrieved attendance history!', content: result })
    } catch(err) {
        res.status(500).json({ ok: false, message: err })
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
        res.status(500).json({ ok: false, message: err })
    }
})

// Delete Subjects
teacher.delete('/delete_program/:id', async (req, res) => {
    const subjectID = req.params.id
    try {
        const token = services.removeBearer(req.headers['authorization'])
        const decodedToken = services.verifyToken(token)
        const result = await services.deleteSubject(subjectID)
        res.json({ ok: true, message: 'Successfully retrieved subjects!', content: result })
    } catch(err) {
        res.status(500).json({ ok: false, message: err })
    }
})

// Add Subject
teacher.post('/programs/add', async (req, res) => {
    const { program_name } = req.body
    try {
        const token = services.removeBearer(req.headers['authorization'])
        const decodedToken = services.verifyToken(token)
        const result = await services.addSubject(program_name, decodedToken.teacher_id)
        res.json({ ok: true, message: 'Successfully inserted new subject!', content: result })
    } catch(err) {
        res.status(500).json({ ok: false, message: err })
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
        res.status(500).json({ ok: false, message: err })
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
        res.status(500).json({ ok: false, message: err })
    }
})

// Update Student Record
teacher.put('/update_student_record', async (req, res) => {
    try {
        const token = services.removeBearer(req.headers['authorization'])
        services.verifyToken(token)

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
        const result = await services.deleteStudentRegisteredRecord(id)
        res.json({ ok: true, message: result})
    } catch(err) {
        res.status(500).json({ ok: false, message: err })
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
        res.status(500).json({ ok: false, message: err })
    }
})

// Teacher Change Password
teacher.put('/change_password', async (req, res) => {
    const { current_password, new_password } = req.body;
    try {
        const token = services.removeBearer(req.headers['authorization'])
        const decodedToken = services.verifyToken(token)
        const result = await services.updateTeacherPassword(decodedToken.teacher_id, current_password, new_password)
        res.json({ ok: true, message: 'Password updated successfully!', content: result})
    } catch(err) {
        res.status(500).json({ ok: false, message: err })
    }
})

// Teacher Change Name
teacher.put('/change_teacher_name', async (req, res) => {
    const { newName } = req.body;
    try {
        const token = services.removeBearer(req.headers['authorization'])
        const decodedToken = services.verifyToken(token)
        const result = await services.updateTeacherName(decodedToken.teacher_id, newName)
        res.json({ ok: true, message: 'Successfully updated new name!', content: result})
    } catch(err) {
        res.status(500).json({ ok: false, message: err })
    }
})

teacher.post('/manual_attendance', async (req, res) => {
    const { newName } = req.body;
    try {
        const token = services.removeBearer(req.headers['authorization'])
        const decodedToken = services.verifyToken(token)
        const result = await services.updateTeacherName(decodedToken.teacher_id, newName)
        res.json({ ok: true, message: 'Successfully updated new name!', content: result})
    } catch(err) {
        res.status(500).json({ ok: false, message: err })
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
        res.status(500).json({ ok: false, message: err })
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
        res.status(500).json({ ok: false, message: err })
    }
})



// Export route
module.exports = teacher