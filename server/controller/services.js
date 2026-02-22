
const bcrypt = require('bcrypt')
const axios = require('axios');
const jwt = require('jsonwebtoken')
const db = require('../configuration/db');
const SALT_ROUNDS = 10
const JWT_SECRET = 'q09481239328'

// async function t() {
//     try {
//         const result = await sendSMS('+09763891308', 'Hello World')
//         console.log(result)
//     } catch(err) {
//         console.log(err)
//     }
// }

// t()

// async function sendSMS(to, message) {
//     const username = 'xnatsu25@gmail.com';
//     const apiKey = 'E6A2B53D-2C42-BE75-D8DD-62B57D76D984';

//     const auth = Buffer.from(`${username}:${apiKey}`).toString('base64');

//     try {
//         const response = await axios.post(
//             'https://rest.clicksend.com/v3/sms/send',
//             {
//                 messages: [
//                     {
//                         source: "nodejs",
//                         from: "+639763891308", // Registered sender ID
//                         body: message,
//                         to: to
//                     }
//                 ]
//             },
//             {
//                 headers: {
//                     Authorization: `Basic ${auth}`,
//                     "Content-Type": "application/json"
//                 }
//             }
//         );

//         return response.data;
//     } catch (error) {
//         throw error.response?.data || error.message;
//     }
// }

// module.exports = { sendSMS };



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

// Get Student Attendance
function getAttendanceHistoryForStudentOnly(studentID) {
    return new Promise((resolve, reject) => {
        db.execute('SELECT * FROM attendance_history_record WHERE student_id = ?', [ studentID ], (err, result) => {
            if(err) { return reject(err) }
            resolve(result)
        })
    })
}

// async function test() {
//     try {
//         const result = await getStudentAttendance(13)
//         console.log(result)
//     } catch(err) {
//         console.log(err)
//     }
// }

// test()

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
        db.execute('SELECT program_id, program_name, program_date_created FROM program', [], (err, result) => {
            if(err) { return reject(err) }
            resolve(result)
        })
    })
}

// Teacher registration
async function teacherRegistration(fullName, email, password, department, admin_id) {
    const hashedPassword = await hashPassword(password);

    const teacherBarcodeScannerSerialNumber = generateTeacherSerialNumber();

    return new Promise( async (resolve, reject) => {
        const sql = `
            INSERT INTO teacher 
            (teacher_name, teacher_email, teacher_password, teacher_program, teacher_barcode_scanner_serial_number, admin_id) 
            VALUES (?, ?, ?, ?, ?, ?)
        `;

        const emailExists = await emailFinder('teacher_email', email, 'teacher');
        if (emailExists) {
            reject('Email is already taken!');
        }

        db.execute(
            sql,
            [fullName, email, hashedPassword, department, teacherBarcodeScannerSerialNumber, admin_id],
            (err, result) => {
                if (err) { return reject(err); }
                try {
                    initialTeacherSubjectAndYearLevelSetter('', '', teacherBarcodeScannerSerialNumber);
                    resolve('Successfully created new account for teacher');
                } catch (initErr) {
                    console.error('Initialization error:', initErr);
                    resolve('Account created, but failed to initialize state.');
                }
            }
        );
    });
}

// Guard Registration

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

// Check Student If Exists in Registration
async function checkStudentIfExistsInRegistration(barcode) {
    return new Promise((resolve, reject) => {
        db.execute(`SELECT 
                        student_id,
                        student_id_number,
                        student_firstname,
                        student_middlename,
                        student_lastname,
                        student_email,
                        student_year_level,
                        student_guardian_number,
                        student_program
                    FROM student_accounts
                    WHERE barcode = ?`, [ barcode ], 
                    (err, result) => {
                        if(err) { return reject(err) }
                        resolve(result)
                    })
    })
}

// Check Student If Exists on Regular class from specific teacher
async function checkStudentToRegularClass(studentIDNumber) {
    return new Promise((resolve, reject) => {
        db.execute('SELECT student_id_number FROM student_records_regular_class WHERE student_id_number = ? LIMIT 1', 
            [ studentIDNumber ], 
            (err, result) => {
            if(err) { return reject(err) }
            resolve(result.length > 0)
        })
    })
}

