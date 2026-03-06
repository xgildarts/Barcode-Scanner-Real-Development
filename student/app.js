// ============================================================
// CONFIG
// ============================================================
const BASE_URL = 'https://32g7g83w-3000.asse.devtunnels.ms/api/v1';
const TOKEN    = localStorage.getItem('student_token');

// ============================================================
// API
// ============================================================
async function apiCall(endpoint, method = 'GET', body = null) {
    const options = {
        method,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + TOKEN
        }
    };
    if (body) options.body = JSON.stringify(body);

    const res  = await fetch(`${BASE_URL}${endpoint}`, options);
    const data = await res.json();
    return { res, data };
}

// ============================================================
// INIT
// ============================================================
document.addEventListener('DOMContentLoaded', () => {
    checkToken();
    tab('generateBarcode');
    loadProfileData();
    initialCheckBarcodeExpiration();
    getAttendanceHistory();
});

// ============================================================
// AUTH
// ============================================================
async function checkToken() {
    if (!TOKEN) {
        await Swal.fire({ icon: 'error', title: 'Please login first!', text: 'Your session is missing or expired.', allowOutsideClick: false });
        return window.location.href = 'student_login.html';
    }

    try {
        const res  = await fetch(`${BASE_URL}/authentication/verify_token`, {
            method: 'POST',
            headers: { 'Authorization': 'Bearer ' + TOKEN }
        });
        const data = await res.json();

        if (!res.ok) {
            await Swal.fire({ icon: 'error', title: 'Session Expired', text: data.message || 'Please login again.', allowOutsideClick: false });
            window.location.href = 'student_login.html';
        }
    } catch (err) {
        Swal.fire({ icon: 'error', title: 'Error', text: err.message || 'Something went wrong.' });
    }
}

function logout() {
    Swal.fire({
        title: 'Are you sure?',
        text: 'You will be logged out of your account.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, log out',
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6'
    }).then(result => {
        if (!result.isConfirmed) return;
        Swal.fire({ icon: 'success', title: 'Logging out...', text: 'See you again!', timer: 1500, showConfirmButton: false });
        setTimeout(() => {
            localStorage.removeItem('student_token');
            window.location.href = 'student_login.html';
        }, 1500);
    });
}

// ============================================================
// NAVIGATION
// ============================================================
const TAB_TITLES = {
    generateBarcode:   'Barcode Generation',
    attendanceHistory: 'Attendance History',
    settings:          'Settings'
};

function tab(tabName) {
    document.getElementById('title').textContent = TAB_TITLES[tabName] || tabName;

    Object.keys(TAB_TITLES).forEach(t => {
        document.getElementById(t).classList.toggle('active', t === tabName);
    });

    const isSettings = tabName === 'settings';
    document.getElementById('actionButtons').classList.toggle('hide', isSettings);
    document.getElementById('goBackBtn').classList.toggle('show', isSettings);
}

function goBackBtn() {
    tab('generateBarcode');
}

// ============================================================
// PROFILE
// ============================================================
async function loadProfileData() {
    try {
        Swal.fire({ title: 'Loading profile...', allowOutsideClick: false, didOpen: () => Swal.showLoading() });
        const { res, data } = await apiCall('/students/student_get_data');
        Swal.close();

        if (!res.ok) {
            Swal.close();
            Swal.fire({ icon: 'error', title: 'Error', text: data.message })
                .then(() => window.location.href = 'student_login.html');
            return;
        }

        const {
            student_id_number,
            student_firstname,
            student_middlename,
            student_lastname,
            student_year_level,
            student_program
        } = data.contents[0];

        const fullName = `${student_firstname} ${student_middlename}. ${student_lastname}`;

        document.querySelectorAll('.profile-info').forEach(p => {
            p.innerHTML = `
                <div class="profile-name">${fullName}</div>
                <div class="profile-id">${student_id_number}</div>
                <div class="profile-course">${student_program}</div>
                <div class="profile-year">${student_year_level}</div>
            `;
        });

        document.getElementById('firstName').value  = student_firstname;
        document.getElementById('middleName').value = student_middlename;
        document.getElementById('lastName').value   = student_lastname;
        document.getElementById('idNumber').value   = student_id_number;
        document.getElementById('yearLevel').value  = student_year_level;
        document.getElementById('program').value    = student_program;

    } catch (err) {
        Swal.close();
        console.error(err);
    }
}

// ============================================================
// LOCATION VERIFICATION
// ============================================================

// Get student's current GPS coordinates
function getStudentCoordinates() {
    return new Promise((resolve, reject) => {
        if (!navigator.geolocation) {
            return reject(new Error('Geolocation is not supported by your browser.'));
        }
        navigator.geolocation.getCurrentPosition(
            pos => resolve({ latitude: pos.coords.latitude, longitude: pos.coords.longitude }),
            err => reject(new Error('Unable to retrieve your location. Please enable GPS.')),
            { enableHighAccuracy: true, timeout: 10000 }
        );
    });
}

