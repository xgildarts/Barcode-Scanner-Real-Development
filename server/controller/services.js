
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const db = require('../configuration/db');
const SALT_ROUNDS = 10
const JWT_SECRET = 'q09481239328'

// Generate Barcode
const generateBarcode = () => {
    const timestamp = Date.now().toString(); 
    const randomSuffix = Math.floor(1000 + Math.random() * 9000).toString();
    return 'BC' + timestamp + randomSuffix;
}

// Generate Teacher Serial Number
const generateTeacherSerialNumber = () => {
    const timestamp = Date.now().toString(); 
    const randomSuffix = Math.floor(1000 + Math.random() * 9000).toString();
    return 'TSN' + timestamp + randomSuffix;
}

// Generate Device ID
const generateDeviceID = () => {
    const timestamp = Date.now().toString(); 
    const randomSuffix = Math.floor(1000 + Math.random() * 9000).toString();
    return 'DEV' + timestamp + randomSuffix;
}

// Hash Password
async function hashPassword(password) {
    return await bcrypt.hash(password, SALT_ROUNDS);
}

// De-hashed Password
async function comparePassword(password, hashedPassword) {
    return await bcrypt.compare(password, hashedPassword);
}

// Find student account duplication
function checkStudentAccountDuplication(email, idNumber) {
    const checkQuery = `
    SELECT 1 FROM student_accounts
    WHERE student_email = ? OR student_id_number = ?
    LIMIT 1
    `;
    return new Promise((resolve, reject) => {
        db.execute(checkQuery, [email, idNumber], async (err, result) => {
            if (err) {
                return reject(err)
            }
            resolve(result.length > 0)
        });
    })
}

