// ============================================================
// CONSTANTS & CONFIG
// ============================================================
const URL_BASED = 'https://32g7g83w-3000.asse.devtunnels.ms/api/v1';
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

    // Profile / Settings
    sideBarName: document.querySelector('.sidebar-name'),
    profileName: document.querySelector('.profile-name'),
    adminProfileName: document.getElementById('adminProfileName'),
    profileEmailTop: document.getElementById('profileEmailTop'),
    adminAvatar: document.getElementById('adminAvatar'),
    sidebarAvatar: document.getElementById('sidebarAvatar'),

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
        window.location.href = 'admin_login.html';
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
    renderPrograms();
    renderYearLevels();
    fetchStudentAccounts();
    fetchTeacherAccounts();
    fetchGuardAccounts();
    renderEventAttendanceRecord();
    renderEventHistoryAttendanceRecord();
    generateProgramSelectionOnTeacher();
    generateYearLevelSelections();
    initChart();
    initEventListeners();

    // Wire admin profile picture upload
    const picInput = document.getElementById('adminProfilePicInput');
    if (picInput) picInput.addEventListener('change', () => uploadAdminProfilePicture(picInput));
});

// ============================================================
// ADMIN PROFILE PICTURE
// ============================================================
async function uploadAdminProfilePicture(input) {
    const file = input.files[0];
    if (!file) return;

    // Compress via canvas before upload
    const reader = new FileReader();
    reader.onload = async (e) => {
        const img = new Image();
        img.onload = async () => {
            const MAX = 800;
            let w = img.width, h = img.height;
            if (w > MAX || h > MAX) {
                if (w > h) { h = Math.round(h * MAX / w); w = MAX; }
                else       { w = Math.round(w * MAX / h); h = MAX; }
            }
            const canvas = document.createElement('canvas');
            canvas.width = w; canvas.height = h;
            canvas.getContext('2d').drawImage(img, 0, 0, w, h);

            // Preview immediately
            const previewSrc = canvas.toDataURL('image/jpeg', 0.8);
            const previewHTML = `<img src="${previewSrc}" style="width:100%;height:100%;object-fit:cover;border-radius:inherit;">`;
            if (DOM.adminAvatar)   DOM.adminAvatar.innerHTML   = previewHTML;
            if (DOM.sidebarAvatar) DOM.sidebarAvatar.innerHTML = previewHTML;

            canvas.toBlob(async (blob) => {
                const formData = new FormData();
                formData.append('admin_profile_picture', blob, 'admin-avatar.jpg');

                try {
                    const res = await fetch(`${URL_BASED}/admin/upload_profile_picture`, {
                        method: 'POST',
                        headers: { 'Authorization': `Bearer ${TOKEN}` },
                        body: formData
                    });
                    const data = await res.json();
                    if (!data.ok) throw new Error(data.message);
                    Swal.fire({ toast: true, position: 'top-end', icon: 'success', title: 'Profile picture updated!', showConfirmButton: false, timer: 2000 });
                } catch (err) {
                    Swal.fire({ icon: 'error', title: 'Upload Failed', text: err.message });
                }
                input.value = '';
            }, 'image/jpeg', 0.8);
        };
        img.src = e.target.result;
    };
    reader.readAsDataURL(file);
}

// ============================================================
// NAVIGATION
// ============================================================
function navigateTo(page) {
    DOM.titleHeader.textContent = PAGE_TITLES[page] || 'Error';
    PAGES.forEach(p => {
        document.getElementById(p)?.classList.toggle('active', p === page);
    });
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
        window.location.href = 'admin_login.html';
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
            window.location.href = 'admin_login.html';
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
        Swal.fire({ icon: 'success', title: 'Logged out', text: 'Redirecting to login...', timer: 1500, showConfirmButton: false })
            .then(() => {
                localStorage.removeItem('admin_token');
                localStorage.removeItem('admin_user');
                window.location.href = 'admin_login.html';
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

            const avatarImg = `<img src="${URL_BASED}/uploads/profile_pictures/${admin_profile_picture}" style="width:100%;height:100%;object-fit:cover;border-radius:inherit;">`;
            if (admin_profile_picture) {
                if (DOM.adminAvatar)  DOM.adminAvatar.innerHTML  = avatarImg;
                if (DOM.sidebarAvatar) DOM.sidebarAvatar.innerHTML = avatarImg;
            }
        }
    } catch (err) {
        console.error(err);
    }
}

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

