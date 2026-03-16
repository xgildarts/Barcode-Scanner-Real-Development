const express = require('express')
const services = require('../controller/services')
const multer  = require('multer')
const path    = require('path')
const admin = express.Router()

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
        services.writeActivityLog(tok.admin_id, tok.admin_name, 'admin', 'ADD_PROGRAM', 'Program', null, programName, `Added program: ${programName}`)

        res.status(201).json({ 
            ok: true, 
            message: message 
        });

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

        services.writeActivityLog(tok.admin_id, tok.admin_name, 'admin', 'DELETE_PROGRAM', 'Program', null, programName, `Deleted program: ${programName}`)
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
        const result = await services.setEventName(event_name, decodedToken.admin_id)
        services.writeActivityLog(decodedToken.admin_id, decodedToken.admin_name, 'admin', 'SET_EVENT', 'Event', null, event_name, `Set event name to: ${event_name}`)
        res.json({ ok: true, message: result })
    } catch(err) {
        res.status(500).json({ ok: false, message: err })
    }
})

// Get Events Record
admin.get('/get_events', async (req, res) => {
    try {
        const token = services.removeBearer(req.headers['authorization'])
        const decodedToken = services.verifyToken(token)
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
        const result = await services.getAttendanceEventHistoryRecords(decodedToken.admin_id)
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
        const result = await services.changeAdminName(newName, decodedToken.admin_id)
        services.writeActivityLog(decodedToken.admin_id, newName, 'admin', 'CHANGE_NAME', 'Admin', decodedToken.admin_id, newName, `Changed name to: ${newName}`)
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
        const result = await services.updateAdminPassword(decodedToken.admin_id, current_password, new_password)
        services.writeActivityLog(decodedToken.admin_id, decodedToken.admin_name, 'admin', 'CHANGE_PASSWORD', 'Admin', decodedToken.admin_id, null, 'Admin changed their password')
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

// Admin delete student account
admin.delete('/delete_student_account/:id', async (req, res) => {
    const id = req.params.id;
    try {
        const token = services.removeBearer(req.headers['authorization'])
        const decodedToken = services.verifyToken(token)
        if(decodedToken === null) { return res.status(401).json({ ok: false, message: 'Invalid token or no token provided!' }) }
        // Lookup student name before deleting so the log shows the name not the ID
        let studentName = `Student ID: ${id}`
        try {
            const allStudents = await services.getWholeCampusAccounts('student_accounts')
            const found = allStudents.find(s => String(s.student_id) === String(id))
            if (found) studentName = `${found.student_firstname} ${found.student_lastname}`
        } catch (_) {}
        const result = await services.adminDeleteStudents(id)
        services.writeActivityLog(decodedToken.admin_id, decodedToken.admin_name, 'admin', 'DELETE_STUDENT', 'Student', null, studentName, `Deleted student: ${studentName}`)
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
        if(decodedToken === null) { return res.status(401).json({ ok: false, message: 'Invalid token or no token provided!' }) }
        // Lookup teacher name before deleting
        let teacherName = `Teacher ID: ${id}`
        try {
            const allTeachers = await services.getWholeCampusAccounts('teacher')
            const found = allTeachers.find(t => String(t.teacher_id) === String(id))
            if (found) teacherName = found.teacher_name
        } catch (_) {}
        const result = await services.adminDeleteTeacher(id, decodedToken.admin_id)
        services.writeActivityLog(decodedToken.admin_id, decodedToken.admin_name, 'admin', 'DELETE_TEACHER', 'Teacher', null, teacherName, `Deleted teacher: ${teacherName}`)
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
        if(decodedToken === null) { return res.status(401).json({ ok: false, message: 'Invalid token or no token provided!' }) }
        // Lookup guard name before deleting
        let guardName = `Guard ID: ${id}`
        try {
            const allGuards = await services.getWholeCampusAccounts('guards')
            const found = allGuards.find(g => String(g.guard_id) === String(id))
            if (found) guardName = found.guard_name
        } catch (_) {}
        const result = await services.adminDeleteGuard(id, decodedToken.admin_id)
        services.writeActivityLog(decodedToken.admin_id, decodedToken.admin_name, 'admin', 'DELETE_GUARD', 'Guard', null, guardName, `Deleted guard: ${guardName}`)
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
        year_level 
    } = req.body;

    try {
        const token = services.removeBearer(req.headers['authorization']);
        const decodedToken = services.verifyToken(token);
        
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
            year_level
        );
        if (result.ok !== false) services.writeActivityLog(decodedToken.admin_id, decodedToken.admin_name, 'admin', 'EDIT_STUDENT', 'Student', null, `${firstname} ${lastname}`, `Edited student: ${firstname} ${lastname} — ${program} ${year_level}`)
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
        services.writeActivityLog(decodedToken.admin_id, decodedToken.admin_name, 'admin', 'EDIT_TEACHER', 'Teacher', null, teacher_name, `Edited teacher: ${teacher_name} — ${teacher_email}`)
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
        services.writeActivityLog(decodedToken.admin_id, decodedToken.admin_name, 'admin', 'EDIT_GUARD', 'Guard', null, guard_name, `Edited guard: ${guard_name} — location: ${guard_designated_location}`)
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
        services.writeActivityLog(tokData.admin_id, tokData.admin_name, 'admin', 'ADD_YEAR_LEVEL', 'Year Level', null, yearLevelName, `Added year level: ${yearLevelName}`)
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
        services.writeActivityLog(tokData.admin_id, tokData.admin_name, 'admin', 'DELETE_YEAR_LEVEL', 'Year Level', null, yearLevelName, `Deleted year level: ${yearLevelName}`)
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
        const filename = await services.updateAdminProfilePicture(decodedToken.admin_id, req.file.filename)
        res.json({ ok: true, message: 'Profile picture updated!', filename })
    } catch (err) {
        res.status(500).json({ ok: false, message: err.message || String(err) })
    }
})

// Export route
module.exports = admin