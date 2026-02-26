document.addEventListener('DOMContentLoaded', () => {
    checkToken()
    navigateTo('dashboard')
    // Initial render
    getAdminData();
    renderPrograms();
    fetchStudentAccounts()
    fetchTeacherAccounts()
    fetchGuardAccounts()
    renderEventAttendanceRecord()
    renderEventHistoryAttendanceRecord()
    generateProgramSelectionOnTeacher()
    chart()
})

const sidebar = document.getElementById('sidebar');
const sidebarOverlay = document.getElementById('sidebarOverlay');
const menuBtn = document.querySelector('.menu-btn');
const TOKEN = localStorage.getItem('admin_token');
const URL_BASED = 'https://32g7g83w-3000.asse.devtunnels.ms/api/v1';

const DOMElements = {
    studentAccountCounts: document.getElementById('studentAccountCounts'),
    teacherAccountCounts: document.getElementById('teacherAccountCounts'),
    guardAccountCounts: document.getElementById('guardAccountCounts'),
    studentsList: document.getElementById('studentsList'),
    teacherList: document.getElementById('teacherList'),
    guardList: document.getElementById('guardList'),
    attendanceBody: document.getElementById('attendanceBody'),
    attendanceHistory: document.getElementById('attendanceHistory'),
    sideBarStatsValue: document.getElementById('sideBarStatsValue'),
    statsValue: document.getElementById('statsValue'),
    sideBarName: document.querySelector('.sidebar-name'),
    profileName: document.querySelector('.profile-name'),
    profileEmail: document.querySelector('.profile-email'),
    searchFilterEventAttendance: document.getElementById('searchFilterEventAttendance'),
    searchFilterEventAttendanceHistory: document.getElementById('searchFilterEventAttendanceHistory'),
    attendanceBody: document.getElementById('attendanceBody'),
    attendanceHistory: document.getElementById('attendanceHistory'),
    eventHistoryYearFilter: document.getElementById('eventHistoryYearFilter'),
    adminProfileName: document.getElementById('adminProfileName'),
    profileEmail: document.getElementById('profileEmail'),
    profileEmailTop: document.getElementById('profileEmailTop'),
    ctx: document.getElementById('myChart'),
    // Student
    studentIDTracking: document.getElementById('studentIDTracking'),
    studentIdNumber: document.getElementById('studentIdNumber'),
    studentFirstName: document.getElementById('studentFirstName'),
    studentMiddleName: document.getElementById('studentMiddleName'),
    studentLastName: document.getElementById('studentLastName'),
    studentAccountManagementModal: document.getElementById('studentAccountManagementModal'),
    studentProgram: document.getElementById('studentProgram'),
    studentYearLevel: document.getElementById('studentYearLevel'),
    studentAccountManagementForm: document.getElementById('studentAccountManagementForm'),
    // Teacher
    teacherAccountManagementModal: document.getElementById('teacherAccountManagementModal'),
    teacherAccountManagementModal: document.getElementById('teacherAccountManagementModal'),
    teacherIDTracking: document.getElementById('teacherIDTracking'),
    teacherIdNumber: document.getElementById('teacherIdNumber'),
    teacherFullName: document.getElementById('teacherFullName'),
    teacherEmail: document.getElementById('teacherEmail'),
    teacherProgram: document.getElementById('teacherProgram'),
    teacherBarcodeSerialNumber: document.getElementById('teacherBarcodeSerialNumber'),
    teacherAccountManagementForm: document.getElementById('teacherAccountManagementForm'),
    // Guard
    guardAccountManagementModal: document.getElementById('guardAccountManagementModal'),
    guardAccountManagementForm: document.getElementById('guardAccountManagementForm'),
    guardIDTracking: document.getElementById('guardIDTracking'),
    guardEmail: document.getElementById('guardEmail'),
    guardFullName: document.getElementById('guardFullName'),
    guardLocation: document.getElementById('guardLocation'),
    // Search filter teacher accounts
    searchFilterTeachersAccounts: document.getElementById('searchFilterTeachersAccounts'),
    searchFilterStudentsAccounts: document.getElementById('searchFilterStudentsAccounts'),
    searchFilterGuardAccounts: document.getElementById('searchFilterGuardAccounts')

}

function dateFormat(stringDate) {
    return stringDate.split('T')[0]
}

// Format time
function formatTime(timeString) {
    if (!timeString) return '--:--';
    const [hours, minutes] = timeString.split(':');
    let h = parseInt(hours, 10);
    const m = minutes;
    const suffix = h >= 12 ? 'PM' : 'AM';
    h = h % 12;
    h = h ? h : 12;
    return `${h}:${m} ${suffix}`;
}

// Check token
async function checkToken() {
    try {
        // No token at all
        if (!TOKEN) {
            await Swal.fire({
                icon: 'error',
                title: 'Please login first!',
                text: 'Your session is missing or expired.',
                confirmButtonColor: '#d33',
                allowOutsideClick: false
            });

            window.location.href = 'admin_login.html';
            return;
        }

        // Verify token
        const res = await fetch(`${URL_BASED}/authentication/verify_token`, {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + TOKEN
            }
        });

        const data = await res.json();

        // Token invalid
        if (!res.ok) {
            await Swal.fire({
                icon: 'error',
                title: 'Session Expired',
                text: data.message || 'Please login again.',
                confirmButtonColor: '#d33',
                allowOutsideClick: false
            });

            window.location.href = 'admin_login.html';
        }

    } catch (err) {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: err.message || 'Something went wrong.',
            confirmButtonColor: '#d33'
        });

        console.error(err);
    }
}


