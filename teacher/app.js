// ============================================================
// CONFIG
// ============================================================
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
    eventAttendanceBody:                    document.getElementById('eventAttendanceBody'),
    eventAttendanceHistoryBody:             document.getElementById('attendanceHistoryBody'),
    searchFilterEventHistory:               document.getElementById('searchFilterEventHistory'),
    searchFilterEvent:                      document.getElementById('searchFilterEvent'),
    eventAttendanceYearLevelFilter:         document.getElementById('eventAttendanceYearLevelFilter'),
    eventAttendanceHistoryYearLevelFilter:  document.getElementById('eventAttendanceHistoryYearLevelFilter'),
    radiusSlider:                           document.getElementById('radiusSlider'),
    radiusValueDisplay:                     document.getElementById('radiusValue'),
};

// ============================================================
// STATE
// ============================================================
let state = {
    totalPresent: 0,
    totalStudentRegistered: 0,
    attendanceStatus: {},
    manualStudents: []
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
    checkToken();
    navigateTo('dashboard');

    // Data
    getStudentAttendanceRecords().then(() => startTeacherPolling());
    loadStudentsRegistered();
    getStudentAttendanceHistoryRecords();
    getTeacherDataToServer();
    loadManualEntryStudents();
    renderSubjects();
    renderYearLevel();
    renderPrograms();
    Swal.fire({ title: 'Loading event data...', allowOutsideClick: false, didOpen: () => Swal.showLoading() });
    Promise.all([renderEventAttendanceRecord(), renderEventAttendanceHistoryRecord()])
        .then(() => { Swal.close(); startEventPolling(); })
        .catch(() => Swal.close());

    // Search
    setupTableSearch('searchInputAttendance', 'attendanceBody');
    setupTableSearch('searchInputAttendanceHistory', 'attendanceHistoryTableBody');
    setupTableSearch('searchInput', 'studentsBody');
    setupManualEntryFilterSearch();

    // Filters
    setupHistoryDropdownFilter('subjectFilterAttendanceHistory', 4);
    setupHistoryDropdownFilter('yearFilterAttendanceHistory', 5);
    setupManualEntryFilter();
    studentRegisteredDropdownFilter('recordYearFilter', 5);

    // Close buttons on stat cards
    document.querySelectorAll('.close-btn').forEach(btn => {
        btn.addEventListener('click', e => e.target.closest('.stat-card').style.display = 'none');
    });

    // Profile picture upload
    const picInput = document.getElementById('teacherProfilePicInput');
    if (picInput) {
        picInput.addEventListener('change', async function () {
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
        const options = {
            method,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + TOKEN
            }
        };
        if (body) options.body = JSON.stringify(body);

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
    history:           'Attendance History',
    studentRegistered: 'Student Records',
    manualEntry:       'Manual Entry',
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
function buildAttendanceRow(d) {
    return `
        <td>${d.student_id_number}</td>
        <td>${d.student_firstname}</td>
        <td>${d.student_middlename || ''}</td>
        <td>${d.student_lastname}</td>
        <td>${d.subject}</td>
        <td>${d.year_level}</td>
        <td>${d.student_program}</td>
        <td>${formatTime(d.attendance_time)}</td>
        <td>${formatDate(d.attendance_date)}</td>
    `;
}

async function getStudentAttendanceRecords() {
    Swal.fire({ title: 'Loading attendance...', allowOutsideClick: false, didOpen: () => Swal.showLoading() });
    const data = await apiCall('/teacher/teacher_attendance_record');
    Swal.close();
    if (!data) return;

    state.totalPresent = data.content.length;
    _lastAttendanceCount = data.content.length;
    // Only draw chart if registered count is already loaded; otherwise loadStudentsRegistered() will call it
    if (state.totalStudentRegistered > 0) updateDashboardChart();

    document.getElementById('attendanceBody').innerHTML = data.content
        .map(d => `<tr>${buildAttendanceRow(d)}</tr>`)
        .join('');
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

        _lastAttendanceCount  = data.content.length;
        state.totalPresent    = data.content.length;
        if (state.totalStudentRegistered > 0) updateDashboardChart();

        document.getElementById('attendanceBody').innerHTML = data.content
            .map(d => `<tr>${buildAttendanceRow(d)}</tr>`)
            .join('');

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

async function getStudentAttendanceHistoryRecords() {
    Swal.fire({ title: 'Loading history...', allowOutsideClick: false, didOpen: () => Swal.showLoading() });
    const data = await apiCall('/teacher/teacher_attendance_history_record');
    Swal.close();
    if (!data) return;
    document.getElementById('attendanceHistoryTableBody').innerHTML = data.content
        .map(d => `<tr>${buildAttendanceRow(d)}</tr>`)
        .join('');
}

async function refreshAttendance() {
    await getStudentAttendanceRecords();
    Swal.fire({ toast: true, position: 'top-end', icon: 'success', title: 'Attendance list refreshed', showConfirmButton: false, timer: 1500, timerProgressBar: true });
}

async function refreshAttendanceHistory() {
    await getStudentAttendanceHistoryRecords();
    Swal.fire({ toast: true, position: 'top-end', icon: 'success', title: 'History list refreshed', showConfirmButton: false, timer: 1500, timerProgressBar: true });
}

// ============================================================
// EVENT ATTENDANCE
// ============================================================
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

function setupHistoryDropdownFilter(filterId, columnIndex) {
    document.getElementById(filterId).addEventListener('change', function () {
        const term = this.value.toLowerCase();
        let hasMatch = false;
        document.querySelectorAll('#attendanceHistoryTableBody tr').forEach(row => {
            const isMatch = !term || row.cells[columnIndex].textContent.trim().toLowerCase() === term;
            row.style.display = isMatch ? '' : 'none';
            if (isMatch) hasMatch = true;
        });
        if (!hasMatch && term) {
            Swal.fire({ toast: true, position: 'top-end', icon: 'info', title: 'No records found for this filter', showConfirmButton: false, timer: 2000 });
        }
    });
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

function setupManualEntryFilter() {
    const filterDropdown = document.getElementById('manualEntryYearFilter');
    const studentList = document.getElementById('studentList');
    if (!filterDropdown || !studentList) return;

    filterDropdown.addEventListener('change', function () {
        const selected = this.value.trim().toLowerCase();
        studentList.querySelectorAll('.student-row').forEach(row => {
            const yearText = row.querySelector('.year-level').textContent.trim().toLowerCase();
            const isMatch = !selected || yearText === selected || selected.includes(yearText);
            row.style.display = isMatch ? 'grid' : 'none';
        });
    });
}

function setupManualEntryFilterSearch() {
    const searchInput = document.getElementById('manualEntrySearchInput');
    const studentList = document.getElementById('studentList');
    if (!searchInput || !studentList) return;

    searchInput.addEventListener('input', function () {
        const term = this.value.toLowerCase().trim();
        studentList.querySelectorAll('.student-row').forEach(row => {
            const name = row.querySelector('.student-name').textContent.toLowerCase();
            row.style.display = name.includes(term) ? 'grid' : 'none';
        });
    });
}

// Event attendance filters — shared helper
function filterTableRows(tbody, term) {
    const lower = term.toLowerCase();
    Array.from(tbody.getElementsByTagName('tr')).forEach(row => {
        row.style.display = row.textContent.toLowerCase().includes(lower) ? '' : 'none';
    });
}

DOM.searchFilterEvent.addEventListener('input', function () {
    filterTableRows(DOM.eventAttendanceBody, this.value);
});

DOM.searchFilterEventHistory.addEventListener('input', function () {
    filterTableRows(DOM.eventAttendanceHistoryBody, this.value);
});

DOM.eventAttendanceYearLevelFilter.addEventListener('change', function () {
    filterTableRows(DOM.eventAttendanceBody, this.value);
});

DOM.eventAttendanceHistoryYearLevelFilter.addEventListener('change', function () {
    filterTableRows(DOM.eventAttendanceHistoryBody, this.value);
});

// ============================================================
// STUDENTS
// ============================================================
async function loadStudentsRegistered() {
    Swal.fire({ title: 'Loading students...', allowOutsideClick: false, didOpen: () => Swal.showLoading() });
    const data = await apiCall('/teacher/get_student_registered');
    Swal.close();
    if (!data || !data.content) return;

    state.totalStudentRegistered = data.content.length;
    document.getElementById('totalStudents').textContent = state.totalStudentRegistered;
    // Draw chart now that we have both totals (attendance may have already loaded)
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
                        <button class="edit-btn" onclick="editStudent('${dbId}','${s.student_id_number}','${s.student_firstname}','${mid}','${s.student_lastname}','${s.student_program}','${s.student_year_level}','${s.date_created.split('T')[0]}')">Edit</button>
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

    const result = await Swal.fire({
        title: 'Update Settings?',
        text: 'This will update the active subject and year level.',
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Yes, update'
    });

    if (result.isConfirmed) {
        Swal.fire({ title: 'Updating settings...', allowOutsideClick: false, didOpen: () => Swal.showLoading() });
        const res = await apiCall('/teacher/teacher_subject_and_year_level_setter', 'PUT', { subject, yearLevel });
        if (res) Swal.fire('Updated!', res.message, 'success');
    }
}

async function renderSubjects() {
    const data = await apiCall('/teacher/get_subjects', 'GET');
    if (!data) return;

    document.getElementById('programsList').innerHTML = data.content.map(d => `
        <div class="program-card">
            <div class="program-name">${d.subject_name}</div>
            <button class="delete-btn" onclick="deleteProgram(${d.subject_id}, '${d.subject_name}')">
                <svg viewBox="0 0 24 24"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/></svg>
            </button>
        </div>
    `).join('');

    const optionsHtml = data.content.map(d => `<option value="${d.subject_name}">${d.subject_name}</option>`).join('');
    document.getElementById('courseFilter').innerHTML                   = `<option value="">Select Subject</option>` + optionsHtml;
    document.getElementById('subjectFilterAttendanceHistory').innerHTML = `<option value="">All</option>` + optionsHtml;
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

async function renderYearLevel() {
    const data = await apiCall('/teacher/get_year_levels', 'GET');
    if (!data) return;

    const optionsHtml = data.content.map(y => `<option value="${y.year_level_name}">${y.year_level_name}</option>`).join('');
    document.getElementById('yearFilter').innerHTML                  = `<option value="">Select Year Level</option>` + optionsHtml;
    document.getElementById('yearFilterAttendanceHistory').innerHTML = `<option value="">All</option>` + optionsHtml;
    document.getElementById('recordYearFilter').innerHTML            = `<option value="">Select Year Level</option>` + optionsHtml;
    document.getElementById('manualEntryYearFilter').innerHTML       = `<option value="">Select Year Level</option>` + optionsHtml;
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
// MANUAL ENTRY
// ============================================================
async function loadManualEntryStudents() {
    Swal.fire({ title: 'Loading students...', allowOutsideClick: false, didOpen: () => Swal.showLoading() });
    const data = await apiCall('/teacher/get_student_registered');
    Swal.close();
    if (!data || !data.content) return;

    document.getElementById('studentList').innerHTML = data.content.map(student => {
        const id  = student.student_id;
        const mid = student.student_middlename ?? '';
        const fullName = `${student.student_firstname} ${mid} ${student.student_lastname}`.trim();
        // Escape values for safe inline onclick usage
        const esc = v => (v ?? '').toString().replace(/'/g, "\\'");
        return `
            <div class="student-row">
                <div class="student-name">${fullName}</div>
                <div class="year-level">${student.student_year_level}</div>
                <div class="action-buttons">
                    <button id="btn-present-${id}" class="status-btn present-btn"
                        onclick="addToAttendance(
                            ${id},
                            '${esc(student.student_id_number)}',
                            '${esc(student.student_firstname)}',
                            '${esc(mid)}',
                            '${esc(student.student_lastname)}',
                            '${esc(student.student_email)}',
                            '${esc(student.student_year_level)}',
                            '${esc(student.student_guardian_number)}',
                            '${esc(student.student_program)}'
                        )">
                        Add to attendance
                    </button>
                </div>
            </div>
        `;
    }).join('');
}

async function addToAttendance(student_id, student_id_number, student_firstname, student_middlename, student_lastname, student_email, student_year_level, student_guardian_number, student_program) {
    const btn = document.getElementById(`btn-present-${student_id}`);

    const confirm = await Swal.fire({
        title: 'Add to Attendance?',
        html: `<strong>${student_firstname} ${student_middlename} ${student_lastname}</strong><br>${student_program} — ${student_year_level}`,
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Yes, mark present',
        confirmButtonColor: '#5a8a7a'
    });

    if (!confirm.isConfirmed) return;

    Swal.fire({ title: 'Recording attendance...', allowOutsideClick: false, didOpen: () => Swal.showLoading() });

    const res = await apiCall('/teacher/manual_attendance', 'POST', {
        student_id,
        student_id_number,
        student_firstname,
        student_middlename,
        student_lastname,
        student_email,
        student_year_level,
        student_guardian_number,
        student_program
    });

    if (!res) return;

    Swal.fire({ icon: 'success', title: 'Recorded!', text: res.message, timer: 2000, showConfirmButton: false });

    // Reload attendance
    refreshAttendance();
    refreshAttendanceHistory();

    // Disable the button so the same student can't be added twice in the same session
    if (btn) {
        btn.textContent      = '✓ Present';
        btn.disabled         = true;
        btn.style.background = '#a0b8b0';
        btn.style.cursor     = 'not-allowed';
    }
}

// FIX: removed call to undefined renderManualStudents()
function markManualStatus(name, status) {
    state.attendanceStatus[name] = status;
}

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
function printSection(tableId, title) {
    const table = document.getElementById(tableId);
    if (!table) return window.print();

    const now  = new Date().toLocaleString('en-PH');
    const rows = table.querySelectorAll('tbody tr').length;

    // Clone so we don't touch the live DOM
    const clone = table.cloneNode(true);
    // Find and remove the Action column (Edit/Delete buttons shouldn't appear on print)
    let actionColIndex = -1;
    clone.querySelectorAll('thead th').forEach((th, i) => {
        if (th.textContent.trim().toLowerCase() === 'action') actionColIndex = i;
    });
    if (actionColIndex !== -1) {
        clone.querySelectorAll('tr').forEach(row => {
            if (row.children[actionColIndex]) row.children[actionColIndex].remove();
        });
    }
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
function printPage()       { printSection('attendanceHistoryTable', 'Attendance History'); }
function applyFilters()    { /* hook in filter logic here */ }