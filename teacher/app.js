// ============================================================
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
const TOKEN = localStorage.getItem('teacher_token');

// ============================================================
// DOM REFERENCES
// ============================================================
const DOM = {
    sidebar:                                document.getElementById('sidebar'),
    sidebarOverlay:                         document.getElementById('sidebarOverlay'),
    menuBtn:                                document.getElementById('menuBtn'),
    headerTitle:                            document.getElementById('headerTitle'),
    eventAttendanceBody:                            document.getElementById('eventAttendanceBody'),
    eventAttendanceHistoryBody:                     document.getElementById('attendanceHistoryBody'),
    searchFilterEventHistory:                       document.getElementById('searchFilterEventHistory'),
    searchFilterEvent:                              document.getElementById('searchFilterEvent'),
    eventAttendanceYearLevelFilter:                 document.getElementById('eventAttendanceYearLevelFilter'),
    eventAttendanceHistoryYearLevelFilter:          document.getElementById('eventAttendanceHistoryYearLevelFilter'),
    eventAttendanceProgramFilter:                   document.getElementById('eventAttendanceProgramFilter'),
    eventAttendanceHistoryProgramFilter:            document.getElementById('eventAttendanceHistoryProgramFilter'),
    eventAttendanceEventNameFilter:                 document.getElementById('eventAttendanceEventNameFilter'),
    eventAttendanceHistoryEventNameFilter:          document.getElementById('eventAttendanceHistoryEventNameFilter'),
    eventAttendanceStatusFilter:                    document.getElementById('eventAttendanceStatusFilter'),
    eventAttendanceHistoryStatusFilter:             document.getElementById('eventAttendanceHistoryStatusFilter'),
    radiusSlider:                                   document.getElementById('radiusSlider'),
    radiusValueDisplay:                             document.getElementById('radiusValue'),
};

// ============================================================
// STATE
// ============================================================
// Stores row data for attendance action buttons — keyed by a simple index
// to avoid JSON-in-HTML-attribute escaping issues
const _attendanceRowDataMap = new Map();
let _attendanceRowDataCounter = 0;

// Manual Entry row data map — same pattern, avoids JSON-in-HTML-attribute issues
let state = {
    totalPresent: 0,
    totalStudentRegistered: 0,
    attendanceStatus: {},
    manualStudents: [],
    allRegisteredStudents: [],
    allAttendanceRecords: [],
    allSubjects: [],
    activeSubjectId:   null,
    activeSubjectName: '',
    activeYearLevel:   '',
    activeSubjectTime: ''
};

// Map state
let map = null, marker = null, circle = null;

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
// INIT
// ============================================================
document.addEventListener('DOMContentLoaded', () => {

    // ── Floating tooltip for elements inside overflow:hidden/auto containers ──
    // (e.g. settings gear inside sidebar which has overflow-y:auto)
    (function initFloatingTooltip() {
        const tip = document.createElement('div');
        tip.id = 'floatingTooltip';
        tip.style.cssText = [
            'position:fixed',
            'background:rgba(20,40,40,0.92)',
            'color:#fff',
            'font-size:11px',
            'font-weight:500',
            'padding:6px 10px',
            'border-radius:6px',
            'pointer-events:none',
            'opacity:0',
            'transition:opacity 0.18s ease',
            'z-index:99999',
            'white-space:nowrap',
            'box-shadow:0 2px 8px rgba(0,0,0,0.25)',
        ].join(';');
        document.body.appendChild(tip);

        const gear = document.getElementById('settingsGearIcon');
        if (!gear) return;

        gear.addEventListener('mouseenter', () => {
            tip.textContent = 'Settings';
            const r = gear.getBoundingClientRect();
            tip.style.opacity = '0';
            tip.style.display = 'block';
            // Position: right of the gear icon
            const tipW = tip.offsetWidth;
            tip.style.left = (r.right + 10) + 'px';
            tip.style.top  = (r.top + r.height / 2 - tip.offsetHeight / 2) + 'px';
            tip.style.opacity = '1';
        });

        gear.addEventListener('mouseleave', () => {
            tip.style.opacity = '0';
        });
    })();

    checkToken();
    navigateTo('dashboard');

    // Data
    getStudentAttendanceRecords().then(() => startTeacherPolling());
    loadStudentsRegistered();
    getTeacherDataToServer();
    Promise.all([renderSubjects(), renderYearLevel(), renderPrograms()])
        .then(() => loadActiveSubject());
    Swal.fire({ title: 'Loading event data...', allowOutsideClick: false, didOpen: () => Swal.showLoading() });
    Promise.all([renderEventAttendanceRecord(), renderEventAttendanceHistoryRecord()])
        .then(() => { Swal.close(); startEventPolling(); })
        .catch(() => Swal.close());

    // Search
    setupTableSearch('searchInputAttendance', 'attendanceBody');
    setupTableSearch('searchInput', 'studentsBody');

    // Filters

    // Date filter for Attendance Now — auto-set to today and re-render on change
    const _dateFilterEl = document.getElementById('attendanceNowDateFilter');
    if (_dateFilterEl) {
        _dateFilterEl.value = new Date().toISOString().split('T')[0];
        _dateFilterEl.addEventListener('change', () => renderAttendanceNowMerged());
    }

    // Re-render attendance list whenever the Active Class Setup dropdowns change
    document.getElementById('courseFilter')?.addEventListener('change', () => renderAttendanceNowMerged());
    document.getElementById('yearFilter')?.addEventListener('change',   () => renderAttendanceNowMerged());

    studentRegisteredDropdownFilter('recordYearFilter', 5);

    // Close buttons on stat cards
    document.querySelectorAll('.close-btn').forEach(btn => {
        btn.addEventListener('click', e => e.target.closest('.stat-card').style.display = 'none');
    });

    // Profile picture upload
    const picInput = document.getElementById('teacherProfilePicInput');
    if (picInput) {
        if (typeof initImageCrop === 'function') {
            initImageCrop(picInput, async (blob, dataUrl) => {
                // Preview
                document.querySelectorAll('.avatar').forEach(el => {
                    el.innerHTML = `<img src="${dataUrl}" style="width:100%;height:100%;object-fit:cover;border-radius:inherit;">`;
                });
                const token = localStorage.getItem('teacher_token');
                const croppedFile = new File([blob], 'profile.jpg', { type: 'image/jpeg' });
                const formData = new FormData();
                formData.append('teacher_profile_picture', croppedFile);
                Swal.fire({ title: 'Uploading...', allowOutsideClick: false, didOpen: () => Swal.showLoading() });
                try {
                    const res = await fetch(`${BASE_URL}/teacher/upload_profile_picture`, {
                        method: 'POST', headers: { 'Authorization': 'Bearer ' + token }, body: formData
                    });
                    const data = await res.json();
                    Swal.close();
                    if (res.ok && data.ok) {
                        const url = `${BASE_URL}/uploads/profile_pictures/${data.filename}`;
                        document.querySelectorAll('.avatar').forEach(el => {
                            el.innerHTML = `<img src="${url}" style="width:100%;height:100%;object-fit:cover;border-radius:inherit;">`;
                        });
                        Swal.fire({ icon: 'success', title: 'Profile picture updated!', timer: 1500, showConfirmButton: false });
                    } else {
                        Swal.fire({ icon: 'error', title: 'Upload failed', text: data.message || 'Please try again.' });
                    }
                } catch (err) { Swal.close(); Swal.fire({ icon: 'error', title: 'Upload failed', text: err.message }); }
            });
        }
        picInput.addEventListener('change', async function () {
            if (typeof initImageCrop === 'function') return;
            const file = this.files[0];
            if (!file) return;

            console.log('[ProfilePic] File selected:', file.name, file.size, file.type);

            if (file.size > 5 * 1024 * 1024)
                return Swal.fire({ icon: 'warning', title: 'File too large', text: 'Please choose an image under 5MB.' });

            // Instant preview
            const reader = new FileReader();
            reader.onload = e => setTeacherAvatar(e.target.result);
            reader.readAsDataURL(file);

            // Upload to server — read token fresh (const TOKEN may be stale)
            const token = localStorage.getItem('teacher_token');
            console.log('[ProfilePic] Token:', token ? 'found' : 'MISSING');

            const formData = new FormData();
            formData.append('teacher_profile_picture', file);

            Swal.fire({ title: 'Uploading...', allowOutsideClick: false, didOpen: () => Swal.showLoading() });

            try {
                const res = await fetch(`${BASE_URL}/teacher/upload_profile_picture`, {
                    method: 'POST',
                    headers: { 'Authorization': 'Bearer ' + token },
                    body: formData
                });
                console.log('[ProfilePic] Response status:', res.status);
                const data = await res.json();
                console.log('[ProfilePic] Response data:', data);
                Swal.close();

                if (res.ok && data.ok) {
                    const url = `${BASE_URL}/uploads/profile_pictures/${data.filename}`;
                    setTeacherAvatar(url);
                    Swal.fire({ icon: 'success', title: 'Profile picture updated!', timer: 1500, showConfirmButton: false });
                } else {
                    Swal.fire({ icon: 'error', title: 'Upload failed', text: data.message || 'Please try again.' });
                }
            } catch (err) {
                Swal.close();
                console.error('[ProfilePic] Fetch error:', err);
                Swal.fire({ icon: 'error', title: 'Upload failed', text: err.message || 'Network error.' });
            }

            // Reset after upload so same file can be re-selected
            this.value = '';
        });
    }
});