// Event Attendance
async function renderEventAttendanceRecord() {
    try {
        const res = await fetch(`${URL_BASED}/admin/get_events`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${TOKEN}`
            }
        });

        const data = await res.json();

        
        let profileStatsValueCounts = 0;

        data.content.forEach(d => {
            if(d.status === 'TIME IN') { profileStatsValueCounts += 1 }
        })

        // Set total attendees
        DOMElements.statsValue.textContent = profileStatsValueCounts;
        DOMElements.sideBarStatsValue.textContent = profileStatsValueCounts;

        if (res.ok) {
            DOMElements.attendanceBody.innerHTML = data.content.map(d => `
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
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Failed to load records',
                text: data.message || 'Something went wrong while fetching attendance data.',
                confirmButtonColor: '#d33'
            });
        }
    } catch (err) {
        Swal.fire({
            icon: 'error',
            title: 'Network Error',
            text: err.message || 'Unable to connect to the server.',
            confirmButtonColor: '#d33'
        });
        console.error(err);
    }
}


// Event Attendance History
async function renderEventHistoryAttendanceRecord() {
    try {
        const res = await fetch(`${URL_BASED}/admin/get_events_history`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${TOKEN}`
            }
        })
        const data = await res.json()
        if(res.ok) {
            DOMElements.attendanceHistory.innerHTML = data.content.map(d => 
                `
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
                `
            ).join('')
        } else {
            console.log(data)
        }
    } catch(err) {
        alert(err)
    }
}

// Get admin data
async function getAdminData() {
    try {
        const res = await fetch(URL_BASED + '/admin/get_admin_data', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${TOKEN}`
            }
        })
        const data = await res.json()
        if(data.ok) {
            DOMElements.sideBarName.textContent = data.content[0].admin_name
            DOMElements.profileName.textContent = data.content[0].admin_name
            // DOMElements.profileEmail.textContent = data.content[0].admin_email
            DOMElements.adminProfileName.textContent = data.content[0].admin_name
            DOMElements.profileEmailTop.textContent = data.content[0].admin_email
        } else {
            console.log(data)
        }
    } catch(err) {
        console.error(err)
    }
}


menuBtn.addEventListener('click', function() {
    sidebar.classList.toggle('active');
    sidebarOverlay.classList.toggle('active');
});

sidebarOverlay.addEventListener('click', function() {
    sidebar.classList.remove('active');
    sidebarOverlay.classList.remove('active');
});

// Navigation SideBar Functions
function navigateTo(page) {

    let pages = [   'dashboard', 
                    'eventAttendance', 
                    'eventAttendanceHistory', 
                    'adminSettings', 
                    'studentAccountManagement', 
                    'teacherAccountManagement', 
                    'guardAccountManagement',
                    'academicSetup',
                    'registration'    ]

    let headerTitle = document.getElementById('titleHeader');
    
// Title switching logic
    switch(page) {
        case 'dashboard':
            headerTitle.textContent = 'Dashboard';
            break;
        case 'eventAttendance':
            headerTitle.textContent  = 'Event Attendance';
            break;
        case 'eventAttendanceHistory':
            headerTitle.textContent  = 'Event Attendance History';
            break;
        case 'adminSettings':
            headerTitle.textContent  = 'Settings';
            break;
        case 'studentAccountManagement':
            headerTitle.textContent  = 'Student Accounts';
            break;
        case 'teacherAccountManagement':
            headerTitle.textContent  = 'Teacher Accounts';
            break;
        case 'guardAccountManagement':
                headerTitle.textContent  = 'Guard Accounts';
                break;
        case 'academicSetup':
            headerTitle.textContent  = 'Academic Setup';
            break;
        case 'registration':
                headerTitle.textContent  = 'Registration';
                break;
        default:
            headerTitle.textContent  = 'Error header';
            break;
    }

    pages.forEach(p => {
        if(p == page) {
            document.getElementById(p).classList.add('active')
        } else {
            document.getElementById(p).classList.remove('active')
        }
    })

    sidebar.classList.remove('active');
    sidebarOverlay.classList.remove('active');
}

// Calendar
const calendar = flatpickr("#datePicker", {
    dateFormat: "n/j/Y",
    clickOpens: false,
    allowInput: false,
    onChange: function(selectedDates, dateStr) {
        const rows = document.querySelectorAll('#attendanceBody tr');

        rows.forEach(row => {
            const dateCell = row.children[6].textContent.trim();
            row.style.display = dateCell === dateStr ? '' : 'none';
        });
    }
});


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

    const res = await fetch(URL_BASED + '/admin/admin_change_password', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + TOKEN 
        },
        body: JSON.stringify(payload)
    });

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

