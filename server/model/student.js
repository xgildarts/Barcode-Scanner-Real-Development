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

// Change Student password
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

// Get student barcode
student.get('/student_barcode', async (req, res) => {
    try {
        const token = services.removeBearer(req.headers['authorization'])
        const decodedToken = services.verifyToken(token)
        const result = await services.getStudentBarcode(decodedToken.student_id)
        res.json({ ok: true, message: 'Successfully retrieved barcode',  content: result})
    } catch(err) {
        res.status(401).json({ ok: false, message: err })
    }
})

// Update student barcode
student.put('/update_student_barcode', async (req, res) => {
    try {
        const { barcode } = req.body
        const token = services.removeBearer(req.headers['authorization'])
        const decodedToken = services.verifyToken(token)
        const result = await services.updateStudentBarcode(decodedToken.student_id, barcode)
        res.json({ ok: true, message: result })
    } catch(err) {
        res.status(500).json({ ok: false, message: err })
    }
})

// Get Student Data
student.get('/get_attendance_history_record', async (req, res) => {
    try {
        const token = services.removeBearer(req.headers['authorization'])
        const decodedToken = services.verifyToken(token)
        console.log(decodedToken)
        const result = await services.getAttendanceHistoryForStudentOnly(decodedToken.student_id)
        res.json({ ok: true, message: 'Successfully retrieved student history attendance!', content: result })
    } catch(err) {
        res.status(500).json({ ok: false, message: err })
    }
})


// Verify student location against their teacher's set location
student.post('/verify_location', async (req, res) => {
    const { latitude, longitude } = req.body

    if (latitude === undefined || longitude === undefined) {
        return res.status(400).json({ ok: false, message: 'latitude and longitude are required.' })
    }

    try {
        const token = services.removeBearer(req.headers['authorization'])
        const decodedToken = services.verifyToken(token)

        const result = await services.verifyStudentLocation(
            decodedToken.student_id_number,
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


module.exports = student