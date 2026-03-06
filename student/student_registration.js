const BASE_URL = 'https://32g7g83w-3000.asse.devtunnels.ms/api/v1';

document.addEventListener('DOMContentLoaded', loadProgramsDropdown);

document.getElementById('registrationForm').addEventListener('submit', async function (e) {
    e.preventDefault();

    const firstName      = document.getElementById('firstName').value.trim();
    const middleName     = document.getElementById('middleName').value.trim();
    const lastName       = document.getElementById('lastName').value.trim();
    const email          = document.getElementById('email').value.trim();
    const idNumber       = document.getElementById('idNumber').value.trim();
    const program        = document.getElementById('program').value;
    const yearLevel      = document.getElementById('yearLevel').value;
    const guardianContact = document.getElementById('guardianContactNumber').value.trim();
    const password       = document.getElementById('password').value;
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
            this.reset();
        } else {
            Swal.fire({ icon: 'error', title: 'Registration Failed', text: data.message || 'Unknown error occurred.' });
        }
    } catch (err) {
        Swal.fire({ icon: 'error', title: 'Network Error', text: err.message || 'Please try again later.' });
    }
});

async function loadProgramsDropdown() {
    const select = document.getElementById('program');
    try {
        Swal.fire({ title: 'Loading programs...', allowOutsideClick: false, didOpen: () => Swal.showLoading() });
        const res  = await fetch(`${BASE_URL}/programs/program_get_data`);
        const data = await res.json();

        if (!res.ok) throw new Error(data.message || 'Failed to load programs');
        Swal.close();

        select.innerHTML = '<option value="">Select Program</option>' +
            data.content.map(p => `<option value="${p.program_name}">${p.program_name}</option>`).join('');

    } catch (err) {
        Swal.close();
        console.error('Error loading programs:', err);
        select.innerHTML = '<option value="">Error loading programs</option>';
    }
}