
// Dashboard
const sidebar = document.getElementById('sidebar');
const sidebarOverlay = document.getElementById('sidebarOverlay');
const menuBtn = document.getElementById('menuBtn');

const token = localStorage.getItem('teacher_token')

menuBtn.addEventListener('click', function() {
    sidebar.classList.toggle('active');
    sidebarOverlay.classList.toggle('active');
});

sidebarOverlay.addEventListener('click', function() {
    sidebar.classList.remove('active');
    sidebarOverlay.classList.remove('active');
});

// Get total students
async function getTotalStudents() {
    try {
        const res = await fetch('http://localhost:3000/api/v1/teacher/get_students_total_count', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            }
        })
        const data = await res.json()
        // Set Dashboard total student number
        console.log(data)
        if(!res.ok) { return alert(data.message) }
        document.getElementById('totalStudents').textContent = data.content[0].total

    } catch(err) {
        alert(err)
    }
}

// Load Student Registered
async function loadStudentsRegistered() {
    try {
        const res = await fetch('http://localhost:3000/api/v1/teacher/get_student_registered', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            }
        });
        const data = await res.json();

        const tbody = document.getElementById('studentsBody');
        tbody.innerHTML = '';

        data.content.forEach(student => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${student.student_id_number}</td>
                <td>${student.student_firstname}</td>
                <td>${student.student_middlename || '-'}</td>
                <td>${student.student_lastname}</td>
                <td>${student.student_program}</td>
                <td>${student.student_year_level}</td>
                <td>${student.date_created}</td>
                <td>
                    <div class="action-btns">
                        <button class="edit-btn" onclick="editStudent('${student.student_id_number}')">
                            Edit
                        </button>
                        <button class="delete-btn-student-registered" onclick="deleteStudent('${student.student_id_number}')">
                            Delete
                        </button>
                    </div>
                </td>
            `;
            tbody.appendChild(tr);
        });

    } catch (error) {
        console.error('Error loading students:', error);
    }
}

// Format Time
function formatTime(timeString) {
    let [h, m] = timeString.split(':');
    h = parseInt(h, 10);
    let ampm = h >= 12 ? 'PM' : 'AM';
    h = h % 12 || 12; // Convert 0 to 12 for midnight
    return `${h}:${m} ${ampm}`;
}

// Modal for Add Student
function openAddStudentModal() {
    document.getElementById('addStudentModal').style.display = 'flex';
}

function closeAddStudentModal() {
    document.getElementById('addStudentModal').style.display = 'none';
}

function logout() {
    Swal.fire({
        title: 'Are you sure?',
        text: 'You will be logged out of your account',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Yes, log out',
        cancelButtonText: 'Cancel'
    }).then((result) => {
        if (result.isConfirmed) {

            // Clear stored tokens
            localStorage.removeItem('teacher_token');

            Swal.fire({
                icon: 'success',
                title: 'Logged out',
                text: 'You have been successfully logged out',
                timer: 1500,
                showConfirmButton: false
            }).then(() => {
                window.location.href = 'teacher_login.html';
            });
        }
    });
}

// Subject and Year Level Setter
async function subjectAndYearLevelSetter() {

    const subject = document.getElementById('courseFilter').value
    const yearLevel = document.getElementById('yearFilter').value

    // Confirmation before submission
    const confirmResult = await Swal.fire({
        title: 'Are you sure?',
        text: 'This will update the subject and year level.',
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Yes, submit',
        cancelButtonText: 'Cancel',
        reverseButtons: true
    })

    // Stop if cancelled
    if (!confirmResult.isConfirmed) return

    try {
        const res = await fetch('http://localhost:3000/api/v1/teacher/teacher_subject_and_year_level_setter', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            },
            body: JSON.stringify({ subject, yearLevel })
        })

        const data = await res.json()

        if (res.ok) {
            Swal.fire({
                title: 'Success!',
                text: data.message,
                icon: 'success'
            })
        } else {
            Swal.fire({
                title: 'Error',
                text: data.message,
                icon: 'error'
            })
        }

    } catch (err) {
        Swal.fire({
            title: 'Something went wrong',
            text: err.message || 'Please try again later.',
            icon: 'error'
        })
    }
}


// Add Student Form
document.getElementById('registrationForm').addEventListener('submit', async function(event) {
    event.preventDefault();

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

    if (!studentData.student_email.endsWith('@panpacificu.edu.ph')) {
        alert('Please use a valid Panpacific University email.');
        return;
    }

    try {
        const res = await fetch('http://localhost:3000/api/v1/teacher/add_student', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            },
            body: JSON.stringify(studentData)
        })
        const data = await res.json()
        if(res.ok) {
            alert(data.message)
            // Update
            loadStudentsRegistered()
        } else {
            alert(data.message)
        }
    } catch(err) {
        alert(err)
    }
    
    this.reset();
});

document.querySelectorAll('.close-btn').forEach(btn => {
    btn.addEventListener('click', function(e) {
        e.target.closest('.stat-card').style.display = 'none';
    });
});



// Navigation Shifting Logic
function navigateTo(navName) {

    //For debugging purposes
    console.log(navName)

    const headerTitle = document.getElementById('headerTitle')

    const navs = [ 
        'dashboard', 
        'location', 
        'attendanceNow', 
        'history', 
        'studentRegistered', 
        'manualEntry', 
        'eventAttendance', 
        'eventHistory', 
        'academicSetup',
        'settings' ]

        switch(navName) {
            case 'dashboard':
                headerTitle.textContent = 'Dashboard'
                break
            case 'location':
                headerTitle.textContent = 'Location'
                break
            case 'attendanceNow':
                headerTitle.textContent = 'Attendance'
                break
            case 'history':
                headerTitle.textContent = 'Attendance History'
                break    
            case 'studentRegistered':
                headerTitle.textContent = 'Student Records'
                break  
            case 'manualEntry':
                headerTitle.textContent = 'Manual Entry'
                break   
            case 'eventAttendance':
                headerTitle.textContent = 'Event Attendance'
                break  
            case 'eventHistory':
                headerTitle.textContent = 'Event Attendance History'
                break
            case 'academicSetup':
                headerTitle.textContent = 'Academic Setup'
                break
            case 'settings':
                headerTitle.textContent = 'Settings'
                break

        }
    
    navs.forEach(nav => {
        if(nav == navName) {
            document.getElementById(nav).classList.add('active')
        } else {
            document.getElementById(nav).classList.remove('active')
        }
    })

    sidebar.classList.remove('active');
    sidebarOverlay.classList.remove('active');

}

// Set Location
const radiusSlider = document.getElementById('radiusSlider');
const radiusValue = document.getElementById('radiusValue');
const radiusCircle = document.querySelector('.radius-circle');

radiusSlider.addEventListener('input', function() {
    const value = this.value;
    radiusValue.textContent = value;
    
    // Update slider gradient
    const percentage = ((value - 10) / (100 - 10)) * 100;
    this.style.background = `linear-gradient(to right, #5a8a7a 0%, #5a8a7a ${percentage}%, #e0e0e0 ${percentage}%, #e0e0e0 100%)`;
    
    // Update circle size
    const circleSize = 100 + (value - 10) * 2;
    radiusCircle.style.width = circleSize + 'px';
    radiusCircle.style.height = circleSize + 'px';
});

