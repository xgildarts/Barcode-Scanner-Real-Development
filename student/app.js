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

// ============================================================
// DEVICE INFO — collected once, reused on every request
// ============================================================
let _cachedDeviceInfo = null;
async function getDeviceInfo() {
    try {
        if (navigator.userAgentData) {
            const data = await navigator.userAgentData.getHighEntropyValues([
                'model', 'platform', 'platformVersion', 'mobile'
            ]).catch(() => ({}));
            const model    = (data.model || '').trim();
            const platform = (data.platform || navigator.userAgentData.platform || '').trim();
            const ver      = (data.platformVersion || '').split('.')[0];
            const brands   = navigator.userAgentData.brands || [];
            // Include Chromium as fallback brand
            const browser  = brands.find(b => /chrome|edge|opera/i.test(b.brand) && !/chromium/i.test(b.brand))
                          || brands.find(b => /chromium/i.test(b.brand));
            const browserStr = browser
                ? browser.brand.replace('Google Chrome','Chrome').replace('Microsoft Edge','Edge') + ' ' + browser.version.split('.')[0]
                : '';
            const osStr = platform + (ver && ver !== '0' ? ' ' + ver : '');
            // Only trust modern path if platform is a real OS name (not empty, not generic Linux)
            if (platform && platform !== 'Linux') {
                const parts = [browserStr, osStr, model].filter(Boolean);
                if (parts.length > 0) return parts.join(' \u00b7 ');
            }
        }
    } catch (_) {}
    return parseUAString(navigator.userAgent);
}

function parseUAString(ua) {
    if (!ua) return 'Unknown Device';
    // Chrome's frozen/reduced UA on desktop contains "Android 6.0; Nexus 5" as a fake placeholder.
    // Detect this by checking if the UA also contains "Windows NT" or "Macintosh" — meaning
    // the Android token is fake. Strip it and re-parse.
    if (/Android/i.test(ua) && (/Windows NT/i.test(ua) || /Macintosh/i.test(ua))) {
        ua = ua.replace(/\(Linux;[^)]*Android[^)]*\)\s*/i, '');
    }
    let browser = 'Browser', os = '';
    if (ua.indexOf('Edg/') !== -1)               browser = 'Edge';
    else if (ua.indexOf('OPR/') !== -1)          browser = 'Opera';
    else if (ua.indexOf('SamsungBrowser') !== -1) browser = 'Samsung Browser';
    else if (ua.indexOf('Chrome/') !== -1)       browser = 'Chrome';
    else if (ua.indexOf('Firefox/') !== -1)      browser = 'Firefox';
    else if (ua.indexOf('Safari/') !== -1)       browser = 'Safari';
    if (ua.indexOf('Windows NT 10') !== -1)        os = 'Windows 10/11';
    else if (ua.indexOf('Windows NT 6.3') !== -1) os = 'Windows 8.1';
    else if (ua.indexOf('Windows NT 6') !== -1)    os = 'Windows 7/8';
    else if (ua.indexOf('Android') !== -1) {
        const vMatch = ua.match(/Android ([0-9.]+)/);
        const mMatch = ua.match(/Android[^;]+;\s*([^)]+)\)/);
        const raw = mMatch ? mMatch[1].replace(/\s*Build\/.*$/, '').trim() : '';
        os = 'Android' + (vMatch ? ' ' + vMatch[1] : '');
        if (raw && raw !== 'K') return browser + ' \u00b7 ' + os + ' \u00b7 ' + raw;
    }
    else if (ua.indexOf('iPhone') !== -1 || ua.indexOf('iPad') !== -1) {
        const vMatch = ua.match(/OS ([0-9_]+)/);
        os = 'iOS' + (vMatch ? ' ' + vMatch[1].replace(/_/g, '.') : '');
    }
    else if (ua.indexOf('Mac OS X') !== -1) {
        const vMatch = ua.match(/Mac OS X ([0-9_]+)/);
        os = 'macOS' + (vMatch ? ' ' + vMatch[1].replace(/_/g, '.') : '');
    }
    else if (ua.indexOf('Linux') !== -1) os = 'Linux';
    // Get browser version from UA for the fallback path
    const verMatch = ua.match(/(?:Chrome|Firefox|Safari|OPR|Edg)\/([0-9]+)/);
    const browserVer = verMatch ? ' ' + verMatch[1] : '';
    return (browser + browserVer + (os ? ' \u00b7 ' + os : '')) || ua.substring(0, 80);
}

