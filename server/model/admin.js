const express = require('express')
const services = require('../controller/services')
const multer  = require('multer')
const path    = require('path')
const admin = express.Router()

// ── Message file upload (100 MB limit) ──────────────────────
const msgStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        const dir = path.join(__dirname, '../../uploads/message_files/')
        require('fs').mkdirSync(dir, { recursive: true })
        cb(null, dir)
    },
    filename: (req, file, cb) => {
        const ext  = path.extname(file.originalname)
        const base = path.basename(file.originalname, ext).replace(/[^a-zA-Z0-9_-]/g, '_').substring(0, 50)
        cb(null, `msg_${Date.now()}_${base}${ext}`)
    }
})
const uploadMsgFile = multer({
    storage: msgStorage,
    limits: { fileSize: 100 * 1024 * 1024 } // 100 MB
})


admin.use(express.json())

// Multer — Admin Profile Picture
const adminPicStorage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, path.join(__dirname, '../../uploads/profile_pictures/')),
    filename:    (req, file, cb) => cb(null, 'admin-' + Date.now() + '-' + Math.round(Math.random() * 1e6) + path.extname(file.originalname))
})
const uploadAdminPic = multer({
    storage: adminPicStorage,
    limits: { fileSize: 10 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
        const allowed = /jpeg|jpg|png|webp/;
        cb(null, allowed.test(path.extname(file.originalname).toLowerCase()) && allowed.test(file.mimetype));
    }
})

// Debugging API
admin.get('/', (req, res) => {
    res.send('ADMIN API Working!')
})

// Get all campus accounts
admin.get('/get_whole_campus_accounts_count/:table', async (req, res) => {
    const tableName = req.params.table
    try {
        const result = await services.getWholeCampusAccounts(tableName)
        res.json({ ok: true, message: 'Successfully retrieved data!', contents: result })
    } catch(err){
        res.status(500).json({ ok: false, message: err })
    }
})

// Add Program
admin.post('/add_program', async (req, res) => {
    try {
        const { programName } = req.body;

        if (!programName) {
            return res.status(400).json({ ok: false, message: 'Program name is required.' });
        }

        const tok = services.verifyToken(services.removeBearer(req.headers['authorization'] || '')) || {}
        const message = await services.addProgram(programName);
        services.writeActivityLog(tok.admin_id, tok.admin_name, 'admin', 'ADD_PROGRAM', 'Program', null, programName, `Added program: ${programName}`, req.ip, req.body?.device_info || req.headers['x-device-info'] || req.headers['user-agent'])

        res.status(201).json({ 
            ok: true, 
            message: message 
        }, req.ip, req.body?.device_info || req.headers['x-device-info'] || req.headers['user-agent']);

    } catch (err) {
        console.error(err);
        
        // Handle "Program already exists!" specifically
        if (err === 'Program already exists!' || err.message === 'Program already exists!') {
            return res.status(409).json({ ok: false, message: err });
        }

        res.status(500).json({ ok: false, message: 'Internal Server Error' });
    }
})

// Delete Program
admin.delete('/delete_program/:id', async (req, res) => {
    const programId = req.params.id;

    try {
        const tok = services.verifyToken(services.removeBearer(req.headers['authorization'] || '')) || {}
        // Lookup program name before deleting so the log shows the name not the ID
        let programName = `Program ID: ${programId}`
        try {
            const programs = await services.getAllPrograms()
            const found = programs.find(p => String(p.program_id) === String(programId))
            if (found) programName = found.program_name
        } catch (_) {}
        // Call the service function
        const result = await services.deleteProgram(programId);
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ ok: false, message: 'Program not found.' });
        }

        services.writeActivityLog(tok.admin_id, tok.admin_name, 'admin', 'DELETE_PROGRAM', 'Program', null, programName, `Deleted program: ${programName}`, req.ip, req.body?.device_info || req.headers['x-device-info'] || req.headers['user-agent'])
        res.json({ ok: true, message: 'Program deleted successfully.' });

    } catch (err) {
        console.error(err);
        // Check for foreign key constraint (e.g. can't delete program if students are using it)
        if (err.code === 'ER_ROW_IS_REFERENCED_2') {
             return res.status(400).json({ ok: false, message: 'Cannot delete: Students are currently enrolled in this program.' });
        }
        res.status(500).json({ ok: false, message: 'Internal Server Error' });
    }
});

// Set Event Route
admin.post('/set_event', async (req, res) => {
    const { event_name } = req.body
    try {
        const token = services.removeBearer(req.headers['authorization'])
        const decodedToken = services.verifyToken(token)
        if (!decodedToken) return res.status(401).json({ ok: false, message: 'Invalid or expired token.' })
        const result = await services.setEventName(event_name, decodedToken.admin_id)
        services.writeActivityLog(decodedToken.admin_id, decodedToken.admin_name, 'admin', 'SET_EVENT', 'Event', null, event_name, `Set event name to: ${event_name}`, req.ip, req.body?.device_info || req.headers['x-device-info'] || req.headers['user-agent'])
        res.json({ ok: true, message: result })
    } catch(err) {
        res.status(500).json({ ok: false, message: err })
    }
})