function setLocation() {
    const radius = document.getElementById('radiusValue').textContent;
    alert(`Location set with ${radius} meters radius!`);
    // Here you would save the location and radius
}

function cancel() {
    if (confirm('Are you sure you want to cancel?')) {
        window.history.back();
    }
}

// Initialize slider gradient
radiusSlider.dispatchEvent(new Event('input'));

// Teacher Attendance
function toggleSelectAll() {
    const selectAll = document.getElementById('selectAll');
    const checkboxes = document.querySelectorAll('.row-checkbox');
    
    checkboxes.forEach(checkbox => {
        checkbox.checked = selectAll.checked;
    });
    
    updateProgress();
}

function updateProgress() {
    const checkboxes = document.querySelectorAll('.row-checkbox');
    const checked = document.querySelectorAll('.row-checkbox:checked').length;
    const total = checkboxes.length;
    const percentage = (checked / total) * 100;
    
    document.getElementById('progressFill').style.width = percentage + '%';
}

function applyFilters() {
    alert('Filters applied! Loading students...');
    // Here you would load students based on selected course and year
}

function printAttendance() {
    window.print();
}

function saveAttendance() {
    const checked = document.querySelectorAll('.row-checkbox:checked').length;
    alert(`Attendance saved! ${checked} students marked as present.`);
}

document.getElementById('searchInput').addEventListener('input', function() {
    // Search functionality would be implemented here
});


// Attendance history

document.getElementById('searchInput').addEventListener('input', function() {
    const searchTerm = this.value.toLowerCase();
    const rows = document.querySelectorAll('#attendanceBody tr');
    
    rows.forEach(row => {
        const text = row.textContent.toLowerCase();
        row.style.display = text.includes(searchTerm) ? '' : 'none';
    });
});

document.getElementById('subjectFilter').addEventListener('change', function() {
    const subject = this.value;
    alert(`Filtering by subject: ${subject || 'All'}`);
    // Here you would filter the data
});

document.getElementById('statusFilter').addEventListener('change', function() {
    const status = this.value;
    alert(`Filtering by status: ${status || 'All'}`);
    // Here you would filter the data
});

function exportToExcel() {
    alert('Exporting attendance history to Excel...');
    // Here you would implement Excel export
}

// Event Attendance
function toggleSelectAll() {
    const selectAll = document.getElementById('selectAll');
    const checkboxes = document.querySelectorAll('.row-checkbox');
    
    checkboxes.forEach(checkbox => {
        checkbox.checked = selectAll.checked;
    });
}

