const express = require('express')
const services = require('../controller/services')
const student = express.Router()

student.use(express.json())

// Get Student Data's
student.get('/student_get_data', async (req, res) => {
    try {
        const token = services.removeBearer(req.headers['authorization'])
        const decodedToken = services.verifyToken(token)
        const data = await services.getStudentsData(decodedToken.student_id)
        console.log(data)
        res.json({ ok: true, message: 'Successfully retrieved data!', contents: data })
    } catch(err) {
        res.status(401).json({ ok: false, message: err })
    }
})

// Update Student Data
student.put('/student_update_profile', async (req, res) => {
    try {
        // Get token from header and decode
        const token = services.removeBearer(req.headers['authorization']);
        const decodedToken = services.verifyToken(token);
        if (!decodedToken) return res.status(401).json({ message: 'Unauthorized' });

        const studentId = decodedToken.student_id_number;

        await services.studentUpdateProfile(studentId, req.body);

        res.json({ ok: true, message: 'Profile updated successfully' });

    } catch (error) {
        console.error('Update profile error:', error);
        res.status(500).json({ ok: false, message: error.message || 'Server error' });
    }
})

student.put('/student_change_password', async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body
        const token = services.removeBearer(req.headers['authorization'])
        const decodedToken = services.verifyToken(token)
        const result = await services.updateStudentPassword(currentPassword, newPassword, decodedToken.student_id)
        res.json({ ok: true, message: result })
    } catch(err) {
        res.status(401).json({ ok: false, message: err })
    }
})


module.exports = student