function logout() {
    Swal.fire({
        title: 'Are you sure?',
        text: "You will be logged out of the admin panel.",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Yes, log out!'
    }).then((result) => {
        if (result.isConfirmed) {
            Swal.fire({
                icon: 'success',
                title: 'Logged out',
                text: 'Redirecting to login...',
                timer: 1500,
                showConfirmButton: false
            }).then(() => {
                localStorage.removeItem('admin_token');
                localStorage.removeItem('admin_user');
                window.location.href = 'admin_login.html';
            });
        }
    });
}

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


document.querySelector('.calendar-btn').addEventListener('click', () => {
    calendar.open();
});

document.querySelector('.settings-btn').addEventListener('click', function() {
    
});


function deleteStudent(index) {

}

function register() {
    navigateTo("registration");
}



// Render Programs
async function renderPrograms() {
    try {
        const res = await fetch(`${URL_BASED}/programs/program_get_data`)

        const programsList = document.getElementById('programsList');
        programsList.innerHTML = '';

        const data = await res.json()

        if(!res.ok) { return alert(data.message) }

        data.content.forEach((program, index) => {

            const { program_id, program_name, program_date_created } = program

            const card = document.createElement('div');
            card.className = 'program-card';
            card.innerHTML = `
                <div class="program-name">${program_name}</div>
                <button class="delete-btn" onclick="deleteProgram(${program_id}, '${program_name}')">
                    <svg viewBox="0 0 24 24">
                        <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
                    </svg>
                </button>
            `;
            programsList.appendChild(card);
        });

    } catch(err) {
        alert(err)
    }

}


function openAddModal() {
    document.getElementById('addModal').classList.add('active');
    document.getElementById('programNameInput').value = '';
    document.getElementById('programNameInput').focus();
}

function closeAddModal() {
    document.getElementById('addModal').classList.remove('active');
}

// Add Program
async function addProgram() {
    const inputField = document.getElementById('programNameInput');
    const programName = inputField.value.trim();

    if (!programName) {
        return Swal.fire({
            icon: 'warning',
            title: 'Missing Input',
            text: 'Please enter a program name.'
        });
    }

    // Show Loading
    Swal.fire({
        title: 'Processing...',
        didOpen: () => Swal.showLoading()
    });

    try {
        const res = await fetch(`${URL_BASED}/admin/add_program`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({ programName: programName })
        });

        const data = await res.json();

        if (!res.ok) {
            throw new Error(data.message || 'Failed to add program');
        }

        Swal.fire({
            icon: 'success',
            title: 'Success',
            text: 'New program added successfully!'
        });

        inputField.value = ''; 
        closeAddModal();       
        // Reload programs
        renderPrograms();

    } catch (error) {
        console.error('Add Program Error:', error);
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: error.message
        });
    }
}

