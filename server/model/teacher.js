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
    const { barcode } = req.body
    try {
        const token = services.removeBearer(req.headers['authorization'])
        const decodedToken = services.verifyToken(token)
        // 1. Check Registration if Student Exists
        const result = await services.checkStudentIfExistsInRegistration(barcode)
        res.json({ result })
        if(result.length === 0) { return res.json({ ok: false, message: 'Student not registered' }) }
        // 2. Check Regular class registration for specific teacher
        const exists = await services.checkStudentToRegularClass(result[0].student_id_number)
        if(!exists) { return res.json({ ok: false, message: 'Student not register to this subject!' }) }
        // 3. Insert to Attendance

    } catch(err) {
        res.status(500).json({ ok: false, message: err })
    }
})



module.exports = teacher