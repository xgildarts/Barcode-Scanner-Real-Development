// ============================================================
// DEVICE INFO
// ============================================================
let _cachedDeviceInfo = null;
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
// ============================================================
// OFFLINE BANNER
// ============================================================
function showOfflineBanner() {
    let banner = document.getElementById('offlineBanner');
    if (!banner) {
        banner = document.createElement('div');
        banner.id = 'offlineBanner';
        banner.innerHTML = `
            <svg viewBox="0 0 24 24" style="width:16px;height:16px;fill:white;flex-shrink:0">
                <path d="M1 1l22 22-1.41 1.41-2.64-2.64A10.49 10.49 0 0112 23C6.48 23 2 18.52 2 13c0-2.76 1.12-5.26 2.93-7.07L1 2.41 2.41 1zm10 18c.55 0 1-.45 1-1s-.45-1-1-1-1 .45-1 1 .45 1 1 1zm-5.47-5.47l1.42 1.42A4.978 4.978 0 0111 13c0-.55.45-1 1-1s1 .45 1 1l1.42 1.42A6.943 6.943 0 0012 11c-1.48 0-2.84.46-3.95 1.24l-2.52-2.52A9.954 9.954 0 0112 8c2.22 0 4.27.73 5.93 1.95l1.42 1.42C17.55 9.77 14.93 8 12 8 9.74 8 7.67 8.82 6.04 10.23l-1.51-1.51z"/>
            </svg>
            <span>No internet connection</span>`;
        banner.style.cssText = `
            position:fixed; top:0; left:0; right:0; z-index:99999;
            background:#c0392b; color:white; padding:10px 20px;
            display:flex; align-items:center; justify-content:center; gap:10px;
            font-size:13px; font-weight:600; box-shadow:0 2px 8px rgba(0,0,0,0.3);
            transform:translateY(-100%); transition:transform 0.3s ease;`;
        document.body.appendChild(banner);
    }
    requestAnimationFrame(() => banner.style.transform = 'translateY(0)');
}

function hideOfflineBanner() {
    const banner = document.getElementById('offlineBanner');
    if (banner) banner.style.transform = 'translateY(-100%)';
}

window.addEventListener('offline', () => showOfflineBanner());
window.addEventListener('online',  () => {
    hideOfflineBanner();
    Swal.fire({ toast: true, position: 'top-end', icon: 'success', title: 'Back online!', showConfirmButton: false, timer: 2500, timerProgressBar: true });
});

if (!navigator.onLine) showOfflineBanner();


const video = document.getElementById("camera");
let scanning = false;
let stream = null;
const TOKEN = localStorage.getItem('guard_token')

// Start Camera
async function startCamera() {
    try {
        stream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: { exact: "environment" } }
        });
        video.srcObject = stream;
    } catch (e) {
        try {
            stream = await navigator.mediaDevices.getUserMedia({ video: true });
            video.srcObject = stream;
        } catch (err) {
            Swal.fire("Error", "Camera access denied", "error");
        }
    }
    // Start scanning only when video is ready
    video.onloadedmetadata = () => {
        startScan();
    };
}

async function startScan() {
    if (!("BarcodeDetector" in window)) return;

    if (scanning) return; 
    
    scanning = true;

    const detector = new BarcodeDetector({
        formats: ["ean_13", "ean_8", "code_128", "code_39", "qr_code"]
    });

    const scanLoop = async () => {
        if (!scanning) return;

        try {
            const barcodes = await detector.detect(video);
            if (barcodes.length > 0) {
                scanning = false;
                const code = barcodes[0].rawValue;
                showActionModal(code);
                return;
            }
        } catch (err) {
            console.error(err);
        }

        if (scanning) {
            requestAnimationFrame(scanLoop);
        }
    };

    scanLoop();
}

async function checkToken() {
    try {
        // No token at all
        if (!TOKEN) {
            await Swal.fire({
                icon: 'error',
                title: 'Please login first!',
                text: 'Your session is missing or expired.',
                confirmButtonColor: '#d33',
                allowOutsideClick: false
            });

            window.location.href = 'guard_login.html';
            return;
        }

        // Verify token
        const res = await fetch(`${URL_BASED}/authentication/verify_token`, {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + TOKEN
            }
        });

        const data = await res.json();

        // Token invalid
        if (!res.ok) {
            await Swal.fire({
                icon: 'error',
                title: 'Session Expired',
                text: data.message || 'Please login again.',
                confirmButtonColor: '#d33',
                allowOutsideClick: false
            });

            window.location.href = 'guard_login.html';
        }

    } catch (err) {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: err.message || 'Something went wrong.',
            confirmButtonColor: '#d33'
        });

        console.error(err);
    }
}

// 3. Modal
async function showActionModal(scannedCode) {
    new Audio('../sounds/Barcode scanner beep sound (sound effect).mp3').play();
    
    const result = await Swal.fire({
        title: 'Barcode Detected!',
        text: `Code: ${scannedCode}`,
        icon: 'question',
        showDenyButton: true,
        showCancelButton: true,
        confirmButtonText: 'Time IN',
        confirmButtonColor: '#28a745',
        denyButtonText: 'Time OUT',
        denyButtonColor: '#d33',
        cancelButtonText: 'Cancel',
        allowOutsideClick: false
    });

    if (result.isConfirmed) {
        processAttendance(scannedCode, 'TIME IN'); // Ensure string matches DB
    } else if (result.isDenied) {
        processAttendance(scannedCode, 'TIME OUT');
    } else {
        startScan();
    }
}

