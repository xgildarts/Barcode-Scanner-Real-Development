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
let map, marker, circle;

// ============================================================
// INIT
// ============================================================
document.addEventListener('DOMContentLoaded', () => {
    checkToken();
    navigateTo('dashboard');

    // Data
    getStudentAttendanceRecords();
    loadStudentsRegistered();
    getStudentAttendanceHistoryRecords();
    getTeacherDataToServer();
    loadManualEntryStudents();
    renderSubjects();
    renderYearLevel();
    renderPrograms();
    renderEventAttendanceRecord();
    renderEventAttendanceHistoryRecord();

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
            setTimeout(() => map.invalidateSize(), 300);
        } else {
            setTimeout(() => loadLocation(), 300);
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

function cancel() {
    Swal.fire({
        title: 'Cancel Action?',
        text: 'Are you sure you want to go back?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, go back'
    }).then(result => {
        if (result.isConfirmed) window.history.back();
    });
}

// ============================================================
// DASHBOARD
// ============================================================
function updateDashboardChart() {
    const total   = state.totalStudentRegistered;
    const present = state.totalPresent;
    const absent  = Math.max(total - present, 0);
    const percent = total > 0 ? (present / total) * 100 : 0;

    // Update stat cards
    document.getElementById('totalPresents').textContent      = present;
    document.getElementById('bottomTotalPresent').textContent = 'Presents ' + present;
    document.getElementById('totalStudentAbsent').textContent = absent;
    document.getElementById('bottomTotalAbsent').textContent  = 'Absent ' + absent;

    // Draw donut chart
    const svg = document.getElementById('donutChart');
    if (!svg) return;
    const progressCircle = svg.querySelectorAll('circle')[1];
    const circumference  = 2 * Math.PI * progressCircle.r.baseVal.value;
    // Remove CSS transition temporarily so the chart snaps to its value immediately on load
    progressCircle.style.transition    = 'none';
    progressCircle.style.strokeDasharray  = `${circumference} ${circumference}`;
    progressCircle.style.strokeDashoffset = -(circumference * (1 - percent / 100));
    // Re-enable transition after the initial paint so future updates animate smoothly
    requestAnimationFrame(() => {
        progressCircle.style.transition = '';
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
    // Only draw chart if registered count is already loaded; otherwise loadStudentsRegistered() will call it
    if (state.totalStudentRegistered > 0) updateDashboardChart();

    document.getElementById('attendanceBody').innerHTML = data.content
        .map(d => `<tr>${buildAttendanceRow(d)}</tr>`)
        .join('');
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
    Swal.fire({ title: 'Loading event attendance...', allowOutsideClick: false, didOpen: () => Swal.showLoading() });
    const data = await apiCall('/teacher/get_event_attendance', 'GET');
    Swal.close();
    if (!data) return;
    DOM.eventAttendanceBody.innerHTML = data.content.map(d => `
        <tr>
            <td>${d.student_id_number}</td>
            <td>${d.student_name}</td>
            <td>${d.student_program}</td>
            <td>${d.student_year_level}</td>
            <td>${formatDate(d.date)}</td>
            <td>${formatTime(d.time)}</td>
            <td>${d.event_name}</td>
            <td>${d.status}</td>
        </tr>
    `).join('');
}

async function renderEventAttendanceHistoryRecord() {
    Swal.fire({ title: 'Loading event history...', allowOutsideClick: false, didOpen: () => Swal.showLoading() });
    const data = await apiCall('/teacher/get_event_attendance_history', 'GET');
    Swal.close();
    if (!data) return;
    DOM.eventAttendanceHistoryBody.innerHTML = data.content.map(d => `
        <tr>
            <td>${d.student_id_number}</td>
            <td>${d.student_name}</td>
            <td>${d.student_program}</td>
            <td>${d.student_year_level}</td>
            <td>${formatDate(d.date)}</td>
            <td>${formatTime(d.time)}</td>
            <td>${d.event_name}</td>
            <td>${d.status}</td>
        </tr>
    `).join('');
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
    document.getElementById('totalStudents').textContent       = state.totalStudentRegistered;
    document.getElementById('centerTotalStudents').textContent = state.totalStudentRegistered;
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
// REGISTRATION FORM
// ============================================================
document.getElementById('registrationForm').addEventListener('submit', async function (e) {
    e.preventDefault();

    const studentData = {
        student_firstname:       document.getElementById('firstName').value,
        student_middlename:      document.getElementById('middleName').value,
        student_lastname:        document.getElementById('lastName').value,
        // FIX: was id="email" which conflicts — HTML updated to id="studentEmail"
        student_email:           document.getElementById('studentEmail').value,
        student_id_number:       document.getElementById('idNumber').value,
        student_program:         document.getElementById('program').value,
        student_year_level:      document.getElementById('yearLevel').value,
        student_guardian_number: document.getElementById('guardianContactNumber').value
    };

    if (!studentData.student_email.endsWith('@panpacificu.edu.ph')) {
        return Swal.fire('Invalid Email', 'Please use a valid Panpacific University email (@panpacificu.edu.ph).', 'warning');
    }

    Swal.fire({ title: 'Registering student...', allowOutsideClick: false, didOpen: () => Swal.showLoading() });
    const res = await apiCall('/teacher/add_student', 'POST', studentData);
    if (res) {
        Swal.fire('Success', res.message, 'success');
        this.reset();
        closeAddStudentModal();
        loadStudentsRegistered();
    }
});

function openAddStudentModal()  { document.getElementById('addStudentModal').style.display = 'flex'; }
function closeAddStudentModal() { document.getElementById('addStudentModal').style.display = 'none'; }

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

    map = L.map('map').setView([lat, lng], 18);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap'
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

    setTimeout(() => map.invalidateSize(), 400);
}

function loadLocation() {
    Swal.fire({ title: 'Acquiring location...', allowOutsideClick: false, didOpen: () => Swal.showLoading() });
    navigator.geolocation.getCurrentPosition(position => {
        Swal.close();
        const { latitude: lat, longitude: lng } = position.coords;
        const mapEl = document.getElementById('map');

        if (mapEl.offsetParent === null) {
            const observer = new MutationObserver(() => {
                if (mapEl.offsetParent !== null) {
                    observer.disconnect();
                    setTimeout(() => initMap(lat, lng), 100);
                }
            });
            observer.observe(document.body, { attributes: true, subtree: true, childList: true });
        } else {
            initMap(lat, lng);
        }
    }, err => {
        Swal.close();
        Swal.fire({ icon: 'error', title: 'Location Error', text: err.message || 'Unable to retrieve location.' });
    });
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
    document.getElementById('program').innerHTML     = optionsHtml;
    document.getElementById('editProgram').innerHTML = optionsHtml;
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
// UTILITIES
// ============================================================
function exportTableToExcel(tableId, fileName) {
    const table = document.getElementById(tableId);
    if (!table) return Swal.fire({ icon: 'info', title: 'Export Failed', text: 'No table data found to export.' });

    try {
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, XLSX.utils.table_to_sheet(table), 'Sheet1');
        XLSX.writeFile(workbook, `${fileName}.xlsx`);
        Swal.fire({ icon: 'success', title: 'Exported!', text: 'Your Excel file has been downloaded.', timer: 1500, showConfirmButton: false });
    } catch (e) {
        Swal.fire('Error', 'Failed to generate Excel file', 'error');
    }
}

function saveChanges() {
    Swal.fire({ position: 'center', icon: 'success', title: 'Changes saved successfully', showConfirmButton: false, timer: 1500 });
}

function printList()       { window.print(); }
function printAttendance() { window.print(); }
function printPage()       { window.print(); }
function applyFilters()    { /* hook in filter logic here */ }