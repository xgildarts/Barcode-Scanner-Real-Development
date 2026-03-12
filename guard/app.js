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