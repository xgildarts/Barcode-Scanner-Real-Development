
const BASE_URL = 'https://32g7g83w-3000.asse.devtunnels.ms/api/v1';
const TOKEN = localStorage.getItem('teacher_token');

// Check TOKEN
async function checkToken() {
    try {
        // If no TOKEN provided, redirect the user to login page
        if(!TOKEN) {
            Swal.fire({ icon: 'error', title: 'Please login first!', message: 'Please login first!' })
            .then(() => {
                window.location.href = 'teacher_login.html'
            })
        }

        const res = await fetch('http://localhost:3000/api/v1/authentication/verify_token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + TOKEN
            }
        })

        const data = await res.json()

        if(!res.ok) {
            Swal.fire({ icon: 'error', title: data.message, message: data.message })
            .then(() => {
                window.location.href = 'teacher_login.html'
            })
        } 

    } catch(err) {
        Swal.fire({ icon: 'error', title: err, message: err })
    }
}

const DOM = {
    sidebar: document.getElementById('sidebar'),
    sidebarOverlay: document.getElementById('sidebarOverlay'),
    menuBtn: document.getElementById('menuBtn'),
    headerTitle: document.getElementById('headerTitle'),
    eventAttendanceBody: document.getElementById('eventAttendanceBody'),
    eventAttendanceHistoryBody: document.getElementById('attendanceHistoryBody')
};

let state = {
    totalPresent: 0,
    totalStudentRegistered: 0,
    attendanceStatus: {}, // For manual entry
    manualStudents: []
};

function dateFormat(stringDate) {
    return stringDate.split('T')[0]
}

// Get Event Attendance Record
async function renderEventAttendanceRecord() {
    const data = await apiCall('/teacher/get_event_attendance', 'GET')
    DOM.eventAttendanceBody.innerHTML = data.content.map(d => 
        `
        <tr>
            <td>${d.student_id_number}</td>
            <td>${d.student_name}</td>
            <td>${d.student_program}</td>
            <td>${d.student_year_level}</td>
            <td>${dateFormat(d.date)}</td>
            <td>${formatTime(d.time)}</td>
            <td>${d.event_name}</td>
            <td>${d.status}</td>
        </tr>
        `
    ).join('')
    
}

// Get Event Attendance History Record
async function renderEventAttendanceHistoryRecord() {
    const data = await apiCall('/teacher/get_event_attendance_history', 'GET')
    DOM.eventAttendanceHistoryBody.innerHTML = data.content.map(d => 
        `
        <tr>
            <td>${d.student_id_number}</td>
            <td>${d.student_name}</td>
            <td>${d.student_program}</td>
            <td>${d.student_year_level}</td>
            <td>${dateFormat(d.date)}</td>
            <td>${formatTime(d.time)}</td>
            <td>${d.event_name}</td>
            <td>${d.status}</td>
        </tr>
        `
    ).join('')
    
}


// Generic API Fetcher
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
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: err.message || 'Something went wrong!',
        });
        return null;
    }
}

// Formatters
const formatTime = (timeString) => {
    if (!timeString) return '-';
    let [h, m] = timeString.split(':');
    h = parseInt(h, 10);
    const ampm = h >= 12 ? 'PM' : 'AM';
    h = h % 12 || 12;
    return `${h}:${m} ${ampm}`;
};

const formatDate = (dateString) => dateString ? dateString.split('T')[0] : '-';

// Generic Table Search
function setupTableSearch(inputId, tableBodyId) {
    const input = document.getElementById(inputId);
    if (!input) return;

    input.addEventListener('input', function() {
        const term = this.value.toLowerCase();
        const rows = document.querySelectorAll(`#${tableBodyId} tr`);
        rows.forEach(row => {
            row.style.display = row.textContent.toLowerCase().includes(term) ? '' : 'none';
        });
    });
}

