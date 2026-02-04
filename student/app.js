
const CONFIG = {

    BASE_URL: 'http://192.168.1.50:3000/api/v1',
    TOKEN: localStorage.getItem('student_token')
};

// Helper function to handle all API calls
async function authFetch(endpoint, method = 'GET', body = null) {
    try {
        const options = {
            method: method,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + CONFIG.TOKEN
            }
        };

        if (body) {
            options.body = JSON.stringify(body);
        }

        const res = await fetch(`${CONFIG.BASE_URL}${endpoint}`, options);
        const data = await res.json();

        return { res, data }; // Return both response status and data
    } catch (err) {
        console.error('API Error:', err);
        throw err; // Pass error to specific function to handle
    }
}

document.addEventListener('DOMContentLoaded', () => {
    tab('generateBarcode')
    checkToken()
    loadProfileData()
    initialCheckBarcodeExpiration()
    getAttendanceHistory()
    // Generate initial barcode
    generateBarcode();
})

// Check token
async function checkToken() {
    try {
        // If no token provided, redirect the user to login page
        if (!CONFIG.TOKEN) {
            Swal.fire({ icon: 'error', title: 'Please login first!', message: 'Please login first!' })
                .then(() => {
                    window.location.href = 'student_login.html'
                })
            return;
        }

        const { res, data } = await authFetch('/authentication/verify_token', 'POST');

        if (!res.ok) {
            Swal.fire({ icon: 'error', title: data.message, message: data.message })
                .then(() => {
                    window.location.href = 'student_login.html'
                })
        }

    } catch (err) {
        Swal.fire({ icon: 'error', title: 'Error', message: err.message || err })
    }
}

// Load Profile Data
async function loadProfileData() {
    try {
        const { res, data } = await authFetch('/students/student_get_data');

        if (res.ok) {
            // Profile container
            const profileInfo = document.querySelectorAll('.profile-info')

            const {
                student_id_number,
                student_firstname,
                student_middlename,
                student_lastname,
                student_year_level,
                student_program
            } = data.contents[0];

            // Profile
            profileInfo.forEach(p => {
                p.innerHTML = `
                <div class="profile-name">${student_firstname} ${student_middlename}. ${student_lastname}</div>
                <div class="profile-id">${student_id_number}</div>
                <div class="profile-course">${student_program}</div>
                <div class="profile-year">${student_year_level}</div>
                `
            })

            // Profile Settings
            document.getElementById("firstName").value = student_firstname;
            document.getElementById("middleName").value = student_middlename;
            document.getElementById("lastName").value = student_lastname;
            document.getElementById("idNumber").value = student_id_number;
            document.getElementById("yearLevel").value = student_year_level;
            document.getElementById("program").value = student_program;

        } else {
            Swal.fire({ icon: 'error', title: data.message, message: data.message })
                .then(() => {
                    window.location.href = 'student_login.html'
                })
        }
    } catch (err) {
        console.error(err);
    }
}

// Events for going back
function goBackBtn() {
    document.getElementById('goBackBtn').classList.remove('show')
    tab('generateBarcode')
}

// Tab
function tab(tabName) {
    // For debugging
    console.log(tabName)

    const tabs = ['generateBarcode', 'attendanceHistory', 'settings'];

    // Change title
    switch (tabName) {
        case 'generateBarcode':
            document.getElementById('title').textContent = "Barcode Generation";
            break;
        case 'attendanceHistory':
            document.getElementById('title').textContent = "Attendance History";
            break;
        case 'settings':
            document.getElementById('title').textContent = "Settings";
            break;
    }

    // Hide the tab button at the bottom, when clicking the settings
    if (tabName === 'settings') {
        document.getElementById('actionButtons').classList.add('hide')
        document.getElementById('goBackBtn').classList.add('show')
    } else {
        document.getElementById('actionButtons').classList.remove('hide')
        document.getElementById('goBackBtn').classList.remove('show')
    }

    // Active tab styling
    tabs.forEach(tab => {
        if (tab === tabName) {
            document.getElementById(tab).classList.add('active')
        } else {
            document.getElementById(tab).classList.remove('active')
        }
    });
}

// Generate barcode
function generateBarcode(barcode) {
    JsBarcode('#barcodeImage', barcode, {
        format: 'CODE128',
        width: 10,
        height: 1000,
        displayValue: true,
        fontSize: 200,
        margin: 60
    });
}

