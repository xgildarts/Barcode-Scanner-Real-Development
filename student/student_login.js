const BASE_URL = 'https://32g7g83w-3000.asse.devtunnels.ms/api/v1';

document.addEventListener('DOMContentLoaded', () => {
    const rememberedEmail = localStorage.getItem('rememberedEmail');
    if (rememberedEmail) {
        document.getElementById('email').value      = rememberedEmail;
        document.getElementById('rememberMe').checked = true;
    }
});

document.getElementById('loginForm').addEventListener('submit', async function (e) {
    e.preventDefault();

    Swal.fire({ title: 'Logging in...', allowOutsideClick: false, didOpen: () => Swal.showLoading() });

    const email     = document.getElementById('email').value.trim();
    const password  = document.getElementById('password').value;
    const rememberMe = document.getElementById('rememberMe').checked;
    const device_id = localStorage.getItem('device_id') || '';

    try {
        const res  = await fetch(`${BASE_URL}/authentication/student_login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password, device_id })
        });
        const data = await res.json();

        if (res.ok && data.ok) {
            localStorage.setItem('student_token', data.token);
            localStorage[rememberMe ? 'setItem' : 'removeItem']('rememberedEmail', email);

            Swal.fire({ icon: 'success', title: 'Login Successful', text: `Welcome back, ${data.student_firstname}!`, confirmButtonColor: '#3085d6' })
                .then(() => window.location.href = 'student_dashboard.html');
        } else {
            Swal.fire({ icon: 'error', title: 'Login Failed', text: data.message || 'Invalid email or password.' });
        }
    } catch (err) {
        Swal.fire({ icon: 'error', title: 'Server Error', text: 'Please try again later.' });
    }
});