// Generic Excel Export
function exportTableToExcel(tableId, fileName) {
    const table = document.getElementById(tableId);
    if (!table) {
        return Swal.fire({
            icon: 'info',
            title: 'Export Failed',
            text: 'No table data found to export.'
        });
    }
    
    try {
        const workbook = XLSX.utils.book_new();
        const worksheet = XLSX.utils.table_to_sheet(table);
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
        XLSX.writeFile(workbook, `${fileName}.xlsx`);
        
        Swal.fire({
            icon: 'success',
            title: 'Exported!',
            text: 'Your Excel file has been downloaded.',
            timer: 1500,
            showConfirmButton: false
        });
    } catch (e) {
        Swal.fire('Error', 'Failed to generate Excel file', 'error');
    }
}

function printPage() {
    window.print();
}

DOM.menuBtn.addEventListener('click', () => {
    DOM.sidebar.classList.toggle('active');
    DOM.sidebarOverlay.classList.toggle('active');
});

DOM.sidebarOverlay.addEventListener('click', () => {
    DOM.sidebar.classList.remove('active');
    DOM.sidebarOverlay.classList.remove('active');
});

function navigateTo(navName) {
    const titles = {
        dashboard: 'Dashboard',
        location: 'Location',
        attendanceNow: 'Attendance',
        history: 'Attendance History',
        studentRegistered: 'Student Records',
        manualEntry: 'Manual Entry',
        eventAttendance: 'Event Attendance',
        eventHistory: 'Event Attendance History',
        academicSetup: 'Academic Setup',
        settings: 'Settings'
    };

    if (titles[navName]) DOM.headerTitle.textContent = titles[navName];

    // Toggle Active Classes
    Object.keys(titles).forEach(nav => {
        const el = document.getElementById(nav);
        if (el) nav === navName ? el.classList.add('active') : el.classList.remove('active');
    });

    DOM.sidebar.classList.remove('active');
    DOM.sidebarOverlay.classList.remove('active');
}

function cancel() {
    Swal.fire({
        title: 'Cancel Action?',
        text: 'Are you sure you want to go back?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, go back'
    }).then((result) => {
        if (result.isConfirmed) {
            window.history.back();
        }
    });
}

function setDonutProgress(percent) {
    const svg = document.getElementById('donutChart');
    if(!svg) return;
    const progressCircle = svg.querySelectorAll('circle')[1];
    const radius = progressCircle.r.baseVal.value;
    const circumference = 2 * Math.PI * radius;
    
    progressCircle.style.strokeDasharray = `${circumference} ${circumference}`;
    const offset = circumference * (1 - percent / 100);
    progressCircle.style.strokeDashoffset = -offset;
}

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
    const data = await apiCall('/teacher/teacher_attendance_record');
    if (!data) return;

    state.totalPresent = data.content.length;
    document.getElementById('totalPresents').textContent = state.totalPresent;
    document.getElementById('bottomTotalPresent').textContent = "Presents " + state.totalPresent;
    
    const absentCount = state.totalStudentRegistered - state.totalPresent;
    const finalAbsent = absentCount > 0 ? absentCount : 0;
    
    document.getElementById('totalStudentAbsent').textContent = finalAbsent;
    document.getElementById('bottomTotalAbsent').textContent = "Absent " + finalAbsent;

    const percent = state.totalStudentRegistered > 0 ? (state.totalPresent / state.totalStudentRegistered) * 100 : 0;

    setDonutProgress(percent);

    const tbody = document.getElementById('attendanceBody');
    tbody.innerHTML = data.content.map(d => `<tr>${buildAttendanceRow(d)}</tr>`).join('');
}

async function getStudentAttendanceHistoryRecords() {
    const data = await apiCall('/teacher/teacher_attendance_history_record');
    if (!data) return;

    const tbody = document.getElementById('attendanceHistoryTableBody');
    tbody.innerHTML = data.content.map(d => `<tr>${buildAttendanceRow(d)}</tr>`).join('');
}

