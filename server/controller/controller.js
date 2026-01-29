const express = require('express')
const cors = require('cors')
const path = require('path')
const auth = require('../authentication/authentication')
const student = require('../model/student')

const app = express()
const PORT = 3000

app.use(express.json())
app.use(cors())

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


app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`)
})
