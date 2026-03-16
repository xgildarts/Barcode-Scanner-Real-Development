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
        const token = services.removeBearer(req.headers['authorization']);
        const decodedToken = services.verifyToken(token);
        if (!decodedToken) return res.status(401).json({ message: 'Unauthorized' });

        const studentId = decodedToken.student_id;

        const result = await services.studentUpdateProfile(studentId, req.body);

        if (result.duplicate) {
            return res.status(409).json({ ok: false, duplicate: true, message: `ID number "${req.body.idNumber}" is already assigned to another student.` });
        }

        const fullName = `${decodedToken.student_firstname} ${decodedToken.student_lastname}`
        services.writeActivityLog(decodedToken.student_id, fullName, 'student', 'UPDATE_PROFILE', 'Student', null, fullName, `Updated profile — ID No: ${req.body.idNumber || decodedToken.student_id_number}`)
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
        const fullName = `${decodedToken.student_firstname} ${decodedToken.student_lastname}`
        services.writeActivityLog(decodedToken.student_id, fullName, 'student', 'CHANGE_PASSWORD', 'Student', null, fullName, 'Student changed their password')
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
        const fullName = `${decodedToken.student_firstname} ${decodedToken.student_lastname}`
        services.writeActivityLog(decodedToken.student_id, fullName, 'student', 'REGENERATE_BARCODE', 'Student', null, fullName, `Regenerated barcode — ID No: ${decodedToken.student_id_number}`)
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


// Verify student location against their SPECIFIC teacher's set location
// teacher_serial must be passed from the frontend so we check the right teacher,
// preventing a student from bypassing location check via a different enrolled teacher.
student.post('/verify_location', async (req, res) => {
    const { latitude, longitude, teacher_serial } = req.body

    if (latitude === undefined || longitude === undefined) {
        return res.status(400).json({ ok: false, message: 'latitude and longitude are required.' })
    }

    try {
        const token = services.removeBearer(req.headers['authorization'])
        const decodedToken = services.verifyToken(token)

        const result = await services.verifyStudentLocation(
            decodedToken.student_id_number,
            parseFloat(latitude),
            parseFloat(longitude),
            teacher_serial || null  // pass specific teacher serial to prevent bypass
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


// ============================================================
// STUDENT FORGOT PASSWORD — public routes (no token required)
// ============================================================
student.post('/forgot_password/request_otp', async (req, res) => {
    const { email } = req.body
    if (!email) return res.status(400).json({ ok: false, message: 'Email is required.' })
    try {
        await services.sendStudentPasswordResetOTP(email)
        res.json({ ok: true, message: 'OTP sent to your email.' })
    } catch (err) {
        res.status(400).json({ ok: false, message: err.message })
    }
})

student.post('/forgot_password/verify_otp', (req, res) => {
    const { email, otp } = req.body
    if (!email || !otp) return res.status(400).json({ ok: false, message: 'Email and OTP are required.' })
    try {
        services.verifyStudentPasswordResetOTP(email, otp)
        res.json({ ok: true, message: 'OTP verified.' })
    } catch (err) {
        res.status(400).json({ ok: false, message: err.message })
    }
})

student.post('/forgot_password/reset_password', async (req, res) => {
    const { email, new_password, confirm_password } = req.body
    if (!email || !new_password || !confirm_password) return res.status(400).json({ ok: false, message: 'All fields are required.' })
    if (new_password !== confirm_password) return res.status(400).json({ ok: false, message: 'Passwords do not match.' })
    if (new_password.length < 8) return res.status(400).json({ ok: false, message: 'Password must be at least 8 characters.' })
    try {
        await services.resetStudentPasswordWithOTP(email, new_password)
        res.json({ ok: true, message: 'Password reset successfully.' })
    } catch (err) {
        res.status(400).json({ ok: false, message: err.message })
    }
})

// Get Year Levels (public — no token required, used on registration page)
student.get('/year_levels', async (req, res) => {
    try {
        const result = await services.getYearLevels();
        res.json({ ok: true, message: 'Successfully retrieved year levels!', content: result })
    } catch(err) {
        res.status(500).json({ ok: false, message: err.message || String(err) })
    }
})

// Get Programs (public — no token required, used on registration page)
student.get('/programs', async (req, res) => {
    try {
        const result = await services.getAllPrograms()
        res.json({ ok: true, message: 'Successfully retrieved programs!', content: result })
    } catch(err) {
        res.status(500).json({ ok: false, message: err.message || String(err) })
    }
})

// Get all teachers this student is enrolled under (for class picker)
student.get('/enrolled_teachers', async (req, res) => {
    try {
        const token = services.removeBearer(req.headers['authorization'])
        const decodedToken = services.verifyToken(token)
        const result = await services.getStudentEnrolledTeachers(decodedToken.student_id_number)
        res.json({ ok: true, content: result })
    } catch (err) {
        res.status(500).json({ ok: false, message: err.message || err })
    }
})

module.exports = student