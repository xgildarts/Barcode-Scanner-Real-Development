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
            // Include Chromium as fallback brand
            const browser  = brands.find(b => /chrome|edge|opera/i.test(b.brand) && !/chromium/i.test(b.brand))
                          || brands.find(b => /chromium/i.test(b.brand));
            const browserStr = browser
                ? browser.brand.replace('Google Chrome','Chrome').replace('Microsoft Edge','Edge') + ' ' + browser.version.split('.')[0]
                : '';
            const osStr = platform + (ver && ver !== '0' ? ' ' + ver : '');
            // Only trust modern path if platform is a real OS name (not empty, not generic Linux)
            if (platform && platform !== 'Linux') {
                const parts = [browserStr, osStr, model].filter(Boolean);
                if (parts.length > 0) return parts.join(' \u00b7 ');
            }
        }
    } catch (_) {}
    return parseUAString(navigator.userAgent);
}

function parseUAString(ua) {
    if (!ua) return 'Unknown Device';
    // Chrome's frozen/reduced UA on desktop contains "Android 6.0; Nexus 5" as a fake placeholder.
    // Detect this by checking if the UA also contains "Windows NT" or "Macintosh" — meaning
    // the Android token is fake. Strip it and re-parse.
    if (/Android/i.test(ua) && (/Windows NT/i.test(ua) || /Macintosh/i.test(ua))) {
        ua = ua.replace(/\(Linux;[^)]*Android[^)]*\)\s*/i, '');
    }
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
        if (raw && raw !== 'K') return browser + ' \u00b7 ' + os + ' \u00b7 ' + raw;
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
    // Get browser version from UA for the fallback path
    const verMatch = ua.match(/(?:Chrome|Firefox|Safari|OPR|Edg)\/([0-9]+)/);
    const browserVer = verMatch ? ' ' + verMatch[1] : '';
    return (browser + browserVer + (os ? ' \u00b7 ' + os : '')) || ua.substring(0, 80);
}

const BASE_URL = 'https://barcode-scanner-based-student-attendance.com/api/v1';
const GOOGLE_CLIENT_ID = '778771236440-59j9p3hl8tikvffo6s3983s9sfu79ljg.apps.googleusercontent.com';

// Hardware-bound device fingerprint using Canvas + WebGL signals.
// These are tied to the physical GPU — stable across browser updates,
// localStorage clears, and incognito mode.
async function getFingerprint() {
    // --- Canvas signal ---
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    ctx.textBaseline = 'top';
    ctx.font = '14px Arial';
    ctx.fillStyle = '#1a4545';
    ctx.fillRect(0, 0, 100, 30);
    ctx.fillStyle = '#fff';
    ctx.fillText('fp-canvas', 2, 2);
    const canvasData = canvas.toDataURL();

    // --- WebGL signal ---
    let webglRenderer = '';
    let webglVendor = '';
    try {
        const gl = document.createElement('canvas').getContext('webgl')
            || document.createElement('canvas').getContext('experimental-webgl');
        if (gl) {
            const ext = gl.getExtension('WEBGL_debug_renderer_info');
            if (ext) {
                webglRenderer = gl.getParameter(ext.UNMASKED_RENDERER_WEBGL) || '';
                webglVendor   = gl.getParameter(ext.UNMASKED_VENDOR_WEBGL)   || '';
            }
        }
    } catch (_) {}

    // --- Hash Canvas + WebGL into a single device ID ---
    const raw = canvasData + '|' + webglRenderer + '|' + webglVendor;
    const buffer = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(raw));
    const hash = Array.from(new Uint8Array(buffer))
        .map(b => b.toString(16).padStart(2, '0'))
        .join('');

    return hash;
}

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
        inputValidator: v => !v ? 'Email is required.' : !v.endsWith('@panpacificu.edu.ph') ? 'Email must end with @panpacificu.edu.ph.' : undefined
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

    const email     = document.getElementById('email').value.trim();
    const password  = document.getElementById('password').value;
    const rememberMe = document.getElementById('rememberMe').checked;

    // Enforce PPU domain
    if (!email.endsWith('@panpacificu.edu.ph')) {
        return Swal.fire({ icon: 'error', title: 'Invalid Email', text: 'Email must end with @panpacificu.edu.ph.' });
    }

    Swal.fire({ title: 'Logging in...', allowOutsideClick: false, didOpen: () => Swal.showLoading() });
    const device_id = await getFingerprint();

    try {
        const res  = await fetch(`${BASE_URL}/authentication/student_login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password, device_id, device_info: await getDeviceInfo() })
        });
        const data = await res.json();

        if (res.ok && data.ok) {
            const di = await getDeviceInfo();
            localStorage.setItem('student_device_info', di);
            localStorage.setItem('student_token', data.token);
            localStorage[rememberMe ? 'setItem' : 'removeItem']('rememberedEmail', email);

            Swal.fire({ icon: 'success', title: 'Login Successful', text: `Welcome back, ${data.student_firstname}!`, confirmButtonColor: '#3085d6' })
                .then(() => window.location.href = 'student_dashboard.html');
        } else if (data.message && data.message.includes('device is not registered')) {
            showDeviceNotRegisteredAlert(email);
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

    const device_id = await getFingerprint();

    try {
        const res  = await fetch(`${BASE_URL}/authentication/student_google_login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, device_id })
        });
        const data = await res.json();

        if (res.ok && data.ok) {
            const di = await getDeviceInfo();
            localStorage.setItem('student_device_info', di);
            localStorage.setItem('student_token', data.token);
            await Swal.fire({
                icon: 'success',
                title: 'Login Successful',
                text: `Welcome back, ${data.student_firstname}!`,
                confirmButtonColor: '#3085d6'
            });
            window.location.href = 'student_dashboard.html';
        } else {
            if (data.message && data.message.includes('device is not registered')) {
                showDeviceNotRegisteredAlert(email);
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Login Failed',
                    text: data.message || 'No account found. Please register first.',
                    confirmButtonText: 'Register',
                    showCancelButton: true,
                    cancelButtonText: 'Cancel',
                    confirmButtonColor: '#1a4545'
                }).then(result => {
                    if (result.isConfirmed) {
                        window.location.href = 'student_registration.html';
                    }
                });
            }
        }
    } catch (err) {
        Swal.fire({ icon: 'error', title: 'Network Error', text: 'Please try again later.' });
    }
}
// ============================================================
// DEVICE NOT REGISTERED — Contact Admin Alert
// ============================================================
function showDeviceNotRegisteredAlert(email) {
    Swal.fire({
        icon: 'warning',
        title: 'Device Not Recognized',
        html: `
            <p style="margin-bottom:10px;color:#555;font-size:14px;">
                Your account is <strong>not registered</strong> to this device.<br>
                Please contact your administrator to reset your device binding.
            </p>
            <p style="font-size:13px;color:#888;">You can send a message directly to Admin or Super Admin below.</p>
        `,
        confirmButtonText: '💬 Chat Admin / Super Admin',
        showCancelButton: true,
        cancelButtonText: 'Close',
        confirmButtonColor: '#1a4545',
        cancelButtonColor: '#aaa',
        reverseButtons: false
    }).then(result => {
        if (result.isConfirmed) {
            sessionStorage.setItem('contact_reason', 'device_not_registered');
            sessionStorage.setItem('contact_email', email);
            window.location.href = 'student_contact_admin.html';
        }
    });
}