async function handleSetEvent() {
    const eventInput = document.getElementById('event_name_input');
    const eventName = eventInput.value.trim();

    if (!TOKEN) {
        return Swal.fire({ icon: 'error', title: 'Unauthorized', text: 'You must be logged in.' })
            .then(() => { window.location.href = 'admin_login.html'; });
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
                .then(() => { window.location.href = 'admin_login.html'; });
        }
        if (!response.ok) {
            return Swal.fire({ icon: 'error', title: 'Error', text: data.message || 'Failed to set event.' });
        }

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
        const res = await fetch(`${URL_BASED}/admin/get_whole_campus_accounts_count/${tableName}`, {
            headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' }
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
                        '${d.student_year_level}')">Edit</button>
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
                    <button class="action-btn delete-btn-account-management" onclick="deleteGuard(${d.guard_id})">Delete</button>
                </div>
            </div>
        </div>
    `).join('');
}

// ============================================================
// ACCOUNTS — EDIT (open modals)
// ============================================================
function editStudent(id, student_id_number, student_firstname, student_middlename, student_lastname, student_program, student_year_level) {
    DOM.studentAccountManagementModal.style.display = 'flex';
    DOM.studentIDTracking.value = id;
    DOM.studentIdNumber.value = student_id_number;
    DOM.studentFirstName.value = student_firstname;
    DOM.studentMiddleName.value = student_middlename;
    DOM.studentLastName.value = student_lastname;
    DOM.studentProgram.value = student_program;
    DOM.studentYearLevel.value = student_year_level;
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
        year_level: DOM.studentYearLevel.value
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

function deleteStudent(id) {
    deleteAccount({
        confirmText: 'This action will permanently delete the student account.',
        endpoint: `/admin/delete_student_account/${id}`,
        successTitle: 'Student Account Deleted',
        successText: 'The student account has been successfully deleted.',
        onSuccess: fetchStudentAccounts
    });
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
    document.querySelectorAll('.role-tab').forEach(tab => tab.classList.remove('active'));
    event.target.classList.add('active');
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
function exportTableToExcel(tableId, fileName) {
    const table = document.getElementById(tableId);
    if (!table) return Swal.fire({ icon: 'info', title: 'Export Failed', text: 'No table data found to export.' });

    try {
        const wb = XLSX.utils.book_new();

        // Build rows from DOM so we control cell types (prevents #NUM! on time/date)
        const rows = [];
        for (let r = 0; r < table.rows.length; r++) {
            const row = [];
            const cells = table.rows[r].cells;
            for (let c = 0; c < cells.length; c++) {
                row.push(cells[c].innerText.trim());
            }
            rows.push(row);
        }
        const ws = XLSX.utils.aoa_to_sheet(rows);

        // Force every cell to string type + apply styles
        const range = XLSX.utils.decode_range(ws['!ref']);
        for (let R = range.s.r; R <= range.e.r; R++) {
            for (let C = range.s.c; C <= range.e.c; C++) {
                const addr = XLSX.utils.encode_cell({ r: R, c: C });
                if (!ws[addr]) ws[addr] = { v: '', t: 's' };
                ws[addr].t = 's';
                ws[addr].v = String(ws[addr].v ?? '');

                const isHeader = R === 0;
                ws[addr].s = {
                    font: {
                        name: 'Arial',
                        sz: isHeader ? 11 : 10,
                        bold: isHeader,
                        color: { rgb: isHeader ? 'FFFFFF' : '333333' }
                    },
                    fill: {
                        fgColor: { rgb: isHeader ? '3D6B6B' : (R % 2 === 0 ? 'EEF5F3' : 'FFFFFF') }
                    },
                    alignment: {
                        horizontal: 'center',
                        vertical: 'center',
                        wrapText: true
                    },
                    border: {
                        top:    { style: 'thin', color: { rgb: 'C8DDD9' } },
                        bottom: { style: 'thin', color: { rgb: 'C8DDD9' } },
                        left:   { style: 'thin', color: { rgb: 'C8DDD9' } },
                        right:  { style: 'thin', color: { rgb: 'C8DDD9' } }
                    }
                };
            }
        }

        // Column widths
        const colCount = rows[0]?.length || 10;
        ws['!cols'] = Array(colCount).fill({ wch: 22 });

        XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
        XLSX.writeFile(wb, `${fileName}.xlsx`);
        Swal.fire({ icon: 'success', title: 'Exported!', text: 'Your Excel file has been downloaded.', timer: 1500, showConfirmButton: false });
    } catch (e) {
        Swal.fire('Error', 'Failed to generate Excel file', 'error');
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

    // Year filter
    DOM.eventHistoryYearFilter.addEventListener('change', function() {
        filterTableRows(DOM.attendanceHistory, this.value);
    });

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