// Check student if already on attendance
async function checkStudentIfAlreadyExistsInAttendance(student_id_number) {
    return new Promise((resolve, reject) => {
        db.execute(
            'SELECT 1 FROM attendance_record WHERE student_id_number = ? LIMIT 1',
            [student_id_number],
            (err, result) => {
                if (err) return reject(err)
                resolve(result.length > 0)
            }
        )
    })
}


// Check year level and serial number
function checkYearLevelAndSerialNumber(teacher_barcode_scanner_serial_number, yearLevel) {
    return new Promise((resolve, reject) => {
        db.execute(
            `SELECT subject_name_set, 
             year_level_set 
             FROM subject_and_year_level_setter 
             WHERE teacher_barcode_scanner_serial_number = ? 
             AND year_level_set = ?`,
            [teacher_barcode_scanner_serial_number, yearLevel],
            (err, result) => {
                if (err) return reject(err)
                resolve(result)
            }
        )
    })
}

// Insert student Attendance 
async function insertStudentAttendance(
    student_id,
    student_id_number,
    student_firstname,
    student_middlename,
    student_lastname,
    student_year_level,
    student_program,
    teacher_barcode_scanner_serial_number
) {
    // Check if student already exists in attendance
    const exists = await checkStudentIfAlreadyExistsInAttendance(student_id_number)
    if (exists) {
        throw new Error('Student already recorded in attendance.')
    }

    // Check teacher serial number + year level
    const result = await checkYearLevelAndSerialNumber(
        teacher_barcode_scanner_serial_number,
        student_year_level
    )

    if (result.length === 0) {
        throw new Error('Year level not authorized for this teacher.')
    }

    // Insert attendance record
    await new Promise((resolve, reject) => {
        db.execute(
            `INSERT INTO attendance_record (
                student_id,
                student_id_number,
                student_firstname,
                student_middlename,
                student_lastname,
                year_level,
                subject,
                student_program,
                teacher_barcode_scanner_serial_number
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                student_id,
                student_id_number,
                student_firstname,
                student_middlename,
                student_lastname,
                student_year_level,
                result[0].subject_name_set,
                student_program,
                teacher_barcode_scanner_serial_number
            ],
            (err) => {
                if (err) return reject(err)
                resolve()
            }
        )
    })

    // Insert attendance history (SAFE to await)
    await insertStudentAttendanceHistory(
        student_id,
        student_id_number,
        student_firstname,
        student_middlename,
        student_lastname,
        student_year_level,
        result[0].subject_name_set,
        student_program,
        teacher_barcode_scanner_serial_number
    )

    return 'Successfully inserted student attendance!'
}

// Insert student Attendance History
function insertStudentAttendanceHistory(
    student_id,
    student_id_number,
    student_firstname,
    student_middlename,
    student_lastname,
    student_year_level,
    subject_name_set,
    student_program,
    teacher_barcode_scanner_serial_number
) {
    return new Promise((resolve, reject) => {
        db.execute(
            `INSERT INTO attendance_history_record (
                student_id,
                student_id_number,
                student_firstname,
                student_middlename,
                student_lastname,
                year_level,
                subject,
                student_program,
                teacher_barcode_scanner_serial_number
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                student_id,
                student_id_number,
                student_firstname,
                student_middlename,
                student_lastname,
                student_year_level,
                subject_name_set,
                student_program,
                teacher_barcode_scanner_serial_number
            ],
            (err) => {
                if (err) return reject(err)

                console.log('Successfully inserted student attendance history!')
                resolve(true)
            }
        )
    })
}

// Get Student Attendance Now
async function getStudentAttendanceNow(teacher_barcode_scanner_serial_number) {
    return new Promise((resolve, reject) => {
        db.execute('SELECT * FROM attendance_record WHERE teacher_barcode_scanner_serial_number = ?', [ teacher_barcode_scanner_serial_number ], (err, result) => {
            if(err) { return reject(err) }
            resolve(result)
        })
    })
}

// Get Student Attendance History
async function getStudentAttendanceHistory(teacher_barcode_scanner_serial_number) {
    return new Promise((resolve, reject) => {
        db.execute('SELECT * FROM attendance_history_record WHERE teacher_barcode_scanner_serial_number = ?', [ teacher_barcode_scanner_serial_number ], (err, result) => {
            if(err) { return reject(err) }
            resolve(result)
        })
    })
}

