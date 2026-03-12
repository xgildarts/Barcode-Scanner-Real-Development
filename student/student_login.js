const BASE_URL = 'https://32g7g83w-3000.asse.devtunnels.ms/api/v1';
const GOOGLE_CLIENT_ID = '778771236440-59j9p3hl8tikvffo6s3983s9sfu79ljg.apps.googleusercontent.com';

document.addEventListener('DOMContentLoaded', () => {
    const rememberedEmail = localStorage.getItem('rememberedEmail');
    if (rememberedEmail) {
        document.getElementById('email').value      = rememberedEmail;
        document.getElementById('rememberMe').checked = true;
    }

    document.querySelector('.forgot-password').addEventListener('click', async (e) => {
        e.preventDefault();
        forgotPassword();
    });
});

async function forgotPassword() {
    // Step 1 — Enter email
    const { value: email } = await Swal.fire({
        title: 'Forgot Password',
        input: 'email',
        inputLabel: 'Enter your registered email',
        inputPlaceholder: 'example@panpacificu.edu.ph',
        confirmButtonText: 'Send OTP',
        confirmButtonColor: '#2c5f5f',
        showCancelButton: true,
        inputValidator: v => !v ? 'Email is required.' : undefined
    });
    if (!email) return;

    Swal.fire({ title: 'Sending OTP...', allowOutsideClick: false, didOpen: () => Swal.showLoading() });
    try {
        const r1 = await fetch(`${BASE_URL}/students/forgot_password/request_otp`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email })
        });
        const d1 = await r1.json();
        if (!d1.ok) return Swal.fire({ icon: 'error', title: 'Error', text: d1.message });
    } catch {
        return Swal.fire({ icon: 'error', title: 'Network Error', text: 'Please try again later.' });
    }

    // Step 2 — Enter OTP
    const { value: otp } = await Swal.fire({
        title: 'Enter OTP',
        html: `<p style="margin-bottom:12px;font-size:13px;color:#666">A 6-digit code was sent to <strong>${email}</strong>. Valid for 5 minutes.</p>
               <input id="swal-otp" class="swal2-input" maxlength="6" placeholder="000000"
                style="font-size:28px;letter-spacing:10px;text-align:center;width:200px">`,
        confirmButtonText: 'Verify',
        confirmButtonColor: '#2c5f5f',
        showCancelButton: true,
        focusConfirm: false,
        preConfirm: () => {
            const v = document.getElementById('swal-otp').value.trim();
            if (!v || v.length !== 6) { Swal.showValidationMessage('Enter the 6-digit OTP.'); return false; }
            return v;
        }
    });
    if (!otp) return;

    Swal.fire({ title: 'Verifying...', allowOutsideClick: false, didOpen: () => Swal.showLoading() });
    try {
        const r2 = await fetch(`${BASE_URL}/students/forgot_password/verify_otp`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, otp })
        });
        const d2 = await r2.json();
        if (!d2.ok) return Swal.fire({ icon: 'error', title: 'Invalid OTP', text: d2.message });
    } catch {
        return Swal.fire({ icon: 'error', title: 'Network Error', text: 'Please try again later.' });
    }

    // Step 3 — New password
    const { value: passwords } = await Swal.fire({
        title: 'Reset Password',
        html: `<input id="swal-new-pass" type="password" class="swal2-input" placeholder="New password (min 8 chars)">
               <input id="swal-confirm-pass" type="password" class="swal2-input" placeholder="Confirm new password">`,
        confirmButtonText: 'Reset Password',
        confirmButtonColor: '#2c5f5f',
        showCancelButton: true,
        focusConfirm: false,
        preConfirm: () => {
            const np = document.getElementById('swal-new-pass').value;
            const cp = document.getElementById('swal-confirm-pass').value;
            if (np.length < 8) { Swal.showValidationMessage('Password must be at least 8 characters.'); return false; }
            if (np !== cp) { Swal.showValidationMessage('Passwords do not match.'); return false; }
            return { new_password: np, confirm_password: cp };
        }
    });
    if (!passwords) return;

    Swal.fire({ title: 'Resetting...', allowOutsideClick: false, didOpen: () => Swal.showLoading() });
    try {
        const r3 = await fetch(`${BASE_URL}/students/forgot_password/reset_password`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, ...passwords })
        });
        const d3 = await r3.json();
        if (!d3.ok) return Swal.fire({ icon: 'error', title: 'Error', text: d3.message });
        Swal.fire({ icon: 'success', title: 'Password Reset!', text: 'You can now log in with your new password.', confirmButtonColor: '#2c5f5f' });
    } catch {
        Swal.fire({ icon: 'error', title: 'Network Error', text: 'Please try again later.' });
    }
}

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
// ============================================================
// GOOGLE SIGN-IN
// ============================================================
window.addEventListener('load', () => {
    if (typeof google === 'undefined') return;

    google.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: handleGoogleLogin,
        auto_select: false
    });

    google.accounts.id.renderButton(
        document.getElementById('googleSignInBtn'),
        {
            type: 'standard',
            shape: 'rectangular',
            theme: 'outline',
            text: 'signin_with',
            size: 'large',
            width: 300
        }
    );
});

async function handleGoogleLogin(response) {
    // Decode JWT safely
    let email = '';
    let firstName = '';
    try {
        const base64Url = response.credential.split('.')[1];
        const base64    = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const padded    = base64.padEnd(base64.length + (4 - base64.length % 4) % 4, '=');
        const payload   = JSON.parse(atob(padded));
        email     = payload.email      || '';
        firstName = payload.given_name || payload.name || '';
    } catch (err) {
        return Swal.fire({ icon: 'error', title: 'Google Sign-In Failed', text: 'Could not read your Google account info. Please try again.' });
    }

    if (!email) return Swal.fire({ icon: 'error', title: 'Error', text: 'Could not get email from Google account.' });

    Swal.fire({ title: 'Signing in...', allowOutsideClick: false, didOpen: () => Swal.showLoading() });

    const device_id = localStorage.getItem('device_id') || '';

    try {
        const res  = await fetch(`${BASE_URL}/authentication/student_google_login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, device_id })
        });
        const data = await res.json();

        if (res.ok && data.ok) {
            localStorage.setItem('student_token', data.token);
            // Save device_id if newly generated by server
            if (data.device_id) localStorage.setItem('device_id', data.device_id);
            await Swal.fire({
                icon: 'success',
                title: 'Login Successful',
                text: `Welcome back, ${data.student_firstname}!`,
                confirmButtonColor: '#3085d6'
            });
            window.location.href = 'student_dashboard.html';
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Login Failed',
                text: data.message || 'No account found. Please register first.',
                confirmButtonText: data.message === 'Device is not registered to this account!' ? 'OK' : 'Register',
                showCancelButton: data.message !== 'Device is not registered to this account!',
                cancelButtonText: 'Cancel',
                confirmButtonColor: '#1a4545'
            }).then(result => {
                if (result.isConfirmed && data.message !== 'Device is not registered to this account!') {
                    window.location.href = 'student_registration.html';
                }
            });
        }
    } catch (err) {
        Swal.fire({ icon: 'error', title: 'Network Error', text: 'Please try again later.' });
    }
}