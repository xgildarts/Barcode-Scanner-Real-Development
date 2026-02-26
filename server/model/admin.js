const express = require('express')
const services = require('../controller/services')
const admin = express.Router()

admin.use(express.json())

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

        const message = await services.addProgram(programName);

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
        // Call the service function
        const result = await services.deleteProgram(programId);
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ ok: false, message: 'Program not found.' });
        }

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
        const result = await services.adminDeleteStudents(id)
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
        const result = await services.adminDeleteTeacher(id, decodedToken.admin_id)
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
        const result = await services.adminDeleteGuard(id, decodedToken.admin_id)
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


// Export route
module.exports = admin