// Get Subjects
async function getStudentSubjects(teacherID) {
    return new Promise((resolve, reject) => {
        db.execute('SELECT * FROM subject WHERE teacher_id = ?', [ teacherID ], (err, result) => {
            if(err) { reject(err) }
            resolve(result)
        })
    })
}

// Delete Subject
async function deleteSubject(subjectID) {
    return new Promise((resolve, reject) => {
        db.execute('DELETE FROM subject WHERE subject_id = ?', [ subjectID ], (err, result) => {
            if(err) { return reject(err) }
            resolve('Successfully deleted!')
        })
    })
}

// Delete Subject
async function addSubject(subjectName, teacherID) {
    return new Promise((resolve, reject) => {
        db.execute('INSERT INTO subject (subject_name, teacher_id) VALUES(?, ?)', [ subjectName, teacherID ], (err, result) => {
            if(err) { return reject(err) }
            resolve('Successfully inserted!')
        })
    })
}

// Get Year Levels
async function teacherGetYearLevel() {
    return new Promise((resolve, reject) => {
        db.execute('SELECT * FROM year_level', [], (err, result) => {
            if(err) { reject(err) }
            resolve(result)
        })
    })
}

// Update Student Registered Record
function updateStudentRegisteredRecord(
    student_id,
    student_id_number,
    student_firstname,
    student_middlename,
    student_lastname,
    student_year_level,
    student_program
) {
    return new Promise((resolve, reject) => {
        const query = `
            UPDATE student_records_regular_class
            SET
                student_id_number = ?,
                student_firstname = ?,
                student_middlename = ?,
                student_lastname = ?,
                student_year_level = ?,
                student_program = ?
            WHERE student_id = ?
        `;

        const values = [
            student_id_number,
            student_firstname,
            student_middlename,
            student_lastname,
            student_year_level,
            student_program,
            student_id
        ];

        db.execute(query, values, (err, result) => {
            if (err) return reject(err);
            resolve(result);
        });
    });
}

// Delete Student Registered Record
function deleteStudentRegisteredRecord(studentID) {
    return new Promise((resolve, reject) => {
        db.execute('DELETE FROM student_records_regular_class WHERE student_id = ?', [ studentID ], (err, result) => {
            if(err) { return reject(err) }
            resolve('Student successfully deleted!')
        })
    })
}

// Get Teacher Data
function getTeacherData(teacherID) {
    return new Promise((resolve, reject) => {
        const query = `SELECT 
                            teacher_name, 
                            teacher_email, 
                            teacher_program, 
                            teacher_current_subject, 
                            teacher_location,
                            teacher_barcode_scanner_serial_number 
                       FROM teacher 
                       WHERE teacher_id = ?`

        db.execute(query, [ teacherID ], (err, result) => {
            if(err) { return reject(err) }
            resolve(result)
        })
    })
}

// Update Teacher Password
function updateTeacherPassword(teacherID, currentPassword, newPassword) {
    return new Promise((resolve, reject) => {
        const query = `SELECT teacher_password FROM teacher WHERE teacher_id = ?`
        db.execute(query, [teacherID], async (err, result) => {
            if(err) { return reject(err) }
            if (result.length === 0) { reject('Unauthorized') }
            const isMatch = await comparePassword(currentPassword, result[0].teacher_password)
            const hashNewPassword = await hashPassword(newPassword, SALT_ROUNDS)
            if(isMatch) {
                db.execute('UPDATE teacher SET teacher_password = ? WHERE teacher_id = ?', [hashNewPassword, teacherID], (err, result) => {
                    if(err) { return reject(err) }
                    if(result.length === 0) { return reject('Update password failed!') }
                    resolve('Successfully update new password!')
                })
            } else {
                return reject('Invalid password!')
            }
        })
    })
}

// Update Teacher Name
function updateTeacherName(teacherID, teacherNewName) {
    return new Promise((resolve, reject) => {
        db.execute('UPDATE teacher SET teacher_name = ? WHERE teacher_id = ?', [ teacherNewName, teacherID ], (err, result) => {
            if(err) { return reject(err) }
            if(result.affectedRows === 0) { reject('Update failed!') }
            resolve('Successfully update teacher name!')
        })
    })
}

