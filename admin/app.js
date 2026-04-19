// ── Normalize PH number to +639XXXXXXXXX ────────────────────
function normalizePhilippineNumber(raw) {
    const n = (raw || '').toString().trim().replace(/[\s\-().]/g, '')
    if (n.startsWith('09')   && n.length === 11) return '+63' + n.slice(1)
    if (n.startsWith('9')    && n.length === 10) return '+63' + n
    if (n.startsWith('639')  && n.length === 12) return '+' + n
    if (n.startsWith('+639') && n.length === 13) return n
    return n  // return as-is if already valid or unrecognized
}
// ─────────────────────────────────────────────────────────────

// ── Philippine mobile number validator ──────────────────────
function isValidPHNumber(raw) {
    const cleaned = (raw || '').toString().trim().replace(/[\s\-().]/g, '')
    return (
        (cleaned.startsWith('09')  && cleaned.length === 11) ||
        (cleaned.startsWith('9')   && cleaned.length === 10) ||
        (cleaned.startsWith('639') && cleaned.length === 12) ||
        (cleaned.startsWith('+639') && cleaned.length === 13)
    )
}
// ─────────────────────────────────────────────────────────────

// ── Password Strength Checker ───────────────────────────────
function updatePasswordStrength(val, barId, labelId) {
    const bar   = document.getElementById(barId)
    const label = document.getElementById(labelId)
    if (!bar || !label) return
    const wrap = bar.closest('.pw-strength-wrap')
    if (val.length === 0) {
        bar.style.setProperty('--pw-width', '0%')
        bar.style.setProperty('--pw-color', '#e0e0e0')
        label.style.color = '#aaa'
        label.textContent = ''
        if (wrap) wrap.classList.remove('visible')
        return
    }
    if (wrap) wrap.classList.add('visible')
    let score = 0
    if (val.length >= 6)            score++
    if (val.length >= 10)           score++
    if (/[A-Z]/.test(val))         score++
    if (/[0-9]/.test(val))         score++
    if (/[^A-Za-z0-9]/.test(val)) score++
    const levels = [
        { label: 'Weak',   color: '#e53935', width: '25%'  },
        { label: 'Fair',   color: '#fb8c00', width: '50%'  },
        { label: 'Good',   color: '#fdd835', width: '75%'  },
        { label: 'Strong', color: '#43a047', width: '100%' },
    ]
    const level = score <= 1 ? levels[0] : score === 2 ? levels[1] : score === 3 ? levels[2] : levels[3]
    bar.style.setProperty('--pw-width', level.width)
    bar.style.setProperty('--pw-color', level.color)
    label.style.color = level.color
    label.textContent = 'Password strength: ' + level.label
}
// ─────────────────────────────────────────────────────────────

// ============================================================
// CONSTANTS & CONFIG
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

const URL_BASED = 'https://barcode-scanner-based-student-attendance.com/api/v1';
const TOKEN = localStorage.getItem('admin_token');

