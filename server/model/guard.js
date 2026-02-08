const express = require('express')
const services = require('../controller/services')
const guard = express.Router()

guard.use(express.json())

// Debugging API
guard.get('/', (req, res) => {
    res.send('guard API Working!')
})

// Guard Login
guard.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const result = await services.guardLogin(email, password);
        res.json({ 
            ok: true, 
            token: result.token, 
            guard_name: result.name 
        });
    } catch (err) {
        res.status(401).json({ ok: false, message: err });
    }
});

// Continue here tomorrow
guard.post('/event_attendance', (req, res) => {

})



// Export route
module.exports = guard