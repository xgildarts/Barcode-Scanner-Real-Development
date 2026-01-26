const express = require('express')
const db = require('../configuration/db')
const cors = require('cors')
const path = require('path')

const app = express()
const PORT = 3000

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors())

// Static folders
app.use('/admin', express.static(path.join(__dirname, '../../admin')))
app.use('/guard', express.static(path.join(__dirname, '../../guard')))
app.use('/student', express.static(path.join(__dirname, '../../student')))
app.use('/teacher', express.static(path.join(__dirname, '../../teacher')))
app.use('/css', express.static(path.join(__dirname, '../../css')))

// Root redirect
app.get('/', (req, res) => {
    res.redirect('/student')
})

// API routes
app.post('/send_barcode', (req, res) => {
    const { barcode } = req.body
    db.execute(
        'INSERT INTO barcode (barcode) VALUES (?)',
        [barcode],
        (err) => {
            if (err) return res.json({ ok: false, message: err })
            res.json({ ok: true, message: 'Successfully inserted barcode!' })
        }
    )
})

app.get('/get_barcode', (req, res) => {
    db.execute(
        'SELECT id, barcode FROM barcode',
        [],
        (err, result) => {
            if (err) return res.json({ ok: false, message: err })
            res.json({ ok: true, contents: result })
        }
    )
})

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`)
})