// ============================================================
// AUTH
// ============================================================
async function checkToken() {
    if (!TOKEN) {
        await Swal.fire({ icon: 'error', title: 'Please login first!' });
        return window.location.href = 'teacher_login.html';
    }

    try {
        // FIX: was hardcoded to localhost, now uses BASE_URL
        const res = await fetch(`${BASE_URL}/authentication/verify_token`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + TOKEN
            }
        });

        const data = await res.json();

        if (!res.ok) {
            await Swal.fire({ icon: 'error', title: data.message });
            window.location.href = 'teacher_login.html';
        }
    } catch (err) {
        Swal.fire({ icon: 'error', title: 'Authentication error', text: err.message });
    }
}

function logout() {
    Swal.fire({
        title: 'Logout?',
        text: 'You will be returned to the login screen.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        confirmButtonText: 'Yes, log out'
    }).then(result => {
        if (!result.isConfirmed) return;
        apiCall('/teacher/logout', 'POST', { device_info: localStorage.getItem('teacher_device_info') || '' }).catch(() => {});
        localStorage.removeItem('teacher_token');
        Swal.fire({ icon: 'success', title: 'Logged out', showConfirmButton: false, timer: 1500 })
            .then(() => window.location.href = 'teacher_login.html');
    });
}

// ============================================================
// API
// ============================================================
async function apiCall(endpoint, method = 'GET', body = null) {
    try {
        const deviceInfo = localStorage.getItem('teacher_device_info') || '';
        const options = {
            method,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + TOKEN
            }
        };
        if (method === 'POST' || method === 'PUT') {
            options.body = JSON.stringify({ ...(body || {}), device_info: deviceInfo });
        } else if (body) {
            options.body = JSON.stringify(body);
        }

        const res = await fetch(`${BASE_URL}${endpoint}`, options);
        const data = await res.json();

        if (!res.ok) throw new Error(data.message || 'API Error');
        return data;
    } catch (err) {
        console.error(err);
        Swal.fire({ icon: 'error', title: 'Oops...', text: err.message || 'Something went wrong!' });
        return null;
    }
}

// ============================================================
// FORMATTERS
// ============================================================
const formatTime = (timeString) => {
    if (!timeString) return '-';
    let [h, m] = timeString.split(':');
    h = parseInt(h, 10);
    const ampm = h >= 12 ? 'PM' : 'AM';
    h = h % 12 || 12;
    return `${h}:${m} ${ampm}`;
};

const formatDate = (dateString) => dateString ? dateString.split('T')[0] : '-';

// ============================================================
// NAVIGATION
// ============================================================
const NAV_TITLES = {
    dashboard:         'Dashboard',
    location:          'Location',
    attendanceNow:     'Attendance',
    studentRegistered: 'Student Records',
    eventAttendance:   'Event Attendance',
    eventHistory:      'Event Attendance History',
    academicSetup:     'Academic Setup',
    settings:          'Settings'
};

function navigateTo(navName) {
    if (NAV_TITLES[navName]) DOM.headerTitle.textContent = NAV_TITLES[navName];

    Object.keys(NAV_TITLES).forEach(nav => {
        const el = document.getElementById(nav);
        if (el) el.classList.toggle('active', nav === navName);
    });

    // Initialize or resize map only when navigating to location tab
    if (navName === 'location') {
        if (map) {
            setTimeout(() => map.invalidateSize(), 150);
            setTimeout(() => map.invalidateSize(), 400);
        } else {
            setTimeout(() => loadLocation(), 150);
        }
    }

    // Remind teacher to set a subject when opening Attendance Now
    if (navName === 'attendanceNow') {
        checkSubjectReminder();
    }

    // Mark active sidebar nav item
    document.querySelectorAll('.menu-item').forEach(btn => {
        const onclick = btn.getAttribute('onclick') || '';
        btn.classList.toggle('active-page', onclick.includes(`'${navName}'`));
    });

    // Load settings when opening settings tab
    if (navName === 'settings') {
        loadSettingsPage();
        const saved = JSON.parse(localStorage.getItem(THEME_STORAGE_KEY) || '{}');
        applyTheme(saved.mode || 'light', saved.font || 'system', saved.size || 'medium', false);
    }

    DOM.sidebar.classList.remove('active');
    DOM.sidebarOverlay.classList.remove('active');
}

// Sidebar toggle
DOM.menuBtn.addEventListener('click', () => {
    DOM.sidebar.classList.toggle('active');
    DOM.sidebarOverlay.classList.toggle('active');
});

DOM.sidebarOverlay.addEventListener('click', () => {
    DOM.sidebar.classList.remove('active');
    DOM.sidebarOverlay.classList.remove('active');
});

// ============================================================
// DASHBOARD
// ============================================================
let _dashboardChart = null;

function updateDashboardChart() {
    const total   = state.totalStudentRegistered;
    const present = state.totalPresent;
    const absent  = Math.max(total - present, 0);

    // Update stat cards
    document.getElementById('totalPresents').textContent      = present;
    document.getElementById('bottomTotalPresent').textContent = 'Presents ' + present;
    document.getElementById('totalStudentAbsent').textContent = absent;
    document.getElementById('bottomTotalAbsent').textContent  = 'Absent ' + absent;
    document.getElementById('centerTotalStudents').textContent = total;

    const canvas = document.getElementById('donutChart');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const data    = total > 0 ? [present, absent] : [0, 1];
    const colors  = total > 0 ? ['#5a8a7a', '#d88888'] : ['#e0e0e0', '#e0e0e0'];

    if (_dashboardChart) {
        _dashboardChart.data.datasets[0].data   = data;
        _dashboardChart.data.datasets[0].backgroundColor = colors;
        _dashboardChart.update();
        return;
    }

    _dashboardChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Present', 'Absent'],
            datasets: [{
                data,
                backgroundColor: colors,
                borderWidth: 0,
                hoverOffset: 6
            }]
        },
        options: {
            cutout: '72%',
            animation: { animateRotate: true, duration: 600 },
            plugins: {
                legend: { display: false },
                tooltip: {
                    callbacks: {
                        label: ctx => ` ${ctx.label}: ${ctx.parsed} student${ctx.parsed !== 1 ? 's' : ''}`
                    }
                }
            }
        }
    });
}

// ============================================================
// ATTENDANCE
// ============================================================
function buildAttendanceRow(d, statusOverride) {
    const status = statusOverride || d.attendance_status || 'Present';
    const isPresent = status === 'Present';
    const isLate    = status === 'Late';
    const isExcused = status === 'Excused';
    const isAbsent  = status === 'Absent';

    let statusBadge;
    if (isPresent) {
        statusBadge = `<span style="display:inline-flex;align-items:center;gap:5px;background:#d4f4e7;color:#1a6b3a;padding:3px 10px;border-radius:20px;font-size:0.78rem;font-weight:700;">
               <span style="width:8px;height:8px;border-radius:50%;background:#22c55e;display:inline-block;"></span>Present
           </span>`;
    } else if (isLate) {
        statusBadge = `<span style="display:inline-flex;align-items:center;gap:5px;background:#ede9fe;color:#5b21b6;padding:3px 10px;border-radius:20px;font-size:0.78rem;font-weight:700;">
               <span style="width:8px;height:8px;border-radius:50%;background:#7c3aed;display:inline-block;"></span>Late
           </span>`;
    } else if (isExcused) {
        statusBadge = `<span style="display:inline-flex;align-items:center;gap:5px;background:#fef3c7;color:#92400e;padding:3px 10px;border-radius:20px;font-size:0.78rem;font-weight:700;">
               <span style="width:8px;height:8px;border-radius:50%;background:#f59e0b;display:inline-block;"></span>Excused
           </span>`;
    } else {
        statusBadge = `<span style="display:inline-flex;align-items:center;gap:5px;background:#fde8e8;color:#b91c1c;padding:3px 10px;border-radius:20px;font-size:0.78rem;font-weight:700;">
               <span style="width:8px;height:8px;border-radius:50%;background:#ef4444;display:inline-block;"></span>Absent
           </span>`;
    }

    const fullName = [d.student_firstname, d.student_middlename ? d.student_middlename.charAt(0) + '.' : '', d.student_lastname].filter(Boolean).join(' ');
    const timeIn = d.attendance_time ? formatTime(d.attendance_time) : '<span style="color:#aaa;">—</span>';
    const dateIn = d.attendance_date ? formatDate(d.attendance_date) : '<span style="color:#aaa;">—</span>';

    // Store row data in map with a simple key — avoids JSON-in-HTML-attribute escaping bugs
    const rowKey = _attendanceRowDataCounter++;
    _attendanceRowDataMap.set(rowKey, {
        attendance_id:      d.attendance_id || null,
        student_id:         d.student_id || null,
        student_id_number:  d.student_id_number,
        student_firstname:  d.student_firstname,
        student_middlename: d.student_middlename || '',
        student_lastname:   d.student_lastname,
        student_program:    d.student_program || '',
        year_level:         d.year_level || d.student_year_level || '',
        subject:            d.subject || ''
    });

    const actionButtons = `
        <div class="attendance-action-btns">
            <button class="att-action-btn btn-present ${isPresent ? 'active' : ''}"
                onclick="setAttendanceStatus(this, ${rowKey}, 'Present')"
                title="Mark Present">✓ Present</button>
            <button class="att-action-btn btn-late ${isLate ? 'active' : ''}"
                onclick="setAttendanceStatus(this, ${rowKey}, 'Late')"
                title="Mark Late">⏰ Late</button>
            <button class="att-action-btn btn-absent ${isAbsent ? 'active' : ''}"
                onclick="setAttendanceStatus(this, ${rowKey}, 'Absent')"
                title="Mark Absent">✗ Absent</button>
            <button class="att-action-btn btn-excused ${isExcused ? 'active' : ''}"
                onclick="setAttendanceStatus(this, ${rowKey}, 'Excused')"
                title="Mark Excused">⊘ Excuse</button>
        </div>`;

    return `
        <td>${d.student_id_number}</td>
        <td>${fullName}</td>
        <td>${d.subject || '—'}</td>
        <td>${d.year_level || d.student_year_level || '—'}</td>
        <td>${timeIn}</td>
        <td>${dateIn}</td>
        <td>${statusBadge}</td>
        <td>${actionButtons}</td>
    `;
}