// Returns true if within range, false otherwise — shows error if out of range
async function verifyLocation() {
    Swal.fire({ title: 'Checking your location...', allowOutsideClick: false, didOpen: () => Swal.showLoading() });

    let coords;
    try {
        coords = await getStudentCoordinates();
    } catch (err) {
        Swal.fire({ icon: 'error', title: 'Location Error', text: err.message });
        return false;
    }

    const { res, data } = await apiCall('/students/verify_location', 'POST', {
        latitude:  coords.latitude,
        longitude: coords.longitude
    });

    Swal.close();

    if (!res.ok || !data.withinRange) {
        Swal.fire({
            icon: 'error',
            title: 'Out of Range',
            text: data.message || 'You are too far from the classroom to generate a barcode.',
            confirmButtonColor: '#d33'
        });
        return false;
    }

    return true;
}

// ============================================================
// BARCODE
// ============================================================
function renderBarcode(value) {
    JsBarcode('#barcodeImage', value, {
        format: 'CODE128',
        width: 15,
        height: 1000,
        displayValue: true,
        fontSize: 200,
        margin: 60
    });
}

function generateRandomBarcode() {
    return 'BC' + Date.now() + Math.floor(1000 + Math.random() * 9000);
}

function isBarcodeExpired(barcode_date_generated) {
    const now        = new Date();
    const generated  = new Date(barcode_date_generated);
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const genStart   = new Date(generated.getFullYear(), generated.getMonth(), generated.getDate());
    return todayStart > genStart;
}

async function fetchBarcodeData() {
    const { res, data } = await apiCall('/students/student_barcode');
    if (!res.ok) {
        Swal.fire({ icon: 'error', title: 'Fetch Failed', text: data.message || 'Failed to retrieve barcode data.' });
        return null;
    }
    return data.content;
}

async function updateStudentBarcode(barcode) {
    const { res, data } = await apiCall('/students/update_student_barcode', 'PUT', { barcode });
    if (!res.ok) Swal.fire({ icon: 'error', title: 'Error', text: data.message });
}

// On page load — show existing barcode or notify if expired
async function initialCheckBarcodeExpiration() {
    try {
        // Only show existing barcode on load — no location check needed here
        // Location is only enforced when generating a new one
        Swal.fire({ title: 'Checking barcode...', allowOutsideClick: false, didOpen: () => Swal.showLoading() });
        const content = await fetchBarcodeData();
        Swal.close();
        if (!content) return;

        if (isBarcodeExpired(content.barcode_date_generated)) {
            Swal.fire({ icon: 'info', title: 'Barcode Expired', text: 'Your barcode has expired. Press "Generate today\'s barcode" to get a new one.' });
        } else {
            renderBarcode(content.barcode);
            Swal.fire({ icon: 'success', title: 'Barcode Valid', text: 'Your barcode is still valid for today.' });
        }
    } catch (err) {
        Swal.close();
        Swal.fire({ icon: 'error', title: 'Error', text: err.message });
    }
}

// Manual trigger — location check → generate new if expired, show existing if still valid
async function checkBarcodeExpiration() {
    try {
        // 1. Verify student is within teacher's allowed radius before anything else
        const withinRange = await verifyLocation();
        if (!withinRange) return;

        // 2. Check if current barcode is still valid for today
        Swal.fire({ title: 'Checking barcode...', allowOutsideClick: false, didOpen: () => Swal.showLoading() });
        const content = await fetchBarcodeData();
        Swal.close();
        if (!content) return;

        if (isBarcodeExpired(content.barcode_date_generated)) {
            // Expired — generate a fresh one
            const newBarcode = generateRandomBarcode();
            renderBarcode(newBarcode);
            await updateStudentBarcode(newBarcode);
            Swal.fire({ icon: 'success', title: 'New Barcode Generated', text: 'Your barcode is valid for today only.' });
        } else {
            // Still valid — just display it
            renderBarcode(content.barcode);
            Swal.fire({ icon: 'success', title: 'Barcode Valid', text: 'Your barcode is still valid for today.' });
        }
    } catch (err) {
        Swal.close();
        Swal.fire({ icon: 'error', title: 'Error', text: err.message });
    }
}

// ============================================================
// ATTENDANCE HISTORY
// ============================================================
const formatTime = (time) => {
    if (!time) return '-';
    const [h, m] = time.split(':');
    const hour   = parseInt(h, 10);
    return `${((hour + 11) % 12 + 1)}:${m} ${hour >= 12 ? 'PM' : 'AM'}`;
};