const BASE_URL = 'https://32g7g83w-3000.asse.devtunnels.ms/api/v1';
const TOKEN    = localStorage.getItem('student_token');

// ============================================================
// API
// ============================================================
async function apiCall(endpoint, method = 'GET', body = null) {
    const deviceInfo = localStorage.getItem('student_device_info') || '';
    const options = {
        method,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + TOKEN
        }
    };
    // Auto-inject device_info into all POST/PUT request bodies
    if (method === 'POST' || method === 'PUT') {
        options.body = JSON.stringify({ ...(body || {}), device_info: deviceInfo });
    } else if (body) {
        options.body = JSON.stringify(body);
    }

    const res  = await fetch(`${BASE_URL}${endpoint}`, options);
    const data = await res.json();
    return { res, data };
}

// ============================================================
// INIT
// ============================================================
document.addEventListener('DOMContentLoaded', async () => {
    // Sequential startup: await each async step so Swals don't race/overwrite each other
    await checkToken();
    tab('generateBarcode');
    await loadProfileData();   // has its own loading Swal — must finish before barcode check
    getAttendanceHistory();    // no Swal, safe to run concurrently
    await initialCheckBarcodeExpiration(); // barcode Swal shows last, stays visible
});

// ============================================================
// AUTH
// ============================================================
// FIX: centralised session cleanup
function clearSessionAndRedirect() {
    localStorage.removeItem('student_token');
    localStorage.removeItem('student_device_info');
    window.location.href = 'student_login.html';
}

