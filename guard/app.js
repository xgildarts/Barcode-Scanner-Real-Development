const URL_BASED = 'https://32g7g83w-3000.asse.devtunnels.ms/api/v1';
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