// Generate random barcode string
function generateRandomBarcode() {
    const timestamp = Date.now().toString();
    const randomSuffix = Math.floor(1000 + Math.random() * 9000).toString();
    const barcode = 'BC' + timestamp + randomSuffix;
    return barcode
}

// Update Student Barcode (API)
async function updateStudentBarcode(barcode) {
    try {
        const { res, data } = await authFetch('/students/update_student_barcode', 'PUT', { barcode });

        if (res.ok) {
            console.log(data.message)
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: data.message
            });
        }
    } catch (err) {
        Swal.fire({
            icon: 'error',
            title: 'Fetch Failed',
            text: 'Failed to update barcode data.'
        });
    }
}

// Initial check barcode expiration
async function initialCheckBarcodeExpiration() {
    try {
        const { res, data } = await authFetch('/students/student_barcode');

        if (res.ok) {
            const { barcode, barcode_date_generated } = data.content;
            const now = new Date();
            const dateGenerated = new Date(barcode_date_generated);

            const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
            const generatedDayStart = new Date(dateGenerated.getFullYear(), dateGenerated.getMonth(), dateGenerated.getDate());

            if (todayStart > generatedDayStart) {
                Swal.fire({
                    icon: 'info',
                    title: 'Barcode Expired',
                    text: 'Your barcode has expired please generate a new one!.'
                });
            } else {
                generateBarcode(barcode);
                Swal.fire({
                    icon: 'success',
                    title: 'Barcode Valid',
                    text: 'Your barcode is still valid.'
                });
            }
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Fetch Failed',
                text: data.message || 'Failed to retrieve barcode data.'
            });
        }
    } catch (err) {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: err.message || err
        });
    }
}

// Check barcode expiration (Manual Trigger)
async function checkBarcodeExpiration() {
    try {
        const { res, data } = await authFetch('/students/student_barcode');

        if (res.ok) {
            const { barcode, barcode_date_generated } = data.content;
            const now = new Date();
            const dateGenerated = new Date(barcode_date_generated);

            const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
            const generatedDayStart = new Date(dateGenerated.getFullYear(), dateGenerated.getMonth(), dateGenerated.getDate());

            if (todayStart > generatedDayStart) {
                const newBarcode = generateRandomBarcode();
                generateBarcode(newBarcode);
                Swal.fire({
                    icon: 'success',
                    title: 'Success',
                    text: 'Barcode has been generated.'
                });
                updateStudentBarcode(newBarcode)
            } else {
                generateBarcode(barcode);
                Swal.fire({
                    icon: 'success',
                    title: 'Barcode Valid',
                    text: 'Your barcode is still valid.'
                });
            }
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Fetch Failed',
                text: data.message || 'Failed to retrieve barcode data.'
            });
        }
    } catch (err) {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: err.message || err
        });
    }
}

// Format time
function formatTime(time) {
    if (!time) return '-'
    const [hours, minutes] = time.split(':')
    const h = parseInt(hours, 10)
    const suffix = h >= 12 ? 'PM' : 'AM'
    const hour12 = ((h + 11) % 12 + 1)
    return `${hour12}:${minutes} ${suffix}`
}

// Get attendance history
async function getAttendanceHistory() {
    const attendanceBody = document.getElementById('attendanceBody')
    try {
        const { res, data } = await authFetch('/students/get_attendance_history_record');
        
        if (!res.ok) { 
            return Swal.fire({ 
                icon: 'error', 
                title: 'Error', 
                text: data.message 
            });
        }
        
        if(!data.content || data.content.length === 0) {
            attendanceBody.innerHTML = '<tr><td colspan="5" style="text-align:center">No attendance records found.</td></tr>';
            return;
        }

        attendanceBody.innerHTML = data.content.map(d =>
            `<tr>
                <td>${d.attendance_date.split('T')[0]}</td>
                <td>${formatTime(d.attendance_time)}</td>
                <td>${d.subject || 'N/A'}</td>
                <td>${d.student_firstname} ${d.student_middlename}. ${d.student_lastname}</td>
                <td>${d.student_id_number}</td>
            </tr>`
        ).join('')

    } catch (err) {

        console.error(err);
        Swal.fire({ 
            icon: 'error', 
            title: 'Error', 
            text: err.message || 'Failed to load attendance history.'
        });
    }
}


// Student Settings
let isEditing = false;

