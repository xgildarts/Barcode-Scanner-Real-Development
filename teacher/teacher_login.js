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
document.querySelector('.forgot-password').addEventListener('click', async function (e) {
    e.preventDefault()

    // ── Step 1: Enter email ──────────────────────────────────
    const { value: email, isConfirmed: emailConfirmed } = await Swal.fire({
        title: 'Forgot Password',
        html: `
            <p style="color:#555;margin-bottom:16px">Enter your registered email address and we'll send you a 6-digit reset code.</p>
            <input id="swal-email" class="swal2-input" type="email" placeholder="Enter your email">
        `,
        confirmButtonText: 'Send Code',
        confirmButtonColor: '#3d6b6b',
        showCancelButton: true,
        focusConfirm: false,
        preConfirm: () => {
            const val = document.getElementById('swal-email').value.trim()
            if (!val) { Swal.showValidationMessage('Please enter your email.'); return false }
            if (!/\S+@\S+\.\S+/.test(val)) { Swal.showValidationMessage('Enter a valid email address.'); return false }
            return val
        }
    })

    if (!emailConfirmed || !email) return

    // Send OTP
    Swal.fire({ title: 'Sending code...', allowOutsideClick: false, didOpen: () => Swal.showLoading() })
    try {
        const res  = await fetch(`${URL_BASED}/teacher/forgot_password/request_otp`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email })
        })
        const data = await res.json()
        if (!res.ok) {
            Swal.fire({ icon: 'error', title: 'Failed', text: data.message })
            return
        }
    } catch {
        Swal.fire({ icon: 'error', title: 'Server Error', text: 'Could not send the code. Please try again.' })
        return
    }

    // ── Step 2: Enter OTP ────────────────────────────────────
    const { value: otp, isConfirmed: otpConfirmed } = await Swal.fire({
        title: 'Enter Reset Code',
        html: `
            <p style="color:#555;margin-bottom:8px">A 6-digit code was sent to <strong>${email}</strong>.</p>
            <p style="color:#999;font-size:12px;margin-bottom:16px">Valid for 5 minutes.</p>
            <input id="swal-otp" class="swal2-input" type="text" maxlength="6" placeholder="_ _ _ _ _ _"
                style="letter-spacing:10px;font-size:24px;font-weight:700;text-align:center">
        `,
        confirmButtonText: 'Verify Code',
        confirmButtonColor: '#3d6b6b',
        showCancelButton: true,
        focusConfirm: false,
        preConfirm: () => {
            const val = document.getElementById('swal-otp').value.trim()
            if (!val || val.length !== 6 || !/^\d{6}$/.test(val)) {
                Swal.showValidationMessage('Enter the 6-digit code sent to your email.')
                return false
            }
            return val
        }
    })

    if (!otpConfirmed || !otp) return

    // Verify OTP
    Swal.fire({ title: 'Verifying...', allowOutsideClick: false, didOpen: () => Swal.showLoading() })
    try {
        const res  = await fetch(`${URL_BASED}/teacher/forgot_password/verify_otp`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, otp })
        })
        const data = await res.json()
        if (!res.ok) {
            Swal.fire({ icon: 'error', title: 'Invalid Code', text: data.message })
            return
        }
    } catch {
        Swal.fire({ icon: 'error', title: 'Server Error', text: 'Verification failed. Please try again.' })
        return
    }

    // ── Step 3: Set new password ─────────────────────────────
    const { value: passwords, isConfirmed: pwConfirmed } = await Swal.fire({
        title: 'Set New Password',
        html: `
            <input id="swal-pw1" class="swal2-input" type="password" placeholder="New password">
            <input id="swal-pw2" class="swal2-input" type="password" placeholder="Confirm new password">
        `,
        confirmButtonText: 'Reset Password',
        confirmButtonColor: '#3d6b6b',
        showCancelButton: true,
        focusConfirm: false,
        preConfirm: () => {
            const pw1 = document.getElementById('swal-pw1').value
            const pw2 = document.getElementById('swal-pw2').value
            if (!pw1 || !pw2)       { Swal.showValidationMessage('Please fill in both fields.'); return false }
            if (pw1.length < 6)     { Swal.showValidationMessage('Password must be at least 6 characters.'); return false }
            if (pw1 !== pw2)        { Swal.showValidationMessage('Passwords do not match.'); return false }
            return { new_password: pw1, confirm_password: pw2 }
        }
    })

    if (!pwConfirmed || !passwords) return

    // Reset password
    Swal.fire({ title: 'Resetting password...', allowOutsideClick: false, didOpen: () => Swal.showLoading() })
    try {
        const res  = await fetch(`${URL_BASED}/teacher/forgot_password/reset_password`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, ...passwords })
        })
        const data = await res.json()
        if (!res.ok) {
            Swal.fire({ icon: 'error', title: 'Failed', text: data.message })
            return
        }
        Swal.fire({
            icon: 'success',
            title: 'Password Reset!',
            text: 'Your password has been updated. You can now log in.',
            confirmButtonColor: '#3d6b6b'
        })
    } catch {
        Swal.fire({ icon: 'error', title: 'Server Error', text: 'Something went wrong. Please try again.' })
    }
})