// Student Registration
function studentRegistration(
    idNumber,
    firstName,
    middleName,
    lastName,
    email,
    hashedPassword,
    yearLevel,
    guardianContact,
    program,
    locationGenerated,
    barcode,
    deviceID
) {
    const query = `
        INSERT INTO student_accounts (
            student_id_number,
            student_firstname,
            student_middlename,
            student_lastname,
            student_email,
            password,
            student_year_level,
            student_guardian_number,
            student_program,
            location_generated,
            barcode,
            device_id
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const values = [
        idNumber,
        firstName,
        middleName,
        lastName,
        email,
        hashedPassword,
        yearLevel,
        guardianContact,
        program,
        locationGenerated,
        barcode,
        deviceID
    ];

    return new Promise((resolve, reject) => {
        db.execute(query, values, (err, result) => {
            if (err) {
                return reject(err);
            }
            resolve(result);
        });
    });
}

// Student Login
async function studentLogin(email, password, device_id) {

    const query = `
        SELECT  
            student_id,
            student_id_number, 
            student_firstname, 
            student_middlename, 
            student_lastname, 
            student_email, 
            password,
            student_year_level,
            student_guardian_number,
            student_program,
            device_id
        FROM student_accounts
        WHERE student_email = ?
        LIMIT 1
    `;

    return new Promise(async (resolve, reject) => {
        db.execute(query, [email], async (err, result) => {
            
            if (err) return reject({ message: err });

            if (result.length === 0) {
                return reject('Invalid email or password');
            }

            const row = result[0];

            // Check device ID if same
            if(!await deviceIDChecker(device_id, email)) return reject('Device is not registered to this account!')

            // ✅ Compare password
            const isMatch = await comparePassword(password, row.password);

            // Remove password before sending a payload
            delete row.password

            if (isMatch) {
                const token = generateToken(row)
                return resolve({ ok: true, message: 'Successfully Login!', token, student_firstname: row.student_firstname });
            }

            return reject('Invalid email or password' );
        });
    });
}

// Generate Token
function generateToken(payload) {
    return jwt.sign(payload, JWT_SECRET, {
        expiresIn: '24h'
    });
}

// Verify Token
function verifyToken(token) {
    try {
        return jwt.verify(token, JWT_SECRET);
    } catch (err) {
        return null;
    }
}

// Remove the prepend Bearer
function removeBearer(authorization) {
    const token = authorization.split(' ')[1]
    return token
}

// Device ID Checker
function deviceIDChecker(deviceID, student_email) {
    return new Promise((resolve, reject) => {
        const query = `
            SELECT 1 FROM student_accounts
            WHERE device_id = ? AND student_email = ?
            LIMIT 1
        `;
        db.execute(query, [deviceID, student_email], (err, results) => {
            if (err) return reject(err);

            if (results.length === 0) {
                // No user found with that email
                return resolve(false);
            }

            return resolve(true)
        });
    });
}

// Student update profile
function studentUpdateProfile(studentId, profileData) {
    return new Promise((resolve, reject) => {
        const { firstName, middleName, lastName, yearLevel, program } = profileData;

        const sql = `
            UPDATE student_accounts
            SET student_firstname = ?,
                student_middlename = ?,
                student_lastname = ?,
                student_year_level = ?,
                student_program = ?
            WHERE student_id_number = ?
        `;

        db.execute(
            sql,
            [firstName, middleName, lastName, yearLevel, program, studentId],
            (err, result) => {
                if (err) {
                    console.error('Database update error:', err);
                    return reject(err);
                }
                resolve(result);
            }
        );
    });
}

// Get Student Data's
function getStudentsData(studentId) {
    return new Promise((resolve, reject) => {
        const sql = `
            SELECT
                student_id_number,
                student_firstname,
                student_middlename,
                student_lastname,
                student_year_level,
                student_program
            FROM student_accounts
            WHERE student_id = ?
        `;

        db.execute(
            sql,
            [studentId],
            (err, result) => {
                if (err) {
                    console.error('Database update error:', err);
                    return reject(err);
                }
                resolve(result);
            }
        );
    });
}

// Update Student password
function updateStudentPassword(currentPassword, newPassword, studentId) {

    return new Promise((resolve, reject) => {
        db.execute(
            'SELECT password FROM student_accounts WHERE student_id = ? LIMIT 1',
            [studentId],
            async (err, result) => {

                if (err) return reject(err);
                if (result.length === 0) return reject('Student not found!');

                const isMatch = await bcrypt.compare(currentPassword, result[0].password);
                if (!isMatch) return reject('Current password is incorrect!');

                const hashedPassword = await bcrypt.hash(newPassword, 10);

                db.execute(
                    'UPDATE student_accounts SET password = ? WHERE student_id = ?',
                    [hashedPassword, studentId],
                    (err) => {
                        if (err) return reject(err);
                        resolve('Successfully updated password!');
                    }
                );
            }
        );
    });
}

// Get Student Barcode and Expiration date
function getStudentBarcode(studentID) {
    return new Promise((resolve, reject) => {
      db.execute(
        'SELECT barcode_date_generated, barcode FROM student_accounts WHERE student_id = ?',
        [studentID],
        (err, result) => {
          if (err) return reject(err);
          if (result.length === 0) return reject('No student barcode found!');
          resolve(result[0]); 
        }
      );
    });
}

// Update Student Barcode
function updateStudentBarcode(studentID, newBarcode) {
    return new Promise((resolve, reject) => {
        db.execute('UPDATE student_accounts SET barcode = ?, barcode_date_generated = NOW() WHERE student_id = ?',
             [ newBarcode, studentID ],
             (err, result) => {
                if(err) { return reject(err) }
                resolve('Student barcode successfully updated!')
        })
    })
}

// Get all programs
function getAllPrograms() {
    return new Promise((resolve, reject) => {
        db.execute('SELECT program_name, program_date_created FROM program', [], (err, result) => {
            if(err) { return reject(err) }
            resolve(result)
        })
    })
}

// Teacher registration
async function teacherRegistration(fullName, email, password, department) {

    const hashedPassword = await hashPassword(password)

    return new Promise((resolve, reject) => {
        const teacherBarcodeScannerSerialNumber = generateTeacherSerialNumber()
        db.execute('INSERT INTO teacher (teacher_name, teacher_email, teacher_password, teacher_program, teacher_barcode_scanner_serial_number) VALUES(?, ?, ?, ?, ?)',
             [ fullName, email, hashedPassword, department, teacherBarcodeScannerSerialNumber ],
            (err, result) => {
            if(err) { return reject(err) }
            initialTeacherSubjectAndYearLevelSetter('', '', teacherBarcodeScannerSerialNumber)
            resolve('Successfully create new account for teacher')
        })
    })
}

// Insert a NULL value to subject and year level setter
async function initialTeacherSubjectAndYearLevelSetter(subjectSet = '', yearLevelSet = '', teacherBarcodeScannerSerialNumber) {
    return new Promise((resolve, reject) => {
        db.execute('INSERT INTO subject_and_year_level_setter (subject_name_set, year_level_set, teacher_barcode_scanner_serial_number) VALUES(?, ?, ?)',
             [ subjectSet, yearLevelSet, teacherBarcodeScannerSerialNumber ],
            (err, result) => {
            if(err) { return reject(err) }
        })
    })
}

// Teacher Login
async function teacherLogin(email, password) {

    const query = `
        SELECT  
            teacher_id,
            teacher_name, 
            teacher_program,
            teacher_password,
            teacher_barcode_scanner_serial_number
        FROM teacher
        WHERE teacher_email = ?
        LIMIT 1
    `;

    return new Promise(async (resolve, reject) => {
        db.execute(query, [email], async (err, result) => {
            
            if (err) return reject({ message: err });

            if (result.length === 0) {
                return reject('Invalid email or password');
            }

            const row = result[0];

            const isMatch = await comparePassword(password, row.teacher_password);

            // Remove password before sending a payload
            delete row.password

            if (isMatch) {
                const token = generateToken(row)
                return resolve({ ok: true, message: 'Successfully Login!', token, teacher_name: row.teacher_name });
            }

            return reject('Invalid email or password' );
        });
    });
}

// Get All Student Data
async function teacherGetAllStudentDataTotalCount(teacherBarcodeScannerSerialNumber) {
    return new Promise((resolve, reject) => {
        db.execute('SELECT COUNT(student_id) AS total FROM student_records_regular_class WHERE teacher_barcode_scanner_serial_number = ?', [ teacherBarcodeScannerSerialNumber ], (err, result) => {
            if(err) { return reject(err) }
            resolve(result)
        })
    })
}

// Get Total Student Attendees Right Now
async function teacherGetTotalAttendanceRecord(teacherBarcodeScannerSerialNumber) {
    return new Promise((resolve, reject) => {
        db.execute('SELECT COUNT(attendance_id) as total_attendees FROM attendance_record WHERE teacher_barcode_scanner_serial_number = ?', [ teacherBarcodeScannerSerialNumber ], (err, result) => {
            if(err) { return reject(err) }
            resolve(result)
        })
    })
}

// Teacher Add Student
async function teacherAddStudent(
    studentIDNumber, 
    studentFirstName, 
    studentMiddleName, 
    studentLastName, 
    studentEmail, 
    studentProgram, 
    studentYearLevel, 
    studentGuardianNumber, 
    teacherBarcodeScannerSerialNumber
) {
    return new Promise((resolve, reject) => {
        db.execute(
            `INSERT INTO student_records_regular_class (
                student_id_number, 
                student_firstname, 
                student_middlename, 
                student_lastname, 
                student_email, 
                student_program, 
                student_year_level, 
                student_guardian_number, 
                teacher_barcode_scanner_serial_number
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                studentIDNumber, 
                studentFirstName, 
                studentMiddleName, 
                studentLastName, 
                studentEmail, 
                studentProgram, 
                studentYearLevel,
                studentGuardianNumber,
                teacherBarcodeScannerSerialNumber
            ],
            (err, result) => {
                if (err) return reject(err);
                resolve({
                    message: 'Successfully added new student!',
                });
            }
        );
    });
}

