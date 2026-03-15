// ============================================================
// CONSTANTS & CONFIG
// ============================================================
const URL_BASED = 'https://32g7g83w-3000.asse.devtunnels.ms/api/v1';
const TOKEN = localStorage.getItem('super_admin_token');

const PAGES = [
    'dashboard',
    'eventAttendance',
    'eventAttendanceHistory',
    'adminSettings',
    'studentAccountManagement',
    'teacherAccountManagement',
    'guardAccountManagement',
    'academicSetup',
    'registration',
    'adminAccountManagement',
    'loginLogs',
    'activityLogs'
];

const PAGE_TITLES = {
    dashboard: 'Dashboard',
    eventAttendance: 'Event Attendance',
    eventAttendanceHistory: 'Event Attendance History',
    adminSettings: 'Settings',
    studentAccountManagement: 'Student Accounts',
    teacherAccountManagement: 'Teacher Accounts',
    guardAccountManagement: 'Guard Accounts',
    academicSetup: 'Academic Setup',
    registration: 'Registration',
    adminAccountManagement: 'Admin Accounts',
    loginLogs: 'Login Logs',
    activityLogs: 'Activity Logs'
};

// ============================================================
// DOM REFERENCES
// ============================================================
const DOM = {
    // Sidebar & Navigation
    sidebar: document.getElementById('sidebar'),
    sidebarOverlay: document.getElementById('sidebarOverlay'),
    menuBtn: document.querySelector('.menu-btn'),
    titleHeader: document.getElementById('titleHeader'),

    // Dashboard Stats
    statsValue: document.getElementById('statsValue'),
    sideBarStatsValue: document.getElementById('sideBarStatsValue'),
    studentAccountCounts: document.getElementById('studentAccountCounts'),
    teacherAccountCounts: document.getElementById('teacherAccountCounts'),
    guardAccountCounts: document.getElementById('guardAccountCounts'),
    adminAccountCounts: document.getElementById('adminAccountCounts'),

    // Lists
    studentsList: document.getElementById('studentsList'),
    teacherList: document.getElementById('teacherList'),
    guardList: document.getElementById('guardList'),

    // Attendance
    attendanceBody: document.getElementById('attendanceBody'),
    attendanceHistory: document.getElementById('attendanceHistory'),
    searchFilterEventAttendance: document.getElementById('searchFilterEventAttendance'),
    searchFilterEventAttendanceHistory: document.getElementById('searchFilterEventAttendanceHistory'),
    eventHistoryYearFilter: document.getElementById('eventHistoryYearFilter'),

    // Profile / Settings
    sideBarName: document.querySelector('.sidebar-name'),
    profileName: document.querySelector('.profile-name'),
    adminProfileName: document.getElementById('adminProfileName'),
    profileEmailTop: document.getElementById('profileEmailTop'),

    // Chart
    chartCanvas: document.getElementById('myChart'),

    // Student modal fields
    studentAccountManagementModal: document.getElementById('studentAccountManagementModal'),
    studentAccountManagementForm: document.getElementById('studentAccountManagementForm'),
    studentIDTracking: document.getElementById('studentIDTracking'),
    studentIdNumber: document.getElementById('studentIdNumber'),
    studentFirstName: document.getElementById('studentFirstName'),
    studentMiddleName: document.getElementById('studentMiddleName'),
    studentLastName: document.getElementById('studentLastName'),
    studentProgram: document.getElementById('studentProgram'),
    studentYearLevel: document.getElementById('studentYearLevel'),

    // Teacher modal fields
    teacherAccountManagementModal: document.getElementById('teacherAccountManagementModal'),
    teacherAccountManagementForm: document.getElementById('teacherAccountManagementForm'),
    teacherIDTracking: document.getElementById('teacherIDTracking'),
    teacherIdNumber: document.getElementById('teacherIdNumber'),
    teacherFullName: document.getElementById('teacherFullName'),
    teacherEmail: document.getElementById('teacherEmail'),
    teacherProgram: document.getElementById('teacherProgram'),
    teacherBarcodeSerialNumber: document.getElementById('teacherBarcodeSerialNumber'),

    // Guard modal fields
    guardAccountManagementModal: document.getElementById('guardAccountManagementModal'),
    guardAccountManagementForm: document.getElementById('guardAccountManagementForm'),
    guardIDTracking: document.getElementById('guardIDTracking'),
    guardFullName: document.getElementById('guardFullName'),
    guardEmail: document.getElementById('guardEmail'),
    guardLocation: document.getElementById('guardLocation'),

    // Search filters (account tabs)
    searchFilterStudentsAccounts: document.getElementById('searchFilterStudentsAccounts'),
    searchFilterTeachersAccounts: document.getElementById('searchFilterTeachersAccounts'),
    searchFilterGuardAccounts: document.getElementById('searchFilterGuardAccounts')
};

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

// ============================================================
// UTILITIES
// ============================================================

/** Format ISO date string to YYYY-MM-DD */
function dateFormat(isoString) {
    return isoString.split('T')[0];
}

/** Convert 24-hour time string to 12-hour AM/PM format */
function formatTime(timeString) {
    if (!timeString) return '--:--';
    const [hours, minutes] = timeString.split(':');
    let h = parseInt(hours, 10);
    const suffix = h >= 12 ? 'PM' : 'AM';
    h = h % 12 || 12;
    return `${h}:${minutes} ${suffix}`;
}

/** Show a SweetAlert loading spinner */
function showLoading(title = 'Processing...') {
    Swal.fire({ title, didOpen: () => Swal.showLoading() });
}