async function getAttendanceHistory() {
    const body = document.getElementById('attendanceBody');
    try {
        Swal.fire({ title: 'Loading attendance...', allowOutsideClick: false, didOpen: () => Swal.showLoading() });
        const { res, data } = await apiCall('/students/get_attendance_history_record');
        Swal.close();

        if (!res.ok) { Swal.close(); return Swal.fire({ icon: 'error', title: 'Error', text: data.message }); }

        if (!data.content || data.content.length === 0) {
            body.innerHTML = '<tr><td colspan="5" style="text-align:center">No attendance records found.</td></tr>';
            return;
        }

        body.innerHTML = data.content.map(d => `
            <tr>
                <td>${d.attendance_date.split('T')[0]}</td>
                <td>${formatTime(d.attendance_time)}</td>
                <td>${d.subject || 'N/A'}</td>
                <td>${d.student_firstname} ${d.student_middlename}. ${d.student_lastname}</td>
                <td>${d.student_id_number}</td>
            </tr>
        `).join('');

    } catch (err) {
        Swal.close();
        Swal.fire({ icon: 'error', title: 'Error', text: err.message || 'Failed to load attendance history.' });
    }
}

// ============================================================
// SETTINGS — PROFILE EDIT
// ============================================================
let isEditing = false;

async function toggleEdit() {
    isEditing = !isEditing;

    const fieldIds = ['firstName', 'middleName', 'lastName', 'idNumber', 'yearLevel', 'program'];
    const btn      = document.querySelector('.edit-profile-btn');

    fieldIds.forEach(id => document.getElementById(id).disabled = !isEditing);

    if (isEditing) {
        btn.textContent      = 'Save Changes';
        btn.style.background = '#2c5f5f';
        return;
    }

    const result = await Swal.fire({
        title: 'Save changes?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, save it!'
    });

    if (!result.isConfirmed) {
        // User cancelled — go back to edit mode
        isEditing = true;
        fieldIds.forEach(id => document.getElementById(id).disabled = false);
        return;
    }

    const payload = {
        firstName:  document.getElementById('firstName').value,
        middleName: document.getElementById('middleName').value,
        lastName:   document.getElementById('lastName').value,
        idNumber:   document.getElementById('idNumber').value,
        yearLevel:  document.getElementById('yearLevel').value,
        program:    document.getElementById('program').value
    };

    try {
        Swal.fire({ title: 'Saving profile...', allowOutsideClick: false, didOpen: () => Swal.showLoading() });
        const { res, data } = await apiCall('/students/student_update_profile', 'PUT', payload);
        Swal.close();

        if (!res.ok) { Swal.close(); return Swal.fire({ icon: 'error', title: 'Update Failed', text: data.message || 'Something went wrong.' }); }

        btn.textContent      = 'Edit Profile';
        btn.style.background = '#5fa881';
        fieldIds.forEach(id => document.getElementById(id).disabled = true);

        Swal.fire({ icon: 'success', title: 'Profile Updated!', timer: 2000, showConfirmButton: true })
            .then(() => loadProfileData());

    } catch (err) {
        Swal.close();
        Swal.fire({ icon: 'error', title: 'Update Failed', text: err.message });
    }
}

// ============================================================
// SETTINGS — PASSWORD
// ============================================================
async function updatePassword() {
    const current = document.getElementById('currentPassword').value;
    const newPass = document.getElementById('newPassword').value;
    const confirm = document.getElementById('confirmPassword').value;

    if (!current || !newPass || !confirm)
        return Swal.fire({ icon: 'warning', title: 'Incomplete Fields', text: 'Please fill in all password fields.' });

    if (newPass !== confirm)
        return Swal.fire({ icon: 'error', title: 'Password Mismatch', text: 'New passwords do not match.' });

    if (newPass.length < 8)
        return Swal.fire({ icon: 'info', title: 'Weak Password', text: 'Password must be at least 8 characters long.' });

    try {
        Swal.fire({ title: 'Updating password...', allowOutsideClick: false, didOpen: () => Swal.showLoading() });
        const { res, data } = await apiCall('/students/student_change_password', 'PUT', { currentPassword: current, newPassword: newPass });
        Swal.close();

        if (!res.ok) { Swal.close(); return Swal.fire({ icon: 'error', title: 'Update Failed', text: data.message || 'Failed to update password.' }); }

        Swal.fire({ icon: 'success', title: 'Password Updated', text: data.message || 'Your password has been updated successfully.' });
        document.getElementById('currentPassword').value = '';
        document.getElementById('newPassword').value     = '';
        document.getElementById('confirmPassword').value = '';

    } catch (err) {
        Swal.close();
        Swal.fire({ icon: 'error', title: 'Update Failed', text: err.message || 'Something went wrong.' });
    }
}