// Get Whole Campus Accounts
function getWholeCampusAccounts(tableName) {
    return new Promise((resolve, reject) => {
        db.execute(`SELECT * FROM ${tableName}`, [], (err, result) => {
            if(err) { return reject(err) }
            resolve(result)
        })
    })
}


// Manual Insert Attendance
// function manualInsertAttendance(id,
//     studentIDNumber,
//     studentFirstName,
//     studentMiddleName,
//     studentLastName,
//     studentProgram,
//     studentYearLevel,
//     teacher_barcode_scanner_serial_number) {
//     return new Promise((resolve, reject) => {
//         db.execute('INSERT INTO attendance_record(student_id_number ,student_middlename, student_lastname, student_firstname, student_program, year_level)')
//     })
// }


// Email finder
function emailFinder(columnToFind, email, tableName) {
    return new Promise((resolve, reject) => {
        db.query(`SELECT * FROM ${tableName} WHERE ${columnToFind} = ?`, [email], (err, result) => {
            if (err) { 
                return reject(err); 
            }
            
            if (result.length > 0) {
                resolve(true);
            } else {
                resolve(false);
            }
        });
    });
}

// Guard registration
async function guardRegistration(
    guard_name, 
    guard_email, 
    guard_password, 
    guard_designated_location,
    admin_id
) {
    return new Promise(async (resolve, reject) => {
        try {
            const emailExists = await emailFinder('guard_email', guard_email, 'guards');

            if (emailExists) {
                return reject('Email already exists!');
            }

            const hashedPassword = await bcrypt.hash(guard_password, SALT_ROUNDS);

            const sql = `
                INSERT INTO guards 
                (guard_name, guard_email, guard_password, guard_designated_location, admin_id)
                VALUES (?, ?, ?, ?, ?)
            `;

            db.query(
                sql,
                [guard_name, guard_email, hashedPassword, guard_designated_location, admin_id],
                (err, result) => {
                    if (err) return reject(err);
                    resolve('Successfully registered!');
                }
            );

        } catch (err) {
            reject(err);
        }
    });
}

// Check duplication program
function checkProgramDuplicate(programName) {
    return new Promise((resolve, reject) => {
        const sql = "SELECT * FROM program WHERE program_name = ?";
        
        db.execute(sql, [programName], (err, result) => {
            if (err) {
                console.error("Database Error:", err);
                return reject(err);
            }
            resolve(result.length > 0);
        });
    });
}

// Add Program
async function addProgram(programName) {
    return new Promise(async (resolve, reject) => {
        try {
            const isDuplicate = await checkProgramDuplicate(programName);

            if (isDuplicate) {
                return reject('Program already exists!');
            }

            const sql = `
                INSERT INTO program (program_name) 
                VALUES (?)
            `;

            db.execute(
                sql,
                [programName],
                (err, result) => {
                    if (err) return reject(err);
                    resolve('Successfully added new program!');
                }
            );

        } catch (err) {
            reject(err);
        }
    });
}

// Delete Program
function deleteProgram(id) {
    return new Promise((resolve, reject) => {
        const sql = "DELETE FROM program WHERE program_id = ?";
        
        db.execute(sql, [id], (err, result) => {
            if (err) {
                return reject(err);
            }
            resolve(result);
        });
    });
}

// Admin Login
async function adminLogin(email, password) {

    const query = `
        SELECT 
            admin_id,
            admin_name, 
            admin_email,
            admin_password
        FROM admin_accounts
        WHERE admin_email = ?
        LIMIT 1
    `;

    return new Promise(async (resolve, reject) => {
        db.execute(query, [email], async (err, result) => {
            
            if (err) return reject({ message: err });

            if (result.length === 0) {
                return reject('Invalid email or password');
            }

            const row = result[0];

            const isMatch = await comparePassword(password, row.admin_password);

            delete row.admin_password;

            if (isMatch) {
                const token = generateToken(row);

                return resolve({ 
                    ok: true, 
                    message: 'Login successful', 
                    token, 
                    user: {
                        id: row.admin_id,
                        name: row.admin_name,
                        email: row.admin_email
                    }
                });
            }

            return reject('Invalid email or password');
        });
    });
}