function setupHistoryDropdownFilter(filterId, columnIndex) {
    document.getElementById(filterId).addEventListener('change', function() {
        const term = this.value.toLowerCase();
        const rows = document.querySelectorAll('#attendanceHistoryTableBody tr');
        let hasMatch = false;

        rows.forEach(row => {
            const cellText = row.cells[columnIndex].textContent.trim().toLowerCase();
            const isMatch = !term || cellText === term;
            row.style.display = isMatch ? '' : 'none';
            if(isMatch) hasMatch = true;
        });

        if(!hasMatch && term) {
            Swal.fire({
                toast: true,
                position: 'top-end',
                icon: 'info',
                title: 'No records found for this filter',
                showConfirmButton: false,
                timer: 2000
            });
        }
    });
}

function studentRegisteredDropdownFilter(filterId, columnIndex) {
    document.getElementById(filterId).addEventListener('change', function() {
        const term = this.value.toLowerCase();
        const rows = document.querySelectorAll('#studentsBody tr');
        let hasMatch = false;

        rows.forEach(row => {
            const cellText = row.cells[columnIndex].textContent.trim().toLowerCase();
            const isMatch = !term || cellText === term;
            row.style.display = isMatch ? '' : 'none';
            if(isMatch) hasMatch = true;
        });

        if(!hasMatch && term) {
            Swal.fire({
                toast: true,
                position: 'top-end',
                icon: 'info',
                title: 'No records found for this filter',
                showConfirmButton: false,
                timer: 2000
            });
        }
    });
}

function applyFilters() {
    Swal.fire({
        icon: 'success',
        title: 'Filters Applied',
        text: 'Loading students based on your selection...',
        timer: 1500,
        showConfirmButton: false
    });
    // Add logic here to load students based on selected course/year
}

// Function to Load Data
async function loadStudentsRegistered() {
    try {
        const data = await apiCall('/teacher/get_student_registered');
        if (!data || !data.content) return;

        console.log(data)

        // Update State and UI Counters
        state.totalStudentRegistered = data.content.length;
        document.getElementById('totalStudents').textContent = state.totalStudentRegistered;
        document.getElementById('centerTotalStudents').textContent = state.totalStudentRegistered;

        const tbody = document.getElementById('studentsBody');
        
        // Generate Table Rows
        tbody.innerHTML = data.content.map(s => {
            // Handle null middle name for display
            const middleNameDisplay = s.student_middlename || '-';
            // Handle null middle name for the edit function (pass empty string if null)
            const middleNameValue = s.student_middlename || '';
            
            // Use s.id if available, otherwise default to 1
            const dbId = s.student_id; 

            return `
                <tr>
                    <td>${s.student_id_number}</td>
                    <td>${s.student_firstname}</td>
                    <td>${middleNameDisplay}</td>
                    <td>${s.student_lastname}</td>
                    <td>${s.student_program}</td>
                    <td>${s.student_year_level}</td>
                    <td>${s.date_created.split('T')[0]}</td>
                    <td>
                        <div class="action-btns">
                            <button class="edit-btn" onclick="editStudent(
                                '${dbId}', 
                                '${s.student_id_number}', 
                                '${s.student_firstname}', 
                                '${middleNameValue}', 
                                '${s.student_lastname}', 
                                '${s.student_program}', 
                                '${s.student_year_level}', 
                                '${s.date_created.split('T')[0]}'
                            )">Edit</button>
                            
                            <button class="delete-btn-student-registered" onclick="deleteStudent('${dbId}')">Delete</button>
                        </div>
                    </td>
                </tr>
            `;
        }).join('');
    } catch (error) {
        console.error("Error loading students:", error);
    }
}