async function getStudentAttendanceRecords() {
    Swal.fire({ title: 'Loading attendance...', allowOutsideClick: false, didOpen: () => Swal.showLoading() });
    const data = await apiCall('/teacher/teacher_attendance_record');
    Swal.close();
    if (!data) return;

    state.totalPresent = data.content.length;
    state.allAttendanceRecords = data.content;
    _lastAttendanceCount = data.content.length;
    if (state.totalStudentRegistered > 0) updateDashboardChart();

    renderAttendanceNowMerged();
}

// ============================================================
// REALTIME ATTENDANCE POLLING
// ============================================================
let _lastAttendanceCount      = -1;
let _teacherPollInterval      = null;
let _lastEventHash            = '';
let _lastEventHistoryHash     = '';
let _eventPollInterval        = null;

function _hashContent(arr) {
    return JSON.stringify(arr);
}

async function pollEventAttendanceSilently() {
    const liveToken = localStorage.getItem('teacher_token');
    try {
        // Poll event attendance
        const res1 = await fetch(`${BASE_URL}/teacher/get_event_attendance`, {
            headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + liveToken }
        });
        if (res1.ok) {
            const data1 = await res1.json();
            if (data1.ok && data1.content) {
                const hash1 = _hashContent(data1.content);
                if (hash1 !== _lastEventHash) {
                    _lastEventHash = hash1;
                    DOM.eventAttendanceBody.innerHTML = data1.content.length
                        ? data1.content.map(d => `
                        <tr>
                            <td>${d.student_id_number}</td>
                            <td>${d.student_name}</td>
                            <td>${d.student_program}</td>
                            <td>${d.student_year_level}</td>
                            <td>${formatDate(d.date)}</td>
                            <td>${formatTime(d.time)}</td>
                            <td>${d.event_name}</td>
                            <td>${d.status}</td>
                        </tr>`).join('')
                        : '<tr><td colspan="8" style="text-align:center;color:#888;">No records found.</td></tr>';
                    const dot1 = document.getElementById('liveDotEvent');
                    if (dot1) { dot1.classList.add('live-blink'); setTimeout(() => dot1.classList.remove('live-blink'), 2000); }
                }
            }
        }

        // Poll event attendance history
        const res2 = await fetch(`${BASE_URL}/teacher/get_event_attendance_history`, {
            headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + liveToken }
        });
        if (res2.ok) {
            const data2 = await res2.json();
            if (data2.ok && data2.content) {
                const hash2 = _hashContent(data2.content);
                if (hash2 !== _lastEventHistoryHash) {
                    _lastEventHistoryHash = hash2;
                    DOM.eventAttendanceHistoryBody.innerHTML = data2.content.length
                        ? data2.content.map(d => `
                        <tr>
                            <td>${d.student_id_number}</td>
                            <td>${d.student_name}</td>
                            <td>${d.student_program}</td>
                            <td>${d.student_year_level}</td>
                            <td>${formatDate(d.date)}</td>
                            <td>${formatTime(d.time)}</td>
                            <td>${d.event_name}</td>
                            <td>${d.status}</td>
                        </tr>`).join('')
                        : '<tr><td colspan="8" style="text-align:center;color:#888;">No records found.</td></tr>';
                    const dot2 = document.getElementById('liveDotEventHistory');
                    if (dot2) { dot2.classList.add('live-blink'); setTimeout(() => dot2.classList.remove('live-blink'), 2000); }
                }
            }
        }
    } catch (err) {
        console.warn('[EventPoll]', err);
    }
}

function startEventPolling() {
    if (_eventPollInterval) return;
    // Poll immediately then every 3s for near-realtime updates
    pollEventAttendanceSilently();
    _eventPollInterval = setInterval(pollEventAttendanceSilently, 3000);
}

async function pollAttendanceSilently() {
    try {
        const res  = await fetch(`${BASE_URL}/teacher/teacher_attendance_record`, {
            headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + TOKEN }
        });
        if (!res.ok) return;
        const data = await res.json();
        if (!data.ok || !data.content) return;

        // Only re-render if count changed
        if (_lastAttendanceCount !== -1 && data.content.length === _lastAttendanceCount) return;

        _lastAttendanceCount      = data.content.length;
        state.totalPresent        = data.content.length;
        state.allAttendanceRecords = data.content;
        if (state.totalStudentRegistered > 0) updateDashboardChart();

        renderAttendanceNowMerged();
        // Flash live indicator if it exists
        const dot = document.getElementById('teacherLiveDot');
        if (dot) {
            dot.classList.add('live-blink');
            setTimeout(() => dot.classList.remove('live-blink'), 2000);
        }
    } catch (err) {
        // Silent fail — don't show any popup during background poll
        console.warn('[Poll]', err);
    }
}

function startTeacherPolling() {
    if (_teacherPollInterval) return;
    _teacherPollInterval = setInterval(pollAttendanceSilently, 5000);
}

async function refreshAttendance() {
    await getStudentAttendanceRecords();
    Swal.fire({ toast: true, position: 'top-end', icon: 'success', title: 'Attendance list refreshed', showConfirmButton: false, timer: 1500, timerProgressBar: true });
}

// ============================================================
// EVENT ATTENDANCE
// ============================================================
// Populate a filter dropdown with unique values extracted from data
function populateEventFilterOptions(data, filterId, extractor, allLabel) {
    const el = document.getElementById(filterId);
    if (!el) return;
    const current = el.value;
    const unique = [...new Set(data.map(extractor).filter(Boolean))].sort();
    el.innerHTML = `<option value="">${allLabel}</option>` +
        unique.map(v => `<option value="${v}">${v}</option>`).join('');
    if (unique.includes(current)) el.value = current;
}

async function renderEventAttendanceRecord() {
    const data = await apiCall('/teacher/get_event_attendance', 'GET');
    if (!data) return;
    _lastEventHash = _hashContent(data.content);
    DOM.eventAttendanceBody.innerHTML = data.content.length
        ? data.content.map(d => `
        <tr>
            <td>${d.student_id_number}</td>
            <td>${d.student_name}</td>
            <td>${d.student_program}</td>
            <td>${d.student_year_level}</td>
            <td>${formatDate(d.date)}</td>
            <td>${formatTime(d.time)}</td>
            <td>${d.event_name}</td>
            <td>${d.status}</td>
        </tr>`).join('')
        : '<tr><td colspan="8" style="text-align:center;color:#888;">No records found.</td></tr>';

    // Populate filter dropdowns with unique values from data
    populateEventFilterOptions(data.content, 'eventAttendanceProgramFilter',   d => d.student_program, 'All Programs');
    populateEventFilterOptions(data.content, 'eventAttendanceEventNameFilter', d => d.event_name,      'All Events');
    populateEventFilterOptions(data.content, 'eventAttendanceYearLevelFilter', d => d.student_year_level, 'All Year Levels');
}

async function renderEventAttendanceHistoryRecord() {
    const data = await apiCall('/teacher/get_event_attendance_history', 'GET');
    if (!data) return;
    _lastEventHistoryHash = _hashContent(data.content);
    DOM.eventAttendanceHistoryBody.innerHTML = data.content.length
        ? data.content.map(d => `
        <tr>
            <td>${d.student_id_number}</td>
            <td>${d.student_name}</td>
            <td>${d.student_program}</td>
            <td>${d.student_year_level}</td>
            <td>${formatDate(d.date)}</td>
            <td>${formatTime(d.time)}</td>
            <td>${d.event_name}</td>
            <td>${d.status}</td>
        </tr>`).join('')
        : '<tr><td colspan="8" style="text-align:center;color:#888;">No records found.</td></tr>';

    // Populate filter dropdowns with unique values from data
    populateEventFilterOptions(data.content, 'eventAttendanceHistoryProgramFilter',   d => d.student_program,    'All Programs');
    populateEventFilterOptions(data.content, 'eventAttendanceHistoryEventNameFilter', d => d.event_name,         'All Events');
    populateEventFilterOptions(data.content, 'eventAttendanceHistoryYearLevelFilter', d => d.student_year_level, 'All Year Levels');
}

// ============================================================
// SEARCH & FILTERS
// ============================================================
function setupTableSearch(inputId, tableBodyId) {
    const input = document.getElementById(inputId);
    if (!input) return;
    input.addEventListener('input', function () {
        const term = this.value.toLowerCase();
        document.querySelectorAll(`#${tableBodyId} tr`).forEach(row => {
            row.style.display = row.textContent.toLowerCase().includes(term) ? '' : 'none';
        });
    });
}


