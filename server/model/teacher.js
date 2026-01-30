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
        const result = await services.teacherGetAllStudentDataTotalCount(decodedToken.teacher_program)
        res.json({ ok: true, message: 'Successfully retrieved data!', content: result })
    } catch(err) {
        res.status(500).json({ ok: false, message: err })
    }
})



module.exports = teacher