// Event Listener for Adding a Student
document.getElementById('registrationForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const studentData = {
        student_firstname: document.getElementById('firstName').value,
        student_middlename: document.getElementById('middleName').value,
        student_lastname: document.getElementById('lastName').value,
        student_email: document.getElementById('email').value,
        student_id_number: document.getElementById('idNumber').value,
        student_program: document.getElementById('program').value,
        student_year_level: document.getElementById('yearLevel').value,
        student_guardian_number: document.getElementById('guardianContactNumber').value
    };

    // Email Validation
    if (!studentData.student_email.endsWith('@panpacificu.edu.ph')) {
        return Swal.fire('Invalid Email', 'Please use a valid Panpacific University email (@panpacificu.edu.ph).', 'warning');
    }

    // API Call
    const res = await apiCall('/teacher/add_student', 'POST', studentData);
    
    if (res) {
        Swal.fire('Success', res.message, 'success');
        this.reset(); // Clear the form
        closeAddStudentModal(); // Close modal
        loadStudentsRegistered(); // Refresh the table
    }
});

function openAddStudentModal() { 
    document.getElementById('addStudentModal').style.display = 'flex'; 
}

function closeAddStudentModal() { 
    document.getElementById('addStudentModal').style.display = 'none'; 
}

// This receives the data from the HTML onclick and passes it to your modal logic
function editStudent(
    id, 
    student_id_number,
    student_firstname,
    student_middlename,
    student_lastname,
    student_program,
    student_year_level,
    date_created
) { 
    // Log to console to verify data is passing correctly (optional)
    console.log("Editing:", student_firstname, student_lastname);

    openRecordModal(
        id, 
        student_id_number, 
        student_firstname, 
        student_middlename,
        student_lastname, 
        student_program, 
        student_year_level, 
        date_created
    );
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
    }).then(async (result) => {
        if (result.isConfirmed) {

            const res = await apiCall(
                `/teacher/delete_student_record/${student_id}`,
                'DELETE'
            );

            if (!res || !res.ok) {
                Swal.fire('Error', 'Failed to delete student.', 'error');
                return;
            }

            Swal.fire('Deleted!', 'The student has been removed.', 'success');
            loadStudentsRegistered();
        }
    });
}


async function subjectAndYearLevelSetter() {
    const subject = document.getElementById('courseFilter').value;
    const yearLevel = document.getElementById('yearFilter').value;

    const result = await Swal.fire({
        title: 'Update Settings?',
        text: 'This will update the active subject and year level.',
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Yes, update'
    });

    if (result.isConfirmed) {
        const res = await apiCall('/teacher/teacher_subject_and_year_level_setter', 'PUT', { subject, yearLevel });
        if (res) Swal.fire('Updated!', res.message, 'success');
    }
}

// Load Subjects
async function renderSubjects() {
    const data = await apiCall('/teacher/get_subjects', 'GET');
    if (!data) return;

    const list = document.getElementById('programsList');
    const courseFilter = document.getElementById('courseFilter')
    const subjectFilterAttendanceHistory = document.getElementById('subjectFilterAttendanceHistory')

    list.innerHTML = data.content
        .map(d => `
            <div class="program-card">
                <div class="program-name">${d.subject_name}</div>
                <button class="delete-btn" onclick="deleteProgram(${d.subject_id}, '${d.subject_name}')">
                    <svg viewBox="0 0 24 24">
                        <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
                    </svg>
                </button>
            </div>
        `)
        .join('');
    
    // Render subject filter
    courseFilter.innerHTML =
    `<option value="">Select Subject</option>` +
    data.content
        .map(d => `
            <option value="${d.subject_name}">
                ${d.subject_name}
            </option>
        `)
        .join('');    
    subjectFilterAttendanceHistory.innerHTML =
    `<option value="">All</option>` +
    data.content
        .map(d => `
            <option value="${d.subject_name}">
                ${d.subject_name}
            </option>
        `)
        .join(''); 
}


async function addSubject() {
    const input = document.getElementById('programNameInput');
    const programName = input.value.trim();
    if (!programName) {
        return Swal.fire('Input Required', 'Please enter a program name.', 'warning');
    }

    const res = await apiCall('/teacher/programs/add', 'POST', { program_name: programName });
    if (res && res.ok) {
        renderSubjects();
        closeAddModal();
        Swal.fire({
            toast: true,
            position: 'top-end',
            icon: 'success',
            title: 'Program Added',
            showConfirmButton: false,
            timer: 1500
        });
    }
    // Reset value
    input.value = ""
}

