
document.addEventListener('DOMContentLoaded', () => {
    navigateTo('dashboard')
})

const sidebar = document.getElementById('sidebar');
const sidebarOverlay = document.getElementById('sidebarOverlay');
const menuBtn = document.querySelector('.menu-btn');

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
    if (confirm('Are you sure you want to log out?')) {
        alert('Logging out...');
        // Redirect to login page
    }
}

// Open calendar ONLY when button is clicked
document.querySelector('.calendar-btn').addEventListener('click', () => {
    calendar.open();
});

document.querySelector('.settings-btn').addEventListener('click', function() {
    
});

// Student account management
const students = [
    {
        name: 'Steven John A. Agustin',
        id: 'BSIT - 3rd Year',
        course: 'Bachelor of Science in Information Technology'
    },
    {
        name: 'Andrea A. Lachica',
        id: 'BSIT - 3rd Year',
        course: 'Bachelor of Science in Information Technology'
    },
    {
        name: 'Charlene M. Selga',
        id: 'BSCE - 1st Year',
        course: 'Bachelor of Science in Computer Engineering'
    },
    {
        name: 'Jethrey A. Aquino',
        id: 'BSIT - 2nd Year',
        course: 'Bachelor of Science in Information Technology'
    }
];

// Teacher account management
const teachers = [
    {
        name: 'Maria L. Santos',
        email: 'maria@gmail.com',
        advisory: 'BSIT'
    },
    {
        name: 'Mark D. Lim',
        email: 'mark@gmail.com',
        advisory: 'SHS - Stem 12'
    },
    {
        name: 'Charlene M. Selga',
        email: 'pat@gmail.com',
        advisory: 'BSCS'
    },
    {
        name: 'Karen D. Reyes',
        email: 'karen@gmail.com',
        advisory: 'BSIT'
    }
];

// Teacher account management
const guards = [
    {
        name: 'Juan M. Cruz',
        domainGate: 'MAIN GATE'
    },
    {
        name: 'Mark D. Santos',
        domainGate: 'BACK GATE'
    },
    {
        name: 'Ralph K. Lim',
        domainGate: 'BACK GATE'
    },
    {
        name: 'Lucas D. Lee',
        domainGate: 'MAIN GATE'
    }
];


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


// Render teachers
function renderTeachers(teachersToRender) {
    const teacherList = document.getElementById('teacherList');
    teacherList.innerHTML = '';

    teachersToRender.forEach((teacher, index) => {
        const card = document.createElement('div');
        card.className = 'teacher-card';
        card.innerHTML = `
            <div class="teacher-header">
                <div>
                    <div class="teacher-name">${teacher.name}</div>
                </div>
            </div>
            <div class="teacher-info">
                <div class="info-item">${teacher.email}</div>
            </div>
            <div class="teacher-meta">
                <div class="teacher-course">${teacher.advisory}</div>
                <div class="teacher-actions">
                    <button class="action-btn edit-btn-account-management" onclick="editStudent(${index})">Edit</button>
                    <button class="action-btn delete-btn-account-management" onclick="deleteStudent(${index})">Delete</button>
                </div>
            </div>
        `;
        teacherList.appendChild(card);
    });
}

// Render guards
function renderGuards(guardsToRender) {
    const guardsList = document.getElementById('guardList');
    guardsToRender.innerHTML = '';

    guardsToRender.forEach((guard, index) => {
        const card = document.createElement('div');
        card.className = 'teacher-card';
        card.innerHTML = `
            <div class="guard-header">
                <div>
                    <div class="guard-name">${guard.name}</div>
                </div>
            </div>
            <div class="guard-info">
                <div class="info-item"></div>
            </div>
            <div class="guard-meta">
                <div class="guard-domain-gate">${guard.domainGate}</div>
                <div class="guard-actions">
                    <button class="action-btn edit-btn-account-management" onclick="editStudent(${index})">Edit</button>
                    <button class="action-btn delete-btn-account-management" onclick="deleteStudent(${index})">Delete</button>
                </div>
            </div>
        `;
        guardsList.appendChild(card);
    });
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

// Initial render
renderStudents(students);
renderTeachers(teachers);
renderGuards(guards);


// Academic Setup
let programs = [
    'Bachelor of Science in Nursing',
    'Bachelor of Science in Tourism Management',
    'Bachelor of Science (BS) in Aviation',
    'Bachelor of Science in Culinary'
];

function renderPrograms() {
    const programsList = document.getElementById('programsList');
    programsList.innerHTML = '';

    programs.forEach((program, index) => {
        const card = document.createElement('div');
        card.className = 'program-card';
        card.innerHTML = `
            <div class="program-name">${program}</div>
            <button class="delete-btn" onclick="deleteProgram(${index})">
                <svg viewBox="0 0 24 24">
                    <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
                </svg>
            </button>
        `;
        programsList.appendChild(card);
    });
}

function openAddModal() {
    document.getElementById('addModal').classList.add('active');
    document.getElementById('programNameInput').value = '';
    document.getElementById('programNameInput').focus();
}

function closeAddModal() {
    document.getElementById('addModal').classList.remove('active');
}

function addProgram() {
    const input = document.getElementById('programNameInput');
    const programName = input.value.trim();

    if (!programName) {
        alert('Please enter a program name.');
        return;
    }

    programs.push(programName);
    renderPrograms();
    closeAddModal();
}

function deleteProgram(index) {
    if (confirm(`Are you sure you want to delete "${programs[index]}"?`)) {
        programs.splice(index, 1);
        renderPrograms();
    }
}

function saveChanges() {
    alert('Changes saved successfully!');
    // Here you would typically send the data to a server
}

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

// Initial render
renderPrograms();


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

function goBack() {
    window.history.back();
}

// Handle form submissions
document.getElementById('guardForm').addEventListener('submit', function(e) {
    e.preventDefault();
    alert('Guard registered successfully!');
});

document.getElementById('teacherForm').addEventListener('submit', function(e) {
    e.preventDefault();
    alert('Teacher registered successfully!');
});

document.getElementById('studentForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const password = e.target.querySelector('input[placeholder="Password"]').value;
    const confirmPassword = e.target.querySelector('input[placeholder="Confirm Password"]').value;
    
    if (password !== confirmPassword) {
        alert('Passwords do not match!');
        return;
    }
    
    alert('Student registered successfully!');
});