document.getElementById('searchInput').addEventListener('input', function() {
    const searchTerm = this.value.toLowerCase();
    const rows = document.querySelectorAll('#attendanceBody tr');
    
    rows.forEach(row => {
        const text = row.textContent.toLowerCase();
        row.style.display = text.includes(searchTerm) ? '' : 'none';
    });
});

function printAttendance() {
    window.print();
}

function saveAttendance() {
    const checked = document.querySelectorAll('.row-checkbox:checked').length;
    alert(`Event attendance saved! ${checked} students marked as present.`);
}

// Student Registered
document.getElementById('searchInput').addEventListener('input', function() {
    const searchTerm = this.value.toLowerCase();
    const rows = document.querySelectorAll('#studentsBody tr');
    
    rows.forEach(row => {
        const text = row.textContent.toLowerCase();
        row.style.display = text.includes(searchTerm) ? '' : 'none';
    });
});

function printList() {
    window.print();
}

function editStudent(id) {
    alert(`Editing student with ID: ${id}`);
    // Here you would open an edit form
}

function deleteStudent(id) {
    if (confirm(`Are you sure you want to delete student with ID: ${id}?`)) {
        alert(`Student ${id} deleted successfully!`);
        // Here you would delete the student from database
    }
}

// Manual Entry

const students = [
    { name: 'Emily D. Chu', year: 1 },
    { name: 'Miguel E. Torres', year: 1 },
    { name: 'Kristine F. Navarro', year: 1 },
    { name: 'Sarah N. Panganiban', year: 1 },
    { name: 'Jasmine T. Castillo', year: 1 },
    { name: 'Paolo M. Garcia', year: 1 },
    { name: 'Maria S. Santos', year: 1 },
    { name: 'Andrea A. Lachica', year: 1 },
    { name: 'Charlmea M. Selga', year: 1 },
    { name: 'Steven John A. Agustin', year: 1 },
    { name: 'Jan Ray A. Aquino', year: 1 },
    { name: 'Clarissa M. Padilla', year: 1 },
    { name: 'Faith E. Robles', year: 1 }
];

let attendanceStatus = {};

function renderStudents(studentsToShow) {
    const studentList = document.getElementById('studentList');
    studentList.innerHTML = '';

    studentsToShow.forEach((student, index) => {
        const row = document.createElement('div');
        row.className = 'student-row';
        
        const status = attendanceStatus[student.name];
        const presentActive = status === 'present' ? 'active' : '';
        const absentActive = status === 'absent' ? 'active' : '';
        
        row.innerHTML = `
            <div class="student-name">${student.name}</div>
            <div class="year-level">${student.year}</div>
            <div class="action-buttons">
                <button class="status-btn present-btn ${presentActive}" onclick="markPresent('${student.name}')" ${status === 'present' ? 'disabled' : ''}>
                    <svg viewBox="0 0 24 24">
                        <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                    </svg>
                    Present
                </button>
                <button class="status-btn absent-btn ${absentActive}" onclick="markAbsent('${student.name}')" ${status === 'absent' ? 'disabled' : ''}>
                    <svg viewBox="0 0 24 24">
                        <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                    </svg>
                    Absent
                </button>
            </div>
        `;
        studentList.appendChild(row);
    });
}

function markPresent(name) {
    attendanceStatus[name] = 'present';
    renderStudents(students);
}

function markAbsent(name) {
    attendanceStatus[name] = 'absent';
    renderStudents(students);
}

document.getElementById('searchInput').addEventListener('input', function() {
    const searchTerm = this.value.toLowerCase();
    const filtered = students.filter(student => 
        student.name.toLowerCase().includes(searchTerm)
    );
    renderStudents(filtered);
});


// Teacher Event Attendance History
document.getElementById('searchInput').addEventListener('input', function() {
    const searchTerm = this.value.toLowerCase();
    const rows = document.querySelectorAll('#attendanceBody tr');
    
    rows.forEach(row => {
        const text = row.textContent.toLowerCase();
        row.style.display = text.includes(searchTerm) ? '' : 'none';
    });
});

function switchTab(tab) {
    // Update active tab
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');

    // Filter or sort by selected tab
    alert(`Filtering by: ${tab}`);
}

function exportToExcel() {
    alert('Exporting event attendance history to Excel...');
}

// Academic Management
let subjects = [
    'Big Data',
    'Event-Driven Programming',
    'Digital Marketing',
    'Integrative Programming'
];

function renderPrograms() {
    const programsList = document.getElementById('programsList');
    programsList.innerHTML = '';

    subjects.forEach((program, index) => {
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


document.addEventListener('DOMContentLoaded', () => {
// Startup
navigateTo('dashboard')
// Initial render
renderStudents(students);
// Render Academic Setup
renderPrograms()
// Load Student Registered
loadStudentsRegistered()
// Load Total Students
getTotalStudents()
})