/** Reusable API fetch wrapper with Authorization header */
async function apiFetch(endpoint, options = {}) {
    const defaults = {
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${TOKEN}`
        }
    };
    const config = {
        ...defaults,
        ...options,
        headers: { ...defaults.headers, ...(options.headers || {}) }
    };
    return fetch(`${URL_BASED}${endpoint}`, config);
}

/** Handle common HTTP error statuses with appropriate Swal alerts */
async function handleHttpErrors(res, data) {
    if (res.status === 401) {
        await Swal.fire({
            icon: 'error',
            title: 'Session Expired',
            text: 'Your session has expired. Please log in again.'
        });
        window.location.href = 'super_admin_login.html';
        return true;
    }
    if (res.status === 403) {
        Swal.fire({ icon: 'error', title: 'Access Denied', text: 'You do not have permission to perform this action.' });
        return true;
    }
    if (!res.ok) {
        Swal.fire({ icon: 'error', title: 'Error', text: data?.message || 'An unexpected error occurred.' });
        return true;
    }
    return false;
}

/** Generic table row filter — shows/hides <tr> based on text match */
function filterTableRows(tbodyEl, searchText) {
    const rows = tbodyEl.getElementsByTagName('tr');
    const lower = searchText.toLowerCase();
    for (const row of rows) {
        row.style.display = row.textContent.toLowerCase().includes(lower) ? '' : 'none';
    }
}

/** Generic card filter — shows/hides card elements based on text match */
function filterCards(containerSelector, cardSelector, searchText) {
    const lower = searchText.toLowerCase();
    document.querySelectorAll(`${containerSelector} ${cardSelector}`).forEach(card => {
        card.style.display = card.textContent.toLowerCase().includes(lower) ? 'block' : 'none';
    });
}

// ============================================================
// INIT
// ============================================================
document.addEventListener('DOMContentLoaded', () => {
    checkToken();
    navigateTo('dashboard');
    getAdminData();
    loadSystemStats();
    fetchAdminAccounts();
    renderLoginLogs();
    renderActivityLogs();
    renderPrograms();
    renderYearLevels();
    fetchStudentAccounts();
    fetchTeacherAccounts();
    fetchGuardAccounts();
    renderEventAttendanceRecord();
    renderEventHistoryAttendanceRecord();
    generateProgramSelectionOnTeacher();
    generateYearLevelSelections();
    initChart();
    initEventListeners();
});

// ============================================================
// NAVIGATION
// ============================================================
function navigateTo(page) {
    DOM.titleHeader.textContent = PAGE_TITLES[page] || 'Error';
    PAGES.forEach(p => {
        document.getElementById(p)?.classList.toggle('active', p === page);
    });

    // Remind admin about the active event when opening Event Attendance
    if (page === 'eventAttendance') {
        checkEventReminder();
    }

    closeSidebar();
}

function closeSidebar() {
    DOM.sidebar.classList.remove('active');
    DOM.sidebarOverlay.classList.remove('active');
}

function register() {
    navigateTo('registration');
}

// ============================================================
// AUTH
// ============================================================
async function checkToken() {
    if (!TOKEN) {
        await Swal.fire({
            icon: 'error',
            title: 'Please login first!',
            text: 'Your session is missing or expired.',
            confirmButtonColor: '#d33',
            allowOutsideClick: false
        });
        window.location.href = 'super_admin_login.html';
        return;
    }

    try {
        const res = await apiFetch('/super_admin/verify_token', { method: 'POST' });
        const data = await res.json();
        if (!res.ok || !data.ok) {
            await Swal.fire({
                icon: 'error',
                title: 'Session Expired',
                text: data.message || 'Please login again.',
                confirmButtonColor: '#d33',
                allowOutsideClick: false
            });
            window.location.href = 'super_admin_login.html';
        }
    } catch (err) {
        console.error(err);
        Swal.fire({ icon: 'error', title: 'Error', text: err.message || 'Something went wrong.', confirmButtonColor: '#d33' });
    }
}

function logout() {
    Swal.fire({
        title: 'Are you sure?',
        text: 'You will be logged out of the admin panel.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Yes, log out!'
    }).then(result => {
        if (!result.isConfirmed) return;
        Swal.fire({ icon: 'success', title: 'Logged out', text: 'Redirecting to login...', timer: 1500, showConfirmButton: false })
            .then(() => {
                localStorage.removeItem('admin_token');
                localStorage.removeItem('admin_user');
                window.location.href = 'super_admin_login.html';
            });
    });
}

// ============================================================
// ADMIN PROFILE
// ============================================================
async function getAdminData() {
    try {
        const res = await apiFetch('/super_admin/get_profile');
        const data = await res.json();
        if (data.ok) {
            const { super_admin_name: admin_name, super_admin_email: admin_email, super_admin_profile_picture: admin_profile_picture } = data.content || {};
            DOM.sideBarName.textContent = admin_name;
            DOM.profileName.textContent = admin_name;
            DOM.adminProfileName.textContent = admin_name;
            DOM.profileEmailTop.textContent = admin_email;

            if (admin_profile_picture) {
                const url = `${URL_BASED}/uploads/profile_pictures/${admin_profile_picture}`;
                setAdminAvatar(url);
            }
        }
    } catch (err) {
        console.error(err);
    }
}

function setAdminAvatar(url) {
    const imgTag = `<img src="${url}" style="width:100%;height:100%;object-fit:cover;border-radius:inherit;" onerror="this.parentElement.innerHTML='<svg viewBox=\\'0 0 24 24\\'><path d=\\'M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z\\'/></svg>'" alt="Profile">`;
    const sidebarAvatar = document.getElementById('sidebarAvatar');
    if (sidebarAvatar) sidebarAvatar.innerHTML = imgTag;
    const adminAvatar = document.getElementById('adminAvatar');
    if (adminAvatar) adminAvatar.innerHTML = imgTag;
}

// Profile picture upload handler
document.addEventListener('DOMContentLoaded', () => {
    const picInput = document.getElementById('superAdminProfilePicInput');
    if (picInput) {
        picInput.addEventListener('change', async function () {
            const file = this.files[0];
            if (!file) return;

            const allowed = /jpeg|jpg|png|webp/;
            if (!allowed.test(file.name.split('.').pop().toLowerCase())) {
                return Swal.fire({ icon: 'warning', title: 'Invalid file type', text: 'Only JPEG, PNG, or WEBP images are allowed.' });
            }
            if (file.size > 10 * 1024 * 1024) {
                return Swal.fire({ icon: 'warning', title: 'File too large', text: 'Please choose an image under 10MB.' });
            }

            // Instant preview
            const reader = new FileReader();
            reader.onload = e => setAdminAvatar(e.target.result);
            reader.readAsDataURL(file);

            const token = localStorage.getItem('super_admin_token');
            const formData = new FormData();
            formData.append('super_admin_profile_picture', file);

            Swal.fire({ title: 'Uploading...', allowOutsideClick: false, didOpen: () => Swal.showLoading() });

            try {
                const res = await fetch(`${URL_BASED}/super_admin/upload_profile_picture`, {
                    method: 'POST',
                    headers: { 'Authorization': 'Bearer ' + token },
                    body: formData
                });
                const data = await res.json();
                Swal.close();

                if (res.ok && data.ok) {
                    const url = `${URL_BASED}/uploads/profile_pictures/${data.filename}`;
                    setAdminAvatar(url);
                    Swal.fire({ icon: 'success', title: 'Profile picture updated!', timer: 1500, showConfirmButton: false });
                } else {
                    Swal.fire({ icon: 'error', title: 'Upload failed', text: data.message || 'Please try again.' });
                }
            } catch (err) {
                Swal.close();
                console.error('[AdminProfilePic] Fetch error:', err);
                Swal.fire({ icon: 'error', title: 'Upload failed', text: err.message || 'Network error.' });
            }

            this.value = '';
        });
    }
});

async function editProfileName() {
    const { value: newName } = await Swal.fire({
        title: 'Change Name',
        input: 'text',
        inputLabel: 'New name',
        inputValue: DOM.adminProfileName.textContent,
        inputPlaceholder: 'Enter new name',
        showCancelButton: true,
        confirmButtonText: 'Save',
        cancelButtonText: 'Cancel',
        inputValidator: value => !value ? 'Name cannot be empty!' : null
    });

    if (!newName) return;

    const res = await apiFetch('/super_admin/update_name', {
        method: 'PUT',
        body: JSON.stringify({ newName })
    });

    if (!res) return;

    await Swal.fire({ icon: 'success', title: 'Updated!', text: 'Name has been changed successfully' });
    getAdminData();
}

async function updatePassword() {
    const currentPassword = document.getElementById('currentPassword').value;
    const newPassword = document.getElementById('newPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    if (!currentPassword || !newPassword || !confirmPassword) {
        return Swal.fire({ icon: 'warning', title: 'Missing Fields', text: 'Please fill in all password fields.' });
    }
    if (newPassword !== confirmPassword) {
        return Swal.fire({ icon: 'error', title: 'Password Mismatch', text: 'The new passwords do not match.' });
    }
    if (newPassword.length < 6) {
        return Swal.fire({ icon: 'warning', title: 'Weak Password', text: 'New password must be at least 6 characters long.' });
    }

    const res = await apiFetch('/super_admin/change_password', {
        method: 'PUT',
        body: JSON.stringify({ current_password: currentPassword, new_password: newPassword, confirm_password: confirmPassword })
    });

    if (res) {
        Swal.fire({ icon: 'success', title: 'Success', text: 'Your password has been updated successfully.' });
        ['currentPassword', 'newPassword', 'confirmPassword'].forEach(id => { document.getElementById(id).value = ''; });
    }
}

// ============================================================
// EVENT ATTENDANCE
// ============================================================
// ============================================================
// EVENT ATTENDANCE — REALTIME POLLING
// ============================================================
let _adminPollInterval      = null;
let _lastEventCount         = -1;
let _lastEventHistCount     = -1;

function showAdminLiveIndicator(dotId) {
    const dot = document.getElementById(dotId);
    if (!dot) return;
    dot.classList.add('live-blink');
    setTimeout(() => dot.classList.remove('live-blink'), 2000);
}

async function renderEventAttendanceRecord() {
    try {
        const res = await apiFetch('/super_admin/get_all_events');
        const data = await res.json();

        if (!res.ok) {
            return Swal.fire({ icon: 'error', title: 'Failed to load records', text: data.message || 'Something went wrong.' });
        }

        const attendeeCount = data.content.filter(d => d.status === 'TIME IN').length;
        DOM.statsValue.textContent = attendeeCount;
        DOM.sideBarStatsValue.textContent = attendeeCount;

        DOM.attendanceBody.innerHTML = data.content.map(d => `
            <tr>
                <td>${d.student_id_number}</td>
                <td>${d.student_name}</td>
                <td>${d.student_program}</td>
                <td>${d.student_year_level}</td>
                <td>${dateFormat(d.date)}</td>
                <td>${formatTime(d.time)}</td>
                <td>${d.status}</td>
                <td>${d.event_name}</td>
                <td>${d.admin_name || '-'}</td>
            </tr>
        `).join('');

        _lastEventCount = data.content.length;
        startAdminPolling();
    } catch (err) {
        console.error(err);
        Swal.fire({ icon: 'error', title: 'Network Error', text: err.message || 'Unable to connect to the server.' });
    }
}

async function renderEventHistoryAttendanceRecord() {
    try {
        const res = await apiFetch('/super_admin/get_all_events_history');
        const data = await res.json();
        if (!res.ok) { console.error(data); return; }

        DOM.attendanceHistory.innerHTML = data.content.map(d => `
            <tr>
                <td>${d.student_id_number}</td>
                <td>${d.student_name}</td>
                <td>${d.student_program}</td>
                <td>${d.student_year_level}</td>
                <td>${dateFormat(d.date)}</td>
                <td>${formatTime(d.time)}</td>
                <td>${d.status}</td>
                <td>${d.event_name}</td>
                <td>${d.admin_name || '-'}</td>
            </tr>
        `).join('');

        _lastEventHistCount = data.content.length;
    } catch (err) {
        console.error(err);
    }
}

async function pollAdminSilently() {
    try {
        // Poll event attendance
        const r1 = await apiFetch('/super_admin/get_all_events');
        if (r1.ok) {
            const d1 = await r1.json();
            if (_lastEventCount !== -1 && d1.content.length !== _lastEventCount) {
                _lastEventCount = d1.content.length;
                const attendeeCount = d1.content.filter(d => d.status === 'TIME IN').length;
                DOM.statsValue.textContent = attendeeCount;
                DOM.sideBarStatsValue.textContent = attendeeCount;
                DOM.attendanceBody.innerHTML = d1.content.map(d => `
                    <tr>
                        <td>${d.student_id_number}</td>
                        <td>${d.student_name}</td>
                        <td>${d.student_program}</td>
                        <td>${d.student_year_level}</td>
                        <td>${dateFormat(d.date)}</td>
                        <td>${formatTime(d.time)}</td>
                        <td>${d.status}</td>
                        <td>${d.event_name}</td>
                    </tr>
                `).join('');
                showAdminLiveIndicator('adminLiveDotEvent');
                updateChart();
            }
        }

        // Poll event history
        const r2 = await apiFetch('/super_admin/get_all_events_history');
        if (r2.ok) {
            const d2 = await r2.json();
            if (_lastEventHistCount !== -1 && d2.content.length !== _lastEventHistCount) {
                _lastEventHistCount = d2.content.length;
                DOM.attendanceHistory.innerHTML = d2.content.map(d => `
                    <tr>
                        <td>${d.student_id_number}</td>
                        <td>${d.student_name}</td>
                        <td>${d.student_program}</td>
                        <td>${d.student_year_level}</td>
                        <td>${dateFormat(d.date)}</td>
                        <td>${formatTime(d.time)}</td>
                        <td>${d.status}</td>
                        <td>${d.event_name}</td>
                    </tr>
                `).join('');
                showAdminLiveIndicator('adminLiveDotEventHist');
            }
        }
    } catch (err) {
        console.error('[Poll]', err);
    }
}

function startAdminPolling() {
    if (_adminPollInterval) return;
    _adminPollInterval = setInterval(pollAdminSilently, 5000);
}

// Show a once-per-day reminder about the active event when opening Event Attendance
async function checkEventReminder() {
    const today     = new Date().toISOString().split('T')[0];
    const lastShown = localStorage.getItem('admin_event_reminder_last_shown');

    // Already reminded today — skip
    if (lastShown === today) return;

    // Fetch current event records to find the active event name
    let activeEvent = null;
    try {
        const res  = await apiFetch('/super_admin/get_all_events');
        const data = await res.json();
        if (res.ok && data.content && data.content.length > 0) {
            // Prefer a record from today, fall back to the most recent
            const todayRecord = data.content.find(r => {
                const d = r.date ? r.date.split('T')[0] : '';
                return d === today;
            });
            activeEvent = (todayRecord || data.content[0]).event_name;
        }
    } catch (err) {
        console.warn('[Event Reminder] Could not fetch events:', err);
    }

    Swal.fire({
        icon: activeEvent ? 'info' : 'warning',
        title: '📅 Event Attendance',
        html: activeEvent
            ? `The active event is <strong>${activeEvent}</strong>.<br>Make sure guards are scanning students in for the correct event.`
            : `No event has been set for today yet.<br><br>Use the <strong>Set Event</strong> field above to activate an event before students start scanning.`,
        confirmButtonText: 'Got it',
        confirmButtonColor: '#3d6b6b'
    });

    localStorage.setItem('admin_event_reminder_last_shown', today);
}

async function handleSetEvent() {
    const eventInput = document.getElementById('event_name_input');
    const eventName = eventInput.value.trim();

    if (!TOKEN) {
        return Swal.fire({ icon: 'error', title: 'Unauthorized', text: 'You must be logged in.' })
            .then(() => { window.location.href = 'super_admin_login.html'; });
    }
    if (!eventName) {
        return Swal.fire({ icon: 'warning', title: 'Empty Input', text: 'Please enter an event name.' });
    }

    try {
        const response = await apiFetch('/admin/set_event', {
            method: 'POST',
            body: JSON.stringify({ event_name: eventName })
        });
        const data = await response.json();

        if (response.status === 401 || response.status === 403) {
            return Swal.fire({ icon: 'error', title: 'Session Expired', text: 'Please login again.' })
                .then(() => { window.location.href = 'super_admin_login.html'; });
        }
        if (!response.ok) {
            return Swal.fire({ icon: 'error', title: 'Error', text: data.message || 'Failed to set event.' });
        }

        await Swal.fire({ icon: 'success', title: 'Event Set!', text: `Event set to: "${eventName}"`, timer: 2000, showConfirmButton: false });
        eventInput.value = '';
    } catch (error) {
        console.error(error);
        Swal.fire({ icon: 'error', title: 'Error', text: error.message });
    }
}

// Calendar (flatpickr) — filters Event Attendance History by date
const calendar = flatpickr('#datePicker', {
    dateFormat: 'Y-m-d',       // matches dateFormat() output (YYYY-MM-DD)
    clickOpens: false,
    allowInput: false,
    onChange(selectedDates, dateStr) {
        // Date is column index 4 in the history table
        document.querySelectorAll('#attendanceHistory tr').forEach(row => {
            const cellDate = row.children[4]?.textContent.trim();
            row.style.display = (!dateStr || cellDate === dateStr) ? '' : 'none';
        });
        const clearBtn = document.getElementById('clearDateFilter');
        if (clearBtn) clearBtn.style.display = dateStr ? '' : 'none';
    }
});

function clearDateFilter() {
    calendar.clear();
    document.querySelectorAll('#attendanceHistory tr').forEach(row => row.style.display = '');
    const clearBtn = document.getElementById('clearDateFilter');
    if (clearBtn) clearBtn.style.display = 'none';
}

// ============================================================
// PROGRAMS / ACADEMIC SETUP
// ============================================================
async function renderPrograms() {
    try {
        const res = await fetch(`${URL_BASED}/programs/program_get_data`);
        const data = await res.json();

        if (!res.ok) return Swal.fire({ icon: 'error', title: 'Error', text: data.message });

        const programsList = document.getElementById('programsList');
        programsList.innerHTML = '';

        data.content.forEach(({ program_id, program_name }) => {
            const card = document.createElement('div');
            card.className = 'program-card';
            card.innerHTML = `
                <div class="program-name">${program_name}</div>
                <button class="delete-btn" onclick="deleteProgram(${program_id}, '${program_name}')">
                    <svg viewBox="0 0 24 24"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/></svg>
                </button>`;
            programsList.appendChild(card);
        });

        const optionsHtml = "<option value=''>Select Program</option>" +
            data.content.map(d => `<option value='${d.program_name}'>${d.program_name}</option>`).join('');

        DOM.studentProgram.innerHTML = optionsHtml;
        DOM.teacherProgram.innerHTML = optionsHtml;
    } catch (err) {
        console.error(err);
        Swal.fire({ icon: 'error', title: 'Error', text: err.message });
    }
}

async function generateProgramSelectionOnTeacher() {
    try {
        const res = await fetch(`${URL_BASED}/programs/program_get_data`);
        const data = await res.json();
        if (!res.ok) return Swal.fire({ icon: 'error', title: 'Error', text: data.message });

        const teacherDepartment = document.getElementById('teacher_department');
        teacherDepartment.innerHTML = '<option value="">Select Department</option>';
        data.content.forEach(({ program_name }) => {
            const option = document.createElement('option');
            option.value = program_name;
            option.textContent = program_name;
            teacherDepartment.appendChild(option);
        });
    } catch (err) {
        console.error(err);
    }
}

function openAddModal() {
    document.getElementById('addModal').classList.add('active');
    const input = document.getElementById('programNameInput');
    input.value = '';
    input.focus();
}

function closeAddModal() {
    document.getElementById('addModal').classList.remove('active');
}

async function addProgram() {
    const inputField = document.getElementById('programNameInput');
    const programName = inputField.value.trim();

    if (!programName) {
        return Swal.fire({ icon: 'warning', title: 'Missing Input', text: 'Please enter a program name.' });
    }

    showLoading();

    try {
        const res = await apiFetch('/admin/add_program', {
            method: 'POST',
            body: JSON.stringify({ programName })
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Failed to add program');

        Swal.fire({ icon: 'success', title: 'Success', text: 'New program added successfully!' });
        inputField.value = '';
        closeAddModal();
        renderPrograms();
    } catch (error) {
        console.error(error);
        Swal.fire({ icon: 'error', title: 'Error', text: error.message });
    }
}

async function deleteProgram(id, name) {
    const result = await Swal.fire({
        title: 'Are you sure?',
        text: `Do you really want to delete "${name}"? This action cannot be undone.`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Yes, delete it!'
    });

    if (!result.isConfirmed) return;

    showLoading();

    try {
        const res = await apiFetch(`/admin/delete_program/${id}`, { method: 'DELETE' });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Failed to delete program');

        await Swal.fire('Deleted!', `"${name}" has been deleted.`, 'success');
        renderPrograms();
    } catch (error) {
        console.error(error);
        Swal.fire({ icon: 'error', title: 'Error', text: error.message });
    }
}

// ============================================================
// YEAR LEVELS
// ============================================================
async function renderYearLevels() {
    try {
        const res = await fetch(`${URL_BASED}/admin/get_year_levels`);
        const data = await res.json();
        if (!res.ok) return Swal.fire({ icon: 'error', title: 'Error', text: data.message });

        // Render the list cards (only exists on academic setup page)
        const list = document.getElementById('yearLevelsList');
        if (list) {
            list.innerHTML = '';
            data.content.forEach(({ year_level_id, year_level_name }) => {
                const card = document.createElement('div');
                card.className = 'program-card';
                card.innerHTML = `
                    <div class="program-name">${year_level_name}</div>
                    <button class="delete-btn" onclick="deleteYearLevel(${year_level_id}, '${year_level_name}')">
                        <svg viewBox="0 0 24 24"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/></svg>
                    </button>`;
                list.appendChild(card);
            });
        }

        // Always repopulate year level dropdowns regardless of current page
        const yearOptions = '<option value="">Select Year</option>' +
            data.content.map(d => `<option value="${d.year_level_name}">${d.year_level_name}</option>`).join('');
        const historyOptions = '<option value="">Year Level All</option>' +
            data.content.map(d => `<option value="${d.year_level_name}">${d.year_level_name}</option>`).join('');

        ['std_year_level', 'studentYearLevel'].forEach(id => {
            const el = document.getElementById(id);
            if (el) el.innerHTML = yearOptions;
        });
        const historyFilter = document.getElementById('eventHistoryYearFilter');
        if (historyFilter) historyFilter.innerHTML = historyOptions;

    } catch (err) {
        console.error(err);
        Swal.fire({ icon: 'error', title: 'Error', text: err.message });
    }
}

async function generateYearLevelSelections() {
    // Alias — renderYearLevels already handles dropdown population
    await renderYearLevels();
}

function openAddYearLevelModal() {
    document.getElementById('addYearLevelModal').classList.add('active');
    const input = document.getElementById('yearLevelNameInput');
    input.value = '';
    input.focus();
}

function closeAddYearLevelModal() {
    document.getElementById('addYearLevelModal').classList.remove('active');
}

async function addYearLevel() {
    const input = document.getElementById('yearLevelNameInput');
    const yearLevelName = input.value.trim();
    if (!yearLevelName) return Swal.fire({ icon: 'warning', title: 'Missing Input', text: 'Please enter a year level name.' });

    showLoading();
    try {
        const res = await apiFetch('/admin/add_year_level', {
            method: 'POST',
            body: JSON.stringify({ yearLevelName })
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Failed to add year level.');
        Swal.fire({ icon: 'success', title: 'Success', text: 'Year level added successfully!' });
        input.value = '';
        closeAddYearLevelModal();
        renderYearLevels();
    } catch (err) {
        console.error(err);
        Swal.fire({ icon: 'error', title: 'Error', text: err.message });
    }
}

async function deleteYearLevel(id, name) {
    const result = await Swal.fire({
        title: 'Are you sure?',
        text: `Delete "${name}"? This cannot be undone.`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Yes, delete it!'
    });
    if (!result.isConfirmed) return;

    showLoading();
    try {
        const res = await apiFetch(`/admin/delete_year_level/${id}`, { method: 'DELETE' });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Failed to delete year level.');
        await Swal.fire('Deleted!', `"${name}" has been deleted.`, 'success');
        renderYearLevels();
    } catch (err) {
        console.error(err);
        Swal.fire({ icon: 'error', title: 'Error', text: err.message });
    }
}

// ============================================================
// ACCOUNTS — FETCH
// ============================================================

/** Fetch a list of accounts from a given table */
async function fetchAccountCount(tableName) {
    try {
        const res = await fetch(`${URL_BASED}/admin/get_whole_campus_accounts_count/${tableName}`, {
            headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' }
        });
        const data = await res.json();
        if (!res.ok || !data.ok) throw new Error(data.message || `Failed to fetch ${tableName}`);
        return data.contents;
    } catch (error) {
        console.error(error);
        return null;
    }
}

async function fetchStudentAccounts() {
    const result = await fetchAccountCount('student_accounts');
    if (!result) return;
    DOM.studentAccountCounts.textContent = `${result.length} Accounts`;
    DOM.studentsList.innerHTML = result.map(d => `
        <div class="student-card">
            <div class="student-header">
                <div class="student-name">${d.student_firstname} ${d.student_middlename}. ${d.student_lastname}</div>
            </div>
            <div class="student-info">
                <div class="info-item">${d.student_year_level}</div>
            </div>
            <div class="student-meta">
                <div class="student-course">${d.student_program}</div>
                <div class="student-actions">
                    <button class="action-btn edit-btn-account-management" onclick="editStudent(
                        ${d.student_id},
                        '${d.student_id_number}',
                        '${d.student_firstname}',
                        '${d.student_middlename}',
                        '${d.student_lastname}',
                        '${d.student_program}',
                        '${d.student_year_level}')">Edit</button>
                    <button class="action-btn delete-btn-account-management" onclick="deleteStudent(${d.student_id})">Delete</button>
                </div>
            </div>
        </div>
    `).join('');
}

async function fetchTeacherAccounts() {
    const result = await fetchAccountCount('teacher');
    if (!result) return;
    DOM.teacherAccountCounts.textContent = `${result.length} Accounts`;
    DOM.teacherList.innerHTML = result.map(d => `
        <div class="teacher-card">
            <div class="teacher-header">
                <div class="teacher-name">${d.teacher_name}</div>
            </div>
            <div class="teacher-info">
                <div class="info-item">${d.teacher_email}</div>
            </div>
            <div class="teacher-meta">
                <div class="teacher-course">${d.teacher_program}</div>
                <div class="teacher-actions">
                    <button class="action-btn edit-btn-account-management" onclick="editTeacher(
                        ${d.teacher_id},
                        '${d.teacher_name}',
                        '${d.teacher_email}',
                        '${d.teacher_program}',
                        '${d.teacher_barcode_scanner_serial_number}')">Edit</button>
                    <button class="action-btn delete-btn-account-management" onclick="deleteTeacher(${d.teacher_id})">Delete</button>
                </div>
            </div>
        </div>
    `).join('');
}

async function fetchGuardAccounts() {
    const result = await fetchAccountCount('guards');
    if (!result) return;
    DOM.guardAccountCounts.textContent = `${result.length} Accounts`;
    DOM.guardList.innerHTML = result.map(d => `
        <div class="guard-card">
            <div class="guard-header">
                <div class="guard-name">${d.guard_name}</div>
            </div>
            <div class="guard-info"></div>
            <div class="guard-meta">
                <div class="guard-domain-gate">${d.guard_designated_location}</div>
                <div class="guard-actions">
                    <button class="action-btn edit-btn-account-management" onclick="openGuardAccountManagementModal(
                        ${d.guard_id},
                        '${d.guard_name}',
                        '${d.guard_email}',
                        '${d.guard_designated_location}')">Edit</button>
                    <button class="action-btn delete-btn-account-management" onclick="deleteGuard(${d.guard_id})">Delete</button>
                </div>
            </div>
        </div>
    `).join('');
}

// ============================================================
// ACCOUNTS — EDIT (open modals)
// ============================================================
function editStudent(id, student_id_number, student_firstname, student_middlename, student_lastname, student_program, student_year_level) {
    DOM.studentAccountManagementModal.style.display = 'flex';
    DOM.studentIDTracking.value = id;
    DOM.studentIdNumber.value = student_id_number;
    DOM.studentFirstName.value = student_firstname;
    DOM.studentMiddleName.value = student_middlename;
    DOM.studentLastName.value = student_lastname;
    DOM.studentProgram.value = student_program;
    DOM.studentYearLevel.value = student_year_level;
}

function editTeacher(id, teacher_name, teacher_email, teacher_program, teacher_barcode_scanner_serial_number) {
    DOM.teacherAccountManagementModal.style.display = 'flex';
    DOM.teacherIDTracking.value = id;
    DOM.teacherFullName.value = teacher_name;
    DOM.teacherEmail.value = teacher_email;
    DOM.teacherProgram.value = teacher_program;
    DOM.teacherBarcodeSerialNumber.value = teacher_barcode_scanner_serial_number;
}

// Keeping editGuard as an alias for openGuardAccountManagementModal for clarity
function editGuard(id, guard_name, guard_email, guard_assigned_location) {
    openGuardAccountManagementModal(id, guard_name, guard_email, guard_assigned_location);
}

function openGuardAccountManagementModal(id, guard_name, guard_email, guard_assigned_location) {
    DOM.guardIDTracking.value = id;
    DOM.guardFullName.value = guard_name;
    DOM.guardEmail.value = guard_email;
    DOM.guardLocation.value = guard_assigned_location;
    DOM.guardAccountManagementModal.style.display = 'flex';
}

function closeRecordModal() {
    DOM.studentAccountManagementModal.style.display = 'none';
    DOM.teacherAccountManagementModal.style.display = 'none';
    DOM.guardAccountManagementModal.style.display = 'none';
}

// ============================================================
// ACCOUNTS — UPDATE FORM SUBMISSIONS
// ============================================================
DOM.studentAccountManagementForm.addEventListener('submit', async function(e) {
    e.preventDefault();
    const payload = {
        student_id: DOM.studentIDTracking.value,
        id_number: DOM.studentIdNumber.value.trim(),
        firstname: DOM.studentFirstName.value.trim(),
        middlename: DOM.studentMiddleName.value.trim(),
        lastname: DOM.studentLastName.value.trim(),
        program: DOM.studentProgram.value,
        year_level: DOM.studentYearLevel.value
    };

    showLoading();
    try {
        const res = await apiFetch(`/admin/edit_student_account/${payload.student_id}`, {
            method: 'PUT',
            body: JSON.stringify(payload)
        });
        const data = await res.json();
        Swal.close();
        if (data.duplicate) {
            return Swal.fire({
                icon: 'warning',
                title: 'ID Number Already Exists',
                text: `The ID number "${payload.id_number}" is already assigned to another student.`
            });
        }
        if (!data.ok) return Swal.fire('Error!', data.message || 'Something went wrong.', 'error');
        Swal.fire('Updated!', 'Record has been updated successfully.', 'success');
        DOM.studentAccountManagementForm.reset();
        closeRecordModal();
        fetchStudentAccounts();
    } catch (error) {
        console.error(error);
        Swal.fire('Error!', 'Failed to connect to the server.', 'error');
    }
});

DOM.teacherAccountManagementForm.addEventListener('submit', async function(e) {
    e.preventDefault();
    const payload = {
        teacher_id: DOM.teacherIDTracking.value,
        teacher_name: DOM.teacherFullName.value,
        teacher_email: DOM.teacherEmail.value,
        teacher_program: DOM.teacherProgram.value
    };

    showLoading();
    try {
        const res = await apiFetch(`/admin/edit_teacher_account/${payload.teacher_id}`, {
            method: 'PUT',
            body: JSON.stringify(payload)
        });
        const data = await res.json();
        if (!data.ok) return Swal.fire('Error!', data.message || 'Something went wrong.', 'error');
        Swal.fire('Updated!', 'Record has been updated successfully.', 'success');
        DOM.teacherAccountManagementForm.reset();
        closeRecordModal();
        fetchTeacherAccounts();
    } catch (error) {
        console.error(error);
        Swal.fire('Error!', 'Failed to connect to the server.', 'error');
    }
});

DOM.guardAccountManagementForm.addEventListener('submit', async function(e) {
    e.preventDefault();
    const payload = {
        guard_id: DOM.guardIDTracking.value,
        guard_name: DOM.guardFullName.value,
        guard_email: DOM.guardEmail.value,
        guard_designated_location: DOM.guardLocation.value
    };

    showLoading();
    try {
        const res = await apiFetch(`/admin/edit_guard_account/${payload.guard_id}`, {
            method: 'PUT',
            body: JSON.stringify(payload)
        });
        const data = await res.json();
        if (!data.ok) return Swal.fire('Error!', data.message || 'Something went wrong.', 'error');
        Swal.fire('Updated!', 'Record has been updated successfully.', 'success');
        DOM.guardAccountManagementForm.reset();
        closeRecordModal();
        fetchGuardAccounts();
    } catch (error) {
        console.error(error);
        Swal.fire('Error!', 'Failed to connect to the server.', 'error');
    }
});

// ============================================================
// ACCOUNTS — DELETE
// ============================================================

/** Shared delete logic for student, teacher, and guard accounts */
async function deleteAccount({ confirmText, endpoint, successTitle, successText, onSuccess }) {
    const confirm = await Swal.fire({
        icon: 'warning',
        title: 'Are you sure?',
        text: confirmText,
        showCancelButton: true,
        confirmButtonText: 'Yes, delete it',
        cancelButtonText: 'Cancel',
        confirmButtonColor: '#d33'
    });
    if (!confirm.isConfirmed) return;

    try {
        const res = await apiFetch(endpoint, { method: 'DELETE' });
        const data = await res.json();

        if (res.ok) {
            return Swal.fire({ icon: 'success', title: successTitle, text: successText }).then(onSuccess);
        }
        await handleHttpErrors(res, data);
    } catch {
        Swal.fire({ icon: 'error', title: 'Network Error', text: 'Unable to connect to the server. Please try again.' });
    }
}

function deleteStudent(id) {
    deleteAccount({
        confirmText: 'This action will permanently delete the student account.',
        endpoint: `/admin/delete_student_account/${id}`,
        successTitle: 'Student Account Deleted',
        successText: 'The student account has been successfully deleted.',
        onSuccess: fetchStudentAccounts
    });
}

function deleteTeacher(id) {
    deleteAccount({
        confirmText: 'This action will permanently delete the teacher account.',
        endpoint: `/admin/delete_teacher_account/${id}`,
        successTitle: 'Teacher Account Deleted',
        successText: 'The teacher account has been successfully deleted.',
        onSuccess: fetchTeacherAccounts
    });
}

function deleteGuard(id) {
    deleteAccount({
        confirmText: 'This action will permanently delete the guard account.',
        endpoint: `/admin/delete_guard_account/${id}`,
        successTitle: 'Guard Account Deleted',
        successText: 'The guard account has been successfully deleted.',
        onSuccess: fetchGuardAccounts
    });
}

// ============================================================
// REGISTRATION
// ============================================================
function switchRole(role) {
    document.querySelectorAll('.role-tab').forEach(tab => tab.classList.remove('active'));
    event.target.classList.add('active');
    document.querySelectorAll('.form-section').forEach(form => form.classList.remove('active'));
    document.getElementById(`${role}Form`)?.classList.add('active');
}

document.getElementById('guardForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    const password = document.getElementById('guard_password').value;
    const confirmPassword = document.getElementById('guard_confirm_password').value;

    if (password !== confirmPassword) {
        return Swal.fire({ icon: 'error', title: 'Error', text: "Passwords don't match!" });
    }

    const guardData = {
        guard_name: document.getElementById('guard_fullname').value,
        guard_email: document.getElementById('guard_email').value,
        guard_password: password,
        guard_designated_location: document.getElementById('guard_location').value
    };

    showLoading();
    try {
        const res = await apiFetch('/authentication/guard_registration', { method: 'POST', body: JSON.stringify(guardData) });
        const result = await res.json();
        if (!res.ok) throw new Error(result.message || 'Registration failed');
        Swal.fire({ icon: 'success', title: 'Success', text: 'Guard registered successfully!' }).then(fetchGuardAccounts);
        this.reset();
    } catch (err) {
        console.error(err);
        Swal.fire({ icon: 'error', title: 'Error', text: err.message });
    }
});

document.getElementById('teacherForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    const teacherPassword = document.getElementById('teacher_password').value;
    const confirmPassword = document.getElementById('confirm_password').value;

    if (teacherPassword !== confirmPassword) {
        return Swal.fire({ icon: 'warning', title: 'Password Mismatch', text: 'The password and confirm password do not match.' });
    }

    const teacherData = {
        fullName: document.getElementById('teacher_fullname').value,
        email: document.getElementById('teacher_email').value,
        password: teacherPassword,
        department: document.getElementById('teacher_department').value
    };

    showLoading();
    try {
        const res = await apiFetch('/authentication/teacher_registration', { method: 'POST', body: JSON.stringify(teacherData) });
        const data = await res.json();
        if (!res.ok) return Swal.fire({ icon: 'error', title: 'Registration Failed', text: data.message || 'Something went wrong.' });
        Swal.fire({ icon: 'success', title: 'Success!', text: 'Teacher registered successfully.' }).then(fetchTeacherAccounts);
        this.reset();
    } catch (err) {
        console.error(err);
        Swal.fire({ icon: 'error', title: 'Network Error', text: 'Could not connect to the server.' });
    }
});

document.getElementById('studentForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    const password = document.getElementById('std_password').value;
    const confirmPassword = document.getElementById('std_confirm_password').value;

    if (password !== confirmPassword) {
        return Swal.fire({ icon: 'warning', title: 'Password Mismatch', text: 'The password and confirm password do not match.' });
    }

    const studentData = {
        firstName: document.getElementById('std_firstname').value,
        middleName: document.getElementById('std_middlename').value,
        lastName: document.getElementById('std_lastname').value,
        email: document.getElementById('std_email').value,
        idNumber: document.getElementById('std_id_number').value,
        program: document.getElementById('std_program').value,
        yearLevel: document.getElementById('std_year_level').value,
        guardianContact: document.getElementById('std_contact').value,
        password
    };

    showLoading();
    try {
        const res = await fetch(`${URL_BASED}/authentication/student_registration`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
            body: JSON.stringify(studentData)
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Registration failed');
        Swal.fire({ icon: 'success', title: 'Welcome!', text: 'Student account created successfully.' });
        this.reset();
    } catch (err) {
        console.error(err);
        Swal.fire({ icon: 'error', title: 'Error', text: err.message });
    }
});

// ============================================================
// EXPORT
// ============================================================
function exportTableToExcel(tableId, fileName) {
    const table = document.getElementById(tableId);
    if (!table) {
        return Swal.fire({ icon: 'info', title: 'Export Failed', text: 'No table data found to export.' });
    }
    try {
        const workbook = XLSX.utils.book_new();
        const worksheet = XLSX.utils.table_to_sheet(table);
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
        XLSX.writeFile(workbook, `${fileName}.xlsx`);
        Swal.fire({ icon: 'success', title: 'Exported!', text: 'Your Excel file has been downloaded.', timer: 1500, showConfirmButton: false });
    } catch {
        Swal.fire('Error', 'Failed to generate Excel file', 'error');
    }
}

// ============================================================
// CHART
// ============================================================
async function fetchPrograms() {
    try {
        const res = await apiFetch('/admin/present_program_counts');
        const data = await res.json();

        if (res.ok) {
            return {
                programs: data.content.map(d => d.student_program),
                total_attended: data.content.map(d => d.total_attended)
            };
        }
        await handleHttpErrors(res, data);
        return null;
    } catch {
        Swal.fire({ icon: 'error', title: 'Network Error', text: 'Unable to connect to the server.' });
        return null;
    }
}

let _adminChart = null;

async function initChart() {
    const result = await fetchPrograms();
    if (!result) return;

    Chart.register(ChartDataLabels);
    _adminChart = new Chart(document.getElementById('myChart'), {
        type: 'bar',
        data: {
            labels: result.programs,
            datasets: [{
                label: 'Event Attendance',
                data: result.total_attended,
                backgroundColor: '#5a8a7a',
                borderColor: '#4e7c6d',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            animation: { duration: 1500 },
            scales: { y: { beginAtZero: true, max: 100 } },
            plugins: {
                datalabels: {
                    color: '#000',
                    anchor: 'end',
                    align: 'top',
                    font: { weight: 'bold', size: 14 },
                    formatter: value => value
                }
            }
        }
    });
}

async function updateChart() {
    if (!_adminChart) return;
    const result = await fetchPrograms();
    if (!result) return;
    _adminChart.data.labels = result.programs;
    _adminChart.data.datasets[0].data = result.total_attended;
    _adminChart.update();
}

// ============================================================
// EVENT LISTENERS (wired up here, not scattered through file)
// ============================================================
function initEventListeners() {
    // Sidebar toggle
    DOM.menuBtn.addEventListener('click', () => {
        DOM.sidebar.classList.toggle('active');
        DOM.sidebarOverlay.classList.toggle('active');
    });
    DOM.sidebarOverlay.addEventListener('click', closeSidebar);

    // Calendar trigger
    document.querySelector('.calendar-btn')?.addEventListener('click', () => calendar.open());

    // Attendance search filters
    DOM.searchFilterEventAttendance.addEventListener('input', function() {
        filterTableRows(DOM.attendanceBody, this.value);
    });
    DOM.searchFilterEventAttendanceHistory.addEventListener('input', function() {
        filterTableRows(DOM.attendanceHistory, this.value);
    });

    // Year filter
    DOM.eventHistoryYearFilter.addEventListener('change', function() {
        filterTableRows(DOM.attendanceHistory, this.value);
    });

    // Account search filters
    DOM.searchFilterTeachersAccounts?.addEventListener('input', function() {
        filterCards('#teacherList', '.teacher-card', this.value);
    });
    DOM.searchFilterStudentsAccounts?.addEventListener('input', function() {
        filterCards('#studentsList', '.student-card', this.value);
    });
    DOM.searchFilterGuardAccounts?.addEventListener('input', function() {
        filterCards('#guardList', '.guard-card', this.value);
    });

    // Close modal on backdrop click
    document.getElementById('addModal')?.addEventListener('click', function(e) {
        if (e.target === this) closeAddModal();
    });
    document.getElementById('addYearLevelModal')?.addEventListener('click', function(e) {
        if (e.target === this) closeAddYearLevelModal();
    });

    document.getElementById('searchLoginLogs')?.addEventListener('input', function() {
        const t = this.value.toLowerCase();
        renderLoginLogsTable(_loginLogs.filter(l => (l.user_name||'').toLowerCase().includes(t)||(l.user_email||'').toLowerCase().includes(t)||(l.role||'').toLowerCase().includes(t)||(l.status||'').toLowerCase().includes(t)));
    });

    document.getElementById('searchActivityLogs')?.addEventListener('input', function() {
        const t = this.value.toLowerCase();
        renderActivityLogsTable(_activityLogs.filter(l => (l.actor_name||'').toLowerCase().includes(t)||(l.actor_role||'').toLowerCase().includes(t)||(l.action||'').toLowerCase().includes(t)||(l.target_name||'').toLowerCase().includes(t)||(l.details||'').toLowerCase().includes(t)));
    });
}
// ============================================================
// SUPER ADMIN — ADMIN ACCOUNT MANAGEMENT
// ============================================================
let _allAdmins = [];

async function fetchAdminAccounts() {
    try {
        const res  = await apiFetch('/super_admin/get_all_admins');
        const data = await res.json();
        if (!res.ok) throw new Error(data.message);
        _allAdmins = data.content || [];
        DOM.adminAccountCounts && (DOM.adminAccountCounts.textContent = `${_allAdmins.length} Accounts`);
        renderAdminList(_allAdmins);
    } catch (err) {
        console.error(err);
    }
}

function renderAdminList(admins) {
    const list = document.getElementById('adminList');
    if (!list) return;
    if (!admins.length) {
        list.innerHTML = '<p style="text-align:center;padding:20px;color:#666;">No admin accounts found.</p>';
        return;
    }
    list.innerHTML = admins.map(a => `
        <div class="student-card">
            <div class="student-header">
                <div>
                    <div class="student-name">${a.admin_name}</div>
                </div>
                <div class="student-badge" style="background:#1a4545">ADMIN</div>
            </div>
            <div class="student-info">
                <div>${a.admin_email}</div>
            </div>
            <div class="student-meta">
                <div class="student-course">Created: ${a.date_account_created ? a.date_account_created.split('T')[0] : '-'}</div>
                <div class="student-actions">
                    <button class="action-btn edit-btn-account-management"
                        onclick="openAdminEditModal(${a.admin_id},'${escStr(a.admin_name)}','${escStr(a.admin_email)}')">Edit</button>
                    <button class="action-btn" style="background:#f0ad4e;color:white;"
                        onclick="resetAdminPassword(${a.admin_id},'${escStr(a.admin_name)}')">Reset PW</button>
                    <button class="action-btn delete-btn-account-management"
                        onclick="deleteAdminAccount(${a.admin_id},'${escStr(a.admin_name)}')">Delete</button>
                </div>
            </div>
        </div>
    `).join('');
}

function escStr(str) { return (str || '').replace(/'/g, "\\'"); }

function filterAdminAccounts(term) {
    const t = term.toLowerCase();
    renderAdminList(_allAdmins.filter(a =>
        a.admin_name.toLowerCase().includes(t) || a.admin_email.toLowerCase().includes(t)
    ));
}

function openAdminEditModal(id, name, email) {
    document.getElementById('adminIdTracking').value = id;
    document.getElementById('adminNameInput').value  = name;
    document.getElementById('adminEmailInput').value = email;
    document.getElementById('adminEditModal').style.display = 'flex';
}
function closeAdminEditModal() {
    document.getElementById('adminEditModal').style.display = 'none';
}

document.getElementById('adminEditForm')?.addEventListener('submit', async function(e) {
    e.preventDefault();
    const id    = document.getElementById('adminIdTracking').value;
    const name  = document.getElementById('adminNameInput').value.trim();
    const email = document.getElementById('adminEmailInput').value.trim();
    showLoading('Saving...');
    try {
        const res  = await apiFetch(`/super_admin/edit_admin/${id}`, { method: 'PUT', body: JSON.stringify({ admin_name: name, admin_email: email }) });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message);
        Swal.fire({ icon: 'success', title: 'Updated!', timer: 1500, showConfirmButton: false });
        closeAdminEditModal();
        fetchAdminAccounts();
    } catch (err) {
        Swal.fire({ icon: 'error', title: 'Failed', text: err.message });
    }
});

function openCreateAdminModal() {
    document.getElementById('adminCreateModal').style.display = 'flex';
    document.getElementById('adminCreateForm').reset();
}
function closeCreateAdminModal() {
    document.getElementById('adminCreateModal').style.display = 'none';
}

document.getElementById('adminCreateForm')?.addEventListener('submit', async function(e) {
    e.preventDefault();
    const name     = document.getElementById('newAdminName').value.trim();
    const email    = document.getElementById('newAdminEmail').value.trim();
    const password = document.getElementById('newAdminPassword').value;
    if (password.length < 6) return Swal.fire({ icon: 'warning', title: 'Weak Password', text: 'Password must be at least 6 characters.' });
    showLoading('Creating...');
    try {
        const res  = await apiFetch('/super_admin/create_admin', { method: 'POST', body: JSON.stringify({ admin_name: name, admin_email: email, admin_password: password }) });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message);
        Swal.fire({ icon: 'success', title: 'Admin Created!', text: `${name} can now log in.`, timer: 2000, showConfirmButton: false });
        closeCreateAdminModal();
        fetchAdminAccounts();
    } catch (err) {
        Swal.fire({ icon: 'error', title: 'Failed', text: err.message });
    }
});

async function resetAdminPassword(id, name) {
    const { value: newPassword, isConfirmed } = await Swal.fire({
        title: 'Reset Password',
        html: `<p style="margin-bottom:12px;color:#666">Set a new password for <strong>${name}</strong>.</p>
               <input id="swal-newpw" type="password" class="swal2-input" placeholder="New password (min 6 chars)">`,
        showCancelButton: true,
        confirmButtonText: 'Reset',
        confirmButtonColor: '#3d6b6b',
        preConfirm: () => {
            const v = document.getElementById('swal-newpw').value;
            if (v.length < 6) { Swal.showValidationMessage('Password must be at least 6 characters.'); return false; }
            return v;
        }
    });
    if (!isConfirmed || !newPassword) return;
    showLoading('Resetting...');
    try {
        const res  = await apiFetch(`/super_admin/reset_admin_password/${id}`, { method: 'PUT', body: JSON.stringify({ new_password: newPassword }) });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message);
        Swal.fire({ icon: 'success', title: 'Password Reset!', text: `${name}'s password has been updated.`, timer: 2000, showConfirmButton: false });
    } catch (err) {
        Swal.fire({ icon: 'error', title: 'Failed', text: err.message });
    }
}