// Get Active Event Name
admin.get('/get_active_event', async (req, res) => {
    try {
        const token = services.removeBearer(req.headers['authorization'])
        const decodedToken = services.verifyToken(token)
        if (!decodedToken) return res.status(401).json({ ok: false, message: 'Invalid or expired token.' })
        const result = await services.getActiveEventName(decodedToken.admin_id)
        res.json({ ok: true, content: result })
    } catch(err) {
        console.error('[get_active_event]', err)
        res.status(500).json({ ok: false, message: err.message || String(err) })
    }
})

// Get Events Record
admin.get('/get_events', async (req, res) => {
    try {
        const token = services.removeBearer(req.headers['authorization'])
        const decodedToken = services.verifyToken(token)
        if (!decodedToken) return res.status(401).json({ ok: false, message: 'Invalid or expired token.' })
        const result = await services.getAttendanceEventRecords(decodedToken.admin_id)
        res.json({ ok: true, message: 'Successfully retrieved data!', content: result })
    } catch(err) {
        res.status(500).json({ ok: false, message: err })
    }
})

// Get Events Record
admin.get('/get_events_history', async (req, res) => {
    try {
        const token = services.removeBearer(req.headers['authorization'])
        const decodedToken = services.verifyToken(token)
        if (!decodedToken) return res.status(401).json({ ok: false, message: 'Invalid or expired token.' })
        const result = await services.getAttendanceEventHistoryRecords()
        res.json({ ok: true, message: 'Successfully retrieved data!', content: result })
    } catch(err) {
        res.status(500).json({ ok: false, message: err })
    }
})

// Get Admin data
admin.get('/get_admin_data', async (req, res) => {
    try {
        const token = services.removeBearer(req.headers['authorization'])
        const decodedToken = services.verifyToken(token)
        if (!decodedToken) return res.status(401).json({ ok: false, message: 'Invalid or expired token.' })
        const result = await services.getAdminData(decodedToken.admin_id)
        res.json({ ok: true, message: 'Successfully retrieved data!', content: result })
    } catch(err) {
        res.status(500).json({ ok: false, message: err })
    }
})

admin.post('/admin_change_name', async (req, res) => {
    const { newName } = req.body
    try {
        const token = services.removeBearer(req.headers['authorization'])
        const decodedToken = services.verifyToken(token)
        if (!decodedToken) return res.status(401).json({ ok: false, message: 'Invalid or expired token.' })
        const result = await services.changeAdminName(newName, decodedToken.admin_id)
        services.updateMessagesName(decodedToken.admin_id, 'admin', newName).catch(() => {})
        services.writeActivityLog(decodedToken.admin_id, newName, 'admin', 'CHANGE_NAME', 'Admin', decodedToken.admin_id, newName, `Changed name to: ${newName}`, req.ip, req.body?.device_info || req.headers['x-device-info'] || req.headers['user-agent'])
        res.json({ ok: true, message: result.message })
    } catch(err) {
        res.status(500).json({ ok: false, message: err })
    }
})

// Admin change password
admin.put('/admin_change_password', async (req, res) => {
    const { current_password, new_password } = req.body
    try {
        const token = services.removeBearer(req.headers['authorization'])
        const decodedToken = services.verifyToken(token)
        if (!decodedToken) return res.status(401).json({ ok: false, message: 'Invalid or expired token.' })
        const result = await services.updateAdminPassword(decodedToken.admin_id, current_password, new_password)
        services.writeActivityLog(decodedToken.admin_id, decodedToken.admin_name, 'admin', 'CHANGE_PASSWORD', 'Admin', decodedToken.admin_id, null, 'Admin changed their password', req.ip, req.body?.device_info || req.headers['x-device-info'] || req.headers['user-agent'])
        res.json(result)
    } catch(err) {
        if(err.status_code === 401) {
            res.status(err.status_code).json(err)
        } else if(err.status_code === 500) {
            res.status(err.status_code).json(err)
        } else {
            res.status(409).json(err)
        }
    }
})

// Admin reset student password
admin.put('/reset_student_password/:id', async (req, res) => {
    const { new_password } = req.body;
    if (!new_password || new_password.length < 6)
        return res.status(400).json({ ok: false, message: 'Password must be at least 6 characters.' });
    try {
        const token = services.removeBearer(req.headers['authorization']);
        const decodedToken = services.verifyToken(token);
        if (!decodedToken) return res.status(401).json({ ok: false, message: 'Unauthorized' });
        const bcrypt = require('bcrypt');
        const hashed = await bcrypt.hash(new_password, 10);
        await new Promise((resolve, reject) => {
            const db = require('../configuration/db');
            db.execute('UPDATE student_accounts SET password = ? WHERE student_id = ?', [hashed, req.params.id],
                (err, result) => {
                    if (err) return reject(err);
                    if (result.affectedRows === 0) return reject(new Error('Student not found.'));
                    resolve();
                });
        });
        services.writeActivityLog(decodedToken.admin_id, decodedToken.admin_name, 'admin', 'RESET_STUDENT_PASSWORD', 'Student', req.params.id, null, `Reset password for student ID: ${req.params.id}`, req.ip, req.body?.device_info || req.headers['x-device-info'] || req.headers['user-agent']);
        res.json({ ok: true, message: 'Student password reset successfully.' });
    } catch (err) {
        res.status(500).json({ ok: false, message: err.message || err });
    }
});