// Renders Attendance Now using the subject class list as the fixed roster.
// Present = student has an attendance record today for the active subject.
// Absent  = student is in the class list but has NOT scanned today.
async function renderAttendanceNowMerged() {
    // Clear row data map so stale keys don't accumulate across re-renders
    _attendanceRowDataMap.clear();
    _attendanceRowDataCounter = 0;

    // Read active subject from the dropdowns (source of truth — already pre-selected on load)
    const subjectName = document.getElementById('courseFilter')?.value || state.activeSubjectName || '';
    const yearLevel   = document.getElementById('yearFilter')?.value   || state.activeYearLevel   || '';
    const dateFilter  = document.getElementById('attendanceNowDateFilter')?.value || '';

    // Resolve subject_id from allSubjects list using the dropdown value
    const matchedSubject = state.allSubjects?.find(s => s.subject_name === subjectName);
    const subjectId      = matchedSubject?.subject_id || state.activeSubjectId || null;

    // Fetch the class roster for the active subject (if one is set)
    let roster = [];
    if (subjectId) {
        const rosterData = await apiCall(`/teacher/subject-class-list/${subjectId}`, 'GET');
        roster = rosterData?.content || [];
    } else {
        // No active subject set — fall back to all registered students
        roster = state.allRegisteredStudents || [];
    }

    // Build attendance lookup: student_id_number → record
    // Filter by active subject name and selected date
    const presentMap = {};
    state.allAttendanceRecords.forEach(r => {
        const matchSubject = !subjectName || (r.subject || '').toLowerCase() === subjectName.toLowerCase();
        const matchDate    = !dateFilter  || (r.attendance_date ? r.attendance_date.split('T')[0] : '') === dateFilter;
        if (matchSubject && matchDate) {
            presentMap[r.student_id_number] = r;
        }
    });

    if (roster.length === 0 && Object.keys(presentMap).length === 0) {
        document.getElementById('attendanceBody').innerHTML =
            `<tr><td colspan="8" style="text-align:center;color:#888;padding:20px;">
                ${subjectId ? 'No students in this class list yet. Use “Manage Class” to add students.' : 'No active subject set. Please select a subject and year level above.'}
            </td></tr>`;
        return;
    }

    // If roster is empty but we have attendance records (fallback — no class list yet)
    const sourceList = roster.length > 0 ? roster : Object.values(presentMap).map(r => ({
        student_id_number:  r.student_id_number,
        student_firstname:  r.student_firstname,
        student_middlename: r.student_middlename,
        student_lastname:   r.student_lastname,
        student_year_level: r.year_level
    }));

    // Class time for late detection — "HH:MM" format
    const classTime = document.getElementById('classTimeInput')?.value || state.activeSubjectTime || '';

    const rows = sourceList.map(s => {
        const rec       = presentMap[s.student_id_number];
        const isPresent = !!rec;

        // Auto-detect Late: student scanned in but after the set class start time
        let recStatus = rec?.attendance_status || (isPresent ? 'Present' : 'Absent');
        if (isPresent && recStatus === 'Present' && classTime && rec.attendance_time) {
            // attendance_time may be "HH:MM:SS" or "HH:MM" — take first 5 chars for "HH:MM"
            const scanTime = rec.attendance_time.substring(0, 5);
            if (scanTime > classTime) recStatus = 'Late';
        }
        const rowData   = isPresent ? rec : {
            student_id_number:  s.student_id_number,
            student_firstname:  s.student_firstname,
            student_middlename: s.student_middlename,
            student_lastname:   s.student_lastname,
            subject:            subjectName || '—',
            year_level:         s.student_year_level,
            attendance_time:    null,
            attendance_date:    null
        };
        let rowClass = 'row-absent';
        if (recStatus === 'Present') rowClass = 'row-present';
        else if (recStatus === 'Late')    rowClass = 'row-late';
        else if (recStatus === 'Excused') rowClass = 'row-excused';
        return `<tr class="${rowClass}">${buildAttendanceRow(rowData, recStatus)}</tr>`;
    });

    document.getElementById('attendanceBody').innerHTML = rows.join('');
}


async function setAttendanceStatus(btn, rowKey, newStatus) {
    const d = _attendanceRowDataMap.get(rowKey);
    if (!d) { console.error('Row data not found for key:', rowKey); return; }

    // Find the row and all buttons in this row
    const row = btn.closest('tr');
    const allBtns = row.querySelectorAll('.att-action-btn');
    allBtns.forEach(b => b.disabled = true);

    try {
        if (d.attendance_id) {
            // Record exists — just update the status
            const res = await apiCall(`/teacher/update_attendance_status/${d.attendance_id}`, 'PUT', { status: newStatus });
            if (!res || !res.ok) throw new Error(res?.message || 'Failed to update status.');
        } else {
            // No record yet (was absent) — insert a new manual record
            const res = await apiCall('/teacher/insert_manual_status', 'POST', {
                student_id:         d.student_id,
                student_id_number:  d.student_id_number,
                student_firstname:  d.student_firstname,
                student_middlename: d.student_middlename,
                student_lastname:   d.student_lastname,
                student_program:    d.student_program,
                student_year_level: d.year_level,
                subject:            d.subject,
                status:             newStatus
            });
            if (!res || !res.ok) throw new Error(res?.message || 'Failed to insert record.');
            // Store the new attendance_id so future clicks update instead of insert
            d.attendance_id = res.insertId;
        }

        // Update row class
        row.classList.remove('row-present', 'row-late', 'row-absent', 'row-excused');
        if (newStatus === 'Present')      row.classList.add('row-present');
        else if (newStatus === 'Late')    row.classList.add('row-late');
        else if (newStatus === 'Excused') row.classList.add('row-excused');
        else                              row.classList.add('row-absent');

        // Update status badge
        const statusCell = row.cells[6];
        if (newStatus === 'Present') {
            statusCell.innerHTML = `<span style="display:inline-flex;align-items:center;gap:5px;background:#d4f4e7;color:#1a6b3a;padding:3px 10px;border-radius:20px;font-size:0.78rem;font-weight:700;"><span style="width:8px;height:8px;border-radius:50%;background:#22c55e;display:inline-block;"></span>Present</span>`;
        } else if (newStatus === 'Late') {
            statusCell.innerHTML = `<span style="display:inline-flex;align-items:center;gap:5px;background:#ede9fe;color:#5b21b6;padding:3px 10px;border-radius:20px;font-size:0.78rem;font-weight:700;"><span style="width:8px;height:8px;border-radius:50%;background:#7c3aed;display:inline-block;"></span>Late</span>`;
        } else if (newStatus === 'Excused') {
            statusCell.innerHTML = `<span style="display:inline-flex;align-items:center;gap:5px;background:#fef3c7;color:#92400e;padding:3px 10px;border-radius:20px;font-size:0.78rem;font-weight:700;"><span style="width:8px;height:8px;border-radius:50%;background:#f59e0b;display:inline-block;"></span>Excused</span>`;
        } else {
            statusCell.innerHTML = `<span style="display:inline-flex;align-items:center;gap:5px;background:#fde8e8;color:#b91c1c;padding:3px 10px;border-radius:20px;font-size:0.78rem;font-weight:700;"><span style="width:8px;height:8px;border-radius:50%;background:#ef4444;display:inline-block;"></span>Absent</span>`;
        }

        // Update active button highlight
        allBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        // Update map with new attendance_id so future clicks use PUT not POST
        _attendanceRowDataMap.set(rowKey, d);

        // Update local state so polling doesn't override the change
        const idx = state.allAttendanceRecords.findIndex(r => r.student_id_number === d.student_id_number);
        if (idx !== -1) {
            state.allAttendanceRecords[idx].attendance_status = newStatus;
            if (d.attendance_id) state.allAttendanceRecords[idx].attendance_id = d.attendance_id;
        } else if (newStatus !== 'Absent') {
            // Newly inserted record — push to state so polling knows about it
            state.allAttendanceRecords.push({
                attendance_id:      d.attendance_id,
                student_id_number:  d.student_id_number,
                student_firstname:  d.student_firstname,
                student_middlename: d.student_middlename,
                student_lastname:   d.student_lastname,
                student_program:    d.student_program,
                year_level:         d.year_level,
                subject:            d.subject,
                attendance_time:    null,
                attendance_date:    new Date().toISOString().split('T')[0],
                attendance_status:  newStatus
            });
        }

        Swal.fire({ icon: 'success', title: `Marked ${newStatus}`, timer: 1200, showConfirmButton: false, toast: true, position: 'top-end' });

    } catch (err) {
        Swal.fire({ icon: 'error', title: 'Error', text: err.message });
    } finally {
        allBtns.forEach(b => b.disabled = false);
    }
}


function studentRegisteredDropdownFilter(filterId, columnIndex) {
    document.getElementById(filterId).addEventListener('change', function () {
        const term = this.value.toLowerCase();
        let hasMatch = false;
        document.querySelectorAll('#studentsBody tr').forEach(row => {
            const isMatch = !term || row.cells[columnIndex].textContent.trim().toLowerCase() === term;
            row.style.display = isMatch ? '' : 'none';
            if (isMatch) hasMatch = true;
        });
        if (!hasMatch && term) {
            Swal.fire({ toast: true, position: 'top-end', icon: 'info', title: 'No records found for this filter', showConfirmButton: false, timer: 2000 });
        }
    });
}


// Event attendance filters — shared helper
function filterTableRows(tbody, term) {
    const lower = term.toLowerCase();
    Array.from(tbody.getElementsByTagName('tr')).forEach(row => {
        row.style.display = row.textContent.toLowerCase().includes(lower) ? '' : 'none';
    });
}

