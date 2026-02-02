document.addEventListener('DOMContentLoaded', () => {
    const emailInput = document.getElementById('email');
    const rememberMeCheckbox = document.getElementById('rememberMe');

    const rememberedEmail = localStorage.getItem('rememberedEmail');
    if (rememberedEmail) {
        emailInput.value = rememberedEmail;
        rememberMeCheckbox.checked = true;
    }
});

document.getElementById('loginForm').addEventListener('submit', async function(e) {
    e.preventDefault();

    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const rememberMe = document.getElementById('rememberMe').checked;
    const device_id = localStorage.getItem('device_id') || '';

    if (!email || !password) {
        Swal.fire({
            icon: 'error',
            title: 'Missing Fields',
            text: 'Please enter both email and password.'
        });
        return;
    }

    try {
        const res = await fetch('http://192.168.1.50:3000/api/v1/authentication/student_login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password, device_id })
        });

        const data = await res.json();

        if (res.ok && data.ok) {

            // Save token
            localStorage.setItem('student_token', data.token);

            // Remember Me logic
            if (rememberMe) {
                localStorage.setItem('rememberedEmail', email);
            } else {
                localStorage.removeItem('rememberedEmail');
            }

            Swal.fire({
                icon: 'success',
                title: 'Login Successful',
                text: `Welcome back, ${data.student_firstname}!`,
                confirmButtonColor: '#3085d6'
            }).then(() => {
                window.location.href = 'student_dashboard.html';
            });

        } else {
            Swal.fire({
                icon: 'error',
                title: 'Login Failed',
                text: data.message || 'Invalid email or password.'
            });
        }
    } catch (error) {
        Swal.fire({
            icon: 'error',
            title: 'Server Error',
            text: 'Please try again later.'
        });
        console.error('Login error:', error);
    }
});