// Admin reset teacher password
admin.put('/reset_teacher_password/:id', async (req, res) => {
    const { new_password } = req.body;
    if (!new_password || new_password.length < 6)
        return res.status(400).json({ ok: false, message: 'Password must be at least 6 characters.' });
    try {
        const token = services.removeBearer(req.headers['authorization']);
        const decodedToken = services.verifyToken(token);
        if (!decodedToken) return res.status(401).json({ ok: false, message: 'Unauthorized' });
        const bcrypt = require('bcrypt');
        const hashed = await bcrypt.hash(new_password, 10);
        await new Promise((resolve, reject) => {
            const db = require('../configuration/db');
            db.execute('UPDATE teacher SET teacher_password = ? WHERE teacher_id = ?', [hashed, req.params.id],
                (err, result) => {
                    if (err) return reject(err);
                    if (result.affectedRows === 0) return reject(new Error('Teacher not found.'));
                    resolve();
                });
        });
        services.writeActivityLog(decodedToken.admin_id, decodedToken.admin_name, 'admin', 'RESET_TEACHER_PASSWORD', 'Teacher', req.params.id, null, `Reset password for teacher ID: ${req.params.id}`, req.ip, req.body?.device_info || req.headers['x-device-info'] || req.headers['user-agent']);
        res.json({ ok: true, message: 'Teacher password reset successfully.' });
    } catch (err) {
        res.status(500).json({ ok: false, message: err.message || err });
    }
});

// Admin reset guard password
admin.put('/reset_guard_password/:id', async (req, res) => {
    const { new_password } = req.body;
    if (!new_password || new_password.length < 6)
        return res.status(400).json({ ok: false, message: 'Password must be at least 6 characters.' });
    try {
        const token = services.removeBearer(req.headers['authorization']);
        const decodedToken = services.verifyToken(token);
        if (!decodedToken) return res.status(401).json({ ok: false, message: 'Unauthorized' });
        const bcrypt = require('bcrypt');
        const hashed = await bcrypt.hash(new_password, 10);
        await new Promise((resolve, reject) => {
            const db = require('../configuration/db');
            db.execute('UPDATE guards SET guard_password = ? WHERE guard_id = ?', [hashed, req.params.id],
                (err, result) => {
                    if (err) return reject(err);
                    if (result.affectedRows === 0) return reject(new Error('Guard not found.'));
                    resolve();
                });
        });
        services.writeActivityLog(decodedToken.admin_id, decodedToken.admin_name, 'admin', 'RESET_GUARD_PASSWORD', 'Guard', req.params.id, null, `Reset password for guard ID: ${req.params.id}`, req.ip, req.body?.device_info || req.headers['x-device-info'] || req.headers['user-agent']);
        res.json({ ok: true, message: 'Guard password reset successfully.' });
    } catch (err) {
        res.status(500).json({ ok: false, message: err.message || err });
    }
});

// Admin delete student account
admin.delete('/delete_student_account/:id', async (req, res) => {
    const id = req.params.id;
    try {
        const token = services.removeBearer(req.headers['authorization'])
        const decodedToken = services.verifyToken(token)
        if (!decodedToken) return res.status(401).json({ ok: false, message: 'Invalid or expired token.' })
        if(decodedToken === null) { return res.status(401).json({ ok: false, message: 'Invalid token or no token provided!' }) }
        // Lookup student name before deleting so the log shows the name not the ID
        let studentName = `Student ID: ${id}`
        try {
            const allStudents = await services.getWholeCampusAccounts('student_accounts')
            const found = allStudents.find(s => String(s.student_id) === String(id))
            if (found) studentName = `${found.student_firstname} ${found.student_lastname}`
        } catch (_) {}
        const result = await services.adminDeleteStudents(id)
        services.writeActivityLog(decodedToken.admin_id, decodedToken.admin_name, 'admin', 'DELETE_STUDENT', 'Student', null, studentName, `Deleted student: ${studentName}`, req.ip, req.body?.device_info || req.headers['x-device-info'] || req.headers['user-agent'])
        res.json(result)
    } catch(err) {
        if(err.status_code === 401) {
            res.status(err.status_code).json(err)
        } else if(err.status_code === 500) {
            res.status(err.status_code).json(err)
        } else {
            res.status(409).json(err)
        }
    }
})

// Admin delete teacher account
admin.delete('/delete_teacher_account/:id', async (req, res) => {
    const id = req.params.id;
    try {
        const token = services.removeBearer(req.headers['authorization'])
        const decodedToken = services.verifyToken(token)
        if (!decodedToken) return res.status(401).json({ ok: false, message: 'Invalid or expired token.' })
        if(decodedToken === null) { return res.status(401).json({ ok: false, message: 'Invalid token or no token provided!' }) }
        // Lookup teacher name before deleting
        let teacherName = `Teacher ID: ${id}`
        try {
            const allTeachers = await services.getWholeCampusAccounts('teacher')
            const found = allTeachers.find(t => String(t.teacher_id) === String(id))
            if (found) teacherName = found.teacher_name
        } catch (_) {}
        const result = await services.adminDeleteTeacher(id, decodedToken.admin_id)
        services.writeActivityLog(decodedToken.admin_id, decodedToken.admin_name, 'admin', 'DELETE_TEACHER', 'Teacher', null, teacherName, `Deleted teacher: ${teacherName}`, req.ip, req.body?.device_info || req.headers['x-device-info'] || req.headers['user-agent'])
        res.json(result)
    } catch(err) {
        if(err.status_code === 401) {
            res.status(err.status_code).json(err)
        } else if(err.status_code === 500) {
            res.status(err.status_code).json(err)
        } else {
            res.status(409).json(err)
        }
    }
})

