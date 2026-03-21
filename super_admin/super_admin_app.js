// ============================================================
// CONSTANTS & CONFIG
// ============================================================

// ============================================================
// DEVICE INFO — collected once, reused on every request
// ============================================================
let _cachedDeviceInfo = null;
async function getDeviceInfo() {
    if (_cachedDeviceInfo) return _cachedDeviceInfo;
    try {
        if (navigator.userAgentData) {
            const data = await navigator.userAgentData.getHighEntropyValues([
                'model', 'platform', 'platformVersion', 'mobile'
            ]);
            const model    = data.model    || '';
            const platform = data.platform || '';
            const ver      = data.platformVersion ? data.platformVersion.split('.')[0] : '';
            const browser  = (navigator.userAgentData.brands || []).find(b =>
                /chrome|edge|firefox|safari|opera/i.test(b.brand)
            );
            const browserStr = browser ? `${browser.brand} ${browser.version.split('.')[0]}` : '';
            const parts = [browserStr, platform + (ver ? ' ' + ver : ''), model].filter(Boolean);
            _cachedDeviceInfo = parts.join(' · ') || navigator.userAgent;
        } else {
            _cachedDeviceInfo = navigator.userAgent;
        }
    } catch (_) {
        _cachedDeviceInfo = navigator.userAgent;
    }
    return _cachedDeviceInfo;
}

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
    'activityLogs',
    'classManagement'
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
    activityLogs: 'Activity Logs',
    classManagement: 'Class Management'
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
    eventHistoryProgramFilter: document.getElementById('eventHistoryProgramFilter'),
    eventHistoryStatusFilter: document.getElementById('eventHistoryStatusFilter'),
    eventHistoryNameFilter: document.getElementById('eventHistoryNameFilter'),
    eventStatusFilter: document.getElementById('eventStatusFilter'),
    eventNameFilter: document.getElementById('eventNameFilter'),
    eventYearFilter: document.getElementById('eventYearFilter'),
    eventProgramFilter: document.getElementById('eventProgramFilter'),

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
    studentEmail: document.getElementById('studentEmail'),

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
    const deviceInfo = localStorage.getItem('sa_device_info') || '';
    // Auto-inject device_info into POST/PUT bodies
    if ((options.method === 'POST' || options.method === 'PUT') && options.body) {
        try {
            const parsed = JSON.parse(options.body);
            if (!parsed.device_info) options.body = JSON.stringify({ ...parsed, device_info: deviceInfo });
        } catch (_) {}
    } else if (options.method === 'POST' || options.method === 'PUT') {
        options.body = JSON.stringify({ device_info: deviceInfo });
    }
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

/** Populate a filter <select> with unique values from data, restoring saved selection */
function populateFilterOptions(data, selectId, valueFn, allLabel, storageKey) {
    const el = document.getElementById(selectId);
    if (!el) return;
    const saved = storageKey ? (localStorage.getItem(storageKey) || '') : el.value;
    const unique = [...new Set(data.map(valueFn).filter(Boolean))].sort();
    el.innerHTML = `<option value="">${allLabel}</option>` +
        unique.map(v => `<option value="${v}">${v}</option>`).join('');
    if (unique.includes(saved)) el.value = saved;
}

/** Filter a tbody by multiple column-value pairs simultaneously */
function multiFilterTableRows(tbodyId, filters) {
    document.querySelectorAll(`#${tbodyId} tr`).forEach(row => {
        const visible = filters.every(({ colIndex, value }) => {
            if (!value) return true;
            return row.cells[colIndex]?.textContent.trim().toLowerCase() === value.toLowerCase();
        });
        row.style.display = visible ? '' : 'none';
    });
}

/** Load and display the currently active event */
async function loadActiveEvent() {
    if (!TOKEN || TOKEN === 'null') return renderActiveEvent('');
    try {
        const res  = await apiFetch('/super_admin/get_active_event');
        const data = await res.json();
        if (res.ok && data.content) renderActiveEvent(data.content.event_name_set || '');
    } catch (_) { renderActiveEvent(''); }
}

