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

// Export route
module.exports = admin