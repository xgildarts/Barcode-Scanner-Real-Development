// ============================================================
// ============================================================
// OFFLINE BANNER
// ============================================================
function showOfflineBanner() {
    let banner = document.getElementById('offlineBanner');
    if (!banner) {
        banner = document.createElement('div');
        banner.id = 'offlineBanner';
        banner.innerHTML = `
            <svg viewBox="0 0 24 24" style="width:16px;height:16px;fill:white;flex-shrink:0">
                <path d="M1 1l22 22-1.41 1.41-2.64-2.64A10.49 10.49 0 0112 23C6.48 23 2 18.52 2 13c0-2.76 1.12-5.26 2.93-7.07L1 2.41 2.41 1zm10 18c.55 0 1-.45 1-1s-.45-1-1-1-1 .45-1 1 .45 1 1 1zm-5.47-5.47l1.42 1.42A4.978 4.978 0 0111 13c0-.55.45-1 1-1s1 .45 1 1l1.42 1.42A6.943 6.943 0 0012 11c-1.48 0-2.84.46-3.95 1.24l-2.52-2.52A9.954 9.954 0 0112 8c2.22 0 4.27.73 5.93 1.95l1.42 1.42C17.55 9.77 14.93 8 12 8 9.74 8 7.67 8.82 6.04 10.23l-1.51-1.51z"/>
            </svg>
            <span>No internet connection</span>`;
        banner.style.cssText = `
            position:fixed; top:0; left:0; right:0; z-index:99999;
            background:#c0392b; color:white; padding:10px 20px;
            display:flex; align-items:center; justify-content:center; gap:10px;
            font-size:13px; font-weight:600; box-shadow:0 2px 8px rgba(0,0,0,0.3);
            transform:translateY(-100%); transition:transform 0.3s ease;`;
        document.body.appendChild(banner);
    }
    requestAnimationFrame(() => banner.style.transform = 'translateY(0)');
}

function hideOfflineBanner() {
    const banner = document.getElementById('offlineBanner');
    if (banner) banner.style.transform = 'translateY(-100%)';
}

window.addEventListener('offline', () => showOfflineBanner());
window.addEventListener('online',  () => {
    hideOfflineBanner();
    Swal.fire({ toast: true, position: 'top-end', icon: 'success', title: 'Back online!', showConfirmButton: false, timer: 2500, timerProgressBar: true });
});

if (!navigator.onLine) showOfflineBanner();


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
// BARCODE / QR CODE
// ============================================================
let _codeType = 'barcode'; // 'barcode' | 'qr'
let _qrInstance = null;

function setCodeType(type) {
    _codeType = type;
    document.getElementById('btnBarcode').classList.toggle('active', type === 'barcode');
    document.getElementById('btnQr').classList.toggle('active', type === 'qr');

    const svg    = document.getElementById('barcodeImage');
    const canvas = document.getElementById('qrCanvas');
    const currentValue = svg.getAttribute('data-value') || canvas.getAttribute('data-value');
    if (currentValue) renderCode(currentValue);
}

function renderCode(value) {
    const svg   = document.getElementById('barcodeImage');
    const qrDiv = document.getElementById('qrCanvas');

    svg.setAttribute('data-value', value);
    qrDiv.setAttribute('data-value', value);

    if (_codeType === 'barcode') {
        svg.style.display   = '';
        qrDiv.style.display = 'none';
        JsBarcode('#barcodeImage', value, {
            format: 'CODE128',
            width: 17,
            height: 1000,
            displayValue: true,
            fontSize: 200,
            margin: 60
        });
    } else {
        svg.style.display   = 'none';
        qrDiv.style.display = '';
        qrDiv.innerHTML = '';
        _qrInstance = new QRCode(qrDiv, {
            text: value,
            width: 130,
            height: 130,
            colorDark: '#1a4545',
            colorLight: '#ffffff',
            correctLevel: QRCode.CorrectLevel.H
        });
    }
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

async function initialCheckBarcodeExpiration() {
    try {
        Swal.fire({ title: 'Checking barcode...', allowOutsideClick: false, didOpen: () => Swal.showLoading() });
        const content = await fetchBarcodeData();
        Swal.close();
        if (!content) return;

        if (isBarcodeExpired(content.barcode_date_generated)) {
            Swal.fire({ icon: 'info', title: 'Code Expired', text: 'Your code has expired. Press "Generate today\'s code" to get a new one.' });
        } else {
            renderCode(content.barcode);
            Swal.fire({ icon: 'success', title: 'Code Valid', text: 'Your code is still valid for today.' });
        }
    } catch (err) {
        Swal.close();
        Swal.fire({ icon: 'error', title: 'Error', text: err.message });
    }
}

async function checkBarcodeExpiration() {
    try {
        const withinRange = await verifyLocation();
        if (!withinRange) return;

        Swal.fire({ title: 'Checking...', allowOutsideClick: false, didOpen: () => Swal.showLoading() });
        const content = await fetchBarcodeData();
        Swal.close();
        if (!content) return;

        if (isBarcodeExpired(content.barcode_date_generated)) {
            const newBarcode = generateRandomBarcode();
            renderCode(newBarcode);
            await updateStudentBarcode(newBarcode);
            Swal.fire({ icon: 'success', title: 'New Code Generated', text: 'Your code is valid for today only.' });
        } else {
            renderCode(content.barcode);
            Swal.fire({ icon: 'success', title: 'Code Valid', text: 'Your code is still valid for today.' });
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