// Admin get present programs count
admin.get('/present_program_counts', async (req, res) => {
    try {
        const token = services.removeBearer(req.headers['authorization'])
        const decodedToken = services.verifyToken(token)
        if (!decodedToken) return res.status(401).json({ ok: false, message: 'Invalid or expired token.' })
        if(decodedToken === null) { return res.status(401).json({ ok: false, message: 'Invalid token or no token provided!' }) }
        const result = await services.getPresentPrograms()
        res.json(result)
    } catch(err) {
        if(err.status_code === 401) {
            res.status(err.status_code).json(err)
        } else if(err.status_code === 500) {
            res.status(err.status_code).json(err)
        } else {
            res.status(409).json(err)
        }
    }
})

// Admin delete teacher account
admin.delete('/delete_guard_account/:id', async (req, res) => {
    const id = req.params.id;
    try {
        const token = services.removeBearer(req.headers['authorization'])
        const decodedToken = services.verifyToken(token)
        if (!decodedToken) return res.status(401).json({ ok: false, message: 'Invalid or expired token.' })
        if(decodedToken === null) { return res.status(401).json({ ok: false, message: 'Invalid token or no token provided!' }) }
        // Lookup guard name before deleting
        let guardName = `Guard ID: ${id}`
        try {
            const allGuards = await services.getWholeCampusAccounts('guards')
            const found = allGuards.find(g => String(g.guard_id) === String(id))
            if (found) guardName = found.guard_name
        } catch (_) {}
        const result = await services.adminDeleteGuard(id, decodedToken.admin_id)
        services.writeActivityLog(decodedToken.admin_id, decodedToken.admin_name, 'admin', 'DELETE_GUARD', 'Guard', null, guardName, `Deleted guard: ${guardName}`, req.ip, req.body?.device_info || req.headers['x-device-info'] || req.headers['user-agent'])
        res.json(result)
    } catch(err) {
        if(err.status_code === 401) {
            res.status(err.status_code).json(err)
        } else if(err.status_code === 500) {
            res.status(err.status_code).json(err)
        } else {
            res.status(409).json(err)
        }
    }
})

// Admin edit student account
admin.put('/edit_student_account/:id', async (req, res) => {
    const id = req.params.id;
    const { 
        id_number, 
        firstname, 
        middlename, 
        lastname, 
        program, 
        year_level,
        email,
        guardian_number
    } = req.body;

    try {
        const token = services.removeBearer(req.headers['authorization']);
        const decodedToken = services.verifyToken(token);
        if (!decodedToken) return res.status(401).json({ ok: false, message: 'Invalid or expired token.' })
        
        if (decodedToken === null) { 
            return res.status(401).json({ ok: false, message: 'Invalid token or no token provided!' }); 
        }
        
        const result = await services.adminEditStudentAccounts(
            id, 
            id_number, 
            firstname, 
            middlename, 
            lastname, 
            program, 
            year_level,
            email,
            guardian_number
        );
        if (result.ok !== false) services.writeActivityLog(decodedToken.admin_id, decodedToken.admin_name, 'admin', 'EDIT_STUDENT', 'Student', null, `${firstname} ${lastname}`, `Edited student: ${firstname} ${lastname} — ${program} ${year_level}`, req.ip, req.body?.device_info || req.headers['x-device-info'] || req.headers['user-agent'])
        res.json(result);
    } catch (err) {
        if (err.status_code === 401) {
            res.status(err.status_code).json(err);
        } else if (err.status_code === 500) {
            res.status(err.status_code).json(err);
        } else {
            res.status(409).json(err);
        }
    }
});


// Admin edit teacher account
admin.put('/edit_teacher_account/:id', async (req, res) => {
    const id = req.params.id;
    const { 
        teacher_name,
        teacher_email,
        teacher_program, 
    } = req.body;

    try {
        const token = services.removeBearer(req.headers['authorization']);
        const decodedToken = services.verifyToken(token);
        if (!decodedToken) return res.status(401).json({ ok: false, message: 'Invalid or expired token.' })
        
        if (decodedToken === null) { 
            return res.status(401).json({ ok: false, message: 'Invalid token or no token provided!' }); 
        }
        
        const result = await services.adminEditTeacherAccounts(
            id, 
            teacher_name, 
            teacher_email, 
            teacher_program,
            decodedToken.admin_id
        );
        services.writeActivityLog(decodedToken.admin_id, decodedToken.admin_name, 'admin', 'EDIT_TEACHER', 'Teacher', null, teacher_name, `Edited teacher: ${teacher_name} — ${teacher_email}`, req.ip, req.body?.device_info || req.headers['x-device-info'] || req.headers['user-agent'])
        res.json(result);
    } catch (err) {
        if (err.status_code === 401) {
            res.status(err.status_code).json(err);
        } else if (err.status_code === 500) {
            res.status(err.status_code).json(err);
        } else {
            res.status(409).json(err);
        }
    }
});