// Get Admin data
function getAdminData(adminID) {
    return new Promise((resolve, reject) => {
        db.execute('SELECT admin_id, admin_name, admin_email FROM admin_accounts;', [], (err, result) => {
            if(err) { return reject(err) }
            resolve(result)
        })
    })
}

// Admin Set Event Name
async function setEventName(eventName, adminID) {
    return new Promise((resolve, reject) => {
        const sql = `
            UPDATE event_setter 
            SET event_name_set = ? WHERE admin_id = ?
        `;
        db.execute(sql, [eventName, adminID], (err, result) => {
            if (err) return reject(err.message);
            resolve('Event updated successfully');
        });
    });
}


// Find student if exists in student accounts
async function studentBarcodeFinder(studentBarcode) {
    return new Promise((resolve, reject) => {
        const query = `
        SELECT 
            student_id,
            student_id_number,
            student_firstname,
            student_middlename,
            student_lastname,
            student_email,
            student_year_level,
            student_guardian_number,
            student_program,
            barcode,
            barcode_date_generated,
            device_id
        FROM student_accounts
        WHERE barcode = ?;`
        db.execute(query, [ studentBarcode ], (err, result) => {
            if(err) { return reject(err) }
            resolve(result[0])
        })
    })
}

// Find if student is already in attendance
async function studentCheckEventIfExists(studentIDNumber, status) {
    return new Promise((resolve, reject) => {
        // No date check needed because the table is wiped daily
        const sql = `
            SELECT student_id_number 
            FROM event_attendance_record 
            WHERE student_id_number = ? 
            AND status = ? 
            LIMIT 1
        `;

        db.execute(sql, [ studentIDNumber, status ], (err, result) => {
            if(err) { return reject(err); }
            
            // Returns TRUE if record exists, FALSE if not
            resolve(result.length > 0);
        });
    });
}

// Get Event Setter
async function getEventSet() {
    return new Promise((resolve, reject) => {
        // We order by ID DESC to get the latest event set by Admin
        const query = "SELECT event_name_set FROM event_setter;";
        
        db.execute(query, [], (err, result) => {
            if(err) { return reject(err) }
            // If no event is set, resolve null
            resolve(result.length > 0 ? result[0] : null)
        })
    })
}

// Insert Event Attendance
async function guardInsertAttendanceRecord(studentBarcode, status, guardID, guardName, guardLocation) {
    return new Promise(async (resolve, reject) => {
        try {
            const student = await studentBarcodeFinder(studentBarcode);
            if (!student) { 
                return reject('Student does not exist in records!'); 
            }
            const alreadyScanned = await studentCheckEventIfExists(student.student_id_number, status);
            if (alreadyScanned) {
                return reject(`Student has already scanned for ${status}!`);
            }
            const eventData = await getEventSet();
            if (!eventData || !eventData.event_name_set) {
                return reject('No active event found. Please contact Admin.');
            }
            const activeEventName = eventData.event_name_set;
            const insertQuery = `
                INSERT INTO event_attendance_record 
                (student_id, student_name, student_id_number, student_program, student_year_level, event_name, guard_name, guard_location, status, guard_id) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `;
            const fullName = `${student.student_firstname} ${student.student_middlename}. ${student.student_lastname}`;
            const values = [
                student.student_id,       
                fullName,                 
                student.student_id_number,
                student.student_program,  
                student.student_year_level,
                activeEventName,          
                guardName || 'Guard',     
                guardLocation,            
                status,                   
                guardID
            ];
            db.execute(insertQuery, values, async (err, result) => {
                if (err) { return reject(err); }

                try {
                    await guardInsertAttendanceHistoryRecord(values);
                    
                    resolve({
                        ok: true,
                        message: `${status} Recorded Successfully`,
                        student: fullName,
                        event: activeEventName
                    });
                } catch (historyErr) {
                    console.error("History insert failed:", historyErr);
                    reject(historyErr);
                }
            });
        } catch (error) {
            reject(error);
        }
    });
}