// Delete Program
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
     // Show Loading
     Swal.fire({
        title: 'Processing...',
        didOpen: () => Swal.showLoading()
    });

    try {
        const response = await fetch(`${URL_BASED}/admin/delete_program/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Failed to delete program');
        }

        await Swal.fire(
            'Deleted!',
            `"${name}" has been deleted.`,
            'success'
        );

        renderPrograms()

    } catch (error) {
        console.error('Delete Error:', error);
        Swal.fire('Error', error.message, 'error');
    }
}


// No function yet
function goBack() {
    if (confirm('Are you sure you want to go back? Any unsaved changes will be lost.')) {
        window.history.back();
    }
}

// Close modal when clicking outside
document.getElementById('addModal').addEventListener('click', function(e) {
    if (e.target === this) {
        closeAddModal();
    }
});

// Manage Registration
function switchRole(role) {
    // Update active tab
    document.querySelectorAll('.role-tab').forEach(tab => {
        tab.classList.remove('active');
    });
    event.target.classList.add('active');

    // Show corresponding form
    document.querySelectorAll('.form-section').forEach(form => {
        form.classList.remove('active');
    });

    if (role === 'guard') {
        document.getElementById('guardForm').classList.add('active');
    } else if (role === 'teacher') {
        document.getElementById('teacherForm').classList.add('active');
    } else if (role === 'student') {
        document.getElementById('studentForm').classList.add('active');
    }
}

// Generate program on Teacher Selection
async function generateProgramSelectionOnTeacher() {
    try {
        const res = await fetch(`${URL_BASED}/programs/program_get_data`)
        const teacherDepartment = document.getElementById('teacher_department')
        teacherDepartment.innerHTML = '<option value="">Select Department</option>';

        const data = await res.json()

        if(!res.ok) { return alert(data.message) }

        data.content.forEach((program, index) => {
            const { program_name } = program
            const option = document.createElement('option')
            option.value = program_name
            option.textContent = program_name
            teacherDepartment.appendChild(option);
        });
    } catch(err) {
        alert(err)
    }
}


function goBack() {
    window.history.back();
}

// Reusable function to fetch accounts
async function fetchAccountCount(tableName) {
    try {
        const url = `${URL_BASED}/admin/get_whole_campus_accounts_count/${tableName}`;

        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        });

        const data = await response.json();

        if (!response.ok || !data.ok) {
            throw new Error(data.message || `Failed to fetch count for ${tableName}`);
        }

        return data.contents; 

    } catch (error) {
        console.error(`Error fetching ${tableName} count:`, error);
        return null; 
    }
}

// Fetch student accounts
async function fetchStudentAccounts() {
    const result = await fetchAccountCount('student_accounts');
    console.log("Student accounts: ", result);
    DOMElements.studentAccountCounts.textContent = result.length
    DOMElements.studentsList.innerHTML = result.map(d =>
        `
            <div class="student-card">
                    <div class="student-header">
                        <div>
                            <div class="student-name">${d.student_firstname} ${d.student_middlename}. ${d.student_lastname}</div>
                        </div>
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
                            )">Edit</button>
                            <button class="action-btn delete-btn-account-management" onclick="deleteStudent(${d.student_id})">Delete</button>
                        </div>
                    </div>
            </div>
        `
    ).join('')
}

// Edit Student Account Management
function editStudent(
    id, 
    student_id_number,
    student_firstname,
    student_middlename,
    student_lastname,
    student_program,
    student_year_level
) { 
    // Log to console to verify data is passing correctly (optional)
    console.log("Editing:", student_firstname, student_lastname);

    openStudentAccountManagementModal(
        id, 
        student_id_number, 
        student_firstname, 
        student_middlename,
        student_lastname, 
        student_program, 
        student_year_level
    );
}

// Edit Student Account Management
function editTeacher(
    id, 
    teacher_name,
    teacher_email,
    teacher_program,
    teacher_barcode_scanner_serial_number
) { 
    // Log to console to verify data is passing correctly (optional)
    console.log("Editing:", teacher_name, teacher_email);

    openTeacherAccountManagementModal(
        id, 
        teacher_name,
        teacher_email,
        teacher_program,
        teacher_barcode_scanner_serial_number
    );
}
// Edit Student Account Management
function editGuard(
    id, 
    guard_name,
    guard_email,
    guard_assigned_location
) { 
    // Log to console to verify data is passing correctly (optional)
    console.log("Editing:", guard_name, guard_email);

    openGuardAccountManagementModal(
        id, 
        guard_name,
        guard_email,
        guard_assigned_location
    );
}

// Open Student Modal
function openStudentAccountManagementModal(id, 
    student_id_number, 
    student_firstname, 
    student_middlename,
    student_lastname, 
    student_program, 
    student_year_level) {

    DOMElements.studentAccountManagementModal.style.display = "flex";
    DOMElements.studentIDTracking.value = id
    DOMElements.studentIdNumber.value = student_id_number
    DOMElements.studentFirstName.value = student_firstname
    DOMElements.studentMiddleName.value = student_middlename
    DOMElements.studentLastName.value = student_lastname
    DOMElements.studentProgram.value = student_program
    DOMElements.studentYearLevel.value = student_year_level

}

// Open Teacher Modal
function openTeacherAccountManagementModal(id, 
    teacher_name,
    teacher_email,
    teacher_program,
    teacher_barcode_scanner_serial_number) {

    DOMElements.teacherAccountManagementModal.style.display = "flex";
    DOMElements.teacherIDTracking.value = id
    DOMElements.teacherEmail.value = teacher_email
    DOMElements.teacherFullName.value = teacher_name
    DOMElements.teacherProgram.value = teacher_program
    DOMElements.teacherBarcodeSerialNumber.value = teacher_barcode_scanner_serial_number

}

// Open Guard Modal
function openGuardAccountManagementModal(id, 
    guard_name,
    guard_email,
    guard_assigned_location) {
    
    DOMElements.guardIDTracking.value = id;
    DOMElements.guardFullName.value = guard_name;
    DOMElements.guardEmail.value = guard_email;
    DOMElements.guardLocation.value = guard_assigned_location;
    DOMElements.guardAccountManagementModal.style.display = 'flex';
    
}

// Student Account Management Form
DOMElements.studentAccountManagementForm.addEventListener('submit', async function (e) {
    e.preventDefault();

    // 1. Updated keys to match what your Express backend expects
    const payload = {
        student_id: DOMElements.studentIDTracking.value,
        id_number: DOMElements.studentIdNumber.value.trim(),
        firstname: DOMElements.studentFirstName.value.trim(),
        middlename: DOMElements.studentMiddleName.value.trim(),
        lastname: DOMElements.studentLastName.value.trim(),
        program: DOMElements.studentProgram.value,
        year_level: DOMElements.studentYearLevel.value,
    };

    console.log(payload.program);
    // Show Loading
    Swal.fire({
        title: 'Processing...',
        didOpen: () => Swal.showLoading()
    });

    try {

        const res = await fetch(`${URL_BASED}/admin/edit_student_account/${payload.student_id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + TOKEN
            },
            // 3. Added the body payload
            body: JSON.stringify(payload)
        });

        const data = await res.json();

        // 4. Proper response handling
        if (!data.ok) {
            Swal.fire('Error!', data.message || 'Something went wrong.', 'error');
            return;
        }

        Swal.fire('Updated!', 'Record has been updated successfully.', 'success');

        DOMElements.studentAccountManagementForm.reset();
        closeRecordModal();
        fetchStudentAccounts();
        
    } catch (error) {
        console.error("Failed to update student:", error);
        Swal.fire('Error!', 'Failed to connect to the server.', 'error');
    }
});