// Multi-filter for event attendance tables
function applyEventFilters(tbody, filters) {
    Array.from(tbody.getElementsByTagName('tr')).forEach(row => {
        const match = filters.every(({ value, colIndex }) => {
            if (!value) return true;
            const cell = row.cells[colIndex];
            return cell && cell.textContent.trim().toLowerCase() === value.toLowerCase();
        });
        row.style.display = match ? '' : 'none';
    });
}

function getEventFilters() {
    return [
        { value: DOM.eventAttendanceYearLevelFilter.value,   colIndex: 3 },
        { value: DOM.eventAttendanceProgramFilter.value,     colIndex: 2 },
        { value: DOM.eventAttendanceEventNameFilter.value,   colIndex: 6 },
        { value: DOM.eventAttendanceStatusFilter.value,      colIndex: 7 },
    ];
}

function getEventHistoryFilters() {
    return [
        { value: DOM.eventAttendanceHistoryYearLevelFilter.value,   colIndex: 3 },
        { value: DOM.eventAttendanceHistoryProgramFilter.value,     colIndex: 2 },
        { value: DOM.eventAttendanceHistoryEventNameFilter.value,   colIndex: 6 },
        { value: DOM.eventAttendanceHistoryStatusFilter.value,      colIndex: 7 },
    ];
}

DOM.searchFilterEvent.addEventListener('input', function () {
    filterTableRows(DOM.eventAttendanceBody, this.value);
});

DOM.searchFilterEventHistory.addEventListener('input', function () {
    filterTableRows(DOM.eventAttendanceHistoryBody, this.value);
});

DOM.eventAttendanceYearLevelFilter.addEventListener('change',        () => applyEventFilters(DOM.eventAttendanceBody,        getEventFilters()));
DOM.eventAttendanceProgramFilter.addEventListener('change',          () => applyEventFilters(DOM.eventAttendanceBody,        getEventFilters()));
DOM.eventAttendanceEventNameFilter.addEventListener('change',        () => applyEventFilters(DOM.eventAttendanceBody,        getEventFilters()));
DOM.eventAttendanceStatusFilter.addEventListener('change',           () => applyEventFilters(DOM.eventAttendanceBody,        getEventFilters()));

DOM.eventAttendanceHistoryYearLevelFilter.addEventListener('change', () => applyEventFilters(DOM.eventAttendanceHistoryBody, getEventHistoryFilters()));
DOM.eventAttendanceHistoryProgramFilter.addEventListener('change',   () => applyEventFilters(DOM.eventAttendanceHistoryBody, getEventHistoryFilters()));
DOM.eventAttendanceHistoryEventNameFilter.addEventListener('change', () => applyEventFilters(DOM.eventAttendanceHistoryBody, getEventHistoryFilters()));
DOM.eventAttendanceHistoryStatusFilter.addEventListener('change',    () => applyEventFilters(DOM.eventAttendanceHistoryBody, getEventHistoryFilters()));

// ============================================================
// STUDENTS
// ============================================================
async function loadStudentsRegistered() {
    Swal.fire({ title: 'Loading students...', allowOutsideClick: false, didOpen: () => Swal.showLoading() });
    const data = await apiCall('/teacher/get_student_registered');
    Swal.close();
    if (!data || !data.content) return;

    state.totalStudentRegistered = data.content.length;
    state.allRegisteredStudents  = data.content;  // store for Present/Absent merge
    document.getElementById('totalStudents').textContent = state.totalStudentRegistered;
    updateDashboardChart();

    document.getElementById('studentsBody').innerHTML = data.content.map(s => {
        const mid  = s.student_middlename || '';
        const dbId = s.student_id;
        return `
            <tr>
                <td>${s.student_id_number}</td>
                <td>${s.student_firstname}</td>
                <td>${mid || '-'}</td>
                <td>${s.student_lastname}</td>
                <td>${s.student_program}</td>
                <td>${s.student_year_level}</td>
                <td>${s.date_created.split('T')[0]}</td>
                <td>
                    <div class="action-btns">
                        <button class="edit-btn" data-tooltip="Edit this student's record" onclick="editStudent('${dbId}','${s.student_id_number}','${s.student_firstname}','${mid}','${s.student_lastname}','${s.student_program}','${s.student_year_level}','${s.date_created.split('T')[0]}')">Edit</button>
                        <button class="delete-btn-student-registered" onclick="deleteStudent('${dbId}')">Delete</button>
                    </div>
                </td>
            </tr>
        `;
    }).join('');
}

function editStudent(id, student_id_number, student_firstname, student_middlename, student_lastname, student_program, student_year_level) {
    openRecordModal(id, student_id_number, student_firstname, student_middlename, student_lastname, student_program, student_year_level);
}

function deleteStudent(student_id) {
    Swal.fire({
        title: 'Delete Student?',
        text: `Are you sure you want to delete ID: ${student_id}? This cannot be undone.`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Yes, delete it!'
    }).then(async result => {
        if (!result.isConfirmed) return;
        Swal.fire({ title: 'Deleting...', allowOutsideClick: false, didOpen: () => Swal.showLoading() });
        const res = await apiCall(`/teacher/delete_student_record/${student_id}`, 'DELETE');
        if (!res) return;
        Swal.fire('Deleted!', 'The student has been removed.', 'success');
        loadStudentsRegistered();
    });
}

// ============================================================
// REGISTRATION — SEARCH & ADD
// ============================================================
let _selectedStudent = null;
let _searchDebounceTimer = null;

function searchStudentDebounced() {
    clearTimeout(_searchDebounceTimer);
    _searchDebounceTimer = setTimeout(runStudentSearch, 350);
}

async function runStudentSearch() {
    const q = document.getElementById('studentSearchInput').value.trim();
    const resultsBox = document.getElementById('studentSearchResults');

    if (q.length < 2) {
        resultsBox.style.display = 'none';
        resultsBox.innerHTML = '';
        return;
    }

    resultsBox.style.display = 'block';
    resultsBox.innerHTML = '<div style="padding:12px; color:#888; text-align:center;">Searching...</div>';

    try {
        const data = await apiCall(`/teacher/search_students?q=${encodeURIComponent(q)}`, 'GET');

        if (!data || !data.content || data.content.length === 0) {
            resultsBox.innerHTML = '<div style="padding:12px; color:#888; text-align:center;">No students found.</div>';
            return;
        }

        resultsBox.innerHTML = data.content.map(s => `
            <div onclick="selectStudent(${JSON.stringify(s).replace(/"/g, '&quot;')})"
                style="padding:12px 16px; cursor:pointer; border-bottom:1px solid #f0f0f0; transition:background 0.15s;"
                onmouseover="this.style.background='#f0f7f7'" onmouseout="this.style.background=''"
            >
                <div style="font-weight:600; color:#1a4545;">${s.student_firstname} ${s.student_middlename ? s.student_middlename + '.' : ''} ${s.student_lastname}</div>
                <div style="font-size:0.82rem; color:#666;">${s.student_id_number} · ${s.student_program} · ${s.student_year_level}</div>
                <div style="font-size:0.8rem; color:#999;">${s.student_email}</div>
            </div>
        `).join('');
    } catch (err) {
        resultsBox.innerHTML = '<div style="padding:12px; color:#c00; text-align:center;">Error loading results.</div>';
    }
}

function selectStudent(student) {
    _selectedStudent = student;

    // Hide search results, show preview
    document.getElementById('studentSearchResults').style.display = 'none';
    document.getElementById('studentSearchInput').value = '';

    const preview = document.getElementById('selectedStudentPreview');
    preview.style.display = 'block';
    document.getElementById('previewName').textContent =
        `${student.student_firstname} ${student.student_middlename ? student.student_middlename + '.' : ''} ${student.student_lastname}`;
    document.getElementById('previewId').textContent   = `ID: ${student.student_id_number}`;
    document.getElementById('previewProgram').textContent = `${student.student_program} · ${student.student_year_level}`;
    document.getElementById('previewEmail').textContent = student.student_email;

    // Enable Add button
    const btn = document.getElementById('confirmAddStudentBtn');
    btn.disabled = false;
    btn.style.opacity = '1';
    btn.style.cursor  = 'pointer';
}

function clearSelectedStudent() {
    _selectedStudent = null;
    document.getElementById('selectedStudentPreview').style.display = 'none';
    const btn = document.getElementById('confirmAddStudentBtn');
    btn.disabled = true;
    btn.style.opacity = '0.5';
    btn.style.cursor  = 'not-allowed';
}

async function confirmAddStudent() {
    if (!_selectedStudent) return;

    const s = _selectedStudent;
    const studentData = {
        student_firstname:       s.student_firstname,
        student_middlename:      s.student_middlename,
        student_lastname:        s.student_lastname,
        student_email:           s.student_email,
        student_id_number:       s.student_id_number,
        student_program:         s.student_program,
        student_year_level:      s.student_year_level,
        student_guardian_number: s.student_guardian_number || ''
    };

    Swal.fire({ title: 'Adding student...', allowOutsideClick: false, didOpen: () => Swal.showLoading() });

    try {
        const res = await fetch(`${BASE_URL}/teacher/add_student`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + TOKEN },
            body: JSON.stringify(studentData)
        });
        const data = await res.json();
        Swal.close();

        if (res.ok && data.ok) {
            await Swal.fire({ icon: 'success', title: 'Success', text: data.message, timer: 1800, showConfirmButton: false });
            closeAddStudentModal();
            loadStudentsRegistered();
        } else {
            Swal.fire({ icon: 'error', title: 'Failed', text: data.message || 'Could not add student.' });
        }
    } catch (err) {
        Swal.close();
        Swal.fire({ icon: 'error', title: 'Network Error', text: err.message || 'Please try again.' });
    }
}