// Admin edit teacher account
admin.put('/edit_guard_account/:id', async (req, res) => {
    const id = req.params.id;
    const { 
        guard_name,
        guard_email,
        guard_designated_location, 
    } = req.body;

    try {
        const token = services.removeBearer(req.headers['authorization']);
        const decodedToken = services.verifyToken(token);
        if (!decodedToken) return res.status(401).json({ ok: false, message: 'Invalid or expired token.' })
        
        if (decodedToken === null) { 
            return res.status(401).json({ ok: false, message: 'Invalid token or no token provided!' }); 
        }
        
        const result = await services.adminEditGuardAccounts(
            id, 
            guard_name, 
            guard_email, 
            guard_designated_location,
            decodedToken.admin_id
        );
        services.writeActivityLog(decodedToken.admin_id, decodedToken.admin_name, 'admin', 'EDIT_GUARD', 'Guard', null, guard_name, `Edited guard: ${guard_name} — location: ${guard_designated_location}`, req.ip, req.body?.device_info || req.headers['x-device-info'] || req.headers['user-agent'])
        res.json(result);
    } catch (err) {
        if (err.status_code === 401) {
            res.status(err.status_code).json(err);
        } else if (err.status_code === 500) {
            res.status(err.status_code).json(err);
        } else {
            res.status(409).json(err);
        }
    }
});


// Get Year Levels
admin.get('/get_year_levels', async (req, res) => {
    try {
        const result = await services.getYearLevels()
        res.json({ ok: true, message: 'Successfully retrieved year levels!', content: result })
    } catch (err) {
        res.status(500).json({ ok: false, message: err.message || err })
    }
})

// Add Year Level
admin.post('/add_year_level', async (req, res) => {
    const { yearLevelName } = req.body
    if (!yearLevelName) return res.status(400).json({ ok: false, message: 'Year level name is required.' })
    try {
        const token = services.removeBearer(req.headers['authorization'])
        const tokData = services.verifyToken(token) || {}
        const result = await services.addYearLevel(yearLevelName)
        services.writeActivityLog(tokData.admin_id, tokData.admin_name, 'admin', 'ADD_YEAR_LEVEL', 'Year Level', null, yearLevelName, `Added year level: ${yearLevelName}`, req.ip, req.body?.device_info || req.headers['x-device-info'] || req.headers['user-agent'])
        res.status(201).json({ ok: true, message: result })
    } catch (err) {
        res.status(400).json({ ok: false, message: err.message || err })
    }
})

// Delete Year Level
admin.delete('/delete_year_level/:id', async (req, res) => {
    const id = req.params.id
    try {
        const token = services.removeBearer(req.headers['authorization'])
        const tokData = services.verifyToken(token) || {}
        // Lookup year level name before deleting
        let yearLevelName = `Year Level ID: ${id}`
        try {
            const levels = await services.getYearLevels()
            const found = levels.find(y => String(y.year_level_id) === String(id))
            if (found) yearLevelName = found.year_level_name
        } catch (_) {}
        const result = await services.deleteYearLevel(id)
        services.writeActivityLog(tokData.admin_id, tokData.admin_name, 'admin', 'DELETE_YEAR_LEVEL', 'Year Level', null, yearLevelName, `Deleted year level: ${yearLevelName}`, req.ip, req.body?.device_info || req.headers['x-device-info'] || req.headers['user-agent'])
        res.json({ ok: true, message: result })
    } catch (err) {
        res.status(400).json({ ok: false, message: err.message || err })
    }
})

// Admin Forgot Password — Request OTP
admin.post('/forgot_password/request_otp', async (req, res) => {
    const { email } = req.body;
    if (!email) return res.status(400).json({ ok: false, message: 'Email is required.' });
    try {
        const result = await services.sendAdminPasswordResetOTP(email);
        res.json({ ok: true, message: result });
    } catch (err) {
        res.status(400).json({ ok: false, message: err.message || err });
    }
});

// Admin Forgot Password — Verify OTP
admin.post('/forgot_password/verify_otp', async (req, res) => {
    const { email, otp } = req.body;
    if (!email || !otp) return res.status(400).json({ ok: false, message: 'Email and OTP are required.' });
    try {
        services.verifyAdminPasswordResetOTP(email, otp);
        res.json({ ok: true, message: 'OTP verified successfully.' });
    } catch (err) {
        res.status(400).json({ ok: false, message: err.message || err });
    }
});

// Admin Forgot Password — Reset Password
admin.post('/forgot_password/reset_password', async (req, res) => {
    const { email, new_password, confirm_password } = req.body;
    if (!email || !new_password || !confirm_password)
        return res.status(400).json({ ok: false, message: 'All fields are required.' });
    if (new_password !== confirm_password)
        return res.status(400).json({ ok: false, message: 'Passwords do not match.' });
    if (new_password.length < 6)
        return res.status(400).json({ ok: false, message: 'Password must be at least 6 characters.' });
    try {
        const result = await services.resetAdminPasswordWithOTP(email, new_password);
        res.json({ ok: true, message: result });
    } catch (err) {
        res.status(400).json({ ok: false, message: err.message || err });
    }
});