function deleteProgram(program_id, program_name) {
    Swal.fire({
        title: 'Delete Program?',
        text: `Are you sure you want to delete "${program_name}"?`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it'
    }).then(async (result) => {
        if (result.isConfirmed) {
            const res = await apiCall(
                `/teacher/delete_program/${program_id}`,
                'DELETE'
            );

            if (!res) return;

            Swal.fire('Deleted', 'Program has been removed.', 'success');

            // Reload from backend
            renderSubjects();
        }
    });
}


function openAddModal() { 
    document.getElementById('addModal').classList.add('active'); 
    document.getElementById('programNameInput').focus();
}
function closeAddModal() { document.getElementById('addModal').classList.remove('active'); }

function saveChanges() {
    // Generic save function
    Swal.fire({
        position: 'center',
        icon: 'success',
        title: 'Changes saved successfully',
        showConfirmButton: false,
        timer: 1500
    });
}

function markManualStatus(name, status) {
    state.attendanceStatus[name] = status;
    renderManualStudents();
}

// function switchTab(tab) {
//     // Update active tab buttons
//     document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
//     event.target.classList.add('active');

//     Swal.fire({
//         toast: true,
//         position: 'top',
//         icon: 'info',
//         title: `Filtering by: ${tab}`,
//         showConfirmButton: false,
//         timer: 1000
//     });
// }

// Location Slider
const radiusSlider = document.getElementById('radiusSlider');
radiusSlider.addEventListener('input', function() {
    document.getElementById('radiusValue').textContent = this.value;
    const percentage = ((this.value - 10) / (90)) * 100;
    this.style.background = `linear-gradient(to right, #5a8a7a 0%, #5a8a7a ${percentage}%, #e0e0e0 ${percentage}%, #e0e0e0 100%)`;
    const size = 100 + (this.value - 10) * 2;
    document.querySelector('.radius-circle').style.cssText = `width: ${size}px; height: ${size}px`;
});

function setLocation() {
    const radius = document.getElementById('radiusValue').textContent;
    Swal.fire({
        title: 'Location Set!',
        text: `Geofencing enabled with ${radius} meters radius.`,
        icon: 'success',
        confirmButtonText: 'Great'
    });
}

// Refresh Attendance
async function refreshAttendance() {
    // 1. Fetch the data
    await getStudentAttendanceRecords();

    // 2. Show a small "Toast" notification
    Swal.fire({
        toast: true,
        position: 'top-end',
        icon: 'success',
        title: 'Attendance list refreshed',
        showConfirmButton: false,
        timer: 1500,
        timerProgressBar: true
    });
}

// Refresh Attendance History
async function refreshAttendanceHistory() {
    // 1. Fetch the data
    await getStudentAttendanceHistoryRecords();

    // 2. Show a small "Toast" notification
    Swal.fire({
        toast: true,
        position: 'top-end',
        icon: 'success',
        title: 'History list refreshed',
        showConfirmButton: false,
        timer: 1500,
        timerProgressBar: true
    });
}

// Print
function printList() {
    window.print();
}

// Open the Modal
function openRecordModal(id, 
    student_id_number, 
    student_firstname, 
    student_middlename,
    student_lastname, 
    student_program, 
    student_year_level, 
    date_created) {
    document.getElementById("recordModal").style.display = "flex";
    document.getElementById('id').value = id
    document.getElementById('id_number').value = student_id_number
    document.getElementById('firstname').value = student_firstname
    document.getElementById('mi').value = student_middlename
    document.getElementById('lastname').value = student_lastname
    document.getElementById('editProgram').value = student_program
    document.getElementById('year_level').value = student_year_level


}

// Close the Modal
function closeRecordModal() {
    document.getElementById("recordModal").style.display = "none";
}

// Close if clicking outside the box
window.onclick = function(event) {
    var modal = document.getElementById("recordModal");
    if (event.target == modal) {
        modal.style.display = "none";
    }
}


