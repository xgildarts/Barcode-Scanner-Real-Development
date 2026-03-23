const express = require('express');
const cors = require('cors');
const path = require('path');
const auth = require('../authentication/authentication');
const student = require('../model/student');
const programs = require('../model/program');
const teacher = require('../model/teacher');
const admin = require('../model/admin');
const guard = require('../model/guard');
const superAdmin = require('../model/super_admin');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT;

app.use(express.json());
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept']
}));
app.set('trust proxy', true);
app.use('/api/v1/uploads', express.static(path.join(__dirname, '../../uploads')))
app.use('/api/v1/uploads/message_files', express.static(path.join(__dirname, '../../uploads/message_files')))
app.use('/public', express.static(path.join(__dirname, '../../public')))  // logo & public assets


// Static folders — frontend served directly by Express
app.use('/admin',       express.static(path.join(__dirname, '../../admin')))
app.use('/guard',       express.static(path.join(__dirname, '../../guard')))
app.use('/student',     express.static(path.join(__dirname, '../../student')))
app.use('/teacher',     express.static(path.join(__dirname, '../../teacher')))
app.use('/super_admin', express.static(path.join(__dirname, '../../super_admin')))
app.use('/css',         express.static(path.join(__dirname, '../../css')))

// Root redirect — change to whichever role you want as default
app.get('/', (req, res) => {
    res.redirect('/student/student_login.html')
})
app.get('/admin', (req, res) => {
    res.redirect('/admin/admin_login.html')
})
app.get('/guard', (req, res) => {
    res.redirect('/guard/guard_login.html')
})
app.get('/super_admin', (req, res) => {
    res.redirect('/super_admin/super_admin_login.html')
})
app.get('/teacher', (req, res) => {
    res.redirect('/teacher/teacher_login.html')
})

const services = require('./services')

// ============================================================
// PUBLIC — Maintenance status (no auth needed)
// ============================================================
app.get('/api/v1/system/maintenance', async (req, res) => {
    try {
        const value = await services.getSystemSetting('maintenance_mode')
        res.json({ ok: true, maintenance: value === '1' })
    } catch (_) {
        res.json({ ok: true, maintenance: false })
    }
})

// ============================================================
// MAINTENANCE MIDDLEWARE — blocks all non-super-admin routes
// ============================================================
app.use(async (req, res, next) => {
    if (req.path.startsWith('/api/v1/super_admin') ||
        req.path.startsWith('/api/v1/authentication') ||
        req.path.startsWith('/api/v1/system')) {
        return next()
    }
    try {
        const value = await services.getSystemSetting('maintenance_mode')
        if (value === '1') {
            return res.status(503).json({
                ok: false,
                maintenance: true,
                message: 'The system is currently under maintenance. Please try again later.'
            })
        }
    } catch (_) { /* if DB fails, allow through */ }
    next()
})

// API Routes
app.use('/api/v1/authentication', auth)
app.use('/api/v1/students', student)
app.use('/api/v1/teacher', teacher)
app.use('/api/v1/programs', programs)
app.use('/api/v1/admin', admin)
app.use('/api/v1/guard', guard)
app.use('/api/v1/super_admin', superAdmin)


app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`)
})