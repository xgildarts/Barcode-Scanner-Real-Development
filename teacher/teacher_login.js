const URL_BASED = 'https://32g7g83w-3000.asse.devtunnels.ms/api/v1';

const emailInput = document.getElementById('email');
const rememberMeCheckbox = document.getElementById('rememberMe');
const rememberedEmail = localStorage.getItem('remembered_email');

if (rememberedEmail) {
    emailInput.value = rememberedEmail;
    rememberMeCheckbox.checked = true;
}

document.getElementById('loginForm').addEventListener('submit', async function (e) {
    e.preventDefault();

    // Show loading
    Swal.fire({
        title: 'Logging in...',
        didOpen: () => Swal.showLoading(),
        allowOutsideClick: false
    });

    const email = emailInput.value.trim();
    const password = document.getElementById('password').value;

    // 👉 Remember Me logic
    if (rememberMeCheckbox.checked) {
        localStorage.setItem('remembered_email', email);
    } else {
        localStorage.removeItem('remembered_email');
    }

    try {
        const res = await fetch(`${URL_BASED}/authentication/teacher_login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        const data = await res.json();

        if (res.ok) {
            localStorage.setItem('teacher_token', data.token);
            localStorage.setItem('teacher_user', JSON.stringify(data.user)); // optional

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

// Placeholder for forgot password
document.querySelector('.forgot-password').addEventListener('click', function(e) {
    e.preventDefault();
    Swal.fire({
        icon: 'info',
        title: 'Forgot Password',
        text: 'Password recovery feature coming soon!'
    });
});