async function deleteAdminAccount(id, name) {
    const result = await Swal.fire({
        title: 'Delete Admin?',
        text: `Are you sure you want to delete "${name}"? This cannot be undone.`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        confirmButtonText: 'Yes, delete'
    });
    if (!result.isConfirmed) return;
    showLoading('Deleting...');
    try {
        const res  = await apiFetch(`/super_admin/delete_admin/${id}`, { method: 'DELETE' });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message);
        Swal.fire({ icon: 'success', title: 'Deleted!', timer: 1500, showConfirmButton: false });
        fetchAdminAccounts();
    } catch (err) {
        Swal.fire({ icon: 'error', title: 'Failed', text: err.message });
    }
}

// ============================================================
// SYSTEM STATS
// ============================================================
async function loadSystemStats() {
    try {
        const res = await apiFetch('/super_admin/system_stats');
        const data = await res.json();
        if (!res.ok || !data.ok) return;
        const s = data.content;
        if (DOM.sideBarStatsValue)    DOM.sideBarStatsValue.textContent    = s.total_admins;
        if (DOM.statsValue)           DOM.statsValue.textContent           = s.total_event_attendees ?? 0;
        if (DOM.adminAccountCounts)   DOM.adminAccountCounts.textContent   = s.total_admins   + ' Accounts';
        if (DOM.teacherAccountCounts) DOM.teacherAccountCounts.textContent = s.total_teachers + ' Accounts';
        if (DOM.guardAccountCounts)   DOM.guardAccountCounts.textContent   = s.total_guards   + ' Accounts';
        if (DOM.studentAccountCounts) DOM.studentAccountCounts.textContent = s.total_students + ' Accounts';
    } catch (err) { console.error('[loadSystemStats]', err); }
}