const PAGES = [
    'dashboard',
    'eventAttendance',
    'eventAttendanceHistory',
    'adminSettings',
    'studentAccountManagement',
    'teacherAccountManagement',
    'guardAccountManagement',
    'academicSetup',
    'registration'
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
    registration: 'Registration'
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
    studentGuardianNumber: document.getElementById('studentGuardianNumber'),
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
    const deviceInfo = localStorage.getItem('admin_device_info') || '';
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
        clearSessionAndRedirect(); // FIX: clear token before redirect
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

/** Populate a filter <select> with unique values from a data array, restoring any saved selection */
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
function applyEventNowFilters() {
    localStorage.setItem('ef_status',  document.getElementById('eventStatusFilter')?.value || '');
    localStorage.setItem('ef_name',    document.getElementById('eventNameFilter')?.value   || '');
    localStorage.setItem('ef_year',    document.getElementById('eventYearFilter')?.value   || '');
    localStorage.setItem('ef_program', document.getElementById('eventProgramFilter')?.value || '');
    multiFilterTableRows('attendanceBody', [
        { colIndex: 6, value: document.getElementById('eventStatusFilter')?.value  || '' },
        { colIndex: 7, value: document.getElementById('eventNameFilter')?.value    || '' },
        { colIndex: 3, value: document.getElementById('eventYearFilter')?.value    || '' },
        { colIndex: 2, value: document.getElementById('eventProgramFilter')?.value || '' },
    ]);
}

function applyEventHistoryFilters() {
    localStorage.setItem('ehf_status',  document.getElementById('eventHistoryStatusFilter')?.value  || '');
    localStorage.setItem('ehf_name',    document.getElementById('eventHistoryNameFilter')?.value    || '');
    localStorage.setItem('ehf_year',    document.getElementById('eventHistoryYearFilter')?.value    || '');
    localStorage.setItem('ehf_program', document.getElementById('eventHistoryProgramFilter')?.value || '');
    multiFilterTableRows('attendanceHistory', [
        { colIndex: 6, value: document.getElementById('eventHistoryStatusFilter')?.value  || '' },
        { colIndex: 7, value: document.getElementById('eventHistoryNameFilter')?.value    || '' },
        { colIndex: 3, value: document.getElementById('eventHistoryYearFilter')?.value    || '' },
        { colIndex: 2, value: document.getElementById('eventHistoryProgramFilter')?.value || '' },
    ]);
}

function multiFilterTableRows(tbodyId, filters) {
    document.querySelectorAll(`#${tbodyId} tr`).forEach(row => {
        const visible = filters.every(({ colIndex, value }) => {
            if (!value) return true;
            return row.cells[colIndex]?.textContent.trim().toLowerCase() === value.toLowerCase();
        });
        row.classList.toggle('filter-hidden', !visible);
    });
}

/** Generic table row filter — shows/hides <tr> based on text match */
function filterTableRows(tbodyEl, searchText) {
    const rows = tbodyEl.getElementsByTagName('tr');
    const lower = searchText.toLowerCase();
    for (const row of rows) {
        row.classList.toggle('filter-hidden', !row.textContent.toLowerCase().includes(lower));
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
// Back-button guard: if user logged out, pressing back must not restore the page
window.addEventListener('pageshow', (event) => {
    if (!localStorage.getItem('admin_token')) {
        window.location.replace('admin_login.html');
    }
});

document.addEventListener('DOMContentLoaded', () => {
    checkToken();
    navigateTo('dashboard');
    getAdminData();

    // Load badge immediately — independent of attendance data
    loadActiveEvent();

    // Render attendance first, then populate master dropdowns last so pre-values stick
    renderEventAttendanceRecord()
        .then(() => renderEventHistoryAttendanceRecord())
        .then(() => {
            renderPrograms();
            renderYearLevels();
            loadActiveEvent();
        })
        .catch(() => {
            renderPrograms();
            renderYearLevels();
        });

    fetchStudentAccounts();
    fetchTeacherAccounts();
    fetchGuardAccounts();
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

    // Mark the active sidebar nav item
    document.querySelectorAll('.menu-item').forEach(btn => {
        const onclick = btn.getAttribute('onclick') || '';
        btn.classList.toggle('active-page', onclick.includes(`'${page}'`));
    });

    // Remind admin about the active event when opening Event Attendance
    if (page === 'eventAttendance') {
        checkEventReminder();
    }

    // Refresh program dropdown when opening registration
    if (page === 'registration') {
        renderPrograms();
        renderYearLevels();
    }

    // Load settings stats when opening settings
    if (page === 'adminSettings') {
        loadSettingsStats();
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
// FIX: centralised session cleanup
function clearSessionAndRedirect() {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_device_info');
    localStorage.removeItem('admin_user');
    window.location.href = 'admin_login.html';
}

async function checkToken() {
    if (!TOKEN) {
        await Swal.fire({
            icon: 'error',
            title: 'Please login first!',
            text: 'Your session is missing or expired.',
            confirmButtonColor: '#d33',
            allowOutsideClick: false
        });
        clearSessionAndRedirect(); // FIX: clear token before redirect
        return;
    }

    try {
        const res = await apiFetch('/authentication/verify_token', { method: 'POST' });
        const data = await res.json();
        if (!res.ok) {
            await Swal.fire({
                icon: 'error',
                title: 'Session Expired',
                text: data.message || 'Please login again.',
                confirmButtonColor: '#d33',
                allowOutsideClick: false
            });
            clearSessionAndRedirect(); // FIX: clear token before redirect
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
        apiFetch('/admin/logout', { method: 'POST', body: JSON.stringify({ device_info: localStorage.getItem('admin_device_info') || '' }) }).catch(() => {});
        Swal.fire({ icon: 'success', title: 'Logged out', text: 'Redirecting to login...', timer: 1500, showConfirmButton: false })
            .then(() => {
                clearSessionAndRedirect();
            });
    });
}

// ============================================================
// ADMIN PROFILE
// ============================================================
async function getAdminData() {
    try {
        const res = await apiFetch('/admin/get_admin_data');
        const data = await res.json();
        if (data.ok) {
            const { admin_name, admin_email, admin_profile_picture } = data.content[0];
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

// Profile picture upload handler — with crop modal
document.addEventListener('DOMContentLoaded', () => {
    const picInput = document.getElementById('adminProfilePicInput');
    if (picInput) {
        if (typeof initImageCrop === 'function') {
            initImageCrop(picInput, async (blob, dataUrl) => {
                setAdminAvatar(dataUrl);
                const token = localStorage.getItem('admin_token');
                const croppedFile = new File([blob], 'profile.jpg', { type: 'image/jpeg' });
                const formData = new FormData();
                formData.append('admin_profile_picture', croppedFile);
                Swal.fire({ title: 'Uploading...', allowOutsideClick: false, didOpen: () => Swal.showLoading() });
                try {
                    const res = await fetch(`${URL_BASED}/admin/upload_profile_picture`, {
                        method: 'POST',
                        headers: { 'Authorization': 'Bearer ' + token },
                        body: formData
                    });
                    const data = await res.json();
                    Swal.close();
                    if (res.ok && data.ok) {
                        setAdminAvatar(`${URL_BASED}/uploads/profile_pictures/${data.filename}`);
                        Swal.fire({ icon: 'success', title: 'Profile picture updated!', timer: 1500, showConfirmButton: false });
                    } else {
                        Swal.fire({ icon: 'error', title: 'Upload failed', text: data.message || 'Please try again.' });
                    }
                } catch (err) {
                    Swal.close();
                    console.error('[AdminProfilePic] Fetch error:', err);
                    Swal.fire({ icon: 'error', title: 'Upload failed', text: err.message || 'Network error.' });
                }
            });
        } else {
            // Fallback — no crop, direct upload
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

            const reader = new FileReader();
            reader.onload = e => setAdminAvatar(e.target.result);
            reader.readAsDataURL(file);

            const token = localStorage.getItem('admin_token');
            const formData = new FormData();
            formData.append('admin_profile_picture', file);

            Swal.fire({ title: 'Uploading...', allowOutsideClick: false, didOpen: () => Swal.showLoading() });

            try {
                const res = await fetch(`${URL_BASED}/admin/upload_profile_picture`, {
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

    const res = await apiFetch('/admin/admin_change_name', {
        method: 'POST',
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

    const res = await apiFetch('/admin/admin_change_password', {
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
let _lastStudentCount       = -1;

function showAdminLiveIndicator(dotId) {
    const dot = document.getElementById(dotId);
    if (!dot) return;
    dot.classList.add('live-blink');
    setTimeout(() => dot.classList.remove('live-blink'), 2000);
}

async function renderEventAttendanceRecord() {
    try {
        const res = await apiFetch('/admin/get_events');
        const data = await res.json();

        if (!res.ok) {
            return Swal.fire({ icon: 'error', title: 'Failed to load records', text: data.message || 'Something went wrong.' });
        }

        const attendeeCount = data.content.filter(d => d.status === 'TIME IN').length;
        DOM.statsValue.textContent = attendeeCount;
        DOM.sideBarStatsValue.textContent = attendeeCount;

        DOM.attendanceBody.innerHTML = data.content.map(d => `
            <tr>
                <td data-label="ID Number">${d.student_id_number}</td>
                <td data-label="Student Name">${d.student_name}</td>
                <td data-label="Program">${d.student_program}</td>
                <td data-label="Year Level">${d.student_year_level}</td>
                <td data-label="Date">${dateFormat(d.date)}</td>
                <td data-label="Time">${formatTime(d.time)}</td>
                <td data-label="Status">${d.status}</td>
                <td data-label="Event Name">${d.event_name}</td>
            </tr>
        `).join('');

        // Populate dynamic filter options from actual data
        populateFilterOptions(data.content, 'eventNameFilter',    d => d.event_name,        'All Events',      'ef_name');
        populateFilterOptions(data.content, 'eventYearFilter',    d => d.student_year_level, 'All Year Levels', 'ef_year');
        populateFilterOptions(data.content, 'eventProgramFilter', d => d.student_program,   'All Programs',    'ef_program');

        // Reset all filters so full list shows by default
        ['ef_status','ef_name','ef_year','ef_program'].forEach(k => localStorage.removeItem(k));
        if (DOM.eventStatusFilter)  DOM.eventStatusFilter.value  = '';
        if (DOM.eventNameFilter)    DOM.eventNameFilter.value    = '';
        if (DOM.eventYearFilter)    DOM.eventYearFilter.value    = '';
        if (DOM.eventProgramFilter) DOM.eventProgramFilter.value = '';
        applyEventNowFilters(); // re-show all rows after reset

        _lastEventCount = data.content.length;
        startAdminPolling();
    } catch (err) {
        console.error(err);
        Swal.fire({ icon: 'error', title: 'Network Error', text: err.message || 'Unable to connect to the server.' });
    }
}

async function renderEventHistoryAttendanceRecord() {
    try {
        const res = await apiFetch('/admin/get_events_history');
        const data = await res.json();
        if (!res.ok) { console.error(data); return; }

        DOM.attendanceHistory.innerHTML = data.content.map(d => `
            <tr>
                <td data-label="ID Number">${d.student_id_number}</td>
                <td data-label="Student Name">${d.student_name}</td>
                <td data-label="Program">${d.student_program}</td>
                <td data-label="Year Level">${d.student_year_level}</td>
                <td data-label="Date">${dateFormat(d.date)}</td>
                <td data-label="Time">${formatTime(d.time)}</td>
                <td data-label="Status">${d.status}</td>
                <td data-label="Event Name">${d.event_name}</td>
            </tr>
        `).join('');

        // Populate dynamic filter options from actual data
        populateFilterOptions(data.content, 'eventHistoryNameFilter',    d => d.event_name,        'All Events',      'ehf_name');
        populateFilterOptions(data.content, 'eventHistoryYearFilter',    d => d.student_year_level, 'All Year Levels', 'ehf_year');
        populateFilterOptions(data.content, 'eventHistoryProgramFilter', d => d.student_program,   'All Programs',    'ehf_program');

        // Reset all filters so full list shows by default
        ['ehf_status','ehf_name','ehf_year','ehf_program'].forEach(k => localStorage.removeItem(k));
        if (DOM.eventHistoryStatusFilter)  DOM.eventHistoryStatusFilter.value  = '';
        if (DOM.eventHistoryNameFilter)    DOM.eventHistoryNameFilter.value    = '';
        if (DOM.eventHistoryYearFilter)    DOM.eventHistoryYearFilter.value    = '';
        if (DOM.eventHistoryProgramFilter) DOM.eventHistoryProgramFilter.value = '';
        applyEventHistoryFilters(); // re-show all rows after reset

        _lastEventHistCount = data.content.length;
    } catch (err) {
        console.error(err);
    }
}

async function pollAdminSilently() {
    try {
        // Poll event attendance
        const r1 = await apiFetch('/admin/get_events');
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
                populateFilterOptions(d1.content, 'eventNameFilter',    d => d.event_name,         'All Events',      'ef_name');
                populateFilterOptions(d1.content, 'eventYearFilter',    d => d.student_year_level,  'All Year Levels', 'ef_year');
                populateFilterOptions(d1.content, 'eventProgramFilter', d => d.student_program,    'All Programs',    'ef_program');
                applyEventNowFilters();
                showAdminLiveIndicator('adminLiveDotEvent');
                updateChart();
            }
        }

        // Poll event history
        const r2 = await apiFetch('/admin/get_events_history');
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
                populateFilterOptions(d2.content, 'eventHistoryNameFilter',    d => d.event_name,         'All Events',      'ehf_name');
                populateFilterOptions(d2.content, 'eventHistoryYearFilter',    d => d.student_year_level,  'All Year Levels', 'ehf_year');
                populateFilterOptions(d2.content, 'eventHistoryProgramFilter', d => d.student_program,    'All Programs',    'ehf_program');
                applyEventHistoryFilters();
                showAdminLiveIndicator('adminLiveDotEventHist');
            }
        }
        // Poll new student registrations
        const r3 = await apiFetch('/admin/get_whole_campus_accounts_count/student_accounts');
        if (r3.ok) {
            const d3 = await r3.json();
            if (d3.ok && _lastStudentCount !== -1 && d3.contents.length !== _lastStudentCount) {
                const newCount = d3.contents.length - _lastStudentCount;
                _lastStudentCount = d3.contents.length;
                // Refresh the student accounts list live
                fetchStudentAccounts();
                // Only show toast on new additions, not deletions
                if (newCount > 0) {
                    showStudentLiveToast(newCount, d3.contents[d3.contents.length - 1]);
                }
            } else if (d3.ok && _lastStudentCount === -1) {
                _lastStudentCount = d3.contents.length;
            }
        }

    } catch (err) {
        console.error('[Poll]', err);
    }
}

// ============================================================
// LIVE STUDENT REGISTRATION TOAST
// ============================================================
(function injectStudentToastStyles() {
    if (document.getElementById('sa-student-toast-style')) return;
    const style = document.createElement('style');
    style.id = 'sa-student-toast-style';
    style.textContent = `
        #saStudentToast {
            position: fixed;
            bottom: 28px;
            right: 28px;
            z-index: 99999;
            display: flex;
            align-items: center;
            gap: 14px;
            background: #1a3a2a;
            color: #fff;
            border-left: 5px solid #2ecc71;
            border-radius: 10px;
            padding: 14px 20px;
            min-width: 300px;
            max-width: 400px;
            box-shadow: 0 8px 28px rgba(0,0,0,0.28);
            font-size: 14px;
            transform: translateX(120%);
            transition: transform 0.35s cubic-bezier(.4,0,.2,1), opacity 0.35s;
            opacity: 0;
            pointer-events: none;
        }
        #saStudentToast.show {
            transform: translateX(0);
            opacity: 1;
            pointer-events: auto;
        }
        #saStudentToast .toast-icon { font-size: 26px; flex-shrink: 0; }
        #saStudentToast .toast-body { flex: 1; }
        #saStudentToast .toast-title { font-weight: 700; font-size: 14px; margin-bottom: 3px; color: #2ecc71; }
        #saStudentToast .toast-msg { font-size: 12px; color: #ccc; }
        #saStudentToast .toast-view {
            background: #2ecc71;
            color: #fff;
            border: none;
            border-radius: 6px;
            padding: 6px 12px;
            font-size: 12px;
            font-weight: 700;
            cursor: pointer;
            white-space: nowrap;
            flex-shrink: 0;
        }
        #saStudentToast .toast-view:hover { background: #27ae60; }
        #saStudentToast .toast-close {
            background: none;
            border: none;
            color: #aaa;
            font-size: 18px;
            cursor: pointer;
            padding: 0 0 0 6px;
            flex-shrink: 0;
            line-height: 1;
        }
    `;
    document.head.appendChild(style);

    const toast = document.createElement('div');
    toast.id = 'saStudentToast';
    toast.innerHTML = `
        <div class="toast-icon">🎓</div>
        <div class="toast-body">
            <div class="toast-title" id="saStudentToastTitle">New Student Registered</div>
            <div class="toast-msg" id="saStudentToastMsg"></div>
        </div>
        <button class="toast-view" id="saStudentToastBtn" onclick="navigateTo('studentAccountManagement')">View</button>
        <button class="toast-close" onclick="hideStudentToast()">×</button>
    `;
    document.body.appendChild(toast);
})();

let _studentToastTimer = null;

function showStudentLiveToast(newCount, latestStudent) {
    const toast = document.getElementById('saStudentToast');
    const title = document.getElementById('saStudentToastTitle');
    const msg   = document.getElementById('saStudentToastMsg');
    if (!toast) return;

    title.textContent = newCount === 1 ? 'New Student Registered!' : `${newCount} New Students Registered!`;
    if (latestStudent) {
        const name = `${latestStudent.student_firstname} ${latestStudent.student_lastname}`;
        msg.textContent = newCount === 1
            ? `${name} — ${latestStudent.student_program || latestStudent.student_year_level}`
            : `Latest: ${name}`;
    } else {
        msg.textContent = 'Student Accounts has been updated.';
    }

    toast.classList.add('show');
    clearTimeout(_studentToastTimer);
    _studentToastTimer = setTimeout(hideStudentToast, 7000);
}

function hideStudentToast() {
    const toast = document.getElementById('saStudentToast');
    if (toast) toast.classList.remove('show');
}

function startAdminPolling() {
    if (_adminPollInterval) return;
    _adminPollInterval = setInterval(pollAdminSilently, 5000);
}

// Load and display the currently active event on page load
async function loadActiveEvent() {
    if (!TOKEN || TOKEN === 'null') return renderActiveEvent('');
    try {
        const res  = await apiFetch('/admin/get_active_event');
        const data = await res.json();
        if (res.ok && data.content) {
            renderActiveEvent(data.content.event_name_set || '');
        }
    } catch (_) {
        renderActiveEvent('');
    }
}

function renderActiveEvent(eventName) {
    const el = document.getElementById('activeEventDisplay');
    if (!el) return;
    if (eventName && eventName.trim() !== '') {
        el.textContent = `✓ ${eventName}`;
        el.style.background = '#c8ece5';
        el.style.color = '#1a5c4f';

        // Pre-fill the event name input so the admin sees what's currently set
        const eventInput = document.getElementById('event_name_input');
        if (eventInput && !eventInput.value) eventInput.value = eventName;
    } else {
        el.textContent = '⚠ No event set';
        el.style.background = '#fdecea';
        el.style.color = '#b94a3a';
    }
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
        const res  = await apiFetch('/admin/get_events');
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
            .then(() => clearSessionAndRedirect());
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
                .then(() => clearSessionAndRedirect());
        }
        if (!response.ok) {
            return Swal.fire({ icon: 'error', title: 'Error', text: data.message || 'Failed to set event.' });
        }

        renderActiveEvent(eventName);
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
        if (!data.content) return;

        // Only render list cards if on the academic setup page
        const programsList = document.getElementById('programsList');
        if (programsList) {
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
        }

        const optionsHtml = "<option value=''>Select Program</option>" +
            data.content.map(d => `<option value='${d.program_name}'>${d.program_name}</option>`).join('');
        const filterOptionsHtml = "<option value=''>All Programs</option>" +
            data.content.map(d => `<option value='${d.program_name}'>${d.program_name}</option>`).join('');

        if (DOM.studentProgram) DOM.studentProgram.innerHTML = optionsHtml;
        if (DOM.teacherProgram) DOM.teacherProgram.innerHTML = optionsHtml;
        // Also populate the registration form program select (different ID)
        const stdProgramEl = document.getElementById('std_program');
        if (stdProgramEl) stdProgramEl.innerHTML = optionsHtml;

        // Populate and restore pre-values for all program event filters
        ['eventProgramFilter', 'eventHistoryProgramFilter'].forEach((id, i) => {
            const el = document.getElementById(id);
            if (!el) return;
            el.innerHTML = filterOptionsHtml;
            const key = i === 0 ? 'ef_program' : 'ehf_program';
            const saved = localStorage.getItem(key) || '';
            if (saved && [...el.options].some(o => o.value === saved)) el.value = saved;
        });
    } catch (err) {
        console.error('[renderPrograms]', err);
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
        const filterOptions = '<option value="">All Year Levels</option>' +
            data.content.map(d => `<option value="${d.year_level_name}">${d.year_level_name}</option>`).join('');

        ['std_year_level', 'studentYearLevel'].forEach(id => {
            const el = document.getElementById(id);
            if (el) el.innerHTML = yearOptions;
        });

        // Populate and restore pre-values for all year level event filters
        ['eventYearFilter', 'eventHistoryYearFilter'].forEach((id, i) => {
            const el = document.getElementById(id);
            if (!el) return;
            el.innerHTML = filterOptions;
            const key = i === 0 ? 'ef_year' : 'ehf_year';
            const saved = localStorage.getItem(key) || '';
            if (saved && [...el.options].some(o => o.value === saved)) el.value = saved;
        });

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
        const res = await apiFetch(`/admin/get_whole_campus_accounts_count/${tableName}`);
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
    _lastStudentCount = result.length;
    DOM.studentsList.innerHTML = result.map(d => `
        <div class="student-card" data-student-id="${d.student_id}" data-id-number="${d.student_id_number}" data-name="${d.student_firstname} ${d.student_lastname}">
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
                        '${d.student_email || ''}',
                        '${d.student_guardian_number || ''}')">Edit</button>
                    <button class="action-btn delete-btn-account-management" onclick="deleteStudent(${d.student_id})">Delete</button>
                    <button class="action-btn" style="background:#e67e22;color:#fff;" onclick="resetStudentDevice(${d.student_id}, '${d.student_firstname} ${d.student_lastname}')">Reset Device</button>
                    <button class="action-btn" style="background:#8e44ad;color:#fff;" onclick="resetUserPassword('student', ${d.student_id}, '${d.student_firstname} ${d.student_lastname}')">Reset Password</button>
                </div>
            </div>
        </div>
    `).join('');
    // Re-apply active search filter so live updates don't reset the user's search
    const _activeSearch = DOM.searchFilterStudentsAccounts?.value || '';
    if (_activeSearch) filterCards('#studentsList', '.student-card', _activeSearch);
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
                    <button class="action-btn" style="background:#8e44ad;color:#fff;" onclick="resetUserPassword('teacher', ${d.teacher_id}, '${d.teacher_name}')">Reset Password</button>
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
                    <button class="action-btn" style="background:#8e44ad;color:#fff;" onclick="resetUserPassword('guard', ${d.guard_id}, '${d.guard_name}')">Reset Password</button>
                </div>
            </div>
        </div>
    `).join('');
}

// ============================================================
// ACCOUNTS — EDIT (open modals)
// ============================================================
function editStudent(id, student_id_number, student_firstname, student_middlename, student_lastname, student_program, student_year_level, student_email, student_guardian_number) {
    DOM.studentAccountManagementModal.style.display = 'flex';
    DOM.studentIDTracking.value = id;
    DOM.studentIdNumber.value = student_id_number;
    DOM.studentFirstName.value = student_firstname;
    DOM.studentMiddleName.value = student_middlename;
    DOM.studentLastName.value = student_lastname;
    DOM.studentProgram.value = student_program;
    DOM.studentYearLevel.value = student_year_level;
    if (DOM.studentEmail) DOM.studentEmail.value = student_email || '';
    if (DOM.studentGuardianNumber) DOM.studentGuardianNumber.value = student_guardian_number || '';
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
        email: DOM.studentEmail?.value.trim() || '',
        guardian_number: DOM.studentGuardianNumber?.value.trim() || ''
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
        student: `/admin/reset_student_password/${id}`,
        teacher: `/admin/reset_teacher_password/${id}`,
        guard:   `/admin/reset_guard_password/${id}`,
    };

    Swal.fire({ title: 'Resetting password...', allowOutsideClick: false, didOpen: () => Swal.showLoading() });
    try {
        const res  = await apiFetch(endpointMap[role], { method: 'PUT', body: JSON.stringify({ new_password: newPassword }) });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message);
        Swal.fire({ icon: 'success', title: 'Password Reset!', text: `${name}'s password has been updated.`, timer: 2000, showConfirmButton: false });
    } catch (err) {
        Swal.fire({ icon: 'error', title: 'Failed', text: err.message });
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
        const res = await apiFetch(`/admin/reset_student_device/${id}`, { method: 'PUT' });
        if (res && res.ok) {
            Swal.fire({ icon: 'success', title: 'Device Reset', text: `${studentName} can now log in from a new device.` });
        } else {
            Swal.fire({ icon: 'error', title: 'Reset Failed', text: res?.message || 'Something went wrong.' });
        }
    } catch (err) {
        Swal.fire({ icon: 'error', title: 'Error', text: err.message || 'Please try again.' });
    }
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
    // Update role cards
    document.querySelectorAll('.reg-role-card').forEach(card => card.classList.remove('active'));
    document.getElementById(`roleCard-${role}`)?.classList.add('active');
    // Update forms
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
    if (password.length < 6) {
        return Swal.fire({ icon: 'warning', title: 'Weak Password', text: 'Password must be at least 6 characters.' });
    }

    const guardData = {
        guard_name: document.getElementById('guard_fullname').value,
        guard_email: document.getElementById('guard_email').value,
        guard_password: password,
        guard_designated_location: document.getElementById('guard_location').value
    };

    if (!guardData.guard_email.toLowerCase().endsWith('@panpacificu.edu.ph'))
        return Swal.fire({ icon: 'error', title: 'Invalid Email', text: 'Email must end with @panpacificu.edu.ph.' });

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
    if (teacherPassword.length < 6) {
        return Swal.fire({ icon: 'warning', title: 'Weak Password', text: 'Password must be at least 6 characters.' });
    }

    const teacherData = {
        fullName: document.getElementById('teacher_fullname').value,
        email: document.getElementById('teacher_email').value,
        password: teacherPassword,
        department: document.getElementById('teacher_department').value
    };

    if (!teacherData.email.toLowerCase().endsWith('@panpacificu.edu.ph'))
        return Swal.fire({ icon: 'error', title: 'Invalid Email', text: 'Email must end with @panpacificu.edu.ph.' });

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
    if (password.length < 6) {
        return Swal.fire({ icon: 'warning', title: 'Weak Password', text: 'Password must be at least 6 characters.' });
    }

    const studentData = {
        firstName: document.getElementById('std_firstname').value,
        middleName: document.getElementById('std_middlename').value,
        lastName: document.getElementById('std_lastname').value,
        email: document.getElementById('std_email').value,
        idNumber: document.getElementById('std_id_number').value,
        program: document.getElementById('std_program').value,
        yearLevel: document.getElementById('std_year_level').value,
        guardianContact: normalizePhilippineNumber(document.getElementById('std_contact').value),
        password
    };

    if (!isValidPHNumber(studentData.guardianContact))
        return Swal.fire({ icon: 'error', title: 'Invalid Contact Number', text: 'Guardian contact must be a valid Philippine mobile number (e.g. 09XXXXXXXXX).' });
    if (!studentData.email.toLowerCase().endsWith('@panpacificu.edu.ph'))
        return Swal.fire({ icon: 'error', title: 'Invalid Email', text: 'Email must end with @panpacificu.edu.ph.' });

    showLoading();
    try {
        const res = await fetch(`${URL_BASED}/authentication/student_registration`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
            body: JSON.stringify(studentData)
        });
        const data = await res.json();
        Swal.close();

        if (data.duplicate) {
            return Swal.fire({
                icon: 'warning',
                title: 'ID Number Already Exists',
                text: `The ID number "${studentData.idNumber}" is already assigned to another student.`
            });
        }
        if (data.duplicate_email) {
            return Swal.fire({
                icon: 'warning',
                title: 'Email Already Exists',
                text: `The email "${studentData.email}" is already used by another student.`
            });
        }
        if (!res.ok) return Swal.fire({ icon: 'error', title: 'Registration Failed', text: data.message || 'Something went wrong.' });

        Swal.fire({ icon: 'success', title: 'Student Registered!', text: 'Student account created successfully.' });
        this.reset();
        fetchStudentAccounts();
    } catch (err) {
        console.error(err);
        Swal.fire({ icon: 'error', title: 'Error', text: err.message });
    }
});

// ============================================================
// EXPORT
// ============================================================

async function getLogoBase64() {
    // Try absolute server URL first (most reliable), then relative fallbacks
    const serverBase = URL_BASED.replace('/api/v1', '');
    const attempts = [
        serverBase + '/public/logo.png',
        '../public/logo.png',
        '/public/logo.png',
    ];
    for (const url of attempts) {
        try {
            const res = await fetch(url);
            if (!res.ok) continue;
            const blob = await res.blob();
            return await new Promise(resolve => {
                const reader = new FileReader();
                reader.onload = () => resolve(reader.result);
                reader.readAsDataURL(blob);
            });
        } catch { continue; }
    }
    return '';
}

async function printSection(tableId, title) {
    const table = document.getElementById(tableId);
    if (!table) return;

    const now  = new Date().toLocaleString('en-PH');
    const logoSrc = await getLogoBase64();

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
            .header img { width: 70px; height: 70px; object-fit: contain; border-radius: 50%; margin-bottom: 8px; }
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
                ${logoSrc ? `<img src="${logoSrc}" style="width:70px;height:70px;object-fit:contain;border-radius:50%;margin-bottom:8px;display:block;margin-left:auto;margin-right:auto;">` : ''}
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

        // --- Extract headers ---
        const headers = [];
        table.querySelectorAll('thead th').forEach(th => headers.push(th.innerText.trim()));

        // --- Extract rows ---
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

        // --- Column widths (auto-fit by max content length) ---
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

    // Event attendance current — multi filters (global functions — also called after poll re-render)
    DOM.eventStatusFilter?.addEventListener('change', applyEventNowFilters);
    DOM.eventNameFilter?.addEventListener('change', applyEventNowFilters);
    DOM.eventYearFilter?.addEventListener('change', applyEventNowFilters);
    DOM.eventProgramFilter?.addEventListener('change', applyEventNowFilters);

    // Event attendance history — multi filters (global functions — also called after poll re-render)
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
}

// ============================================================
// MAINTENANCE MODE POLLING
// ============================================================
let _maintenancePollInterval = null;
let _maintenanceActive = false;

async function checkMaintenanceMode() {
    try {
        const res  = await fetch(`${URL_BASED}/system/maintenance`);
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
    // Remove existing
    document.getElementById('maintenanceBanner')?.remove();
    const banner = document.createElement('div');
    banner.id = 'maintenanceBanner';
    banner.innerHTML = `
        <svg viewBox="0 0 24 24" style="width:20px;height:20px;fill:#fff;flex-shrink:0;">
            <path d="M22.7 19l-9.1-9.1c.9-2.3.4-5-1.5-6.9-2-2-5-2.4-7.4-1.3L9 6 6 9 1.6 4.7C.4 7.1.9 10.1 2.9 12.1c1.9 1.9 4.6 2.4 6.9 1.5l9.1 9.1c.4.4 1 .4 1.4 0l2.3-2.3c.5-.4.5-1.1.1-1.4z"/>
        </svg>
        <div>
            <div style="font-weight:800;font-size:0.9rem;">🔧 System Maintenance</div>
            <div style="font-size:0.78rem;opacity:0.9;margin-top:2px;">The system is currently under maintenance. All actions are temporarily disabled. Please wait...</div>
        </div>`;
    banner.style.cssText = `
        position:fixed; top:0; left:0; right:0; z-index:99999;
        background:linear-gradient(135deg,#c0392b,#e74c3c); color:#fff;
        padding:14px 20px; display:flex; align-items:center; gap:14px;
        box-shadow:0 4px 20px rgba(0,0,0,0.35); font-family:inherit;`;
    document.body.prepend(banner);
    // Overlay to block all clicks
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
        background: '#fff',
    });
}

function hideMaintenanceBanner() {
    document.getElementById('maintenanceBanner')?.remove();
    document.getElementById('maintenanceOverlay')?.remove();
    Swal.close();
    Swal.fire({ icon:'success', title:'System Online', text:'Maintenance is complete. You can continue working.', timer:3000, showConfirmButton:false });
}

// Poll every 15 seconds
checkMaintenanceMode();
_maintenancePollInterval = setInterval(checkMaintenanceMode, 15000);

// ============================================================
// THEME
// ============================================================
const THEME_STORAGE_KEY = 'admin_theme';

function loadTheme() {
    const saved = JSON.parse(localStorage.getItem(THEME_STORAGE_KEY) || '{}');
    applyTheme(saved.mode || 'light', saved.font || 'system', saved.size || 'medium', false);
}

function applyTheme(mode, font, size, save = true) {
    const html = document.documentElement;
    html.setAttribute('data-theme', mode === 'dark' ? 'dark' : '');
    html.setAttribute('data-font',  font === 'system' ? '' : font);
    html.setAttribute('data-size',  size);

    // Font family — apply directly to body so it overrides hardcoded body font-family
    const fontMap = {
        system:  "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        inter:   "'Inter', sans-serif",
        poppins: "'Poppins', sans-serif",
        roboto:  "'Roboto', sans-serif",
        mono:    "'JetBrains Mono', 'Fira Code', monospace"
    };
    document.body.style.fontFamily = fontMap[font] || fontMap.system;

    // Font size — zoom sections only, sidebar layout stays untouched
    const zoomMap = { small: '0.88', medium: '1', large: '1.12' };
    const zoomVal = zoomMap[size] || '1';
    document.body.style.zoom = '';
    document.body.style.fontSize = '';
    document.querySelectorAll('.sections, .top-bar').forEach(el => {
        el.style.zoom = zoomVal;
    });

    const sidebar = document.getElementById('sidebar');
    if (sidebar) {
        sidebar.style.background = mode === 'dark'
            ? 'linear-gradient(180deg, #0d1a2a 0%, #091422 100%)'
            : 'linear-gradient(180deg, #1a4545 0%, #0f2e2e 100%)';
    }

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
    Swal.fire({ icon: 'success', title: 'Theme Reset', text: 'Appearance restored to defaults.', timer: 1500, showConfirmButton: false });
}

// Load theme immediately on page load
loadTheme();

// ============================================================
// SETTINGS PAGE
// ============================================================
const _sessionStart = new Date().toLocaleString('en-PH', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' });

async function loadSettingsStats() {
    try {
        const [students, teachers, guards] = await Promise.all([
            fetchAccountCount('student_accounts'),
            fetchAccountCount('teacher'),
            fetchAccountCount('guards'),
        ]);
        const el = id => document.getElementById(id);
        if (el('settingsStatStudents')) el('settingsStatStudents').textContent = students ? students.length : '—';
        if (el('settingsStatTeachers')) el('settingsStatTeachers').textContent = teachers ? teachers.length : '—';
        if (el('settingsStatGuards'))   el('settingsStatGuards').textContent   = guards   ? guards.length   : '—';
        if (el('settingsSessionStart')) el('settingsSessionStart').textContent = _sessionStart;
        if (el('settingsProfileName'))  el('settingsProfileName').textContent  = DOM.titleHeader?.dataset?.adminName || document.getElementById('adminProfileName')?.textContent || 'Admin';
    } catch (err) { console.error('[loadSettingsStats]', err); }
}
// ============================================================
// NOTIFICATIONS
// ============================================================
let _notifOpen = false;
let _notifData = [];
const NOTIF_ENDPOINT = '/admin';

async function fetchNotifications() {
    try {
        const [sysRes, msgRes] = await Promise.all([
            apiFetch(`${NOTIF_ENDPOINT}/notifications?limit=30`),
            apiFetch(`${NOTIF_ENDPOINT}/messages/notifications?limit=30`)
        ]);
        const sysData = (sysRes?.ok) ? await sysRes.json() : { content: [], unread: 0 };
        const msgData = (msgRes?.ok) ? await msgRes.json() : { notifications: [], unread: 0 };

        // Normalise system notifications
        const sysNormed = (sysData.content || []).map(n => ({
            id: 'sys_' + n.id, type: n.type,
            sender_name: 'System',
            preview: n.message || n.title,
            emoji: null, is_read: n.is_read,
            created_at: n.created_at,
            _sys: true, _sys_id: n.id
        }));

        const all = [...(msgData.notifications || []), ...sysNormed];
        all.sort((a, b) => new Date((b.created_at+'').replace(' ','T')) - new Date((a.created_at+'').replace(' ','T')));
        _notifData = all.slice(0, 50);

        const unread = (sysData.unread || 0) + (msgData.unread || 0);
        const badge  = document.getElementById('notifBadge');
        if (badge) {
            if (unread > 0) {
                badge.textContent = unread > 99 ? '99+' : unread;
                badge.style.display = 'flex';
            } else {
                badge.style.display = 'none';
            }
        }
        if (_notifOpen) renderNotifPanel();
    } catch (e) { /* silent */ }
}

function renderNotifPanel() {
    const list = document.getElementById('notifList');
    if (!list) return;
    if (!_notifData.length) {
        list.innerHTML = '<div class="notif-empty">No notifications yet</div>';
        return;
    }
    const ROLE_C = { admin:'#2e7d32', super_admin:'#f57f17', teacher:'#1565c0', student:'#6a1b9a', guard:'#00695c' };
    list.innerHTML = _notifData.map(n => {
        const unread = !n.is_read;
        const time   = formatNotifTime(n.created_at);
        let avatarHtml, title, preview;
        if (n._sys) {
            const sysIconMap = { new_student:'🎓', new_teacher:'👩‍🏫', new_guard:'🛡️', info:'📢' };
            const sysIcon = sysIconMap[n.type] || '🔔';
            avatarHtml = `<div class="notif-icon" style="font-size:20px;background:#e0f2f1;">${sysIcon}</div>`;
            title   = n.type === 'new_student' ? 'New Student Registered' : 'System';
            preview = n.preview || '';
        } else {
            const senderName = n.sender_name || 'Unknown';
            const senderRole = n.sender_role || 'student';
            const initial    = senderName.charAt(0).toUpperCase();
            const bgColor    = ROLE_C[senderRole] || '#1a4545';
            const picFile    = n.sender_picture || null;
            if (picFile) {
                avatarHtml = `<div style="flex-shrink:0;width:38px;height:38px;border-radius:50%;overflow:hidden;">
                    <img src="${URL_BASED}/uploads/profile_pictures/${picFile}"
                         style="width:38px;height:38px;border-radius:50%;object-fit:cover;display:block;"
                         onerror="this.outerHTML='<div style=\'width:38px;height:38px;border-radius:50%;background:${bgColor};display:flex;align-items:center;justify-content:center;font-weight:700;font-size:15px;color:white;\'>${initial}</div>'">
                </div>`;
            } else {
                avatarHtml = `<div style="flex-shrink:0;width:38px;height:38px;border-radius:50%;background:${bgColor};display:flex;align-items:center;justify-content:center;font-weight:700;font-size:15px;color:white;">${initial}</div>`;
            }
            title   = senderName;
            preview = n.type === 'reaction'
                ? `Reacted ${n.emoji || ''} to your message`
                : (n.preview ? (n.preview.length > 60 ? n.preview.substring(0,60)+'…' : n.preview) : 'Sent a file');
        }
        return `
        <div class="notif-item ${unread ? 'unread' : ''}" onclick="markOneRead('${n.id}')">
            ${avatarHtml}
            <div class="notif-body">
                <div class="notif-title">${escHtml(title)}</div>
                <div class="notif-msg">${escHtml(preview)}</div>
                <div class="notif-time">${time}</div>
            </div>
            ${unread ? '<div class="notif-dot"></div>' : ''}
            <button class="notif-delete-btn" onclick="event.stopPropagation();deleteNotif('${n.id}')" title="Delete">×</button>
        </div>`;
    }).join('');
}

async function deleteNotif(id) {
    _notifData = _notifData.filter(n => String(n.id) !== String(id));
    renderNotifPanel();
    try {
        await apiFetch(`/admin/messages/notifications/${id}`, { method: 'DELETE' });
    } catch(e) {}
}

function escHtml(s) {
    return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

function formatNotifTime(dt) {
    if (!dt) return '';
    const d   = new Date(dt.replace(' ','T'));
    const now = new Date();
    const diff = Math.floor((now - d) / 1000);
    if (diff < 60)    return 'Just now';
    if (diff < 3600)  return `${Math.floor(diff/60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff/3600)}h ago`;
    return d.toLocaleDateString('en-PH', { month:'short', day:'numeric' });
}

function toggleNotifPanel() {
    _notifOpen = !_notifOpen;
    const panel   = document.getElementById('notifPanel');
    const overlay = document.getElementById('notifOverlay');
    panel.style.display   = _notifOpen ? 'flex' : 'none';
    overlay.style.display = _notifOpen ? 'block' : 'none';
    if (_notifOpen) renderNotifPanel();
}

function closeNotifPanel() {
    _notifOpen = false;
    const panel   = document.getElementById('notifPanel');
    const overlay = document.getElementById('notifOverlay');
    if (panel)   panel.style.display   = 'none';
    if (overlay) overlay.style.display = 'none';
}

async function markOneRead(id) {
    const item = _notifData.find(n => String(n.id) === String(id));
    if (item && !item.is_read) {
        item.is_read = 1;
        if (item._sys) {
            await apiFetch(`${NOTIF_ENDPOINT}/notifications/read`, { method: 'POST', body: JSON.stringify({ ids: [item._sys_id] }) }).catch(() => {});
        } else {
            await apiFetch(`${NOTIF_ENDPOINT}/messages/notifications/read`, { method: 'POST', body: JSON.stringify({ ids: [id] }) }).catch(() => {});
        }
        fetchNotifications();
    }

    // Message notification — open chat and jump to the sender's conversation
    if (item && !item._sys && item.sender_id) {
        closeNotifPanel();
        const panel = document.getElementById('chatPanel');
        const isMinimized = panel && panel.classList.contains('minimized');
        const isOpen      = panel && panel.classList.contains('open');
        if (isMinimized) {
            // Restore from minimized then open conversation
            if (typeof window.minimizeChat === 'function') window.minimizeChat();
            setTimeout(() => {
                if (typeof window._chatOpenConv === 'function') {
                    window._chatOpenConv(item.sender_id, item.sender_role || 'student', item.sender_name || 'User', item.sender_picture || null);
                }
            }, 200);
        } else {
            if (!isOpen && typeof toggleChat === 'function') toggleChat();
            setTimeout(() => {
                if (typeof window._chatOpenConv === 'function') {
                    window._chatOpenConv(item.sender_id, item.sender_role || 'student', item.sender_name || 'User', item.sender_picture || null);
                }
            }, 80);
        }
        return;
    }

    // Redirect to Student Accounts and highlight the registered student
    if (item && item.type === 'new_student') {
        closeNotifPanel();
        navigateTo('studentAccountManagement');
        const meta = item.meta;
        const metaObj = typeof meta === 'string' ? JSON.parse(meta) : meta;
        const idNumber = metaObj?.student_id_number || '';
        const fullName = metaObj?.name || '';
        const firstName = fullName.split(' ')[0];

        const doHighlight = () => {
            // Clear any active search filter so all cards are visible
            const searchInput = document.getElementById('searchFilterStudentsAccounts');
            if (searchInput) {
                searchInput.value = '';
                filterCards('#studentsList', '.student-card', '');
            }

            // Find the exact card by id_number, fallback to name match
            const allCards = Array.from(document.querySelectorAll('#studentsList .student-card'));
            let target = allCards.find(c => c.dataset.idNumber === String(idNumber));
            if (!target && firstName) {
                target = allCards.find(c => (c.dataset.name || '').toLowerCase().includes(firstName.toLowerCase()));
            }

            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'center' });
                target.style.transition = 'box-shadow 0.3s, border-color 0.3s';
                target.style.boxShadow = '0 0 0 4px #3b82f6, 0 4px 16px rgba(59,130,246,0.35)';
                target.style.borderColor = '#3b82f6';
                target.style.borderWidth = '2px';
                target.style.borderStyle = 'solid';
                setTimeout(() => {
                    target.style.boxShadow = '';
                    target.style.borderColor = '';
                    target.style.borderWidth = '';
                    target.style.borderStyle = '';
                }, 3500);
            }
        };

        setTimeout(doHighlight, 600);
    }
}

async function markAllRead() {
    await Promise.all([
        apiFetch(`${NOTIF_ENDPOINT}/notifications/read`, { method: 'POST', body: JSON.stringify({ ids: [] }) }),
        apiFetch(`${NOTIF_ENDPOINT}/messages/notifications/read`, { method: 'POST', body: JSON.stringify({ ids: [] }) })
    ]).catch(() => {});
    _notifData.forEach(n => n.is_read = 1);
    fetchNotifications();
    renderNotifPanel();
}

// Poll every 10 seconds
fetchNotifications();
setInterval(fetchNotifications, 10000);