function openAddStudentModal() {
    document.getElementById('addStudentModal').style.display = 'flex';
    clearSelectedStudent();
    document.getElementById('studentSearchInput').value = '';
    document.getElementById('studentSearchResults').style.display = 'none';
}
function closeAddStudentModal() {
    document.getElementById('addStudentModal').style.display = 'none';
    clearSelectedStudent();
}

// ============================================================
// RECORD MODAL
// ============================================================
function openRecordModal(id, student_id_number, student_firstname, student_middlename, student_lastname, student_program, student_year_level) {
    document.getElementById('recordModal').style.display  = 'flex';
    document.getElementById('id').value                   = id;
    document.getElementById('id_number').value            = student_id_number;
    document.getElementById('firstname').value            = student_firstname;
    document.getElementById('mi').value                   = student_middlename;
    document.getElementById('lastname').value             = student_lastname;
    document.getElementById('editProgram').value          = student_program;
    document.getElementById('year_level').value           = student_year_level;
}

function closeRecordModal() {
    document.getElementById('recordModal').style.display = 'none';
}

window.onclick = function (event) {
    const modal = document.getElementById('recordModal');
    if (event.target === modal) modal.style.display = 'none';
};

document.getElementById('recordForm').addEventListener('submit', async function (e) {
    e.preventDefault();

    const payload = {
        student_id:        document.getElementById('id').value,
        student_id_number: document.getElementById('id_number').value.trim(),
        firstname:         document.getElementById('firstname').value.trim(),
        mi:                document.getElementById('mi').value.trim(),
        lastname:          document.getElementById('lastname').value.trim(),
        program:           document.getElementById('editProgram').value,
        year_level:        document.getElementById('year_level').value
    };

    Swal.fire({ title: 'Saving changes...', allowOutsideClick: false, didOpen: () => Swal.showLoading() });
    const res = await apiCall('/teacher/update_student_record', 'PUT', payload);
    if (!res) return;

    Swal.fire('Updated!', 'Record has been updated successfully.', 'success');
    document.getElementById('recordForm').reset();
    closeRecordModal();
    loadStudentsRegistered();
});

// ============================================================
// MAP / LOCATION
// ============================================================
function initMap(lat, lng) {
    if (map) { map.remove(); map = null; marker = null; circle = null; }

    // Fix Leaflet default icon broken image paths (common webpack/CDN issue)
    delete L.Icon.Default.prototype._getIconUrl;
    L.Icon.Default.mergeOptions({
        iconUrl:       'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
        shadowUrl:     'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    });

    map = L.map('map', { zoomControl: true }).setView([lat, lng], 18);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap',
        maxZoom: 19
    }).addTo(map);

    marker = L.marker([lat, lng], { draggable: true }).addTo(map);

    circle = L.circle([lat, lng], {
        color: '#5a8a7a', fillColor: '#5a8a7a', fillOpacity: 0.2,
        radius: parseInt(DOM.radiusSlider.value)
    }).addTo(map);

    marker.on('drag', () => {
        const pos = marker.getLatLng();
        circle.setLatLng(pos);
    });

    // Fire multiple invalidateSize to handle CSS transitions and hidden containers
    setTimeout(() => map.invalidateSize(), 100);
    setTimeout(() => map.invalidateSize(), 300);
    setTimeout(() => map.invalidateSize(), 600);
}

function loadLocation() {
    Swal.fire({ title: 'Acquiring location...', allowOutsideClick: false, didOpen: () => Swal.showLoading() });
    navigator.geolocation.getCurrentPosition(position => {
        Swal.close();
        const { latitude: lat, longitude: lng } = position.coords;

        // Always wait for the section to be visible before initializing
        setTimeout(() => {
            initMap(lat, lng);
            // Extra invalidateSize after a short delay to fix tile rendering
            setTimeout(() => { if (map) map.invalidateSize(); }, 300);
        }, 150);
    }, err => {
        Swal.close();
        Swal.fire({ icon: 'error', title: 'Location Error', text: err.message || 'Unable to retrieve location.' });
    }, { enableHighAccuracy: true, timeout: 10000 });
}

async function setLocation() {
    if (!marker) return Swal.fire({ icon: 'warning', title: 'No Location', text: 'Load your location first.' });

    const radius = parseInt(DOM.radiusValueDisplay.textContent);
    const { lat, lng } = marker.getLatLng();
    const payload = { latitude: lat, longitude: lng, radius };

    const confirm = await Swal.fire({
        title: 'Set this location?',
        text: `Lat: ${lat.toFixed(6)}, Lng: ${lng.toFixed(6)} — Radius: ${radius}m`,
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Yes, set it',
        confirmButtonColor: '#5a8a7a'
    });

    if (!confirm.isConfirmed) return;

    Swal.fire({ title: 'Saving location...', allowOutsideClick: false, didOpen: () => Swal.showLoading() });

    const res = await apiCall('/teacher/set_location', 'POST', payload);
    if (!res) return;

    Swal.fire({ icon: 'success', title: 'Location Saved!', text: `Radius set to ${radius} meters.`, timer: 2000, showConfirmButton: false });
}

function setDefaultLocation() {
    if (!marker) return Swal.fire({ icon: 'warning', title: 'No Location', text: 'Please wait for your location to load first.' });

    Swal.fire({ title: 'Getting current position...', allowOutsideClick: false, didOpen: () => Swal.showLoading() });
    navigator.geolocation.getCurrentPosition(position => {
        Swal.close();
        const { latitude: lat, longitude: lng } = position.coords;
        marker.setLatLng([lat, lng]);
        circle.setLatLng([lat, lng]);
        map.setView([lat, lng], 18);
        Swal.fire({ icon: 'success', title: 'Default Location Set', text: 'Marker reset to your current GPS location.', timer: 1500, showConfirmButton: false });
    }, err => {
        Swal.close();
        Swal.fire({ icon: 'error', title: 'Location Error', text: err.message || 'Unable to retrieve current location.' });
    }, { enableHighAccuracy: true });
}

DOM.radiusSlider.addEventListener('input', function () {
    DOM.radiusValueDisplay.textContent = this.value;
    if (circle) circle.setRadius(parseInt(this.value));
});

// ============================================================
// LOCATION SEARCH (Nominatim / OpenStreetMap)
// ============================================================
let searchDebounceTimer = null;

const locationSearchInput   = document.getElementById('locationSearchInput');
const locationSearchResults = document.getElementById('locationSearchResults');

