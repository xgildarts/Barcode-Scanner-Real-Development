const BASE_URL = 'https://32g7g83w-3000.asse.devtunnels.ms/api/v1';

let _yearLevels = [];

loadProgramsDropdown();
loadYearLevels();

document.getElementById('program').addEventListener('change', populateYearLevel);
document.getElementById('registrationForm').addEventListener('submit', handleSubmit);

// ============================================================

async function loadProgramsDropdown() {
    const select = document.getElementById('program');
    select.innerHTML = '<option value="">Loading programs...</option>';

    try {
        const res  = await fetch(`${BASE_URL}/students/programs`);
        const data = await res.json();

        const programs = Array.isArray(data.content) ? data.content : [];

        select.innerHTML = '<option value="">Select Program</option>' +
            programs.map(p => `<option value="${p.program_name}">${p.program_name}</option>`).join('');

    } catch (err) {
        select.innerHTML = '<option value="">Error loading programs</option>';
    }
}

async function loadYearLevels() {
    try {
        const res  = await fetch(`${BASE_URL}/students/year_levels`);
        const data = await res.json();
        _yearLevels = Array.isArray(data.content) ? data.content : [];

        // Show year levels immediately without needing to select a program
        const select = document.getElementById('yearLevel');
        select.innerHTML = '<option value="">Select Year</option>' +
            _yearLevels.map(y => `<option value="${y.year_level_name}">${y.year_level_name}</option>`).join('');
    } catch (err) {
        _yearLevels = [];
    }
}

function populateYearLevel() {
    const programVal = document.getElementById('program').value;
    const select     = document.getElementById('yearLevel');

    if (!programVal) {
        select.innerHTML = '<option value="">Select Year</option>';
        return;
    }

    if (_yearLevels.length === 0) {
        select.innerHTML = '<option value="">No year levels found</option>';
        return;
    }

    select.innerHTML = '<option value="">Select Year</option>' +
        _yearLevels.map(y => `<option value="${y.year_level_name}">${y.year_level_name}</option>`).join('');
}

async function handleSubmit(e) {
    e.preventDefault();

    const firstName       = document.getElementById('firstName').value.trim();
    const middleName      = document.getElementById('middleName').value.trim();
    const lastName        = document.getElementById('lastName').value.trim();
    const email           = document.getElementById('email').value.trim();
    const idNumber        = document.getElementById('idNumber').value.trim();
    const program         = document.getElementById('program').value;
    const yearLevel       = document.getElementById('yearLevel').value;
    const guardianContact = document.getElementById('guardianContactNumber').value.trim();
    const password        = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    if (password.length < 8)
        return Swal.fire({ icon: 'error', title: 'Weak Password', text: 'Password must be at least 8 characters long.' });

    if (password !== confirmPassword)
        return Swal.fire({ icon: 'error', title: 'Password Mismatch', text: 'Passwords do not match.' });

    Swal.fire({ title: 'Creating account...', allowOutsideClick: false, didOpen: () => Swal.showLoading() });

    try {
        const res  = await fetch(`${BASE_URL}/authentication/student_registration`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ firstName, middleName, lastName, email, idNumber, program, yearLevel, guardianContact, password })
        });
        const data = await res.json();

        if (res.ok && data.ok) {
            localStorage.setItem('device_id', data.device_id);
            Swal.fire({ icon: 'success', title: data.message, text: `Welcome, ${firstName}!`, confirmButtonColor: '#3085d6' });
            document.getElementById('registrationForm').reset();
            document.getElementById('yearLevel').innerHTML = '<option value="">Select Year</option>';
        } else {
            Swal.fire({ icon: 'error', title: 'Registration Failed', text: data.message || 'Unknown error occurred.' });
        }
    } catch (err) {
        Swal.fire({ icon: 'error', title: 'Network Error', text: err.message || 'Please try again later.' });
    }
}