document.addEventListener('DOMContentLoaded', () => {

    // Check TOKEN first
    checkToken()

    // 1. Navigation Init
    navigateTo('dashboard');
    
    // 2. Data Loading
    loadStudentsRegistered();
    getStudentAttendanceRecords();
    getStudentAttendanceHistoryRecords();
    getTeacherDataToServer();
    loadManualEntryStudents()
    
    // 3. UI Renders
    renderSubjects()
    renderYearLevel()
    renderPrograms()
    renderEventAttendanceRecord()
    renderEventAttendanceHistoryRecord()
    radiusSlider.dispatchEvent(new Event('input')); 

    // 4. Setup Global Search Listeners
    setupTableSearch('searchInputAttendance', 'attendanceBody');
    setupTableSearch('searchInputAttendanceHistory', 'attendanceHistoryTableBody');
    setupTableSearch('searchInput', 'studentsBody'); 
    setupManualEntryFilterSearch()

    // 5. Setup Filter Dropdowns
    setupHistoryDropdownFilter('subjectFilterAttendanceHistory', 4);
    setupHistoryDropdownFilter('yearFilterAttendanceHistory', 5);
    setupManualEntryFilter()

    // Registration
    studentRegisteredDropdownFilter('recordYearFilter', 5)

    // 6. Generic Close Buttons
    document.querySelectorAll('.close-btn').forEach(btn => {
        btn.addEventListener('click', e => e.target.closest('.stat-card').style.display = 'none');
    });
});

function logout() {
    Swal.fire({
        title: 'Logout?', 
        text: 'You will be returned to the login screen.',
        icon: 'warning', 
        showCancelButton: true, 
        confirmButtonColor: '#d33',
        confirmButtonText: 'Yes, log out'
    }).then((result) => {
        if (result.isConfirmed) {
            localStorage.removeItem('teacher_token');
            Swal.fire({
                icon: 'success',
                title: 'Logged out',
                showConfirmButton: false,
                timer: 1500
            }).then(() => {
                window.location.href = 'teacher_login.html';
            });
        }
    });
}

// Load Year Level
async function renderYearLevel() {
    const data = await apiCall('/teacher/get_year_levels', 'GET');
    if (!data) return;

    const select = document.getElementById('yearFilter');
    const yearFilterAttendanceHistory = document.getElementById('yearFilterAttendanceHistory')
    const recordYearFilter = document.getElementById('recordYearFilter')
    const manualEntryYearFilter = document.getElementById('manualEntryYearFilter')

    select.innerHTML = `
        <option value="">Select Year Level</option>
        ${data.content.map(y => `
            <option value="${y.year_level_name}">${y.year_level_name}</option>
        `).join('')}
    `;
    yearFilterAttendanceHistory.innerHTML = `
        <option value="">All</option>
        ${data.content.map(y => `
            <option value="${y.year_level_name}">${y.year_level_name}</option>
        `).join('')}
    `;
    recordYearFilter.innerHTML = `
    <option value="">Select Year Level</option>
    ${data.content.map(y => `
        <option value="${y.year_level_name}">${y.year_level_name}</option>
    `).join('')}
    `;
    manualEntryYearFilter.innerHTML = `
    <option value="">Select Year Level</option>
    ${data.content.map(y => `
        <option value="${y.year_level_name}">${y.year_level_name}</option>
    `).join('')}
    `;
}

// Load Programs
async function renderPrograms() {
    const data = await apiCall('/teacher/get_programs', 'GET')
    const program = document.getElementById('program')
    const editProgram = document.getElementById('editProgram')
    if(!data) { return }
    program.innerHTML = `<option value="">Select Program</option>` + 
    data.content.map(d => 
        `<option value="${d.program_name}">${d.program_name}</option>`
    ).join('')
    editProgram.innerHTML = `<option value="">Select Program</option>` + 
    data.content.map(d => 
        `<option value="${d.program_name}">${d.program_name}</option>`
    ).join('')
    
}

