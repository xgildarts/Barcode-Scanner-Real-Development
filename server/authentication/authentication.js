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
        const {
            idNumber,
            firstName,
            middleName,
            lastName,
            email,
            password,
            yearLevel,
            guardianContact,
            program,
            device_id
        } = req.body;

        const isDuplicate = await services.checkStudentAccountDuplication(email, idNumber);
        if (isDuplicate) {
            return res.json({ ok: false, message: 'Email or ID number already registered' });
        }

        const hashedPassword = await services.hashPassword(password);
        const barcode = services.generateBarcode();
        const locationGenerated = '';

        await services.studentRegistration(
            idNumber, firstName, middleName, lastName, email,
            hashedPassword, yearLevel, guardianContact, program,
            locationGenerated, barcode, device_id
        );

        services.createNotification(
            'new_student',
            'New Student Registered',
            `${firstName} ${middleName ? middleName + '. ' : ''}${lastName} (${idNumber}) registered — ${program}, ${yearLevel}`,
            { student_id_number: idNumber, name: `${firstName} ${lastName}`, program, yearLevel, email }
        ).catch(err => console.error('[Notification]', err));

        res.json({ ok: true, message: 'Successfully registered!' });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ ok: false, message: 'Server error' });
    }
});

// Student Google Login
router.post('/student_google_login', async (req, res) => {
    try {
        const { email, device_id } = req.body;
        if (!email) return res.status(400).json({ ok: false, message: 'Email is required.' });
        const result = await services.studentGoogleLogin(
            email,
            device_id || '',
            req.ip,
            req.body?.device_info || req.headers['x-device-info'] || req.headers['user-agent']
        );
        res.json(result);
    } catch (err) {
        console.error('Google login error:', err);
        res.status(401).json({ ok: false, message: typeof err === 'string' ? err : 'Login failed.' });
    }
});

// Student Login API
router.post('/student_login', async (req, res) => {
    try {
        const { email, password, device_id } = req.body;
        const response = await services.studentLogin(
            email, password, device_id, req.ip,
            req.body?.device_info || req.headers['x-device-info'] || req.headers['user-agent']  // FIX: removed duplicate req.body.device_info
        );
        res.json(response);
    } catch (err) {
        console.error(err);
        res.status(401).json({ ok: false, message: err.message || String(err) });  // FIX: Error objects serialized as {}
    }
});

// Teacher Registration
router.post('/teacher_registration', async (req, res) => {
    try {
        const { fullName, email, password, department } = req.body;
        const token = services.removeBearer(req.headers['authorization']);
        const decodedToken = services.verifyToken(token);
        // FIX: null check was missing — an expired/invalid token caused TypeError crash
        if (!decodedToken) return res.status(401).json({ ok: false, message: 'Invalid or expired token.' });
        const result = await services.teacherRegistration(fullName, email, password, department, decodedToken.admin_id);
        res.json({ ok: true, message: result });
    } catch (err) {
        res.status(500).json({ ok: false, message: err.message || String(err) });
    }
});

// Teacher Login
router.post('/teacher_login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const result = await services.teacherLogin(
            email, password, req.ip,
            req.body?.device_info || req.headers['x-device-info'] || req.headers['user-agent']
        );
        res.json({ ok: true, message: result.message, token: result.token, teacher_name: result.teacher_name });
    } catch (err) {
        // FIX: wrong status code — bad credentials should be 401, not 500
        const status = (err.message || String(err)).toLowerCase().includes('invalid') ? 401 : 500;
        res.status(status).json({ ok: false, message: err.message || String(err) });
    }
});

// Guard Registration
router.post('/guard_registration', async (req, res) => {
    const { guard_name, guard_email, guard_password, guard_designated_location } = req.body;
    try {
        const token = services.removeBearer(req.headers['authorization']);
        const decodedToken = services.verifyToken(token);
        // FIX: null check was missing — an expired/invalid token caused TypeError crash
        if (!decodedToken) return res.status(401).json({ ok: false, message: 'Invalid or expired token.' });
        const result = await services.guardRegistration(guard_name, guard_email, guard_password, guard_designated_location, decodedToken.admin_id);
        res.json({ ok: true, message: result });
    } catch (err) {
        res.status(401).json({ ok: false, message: err.message || String(err) });
    }
});

// Check token
router.post('/verify_token', (req, res) => {
    try {
        const token = services.removeBearer(req.headers['authorization']);
        const response = services.verifyToken(token);
        if (response) {
            res.json({ ok: true, message: 'Valid token' });
        } else {
            // FIX: was returning HTTP 200 even for invalid tokens — misleading to clients
            res.status(401).json({ ok: false, message: 'Invalid token or expired!' });
        }
    } catch (err) {
        res.status(401).json({ ok: false, message: 'Invalid token or expired!' });
    }
});

// Admin Login
router.post('/admin_login', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ ok: false, message: 'Please enter email and password.' });
        }

        const result = await services.adminLogin(
            email, password, req.ip,
            req.body?.device_info || req.headers['x-device-info'] || req.headers['user-agent']
        );
        res.json(result);

    } catch (err) {
        console.error(err);
        if (err === 'Invalid email or password' || err.message === 'Invalid email or password') {
            return res.status(401).json({ ok: false, message: 'Invalid email or password.' });
        }
        res.status(500).json({ ok: false, message: 'Server error' });
    }
});

// Student Contact Request — issues a scoped guest token for locked-out students
router.post('/student_contact_request', async (req, res) => {
    const { email } = req.body;
    if (!email) return res.status(400).json({ ok: false, message: 'Email is required.' });

    const db = require('../configuration/db');
    db.execute(
        'SELECT student_id, student_firstname, student_lastname FROM student_accounts WHERE student_email = ? LIMIT 1',
        [email],
        (err, rows) => {
            if (err) return res.status(500).json({ ok: false, message: 'Server error.' });
            if (!rows || rows.length === 0) return res.status(404).json({ ok: false, message: 'No account found for this email.' });

            const student = rows[0];
            const jwt = require('jsonwebtoken');
            const JWT_SECRET = process.env.TOKEN_KEYWORD;

            const guestToken = jwt.sign(
                {
                    student_id: student.student_id,
                    student_firstname: student.student_firstname,
                    student_lastname: student.student_lastname,
                    student_email: email,
                    role: 'student',
                    scope: 'contact_only'
                },
                JWT_SECRET,
                { expiresIn: '2h' }
            );

            res.json({
                ok: true,
                guest_token: guestToken,
                student_id: student.student_id,
                student_name: `${student.student_firstname} ${student.student_lastname}`
            });
        }
    );
});

module.exports = router;