// Teacher Account Management Form
DOMElements.teacherAccountManagementForm.addEventListener('submit', async function (e) {
    e.preventDefault();

    // 1. Updated keys to match what your Express backend expects
    const payload = {
        teacher_id: DOMElements.teacherIDTracking.value,
        teacher_name: DOMElements.teacherFullName.value,
        teacher_email: DOMElements.teacherEmail.value,
        teacher_program: DOMElements.teacherProgram.value
    };

    console.log(payload.teacher_program);
    // Show Loading
    Swal.fire({
        title: 'Processing...',
        didOpen: () => Swal.showLoading()
    });

    try {

        const res = await fetch(`${URL_BASED}/admin/edit_teacher_account/${payload.teacher_id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + TOKEN
            },
            // 3. Added the body payload
            body: JSON.stringify(payload)
        });

        const data = await res.json();

        // 4. Proper response handling
        if (!data.ok) {
            Swal.fire('Error!', data.message || 'Something went wrong.', 'error');
            return;
        }

        Swal.fire('Updated!', 'Record has been updated successfully.', 'success');

        DOMElements.teacherAccountManagementForm.reset();
        closeRecordModal();
        fetchTeacherAccounts();
        
    } catch (error) {
        console.error("Failed to update teacher:", error);
        Swal.fire('Error!', 'Failed to connect to the server.', 'error');
    }
});

// Guard Account Management Form
DOMElements.guardAccountManagementForm.addEventListener('submit', async function(e) {
    e.preventDefault();

    const payload = {
        guard_id: DOMElements.guardIDTracking.value,
        guard_name: DOMElements.guardFullName.value,
        guard_email: DOMElements.guardEmail.value,
        guard_designated_location: DOMElements.guardLocation.value
    };

    console.log(payload.guard_email);

    Swal.fire({
        title: 'Processing...',
        didOpen: () => Swal.showLoading()
    });

    try {

        const res = await fetch(`${URL_BASED}/admin/edit_guard_account/${payload.guard_id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + TOKEN
            },
            body: JSON.stringify(payload)
        });

        const data = await res.json();

        if (!data.ok) {
            Swal.fire('Error!', data.message || 'Something went wrong.', 'error');
            return;
        }

        Swal.fire('Updated!', 'Record has been updated successfully.', 'success');

        DOMElements.guardAccountManagementForm.reset();
        closeRecordModal();
        fetchGuardAccounts();
        
    } catch (error) {
        console.error("Failed to update guard:", error);
        Swal.fire('Error!', 'Failed to connect to the server.', 'error');
    }
});

// Close the Modal
function closeRecordModal() {
    DOMElements.studentAccountManagementModal.style.display = "none";
    DOMElements.teacherAccountManagementModal.style.display = 'none';
    DOMElements.guardAccountManagementModal.style.display = 'none';
}

// Fetch teacher accounts
async function fetchTeacherAccounts() {
    const result = await fetchAccountCount('teacher')
    DOMElements.teacherAccountCounts.textContent = result.length
    console.log('Teacher accounts: ', result);
    DOMElements.teacherList.innerHTML = result.map(d => 
        `
            <div class="teacher-card">
                <div class="teacher-header">
                    <div>
                        <div class="teacher-name">${d.teacher_name}</div>
                    </div>
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
        `
    ).join('')
}

// Fetch guard accounts
async function fetchGuardAccounts() {
    const result = await fetchAccountCount('guards')
    console.log('Guard accounts: ', result)
    DOMElements.guardAccountCounts.textContent = result.length
    DOMElements.guardList.innerHTML = result.map(d =>
        `
            <div class="teacher-card">
                <div class="guard-header">
                    <div>
                        <div class="guard-name">${d.guard_name}</div>
                    </div>
                </div>
                <div class="guard-info">
                    <div class="info-item"></div>
                </div>
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
        `
    ).join('')
    
}

// Guard Registration
document.getElementById('guardForm').addEventListener('submit', async function(e) {
    e.preventDefault();

    const fullName = document.getElementById('guard_fullname').value;
    const email = document.getElementById('guard_email').value;
    const password = document.getElementById('guard_password').value;
    const confirmPassword = document.getElementById('guard_confirm_password').value;
    const location = document.getElementById('guard_location').value;

    if(password !== confirmPassword){
        return Swal.fire({
            icon: 'error',
            title: 'Error',
            text: "Password doesn't match!"
        });
    }

    const guardData = {
        guard_name: fullName,
        guard_email: email,
        guard_password: password,
        guard_designated_location: location
    };
    // Show Loading
    Swal.fire({
        title: 'Processing...',
        didOpen: () => Swal.showLoading()
    });
    try {
        const res = await fetch(`${URL_BASED}/authentication/guard_registration`, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': 'Bearer ' + TOKEN
            },
            body: JSON.stringify(guardData)
        });

        const result = await res.json();

        if (!res.ok) {
            throw new Error(result.message || 'Registration failed');
        }

        Swal.fire({
            icon: 'success',
            title: 'Success',
            text: 'Guard registered successfully!'
        }).then(() => {
            fetchGuardAccounts();
        });
        
        document.getElementById('guardForm').reset();

    } catch (err) {
        console.error(err);
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: err.message
        });
    }
});