// Record Form
document.getElementById('recordForm').addEventListener('submit', async function (e) {
    e.preventDefault();

    const payload = {
        student_id: document.getElementById('id').value,
        student_id_number: document.getElementById('id_number').value.trim(),
        firstname: document.getElementById('firstname').value.trim(),
        mi: document.getElementById('mi').value.trim(),
        lastname: document.getElementById('lastname').value.trim(),
        program: document.getElementById('editProgram').value,
        year_level: document.getElementById('year_level').value,
        record_date: document.getElementById('record_date').value
    };

    console.log(payload.program)

    const res = await apiCall('/teacher/update_student_record', 'PUT', payload);
    if (!res) return;

    Swal.fire('Updated!', 'Record has been updated successfully.', 'success');

    document.getElementById('recordForm').reset();
    closeRecordModal();
    loadStudentsRegistered()
});

// Get Teacher Data
async function getTeacherDataToServer() {
    const data = await apiCall('/teacher/get_teacher_data', 'GET')
    if(!data) { return }
    
    // Set teacher name at the sidebar
    document.getElementById('sideBarTeacherName').textContent = data.content[0].teacher_name

    // Profile settings
    document.querySelector('.profile-name').textContent =  data.content[0].teacher_name
    document.querySelector('.profile-email').textContent =  data.content[0].teacher_email
    document.getElementById('accountInformationName').textContent = data.content[0].teacher_name
    // document.getElementById('accountEmailInformation').textContent  = data.content[0].teacher_email

}

