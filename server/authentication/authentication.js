
const express = require('express');
const services = require('../controller/services');

const router = express.Router();

// Welcome API message display
router.get('/', (req, res) => {
    res.send('Welcome to Authentication API');
});

// Student Registration API
router.post('/student_registration', async (req, res) => {
    try {
        // Extract and prepare data
        const {
            idNumber,
            firstName,
            middleName,
            lastName,
            email,
            password,
            yearLevel,
            guardianContact,
            program
        } = req.body;

        // Check duplicates
        const isDuplicate = await services.checkStudentAccountDuplication(email, idNumber);
        if (isDuplicate) {
            return res.json({ ok: false, message: 'Email or ID number already registered' });
        }

        // Hash password, generate IDs etc.
        const hashedPassword = await services.hashPassword(password);
        const deviceID = services.generateDeviceID();
        const barcode = services.generateBarcode();
        const locationGenerated = '';

        // Call registration service
        await services.studentRegistration(
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
        );

        res.json({
            ok: true,
            message: 'Successfully registered!',
            device_id: deviceID
        });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ ok: false, message: 'Server error' });
    }
});

// Student Login API
router.post('/student_login', async (req, res) => {
    try {
        const { email, password, device_id} = req.body
        const response = await services.studentLogin(email, password, device_id)
        res.json(response)
    } catch(err) {
        console.error(err)
        res.status(401).json({ ok: false, message: err })
    }
})

// Teacher Registration
router.post('/teacher_registration', async (req, res) => {
    try {
        const { fullName,
                email,
                password,
                department  } = req.body
        const result = await services.teacherRegistration(fullName, email, password, department)
        res.json({ ok: true, message: result })
    } catch(err) {
        res.status(500).json({ ok: false, message: err })
    }
})

// Teacher Login
router.post('/teacher_login', async (req, res) => {
    const { email, password } = req.body
    try {
        const result = await services.teacherLogin(email, password)
        res.json({ ok: true, message: result.message, token: result.token, teacher_name: result.teacher_name })
    } catch(err) {
        res.status(500).json({ ok: false, message: err })
    }
})

// Check token
router.post('/verify_token', (req, res) => {
    const token = services.removeBearer(req.headers['authorization'])
    const response = services.verifyToken(token)
    if(response) {
        res.json({ ok: true, message: 'Valid token' })
    } else {
        res.json({ ok: false, message: 'Invalid token or expired!' })
    }
})



module.exports = router;