async function checkToken() {
    if (!TOKEN) {
        await Swal.fire({ icon: 'error', title: 'Please login first!', text: 'Your session is missing or expired.', allowOutsideClick: false });
        return clearSessionAndRedirect(); // FIX: clear token before redirect
    }

    try {
        const res  = await fetch(`${BASE_URL}/authentication/verify_token`, {
            method: 'POST',
            headers: { 'Authorization': 'Bearer ' + TOKEN }
        });
        const data = await res.json();

        if (!res.ok) {
            await Swal.fire({ icon: 'error', title: 'Session Expired', text: data.message || 'Please login again.', allowOutsideClick: false });
            clearSessionAndRedirect(); // FIX: clear token before redirect
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
    }).then(async result => {
        if (!result.isConfirmed) return;
        Swal.fire({ icon: 'success', title: 'Logging out...', text: 'See you again!', timer: 1500, showConfirmButton: false });
        try {
            await apiCall('/students/logout', 'POST', { device_info: localStorage.getItem('student_device_info') || '' });
        } catch (_) {}
        localStorage.removeItem('student_token');
        localStorage.removeItem('student_device_info');
        clearSessionAndRedirect(); // FIX: clear token before redirect
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

    // Toggle sections
    Object.keys(TAB_TITLES).forEach(t => {
        document.getElementById(t)?.classList.toggle('active', t === tabName);
        // Also toggle active on the nav button (prefixed with btn-)
        document.getElementById('btn-' + t)?.classList.toggle('active', t === tabName);
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
                .then(() => clearSessionAndRedirect()); // FIX
            return;
        }

        const {
            student_id_number,
            student_firstname,
            student_middlename,
            student_lastname,
            student_year_level,
            student_program,
            student_profile_picture
        } = data.contents[0];

        const mid = student_middlename ? student_middlename.charAt(0).toUpperCase() + '.' : '';
        const fullName = `${student_firstname}${mid ? ' ' + mid : ''} ${student_lastname}`.trim();

        // Load saved profile picture if available
        if (student_profile_picture) {
            setStudentAvatar(`${BASE_URL}/uploads/profile_pictures/${student_profile_picture}`);
        }

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
        latitude:       coords.latitude,
        longitude:      coords.longitude,
        teacher_serial: _selectedTeacherSerial  // prevents bypass via a different enrolled teacher
    });

    Swal.close();

    // If teacher hasn't set a location yet, allow barcode generation anyway
    if (!res.ok) {
        const msg = data?.message || '';
        if (msg.toLowerCase().includes('location') || msg.toLowerCase().includes('not set')) {
            Swal.close();
            return true; // no location set — skip check, let student generate
        }
        Swal.fire({ icon: 'error', title: 'Error', text: msg || 'Something went wrong.', confirmButtonColor: '#d33' });
        return false;
    }

    if (!data.withinRange) {
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
let _selectedTeacherSerial = null; // set when student picks a class


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
    if (!barcode_date_generated) return true; // never generated → treat as expired
    const now        = new Date();
    const generated  = new Date(barcode_date_generated);
    if (isNaN(generated.getTime())) return true; // invalid date → treat as expired
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
    const { res, data } = await apiCall('/students/update_student_barcode', 'PUT', { barcode, teacher_serial: _selectedTeacherSerial });
    if (!res.ok) Swal.fire({ icon: 'error', title: 'Error', text: data.message });
}

async function initialCheckBarcodeExpiration() {
    try {
        Swal.fire({ title: 'Checking barcode...', allowOutsideClick: false, didOpen: () => Swal.showLoading() });
        const content = await fetchBarcodeData();
        Swal.close();
        if (!content) return;

        if (!content.barcode) {
            Swal.fire({ icon: 'info', title: 'No Code Yet', text: 'Press "Generate today\'s code" to get your first barcode.' });
        } else if (isBarcodeExpired(content.barcode_date_generated)) {
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

async function pickTeacherThenGenerate() {
    // Try to fetch enrolled teachers
    // If endpoint not available or student not enrolled, skip picker and go straight
    try {
        const { res, data } = await apiCall('/students/enrolled_teachers');

        if (res.ok && data.content && data.content.length > 0) {
            const teachers = data.content;

            if (teachers.length === 1) {
                // Only one teacher — skip picker
                _selectedTeacherSerial = teachers[0].teacher_barcode_scanner_serial_number;
            } else {
                // Multiple teachers — show picker
                const options = {};
                teachers.forEach((t, i) => {
                    const label = t.subject ? `${t.teacher_name} — ${t.subject}` : t.teacher_name;
                    options[i] = label;
                });
                const { value } = await Swal.fire({
                    title: 'Select your class',
                    input: 'select',
                    inputOptions: options,
                    inputPlaceholder: 'Choose a teacher/subject',
                    showCancelButton: true,
                    confirmButtonText: 'Continue',
                    confirmButtonColor: '#1e3a5f',
                    inputValidator: (v) => v === '' ? 'Please select a class' : null
                });
                if (value === undefined) return; // user cancelled
                _selectedTeacherSerial = teachers[parseInt(value)].teacher_barcode_scanner_serial_number;
            }
        }
        // If endpoint fails or no teachers found, _selectedTeacherSerial stays null
        // verifyLocation will still run — backend falls back to first enrolled teacher
    } catch (_) {
        // Endpoint not available — proceed without teacher selection
    }

    await checkBarcodeExpiration();
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
            await updateStudentBarcode(content.barcode);
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
            body.innerHTML = '<tr><td colspan="6" style="text-align:center">No attendance records found.</td></tr>';
            return;
        }

        body.innerHTML = data.content.map(d => {
            const status = d.attendance_status || 'Present';
            const statusColor = { Present: '#27ae60', Late: '#e67e22', Absent: '#e74c3c', Excused: '#8e44ad' }[status] || '#555';
            return `
            <tr>
                <td>${d.attendance_date ? String(d.attendance_date).split('T')[0] : '—'}</td>
                <td>${formatTime(d.attendance_time)}</td>
                <td>${d.subject || 'N/A'}</td>
                <td>${d.student_firstname || ''}${d.student_middlename ? ' ' + d.student_middlename.charAt(0).toUpperCase() + '.' : ''} ${d.student_lastname || ''}</td>
                <td>${d.student_id_number || '—'}</td>
                <td><span style="color:${statusColor};font-weight:600">${status}</span></td>
            </tr>`;
        }).join('');

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
// ============================================================
// MAINTENANCE MODE POLLING
// ============================================================
let _maintenancePollInterval = null;
let _maintenanceActive = false;

async function checkMaintenanceMode() {
    try {
        const res  = await fetch(`${BASE_URL}/system/maintenance`);
        const data = await res.json();
        if (data.maintenance && !_maintenanceActive) {
            _maintenanceActive = true;
            showMaintenanceBanner();
        } else if (!data.maintenance && _maintenanceActive) {
            _maintenanceActive = false;
            hideMaintenanceBanner();
        }
    } catch (_) {}
}

function showMaintenanceBanner() {
    document.getElementById('maintenanceBanner')?.remove();
    const banner = document.createElement('div');
    banner.id = 'maintenanceBanner';
    banner.innerHTML = `
        <svg viewBox="0 0 24 24" style="width:20px;height:20px;fill:#fff;flex-shrink:0;">
            <path d="M22.7 19l-9.1-9.1c.9-2.3.4-5-1.5-6.9-2-2-5-2.4-7.4-1.3L9 6 6 9 1.6 4.7C.4 7.1.9 10.1 2.9 12.1c1.9 1.9 4.6 2.4 6.9 1.5l9.1 9.1c.4.4 1 .4 1.4 0l2.3-2.3c.5-.4.5-1.1.1-1.4z"/>
        </svg>
        <div>
            <div style="font-weight:800;font-size:0.9rem;">🔧 System Maintenance</div>
            <div style="font-size:0.78rem;opacity:0.9;margin-top:2px;">The system is under maintenance. All actions are temporarily disabled.</div>
        </div>`;
    banner.style.cssText = `
        position:fixed;top:0;left:0;right:0;z-index:99999;
        background:linear-gradient(135deg,#c0392b,#e74c3c);color:#fff;
        padding:14px 20px;display:flex;align-items:center;gap:14px;
        box-shadow:0 4px 20px rgba(0,0,0,0.35);font-family:inherit;`;
    document.body.prepend(banner);
    const overlay = document.createElement('div');
    overlay.id = 'maintenanceOverlay';
    overlay.style.cssText = 'position:fixed;inset:0;z-index:99998;background:rgba(0,0,0,0.35);cursor:not-allowed;';
    overlay.addEventListener('click', e => e.stopPropagation());
    document.body.appendChild(overlay);
    Swal.fire({
        icon: 'warning',
        title: '🔧 System Maintenance',
        html: 'The system is currently under maintenance.<br>All actions are temporarily disabled.<br><br><strong>Please wait for maintenance to complete.</strong>',
        allowOutsideClick: false,
        showConfirmButton: false,
    });
}

function hideMaintenanceBanner() {
    document.getElementById('maintenanceBanner')?.remove();
    document.getElementById('maintenanceOverlay')?.remove();
    Swal.close();
    Swal.fire({ icon:'success', title:'System Online', text:'Maintenance is complete. You can continue.', timer:3000, showConfirmButton:false });
}

checkMaintenanceMode();
_maintenancePollInterval = setInterval(checkMaintenanceMode, 15000);
// ============================================================
// APPEARANCE — Dark mode, Font family, Text size
// ============================================================
const S_THEME_KEY = 'student_theme';

function sLoadTheme() {
    const saved = JSON.parse(localStorage.getItem(S_THEME_KEY) || '{}');
    sApplyTheme(saved.mode || 'light', saved.font || 'system', saved.size || 'medium', false);
}

function sApplyTheme(mode, font, size, save = true) {
    const html = document.documentElement;

    // Dark / light
    html.setAttribute('data-theme', mode === 'dark' ? 'dark' : '');

    // Font family
    const fontMap = {
        system:  "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        inter:   "'Inter', sans-serif",
        poppins: "'Poppins', sans-serif",
        roboto:  "'Roboto', sans-serif",
        mono:    "'JetBrains Mono', 'Fira Code', monospace"
    };
    document.body.style.fontFamily = fontMap[font] || fontMap.system;

    // Text size via zoom on sections
    const zoomMap = { small: '0.88', medium: '1', large: '1.12' };
    document.querySelectorAll('.sections').forEach(el => {
        el.style.zoom = zoomMap[size] || '1';
    });

    // Sync button active states
    document.querySelectorAll('.s-mode-btn').forEach(b => b.classList.remove('s-active'));
    document.getElementById(mode === 'dark' ? 's-modeDark' : 's-modeLight')?.classList.add('s-active');
    document.querySelectorAll('.s-font-btn').forEach(b => b.classList.toggle('s-active', b.dataset.font === font));
    document.querySelectorAll('.s-size-btn').forEach(b => b.classList.toggle('s-active', b.dataset.size === size));

    if (save) localStorage.setItem(S_THEME_KEY, JSON.stringify({ mode, font, size }));
}

function sSetMode(mode) {
    const saved = JSON.parse(localStorage.getItem(S_THEME_KEY) || '{}');
    sApplyTheme(mode, saved.font || 'system', saved.size || 'medium');
}
function sSetFont(font) {
    const saved = JSON.parse(localStorage.getItem(S_THEME_KEY) || '{}');
    sApplyTheme(saved.mode || 'light', font, saved.size || 'medium');
}
function sSetSize(size) {
    const saved = JSON.parse(localStorage.getItem(S_THEME_KEY) || '{}');
    sApplyTheme(saved.mode || 'light', saved.font || 'system', size);
}

// Load on startup
sLoadTheme();

// ============================================================
// PROFILE PICTURE UPLOAD
// ============================================================

function setStudentAvatar(url) {
    document.querySelectorAll('.avatar').forEach(av => {
        av.innerHTML = `<img src="${url}"
            style="width:100%;height:100%;object-fit:cover;border-radius:50%;"
            onerror="this.parentElement.innerHTML='<svg viewBox=\'0 0 24 24\'><path d=\'M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z\'/></svg>'"
            alt="Profile">`;
    });
}

// Wire camera icons and avatar clicks → open file picker
document.querySelectorAll('.camera-icon').forEach(icon => {
    icon.addEventListener('click', (e) => {
        e.stopPropagation();
        document.getElementById('studentProfilePicInput')?.click();
    });
});

document.querySelectorAll('.avatar').forEach(av => {
    av.addEventListener('click', () => {
        document.getElementById('studentProfilePicInput')?.click();
    });
});

// File selected → preview instantly then upload
// Wrap with crop modal
if (typeof initImageCrop === 'function') {
    const _studentPicInput = document.getElementById('studentProfilePicInput');
    if (_studentPicInput) {
        initImageCrop(_studentPicInput, async (blob, dataUrl) => {
            setStudentAvatar(dataUrl);
            const token = localStorage.getItem('student_token');
            const croppedFile = new File([blob], 'profile.jpg', { type: 'image/jpeg' });
            const formData = new FormData();
            formData.append('student_profile_picture', croppedFile);
            Swal.fire({ title: 'Uploading...', allowOutsideClick: false, didOpen: () => Swal.showLoading() });
            try {
                const res = await fetch(`${BASE_URL}/students/upload_profile_picture`, {
                    method: 'POST', headers: { 'Authorization': 'Bearer ' + TOKEN }, body: formData
                });
                const data = await res.json();
                Swal.close();
                if (res.ok && data.ok) {
                    setStudentAvatar(`${BASE_URL}/uploads/profile_pictures/${data.filename}`);
                    Swal.fire({ icon: 'success', title: 'Profile picture updated!', timer: 1500, showConfirmButton: false });
                } else {
                    Swal.fire({ icon: 'error', title: 'Upload failed', text: data.message || 'Please try again.' });
                }
            } catch (err) { Swal.close(); Swal.fire({ icon: 'error', title: 'Upload failed', text: err.message }); }
        });
    }
}
document.getElementById('studentProfilePicInput')?.addEventListener('change', async function () {
    if (typeof initImageCrop === 'function') return; // handled by crop
    const file = this.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024)
        return Swal.fire({ icon: 'warning', title: 'File too large', text: 'Please choose an image under 5MB.' });

    // Instant local preview before server responds
    const reader = new FileReader();
    reader.onload = e => setStudentAvatar(e.target.result);
    reader.readAsDataURL(file);

    const token    = localStorage.getItem('student_token');
    const formData = new FormData();
    formData.append('student_profile_picture', file);

    Swal.fire({ title: 'Uploading...', allowOutsideClick: false, didOpen: () => Swal.showLoading() });

    try {
        const res  = await fetch(`${BASE_URL}/students/upload_profile_picture`, {
            method:  'POST',
            headers: { 'Authorization': 'Bearer ' + token },
            body:    formData
        });
        const data = await res.json();
        Swal.close();

        if (res.ok && data.ok) {
            setStudentAvatar(`${BASE_URL}/uploads/profile_pictures/${data.filename}`);
            Swal.fire({ icon: 'success', title: 'Profile picture updated!', timer: 1500, showConfirmButton: false });
        } else {
            Swal.fire({ icon: 'error', title: 'Upload failed', text: data.message || 'Please try again.' });
        }
    } catch (err) {
        Swal.close();
        Swal.fire({ icon: 'error', title: 'Upload failed', text: err.message || 'Network error.' });
    }

    // Reset so the same file can be re-selected if needed
    this.value = '';
});