// Upload Admin Profile Picture
admin.post('/upload_profile_picture', uploadAdminPic.single('admin_profile_picture'), async (req, res) => {
    if (!req.file) return res.status(400).json({ ok: false, message: 'No file uploaded.' })
    try {
        const token = services.removeBearer(req.headers['authorization'])
        const decodedToken = services.verifyToken(token)
        if (!decodedToken) return res.status(401).json({ ok: false, message: 'Invalid or expired token.' })
        const filename = await services.updateAdminProfilePicture(decodedToken.admin_id, req.file.filename)
        res.json({ ok: true, message: 'Profile picture updated!', filename })
    } catch (err) {
        res.status(500).json({ ok: false, message: err.message || String(err) })
    }
})

// Export route
// Admin reset student device binding
admin.put('/reset_student_device/:id', async (req, res) => {
    const studentId = req.params.id
    try {
        const token = services.removeBearer(req.headers['authorization'])
        const decodedToken = services.verifyToken(token)
        if (!decodedToken) return res.status(401).json({ ok: false, message: 'Invalid or expired token.' })
        if (decodedToken === null) return res.status(401).json({ ok: false, message: 'Invalid token or no token provided!' })

        // Lookup student name for the activity log
        let studentName = `Student ID: ${studentId}`
        try {
            const allStudents = await services.getWholeCampusAccounts('student_accounts')
            const found = allStudents.find(s => String(s.student_id) === String(studentId))
            if (found) studentName = `${found.student_firstname} ${found.student_lastname}`
        } catch (_) {}

        await services.adminResetStudentDevice(studentId)
        services.writeActivityLog(decodedToken.admin_id, decodedToken.admin_name, 'admin', 'RESET_STUDENT_DEVICE', 'Student', studentId, studentName, `Device binding reset for: ${studentName}`, req.ip, req.body?.device_info || req.headers['x-device-info'] || req.headers['user-agent'])
        res.json({ ok: true, message: `Device binding reset for ${studentName}. They can now log in from a new device.` })
    } catch (err) {
        res.status(500).json({ ok: false, message: err.message || 'Failed to reset device binding.' })
    }
})


// Logout
admin.post('/logout', async (req, res) => {
    try {
        const token = services.removeBearer(req.headers['authorization']);
        const decoded = services.verifyToken(token);
        // FIX: blacklist the token so it cannot be reused after logout
        services.blacklistToken(token)
        if (decoded) services.writeLogoutLog(decoded.admin_id, decoded.admin_name, decoded.admin_email, 'admin', req.ip, req.body?.device_info || req.headers['x-device-info'] || req.headers['user-agent']);
        res.json({ ok: true });
    } catch (_) { res.json({ ok: true }); }
})

module.exports = admin
// ── Notifications ──────────────────────────────────────────────
admin.get('/notifications', async (req, res) => {
    try {
        const rows  = await services.getNotifications('admin', req.query.limit || 50);
        const count = await services.getUnreadCount('admin');
        res.json({ ok: true, content: rows, unread: count });
    } catch (err) { res.status(500).json({ ok: false, message: err.message }); }
});

admin.post('/notifications/read', async (req, res) => {
    try {
        await services.markNotificationsRead('admin', req.body.ids || []);
        res.json({ ok: true });
    } catch (err) { res.status(500).json({ ok: false, message: err.message }); }
});

// ── Messaging ──────────────────────────────────────────────
admin.get('/messages/contacts', async (req, res) => {
    try {
        const tok = services.verifyToken(services.removeBearer(req.headers['authorization']))
        if (!tok) return res.status(401).json({ ok: false })
        const contacts = await services.getMessageContacts(tok.admin_id, 'admin')
        const unread   = await services.getUnreadMessageCount(tok.admin_id, 'admin')
        res.json({ ok: true, contacts, unread })
    } catch (err) { res.status(500).json({ ok: false, message: err.message }) }
})

admin.get('/messages/conversation', async (req, res) => {
    try {
        const tok = services.verifyToken(services.removeBearer(req.headers['authorization']))
        if (!tok) return res.status(401).json({ ok: false })
        const { contact_id, contact_role } = req.query
        await services.markMessagesRead(tok.admin_id, 'admin', parseInt(contact_id), contact_role)
        const messages = await services.getConversation(tok.admin_id, 'admin', parseInt(contact_id), contact_role, 100)
        res.json({ ok: true, messages })
    } catch (err) { res.status(500).json({ ok: false, message: err.message }) }
})

