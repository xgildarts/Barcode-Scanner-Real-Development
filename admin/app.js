
document.addEventListener('DOMContentLoaded', () => {
    navigateTo('dashboard')
    // Initial render
    renderPrograms();
    fetchStudentAccounts()
    fetchTeacherAccounts()
    fetchGuardAccounts()
})

const sidebar = document.getElementById('sidebar');
const sidebarOverlay = document.getElementById('sidebarOverlay');
const menuBtn = document.querySelector('.menu-btn');

const TOKEN = localStorage.getItem('admin_token');

const DOMElements = {
    studentAccountCounts: document.getElementById('studentAccountCounts'),
    teacherAccountCounts: document.getElementById('teacherAccountCounts'),
    guardAccountCounts: document.getElementById('guardAccountCounts'),
    studentsList: document.getElementById('studentsList'),
    teacherList: document.getElementById('teacherList'),
    guardList: document.getElementById('guardList')
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
    clickOpens: false, // ⛔ don't open on input click
    allowInput: false,
    onChange: function(selectedDates, dateStr) {
        const rows = document.querySelectorAll('#attendanceBody tr');

        rows.forEach(row => {
            const dateCell = row.children[6].textContent.trim();
            row.style.display = dateCell === dateStr ? '' : 'none';
        });
    }
});

// Settings
function editField(field) {
    const newValue = prompt(`Enter new ${field}:`);
    if (newValue) {
        alert(`${field} updated successfully!`);
        // Update the display value here
    }
}

function updatePassword() {
    const current = document.getElementById('currentPassword').value;
    const newPass = document.getElementById('newPassword').value;
    const confirm = document.getElementById('confirmPassword').value;

    if (!current || !newPass || !confirm) {
        alert('Please fill in all password fields.');
        return;
    }

    if (newPass !== confirm) {
        alert('New passwords do not match!');
        return;
    }

    if (newPass.length < 8) {
        alert('Password must be at least 8 characters long!');
        return;
    }

    alert('Password updated successfully!');
    document.getElementById('currentPassword').value = '';
    document.getElementById('newPassword').value = '';
    document.getElementById('confirmPassword').value = '';
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
            localStorage.removeItem('admin_token');
            localStorage.removeItem('admin_user'); 
            window.location.href = 'admin_login.html';
        }
    });
}


document.querySelector('.calendar-btn').addEventListener('click', () => {
    calendar.open();
});

document.querySelector('.settings-btn').addEventListener('click', function() {
    
});

// Render students
function renderStudents(studentsToRender) {
    const studentsList = document.getElementById('studentsList');
    studentsList.innerHTML = '';

    studentsToRender.forEach((student, index) => {
        const card = document.createElement('div');
        card.className = 'student-card';
        card.innerHTML = `
            <div class="student-header">
                <div>
                    <div class="student-name">${student.name}</div>
                </div>
            </div>
            <div class="student-info">
                <div class="info-item">${student.id}</div>
            </div>
            <div class="student-meta">
                <div class="student-course">${student.course}</div>
                <div class="student-actions">
                    <button class="action-btn edit-btn-account-management" onclick="editStudent(${index})">Edit</button>
                    <button class="action-btn delete-btn-account-management" onclick="deleteStudent(${index})">Delete</button>
                </div>
            </div>
        `;
        studentsList.appendChild(card);
    });
}

function editStudent(index) {
    alert(`Editing ${students[index].name}`);
}

function deleteStudent(index) {
    if (confirm(`Are you sure you want to delete ${students[index].name}?`)) {
        students.splice(index, 1);
        renderStudents(students);
        alert('Student deleted successfully!');
    }
}

function register() {
    navigateTo("registration");
}

document.getElementById('searchStudentInput').addEventListener('input', function(e) {
    const searchStudent = e.target.value.toLowerCase();
    const filteredStudents = students.filter(student => 
        student.name.toLowerCase().includes(searchStudent) ||
        student.id.toLowerCase().includes(searchStudent)
    );
    renderStudents(filteredStudents);
});