locationSearchInput.addEventListener('input', function () {
    const query = this.value.trim();
    clearTimeout(searchDebounceTimer);
    locationSearchResults.innerHTML = '';
    locationSearchResults.style.display = 'none';

    if (query.length < 3) return;

    searchDebounceTimer = setTimeout(async () => {
        try {
            const res  = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5`, {
                headers: { 'Accept-Language': 'en' }
            });
            const data = await res.json();

            if (!data.length) {
                locationSearchResults.innerHTML = '<li class="location-search-no-result">No results found</li>';
                locationSearchResults.style.display = 'block';
                return;
            }

            locationSearchResults.innerHTML = data.map((place, i) => `
                <li class="location-search-item" data-lat="${place.lat}" data-lng="${place.lon}" data-index="${i}">
                    <svg viewBox="0 0 24 24" fill="currentColor" class="result-pin-icon">
                        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                    </svg>
                    <span>${place.display_name}</span>
                </li>
            `).join('');
            locationSearchResults.style.display = 'block';

            locationSearchResults.querySelectorAll('.location-search-item').forEach(item => {
                item.addEventListener('click', function () {
                    const lat = parseFloat(this.dataset.lat);
                    const lng = parseFloat(this.dataset.lng);

                    if (map && marker && circle) {
                        marker.setLatLng([lat, lng]);
                        circle.setLatLng([lat, lng]);
                        map.setView([lat, lng], 18);
                    } else {
                        // Map not initialized yet — initialize it at searched location
                        initMap(lat, lng);
                    }

                    locationSearchInput.value           = this.querySelector('span').textContent;
                    locationSearchResults.style.display = 'none';
                });
            });

        } catch (err) {
            console.error('Location search error:', err);
        }
    }, 400);
});

// Close dropdown when clicking outside
document.addEventListener('click', function (e) {
    if (!locationSearchInput.contains(e.target) && !locationSearchResults.contains(e.target)) {
        locationSearchResults.style.display = 'none';
    }
});

// ============================================================
// ACADEMIC SETUP
// ============================================================
async function subjectAndYearLevelSetter() {
    const subject   = document.getElementById('courseFilter').value;
    const yearLevel = document.getElementById('yearFilter').value;

    const classTime = document.getElementById('classTimeInput')?.value || '';

    if (!subject || !yearLevel) {
        return Swal.fire({ icon: 'warning', title: 'Incomplete', text: 'Please select both a subject and a year level before setting.' });
    }

    const result = await Swal.fire({
        title: 'Update Settings?',
        text: 'This will update the active subject and year level.',
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Yes, update'
    });

    if (result.isConfirmed) {
        Swal.fire({ title: 'Updating settings...', allowOutsideClick: false, didOpen: () => Swal.showLoading() });
        const res = await apiCall('/teacher/teacher_subject_and_year_level_setter', 'PUT', { subject, yearLevel, classTime });
        if (res) {
            // Find subject_id from allSubjects list
            const matched = state.allSubjects?.find(s => s.subject_name === subject);
            state.activeSubjectId   = matched?.subject_id || null;
            state.activeSubjectName = subject;
            state.activeYearLevel   = yearLevel;
            state.activeSubjectTime = classTime;
            renderActiveSubject(subject, yearLevel, classTime);
            renderAttendanceNowMerged();
            Swal.fire('Updated!', res.message, 'success');
        }
    }
}

// Load and display the currently active subject + year level on page load
async function loadActiveSubject() {
    const data = await apiCall('/teacher/get_active_subject', 'GET');
    if (!data || !data.content) return;
    const { subject_name_set, year_level_set, subject_id, class_time_set } = data.content;

    // Store in state for use by renderAttendanceNowMerged
    state.activeSubjectId   = subject_id       || null;
    state.activeSubjectName = subject_name_set || '';
    state.activeYearLevel   = year_level_set   || '';
    state.activeSubjectTime = class_time_set   || '';

    // Pre-select dropdowns to match the currently active values
    const courseFilter  = document.getElementById('courseFilter');
    const yearFilter    = document.getElementById('yearFilter');
    const classTimeInput = document.getElementById('classTimeInput');
    if (courseFilter   && subject_name_set) courseFilter.value   = subject_name_set;
    if (yearFilter     && year_level_set)   yearFilter.value     = year_level_set;
    if (classTimeInput && class_time_set)   classTimeInput.value = class_time_set;

    renderActiveSubject(subject_name_set, year_level_set, class_time_set);
    renderAttendanceNowMerged();
}

function renderActiveSubject(subject, yearLevel, classTime) {
    const el = document.getElementById('activeSubjectDisplay');
    if (!el) return;
    if (subject && yearLevel) {
        const timePart = classTime ? ` @ ${classTime}` : '';
        el.textContent = `✓ ${subject} — ${yearLevel}${timePart}`;
        el.style.background = '#c8ece5';
        el.style.color = '#1a5c4f';
    } else if (subject) {
        el.textContent = `✓ ${subject}`;
        el.style.background = '#c8ece5';
        el.style.color = '#1a5c4f';
    } else {
        el.textContent = '⚠ Not set';
        el.style.background = '#fdecea';
        el.style.color = '#b94a3a';
    }
}

async function renderSubjects() {
    const data = await apiCall('/teacher/get_subjects', 'GET');
    if (!data) return;

    // Store subjects in state so renderAttendanceNowMerged can look up subject_id by name
    state.allSubjects = data.content;

    document.getElementById('programsList').innerHTML = data.content.map(d => `
        <div class="program-card">
            <div class="program-name">${d.subject_name}</div>
            <div style="display:flex;gap:6px;align-items:center;">
                <button class="manage-class-btn" data-tooltip="Manage students in this subject" onclick="openManageClassModal(${d.subject_id}, '${d.subject_name.replace(/'/g,"\\'")}')">
                    <svg viewBox="0 0 24 24" width="13" height="13" fill="currentColor"><path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/></svg>
                    Manage Class
                </button>
                <button class="delete-btn" data-tooltip="Delete this subject" onclick="deleteProgram(${d.subject_id}, '${d.subject_name.replace(/'/g,"\\'")}')">
                    <svg viewBox="0 0 24 24"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/></svg>
                </button>
            </div>
        </div>
    `).join('');

    const optionsHtml = data.content.map(d => `<option value="${d.subject_name}">${d.subject_name}</option>`).join('');
    document.getElementById('courseFilter').innerHTML                   = `<option value="">Select Subject</option>` + optionsHtml;
}

async function addSubject() {
    const input = document.getElementById('programNameInput');
    const programName = input.value.trim();
    if (!programName) return Swal.fire('Input Required', 'Please enter a program name.', 'warning');

    Swal.fire({ title: 'Processing...', allowOutsideClick: false, didOpen: () => Swal.showLoading() });
    const res = await apiCall('/teacher/programs/add', 'POST', { program_name: programName });
    if (res && res.ok) {
        renderSubjects();
        closeAddModal();
        Swal.fire({ toast: true, position: 'top-end', icon: 'success', title: 'Subject Added', showConfirmButton: false, timer: 1500 });
    }
    input.value = '';
}

function deleteProgram(program_id, program_name) {
    Swal.fire({
        title: 'Delete Subject?',
        text: `Are you sure you want to delete "${program_name}"?`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it'
    }).then(async result => {
        if (!result.isConfirmed) return;
        Swal.fire({ title: 'Deleting...', allowOutsideClick: false, didOpen: () => Swal.showLoading() });
        const res = await apiCall(`/teacher/delete_program/${program_id}`, 'DELETE');
        if (!res) return;
        Swal.fire('Deleted', 'Subject has been removed.', 'success');
        renderSubjects();
    });
}

// ============================================================
// MANAGE CLASS MODAL
// ============================================================
let _manageClassSubjectId   = null;
let _manageClassSubjectName = '';

async function openManageClassModal(subjectId, subjectName) {
    _manageClassSubjectId   = subjectId;
    _manageClassSubjectName = subjectName;

    const modal = document.getElementById('manageClassModal');
    document.getElementById('manageClassTitle').textContent = `Manage Class — ${subjectName}`;
    modal.style.display = 'flex';

    await refreshManageClassLists();
}

function closeManageClassModal() {
    document.getElementById('manageClassModal').style.display = 'none';
    _manageClassSubjectId   = null;
    _manageClassSubjectName = '';
}

async function refreshManageClassLists() {
    const [rosterData, allData] = await Promise.all([
        apiCall(`/teacher/subject-class-list/${_manageClassSubjectId}`, 'GET'),
        apiCall('/teacher/get_student_registered', 'GET')
    ]);

    const roster     = rosterData?.content  || [];
    const allStudents = allData?.content    || [];
    const rosterIds  = new Set(roster.map(r => r.student_id));

    // Enrolled list
    const enrolledEl = document.getElementById('manageClassEnrolled');
    enrolledEl.innerHTML = roster.length
        ? roster.map(s => {
            const mid  = s.student_middlename ? s.student_middlename.charAt(0) + '. ' : '';
            const name = `${s.student_firstname} ${mid}${s.student_lastname}`;
            return `
            <div class="mcl-row" id="mcl-enrolled-${s.id}">
                <div class="mcl-info">
                    <span class="mcl-name">${name}</span>
                    <span class="mcl-meta">${s.student_id_number} · ${s.student_year_level}</span>
                </div>
                <button class="mcl-remove-btn" onclick="removeFromClassList(${s.id})">
                    <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>
                    Remove
                </button>
            </div>`;
        }).join('')
        : `<div style="color:#999;font-size:0.82rem;padding:12px 0;text-align:center;">No students enrolled yet.</div>`;

    // Available list (not yet in roster)
    const availableEl = document.getElementById('manageClassAvailable');
    const available   = allStudents.filter(s => !rosterIds.has(s.student_id));
    availableEl.innerHTML = available.length
        ? available.map(s => {
            const mid  = s.student_middlename ? s.student_middlename.charAt(0) + '. ' : '';
            const name = `${s.student_firstname} ${mid}${s.student_lastname}`;
            return `
            <div class="mcl-row" id="mcl-available-${s.student_id}">
                <div class="mcl-info">
                    <span class="mcl-name">${name}</span>
                    <span class="mcl-meta">${s.student_id_number} · ${s.student_year_level}</span>
                </div>
                <button class="mcl-add-btn" onclick="addToClassList(${s.student_id})">
                    <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg>
                    Add
                </button>
            </div>`;
        }).join('')
        : `<div style="color:#999;font-size:0.82rem;padding:12px 0;text-align:center;">All registered students are enrolled.</div>`;

    // Live search for available students
    const searchEl = document.getElementById('manageClassSearch');
    if (searchEl) {
        searchEl.oninput = function () {
            const term = this.value.toLowerCase();
            document.querySelectorAll('#manageClassAvailable .mcl-row').forEach(row => {
                row.style.display = row.textContent.toLowerCase().includes(term) ? '' : 'none';
            });
        };
    }
}

async function addToClassList(studentId) {
    const res = await apiCall('/teacher/subject-class-list/add', 'POST', {
        subjectId: _manageClassSubjectId,
        studentId
    });
    if (res?.ok) {
        Swal.fire({ toast: true, position: 'top-end', icon: 'success', title: 'Student added!', showConfirmButton: false, timer: 1200 });
        await refreshManageClassLists();
    }
}

async function removeFromClassList(id) {
    const res = await apiCall(`/teacher/subject-class-list/remove/${id}`, 'DELETE');
    if (res?.ok) {
        Swal.fire({ toast: true, position: 'top-end', icon: 'info', title: 'Student removed.', showConfirmButton: false, timer: 1200 });
        await refreshManageClassLists();
    }
}

async function renderYearLevel() {
    const data = await apiCall('/teacher/get_year_levels', 'GET');
    if (!data) return;

    const optionsHtml = data.content.map(y => `<option value="${y.year_level_name}">${y.year_level_name}</option>`).join('');
    document.getElementById('yearFilter').innerHTML                  = `<option value="">Select Year Level</option>` + optionsHtml;
    document.getElementById('recordYearFilter').innerHTML            = `<option value="">Select Year Level</option>` + optionsHtml;
    document.getElementById('year_level').innerHTML                  = `<option value="">Select Year</option>` + optionsHtml;
}

async function renderPrograms() {
    const data = await apiCall('/teacher/get_programs', 'GET');
    if (!data) return;
    const optionsHtml = `<option value="">Select Program</option>` +
        data.content.map(d => `<option value="${d.program_name}">${d.program_name}</option>`).join('');
    const editProgram = document.getElementById('editProgram');
    if (editProgram) editProgram.innerHTML = optionsHtml;
}

function openAddModal()  { document.getElementById('addModal').classList.add('active'); document.getElementById('programNameInput').focus(); }
function closeAddModal() { document.getElementById('addModal').classList.remove('active'); }


// ============================================================
// TEACHER PROFILE & SETTINGS
// ============================================================
async function getTeacherDataToServer() {
    const data = await apiCall('/teacher/get_teacher_data', 'GET');
    if (!data) return;
    const teacher = data.content[0];
    document.getElementById('sideBarTeacherName').textContent     = teacher.teacher_name;
    document.querySelector('.profile-name').textContent           = teacher.teacher_name;
    document.querySelector('.profile-email').textContent          = teacher.teacher_email;
    document.getElementById('accountInformationName').textContent = teacher.teacher_name;

    // Set profile picture if available
    if (teacher.teacher_profile_picture) {
        const url = `${BASE_URL}/uploads/profile_pictures/${teacher.teacher_profile_picture}`;
        setTeacherAvatar(url);
    }
}

function setTeacherAvatar(url) {
    // Sidebar avatar
    const sidebarAvatar = document.getElementById('sidebarAvatar');
    if (sidebarAvatar) {
        sidebarAvatar.innerHTML = `<img src="${url}" style="width:100%;height:100%;object-fit:cover;border-radius:50%;" onerror="this.parentElement.innerHTML='<svg viewBox=\\'0 0 24 24\\'><path d=\\'M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z\\'/></svg>'" alt="Profile">`;
    }
    // Settings avatar
    const teacherAvatar = document.getElementById('teacherAvatar');
    if (teacherAvatar) {
        teacherAvatar.innerHTML = `<img src="${url}" style="width:100%;height:100%;object-fit:cover;border-radius:50%;" onerror="this.parentElement.innerHTML='<svg viewBox=\\'0 0 24 24\\'><path d=\\'M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z\\'/></svg>'" alt="Profile">`;
    }
}

// Show a once-per-day reminder to set a subject before taking attendance
async function checkSubjectReminder() {
    const today     = new Date().toISOString().split('T')[0];
    const lastShown = localStorage.getItem('subject_reminder_last_shown');

    // Already reminded today — skip
    if (lastShown === today) return;

    const data = await apiCall('/teacher/get_teacher_data', 'GET');
    if (!data) return;

    const subject = data.content[0]?.teacher_current_subject;

    Swal.fire({
        icon: 'info',
        title: '📋 Set Today\'s Subject',
        html: subject && subject.trim() !== ''
            ? `Current subject is set to <strong>${subject}</strong>.<br>Make sure this is correct for today's attendance.`
            : `No subject is set yet for today.<br><br>Use the <strong>Subject</strong> and <strong>Year Level</strong> dropdowns above, then press <strong>Set</strong>.`,
        confirmButtonText: 'Got it',
        confirmButtonColor: '#3d6b6b'
    });

    localStorage.setItem('subject_reminder_last_shown', today);
}