admin.post('/messages/send', uploadMsgFile.single('file'), async (req, res) => {
    try {
        const tok = services.verifyToken(services.removeBearer(req.headers['authorization']))
        if (!tok) return res.status(401).json({ ok: false })
        const { receiver_id, receiver_role, receiver_name, content } = req.body
        if (!content?.trim() && !req.file) return res.status(400).json({ ok: false, message: 'Message cannot be empty.' })
        const senderName = tok.admin_name || 'admin'
        const fileUrl  = req.file ? `/api/v1/uploads/message_files/${req.file.filename}` : null
        const fileName = req.file ? req.file.originalname : null
        const fileType = req.file ? req.file.mimetype : null
        // Fetch profile pictures for sender and receiver
        const getSenderPic = () => new Promise(r => {
            const picMap = { student:'student_profile_picture FROM student_accounts WHERE student_id', teacher:'teacher_profile_picture FROM teacher WHERE teacher_id', admin:'admin_profile_picture FROM admin_accounts WHERE admin_id', super_admin:'super_admin_profile_picture FROM super_admin_accounts WHERE super_admin_id', guard:null }
            const col = picMap['admin']
            if (!col) return r(null)
            require('../configuration/db').execute(`SELECT ${col} = ? LIMIT 1`, [tok.admin_id], (e,rows) => r(rows?.[0]?.[Object.keys(rows[0])[0]] || null))
        })
        const getReceiverPic = () => new Promise(r => {
            const picCols = { student:'student_profile_picture FROM student_accounts WHERE student_id', teacher:'teacher_profile_picture FROM teacher WHERE teacher_id', admin:'admin_profile_picture FROM admin_accounts WHERE admin_id', super_admin:'super_admin_profile_picture FROM super_admin_accounts WHERE super_admin_id', guard:null }
            const col = picCols[receiver_role]
            if (!col) return r(null)
            require('../configuration/db').execute(`SELECT ${col} = ? LIMIT 1`, [receiver_id], (e,rows) => r(rows?.[0]?.[Object.keys(rows[0])[0]] || null))
        })
        const [senderPic, receiverPic] = await Promise.all([getSenderPic(), getReceiverPic()])
        const replyToId = req.body.reply_to_id ? parseInt(req.body.reply_to_id) : null
        const id = await services.sendMessage(tok.admin_id, 'admin', senderName, receiver_id, receiver_role, receiver_name, content?.trim() || null, fileUrl, fileName, fileType, senderPic, receiverPic, replyToId)
        res.json({ ok: true, id })
        // Notify receiver via bell
        services.createMsgNotification(
                parseInt(receiver_id), receiver_role,
                tok.admin_id, 'admin', tok.admin_name || 'admin',
                req.file ? 'file' : 'message',
                content?.trim() || (req.file ? req.file.originalname : null),
                null, id
        ).catch(() => {})
    } catch (err) { res.status(500).json({ ok: false, message: err.message }) }
})

admin.post('/messages/typing', (req, res) => {
    try {
        const tok = services.verifyToken(services.removeBearer(req.headers['authorization']))
        if (!tok) return res.status(401).json({ ok: false })
        const { contact_id, contact_role } = req.body
        services.setTypingStatus(tok.admin_id, 'admin', contact_id, contact_role)
        res.json({ ok: true })
    } catch(err) { res.status(500).json({ ok: false }) }
})

admin.get('/messages/typing', (req, res) => {
    try {
        const tok = services.verifyToken(services.removeBearer(req.headers['authorization']))
        if (!tok) return res.status(401).json({ ok: false })
        const { contact_id, contact_role } = req.query
        const isTyping = services.getTypingStatus(parseInt(contact_id), contact_role, tok.admin_id, 'admin')
        res.json({ ok: true, typing: isTyping })
    } catch(err) { res.status(500).json({ ok: false, typing: false }) }
})

admin.get('/messages/search', async (req, res) => {
    try {
        const tok = services.verifyToken(services.removeBearer(req.headers['authorization']))
        if (!tok) return res.status(401).json({ ok: false })
        const users = await services.searchUsersForMessaging(req.query.q || '', tok.admin_id, 'admin')
        res.json({ ok: true, users })
    } catch (err) { res.status(500).json({ ok: false, message: err.message }) }
})

// ── Message actions ──────────────────────────────────────────
admin.delete('/messages/delete-for-me/:id', async (req, res) => {
    try {
        const tok = services.verifyToken(services.removeBearer(req.headers['authorization']))
        if (!tok) return res.status(401).json({ ok: false })
        await services.deleteMessageForMe(parseInt(req.params.id), tok.admin_id, 'admin')
        res.json({ ok: true })
    } catch (err) { res.status(500).json({ ok: false, message: err.message }) }
})

admin.delete('/messages/unsend/:id', async (req, res) => {
    try {
        const tok = services.verifyToken(services.removeBearer(req.headers['authorization']))
        if (!tok) return res.status(401).json({ ok: false })
        await services.unsendMessage(parseInt(req.params.id), tok.admin_id, 'admin')
        res.json({ ok: true })
    } catch (err) { res.status(500).json({ ok: false, message: err.message }) }
})



// GET /messages/notifications
admin.get('/messages/notifications', async (req, res) => {
    try {
        const tok = services.verifyToken(services.removeBearer(req.headers['authorization']))
        if (!tok) return res.status(401).json({ ok: false })
        services.cleanOldMsgNotifications()
        const notifs = await services.getMsgNotifications(tok.admin_id, 'admin', parseInt(req.query.limit) || 30)
        const unread = await services.getUnreadMsgNotifCount(tok.admin_id, 'admin')
        res.json({ ok: true, notifications: notifs, unread })
    } catch(err) { res.status(500).json({ ok: false, message: err.message }) }
})