// Teacher Registration
document.getElementById('teacherForm').addEventListener('submit', async function(e) {
    e.preventDefault();

    const teacherFullName = document.getElementById('teacher_fullname').value;
    const teacherEmail = document.getElementById('teacher_email').value;
    const teacherPassword = document.getElementById('teacher_password').value;
    const confirmPassword = document.getElementById('confirm_password').value;
    const teacherDepartment = document.getElementById('teacher_department').value;

    if (teacherPassword !== confirmPassword) {
        return Swal.fire({
            icon: 'warning',
            title: 'Password Mismatch',
            text: ' The password and confirm password do not match.'
        });
    }

    const teacherData = {
        fullName: teacherFullName,
        email: teacherEmail,
        password: teacherPassword,
        department: teacherDepartment
    };
    // Show Loading
    Swal.fire({
        title: 'Processing...',
        didOpen: () => Swal.showLoading()
    });

    try {
        const res = await fetch(`${URL_BASED}/authentication/teacher_registration`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': 'Bearer ' + TOKEN
            },
            body: JSON.stringify(teacherData)
        });

        const data = await res.json();

        if (!res.ok) {
            return Swal.fire({
                icon: 'error',
                title: 'Registration Failed',
                text: data.message || 'Something went wrong.'
            });
        }

        Swal.fire({
            icon: 'success',
            title: 'Success!',
            text: 'Teacher registered successfully.'
        }).then(() => {
            fetchTeacherAccounts();
        });

        document.getElementById('teacherForm').reset();

    } catch (err) {
        console.error(err);
        Swal.fire({
            icon: 'error',
            title: 'Network Error',
            text: 'Could not connect to the server.'
        });
    }
});

// Student Registration
document.getElementById('studentForm').addEventListener('submit', async function(e) {
    e.preventDefault();

    const firstName = document.getElementById('std_firstname').value;
    const middleName = document.getElementById('std_middlename').value;
    const lastName = document.getElementById('std_lastname').value;
    const email = document.getElementById('std_email').value;
    const idNumber = document.getElementById('std_id_number').value;
    const program = document.getElementById('std_program').value;
    const yearLevel = document.getElementById('std_year_level').value;
    const guardianContact = document.getElementById('std_contact').value;
    const password = document.getElementById('std_password').value;
    const confirmPassword = document.getElementById('std_confirm_password').value;

    if (password !== confirmPassword) {
        console.warn('Password mismatch detected.');
        return Swal.fire({
            icon: 'warning',
            title: 'Password Mismatch',
            text: 'The password and confirm password do not match.'
        });
    }

    const studentData = {
        firstName, middleName, lastName, email, 
        idNumber, program, yearLevel, guardianContact, password
    };

    // Show Loading
    Swal.fire({
        title: 'Processing...',
        didOpen: () => Swal.showLoading()
    });

    try {
        const res = await fetch(`${URL_BASED}/authentication/student_registration`, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(studentData)
        });

        const data = await res.json();

        if (!res.ok) {
            throw new Error(data.message || 'Registration failed');
        }

        Swal.fire({
            icon: 'success',
            title: 'Welcome!',
            text: 'Student account created successfully.'
        });

        document.getElementById('studentForm').reset();

    } catch (err) {
        console.error('6. Error caught:', err);
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: err.message
        });
    }
});