// Insert Event Attendance History
async function guardInsertAttendanceHistoryRecord(values) {
    return new Promise((resolve, reject) => {
        try {
            const insertQuery = `
                INSERT INTO event_attendance_history_record 
                (student_id, student_name, student_id_number, student_program, student_year_level, event_name, guard_name, guard_location, status, guard_id) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `;

            db.execute(insertQuery, values, (err, result) => {
                if (err) { return reject(err); }
                resolve({
                    ok: true,
                    message: `Recorded Successfully`
                });
            });

        } catch (error) {
            reject(error);
        }
    });
}

// Guard Login
async function guardLogin(email, password) {
    return new Promise((resolve, reject) => {
        const query = "SELECT * FROM guards WHERE guard_email = ? LIMIT 1"; 
        db.execute(query, [email], async (err, result) => {
            if (err) {
                return reject({ message: "Database error", code: 500 });
            }
            if (result.length === 0) {
                return reject({ message: "Account not found", code: 404 });
            }
            const guard = result[0];
            try {
                const isMatch = await comparePassword(password, guard.guard_password);
                if (!isMatch) {
                    return reject({ message: "Invalid password", code: 401 });
                }
                const payload = {
                    guard_id: guard.guard_id,
                    guard_name: guard.guard_name,
                    guard_location: guard.guard_designated_location,
                    role: 'guard'
                };         
                const token = generateToken(payload);
                resolve({
                    message: "Login Successful",
                    token: token,
                    guard_name: guard.guard_name
                });

            } catch (error) {
                reject({ message: "Authentication failed", code: 500 });
            }
        });
    });
}

// Get Events
function getAttendanceEventRecords(adminID) {
    return new Promise((resolve, reject) => {
        db.execute('SELECT * FROM event_attendance_record WHERE admin_id = ?', [ adminID ], (err, result) => {
            if(err) { return reject(err) }
            resolve(result)
        })
    })
}

// Get Events History
function getAttendanceEventHistoryRecords(adminID) {
    return new Promise((resolve, reject) => {
        db.execute('SELECT * FROM event_attendance_history_record WHERE admin_id = ?', [ adminID ], (err, result) => {
            if(err) { return reject(err) }
            resolve(result)
        })
    })
}

// Get Student Attendance Events for Teacher
function getAttendanceEventsForTeacher(teacherID, tableName) {
    return new Promise(async (resolve, reject) => {
        const teacherData = await getTeacherData(teacherID)
        db.execute(`SELECT * FROM ${tableName} WHERE student_program = ?`, [ teacherData[0].teacher_program ], (err, result) => {
            if(err) { return reject(err) }
            resolve(result)
        })
    })
}

// Change Admin Name
function changeAdminName(newName, adminID) {
    return new Promise((resolve, reject) => {
        db.execute('UPDATE admin_accounts SET admin_name = ? WHERE admin_id = ?', [ newName, adminID ], (err, result) => {
            if(err) { return reject(err) }
            resolve({ message: 'Successfully updated!' })
        })
    })
}

function updateAdminPassword(adminID, currentPassword, newPassword) {
    return new Promise((resolve, reject) => {
        db.execute('SELECT admin_password FROM admin_accounts WHERE admin_id = ?', [ adminID ], async (err, result) => {
            if(err) { return reject({ ok: false, message: err, status_code: 500 }) }
            const match = comparePassword(newPassword, currentPassword);
            if(!match) { return reject({ ok: false, message: 'Invalid password', status_code: 401 }) }
            const hashedPassword = await hashPassword(newPassword)
            db.execute('UPDATE admin_accounts SET admin_password = ? WHERE admin_id = ?', [ hashedPassword, adminID ], (err, result) => {
                if(err) { return reject({ ok: false, message: err, status_code: 500 }) }
                resolve({ ok: true, message: 'Password updated', status_code: 200 })
            })
        })
    })
}

// Admin delete students account
function adminDeleteStudents(student_id) {
    return new Promise((resolve, reject) => {
        db.execute('DELETE FROM student_accounts WHERE student_id = ?', [ student_id ], (err, result) => {
            if(err) { return reject({ ok: false, message: "Database error: " + err, status_code: 500 }) }
            if(result.length === 0) { return reject({ ok: false, message: "Unauthorized", status_code: 401 }) }
            resolve({ ok: true, message: 'Successfully delete student data!', status_code: 200})
        })
    })
}

