const BASE_URL = 'https://32g7g83w-3000.asse.devtunnels.ms/api/v1';
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

let _yearLevels = [];
let _googleUser  = null; // stores { firstName, middleName, lastName, email, picture } from Google

loadProgramsDropdown();
loadYearLevels();

document.getElementById('program').addEventListener('change', populateYearLevel);
document.getElementById('registrationForm').addEventListener('submit', handleSubmit);

// Allow only digits in phone fields
['guardianContactNumber', 'g_guardianContact'].forEach(id => {
    const el = document.getElementById(id);
    if (!el) return;
    el.addEventListener('input', () => {
        el.value = el.value.replace(/\D/g, '').slice(0, 15);
    });
});

// ============================================================
// GOOGLE SIGN-IN INIT
// ============================================================
window.addEventListener('load', () => {
    if (typeof google === 'undefined') return;

    google.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: handleGoogleCredential,
        auto_select: false
    });

    google.accounts.id.renderButton(
        document.getElementById('googleSignInBtn'),
        {
            type: 'standard',
            shape: 'rectangular',
            theme: 'outline',
            text: 'signup_with',
            size: 'large',
            width: 320
        }
    );
});

// Called by Google after user picks account
function handleGoogleCredential(response) {
    // Decode the JWT credential safely (fix base64 padding)
    try {
        const base64Url = response.credential.split('.')[1];
        const base64    = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const padded    = base64.padEnd(base64.length + (4 - base64.length % 4) % 4, '=');
        const payload   = JSON.parse(atob(padded));

        const fullName   = payload.name || '';
        const nameParts  = fullName.trim().split(' ');
        const firstName  = payload.given_name  || nameParts[0] || '';
        const lastName   = payload.family_name || (nameParts.length > 1 ? nameParts[nameParts.length - 1] : '') || '';
        const middleName = nameParts.length > 2 ? nameParts.slice(1, -1).join(' ') : '';

        _googleUser = {
            firstName,
            middleName,
            lastName,
            email:   payload.email   || '',
            picture: payload.picture || ''
        };

        openGoogleStep2();
    } catch (err) {
        console.error('Google credential decode error:', err);
        Swal.fire({ icon: 'error', title: 'Google Sign-In Failed', text: 'Could not read your Google account info. Please try again.' });
    }
}

// ============================================================
// GOOGLE STEP 2 MODAL
// ============================================================
function openGoogleStep2() {
    const modal = document.getElementById('googleStep2Modal');
    modal.style.display = 'flex';
    // Always reset the device confirm checkbox and disable submit on open
    const gChk = document.getElementById('g_deviceConfirm');
    const gBtn = document.getElementById('g_submitBtn');
    if (gChk) gChk.checked = false;
    if (gBtn) { gBtn.disabled = true; gBtn.style.opacity = '0.5'; gBtn.style.cursor = 'not-allowed'; }

    // Show avatar & name
    if (_googleUser.picture) {
        const img = document.getElementById('googleAvatarStep2');
        img.src = _googleUser.picture;
        img.style.display = 'block';
    }
    document.getElementById('googleNameStep2').textContent =
        `${_googleUser.firstName} ${_googleUser.lastName} · ${_googleUser.email}`;

    // Populate dropdowns inside modal
    populateModalPrograms();
    populateModalYearLevels();
}

function closeGoogleStep2() {
    document.getElementById('googleStep2Modal').style.display = 'none';
    _googleUser = null;
}

function populateModalPrograms() {
    const select = document.getElementById('g_program');
    const mainSelect = document.getElementById('program');
    // Copy options from main form's program dropdown
    select.innerHTML = mainSelect.innerHTML;
}

function populateModalYearLevels() {
    const select = document.getElementById('g_yearLevel');
    select.innerHTML = '<option value="">Select Year</option>' +
        _yearLevels.map(y => `<option value="${y.year_level_name}">${y.year_level_name}</option>`).join('');
}

async function handleGoogleStep2Submit() {
    if (!_googleUser) {
        closeGoogleStep2();
        return Swal.fire({ icon: 'error', title: 'Session Lost', text: 'Google sign-in session expired. Please sign in with Google again.', customClass: { container: 'swal-on-top' } });
    }

    const idNumber        = document.getElementById('g_idNumber').value.trim();
    const program         = document.getElementById('g_program').value;
    const yearLevel       = document.getElementById('g_yearLevel').value;
    const guardianContactRaw = document.getElementById('g_guardianContact').value.trim();
    const guardianCountryCode = document.getElementById('g_countryCode').value || '+63';
    const guardianContact = guardianContactRaw ? guardianCountryCode + guardianContactRaw : '';
    const password        = document.getElementById('g_password').value;
    const confirmPassword = document.getElementById('g_confirmPassword').value;

    if (!idNumber)        return Swal.fire({ icon: 'warning', title: 'Required', text: 'Please enter your ID Number.', customClass: { container: 'swal-on-top' } });
    if (!program)         return Swal.fire({ icon: 'warning', title: 'Required', text: 'Please select a Program.', customClass: { container: 'swal-on-top' } });
    if (!yearLevel)       return Swal.fire({ icon: 'warning', title: 'Required', text: 'Please select a Year Level.', customClass: { container: 'swal-on-top' } });
    if (!guardianContact) return Swal.fire({ icon: 'warning', title: 'Required', text: 'Please enter Guardian Contact.', customClass: { container: 'swal-on-top' } });
    if (!guardianContact || guardianContact.length < 8)
        return Swal.fire({ icon: 'error', title: 'Invalid Number', text: 'Please enter a valid phone number.', customClass: { container: 'swal-on-top' } });
    if (password.length < 8)
        return Swal.fire({ icon: 'error', title: 'Weak Password', text: 'Password must be at least 8 characters.', customClass: { container: 'swal-on-top' } });
    if (password !== confirmPassword)
        return Swal.fire({ icon: 'error', title: 'Password Mismatch', text: 'Passwords do not match.', customClass: { container: 'swal-on-top' } });

    Swal.fire({ title: 'Creating account...', allowOutsideClick: false, didOpen: () => Swal.showLoading(), customClass: { container: 'swal-on-top' } });

    const device_id = await getFingerprint();

    try {
        const res  = await fetch(`${BASE_URL}/authentication/student_registration`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                firstName:      _googleUser.firstName,
                middleName:     _googleUser.middleName,
                lastName:       _googleUser.lastName,
                email:          _googleUser.email,
                idNumber,
                program,
                yearLevel,
                guardianContact,
                password,
                device_id
            })
        });
        const data = await res.json();

        if (res.ok && data.ok) {
            const registeredName = _googleUser.firstName; // save before close nulls _googleUser
            closeGoogleStep2();
            await Swal.fire({
                icon: 'success',
                title: 'Registered!',
                text: `Welcome, ${registeredName}! Your account has been created.`,
                confirmButtonColor: '#1a4545'
            });
            window.location.href = 'student_login.html';
        } else {
            closeGoogleStep2();
            Swal.fire({ icon: 'error', title: 'Registration Failed', text: data.message || 'Unknown error occurred.' });
        }
    } catch (err) {
        closeGoogleStep2();
        Swal.fire({ icon: 'error', title: 'Network Error', text: err.message || 'Please try again later.' });
    }
}