// Teacher Get Student Registered
async function teacherGetStudentRegistered(teacherBarcodeScannerSerialNumber) {
    return new Promise((resolve, reject) => {
        db.execute(
            `SELECT 
                student_id, 
                student_id_number, 
                student_firstname, 
                student_middlename,
                student_lastname,
                student_email,
                student_year_level,
                student_guardian_number,
                student_program,
                date_created
            FROM student_records_regular_class 
            WHERE teacher_barcode_scanner_serial_number = ?`,
            [ teacherBarcodeScannerSerialNumber ],
            (err, result) => {
                if (err) return reject(err);
                resolve(result);
            }
        );
    });
}

// Teacher Subject And Year Level Setter
async function teacherSubjectAndYearLevelSetter(subjectSet, yearLevelSet, teacherBarcodeScannerSerialNumber) {
    return new Promise((resolve, reject) => {
        db.execute(`UPDATE subject_and_year_level_setter 
                    SET subject_name_set = ?, 
                    year_level_set = ? 
                    WHERE teacher_barcode_scanner_serial_number = ?`, 
                    [subjectSet, yearLevelSet, teacherBarcodeScannerSerialNumber],
                    (err, result) => {
                        if(err) { return reject(err) }
                        resolve('Successfully set!')
                    })
    })
}


// Export functions
module.exports= {
    generateBarcode,
    generateDeviceID,
    hashPassword,
    comparePassword,
    checkStudentAccountDuplication,
    studentRegistration,
    studentLogin,
    generateToken,
    verifyToken,
    removeBearer,
    deviceIDChecker,
    studentUpdateProfile,
    getStudentsData,
    updateStudentPassword,
    studentUpdateProfile,
    getStudentBarcode,
    updateStudentBarcode,
    getAllPrograms,
    teacherRegistration,
    teacherLogin,
    teacherGetAllStudentDataTotalCount,
    teacherGetTotalAttendanceRecord,
    teacherAddStudent,
    teacherGetStudentRegistered,
    teacherSubjectAndYearLevelSetter
}