// 4. Process Attendance
function processAttendance(code, type) {
    console.log(`Processing ${type} for ${code}`);
    
    Swal.fire({
        title: 'Processing...',
        didOpen: () => Swal.showLoading()
    });

    fetch(`${URL_BASED}/guard/event_attendance`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('guard_token')}`
        },
        body: JSON.stringify({ barcode: code, status: type })
    })
    .then(response => response.json())
    .then(data => {
        if(data.ok) {
            Swal.fire({
                title: 'Success!',
                text: data.message,
                icon: 'success',
                timer: 1500,
                showConfirmButton: false
            }).then(() => {
                startScan(); 
            });
        } else {
             Swal.fire("Error", data.message, "error").then(() => {
                startScan(); 
            });
        }
    })
    .catch(err => {
        console.error(err);
        Swal.fire("Error", "Connection failed", "error").then(() => {
            startScan();
        });
    });

}

// Manual Entry
async function manualEntry() {
    scanning = false;

    const { value: code } = await Swal.fire({
        title: 'Manual Entry',
        input: 'text',
        showCancelButton: true
    });

    if (code) {
        showActionModal(code);
    } else {
        startScan();
    }
}

function logout() {
    Swal.fire({
        title: 'Logout?',
        text: 'You will be logged out of the guard panel.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, logout',
        cancelButtonText: 'Cancel',
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        allowOutsideClick: false
    }).then((result) => {
        if (result.isConfirmed) {
            fetch(`${URL_BASED}/guard/logout`, { method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + (localStorage.getItem('guard_token') || '') }, body: JSON.stringify({ device_info: localStorage.getItem('guard_device_info') || '' }) }).catch(() => {});
            localStorage.removeItem('guard_token');
            localStorage.removeItem('guard_user');

            Swal.fire({
                icon: 'success',
                title: 'Logging out...',
                timer: 1500,
                showConfirmButton: false,
                allowOutsideClick: false
            }).then(() => {
                window.location.href = 'guard_login.html';
            });
        }
    });
}

// Init
document.addEventListener('DOMContentLoaded', () => {
    checkToken();
    startCamera();
})
// ============================================================
// MAINTENANCE MODE POLLING
// ============================================================
let _maintenancePollInterval = null;
let _maintenanceActive = false;

async function checkMaintenanceMode() {
    try {
        const res  = await fetch(`${URL_BASED}/system/maintenance`);
        const data = await res.json();
        if (data.maintenance && !_maintenanceActive) {
            _maintenanceActive = true;
            showMaintenanceBanner();
        } else if (!data.maintenance && _maintenanceActive) {
            _maintenanceActive = false;
            hideMaintenanceBanner();
        }
    } catch (_) {}
}

function showMaintenanceBanner() {
    document.getElementById('maintenanceBanner')?.remove();
    const banner = document.createElement('div');
    banner.id = 'maintenanceBanner';
    banner.innerHTML = `
        <svg viewBox="0 0 24 24" style="width:20px;height:20px;fill:#fff;flex-shrink:0;">
            <path d="M22.7 19l-9.1-9.1c.9-2.3.4-5-1.5-6.9-2-2-5-2.4-7.4-1.3L9 6 6 9 1.6 4.7C.4 7.1.9 10.1 2.9 12.1c1.9 1.9 4.6 2.4 6.9 1.5l9.1 9.1c.4.4 1 .4 1.4 0l2.3-2.3c.5-.4.5-1.1.1-1.4z"/>
        </svg>
        <div>
            <div style="font-weight:800;font-size:0.9rem;">🔧 System Maintenance</div>
            <div style="font-size:0.78rem;opacity:0.9;margin-top:2px;">The system is under maintenance. All actions are temporarily disabled.</div>
        </div>`;
    banner.style.cssText = `
        position:fixed;top:0;left:0;right:0;z-index:99999;
        background:linear-gradient(135deg,#c0392b,#e74c3c);color:#fff;
        padding:14px 20px;display:flex;align-items:center;gap:14px;
        box-shadow:0 4px 20px rgba(0,0,0,0.35);font-family:inherit;`;
    document.body.prepend(banner);
    const overlay = document.createElement('div');
    overlay.id = 'maintenanceOverlay';
    overlay.style.cssText = 'position:fixed;inset:0;z-index:99998;background:rgba(0,0,0,0.35);cursor:not-allowed;';
    overlay.addEventListener('click', e => e.stopPropagation());
    document.body.appendChild(overlay);
    Swal.fire({
        icon: 'warning',
        title: '🔧 System Maintenance',
        html: 'The system is currently under maintenance.<br>All actions are temporarily disabled.<br><br><strong>Please wait for maintenance to complete.</strong>',
        allowOutsideClick: false,
        showConfirmButton: false,
    });
}

function hideMaintenanceBanner() {
    document.getElementById('maintenanceBanner')?.remove();
    document.getElementById('maintenanceOverlay')?.remove();
    Swal.close();
    Swal.fire({ icon:'success', title:'System Online', text:'Maintenance is complete. You can continue.', timer:3000, showConfirmButton:false });
}

checkMaintenanceMode();
_maintenancePollInterval = setInterval(checkMaintenanceMode, 15000);