async function updatePassword() {
    const currentPassword = document.getElementById('currentPassword').value;
    const newPassword     = document.getElementById('newPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    if (!currentPassword || !newPassword || !confirmPassword)
        return Swal.fire({ icon: 'warning', title: 'Missing Fields', text: 'Please fill in all password fields.' });

    if (newPassword !== confirmPassword)
        return Swal.fire({ icon: 'error', title: 'Password Mismatch', text: 'The new passwords do not match.' });

    if (newPassword.length < 6)
        return Swal.fire({ icon: 'warning', title: 'Weak Password', text: 'New password must be at least 6 characters long.' });

    Swal.fire({ title: 'Updating password...', allowOutsideClick: false, didOpen: () => Swal.showLoading() });
    const res = await apiCall('/teacher/change_password', 'PUT', {
        current_password: currentPassword,
        new_password:     newPassword,
        confirm_password: confirmPassword
    });
    if (res) {
        Swal.fire({ icon: 'success', title: 'Success', text: 'Your password has been updated successfully.' });
        document.getElementById('currentPassword').value = '';
        document.getElementById('newPassword').value     = '';
        document.getElementById('confirmPassword').value = '';
    }
}

async function editProfileName() {
    const currentName = document.getElementById('accountInformationName').textContent;
    const { value: newName } = await Swal.fire({
        title: 'Change Name',
        input: 'text',
        inputLabel: 'New name',
        inputValue: currentName,
        inputPlaceholder: 'Enter new name',
        showCancelButton: true,
        confirmButtonText: 'Save',
        inputValidator: value => !value ? 'Name cannot be empty!' : undefined
    });

    if (!newName) return;
    Swal.fire({ title: 'Saving name...', allowOutsideClick: false, didOpen: () => Swal.showLoading() });
    const data = await apiCall('/teacher/change_teacher_name', 'PUT', { newName });
    if (data) {
        Swal.fire({ icon: 'success', title: 'Updated!', text: 'Name has been changed successfully.' })
            .then(() => getTeacherDataToServer());
    }
}

// ============================================================
// EXPORT TO EXCEL — FORMATTED
// ============================================================
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

        const now       = new Date();
        const dateStr   = now.toLocaleDateString('en-PH', { year: 'numeric', month: 'long', day: 'numeric' });
        const timeStr   = now.toLocaleTimeString('en-PH', { hour: '2-digit', minute: '2-digit' });
        const colCount  = headers.length;

        // --- Build sheet data ---
        // Row 1: School name (merged visually via full-width value)
        // Row 2: Report title
        // Row 3: Date generated
        // Row 4: blank
        // Row 5: headers
        // Row 6+: data
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
// PRINT — Section specific
// ============================================================
async function getLogoBase64() {
    // Try absolute server URL first (most reliable), then relative fallbacks
    const serverBase = BASE_URL.replace('/api/v1', '');
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
    if (!table) return window.print();

    const now     = new Date().toLocaleString('en-PH');
    const logoSrc = await getLogoBase64();
    // Clone so we don't touch the live DOM
    const clone = table.cloneNode(true);
    // Find and remove Action columns
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
        <!DOCTYPE html>
        <html>
        <head>
            <title>${title}</title>
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
            </style>
        </head>
        <body>
            <div class="header">
                ${logoSrc ? `<img src="${logoSrc}" style="width:70px;height:70px;object-fit:contain;border-radius:50%;margin-bottom:8px;display:block;margin-left:auto;margin-right:auto;">` : ''}
                <h2>PanPacific University</h2>
                <h3>${title}</h3>
                <p>Generated: ${now} &nbsp;|&nbsp; Total Records: ${rows}</p>
            </div>
            ${content}
            <div class="footer">PanPacific University Attendance System</div>
            <script>window.onload = () => { window.print(); window.onafterprint = () => window.close(); }<\/script>
        </body>
        </html>
    `);
    printWin.document.close();
}

function saveChanges() {
    Swal.fire({ position: 'center', icon: 'success', title: 'Changes saved successfully', showConfirmButton: false, timer: 1500 });
}

function printList()       { printSection('studentsTable', 'Student Records'); }
function printAttendance() { printSection('eventAttendanceTable', 'Event Attendance'); }
function applyFilters()    { /* hook in filter logic here */ }

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
const THEME_STORAGE_KEY = 'teacher_theme';

function loadTheme() {
    const saved = JSON.parse(localStorage.getItem(THEME_STORAGE_KEY) || '{}');
    applyTheme(saved.mode || 'light', saved.font || 'system', saved.size || 'medium', false);
}

function applyTheme(mode, font, size, save = true) {
    // Force correct sidebar color regardless of cached value
    const _sidebar = document.getElementById('sidebar');
    if (_sidebar) {
        _sidebar.style.background = mode === 'dark'
            ? 'linear-gradient(180deg, #0d1a2a 0%, #091422 100%)'
            : 'linear-gradient(180deg, rgb(26, 69, 69) 0%, rgb(15, 46, 46) 100%)';
    }
    const html = document.documentElement;
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

    // Font size via zoom on sections only
    const zoomMap = { small: '0.88', medium: '1', large: '1.12' };
    const zoomVal = zoomMap[size] || '1';
    document.querySelectorAll('.sections').forEach(el => { el.style.zoom = zoomVal; });

    // Sidebar background
    const sidebar = document.getElementById('sidebar');
    if (sidebar) {
        sidebar.style.background = mode === 'dark'
            ? 'linear-gradient(180deg, #0d1a2a 0%, #091422 100%)'
            : 'linear-gradient(180deg, rgb(26, 69, 69) 0%, rgb(15, 46, 46) 100%)';
    }

    // Update button active states
    document.querySelectorAll('.t-theme-mode-btn').forEach(b => b.classList.remove('t-active'));
    document.getElementById(mode === 'dark' ? 'modeDark' : 'modeLight')?.classList.add('t-active');
    document.querySelectorAll('.t-font-btn').forEach(b => b.classList.toggle('t-active', b.dataset.font === font));
    document.querySelectorAll('.t-size-btn').forEach(b => b.classList.toggle('t-active', b.dataset.size === size));

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

// Load theme on page load
loadTheme();

// ============================================================
// SETTINGS PAGE
// ============================================================
const _teacherSessionStart = new Date().toLocaleString('en-PH', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' });

function loadSettingsPage() {
    const el = id => document.getElementById(id);
    if (el('teacherSessionStart')) el('teacherSessionStart').textContent = _teacherSessionStart;
    // Sync profile name/email if already loaded
    const name = el('accountInformationName')?.textContent;
    if (name && name !== 'Unknown' && el('settingsProfileName')) el('settingsProfileName').textContent = name;
}