loadProgramsDropdown();
loadYearLevels();

document.getElementById('program').addEventListener('change', populateYearLevel);
document.getElementById('registrationForm').addEventListener('submit', handleSubmit);

// ============================================================

async function loadProgramsDropdown() {
    const select = document.getElementById('program');
    select.innerHTML = '<option value="">Loading programs...</option>';

    try {
        const res  = await fetch(`${BASE_URL}/students/programs`);
        const data = await res.json();

        const programs = Array.isArray(data.content) ? data.content : [];

        select.innerHTML = '<option value="">Select Program</option>' +
            programs.map(p => `<option value="${p.program_name}">${p.program_name}</option>`).join('');

    } catch (err) {
        select.innerHTML = '<option value="">Error loading programs</option>';
    }
}

async function loadYearLevels() {
    try {
        const res  = await fetch(`${BASE_URL}/students/year_levels`);
        const data = await res.json();
        _yearLevels = Array.isArray(data.content) ? data.content : [];

        // Show year levels immediately without needing to select a program
        const select = document.getElementById('yearLevel');
        select.innerHTML = '<option value="">Select Year</option>' +
            _yearLevels.map(y => `<option value="${y.year_level_name}">${y.year_level_name}</option>`).join('');
    } catch (err) {
        _yearLevels = [];
    }
}

function populateYearLevel() {
    const programVal = document.getElementById('program').value;
    const select     = document.getElementById('yearLevel');

    if (!programVal) {
        select.innerHTML = '<option value="">Select Year</option>';
        return;
    }

    if (_yearLevels.length === 0) {
        select.innerHTML = '<option value="">No year levels found</option>';
        return;
    }

    select.innerHTML = '<option value="">Select Year</option>' +
        _yearLevels.map(y => `<option value="${y.year_level_name}">${y.year_level_name}</option>`).join('');
}

async function handleSubmit(e) {
    e.preventDefault();

    const firstName       = document.getElementById('firstName').value.trim();
    const middleName      = document.getElementById('middleName').value.trim();
    const lastName        = document.getElementById('lastName').value.trim();
    const email           = document.getElementById('email').value.trim();
    const idNumber        = document.getElementById('idNumber').value.trim();
    const program         = document.getElementById('program').value;
    const yearLevel       = document.getElementById('yearLevel').value;
    const guardianContactRaw = document.getElementById('guardianContactNumber').value.trim();
    const guardianCountryCode = document.getElementById('countryCode').value || '+63';
    const guardianContact = guardianContactRaw ? guardianCountryCode + guardianContactRaw : '';
    const password        = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    if (password.length < 8)
        return Swal.fire({ icon: 'error', title: 'Weak Password', text: 'Password must be at least 8 characters long.' });

    if (password !== confirmPassword)
        return Swal.fire({ icon: 'error', title: 'Password Mismatch', text: 'Passwords do not match.' });

    if (!email.endsWith('@panpacificu.edu.ph'))
        return Swal.fire({ icon: 'error', title: 'Invalid Email', text: 'Email must end with @panpacificu.edu.ph.' });

    Swal.fire({ title: 'Creating account...', allowOutsideClick: false, didOpen: () => Swal.showLoading() });

    const device_id = await getFingerprint();

    try {
        const res  = await fetch(`${BASE_URL}/authentication/student_registration`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ firstName, middleName, lastName, email, idNumber, program, yearLevel, guardianContact, password, device_id })
        });
        const data = await res.json();

        if (res.ok && data.ok) {
            await Swal.fire({ icon: 'success', title: data.message, text: `Welcome, ${firstName}!`, confirmButtonColor: '#3085d6' });
            window.location.href = 'student_login.html';
        } else {
            Swal.fire({ icon: 'error', title: 'Registration Failed', text: data.message || 'Unknown error occurred.' });
        }
    } catch (err) {
        Swal.fire({ icon: 'error', title: 'Network Error', text: err.message || 'Please try again later.' });
    }
}