const express = require('express');
const cors = require('cors');
const path = require('path');
const auth = require('../authentication/authentication');
const student = require('../model/student');
const programs = require('../model/program');
const teacher = require('../model/teacher');
const admin = require('../model/admin');
const guard = require('../model/guard');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT;

app.use(express.json());
app.use(cors());
app.use('/api/v1/uploads', express.static(path.join(__dirname, '../../uploads')))


// Static folders
// app.use('/admin', express.static(path.join(__dirname, '../../admin')))
// app.use('/guard', express.static(path.join(__dirname, '../../guard')))
// app.use('/student', express.static(path.join(__dirname, '../../student')))
// app.use('/teacher', express.static(path.join(__dirname, '../../teacher')))
// app.use('/css', express.static(path.join(__dirname, '../../css')))
// app.use('/public', express.static(path.join(__dirname, '../../public')))

// Root redirect
// app.get('/', (req, res) => {
//     res.redirect('/student')
// })

// API Routes
app.use('/api/v1/authentication', auth)
app.use('/api/v1/students', student)
app.use('/api/v1/teacher', teacher)
app.use('/api/v1/programs', programs)
app.use('/api/v1/admin', admin)
app.use('/api/v1/guard', guard)


app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`)
})