// ============================================================
// LOGIN LOGS
// ============================================================
const ROLE_COLORS = {
    admin:       { bg:'#e3f2fd', color:'#1565c0' },
    teacher:     { bg:'#e8f5e9', color:'#2e7d32' },
    guard:       { bg:'#fff3e0', color:'#e65100' },
    student:     { bg:'#f3e5f5', color:'#6a1b9a' },
    super_admin: { bg:'#fce4ec', color:'#880e4f' },
};

let _loginLogs = [];

async function renderLoginLogs() {
    try {
        const res  = await apiFetch('/super_admin/login_logs?limit=500');
        const data = await res.json();
        if (!res.ok || !data.ok) throw new Error(data.message);
        _loginLogs = data.content || [];
        renderLoginLogsTable(_loginLogs);
    } catch (err) {
        const tbody = document.getElementById('loginLogsBody');
        if (tbody) tbody.innerHTML = '<tr><td colspan="6" style="text-align:center;color:#999;padding:20px">Failed to load login logs.</td></tr>';
    }
}

function renderLoginLogsTable(logs) {
    const tbody = document.getElementById('loginLogsBody');
    if (!tbody) return;
    if (!logs.length) { tbody.innerHTML = '<tr><td colspan="6" style="text-align:center;color:#999;padding:20px">No login records yet.</td></tr>'; return; }
    tbody.innerHTML = logs.map((l, i) => {
        const rc = ROLE_COLORS[l.role] || { bg:'#f5f5f5', color:'#555' };
        return `<tr>
            <td>${i + 1}</td>
            <td>${l.user_name || '<em style="color:#999">Unknown</em>'}</td>
            <td>${l.user_email || '-'}</td>
            <td><span style="padding:3px 10px;border-radius:12px;font-size:11px;font-weight:700;background:${rc.bg};color:${rc.color}">${(l.role||'-').replace('_',' ').toUpperCase()}</span></td>
            <td><span style="padding:3px 10px;border-radius:12px;font-size:11px;font-weight:700;background:${l.status==='SUCCESS'?'#e8f5e9':'#ffebee'};color:${l.status==='SUCCESS'?'#2e7d32':'#c62828'}">${l.status}</span></td>
            <td>${l.login_at}</td>
        </tr>`;
    }).join('');
}