function renderActiveEvent(eventName) {
    const el = document.getElementById('activeEventDisplay');
    if (!el) return;
    if (eventName && eventName.trim() !== '') {
        el.textContent = `✓ ${eventName}`;
        el.style.background = '#c8ece5'; el.style.color = '#1a5c4f';
        const eventInput = document.getElementById('event_name_input');
        if (eventInput && !eventInput.value) eventInput.value = eventName;
    } else {
        el.textContent = '⚠ No event set';
        el.style.background = '#fdecea'; el.style.color = '#b94a3a';
    }
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
    loadActiveEvent();
    renderEventAttendanceRecord()
        .then(() => renderEventHistoryAttendanceRecord())
        .then(() => { renderPrograms(); renderYearLevels(); loadActiveEvent(); })
        .catch(() => { renderPrograms(); renderYearLevels(); });
    generateProgramSelectionOnTeacher();
    generateYearLevelSelections();
    loadClassTeacherPicker();
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

    // Mark the active sidebar nav item
    document.querySelectorAll('.menu-item').forEach(btn => {
        const onclick = btn.getAttribute('onclick') || '';
        btn.classList.toggle('active-page', onclick.includes(`'${page}'`));
    });

    // Remind admin about the active event when opening Event Attendance
    if (page === 'eventAttendance') {
        checkEventReminder();
    }

    // Load settings stats when opening settings
    if (page === 'adminSettings') {
        loadSettingsStats();
        // Re-sync theme button active states
        const saved = JSON.parse(localStorage.getItem(THEME_STORAGE_KEY) || '{}');
        applyTheme(saved.mode || 'light', saved.font || 'system', saved.size || 'medium', false);
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
        apiFetch('/super_admin/logout', { method: 'POST', body: JSON.stringify({ device_info: localStorage.getItem('sa_device_info') || '' }) }).catch(() => {});
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
    const newPassword     = document.getElementById('newPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    if (!currentPassword || !newPassword || !confirmPassword) {
        return Swal.fire({ icon: 'warning', title: 'Missing Fields', text: 'Please fill in all password fields.' });
    }
    if (newPassword.length < 6) {
        return Swal.fire({ icon: 'warning', title: 'Weak Password', text: 'New password must be at least 6 characters long.' });
    }
    if (newPassword !== confirmPassword) {
        return Swal.fire({ icon: 'error', title: 'Password Mismatch', text: 'The new passwords do not match.' });
    }
    if (newPassword === currentPassword) {
        return Swal.fire({ icon: 'warning', title: 'Same Password', text: 'New password must be different from your current password.' });
    }

    Swal.fire({ title: 'Updating password...', allowOutsideClick: false, didOpen: () => Swal.showLoading() });

    try {
        const res  = await apiFetch('/super_admin/change_password', {
            method: 'PUT',
            body: JSON.stringify({ current_password: currentPassword, new_password: newPassword, confirm_password: confirmPassword })
        });
        const data = await res.json();

        if (!res.ok) {
            return Swal.fire({ icon: 'error', title: 'Update Failed', text: data.message || 'Incorrect current password or server error.' });
        }

        Swal.fire({ icon: 'success', title: 'Password Updated!', text: 'Your password has been changed successfully.', timer: 2000, showConfirmButton: false });
        ['currentPassword', 'newPassword', 'confirmPassword'].forEach(id => { document.getElementById(id).value = ''; });
    } catch (err) {
        Swal.fire({ icon: 'error', title: 'Error', text: err.message || 'Something went wrong. Please try again.' });
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

        populateFilterOptions(data.content, 'eventNameFilter',    d => d.event_name,        'All Events',      'ef_name');
        populateFilterOptions(data.content, 'eventYearFilter',    d => d.student_year_level, 'All Year Levels', 'ef_year');
        populateFilterOptions(data.content, 'eventProgramFilter', d => d.student_program,   'All Programs',    'ef_program');
        // Reset all filter dropdowns to "All" so full list shows by default
        ['ef_status','ef_name','ef_year','ef_program'].forEach(k => localStorage.removeItem(k));
        if (DOM.eventStatusFilter)  DOM.eventStatusFilter.value  = '';
        if (DOM.eventNameFilter)    DOM.eventNameFilter.value    = '';
        if (DOM.eventYearFilter)    DOM.eventYearFilter.value    = '';
        if (DOM.eventProgramFilter) DOM.eventProgramFilter.value = '';

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

        populateFilterOptions(data.content, 'eventHistoryNameFilter',    d => d.event_name,        'All Events',      'ehf_name');
        populateFilterOptions(data.content, 'eventHistoryYearFilter',    d => d.student_year_level, 'All Year Levels', 'ehf_year');
        populateFilterOptions(data.content, 'eventHistoryProgramFilter', d => d.student_program,   'All Programs',    'ehf_program');
        // Reset all filter dropdowns to "All" so full list shows by default
        ['ehf_status','ehf_name','ehf_year','ehf_program'].forEach(k => localStorage.removeItem(k));
        if (DOM.eventHistoryStatusFilter)  DOM.eventHistoryStatusFilter.value  = '';
        if (DOM.eventHistoryNameFilter)    DOM.eventHistoryNameFilter.value    = '';
        if (DOM.eventHistoryYearFilter)    DOM.eventHistoryYearFilter.value    = '';
        if (DOM.eventHistoryProgramFilter) DOM.eventHistoryProgramFilter.value = '';
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
        const response = await apiFetch('/super_admin/set_event', {
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
        renderActiveEvent(eventName);
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
        const res = await apiFetch('/super_admin/add_program', {
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
        const res = await apiFetch(`/super_admin/delete_program/${id}`, { method: 'DELETE' });
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
        const res = await apiFetch('/super_admin/get_year_levels');
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
        const res = await apiFetch('/super_admin/add_year_level', {
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
        const res = await apiFetch(`/super_admin/delete_year_level/${id}`, { method: 'DELETE' });
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
        const res = await fetch(`${URL_BASED}/super_admin/get_whole_campus_accounts_count/${tableName}`, {
            headers: { 'Content-Type': 'application/json', 'Accept': 'application/json', 'Authorization': `Bearer ${TOKEN}` }
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
                        '${d.student_year_level}',
                        '${d.student_email || ''}')">Edit</button>
                    <button class="action-btn" style="background:#e67e22;color:#fff;" onclick="resetStudentDevice(${d.student_id}, '${d.student_firstname} ${d.student_lastname}')">Reset Device</button>
                    <button class="action-btn" style="background:#8e44ad;color:#fff;" onclick="resetUserPassword('student',${d.student_id},'${d.student_firstname} ${d.student_lastname}')">Reset PW</button>
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
                    <button class="action-btn" style="background:#8e44ad;color:#fff;" onclick="resetUserPassword('teacher',${d.teacher_id},'${d.teacher_name}')">Reset PW</button>
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
                    <button class="action-btn" style="background:#8e44ad;color:#fff;" onclick="resetUserPassword('guard',${d.guard_id},'${d.guard_name}')">Reset PW</button>
                    <button class="action-btn delete-btn-account-management" onclick="deleteGuard(${d.guard_id})">Delete</button>
                </div>
            </div>
        </div>
    `).join('');
}

// ============================================================
// ACCOUNTS — EDIT (open modals)
// ============================================================
function editStudent(id, student_id_number, student_firstname, student_middlename, student_lastname, student_program, student_year_level, student_email) {
    DOM.studentAccountManagementModal.style.display = 'flex';
    DOM.studentIDTracking.value = id;
    DOM.studentIdNumber.value = student_id_number;
    DOM.studentFirstName.value = student_firstname;
    DOM.studentMiddleName.value = student_middlename;
    DOM.studentLastName.value = student_lastname;
    DOM.studentProgram.value = student_program;
    DOM.studentYearLevel.value = student_year_level;
    if (DOM.studentEmail) DOM.studentEmail.value = student_email || '';
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
        year_level: DOM.studentYearLevel.value,
        email: DOM.studentEmail?.value.trim() || ''
    };

    showLoading();
    try {
        const res = await apiFetch(`/super_admin/edit_student_account/${payload.student_id}`, {
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
        if (data.duplicate_email) {
            return Swal.fire({
                icon: 'warning',
                title: 'Email Already Exists',
                text: `The email "${payload.email}" is already used by another student.`
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
        const res = await apiFetch(`/super_admin/edit_teacher_account/${payload.teacher_id}`, {
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
        const res = await apiFetch(`/super_admin/edit_guard_account/${payload.guard_id}`, {
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
        endpoint: `/super_admin/delete_student_account/${id}`,
        successTitle: 'Student Account Deleted',
        successText: 'The student account has been successfully deleted.',
        onSuccess: fetchStudentAccounts
    });
}

async function resetUserPassword(role, id, name) {
    const { value: newPassword, isConfirmed } = await Swal.fire({
        title: 'Reset Password',
        html: `<p style="margin-bottom:12px;color:#666">Set a new password for <strong>${name}</strong>.</p>
               <input id="swal-newpw" type="password" class="swal2-input" placeholder="New password (min 6 chars)">
               <input id="swal-confirmpw" type="password" class="swal2-input" placeholder="Confirm new password" style="margin-top:8px;">`,
        showCancelButton: true,
        confirmButtonText: 'Reset',
        confirmButtonColor: '#8e44ad',
        preConfirm: () => {
            const pw  = document.getElementById('swal-newpw').value;
            const cpw = document.getElementById('swal-confirmpw').value;
            if (pw.length < 6) { Swal.showValidationMessage('Password must be at least 6 characters.'); return false; }
            if (pw !== cpw)    { Swal.showValidationMessage('Passwords do not match.'); return false; }
            return pw;
        }
    });
    if (!isConfirmed || !newPassword) return;

    const endpointMap = {
        student: `/super_admin/reset_student_password/${id}`,
        teacher: `/super_admin/reset_teacher_password/${id}`,
        guard:   `/super_admin/reset_guard_password/${id}`,
    };

    showLoading('Resetting password...');
    try {
        const res  = await apiFetch(endpointMap[role], { method: 'PUT', body: JSON.stringify({ new_password: newPassword }) });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message);
        Swal.fire({ icon: 'success', title: 'Password Reset!', text: `${name}'s password has been updated.`, timer: 2000, showConfirmButton: false });
    } catch (err) {
        Swal.fire({ icon: 'error', title: 'Failed', text: err.message });
    }
}

async function resetStudentDevice(id, studentName) {
    const confirm = await Swal.fire({
        icon: 'warning',
        title: 'Reset Device Binding?',
        html: `This will remove the registered device for <strong>${studentName}</strong>.<br>They will be able to log in from a new device on their next login.`,
        showCancelButton: true,
        confirmButtonText: 'Yes, Reset',
        cancelButtonText: 'Cancel',
        confirmButtonColor: '#e67e22',
    });
    if (!confirm.isConfirmed) return;

    try {
        const res  = await apiFetch(`/super_admin/reset_student_device/${id}`, { method: 'PUT' });
        const data = await res.json();
        if (res.ok) {
            Swal.fire({ icon: 'success', title: 'Device Reset', text: `${studentName} can now log in from a new device.`, timer: 2000, showConfirmButton: false });
            fetchStudentAccounts();
        } else {
            Swal.fire({ icon: 'error', title: 'Reset Failed', text: data.message || 'Something went wrong.' });
        }
    } catch (err) {
        Swal.fire({ icon: 'error', title: 'Error', text: err.message || 'Please try again.' });
    }
}

function deleteTeacher(id) {
    deleteAccount({
        confirmText: 'This action will permanently delete the teacher account.',
        endpoint: `/super_admin/delete_teacher_account/${id}`,
        successTitle: 'Teacher Account Deleted',
        successText: 'The teacher account has been successfully deleted.',
        onSuccess: fetchTeacherAccounts
    });
}

function deleteGuard(id) {
    deleteAccount({
        confirmText: 'This action will permanently delete the guard account.',
        endpoint: `/super_admin/delete_guard_account/${id}`,
        successTitle: 'Guard Account Deleted',
        successText: 'The guard account has been successfully deleted.',
        onSuccess: fetchGuardAccounts
    });
}

// ============================================================
// REGISTRATION
// ============================================================
function switchRole(role) {
    // Update role cards
    document.querySelectorAll('.reg-role-card').forEach(card => card.classList.remove('active'));
    document.getElementById(`roleCard-${role}`)?.classList.add('active');
    // Update forms
    document.querySelectorAll('.form-section').forEach(form => form.classList.remove('active'));
    document.getElementById(`${role}Form`)?.classList.add('active');
}

document.getElementById('adminForm')?.addEventListener('submit', async function(e) {
    e.preventDefault();
    const name            = document.getElementById('reg_admin_name').value.trim();
    const email           = document.getElementById('reg_admin_email').value.trim();
    const password        = document.getElementById('reg_admin_password').value;
    const confirmPassword = document.getElementById('reg_admin_confirm_password').value;
    if (password.length < 6) return Swal.fire({ icon:'warning', title:'Weak Password', text:'Password must be at least 6 characters.' });
    if (password !== confirmPassword) return Swal.fire({ icon:'error', title:'Password Mismatch', text:'The passwords do not match.' });
    showLoading('Creating admin...');
    try {
        const res  = await apiFetch('/super_admin/create_admin', {
            method: 'POST',
            body: JSON.stringify({ admin_name: name, admin_email: email, admin_password: password })
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message);
        Swal.fire({ icon:'success', title:'Admin Created!', text:`${name} can now log in.`, timer:2000, showConfirmButton:false });
        this.reset();
        fetchAdminAccounts();
    } catch (err) {
        Swal.fire({ icon:'error', title:'Failed', text: err.message });
    }
});

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

function printSection(tableId, title) {
    const table = document.getElementById(tableId);
    if (!table) return;

    const now  = new Date().toLocaleString('en-PH');

    // Clone and strip Action columns
    const clone = table.cloneNode(true);
    let actionColIndex = -1;
    clone.querySelectorAll('thead th').forEach((th, i) => {
        if (/action|actions/i.test(th.textContent.trim())) actionColIndex = i;
    });
    if (actionColIndex !== -1) {
        clone.querySelectorAll('tr').forEach(row => {
            if (row.children[actionColIndex]) row.children[actionColIndex].remove();
        });
    }
    // Skip filtered-out rows
    clone.querySelectorAll('tbody tr').forEach(tr => {
        if (tr.style.display === 'none') tr.remove();
    });

    const rows    = clone.querySelectorAll('tbody tr').length;
    const content = clone.outerHTML;

    const printWin = window.open('', '_blank', 'width=900,height=700');
    printWin.document.write(`
        <!DOCTYPE html><html><head><title>${title}</title>
        <style>
            body { font-family: Arial, sans-serif; margin: 24px; color: #111; }
            .header { text-align: center; margin-bottom: 18px; }
            .header h2 { margin: 0; font-size: 1.1rem; text-transform: uppercase; color: #1a4545; }
            .header h3 { margin: 4px 0 2px; font-size: 1.3rem; }
            .header p  { margin: 0; font-size: 0.85rem; color: #555; }
            table { width: 100%; border-collapse: collapse; font-size: 0.82rem; margin-top: 12px; }
            th { background: #1a4545; color: #fff; padding: 8px 10px; text-align: left; }
            td { padding: 6px 10px; border-bottom: 1px solid #ddd; }
            tr:nth-child(even) td { background: #f5f9f9; }
            .footer { margin-top: 16px; font-size: 0.78rem; color: #777; text-align: right; }
            @media print { body { margin: 0; } }
        </style></head><body>
            <div class="header">
                <h2>PanPacific University</h2>
                <h3>${title}</h3>
                <p>Generated: ${now} &nbsp;|&nbsp; Total Records: ${rows}</p>
            </div>
            ${content}
            <div class="footer">PanPacific University Attendance System</div>
            <script>window.onload = () => { window.print(); window.onafterprint = () => window.close(); }<\/script>
        </body></html>
    `);
    printWin.document.close();
}

function exportTableToExcel(tableId, fileName) {
    const table = document.getElementById(tableId);
    if (!table) return Swal.fire({ icon: 'info', title: 'Export Failed', text: 'No table data found to export.' });

    try {
        const wb = XLSX.utils.book_new();

        // --- Extract headers (skip hidden columns with action buttons) ---
        const headers = [];
        table.querySelectorAll('thead th').forEach(th => headers.push(th.innerText.trim()));

        // --- Extract rows (skip hidden rows from filters) ---
        const rows = [];
        table.querySelectorAll('tbody tr').forEach(tr => {
            if (tr.style.display === 'none') return; // skip filtered-out rows
            const row = [];
            tr.querySelectorAll('td').forEach(td => row.push(td.innerText.trim()));
            if (row.some(cell => cell !== '')) rows.push(row);
        });

        if (rows.length === 0)
            return Swal.fire({ icon: 'info', title: 'No Data', text: 'The table has no records to export.' });

        const now      = new Date();
        const dateStr  = now.toLocaleDateString('en-PH', { year: 'numeric', month: 'long', day: 'numeric' });
        const timeStr  = now.toLocaleTimeString('en-PH', { hour: '2-digit', minute: '2-digit' });
        const colCount = headers.length;

        const sheetData = [
            ['PanPacific University'],
            [fileName + ' Report'],
            [`Generated: ${dateStr} ${timeStr}`],
            [],
            headers,
            ...rows,
            [],
            [`Total Records: ${rows.length}`]
        ];

        const ws = XLSX.utils.aoa_to_sheet(sheetData);

        // --- Auto-fit column widths ---
        const colWidths = headers.map((h, i) => {
            const maxData = rows.reduce((max, row) => {
                const len = (row[i] || '').toString().length;
                return len > max ? len : max;
            }, h.length);
            return { wch: Math.min(Math.max(maxData + 4, 12), 40) };
        });
        ws['!cols'] = colWidths;

        // --- Merge title rows across all columns ---
        const mergeEnd = colCount - 1;
        ws['!merges'] = [
            { s: { r: 0, c: 0 }, e: { r: 0, c: mergeEnd } }, // School name
            { s: { r: 1, c: 0 }, e: { r: 1, c: mergeEnd } }, // Report title
            { s: { r: 2, c: 0 }, e: { r: 2, c: mergeEnd } }, // Date
            { s: { r: rows.length + 6, c: 0 }, e: { r: rows.length + 6, c: mergeEnd } } // Total
        ];

        XLSX.utils.book_append_sheet(wb, ws, fileName.substring(0, 31));
        XLSX.writeFile(wb, `${fileName}_${now.toISOString().split('T')[0]}.xlsx`);

        Swal.fire({ icon: 'success', title: 'Exported!', text: `${rows.length} records exported to Excel.`, timer: 1800, showConfirmButton: false });
    } catch (e) {
        console.error(e);
        Swal.fire('Error', 'Failed to generate Excel file: ' + e.message, 'error');
    }
}

// ============================================================
// CHART
// ============================================================
async function fetchPrograms() {
    try {
        const res = await apiFetch('/super_admin/present_program_counts');
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

function updateChartStats(result) {
    const total   = result.total_attended.reduce((a, b) => a + Number(b), 0);
    const maxIdx  = result.total_attended.indexOf(Math.max(...result.total_attended.map(Number)));
    const topProg = result.programs[maxIdx] || '—';
    const totalEl = document.getElementById('chartStatTotal');
    const progEl  = document.getElementById('chartStatPrograms');
    const topEl   = document.getElementById('chartStatTop');
    if (totalEl) totalEl.textContent = total;
    if (progEl)  progEl.textContent  = result.programs.length;
    if (topEl)   topEl.textContent   = topProg;
}

let _adminChart = null;

async function initChart() {
    const result = await fetchPrograms();
    if (!result) return;

    updateChartStats(result);

    Chart.register(ChartDataLabels);
    _adminChart = new Chart(document.getElementById('myChart'), {
        type: 'pie',
        data: {
            labels: result.programs,
            datasets: [{
                label: 'Event Attendance',
                data: result.total_attended,
                backgroundColor: [
                    '#5a8a7a','#3d6b6b','#7fb3a3','#2c5a5a','#a8d5c8',
                    '#1a4545','#6fa89a','#4e7c6d','#93c9bb','#2d7a6a'
                ],
                borderColor: '#fff',
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            animation: { duration: 1500 },
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: { padding: 14, font: { size: 11 } }
                },
                datalabels: {
                    color: '#fff',
                    font: { weight: 'bold', size: 12 },
                    formatter: (value, ctx) => {
                        const total = ctx.dataset.data.reduce((a, b) => a + Number(b), 0);
                        const pct = total ? Math.round(value / total * 100) : 0;
                        return pct > 4 ? pct + '%' : '';
                    }
                }
            }
        }
    });
}

async function updateChart() {
    const result = await fetchPrograms();
    if (!result) return;
    updateChartStats(result);
    if (!_adminChart) return;
    _adminChart.data.labels = result.programs;
    _adminChart.data.datasets[0].data = result.total_attended;
    _adminChart.data.datasets[0].backgroundColor = [
        '#5a8a7a','#3d6b6b','#7fb3a3','#2c5a5a','#a8d5c8',
        '#1a4545','#6fa89a','#4e7c6d','#93c9bb','#2d7a6a'
    ];
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

    // Event attendance current — multi filters
    function applyEventNowFilters() {
        localStorage.setItem('ef_status',  DOM.eventStatusFilter?.value || '');
        localStorage.setItem('ef_name',    DOM.eventNameFilter?.value   || '');
        localStorage.setItem('ef_year',    DOM.eventYearFilter?.value   || '');
        localStorage.setItem('ef_program', DOM.eventProgramFilter?.value|| '');
        multiFilterTableRows('attendanceBody', [
            { colIndex: 6, value: DOM.eventStatusFilter?.value  || '' },
            { colIndex: 7, value: DOM.eventNameFilter?.value    || '' },
            { colIndex: 3, value: DOM.eventYearFilter?.value    || '' },
            { colIndex: 2, value: DOM.eventProgramFilter?.value || '' },
        ]);
    }
    DOM.eventStatusFilter?.addEventListener('change', applyEventNowFilters);
    DOM.eventNameFilter?.addEventListener('change', applyEventNowFilters);
    DOM.eventYearFilter?.addEventListener('change', applyEventNowFilters);
    DOM.eventProgramFilter?.addEventListener('change', applyEventNowFilters);

    // Event attendance history — multi filters
    function applyEventHistoryFilters() {
        localStorage.setItem('ehf_status',  DOM.eventHistoryStatusFilter?.value  || '');
        localStorage.setItem('ehf_name',    DOM.eventHistoryNameFilter?.value    || '');
        localStorage.setItem('ehf_year',    DOM.eventHistoryYearFilter?.value    || '');
        localStorage.setItem('ehf_program', DOM.eventHistoryProgramFilter?.value || '');
        multiFilterTableRows('attendanceHistory', [
            { colIndex: 6, value: DOM.eventHistoryStatusFilter?.value  || '' },
            { colIndex: 7, value: DOM.eventHistoryNameFilter?.value    || '' },
            { colIndex: 3, value: DOM.eventHistoryYearFilter?.value    || '' },
            { colIndex: 2, value: DOM.eventHistoryProgramFilter?.value || '' },
        ]);
    }
    DOM.eventHistoryStatusFilter?.addEventListener('change', applyEventHistoryFilters);
    DOM.eventHistoryNameFilter?.addEventListener('change', applyEventHistoryFilters);
    DOM.eventHistoryYearFilter?.addEventListener('change', applyEventHistoryFilters);
    DOM.eventHistoryProgramFilter?.addEventListener('change', applyEventHistoryFilters);

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
        renderLoginLogsTable(_loginLogs.filter(l => (l.user_name||'').toLowerCase().includes(t)||(l.user_email||'').toLowerCase().includes(t)||(l.role||'').toLowerCase().includes(t)||(l.status||'').toLowerCase().includes(t)||(l.ip_address||'').toLowerCase().includes(t)||(l.device_info||'').toLowerCase().includes(t)));
    });

    document.getElementById('searchActivityLogs')?.addEventListener('input', function() {
        const t = this.value.toLowerCase();
        renderActivityLogsTable(_activityLogs.filter(l => (l.actor_name||'').toLowerCase().includes(t)||(l.actor_role||'').toLowerCase().includes(t)||(l.action||'').toLowerCase().includes(t)||(l.target_name||'').toLowerCase().includes(t)||(l.details||'').toLowerCase().includes(t)||(l.ip_address||'').toLowerCase().includes(t)||(l.device_info||'').toLowerCase().includes(t)));
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
               <input id="swal-newpw" type="password" class="swal2-input" placeholder="New password (min 6 chars)">
               <input id="swal-confirmpw" type="password" class="swal2-input" placeholder="Confirm new password" style="margin-top:8px;">`,
        showCancelButton: true,
        confirmButtonText: 'Reset',
        confirmButtonColor: '#3d6b6b',
        preConfirm: () => {
            const pw  = document.getElementById('swal-newpw').value;
            const cpw = document.getElementById('swal-confirmpw').value;
            if (pw.length < 6) { Swal.showValidationMessage('Password must be at least 6 characters.'); return false; }
            if (pw !== cpw)    { Swal.showValidationMessage('Passwords do not match.'); return false; }
            return pw;
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
// THEME MANAGEMENT
// ============================================================
const THEME_STORAGE_KEY = 'sa_theme';

function loadTheme() {
    const saved = JSON.parse(localStorage.getItem(THEME_STORAGE_KEY) || '{}');
    applyTheme(saved.mode || 'light', saved.font || 'system', saved.size || 'medium', false);
}

function applyTheme(mode, font, size, save = true) {
    const html = document.documentElement;
    html.setAttribute('data-theme', mode === 'dark' ? 'dark' : '');
    html.setAttribute('data-font',  font === 'system' ? '' : font);
    html.setAttribute('data-size',  size);

    // Set font-size directly on <html> so rem + inherit cascade everywhere
    const sizeMap = { small: '12px', medium: '14px', large: '16px' };
    html.style.fontSize = sizeMap[size] || '14px';

    // Sidebar background
    const sidebar = document.getElementById('sidebar');
    if (sidebar) {
        sidebar.style.background = mode === 'dark'
            ? 'linear-gradient(180deg, #0d1a2a 0%, #091422 100%)'
            : 'linear-gradient(180deg, #1e3a5f 0%, #162d4a 100%)';
    }

    // Update active states on theme buttons
    document.querySelectorAll('.theme-mode-btn').forEach(b => b.classList.remove('active'));
    document.getElementById(mode === 'dark' ? 'modeDark' : 'modeLight')?.classList.add('active');
    document.querySelectorAll('.font-btn').forEach(b => b.classList.toggle('active', b.dataset.font === font));
    document.querySelectorAll('.size-btn').forEach(b => b.classList.toggle('active', b.dataset.size === size));

    if (save) localStorage.setItem(THEME_STORAGE_KEY, JSON.stringify({ mode, font, size }));
}

function setThemeMode(mode) {
    const saved = JSON.parse(localStorage.getItem(THEME_STORAGE_KEY) || '{}');
    applyTheme(mode, saved.font || 'system', saved.size || 'medium');
}
function setThemeFont(font) {
    const saved = JSON.parse(localStorage.getItem(THEME_STORAGE_KEY) || '{}');
    applyTheme(saved.mode || 'light', font, saved.size || 'medium');
}
function setThemeSize(size) {
    const saved = JSON.parse(localStorage.getItem(THEME_STORAGE_KEY) || '{}');
    applyTheme(saved.mode || 'light', saved.font || 'system', size);
}
function resetTheme() {
    localStorage.removeItem(THEME_STORAGE_KEY);
    applyTheme('light', 'system', 'medium', false);
    Swal.fire({ icon:'success', title:'Theme Reset', text:'Appearance restored to defaults.', timer:1500, showConfirmButton:false });
}

// Load theme immediately on page load
loadTheme();

// ============================================================
// SETTINGS PAGE
// ============================================================
const _sessionStart = new Date().toLocaleString('en-PH', { year:'numeric', month:'long', day:'numeric', hour:'2-digit', minute:'2-digit' });

async function loadSettingsStats() {
    try {
        const res  = await apiFetch('/super_admin/system_stats');
        const data = await res.json();
        if (!res.ok || !data.ok) return;
        const s = data.content;
        const el = id => document.getElementById(id);
        if (el('settingsStatAdmins'))   el('settingsStatAdmins').textContent   = s.total_admins;
        if (el('settingsStatTeachers')) el('settingsStatTeachers').textContent = s.total_teachers;
        if (el('settingsStatGuards'))   el('settingsStatGuards').textContent   = s.total_guards;
        if (el('settingsStatStudents')) el('settingsStatStudents').textContent = s.total_students;
        if (el('settingsSessionStart')) el('settingsSessionStart').textContent = _sessionStart;
    } catch (err) { console.error('[loadSettingsStats]', err); }
    // Also load maintenance status
    loadMaintenanceStatus();
}

async function loadMaintenanceStatus() {
    try {
        const res  = await apiFetch('/super_admin/maintenance_status');
        const data = await res.json();
        renderMaintenanceBtn(data.maintenance);
    } catch (_) {}
}

function renderMaintenanceBtn(isOn) {
    const btn = document.getElementById('maintenanceToggleBtn');
    if (!btn) return;
    if (isOn) {
        btn.textContent  = '🔴 Turn OFF Maintenance';
        btn.style.background = '#c0392b';
        btn.style.color  = '#fff';
        btn.style.border = 'none';
    } else {
        btn.textContent  = '🟢 Turn ON Maintenance';
        btn.style.background = '#fff';
        btn.style.color  = '#c0392b';
        btn.style.border = '1.5px solid #f5c6cb';
    }
}

async function toggleMaintenanceMode() {
    const btn = document.getElementById('maintenanceToggleBtn');
    const isCurrentlyOn = btn?.textContent.includes('Turn OFF');

    const confirmed = await Swal.fire({
        icon: isCurrentlyOn ? 'question' : 'warning',
        title: isCurrentlyOn ? 'Turn OFF Maintenance?' : 'Turn ON Maintenance?',
        html: isCurrentlyOn
            ? 'The system will resume normal operation and users can log in again.'
            : '<strong>All users (admin, teacher, guard, student) will be blocked</strong> from any activity until maintenance is turned off.<br><br>Only Super Admin access remains active.',
        showCancelButton: true,
        confirmButtonText: isCurrentlyOn ? 'Yes, turn it OFF' : 'Yes, enable maintenance',
        confirmButtonColor: isCurrentlyOn ? '#3d6b6b' : '#c0392b',
    });
    if (!confirmed.isConfirmed) return;

    try {
        const res  = await apiFetch('/super_admin/maintenance_toggle', { method: 'PUT' });
        const data = await res.json();
        if (!res.ok) return Swal.fire({ icon: 'error', title: 'Failed', text: data.message });
        renderMaintenanceBtn(data.maintenance);
        Swal.fire({
            icon: data.maintenance ? 'warning' : 'success',
            title: data.maintenance ? '🔴 Maintenance ON' : '🟢 Maintenance OFF',
            text: data.message,
            timer: 2500,
            showConfirmButton: false
        });
    } catch (err) {
        Swal.fire({ icon: 'error', title: 'Error', text: err.message });
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
    if (!logs.length) { tbody.innerHTML = '<tr><td colspan="8" style="text-align:center;color:#999;padding:20px">No login records yet.</td></tr>'; return; }
    tbody.innerHTML = logs.map((l, i) => {
        const rc = ROLE_COLORS[l.role] || { bg:'#f5f5f5', color:'#555' };
        const device = parseDeviceInfo(l.device_info);
        return `<tr>
            <td>${i + 1}</td>
            <td>${l.user_name || '<em style="color:#999">Unknown</em>'}</td>
            <td>${l.user_email || '-'}</td>
            <td><span style="padding:3px 10px;border-radius:12px;font-size:11px;font-weight:700;background:${rc.bg};color:${rc.color}">${(l.role||'-').replace('_',' ').toUpperCase()}</span></td>
            <td><span style="padding:3px 10px;border-radius:12px;font-size:11px;font-weight:700;background:${l.status==='SUCCESS'?'#e8f5e9':'#ffebee'};color:${l.status==='SUCCESS'?'#2e7d32':'#c62828'}">${l.status}</span></td>
            <td style="font-family:monospace;font-size:12px;">${l.ip_address || '-'}</td>
            <td style="font-size:12px;" title="${l.device_info || ''}">${device}</td>
            <td>${l.login_at}</td>
        </tr>`;
    }).join('');
}

function parseDeviceInfo(ua) {
    if (!ua) return '-';

    // If already a formatted string from getDeviceInfo() (contains ' · '), return as-is
    if (ua.includes(' · ')) return ua;

    // If it's a short non-UA string (stored device name), return as-is
    if (ua.length < 50 && !ua.includes('Mozilla') && !ua.includes('AppleWebKit')) return ua;

    let os = 'Unknown OS', browser = 'Unknown Browser', device = '';

    // ── Device model extraction ───────────────────────────────
    const androidModel = ua.match(/Android[^;]*;\s*([^)]+)\)/);
    if (androidModel) {
        let raw = androidModel[1].trim().replace(/\s*Build\/.*$/, '').trim();
        device = resolveDeviceName(raw);
    } else if (/iPhone/i.test(ua)) device = 'iPhone';
    else if (/iPad/i.test(ua))     device = 'iPad';

    // ── OS ───────────────────────────────────────────────────
    if (/Windows NT 10/i.test(ua))        os = 'Windows 10/11';
    else if (/Windows NT 6\.3/i.test(ua)) os = 'Windows 8.1';
    else if (/Windows NT 6/i.test(ua))    os = 'Windows 7/8';
    else if (/Android (\d+)/i.test(ua)) {
        const v = ua.match(/Android (\d+)/i);
        os = `Android ${v ? v[1] : ''}`.trim();
    }
    else if (/iPhone|iPad/i.test(ua)) {
        const v = ua.match(/OS ([\d_]+)/i);
        os = `iOS ${v ? v[1].replace(/_/g, '.') : ''}`.trim();
    }
    else if (/Mac OS X ([\d_]+)/i.test(ua)) {
        const v = ua.match(/Mac OS X ([\d_]+)/i);
        os = `macOS ${v ? v[1].replace(/_/g, '.') : ''}`.trim();
    }
    else if (/Linux/i.test(ua)) os = 'Linux';

    // ── Browser ──────────────────────────────────────────────
    if (/Edg\//i.test(ua))               browser = 'Edge';
    else if (/OPR\//i.test(ua))          browser = 'Opera';
    else if (/SamsungBrowser/i.test(ua)) browser = 'Samsung Browser';
    else if (/MIUI.*Browser/i.test(ua))  browser = 'MIUI Browser';
    else if (/Chrome\//i.test(ua))       browser = 'Chrome';
    else if (/Firefox\//i.test(ua))      browser = 'Firefox';
    else if (/Safari\//i.test(ua))       browser = 'Safari';

    return device ? `${browser} · ${os} · ${device}` : `${browser} · ${os}`;
}

function resolveDeviceName(raw) {
    // If already a readable name (has spaces, starts with brand name), return as-is
    if (/^(Redmi|POCO|Samsung Galaxy|Realme|OPPO|vivo|Huawei|Honor|OnePlus|Motorola|Nokia|ASUS|Lenovo|Pixel)/i.test(raw)) {
        return raw;
    }

    // Model code lookup map — covers most common Philippine market devices
    const MODELS = {
        // Samsung Galaxy S series
        'SM-S918B':'Galaxy S23 Ultra','SM-S916B':'Galaxy S23+','SM-S911B':'Galaxy S23',
        'SM-S928B':'Galaxy S24 Ultra','SM-S926B':'Galaxy S24+','SM-S921B':'Galaxy S24',
        'SM-S908B':'Galaxy S22 Ultra','SM-S906B':'Galaxy S22+','SM-S901B':'Galaxy S22',
        'SM-G991B':'Galaxy S21','SM-G996B':'Galaxy S21+','SM-G998B':'Galaxy S21 Ultra',
        'SM-G981B':'Galaxy S20','SM-G986B':'Galaxy S20+','SM-G988B':'Galaxy S20 Ultra',
        // Samsung Galaxy A series
        'SM-A546B':'Galaxy A54','SM-A536B':'Galaxy A53','SM-A525F':'Galaxy A52',
        'SM-A736B':'Galaxy A73','SM-A726B':'Galaxy A72','SM-A725F':'Galaxy A72',
        'SM-A346B':'Galaxy A34','SM-A336B':'Galaxy A33','SM-A325F':'Galaxy A32',
        'SM-A156B':'Galaxy A15','SM-A146B':'Galaxy A14','SM-A135F':'Galaxy A13',
        'SM-A055F':'Galaxy A05s','SM-A045F':'Galaxy A04s','SM-A035F':'Galaxy A03s',
        'SM-A236B':'Galaxy A23','SM-A225F':'Galaxy A22','SM-A215F':'Galaxy A21s',
        'SM-A715F':'Galaxy A71','SM-A515F':'Galaxy A51','SM-A315F':'Galaxy A31',
        // Samsung Galaxy M series
        'SM-M546B':'Galaxy M54','SM-M336B':'Galaxy M33','SM-M325F':'Galaxy M32',
        'SM-M135F':'Galaxy M13','SM-M127F':'Galaxy M12',
        // Samsung Galaxy F series
        'SM-F946B':'Galaxy Z Fold5','SM-F936B':'Galaxy Z Fold4',
        'SM-F731B':'Galaxy Z Flip5','SM-F721B':'Galaxy Z Flip4',
        // Xiaomi / Redmi / POCO
        '2201116TG':'Xiaomi 12','2203121C':'Xiaomi 12 Pro',
        '22101316UCP':'Redmi Note 12','22111317I':'Redmi Note 12 Pro',
        '21091116AI':'Redmi Note 10 Pro','M2101K9AG':'Redmi Note 10',
        '220333QNY':'Redmi Note 11','2201117TY':'Redmi Note 11 Pro',
        '23076RN4BC':'Redmi Note 13','23090RA98G':'Redmi Note 13 Pro',
        '2201116PG':'Redmi 10C','220333QBI':'Redmi 10','23028RNCAG':'Redmi 12',
        'M2012K11AG':'Redmi 9T','M2004J19G':'Redmi 9','M2103K19G':'Redmi 9C',
        '22041219PG':'POCO M4 Pro','22041216G':'POCO M4','21061110AG':'POCO M3 Pro',
        'M2010J19SG':'POCO M3','22111317PG':'POCO X5 Pro','22101320G':'POCO X5',
        '21061119AG':'POCO X3 GT','MZB08JEIN':'POCO X3 Pro',
        // Realme
        'RMX3630':'Realme C55','RMX3710':'Realme C53','RMX3511':'Realme C35',
        'RMX3231':'Realme C25','RMX3201':'Realme C21','RMX3151':'Realme C15',
        'RMX3085':'Realme 8i','RMX3081':'Realme 8','RMX2001':'Realme 6',
        'RMX3521':'Realme 9i','RMX3560':'Realme 9 Pro','RMX3471':'Realme 9',
        'RMX3760':'Realme 10 Pro','RMX3686':'Realme 10','RMX3780':'Realme 11 Pro',
        'RMX3740':'Realme 11','RMX2061':'Realme 7','RMX2155':'Realme 7i',
        'RMX3430':'Realme GT Neo 2','RMX3370':'Realme GT2',
        // OPPO
        'CPH2387':'OPPO A77','CPH2477':'OPPO A78','CPH2579':'OPPO A98',
        'CPH2339':'OPPO A76','CPH2211':'OPPO A74','CPH2239':'OPPO A55',
        'CPH2325':'OPPO A56','CPH2519':'OPPO A57','CPH2471':'OPPO A57s',
        'CPH2269':'OPPO A54','CPH2219':'OPPO A53','CPH2185':'OPPO A15s',
        'CPH2127':'OPPO A15','CPH2083':'OPPO A12','CPH2375':'Reno8 T',
        'CPH2505':'Reno8 Pro','CPH2399':'Reno8','CPH2251':'Reno6',
        'CPH2351':'Reno7','CPH2461':'Reno8 Z',
        // vivo
        'V2209':'vivo Y22','V2207':'vivo Y16','V2124':'vivo Y15s',
        'V2105':'vivo Y21','V2036':'vivo Y20','V2034':'vivo Y12s',
        'V2031':'vivo Y12G','V2130':'vivo Y33s','V2145':'vivo Y31',
        'V2135':'vivo Y30','V2205':'vivo V25','V2147':'vivo V23e',
        'V2109':'vivo V23','V2025':'vivo V20','V2139':'vivo T1 5G',
        'V2225':'vivo Y35','V2249':'vivo Y36','V2307':'vivo Y27',
        // Huawei / Honor
        'VOG-L29':'Huawei P30 Pro','ELE-L29':'Huawei P30',
        'CLT-L29':'Huawei P20 Pro','ANE-LX1':'Huawei P20 Lite',
        'JSN-L22':'Huawei Y9 2019','STK-LX1':'Huawei Y9s',
        'DUA-LX3':'Huawei Y6 Pro','POT-LX1':'Huawei Y9 Prime',
        // OnePlus
        'CPH2449':'OnePlus Nord CE 3','BE2029':'OnePlus 9','LE2121':'OnePlus 9 Pro',
        'IV2201':'OnePlus 10T','CPH2423':'OnePlus 11',
        // Motorola
        'XT2341-3':'Moto G84','XT2343-4':'Moto G54','XT2333-3':'Moto G73',
        'XT2313-2':'Moto G53','XT2175-2':'Moto G32','XT2137-1':'Moto G31',
        'XT2139-1':'Moto G71','XT2083-7':'Moto E7','XT2163-4':'Moto G22',
        // Google Pixel
        'Pixel 8 Pro':'Pixel 8 Pro','Pixel 8':'Pixel 8',
        'Pixel 7 Pro':'Pixel 7 Pro','Pixel 7':'Pixel 7',
        'Pixel 6a':'Pixel 6a','Pixel 6':'Pixel 6',
        // ASUS
        'ASUS_AI2203':'ASUS Zenfone 9','ASUS_AI2302':'ASUS Zenfone 10',
        'ASUS_X01BD':'ASUS Zenfone Max Pro M1',
    };

    const found = MODELS[raw];
    if (found) return found;

    // Prefix-based brand detection for unknown model codes
    if (/^SM-/i.test(raw))   return `Samsung ${raw}`;
    if (/^CPH/i.test(raw))   return `OPPO ${raw}`;
    if (/^RMX/i.test(raw))   return `Realme ${raw}`;
    if (/^VOG|^ELE|^CLT|^ANE|^JSN|^STK/i.test(raw)) return `Huawei ${raw}`;
    if (/^XT\d/i.test(raw))  return `Motorola ${raw}`;
    if (/^V\d{4}/i.test(raw)) return `vivo ${raw}`;

    // Return raw if nothing matched — still better than nothing
    return raw;
}

function refreshLoginLogs() {
    renderLoginLogs();
    Swal.fire({ toast:true, position:'top-end', icon:'success', title:'Login logs refreshed', showConfirmButton:false, timer:1500 });
}

// ============================================================
// ACTIVITY LOGS — comprehensive action labels
// ============================================================
const ACTION_LABELS = {
    // ── Student actions ──────────────────────────────────────
    CLASS_ATTENDANCE_IN:    { label:'Class Scan In',        color:'#2e7d32', bg:'#e8f5e9' },
    UPDATE_PROFILE:         { label:'Update Profile',       color:'#6a1b9a', bg:'#f3e5f5' },
    CHANGE_PASSWORD:        { label:'Change Password',      color:'#37474f', bg:'#eceff1' },
    REGENERATE_BARCODE:     { label:'Regen Barcode',        color:'#4a148c', bg:'#ede7f6' },
    // ── Teacher actions ──────────────────────────────────────
    MANUAL_ATTENDANCE:      { label:'Manual Attendance',    color:'#1565c0', bg:'#e3f2fd' },
    ADD_STUDENT_TO_CLASS:   { label:'Add to Class',         color:'#1b5e20', bg:'#f1f8e9' },
    EDIT_STUDENT_RECORD:    { label:'Edit Student Record',  color:'#e65100', bg:'#fff3e0' },
    DELETE_STUDENT_RECORD:  { label:'Remove from Class',    color:'#c62828', bg:'#ffebee' },
    SET_LOCATION:           { label:'Set Location',         color:'#00695c', bg:'#e0f2f1' },
    SET_SUBJECT_YEAR_LEVEL: { label:'Set Subject/Year',     color:'#1565c0', bg:'#e3f2fd' },
    CHANGE_NAME:            { label:'Change Name',          color:'#37474f', bg:'#eceff1' },
    ADD_SUBJECT:            { label:'Add Subject',          color:'#1b5e20', bg:'#f1f8e9' },
    DELETE_SUBJECT:         { label:'Delete Subject',       color:'#c62828', bg:'#ffebee' },
    // ── Guard actions ────────────────────────────────────────
    EVENT_TIME_IN:          { label:'Event TIME IN',        color:'#00695c', bg:'#e0f2f1' },
    EVENT_TIME_OUT:         { label:'Event TIME OUT',       color:'#e65100', bg:'#fff3e0' },
    // ── Admin actions ────────────────────────────────────────
    SET_EVENT:              { label:'Set Event',            color:'#4527a0', bg:'#ede7f6' },
    ADD_PROGRAM:            { label:'Add Program',          color:'#1b5e20', bg:'#f1f8e9' },
    DELETE_PROGRAM:         { label:'Delete Program',       color:'#c62828', bg:'#ffebee' },
    ADD_YEAR_LEVEL:         { label:'Add Year Level',       color:'#1b5e20', bg:'#f1f8e9' },
    DELETE_YEAR_LEVEL:      { label:'Delete Year Level',    color:'#c62828', bg:'#ffebee' },
    EDIT_STUDENT:           { label:'Edit Student',         color:'#e65100', bg:'#fff3e0' },
    DELETE_STUDENT:         { label:'Delete Student',       color:'#c62828', bg:'#ffebee' },
    CREATE_TEACHER:         { label:'Create Teacher',       color:'#1565c0', bg:'#e3f2fd' },
    EDIT_TEACHER:           { label:'Edit Teacher',         color:'#e65100', bg:'#fff3e0' },
    DELETE_TEACHER:         { label:'Delete Teacher',       color:'#c62828', bg:'#ffebee' },
    CREATE_GUARD:           { label:'Create Guard',         color:'#1565c0', bg:'#e3f2fd' },
    EDIT_GUARD:             { label:'Edit Guard',           color:'#e65100', bg:'#fff3e0' },
    DELETE_GUARD:           { label:'Delete Guard',         color:'#c62828', bg:'#ffebee' },
    // ── Super Admin actions ───────────────────────────────────
    CREATE_ADMIN:           { label:'Create Admin',         color:'#1565c0', bg:'#e3f2fd' },
    EDIT_ADMIN:             { label:'Edit Admin',           color:'#e65100', bg:'#fff3e0' },
    DELETE_ADMIN:           { label:'Delete Admin',         color:'#c62828', bg:'#ffebee' },
    RESET_ADMIN_PASSWORD:   { label:'Reset Admin Password', color:'#b71c1c', bg:'#ffcdd2' },
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
    if (!logs.length) { tbody.innerHTML = '<tr><td colspan="10" style="text-align:center;color:#999;padding:20px">No activity logs yet.</td></tr>'; return; }
    tbody.innerHTML = logs.map((l, i) => {
        const meta = ACTION_LABELS[l.action] || { label: l.action.replace(/_/g,' '), color:'#555', bg:'#f5f5f5' };
        const rc   = ROLE_COLORS[l.actor_role] || { bg:'#f5f5f5', color:'#555' };
        const device = parseDeviceInfo(l.device_info);
        return `<tr>
            <td>${i + 1}</td>
            <td>${l.actor_name || '<em style="color:#999">System</em>'}</td>
            <td><span style="padding:3px 10px;border-radius:12px;font-size:11px;font-weight:700;background:${rc.bg};color:${rc.color}">${(l.actor_role||'-').replace('_',' ').toUpperCase()}</span></td>
            <td><span style="padding:3px 10px;border-radius:12px;font-size:11px;font-weight:700;background:${meta.bg};color:${meta.color}">${meta.label}</span></td>
            <td>${l.target_type || '-'}</td>
            <td>${l.target_name || l.target_id || '-'}</td>
            <td style="max-width:180px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap" title="${(l.details||'').replace(/"/g,'&quot;')}">${l.details || '-'}</td>
            <td style="font-family:monospace;font-size:12px;">${l.ip_address || '-'}</td>
            <td style="font-size:12px;" title="${l.device_info || ''}">${device}</td>
            <td>${l.performed_at}</td>
        </tr>`;
    }).join('');
}

function refreshActivityLogs() {
    renderActivityLogs();
    Swal.fire({ toast:true, position:'top-end', icon:'success', title:'Activity logs refreshed', showConfirmButton:false, timer:1500 });
}
// ============================================================
// CLASS MANAGEMENT — Super Admin Teacher View
// ============================================================
let _selectedTeacherId   = null;
let _selectedTeacherName = '';
let _classSubjects       = [];
let _classYearLevels     = [];

async function loadClassTeacherPicker() {
    try {
        const res  = await apiFetch('/super_admin/class/get_teachers');
        const data = await res.json();
        if (!res.ok) return;
        const picker = document.getElementById('classTeacherPicker');
        if (!picker) return;
        picker.innerHTML = '<option value="">— Pick a teacher —</option>' +
            data.content.map(t => `<option value="${t.teacher_id}">${t.teacher_name} — ${t.teacher_program || ''}</option>`).join('');
    } catch (err) {
        console.error('[ClassPicker]', err);
    }
}

async function onClassTeacherChange() {
    const picker = document.getElementById('classTeacherPicker');
    const teacherId = picker.value;
    if (!teacherId) {
        document.getElementById('classManagementTabs').style.display = 'none';
        document.getElementById('classTeacherBadge').style.display = 'none';
        _selectedTeacherId = null;
        return;
    }
    const option = picker.options[picker.selectedIndex];
    _selectedTeacherId   = teacherId;
    _selectedTeacherName = option.text;

    // Reset map so it re-initializes for the newly selected teacher
    if (_classMap) { _classMap.remove(); _classMap = null; _classMarker = null; _classCircle = null; }
    _classManualList = [];
    _classRosterSelectedStudent = null;

    const badge = document.getElementById('classTeacherBadge');
    badge.textContent = _selectedTeacherName;
    badge.style.display = '';

    document.getElementById('classManagementTabs').style.display = 'block';

    // Load data for the active tab
    loadActiveClassTab();
    loadClassSubjectSetup();
}

function switchClassTab(tab) {
    document.querySelectorAll('.class-tab').forEach((btn, i) => {
        const tabs = ['attendanceNow','attendanceHistory','classRoster','manualEntry','subjectSetup','locationSetup'];
        btn.classList.toggle('active', tabs[i] === tab);
    });
    document.querySelectorAll('.class-tab-panel').forEach(p => p.classList.remove('active'));
    document.getElementById(`tab-${tab}`)?.classList.add('active');

    // Load data for the selected tab
    if (!_selectedTeacherId) return;
    if (tab === 'attendanceNow')     loadClassAttendanceNow();
    if (tab === 'attendanceHistory') loadClassAttendanceHistory();
    if (tab === 'classRoster')       loadClassRoster();
    if (tab === 'manualEntry')       loadClassManualEntryList();
    if (tab === 'subjectSetup')      loadClassSubjectSetup();
    if (tab === 'locationSetup')     onClassTabLocationVisible();
}

function loadActiveClassTab() {
    const activeTab = document.querySelector('.class-tab.active');
    const tabs = ['attendanceNow','attendanceHistory','classRoster','manualEntry','subjectSetup','locationSetup'];
    const active = tabs[Array.from(document.querySelectorAll('.class-tab')).indexOf(activeTab)] || 'attendanceNow';
    switchClassTab(active);
}

// --- Attendance Now ---
async function loadClassAttendanceNow() {
    if (!_selectedTeacherId) return;
    try {
        const res  = await apiFetch(`/super_admin/class/attendance_now/${_selectedTeacherId}`);
        const data = await res.json();
        const tbody = document.getElementById('classAttendanceNowBody');
        if (!res.ok || !data.content?.length) {
            tbody.innerHTML = '<tr><td colspan="8" style="text-align:center;color:#999;">No attendance records found</td></tr>';
            return;
        }
        tbody.innerHTML = data.content.map(d => `
            <tr>
                <td>${d.student_id_number}</td>
                <td>${d.student_firstname}</td>
                <td>${d.student_middlename || ''}</td>
                <td>${d.student_lastname}</td>
                <td>${d.subject || ''}</td>
                <td>${d.year_level}</td>
                <td>${d.student_program}</td>
                <td>${d.attendance_time || ''}</td>
            </tr>`).join('');
    } catch (err) { console.error(err); }
}

// --- Attendance History ---
async function loadClassAttendanceHistory() {
    if (!_selectedTeacherId) return;
    try {
        const res  = await apiFetch(`/super_admin/class/attendance_history/${_selectedTeacherId}`);
        const data = await res.json();
        const tbody = document.getElementById('classAttendanceHistoryBody');
        if (!res.ok || !data.content?.length) {
            tbody.innerHTML = '<tr><td colspan="9" style="text-align:center;color:#999;">No history found</td></tr>';
            return;
        }
        tbody.innerHTML = data.content.map(d => `
            <tr>
                <td>${d.student_id_number}</td>
                <td>${d.student_firstname}</td>
                <td>${d.student_middlename || ''}</td>
                <td>${d.student_lastname}</td>
                <td>${d.subject || ''}</td>
                <td>${d.year_level}</td>
                <td>${d.student_program}</td>
                <td>${d.attendance_time || ''}</td>
                <td>${d.attendance_date ? d.attendance_date.split('T')[0] : ''}</td>
            </tr>`).join('');
    } catch (err) { console.error(err); }
}

// --- Class Roster ---
async function loadClassRoster() {
    if (!_selectedTeacherId) return;
    try {
        const res  = await apiFetch(`/super_admin/class/roster/${_selectedTeacherId}`);
        const data = await res.json();
        const tbody = document.getElementById('classRosterBody');
        if (!res.ok || !data.content?.length) {
            tbody.innerHTML = '<tr><td colspan="7" style="text-align:center;color:#999;">No students enrolled</td></tr>';
            return;
        }
        const esc = v => (v ?? '').toString().replace(/'/g, "\\'");
        tbody.innerHTML = data.content.map(d => `
            <tr>
                <td>${d.student_id_number}</td>
                <td>${d.student_firstname}</td>
                <td>${d.student_middlename || '-'}</td>
                <td>${d.student_lastname}</td>
                <td>${d.student_year_level}</td>
                <td>${d.student_program}</td>
                <td>
                    <div style="display:flex; gap:4px;">
                        <button class="action-btn edit-btn-account-management" onclick="openClassEditStudentModal(
                            '${esc(d.student_id)}',
                            '${esc(d.student_id_number)}',
                            '${esc(d.student_firstname)}',
                            '${esc(d.student_middlename || '')}',
                            '${esc(d.student_lastname)}',
                            '${esc(d.student_program)}',
                            '${esc(d.student_year_level)}'
                        )">Edit</button>
                        <button class="action-btn delete-btn-account-management" onclick="deleteClassRosterStudent('${esc(d.student_id)}', '${esc(d.student_firstname)} ${esc(d.student_lastname)}')">Delete</button>
                    </div>
                </td>
            </tr>`).join('');
    } catch (err) { console.error(err); }
}

// ---- Add Student to Roster ----
let _classRosterSelectedStudent = null;
let _classRosterSearchDebounce  = null;

function openClassAddStudentModal() {
    _classRosterSelectedStudent = null;
    document.getElementById('classAddStudentModal').style.display = 'flex';
    document.getElementById('classRosterSearchInput').value = '';
    document.getElementById('classRosterSearchResults').style.display = 'none';
    document.getElementById('classRosterSelectedPreview').style.display = 'none';
    const btn = document.getElementById('classRosterConfirmBtn');
    btn.disabled = true; btn.style.opacity = '0.5'; btn.style.cursor = 'not-allowed';
}

function closeClassAddStudentModal() {
    document.getElementById('classAddStudentModal').style.display = 'none';
    _classRosterSelectedStudent = null;
}

function searchClassRosterStudents() {
    const q = document.getElementById('classRosterSearchInput').value.trim();
    const results = document.getElementById('classRosterSearchResults');
    clearTimeout(_classRosterSearchDebounce);
    results.innerHTML = ''; results.style.display = 'none';
    if (q.length < 2) return;

    _classRosterSearchDebounce = setTimeout(async () => {
        try {
            const res  = await apiFetch(`/super_admin/class/search_students?q=${encodeURIComponent(q)}`);
            const data = await res.json();
            if (!res.ok || !data.content?.length) {
                results.innerHTML = '<div style="padding:10px 14px; color:#999; font-size:0.83rem;">No students found.</div>';
                results.style.display = 'block'; return;
            }
            results.innerHTML = data.content.map((s, i) => `
                <div data-index="${i}" style="padding:10px 14px; cursor:pointer; border-bottom:1px solid #f0f0f0; font-size:0.83rem;">
                    <div style="font-weight:600;">${s.student_firstname} ${s.student_middlename || ''} ${s.student_lastname}</div>
                    <div style="color:#666; font-size:0.78rem;">${s.student_id_number} · ${s.student_program} · ${s.student_year_level}</div>
                </div>`).join('');
            results.style.display = 'block';

            // Store results for click handler
            results._students = data.content;
            results.querySelectorAll('[data-index]').forEach(el => {
                el.addEventListener('mouseenter', () => el.style.background = '#f0f7f5');
                el.addEventListener('mouseleave', () => el.style.background = '');
                el.addEventListener('click', () => {
                    const s = results._students[parseInt(el.dataset.index)];
                    _classRosterSelectedStudent = s;
                    document.getElementById('classRosterSearchInput').value = `${s.student_firstname} ${s.student_lastname}`;
                    results.style.display = 'none';
                    document.getElementById('classRosterSelectedName').textContent = `${s.student_firstname} ${s.student_middlename || ''} ${s.student_lastname}`;
                    document.getElementById('classRosterSelectedInfo').textContent = `${s.student_id_number} · ${s.student_program} · ${s.student_year_level}`;
                    document.getElementById('classRosterSelectedPreview').style.display = 'block';
                    const btn = document.getElementById('classRosterConfirmBtn');
                    btn.disabled = false; btn.style.opacity = '1'; btn.style.cursor = 'pointer';
                });
            });
        } catch (err) { console.error(err); }
    }, 350);
}

async function confirmAddStudentToRoster() {
    if (!_classRosterSelectedStudent || !_selectedTeacherId) return;
    const s = _classRosterSelectedStudent;
    Swal.fire({ title:'Adding student...', allowOutsideClick:false, didOpen:() => Swal.showLoading() });
    try {
        const res  = await apiFetch(`/super_admin/class/add_student/${_selectedTeacherId}`, {
            method: 'POST',
            body: JSON.stringify({
                student_firstname:       s.student_firstname,
                student_middlename:      s.student_middlename || '',
                student_lastname:        s.student_lastname,
                student_email:           s.student_email,
                student_id_number:       s.student_id_number,
                student_program:         s.student_program,
                student_year_level:      s.student_year_level,
                student_guardian_number: s.student_guardian_number || ''
            })
        });
        const data = await res.json();
        if (!res.ok) return Swal.fire({ icon:'error', title:'Failed', text: data.message });
        Swal.fire({ icon:'success', title:'Student Added!', timer:1600, showConfirmButton:false });
        closeClassAddStudentModal();
        loadClassRoster();
        _classManualList = []; // reset manual entry cache too
    } catch (err) { Swal.fire({ icon:'error', title:'Error', text: err.message }); }
}

// ---- Edit Student in Roster ----
function openClassEditStudentModal(id, id_number, firstname, middlename, lastname, program, year_level) {
    document.getElementById('classEditStudentId').value   = id;
    document.getElementById('classEditIdNumber').value    = id_number;
    document.getElementById('classEditFirstname').value   = firstname;
    document.getElementById('classEditMiddlename').value  = middlename;
    document.getElementById('classEditLastname').value    = lastname;

    // Populate program dropdown
    const progSel = document.getElementById('classEditProgram');
    fetch(`${URL_BASED}/programs/program_get_data`).then(r => r.json()).then(d => {
        if (d.content) {
            progSel.innerHTML = d.content.map(p => `<option value="${p.program_name}"${p.program_name===program?' selected':''}>${p.program_name}</option>`).join('');
        }
    });

    // Populate year level dropdown
    const yrSel = document.getElementById('classEditYearLevel');
    apiFetch('/super_admin/get_year_levels').then(r => r.json()).then(d => {
        if (d.content) {
            yrSel.innerHTML = d.content.map(y => `<option value="${y.year_level_name}"${y.year_level_name===year_level?' selected':''}>${y.year_level_name}</option>`).join('');
        }
    });

    document.getElementById('classEditStudentModal').style.display = 'flex';
}

function closeClassEditStudentModal() {
    document.getElementById('classEditStudentModal').style.display = 'none';
}

async function saveClassEditStudent() {
    const id         = document.getElementById('classEditStudentId').value;
    const id_number  = document.getElementById('classEditIdNumber').value.trim();
    const firstname  = document.getElementById('classEditFirstname').value.trim();
    const middlename = document.getElementById('classEditMiddlename').value.trim();
    const lastname   = document.getElementById('classEditLastname').value.trim();
    const program    = document.getElementById('classEditProgram').value;
    const year_level = document.getElementById('classEditYearLevel').value;

    if (!firstname || !lastname || !id_number || !program || !year_level) {
        return Swal.fire({ icon:'warning', title:'Incomplete', text:'Please fill in all required fields.' });
    }

    Swal.fire({ title:'Saving...', allowOutsideClick:false, didOpen:() => Swal.showLoading() });
    try {
        const res  = await apiFetch(`/super_admin/class/edit_student/${id}`, {
            method: 'PUT',
            body: JSON.stringify({ id_number, firstname, middlename, lastname, program, year_level })
        });
        const data = await res.json();
        if (!res.ok && data.ok === false) return Swal.fire({ icon:'error', title:'Failed', text: data.message });
        Swal.fire({ icon:'success', title:'Updated!', timer:1600, showConfirmButton:false });
        closeClassEditStudentModal();
        loadClassRoster();
        _classManualList = [];
    } catch (err) { Swal.fire({ icon:'error', title:'Error', text: err.message }); }
}

// ---- Delete Student from Roster ----
async function deleteClassRosterStudent(studentId, studentName) {
    const confirm = await Swal.fire({
        icon:'warning', title:'Remove from Class?',
        text:`Remove "${studentName}" from this teacher's class roster? This cannot be undone.`,
        showCancelButton:true, confirmButtonText:'Yes, remove', confirmButtonColor:'#d33'
    });
    if (!confirm.isConfirmed) return;

    Swal.fire({ title:'Removing...', allowOutsideClick:false, didOpen:() => Swal.showLoading() });
    try {
        const res  = await apiFetch(`/super_admin/class/delete_student/${studentId}`, { method: 'DELETE' });
        const data = await res.json();
        if (!res.ok) return Swal.fire({ icon:'error', title:'Failed', text: data.message });
        Swal.fire({ icon:'success', title:'Removed!', timer:1600, showConfirmButton:false });
        loadClassRoster();
        _classManualList = [];
    } catch (err) { Swal.fire({ icon:'error', title:'Error', text: err.message }); }
}

// --- Subject Setup ---
async function loadClassSubjectSetup() {
    if (!_selectedTeacherId) return;
    try {
        // Load active subject and year level
        const res  = await apiFetch(`/super_admin/class/active_subject/${_selectedTeacherId}`);
        const data = await res.json();
        const activeSubject   = data.ok ? data.content?.subject_name_set : '';
        const activeYearLevel = data.ok ? data.content?.year_level_set   : '';

        // Update active display badge
        const el = document.getElementById('classActiveSubjectDisplay');
        if (el) {
            if (activeSubject && activeYearLevel) {
                el.textContent = `✓ ${activeSubject} — ${activeYearLevel}`;
                el.style.background = '#c8ece5'; el.style.color = '#1a5c4f';
            } else {
                el.textContent = '⚠ Not set';
                el.style.background = '#fdecea'; el.style.color = '#b94a3a';
            }
        }

        // Populate subject dropdown from THIS teacher's subject list
        const subSel = document.getElementById('classSubjectFilter');
        if (subSel) {
            const sRes  = await apiFetch(`/super_admin/class/get_subjects/${_selectedTeacherId}`);
            const sData = await sRes.json();
            if (sRes.ok && sData.content) {
                subSel.innerHTML = '<option value="">Select Subject</option>' +
                    sData.content.map(s => `<option value="${s.subject_name}">${s.subject_name}</option>`).join('');
                if (activeSubject) subSel.value = activeSubject;
            }
        }

        // Populate year level dropdown (refreshed per teacher)
        const yrSel = document.getElementById('classYearFilter');
        if (yrSel) {
            const yRes  = await apiFetch('/super_admin/get_year_levels');
            const yData = await yRes.json();
            if (yData.content) {
                yrSel.innerHTML = '<option value="">Select Year Level</option>' +
                    yData.content.map(y => `<option value="${y.year_level_name}">${y.year_level_name}</option>`).join('');
                if (activeYearLevel) yrSel.value = activeYearLevel;
            }
        }
    } catch (err) { console.error(err); }
}

async function setClassSubject() {
    if (!_selectedTeacherId) return;
    const subject   = document.getElementById('classSubjectFilter').value;
    const yearLevel = document.getElementById('classYearFilter').value;
    if (!subject || !yearLevel) {
        return Swal.fire({ icon:'warning', title:'Incomplete', text:'Please select both a subject and a year level.' });
    }
    try {
        const res  = await apiFetch(`/super_admin/class/set_subject/${_selectedTeacherId}`, {
            method: 'PUT',
            body: JSON.stringify({ subject, yearLevel })
        });
        const data = await res.json();
        if (!res.ok) return Swal.fire({ icon:'error', title:'Error', text: data.message });
        const el = document.getElementById('classActiveSubjectDisplay');
        if (el) { el.textContent = `✓ ${subject} — ${yearLevel}`; el.style.background='#c8ece5'; el.style.color='#1a5c4f'; }
        Swal.fire({ icon:'success', title:'Updated!', text:`Subject set to ${subject} — ${yearLevel}`, timer:1800, showConfirmButton:false });
    } catch (err) { Swal.fire({ icon:'error', title:'Error', text: err.message }); }
}

// --- Location Setup ---
// --- Location Setup (Leaflet Map) ---
let _classMap = null, _classMarker = null, _classCircle = null;
let _classLocationSearchDebounce = null;

function initClassMap(lat, lng) {
    if (_classMap) { _classMap.remove(); _classMap = null; _classMarker = null; _classCircle = null; }

    delete L.Icon.Default.prototype._getIconUrl;
    L.Icon.Default.mergeOptions({
        iconUrl:       'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
        shadowUrl:     'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    });

    const radius = parseInt(document.getElementById('classRadiusSlider')?.value || 50);

    _classMap = L.map('classMap', { zoomControl: true }).setView([lat, lng], 18);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap', maxZoom: 19
    }).addTo(_classMap);

    _classMarker = L.marker([lat, lng], { draggable: true }).addTo(_classMap);
    _classCircle = L.circle([lat, lng], {
        color: '#3d6b6b', fillColor: '#3d6b6b', fillOpacity: 0.2, radius
    }).addTo(_classMap);

    _classMarker.on('drag', () => {
        const pos = _classMarker.getLatLng();
        _classCircle.setLatLng(pos);
    });

    // Radius slider
    const slider = document.getElementById('classRadiusSlider');
    const display = document.getElementById('classRadiusValue');
    if (slider) {
        slider.oninput = function () {
            if (display) display.textContent = this.value;
            if (_classCircle) _classCircle.setRadius(parseInt(this.value));
        };
    }

    // Location search
    const searchInput   = document.getElementById('classLocationSearchInput');
    const searchResults = document.getElementById('classLocationSearchResults');
    if (searchInput) {
        searchInput.oninput = function () {
            const query = this.value.trim();
            clearTimeout(_classLocationSearchDebounce);
            searchResults.innerHTML = '';
            searchResults.style.display = 'none';
            if (query.length < 3) return;
            _classLocationSearchDebounce = setTimeout(async () => {
                try {
                    const res  = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5`, {
                        headers: { 'Accept-Language': 'en' }
                    });
                    const data = await res.json();
                    if (!data.length) {
                        searchResults.innerHTML = '<li style="padding:8px 12px;color:#999;font-size:0.85rem;">No results found</li>';
                    } else {
                        searchResults.innerHTML = data.map(place => `
                            <li data-lat="${place.lat}" data-lng="${place.lon}" style="padding:8px 12px; cursor:pointer; font-size:0.83rem; border-bottom:1px solid #f0f0f0; display:flex; align-items:center; gap:6px;">
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="#3d6b6b"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>
                                <span>${place.display_name}</span>
                            </li>`).join('');
                        searchResults.querySelectorAll('li[data-lat]').forEach(item => {
                            item.addEventListener('click', function () {
                                const lat = parseFloat(this.dataset.lat);
                                const lng = parseFloat(this.dataset.lng);
                                if (_classMap && _classMarker && _classCircle) {
                                    _classMarker.setLatLng([lat, lng]);
                                    _classCircle.setLatLng([lat, lng]);
                                    _classMap.setView([lat, lng], 18);
                                } else {
                                    initClassMap(lat, lng);
                                }
                                searchInput.value = this.querySelector('span').textContent;
                                searchResults.style.display = 'none';
                            });
                        });
                    }
                    searchResults.style.display = 'block';
                } catch (err) { console.error('Location search error:', err); }
            }, 400);
        };
    }

    setTimeout(() => _classMap.invalidateSize(), 100);
    setTimeout(() => _classMap.invalidateSize(), 300);
    setTimeout(() => _classMap.invalidateSize(), 600);
}

function loadClassCurrentLocation() {
    if (!navigator.geolocation) return Swal.fire({ icon:'error', title:'Not supported', text:'Geolocation is not available.' });
    Swal.fire({ title:'Acquiring location...', allowOutsideClick:false, didOpen:() => Swal.showLoading() });
    navigator.geolocation.getCurrentPosition(pos => {
        Swal.close();
        const { latitude: lat, longitude: lng } = pos.coords;
        setTimeout(() => {
            initClassMap(lat, lng);
            setTimeout(() => { if (_classMap) _classMap.invalidateSize(); }, 300);
        }, 150);
    }, err => {
        Swal.close();
        Swal.fire({ icon:'error', title:'Location Error', text: err.message || 'Unable to retrieve location.' });
    }, { enableHighAccuracy: true, timeout: 10000 });
}

async function setClassLocation() {
    if (!_selectedTeacherId) return;
    if (!_classMarker) return Swal.fire({ icon:'warning', title:'No Location', text:'Load your location first using "Use My Location".' });

    const radius = parseInt(document.getElementById('classRadiusSlider')?.value || 50);
    const { lat, lng } = _classMarker.getLatLng();

    const confirm = await Swal.fire({
        title: 'Set this location?',
        text: `Lat: ${lat.toFixed(6)}, Lng: ${lng.toFixed(6)} — Radius: ${radius}m`,
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Yes, set it',
        confirmButtonColor: '#3d6b6b'
    });
    if (!confirm.isConfirmed) return;

    Swal.fire({ title:'Saving location...', allowOutsideClick:false, didOpen:() => Swal.showLoading() });
    try {
        const res  = await apiFetch(`/super_admin/class/set_location/${_selectedTeacherId}`, {
            method: 'PUT',
            body: JSON.stringify({ latitude: lat, longitude: lng, radius })
        });
        const data = await res.json();
        if (!res.ok) return Swal.fire({ icon:'error', title:'Error', text: data.message });
        Swal.fire({ icon:'success', title:'Location Saved!', text:`Radius set to ${radius} meters.`, timer:2000, showConfirmButton:false });
    } catch (err) { Swal.fire({ icon:'error', title:'Error', text: err.message }); }
}

// Re-initialize map when location tab becomes visible
function onClassTabLocationVisible() {
    if (_classMap) {
        setTimeout(() => _classMap.invalidateSize(), 150);
        setTimeout(() => _classMap.invalidateSize(), 400);
    } else {
        // Auto-load location on first open so the map isn't blank
        loadClassCurrentLocation();
    }
}

// --- Manual Entry ---
let _classManualList = []; // full roster cache

async function loadClassManualEntryList() {
    if (!_selectedTeacherId) return;
    const list = document.getElementById('classManualStudentList');
    list.innerHTML = '<p style="color:#999;font-size:0.85rem;padding:8px;">Loading students...</p>';

    try {
        const res  = await apiFetch(`/super_admin/class/roster/${_selectedTeacherId}`);
        const data = await res.json();

        if (!res.ok || !data.content?.length) {
            _classManualList = [];
            list.innerHTML = '<p style="color:#999;font-size:0.85rem;padding:8px;">No students enrolled in this class.</p>';
            return;
        }

        _classManualList = data.content;

        // Populate year level filter
        const yrFilter = document.getElementById('classManualYearFilter');
        if (yrFilter) {
            const levels = [...new Set(_classManualList.map(s => s.student_year_level).filter(Boolean))].sort();
            yrFilter.innerHTML = '<option value="">All Year Levels</option>' +
                levels.map(y => `<option value="${y}">${y}</option>`).join('');
        }

        renderClassManualList(_classManualList);
    } catch (err) {
        list.innerHTML = '<p style="color:#c00;font-size:0.85rem;padding:8px;">Failed to load students.</p>';
        console.error(err);
    }
}

function renderClassManualList(students) {
    const list = document.getElementById('classManualStudentList');
    if (!students.length) {
        list.innerHTML = '<p style="color:#999;font-size:0.85rem;padding:8px;">No students match the filter.</p>';
        return;
    }
    list.innerHTML = students.map(s => {
        const esc = v => (v ?? '').toString().replace(/'/g, "\\'");
        const mid = s.student_middlename ? s.student_middlename + ' ' : '';
        return `
        <div class="manual-student-row" data-name="${(s.student_firstname + ' ' + mid + s.student_lastname).toLowerCase()}" data-id="${s.student_id_number}" data-year="${s.student_year_level}">
            <div style="display:flex; justify-content:space-between; align-items:center; padding:10px 14px; background:#f9f9f9; border:1px solid #e0e0e0; border-radius:8px;">
                <div>
                    <div style="font-weight:600; font-size:0.9rem;">${s.student_firstname} ${mid}${s.student_lastname}</div>
                    <div style="font-size:0.78rem; color:#666;">${s.student_id_number} · ${s.student_program} · ${s.student_year_level}</div>
                </div>
                <button class="set-btn" onclick="addClassManualAttendance('${esc(s.student_id)}','${esc(s.student_id_number)}','${esc(s.student_firstname)}','${esc(s.student_middlename || '')}','${esc(s.student_lastname)}','${esc(s.student_email)}','${esc(s.student_year_level)}','${esc(s.student_guardian_number || '')}','${esc(s.student_program)}')">Add</button>
            </div>
        </div>`;
    }).join('');
}

function filterClassManualList() {
    const search = (document.getElementById('classManualSearch')?.value || '').toLowerCase();
    const year   = document.getElementById('classManualYearFilter')?.value || '';
    const filtered = _classManualList.filter(s => {
        const mid = s.student_middlename ? s.student_middlename + ' ' : '';
        const fullName = (s.student_firstname + ' ' + mid + s.student_lastname).toLowerCase();
        const matchSearch = !search || fullName.includes(search) || s.student_id_number.includes(search);
        const matchYear   = !year   || s.student_year_level === year;
        return matchSearch && matchYear;
    });
    renderClassManualList(filtered);
}

async function addClassManualAttendance(student_id, student_id_number, student_firstname, student_middlename, student_lastname, student_email, student_year_level, student_guardian_number, student_program) {
    if (!_selectedTeacherId) return;
    const confirm = await Swal.fire({
        icon:'question', title:'Add Attendance?',
        html:`<strong>${student_firstname} ${student_middlename} ${student_lastname}</strong><br>${student_program} — ${student_year_level}`,
        showCancelButton:true, confirmButtonText:'Yes, add', confirmButtonColor:'#3d6b6b'
    });
    if (!confirm.isConfirmed) return;

    Swal.fire({ title:'Recording...', allowOutsideClick:false, didOpen:() => Swal.showLoading() });
    try {
        const res  = await apiFetch(`/super_admin/class/manual_attendance/${_selectedTeacherId}`, {
            method: 'POST',
            body: JSON.stringify({
                student_id, student_id_number, student_firstname, student_middlename,
                student_lastname, student_email, student_year_level,
                student_guardian_number, student_program
            })
        });
        const data = await res.json();
        if (!res.ok) return Swal.fire({ icon:'error', title:'Failed', text: data.message });
        Swal.fire({ icon:'success', title:'Attendance Added!', timer:1500, showConfirmButton:false });
    } catch (err) {
        Swal.fire({ icon:'error', title:'Error', text: err.message });
    }
}