async function toggleEdit() {
    isEditing = !isEditing;

    const inputs = ['firstName', 'middleName', 'lastName', 'idNumber', 'yearLevel', 'program'];
    const btn = document.querySelector('.edit-profile-btn');

    inputs.forEach(id => {
        document.getElementById(id).disabled = !isEditing;
    });

    // EDIT MODE
    if (isEditing) {
        btn.textContent = 'Save Changes';
        btn.style.background = '#2c5f5f';
        return;
    }

    // SAVE MODE: Ask for confirmation
    const result = await Swal.fire({
        title: 'Are you sure?',
        text: "Do you want to save these changes?",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, save it!',
        cancelButtonText: 'Cancel'
    });

    if (!result.isConfirmed) {
        // If user cancels, revert back to edit mode
        isEditing = false;
        inputs.forEach(id => {
            document.getElementById(id).disabled = true;
        });
        btn.textContent = 'Edit Profile';
        btn.style.background = '#5fa881'
        return;
    }

    // User confirmed, prepare payload
    const payload = {
        firstName: document.getElementById("firstName").value,
        middleName: document.getElementById("middleName").value,
        lastName: document.getElementById("lastName").value,
        idNumber: document.getElementById("idNumber").value,
        yearLevel: document.getElementById("yearLevel").value,
        program: document.getElementById("program").value
    };

    try {
        const { res, data } = await authFetch("/students/student_update_profile", "PUT", payload);

        if (!res.ok) {
            return Swal.fire({
                icon: 'error',
                title: 'Update Failed',
                text: data.message || 'Something went wrong!',
            });
        }

        btn.textContent = 'Edit Profile';
        btn.style.background = '#5fa881';
        inputs.forEach(id => {
            document.getElementById(id).disabled = true;
        });

        Swal.fire({
            icon: 'success',
            title: 'Profile Updated!',
            text: 'Your profile has been updated successfully.',
            timer: 2000,
            showConfirmButton: true
        })
        .then(() => {
            // Reload Profile Data
            loadProfileData()
        });

    } catch (err) {
        Swal.fire({
            icon: 'error',
            title: 'Update Failed',
            text: err.message
        });
    }
}

function goBack() {
    window.location.href = 'student_dashboard.html';
}

async function updatePassword() {
    const current = document.getElementById('currentPassword').value;
    const newPass = document.getElementById('newPassword').value;
    const confirm = document.getElementById('confirmPassword').value;

    // Frontend validation
    if (!current || !newPass || !confirm) {
        Swal.fire({
            icon: 'warning',
            title: 'Incomplete Fields',
            text: 'Please fill in all password fields.'
        });
        return;
    }

    if (newPass !== confirm) {
        Swal.fire({
            icon: 'error',
            title: 'Password Mismatch',
            text: 'New passwords do not match!'
        });
        return;
    }

    if (newPass.length < 8) {
        Swal.fire({
            icon: 'info',
            title: 'Weak Password',
            text: 'Password must be at least 8 characters long!'
        });
        return;
    }

    try {
        const payload = {
            currentPassword: current,
            newPassword: newPass
        };

        const { res, data } = await authFetch('/students/student_change_password', 'PUT', payload);

        if (!res.ok) {
            Swal.fire({
                icon: 'error',
                title: 'Update Failed',
                text: data.message || 'Failed to update password'
            });
            return;
        }

        // Success alert
        Swal.fire({
            icon: 'success',
            title: 'Password Updated',
            text: data.message || 'Your password has been updated successfully!',
            confirmButtonColor: '#3085d6'
        });

        // Clear inputs ONLY on success
        document.getElementById('currentPassword').value = '';
        document.getElementById('newPassword').value = '';
        document.getElementById('confirmPassword').value = '';

    } catch (err) {
        // Error alert
        Swal.fire({
            icon: 'error',
            title: 'Update Failed',
            text: err.message || 'Something went wrong. Please try again.'
        });
    }
}

function logout() {
    Swal.fire({
        title: 'Are you sure?',
        text: 'You will be logged out of your account.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, log out',
        cancelButtonText: 'Cancel',
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6'
    }).then((result) => {
        if (result.isConfirmed) {
            Swal.fire({
                icon: 'success',
                title: 'Logging out...',
                text: 'See you again!',
                timer: 1500,
                showConfirmButton: false
            });

            setTimeout(() => {
                // clear token
                localStorage.removeItem('student_token');
                window.location.href = 'student_login.html';
            }, 1500);
        }
    });
}