function refreshLoginLogs() {
    renderLoginLogs();
    Swal.fire({ toast:true, position:'top-end', icon:'success', title:'Login logs refreshed', showConfirmButton:false, timer:1500 });
}

// ============================================================
// ACTIVITY LOGS — all users
// ============================================================
const ACTION_LABELS = {
    // Student
    CLASS_ATTENDANCE_IN:  { label:'Class Attendance',  color:'#2e7d32', bg:'#e8f5e9' },
    // Teacher
    MANUAL_ATTENDANCE:    { label:'Manual Attendance', color:'#1565c0', bg:'#e3f2fd' },
    ADD_STUDENT_TO_CLASS: { label:'Add to Class',      color:'#6a1b9a', bg:'#f3e5f5' },
    // Guard
    EVENT_TIME_IN:        { label:'Event TIME IN',     color:'#00695c', bg:'#e0f2f1' },
    EVENT_TIME_OUT:       { label:'Event TIME OUT',    color:'#e65100', bg:'#fff3e0' },
    // Admin
    CREATE_TEACHER:       { label:'Create Teacher',    color:'#1565c0', bg:'#e3f2fd' },
    DELETE_TEACHER:       { label:'Delete Teacher',    color:'#c62828', bg:'#ffebee' },
    CREATE_GUARD:         { label:'Create Guard',      color:'#1565c0', bg:'#e3f2fd' },
    DELETE_GUARD:         { label:'Delete Guard',      color:'#c62828', bg:'#ffebee' },
    DELETE_STUDENT:       { label:'Delete Student',    color:'#c62828', bg:'#ffebee' },
    // Super Admin
    CREATE_ADMIN:         { label:'Create Admin',      color:'#1565c0', bg:'#e3f2fd' },
    EDIT_ADMIN:           { label:'Edit Admin',        color:'#6a1b9a', bg:'#f3e5f5' },
    DELETE_ADMIN:         { label:'Delete Admin',      color:'#c62828', bg:'#ffebee' },
    RESET_ADMIN_PASSWORD: { label:'Reset Password',    color:'#e65100', bg:'#fff3e0' },
};