// Set Event
async function handleSetEvent() {
    const eventInput = document.getElementById('event_name_input');
    const eventName = eventInput.value.trim();

    if (!TOKEN) {
        return Swal.fire({
            icon: 'error',
            title: 'Unauthorized',
            text: 'You must be logged in to perform this action.'
        }).then(() => {
            window.location.href = 'admin_login.html';
        });
    }

    if (!eventName) {
        return Swal.fire({
            icon: 'warning',
            title: 'Empty Input',
            text: 'Please enter an event name.'
        });
    }

    try {
        const response = await fetch(`${URL_BASED}/admin/set_event`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${TOKEN}` 
            },
            body: JSON.stringify({ event_name: eventName })
        });

        const data = await response.json();

        if (response.status === 401 || response.status === 403) {
            throw new Error('Session expired. Please login again.');
        }

        if (!response.ok) {
            throw new Error(data.message || 'Failed to set event');
        }

        await Swal.fire({
            icon: 'success',
            title: 'Event Set!',
            text: `Event successfully set to: "${eventName}"`,
            timer: 2000,
            showConfirmButton: false
        });

        eventInput.value = '';

    } catch (error) {
        console.error('Error setting event:', error);
        
        if (error.message.includes('Session expired')) {
             Swal.fire({
                icon: 'error',
                title: 'Session Expired',
                text: error.message
            }).then(() => {
                window.location.href = '../admin/admin_login.html';
            });
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: error.message
            });
        }
    }
}

// Search filter for Event Attendance
DOMElements.searchFilterEventAttendance.addEventListener('input', function() {
    const input = this.value.toLowerCase();
    const tr = DOMElements.attendanceBody.getElementsByTagName('tr');
    for(let i = 0; i < tr.length; i++) {
       if(tr[i].textContent.toLowerCase().includes(input)) {
        tr[i].style.display = '';
       } else {
        tr[i].style.display = 'none';
       }
    }
})

// Search filter for Event Attendance History
DOMElements.searchFilterEventAttendanceHistory.addEventListener('input', function() {
    const input = this.value.toLowerCase();
    const rows = DOMElements.attendanceHistory.getElementsByTagName('tr');
    for(let i = 0; i < rows.length; i++) {
        if(rows[i].textContent.toLowerCase().includes(input)) {
            rows[i].style.display = '';
        } else {
            rows[i].style.display = 'none';
        }
    }
})

// Year Filter
DOMElements.eventHistoryYearFilter.addEventListener('change', function() {
    const typed = this.value.toLowerCase();
    console.log(typed)
    const rows = DOMElements.attendanceHistory.getElementsByTagName('tr');
    for(let i = 0; i < rows.length; i++) {
        if(rows[i].textContent.toLowerCase().includes(typed)) {
            rows[i].style.display = ''
        } else {
            rows[i].style.display = 'none'
        }
    }
})

// Delete Student accounts
async function deleteStudent(id) {

    const confirm = await Swal.fire({
        icon: 'warning',
        title: 'Are you sure?',
        text: 'This action will permanently delete the student account.',
        showCancelButton: true,
        confirmButtonText: 'Yes, delete it',
        cancelButtonText: 'Cancel',
        confirmButtonColor: '#d33'
    });

    if (!confirm.isConfirmed) return;

    try {
        const res = await fetch(URL_BASED + `/admin/delete_student_account/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + TOKEN
            }
        });

        const data = await res.json();

        if (res.ok) {
            return Swal.fire({
                icon: 'success',
                title: 'Student Account Deleted',
                text: 'The student account has been successfully deleted.'
            }).then(() => {
                // Reload
                fetchStudentAccounts();
            });
        }

        // 401 - Unauthorized
        if (res.status === 401) {
            return Swal.fire({
                icon: 'error',
                title: 'Session Expired',
                text: 'Your session has expired. Please log in again.'
            }).then(() => {
                window.location.href = 'admin_login.html';
            });
        }

        // 403 - Forbidden
        if (res.status === 403) {
            return Swal.fire({
                icon: 'error',
                title: 'Access Denied',
                text: 'You do not have permission to delete student accounts.'
            });
        }

        // Other errors
        return Swal.fire({
            icon: 'error',
            title: 'Deletion Failed',
            text: data.message || 'An unexpected error occurred.'
        });

    } catch (err) {
        return Swal.fire({
            icon: 'error',
            title: 'Network Error',
            text: 'Unable to connect to the server. Please try again.'
        });
    }
}

// Delete Teacher accounts
async function deleteTeacher(id) {

    const confirm = await Swal.fire({
        icon: 'warning',
        title: 'Are you sure?',
        text: 'This action will permanently delete the teacher account.',
        showCancelButton: true,
        confirmButtonText: 'Yes, delete it',
        cancelButtonText: 'Cancel',
        confirmButtonColor: '#d33'
    });

    if (!confirm.isConfirmed) return;

    try {
        const res = await fetch(URL_BASED + `/admin/delete_teacher_account/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + TOKEN
            }
        });

        const data = await res.json();

        if (res.ok) {
            return Swal.fire({
                icon: 'success',
                title: 'Teacher Account Deleted',
                text: 'The teacher account has been successfully deleted.'
            }).then(() => {
                // Reload
                fetchTeacherAccounts();
            });
        }

        // 401 - Unauthorized
        if (res.status === 401) {
            return Swal.fire({
                icon: 'error',
                title: 'Session Expired',
                text: 'Your session has expired. Please log in again.'
            }).then(() => {
                window.location.href = 'admin_login.html';
            });
        }

        // 403 - Forbidden
        if (res.status === 403) {
            return Swal.fire({
                icon: 'error',
                title: 'Access Denied',
                text: 'You do not have permission to delete student accounts.'
            });
        }

        // Other errors
        return Swal.fire({
            icon: 'error',
            title: 'Deletion Failed',
            text: data.message || 'An unexpected error occurred.'
        });

    } catch (err) {
        return Swal.fire({
            icon: 'error',
            title: 'Network Error',
            text: 'Unable to connect to the server. Please try again.'
        });
    }
}

// Delete guard
async function deleteGuard(id) {
    const confirm = await Swal.fire({
        icon: 'warning',
        title: 'Are you sure?',
        text: 'This action will permanently delete the guard account.',
        showCancelButton: true,
        confirmButtonText: 'Yes, delete it',
        cancelButtonText: 'Cancel',
        confirmButtonColor: '#d33'
    });

    if (!confirm.isConfirmed) return;

    try {
        const res = await fetch(URL_BASED + `/admin/delete_guard_account/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + TOKEN
            }
        });

        const data = await res.json();

        if (res.ok) {
            return Swal.fire({
                icon: 'success',
                title: 'Teacher Account Deleted',
                text: 'The teacher account has been successfully deleted.'
            }).then(() => {
                // Reload
                fetchGuardAccounts();
            });
        }

        // 401 - Unauthorized
        if (res.status === 401) {
            return Swal.fire({
                icon: 'error',
                title: 'Session Expired',
                text: 'Your session has expired. Please log in again.'
            }).then(() => {
                window.location.href = 'admin_login.html';
            });
        }

        // 403 - Forbidden
        if (res.status === 403) {
            return Swal.fire({
                icon: 'error',
                title: 'Access Denied',
                text: 'You do not have permission to delete guard accounts.'
            });
        }

        // Other errors
        return Swal.fire({
            icon: 'error',
            title: 'Deletion Failed',
            text: data.message || 'An unexpected error occurred.'
        });

    } catch (err) {
        return Swal.fire({
            icon: 'error',
            title: 'Network Error',
            text: 'Unable to connect to the server. Please try again.'
        });
    }
}

