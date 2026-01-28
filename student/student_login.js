document.getElementById('loginForm').addEventListener('submit', async function(e) {
    e.preventDefault();

    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const device_id = localStorage.getItem('device_id') || ''

    if (!email || !password) {
        Swal.fire({
            icon: 'error',
            title: 'Missing Fields',
            text: 'Please enter both email and password.'
        });
        return;
    }

    try {
        const res = await fetch('http://localhost:3000/v1/authentication/student_login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password, device_id })
        });

        const data = await res.json();

        if (res.ok && data.ok) {

            // Put token to localstorage
            localStorage.setItem('student_token', data.token)

            Swal.fire({
                icon: 'success',
                title: 'Login Successful',
                text: `Welcome back, ${data.student_firstname}!`,
                confirmButtonColor: '#3085d6'
            }).then(() => {
                // Redirect to dashboard or homepage after login
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