// Admin delete teachers account
function adminDeleteTeacher(teacher_id, admin_id) {
    return new Promise((resolve, reject) => {
        db.execute('DELETE FROM teacher WHERE teacher_id = ? AND admin_id = ?', [ teacher_id, admin_id ], (err, result) => {
            if(err) { return reject({ ok: false, message: "Database error: " + err, status_code: 500 }) }
            if(result.length === 0) { return reject({ ok: false, message: "Unauthorized", status_code: 401 }) }
            resolve({ ok: true, message: 'Successfully delete teacher data!', status_code: 200})
        })
    })
}

// Admin delete guard account
function adminDeleteGuard(teacher_id, admin_id) {
    return new Promise((resolve, reject) => {
        db.execute('DELETE FROM guards WHERE guard_id = ? AND admin_id = ?', [ teacher_id, admin_id ], (err, result) => {
            if(err) { return reject({ ok: false, message: "Database error: " + err, status_code: 500 }) }
            if(result.length === 0) { return reject({ ok: false, message: "Unauthorized", status_code: 401 }) }
            resolve({ ok: true, message: 'Successfully delete teacher data!', status_code: 200})
        })
    })
}

// Admin get event program's present
function getPresentPrograms() {
    return new Promise((resolve, reject) => {
        db.execute(
        `   SELECT student_program, COUNT(*) AS total_attended
            FROM event_attendance_record
            WHERE status = 'TIME IN'
            GROUP BY student_program;  `,
            [],
            (err, result) => {
                if (err) {
                    return reject({ 
                        ok: false, 
                        message: err, 
                        status_code: 500 
                    });
                }

                resolve({ 
                    ok: true, 
                    message: 'Successfully retrieved data!', 
                    content: result 
                });
            }
        );
    });
}

// Admin edit student accounts
function adminEditStudentAccounts(
    id, 
    id_number, 
    firstname, 
    middlename, 
    lastname, 
    program, 
    year_level
) {
return new Promise((resolve, reject) => {

    const updateQuery = `
        UPDATE student_accounts 
        SET 
            student_id_number = ?, 
            student_firstname = ?, 
            student_middlename = ?, 
            student_lastname = ?, 
            student_program = ?, 
            student_year_level = ?
        WHERE student_id = ?
    `;

    const values = [
        id_number,
        firstname,
        middlename,
        lastname,
        program,
        year_level,
        id
    ];

    db.execute(updateQuery, values, (err, result) => {
        if (err) {
            console.error("Database error updating student account:", err);
            return reject(err);
        }

        if (result.affectedRows === 0) {
            return reject(new Error("Update failed: Student not found or no changes were made."));
        }

        resolve({
            ok: true,
            message: "Student account updated successfully!",
            affectedRows: result.affectedRows
        });
    });
});
}

// Debugger
// async function tester() {
//     try {
//        const result = await getPresentPrograms()
//        console.log(result)
//     } catch(err) {
//        console.log(err)
//     }
// }

// tester()


// Export functions
module.exports= {
    adminEditStudentAccounts,
    getPresentPrograms,
    adminDeleteGuard,
    adminDeleteTeacher,
    adminDeleteStudents,
    updateAdminPassword,
    changeAdminName,
    getAttendanceEventsForTeacher,
    getAdminData,
    getAttendanceEventHistoryRecords,
    getAttendanceEventRecords,
    guardLogin,
    guardInsertAttendanceRecord,
    setEventName,
    adminLogin,
    deleteProgram,
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
    teacherSubjectAndYearLevelSetter,
    checkStudentIfExistsInRegistration,
    checkStudentToRegularClass,
    insertStudentAttendance,
    checkYearLevelAndSerialNumber,
    getStudentAttendanceNow,
    getStudentAttendanceHistory,
    getStudentSubjects,
    deleteSubject,
    addSubject,
    teacherGetYearLevel,
    updateStudentRegisteredRecord,
    deleteStudentRegisteredRecord,
    getTeacherData,
    updateTeacherPassword,
    updateTeacherName,
    getAttendanceHistoryForStudentOnly,
    emailFinder,
    guardRegistration,
    getWholeCampusAccounts,
    addProgram
}