// DELETE /messages/notifications/:id
admin.delete('/messages/notifications/:id', async (req, res) => {
    try {
        const tok = services.verifyToken(services.removeBearer(req.headers['authorization']))
        if (!tok) return res.status(401).json({ ok: false })
        await services.deleteMsgNotification(parseInt(req.params.id), tok.admin_id, 'admin')
        res.json({ ok: true })
    } catch(err) { res.status(500).json({ ok: false, message: err.message }) }
})

// POST /messages/notifications/read
admin.post('/messages/notifications/read', async (req, res) => {
    try {
        const tok = services.verifyToken(services.removeBearer(req.headers['authorization']))
        if (!tok) return res.status(401).json({ ok: false })
        const ids = req.body.ids || []
        await services.markMsgNotificationsRead(tok.admin_id, 'admin', ids)
        res.json({ ok: true })
    } catch(err) { res.status(500).json({ ok: false, message: err.message }) }
})

// GET /messages/reaction-notifications
admin.get('/messages/reaction-notifications', async (req, res) => {
    try {
        const tok = services.verifyToken(services.removeBearer(req.headers['authorization']))
        if (!tok) return res.status(401).json({ ok: false })
        const after  = parseInt(req.query.after) || 0
        const isSeed = req.query.seed === '1'
        const db = require('../configuration/db')
        // Auto-clean notifications older than 24h to prevent accumulation
        db.execute(
            `DELETE FROM notifications WHERE type = 'reaction' AND created_at < DATE_SUB(NOW(), INTERVAL 24 HOUR)`,
            [], () => {}
        )
        db.execute(
            `SELECT id, type, title, message, meta, created_at FROM notifications
             WHERE type = 'reaction' AND id > ?
             AND CAST(JSON_EXTRACT(meta, '$.receiver_id') AS CHAR) = CAST(? AS CHAR)
             AND JSON_EXTRACT(meta, '$.receiver_role') = ?
             ORDER BY id DESC LIMIT ${isSeed ? 100 : 20}`,
            [after, tok.admin_id, 'admin'],
            (err, rows) => {
                if (err) return res.json({ ok: true, notifications: [] })
                const parsed = rows.map(r => ({ ...r, meta: r.meta ? (typeof r.meta === 'string' ? JSON.parse(r.meta) : r.meta) : {} }))
                services.enrichReactionNotifications(parsed).then(enriched => { res.json({ ok: true, notifications: enriched }) }).catch(() => res.json({ ok: true, notifications: parsed }))
            }
        )
    } catch(err) { res.status(500).json({ ok: false, message: err.message }) }
})

// POST /messages/react/:id
admin.post('/messages/react/:id', async (req, res) => {
    try {
        const tok = services.verifyToken(services.removeBearer(req.headers['authorization']))
        if (!tok) return res.status(401).json({ ok: false, message: 'Unauthorized.' })
        const { emoji } = req.body
        const { reactions, msg } = await services.reactToMessage(
            parseInt(req.params.id),
            tok.admin_id, 'admin',
            emoji || null
        )
        // Determine the OTHER party (not the reactor)
        // If reactor is the message sender → notify receiver, else notify sender
        const receiverId   = String(msg.sender_id) === String(tok.admin_id) && msg.sender_role === 'admin'
            ? msg.receiver_id : msg.sender_id
        const receiverRole = String(msg.sender_id) === String(tok.admin_id) && msg.sender_role === 'admin'
            ? msg.receiver_role : msg.sender_role
        // Never notify yourself and never notify super_admin via bell
        const isSelf       = String(receiverId) === String(tok.admin_id) && receiverRole === 'admin'
        // Write reaction notification for all roles including super_admin
        if (emoji && !isSelf) {
            services.createNotification(
                'reaction',
                'New Reaction',
                `${tok.admin_name || 'admin'} reacted ${emoji} to your message`,
                { reactor_id: tok.admin_id, reactor_role: 'admin', message_id: parseInt(req.params.id), receiver_id: receiverId, receiver_role: receiverRole, emoji }
            ).catch(() => {})
        }
        res.json({ ok: true, reactions })
        // Notify via bell (skip only self)
        if (emoji && !isSelf) {
            services.createMsgNotification(
                receiverId, receiverRole,
                tok.admin_id, 'admin', tok.admin_name || 'admin',
                'reaction', null, emoji, parseInt(req.params.id)
            ).catch(() => {})
        }
    } catch (err) {
        res.status(500).json({ ok: false, message: err.message })
    }
})

admin.post('/messages/pin/:id', async (req, res) => {
    try {
        const tok = services.verifyToken(services.removeBearer(req.headers['authorization']))
        if (!tok) return res.status(401).json({ ok: false })
        const msg = await services.pinMessage(parseInt(req.params.id), tok.admin_id, 'admin')
        res.json({ ok: true, message: msg })
    } catch (err) { res.status(500).json({ ok: false, message: err.message }) }
})

admin.put('/messages/edit/:id', async (req, res) => {
    try {
        const tok = services.verifyToken(services.removeBearer(req.headers['authorization']))
        if (!tok) return res.status(401).json({ ok: false })
        const { content } = req.body
        await services.editMessage(parseInt(req.params.id), tok.admin_id, 'admin', content)
        res.json({ ok: true })
    } catch (err) { res.status(500).json({ ok: false, message: err.message }) }
})