// Teacher Update Password
async function updatePassword() {
    // Get Values
    const currentPassword = document.getElementById('currentPassword').value;
    const newPassword = document.getElementById('newPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    // Client-Side Validation
    if (!currentPassword || !newPassword || !confirmPassword) {
        return Swal.fire({
            icon: 'warning',
            title: 'Missing Fields',
            text: 'Please fill in all password fields.'
        });
    }

    if (newPassword !== confirmPassword) {
        return Swal.fire({
            icon: 'error',
            title: 'Password Mismatch',
            text: 'The new passwords do not match. Please try again.'
        });
    }

    if (newPassword.length < 6) {
        return Swal.fire({
            icon: 'warning',
            title: 'Weak Password',
            text: 'New password must be at least 6 characters long.'
        });
    }

    // 3. Prepare Payload
    const payload = {
        current_password: currentPassword,
        new_password: newPassword,
        confirm_password: confirmPassword
    };

    const res = await apiCall('/teacher/change_password', 'PUT', payload);

    // 5. Handle Success
    if (res) {
        Swal.fire({
            icon: 'success',
            title: 'Success',
            text: 'Your password has been updated successfully.'
        });

        // Clear the inputs
        document.getElementById('currentPassword').value = '';
        document.getElementById('newPassword').value = '';
        document.getElementById('confirmPassword').value = '';
    }
}

// Edit teacher Name
async function editProfileName() {

    const currentName = document.getElementById('accountInformationName').textContent

    const { value: newName } = await Swal.fire({
        title: 'Change Name',
        input: 'text',
        inputLabel: 'New name',
        inputValue: currentName,
        inputPlaceholder: 'Enter new name',
        showCancelButton: true,
        confirmButtonText: 'Save',
        cancelButtonText: 'Cancel',
        inputValidator: (value) => {
            if (!value) {
                return 'Name cannot be empty!'
            }
        }
    })

    if (newName) {
        console.log('New name:', newName)

        const data = await apiCall('/teacher/change_teacher_name', 'PUT', { newName })
        if(!data) { return }

        Swal.fire({
            icon: 'success',
            title: 'Updated!',
            text: 'Name has been changed successfully'
        }).then(() => {
            getTeacherDataToServer()
        })
    }
}

// Edit teacher Email
// async function editProfileEmail() {

//     const currentName = document.getElementById('accountInformationName').textContent

//     const { value: newName } = await Swal.fire({
//         title: 'Change Name',
//         input: 'text',
//         inputLabel: 'New name',
//         inputValue: currentName,
//         inputPlaceholder: 'Enter new name',
//         showCancelButton: true,
//         confirmButtonText: 'Save',
//         cancelButtonText: 'Cancel',
//         inputValidator: (value) => {
//             if (!value) {
//                 return 'Name cannot be empty!'
//             }
//         }
//     })

//     if (newName) {
//         console.log('New name:', newName)

//         // Example: send to backend
//         // await updateName(newName)

//         Swal.fire({
//             icon: 'success',
//             title: 'Updated!',
//             text: 'Name has been changed successfully'
//         })
//     }
// }

// Load ManualEntry Student
async function loadManualEntryStudents() {
    const data = await apiCall('/teacher/get_student_registered');

    if (!data || !data.content) return;

    const listContainer = document.getElementById('studentList');

    listContainer.innerHTML = data.content.map(student => {

        const id = student.student_id;
        const idNumber = student.student_id_number;

        const middleName = student.student_middlename ?? '';
        const fullName = `${student.student_firstname} ${middleName} ${student.student_lastname}`;

        console.log("Student Loaded:", student);

        return `
            <div class="student-row">
                <div class="student-name">${fullName}</div>
                <div class="year-level">${student.student_year_level}</div>

                <div class="action-buttons">
                    <button 
                        id="btn-present-${id}"
                        class="status-btn present-btn"
                        onclick="addToAttendance(
                            ${id},
                            '${idNumber}',
                            '${student.student_firstname}',
                            '${middleName}',
                            '${student.student_lastname}',
                            '${student.student_program}',
                            '${student.student_year_level}'
                        )">
                        Add to attendance
                    </button>
                </div>
            </div>
        `;
    }).join('');
}


// Manual Entry Student Filter
function setupManualEntryFilter() {
    const filterDropdown = document.getElementById('manualEntryYearFilter');
    const studentList = document.getElementById('studentList');

    if (!filterDropdown || !studentList) return;

    filterDropdown.addEventListener('change', function() {
        const selectedValue = this.value.trim().toLowerCase(); // e.g., "1st year"
        const rows = studentList.querySelectorAll('.student-row');

        rows.forEach(row => {
            const yearText = row.querySelector('.year-level').textContent.trim().toLowerCase();
            const isMatch = selectedValue === "" || yearText === selectedValue || selectedValue.includes(yearText);
            if (isMatch) {
                row.style.display = 'grid'; 
            } else {
                row.style.display = 'none'; 
            }
        });
    });
}

// Manual Entry Student Search Function
function setupManualEntryFilterSearch() {
    const searchInput = document.getElementById('manualEntrySearchInput');
    const studentList = document.getElementById('studentList');

    if (!searchInput || !studentList) return;

    searchInput.addEventListener('input', function(e) {
        const searchTerm = e.target.value.toLowerCase().trim();
        const rows = studentList.querySelectorAll('.student-row');

        rows.forEach(row => {
            const studentName = row.querySelector('.student-name').textContent.toLowerCase();

            if (studentName.includes(searchTerm)) {
                row.style.display = "grid";
            } else {
                row.style.display = "none";
            }
        });
    });
}

// The function triggered by the buttons
function addToAttendance(
    id,
    studentIDNumber,
    studentFirstName,
    studentMiddleName,
    studentLastName,
    studentProgram,
    studentYearLevel
) {
    console.log("Add To Attendance Parameters:");
    console.log("ID:", id);
    console.log("Student ID Number:", studentIDNumber);
    console.log("First Name:", studentFirstName);
    console.log("Middle Name:", studentMiddleName);
    console.log("Last Name:", studentLastName);
    console.log("Program:", studentProgram);
    console.log("Year Level:", studentYearLevel);
    
}




// Realtime refresh
// setInterval(getStudentAttendanceRecords, 1000)
// setInterval(getStudentAttendanceHistoryRecords, 1000)
