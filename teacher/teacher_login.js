document.getElementById('loginForm').addEventListener('submit', async function (e) {
    e.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        const res = await fetch('http://localhost:3000/api/v1/authentication/teacher_login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        const data = await res.json();

        if (res.ok) {
            localStorage.setItem('teacher_token', data.token);

            Swal.fire({
                icon: 'success',
                title: 'Login Successful',
                text: data.message,
                timer: 2000,
                showConfirmButton: false
            }).then(() => {
                window.location.href = 'teacher_dashboard.html';
            });

        } else {
            Swal.fire({
                icon: 'error',
                title: 'Login Failed',
                text: data.message
            });
        }

    } catch (err) {
        Swal.fire({
            icon: 'error',
            title: 'Server Error',
            text: 'Something went wrong. Please try again.'
        });
    }
});


document.querySelector('.forgot-password').addEventListener('click', function(e) {
    e.preventDefault();
    alert('Password reset functionality would be implemented here.');
});