let _activityLogs = [];

async function renderActivityLogs() {
    try {
        const res  = await apiFetch('/super_admin/activity_logs?limit=500');
        const data = await res.json();
        if (!res.ok || !data.ok) throw new Error(data.message);
        _activityLogs = data.content || [];
        renderActivityLogsTable(_activityLogs);
    } catch (err) {
        const tbody = document.getElementById('activityLogsBody');
        if (tbody) tbody.innerHTML = '<tr><td colspan="8" style="text-align:center;color:#999;padding:20px">Failed to load activity logs.</td></tr>';
    }
}

function renderActivityLogsTable(logs) {
    const tbody = document.getElementById('activityLogsBody');
    if (!tbody) return;
    if (!logs.length) { tbody.innerHTML = '<tr><td colspan="8" style="text-align:center;color:#999;padding:20px">No activity logs yet.</td></tr>'; return; }
    tbody.innerHTML = logs.map((l, i) => {
        const meta = ACTION_LABELS[l.action] || { label:l.action, color:'#555', bg:'#f5f5f5' };
        const rc   = ROLE_COLORS[l.actor_role] || { bg:'#f5f5f5', color:'#555' };
        return `<tr>
            <td>${i + 1}</td>
            <td>${l.actor_name || '<em style="color:#999">System</em>'}</td>
            <td><span style="padding:3px 10px;border-radius:12px;font-size:11px;font-weight:700;background:${rc.bg};color:${rc.color}">${(l.actor_role||'-').replace('_',' ').toUpperCase()}</span></td>
            <td><span style="padding:3px 10px;border-radius:12px;font-size:11px;font-weight:700;background:${meta.bg};color:${meta.color}">${meta.label}</span></td>
            <td>${l.target_type || '-'}</td>
            <td>${l.target_name || l.target_id || '-'}</td>
            <td style="max-width:180px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap" title="${(l.details||'').replace(/"/g,'&quot;')}">${l.details || '-'}</td>
            <td>${l.performed_at}</td>
        </tr>`;
    }).join('');
}

function refreshActivityLogs() {
    renderActivityLogs();
    Swal.fire({ toast:true, position:'top-end', icon:'success', title:'Activity logs refreshed', showConfirmButton:false, timer:1500 });
}