// Edit Profile
async function editProfileName() {
    const currentName = DOMElements.adminProfileName.textContent
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
        const data = await fetch(`${URL_BASED}/admin/admin_change_name`,{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + TOKEN 
            },
            body: JSON.stringify({ newName })
        })
        if(!data) { return }
        Swal.fire({
            icon: 'success',
            title: 'Updated!',
            text: 'Name has been changed successfully'
        }).then(() => {
            // Reload Admin data
           getAdminData()
        })
    }
}

// Fetch Present Programs
async function fetchPrograms() {
    try {
        const res = await fetch(URL_BASED + '/admin/present_program_counts', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + TOKEN
            }
        })
        const data = await res.json()
        if(res.ok) {
            
            let programs = []
            let total_attended = []

            data.content.forEach(d => {
                programs.push(d.student_program)
                total_attended.push(d.total_attended)
            })
            return { programs, total_attended }

        } 
        // 401 - Unauthorized
        if (res.status === 401) {
            return Swal.fire({
                icon: 'error',
                title: 'Session Expired',
                text: 'Your session has expired. Please log in again.'
            }).then(() => {
                window.location.href = 'admin_login.html';
            });
        }

        // 403 - Forbidden
        if (res.status === 403) {
            return Swal.fire({
                icon: 'error',
                title: 'Access Denied',
                text: 'You do not have permission to delete student accounts.'
            });
        }

        // Other errors
        return Swal.fire({
            icon: 'error',
            title: 'Deletion Failed',
            text: data.message || 'An unexpected error occurred.'
        });

    } catch(err) {
        return Swal.fire({
            icon: 'error',
            title: 'Network Error',
            text: 'Unable to connect to the server. Please try again.'
        });
    }
}


// Chart
async function chart() {
    const result = await fetchPrograms()
    ctx = document.getElementById('myChart');
    Chart.register(ChartDataLabels);
    const myChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: result.programs,
            datasets: [{
                label: 'Event Attendance',
                data: result.total_attended,
                borderWidth: 1,
                backgroundColor: '#5a8a7a',
                borderColor: '#4e7c6d',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            animation: {
                duration: 1500
            },
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100
                }
            },
            plugins: {
                datalabels: {
                    color: '#000',        // number color
                    anchor: 'end',        // position relative to bar
                    align: 'top',         // place above bar
                    font: {
                        weight: 'bold',
                        size: 14
                    },
                    formatter: function(value) {
                        return value; // add % symbol
                    }
                }
            }
        }
    });
}

// Search filter teacher accounts
function searchFilterTeachersAccounts() {
    let input = DOMElements.searchFilterTeachersAccounts.value.toLowerCase();
    let cards = document.querySelectorAll("#teacherList .teacher-card");

    cards.forEach(function(card) {
        let name = card.querySelector(".teacher-name").textContent.toLowerCase();
        let email = card.querySelector(".info-item").textContent.toLowerCase();
        let course = card.querySelector(".teacher-course").textContent.toLowerCase();

        if (name.includes(input) || email.includes(input) || course.includes(input)) {
            card.style.display = "block";
        } else {
            card.style.display = "none";
        }
    });
}

// Search filter student accounts
function searchFilterStudentsAccounts() {
    let input = DOMElements.searchFilterStudentsAccounts.value.toLowerCase();
    let cards = document.querySelectorAll("#studentsList .student-card");

    cards.forEach(function(card) {
        let name = card.querySelector(".student-name").textContent.toLowerCase();
        let email = card.querySelector(".student-info").textContent.toLowerCase();
        let course = card.querySelector(".student-course").textContent.toLowerCase();

        if (name.includes(input) || email.includes(input) || course.includes(input)) {
            card.style.display = "block";
        } else {
            card.style.display = "none";
        }
    });
}

// Search filter guard accounts
function searchFilterGuardAccounts() {
    let input = DOMElements.searchFilterGuardAccounts.value.toLowerCase();
    let cards = document.querySelectorAll("#guardList .teacher-card");

    cards.forEach(function(card) {
        let name = card.querySelector(".guard-name").textContent.toLowerCase();
        let domainGate = card.querySelector(".guard-domain-gate").textContent.toLowerCase();

        if (name.includes(input) || domainGate.includes(input)) {
            card.style.display = "block";
        } else {
            card.style.display = "none";
        }
    });
}