document.getElementById('searchTeacherInput').addEventListener('input', (e) => {
    const searchTeacher = e.target.value.toLowerCase();
    const filteredTeachers = teachers.filter(teacher => 
        teacher.name.toLowerCase().includes(searchTeacher) ||
        teacher.id.toLowerCase().includes(searchTeacher)
    );
    
    renderTeachers(filteredTeachers);
});

document.getElementById('searchGuardInput').addEventListener('input', function(e) {
    const searchGuard = e.target.value.toLowerCase();
    const filteredGuards = guards.filter(guard => 
        guard.name.toLowerCase().includes(searchGuard) ||
        guard.id.toLowerCase().includes(searchGuard)
    );
    renderStudents(filteredGuards);
});

// Render Programs
async function renderPrograms() {
    try {
        const res = await fetch('http://localhost:3000/api/v1/programs/program_get_data')

        const programsList = document.getElementById('programsList');
        programsList.innerHTML = '';

        const data = await res.json()

        console.log(data)

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

    try {
        const res = await fetch('http://localhost:3000/api/v1/admin/add_program', {
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

    try {

        const response = await fetch(`http://localhost:3000/api/v1/admin/delete_program/${id}`, {
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
        const res = await fetch('http://localhost:3000/api/v1/programs/program_get_data')
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
generateProgramSelectionOnTeacher()

function goBack() {
    window.history.back();
}

// Reusable function to fetch accounts
async function fetchAccountCount(tableName) {
    try {
        const url = `http://localhost:3000/api/v1/admin/get_whole_campus_accounts_count/${tableName}`;

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
    const result = await fetchAccountCount('student_accounts')
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
                            <button class="action-btn edit-btn-account-management" onclick="editStudent(${d.student_id})">Edit</button>
                            <button class="action-btn delete-btn-account-management" onclick="deleteStudent(${d.student_id})">Delete</button>
                        </div>
                    </div>
            </div>
        `
    ).join('')
}

// Fetch teacher accounts
async function fetchTeacherAccounts() {
    const result = await fetchAccountCount('teacher')
    DOMElements.teacherAccountCounts.textContent = result.length
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
                        <button class="action-btn edit-btn-account-management" onclick="editStudent(${d.teacher_id})">Edit</button>
                        <button class="action-btn delete-btn-account-management" onclick="deleteStudent(${d.teacher_id})">Delete</button>
                    </div>
                </div>
            </div>
        `
    ).join('')
}

// Fetch guard accounts
async function fetchGuardAccounts() {
    const result = await fetchAccountCount('guards')
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
                        <button class="action-btn edit-btn-account-management" onclick="editStudent(${d.guard_id})">Edit</button>
                        <button class="action-btn delete-btn-account-management" onclick="deleteStudent(${d.guard_id})">Delete</button>
                    </div>
                </div>
            </div>
        `
    ).join('')
    
}

// Handle form submissions
document.getElementById('guardForm').addEventListener('submit', async function(e) {
    e.preventDefault();

    const fullName = document.getElementById('guard_fullname').value;
    const email = document.getElementById('guard_email').value;
    const password = document.getElementById('guard_password').value;
    const location = document.getElementById('guard_location').value;

    const guardData = {
        guard_name: fullName,
        guard_email: email,
        guard_password: password,
        guard_designated_location: location
    };

    try {
        const res = await fetch('http://localhost:3000/api/v1/authentication/guard_registration', {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Accept': 'application/json' 
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

    try {
        const res = await fetch('http://localhost:3000/api/v1/authentication/teacher_registration', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
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


    try {
        const res = await fetch('http://localhost:3000/api/v1/authentication/student_registration', {
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
            window.location.href = 'admin_login.html'; // Redirect to login
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
        const response = await fetch('http://localhost:3000/api/v1/admin/set_event', {
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
                window.location.href = 'login.html';
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