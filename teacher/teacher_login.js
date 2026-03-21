async function getDeviceInfo() {
    try {
        if (navigator.userAgentData) {
            const data = await navigator.userAgentData.getHighEntropyValues([
                'model', 'platform', 'platformVersion', 'mobile'
            ]).catch(() => ({}));
            const model    = (data.model || '').trim();
            const platform = (data.platform || navigator.userAgentData.platform || '').trim();
            const ver      = (data.platformVersion || '').split('.')[0];
            const brands   = navigator.userAgentData.brands || [];
            const browser  = brands.find(b => /chrome|edge|opera/i.test(b.brand) && !/chromium/i.test(b.brand))
                          || brands.find(b => /chromium/i.test(b.brand));
            const browserStr = browser
                ? browser.brand.replace('Google Chrome','Chrome').replace('Microsoft Edge','Edge') + ' ' + browser.version.split('.')[0]
                : '';
            const osStr = platform + (ver && ver !== '0' ? ' ' + ver : '');
            const parts = [browserStr, osStr, model].filter(Boolean);
            if (parts.length > 0) return parts.join(' x ').replace(/ x /g, ' · ');
        }
    } catch (_) {}
    return parseUAString(navigator.userAgent);
}

function parseUAString(ua) {
    if (!ua) return 'Unknown Device';
    let browser = 'Browser', os = '';
    if (ua.indexOf('Edg/') !== -1)               browser = 'Edge';
    else if (ua.indexOf('OPR/') !== -1)          browser = 'Opera';
    else if (ua.indexOf('SamsungBrowser') !== -1) browser = 'Samsung Browser';
    else if (ua.indexOf('Chrome/') !== -1)       browser = 'Chrome';
    else if (ua.indexOf('Firefox/') !== -1)      browser = 'Firefox';
    else if (ua.indexOf('Safari/') !== -1)       browser = 'Safari';
    if (ua.indexOf('Windows NT 10') !== -1)        os = 'Windows 10/11';
    else if (ua.indexOf('Windows NT 6.3') !== -1) os = 'Windows 8.1';
    else if (ua.indexOf('Windows NT 6') !== -1)    os = 'Windows 7/8';
    else if (ua.indexOf('Android') !== -1) {
        const vMatch = ua.match(/Android ([0-9.]+)/);
        const mMatch = ua.match(/Android[^;]+;\s*([^)]+)\)/);
        const raw = mMatch ? mMatch[1].replace(/\s*Build\/.*$/, '').trim() : '';
        os = 'Android' + (vMatch ? ' ' + vMatch[1] : '');
        if (raw && raw !== 'K') return browser + ' · ' + os + ' · ' + raw;
    }
    else if (ua.indexOf('iPhone') !== -1 || ua.indexOf('iPad') !== -1) {
        const vMatch = ua.match(/OS ([0-9_]+)/);
        os = 'iOS' + (vMatch ? ' ' + vMatch[1].replace(/_/g, '.') : '');
    }
    else if (ua.indexOf('Mac OS X') !== -1) {
        const vMatch = ua.match(/Mac OS X ([0-9_]+)/);
        os = 'macOS' + (vMatch ? ' ' + vMatch[1].replace(/_/g, '.') : '');
    }
    else if (ua.indexOf('Linux') !== -1) os = 'Linux';
    return (browser + (os ? ' · ' + os : '')) || ua.substring(0, 80);
}

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
            body: JSON.stringify({ email, password, device_info: await getDeviceInfo() })
        });

        const data = await res.json();

        if (res.ok) {
            getDeviceInfo().then(di => localStorage.setItem('teacher_device_info', di));
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