/* ============================================================
   ACADEMICS DASHBOARD — app.js
   ============================================================ */

const API   = '/api/v1/academics';
const TOKEN = () => localStorage.getItem('academics_token');
const HEADERS = () => ({
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ' + TOKEN()
});

// Auth guard
(function() {
    if (!TOKEN()) window.location.href = '/academics/academics_login.html';
    document.getElementById('topBarName').textContent =
        localStorage.getItem('academics_name') || 'Academics Officer';
})();

/* ── Tab switching ── */
function switchTab(tab) {
    document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.getElementById('panel' + tab.charAt(0).toUpperCase() + tab.slice(1)).classList.add('active');
    document.getElementById('tab'   + tab.charAt(0).toUpperCase() + tab.slice(1)).classList.add('active');

    if (tab === 'subjects')   loadSubjects();
    if (tab === 'attendance') loadAttendance();
    if (tab === 'qrcodes')    loadQRCodes();
}

/* ============================================================
   SUBJECT ASSIGNMENTS
   ============================================================ */
let allSubjects = [];

async function loadSubjects() {
    try {
        const res  = await fetch(API + '/subjects', { headers: HEADERS() });
        const data = await res.json();
        if (!data.ok) throw new Error(data.message);
        allSubjects = data.subjects || [];
        renderSubjects(allSubjects);
    } catch (e) {
        document.getElementById('subjectsBody').innerHTML =
            `<tr><td colspan="6" class="empty-row">Error loading subjects: ${e.message}</td></tr>`;
    }
}

function renderSubjects(list) {
    const tbody = document.getElementById('subjectsBody');
    if (!list.length) {
        tbody.innerHTML = '<tr><td colspan="6" class="empty-row">No subject assignments yet. Click "Assign Subject" to add one.</td></tr>';
        return;
    }
    const today = new Date().toISOString().split('T')[0];
    tbody.innerHTML = list.map(s => {
        const isActive = s.semester_end >= today;
        const days = s.schedule_days.split(',').map(d => d.slice(0,3)).join(', ');
        return `<tr>
            <td><strong>${esc(s.teacher_name)}</strong><br><span style="font-size:11px;color:#888;">${esc(s.teacher_email)}</span></td>
            <td>${esc(s.subject_name)}</td>
            <td>${days}</td>
            <td>${s.semester_end}</td>
            <td><span class="badge ${isActive ? 'badge-active' : 'badge-ended'}">${isActive ? 'Active' : 'Ended'}</span></td>
            <td>
                <button class="btn-danger" onclick="deleteSubject(${s.subject_id})">
                    <svg viewBox="0 0 24 24" width="12" height="12" fill="currentColor"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/></svg>
                    Remove
                </button>
            </td>
        </tr>`;
    }).join('');
}

function filterSubjects() {
    const q = document.getElementById('subjectSearch').value.toLowerCase();
    renderSubjects(allSubjects.filter(s =>
        s.teacher_name.toLowerCase().includes(q) ||
        s.subject_name.toLowerCase().includes(q)
    ));
}

async function deleteSubject(id) {
    if (!confirm('Remove this subject assignment?')) return;
    const res  = await fetch(API + '/subjects/' + id, { method: 'DELETE', headers: HEADERS() });
    const data = await res.json();
    if (data.ok) loadSubjects();
    else alert(data.message || 'Failed to remove.');
}

/* ── Assign Modal ── */
async function openAssignModal() {
    await loadTeacherOptions('modalTeacher');
    document.getElementById('assignModal').style.display = 'flex';
    document.getElementById('modalErr').style.display = 'none';
    document.getElementById('modalSubject').value = '';
    document.getElementById('modalEndDate').value = '';
    document.querySelectorAll('.day-check input').forEach(c => c.checked = false);
}

function closeAssignModal(e) {
    if (e && e.target !== document.getElementById('assignModal') && e) return;
    document.getElementById('assignModal').style.display = 'none';
}

async function saveAssignment() {
    const teacher_id   = document.getElementById('modalTeacher').value;
    const subject_name = document.getElementById('modalSubject').value.trim();
    const semester_end = document.getElementById('modalEndDate').value;
    const days = [...document.querySelectorAll('.day-check input:checked')].map(c => c.value);
    const errEl = document.getElementById('modalErr');

    if (!teacher_id || !subject_name || !semester_end || !days.length) {
        errEl.textContent   = 'Please fill in all fields and select at least one day.';
        errEl.style.display = 'block';
        return;
    }

    try {
        const res  = await fetch(API + '/subjects', {
            method: 'POST', headers: HEADERS(),
            body: JSON.stringify({ teacher_id, subject_name, schedule_days: days.join(','), semester_end })
        });
        const data = await res.json();
        if (data.ok) {
            document.getElementById('assignModal').style.display = 'none';
            loadSubjects();
        } else {
            errEl.textContent   = data.message || 'Failed to save.';
            errEl.style.display = 'block';
        }
    } catch (e) {
        errEl.textContent   = 'Network error.';
        errEl.style.display = 'block';
    }
}

/* ============================================================
   ATTENDANCE RECORDS
   ============================================================ */
async function loadAttendance() {
    const date    = document.getElementById('attDateFilter').value;
    const teacher = document.getElementById('attTeacherFilter').value;
    const status  = document.getElementById('attStatusFilter').value;

    // Load teacher filter options once
    if (!document.getElementById('attTeacherFilter').dataset.loaded) {
        await loadTeacherOptions('attTeacherFilter', true);
        document.getElementById('attTeacherFilter').dataset.loaded = '1';
    }

    if (!date) {
        document.getElementById('attendanceBody').innerHTML =
            '<tr><td colspan="5" class="empty-row">Select a date to load records.</td></tr>';
        return;
    }

    try {
        const params = new URLSearchParams({ date });
        if (teacher) params.append('teacher_id', teacher);
        if (status)  params.append('status', status);

        const res  = await fetch(`${API}/attendance?${params}`, { headers: HEADERS() });
        const data = await res.json();
        if (!data.ok) throw new Error(data.message);

        const rows = data.records || [];
        if (!rows.length) {
            document.getElementById('attendanceBody').innerHTML =
                '<tr><td colspan="5" class="empty-row">No records for this date.</td></tr>';
            return;
        }

        document.getElementById('attendanceBody').innerHTML = rows.map(r => `
            <tr>
                <td><strong>${esc(r.teacher_name)}</strong></td>
                <td>${r.attendance_date}</td>
                <td>${r.time_in  || '—'}</td>
                <td>${r.time_out || '—'}</td>
                <td><span class="badge ${r.status === 'Present' ? 'badge-present' : 'badge-absent'}">${r.status}</span></td>
            </tr>`).join('');
    } catch (e) {
        document.getElementById('attendanceBody').innerHTML =
            `<tr><td colspan="5" class="empty-row">Error: ${e.message}</td></tr>`;
    }
}

function clearAttFilters() {
    document.getElementById('attDateFilter').value = '';
    document.getElementById('attTeacherFilter').value = '';
    document.getElementById('attStatusFilter').value = '';
    document.getElementById('attendanceBody').innerHTML =
        '<tr><td colspan="5" class="empty-row">Select a date to load records.</td></tr>';
}

function exportAttendance() {
    const date = document.getElementById('attDateFilter').value || 'all';
    window.open(`${API}/attendance/export?date=${date}&token=${TOKEN()}`, '_blank');
}

/* ============================================================
   QR CODES
   ============================================================ */
async function loadQRCodes() {
    const grid = document.getElementById('qrGrid');
    grid.innerHTML = '<div class="empty-row" style="text-align:center;padding:40px;">Loading…</div>';

    try {
        const res  = await fetch(API + '/teachers', { headers: HEADERS() });
        const data = await res.json();
        if (!data.ok) throw new Error(data.message);

        const teachers = data.teachers || [];
        if (!teachers.length) {
            grid.innerHTML = '<div class="empty-row" style="text-align:center;padding:40px;">No teachers found.</div>';
            return;
        }

        grid.innerHTML = teachers.map(t => `
            <div class="qr-card">
                <div class="qr-card-name">${esc(t.teacher_name)}</div>
                <div class="qr-card-email">${esc(t.teacher_email)}</div>
                <div class="qr-canvas-wrap" id="qr_${t.teacher_id}"></div>
                <div class="qr-serial">${esc(t.teacher_barcode_scanner_serial_number)}</div>
                <button class="qr-print-btn" onclick="printQR(${t.teacher_id}, '${esc(t.teacher_name)}')">
                    🖨 Print QR
                </button>
            </div>`).join('');

        // Generate QR codes
        teachers.forEach(t => {
            new QRCode(document.getElementById('qr_' + t.teacher_id), {
                text: t.teacher_barcode_scanner_serial_number,
                width: 150, height: 150,
                colorDark: '#1e3a10', colorLight: '#ffffff',
                correctLevel: QRCode.CorrectLevel.M
            });
        });
    } catch (e) {
        grid.innerHTML = `<div class="empty-row" style="text-align:center;padding:40px;">Error: ${e.message}</div>`;
    }
}

function printQR(id, name) {
    const wrap = document.getElementById('qr_' + id);
    const img  = wrap.querySelector('img') || wrap.querySelector('canvas');
    if (!img) return;

    const src = img.tagName === 'CANVAS' ? img.toDataURL() : img.src;
    const win = window.open('', '_blank');
    win.document.write(`
        <html><head><title>QR — ${name}</title>
        <style>body{font-family:sans-serif;text-align:center;padding:30px;}
        img{width:200px;height:200px;} h2{margin-bottom:8px;} p{font-size:12px;color:#666;}
        @media print{button{display:none;}}</style></head>
        <body>
            <h2>${name}</h2>
            <p>Teacher Attendance QR Code</p>
            <img src="${src}">
            <p style="margin-top:12px;font-size:10px;font-family:monospace;">
                ${document.querySelector('#qr_' + id).closest('.qr-card').querySelector('.qr-serial').textContent}
            </p>
            <br><button onclick="window.print()">🖨 Print</button>
        </body></html>`);
    win.document.close();
}

/* ============================================================
   HELPERS
   ============================================================ */
async function loadTeacherOptions(selectId, keepFirst = false) {
    try {
        const res  = await fetch(API + '/teachers', { headers: HEADERS() });
        const data = await res.json();
        if (!data.ok) return;
        const sel = document.getElementById(selectId);
        const placeholder = sel.options[0];
        sel.innerHTML = '';
        if (keepFirst) sel.appendChild(placeholder);
        else sel.innerHTML = '<option value="">Select teacher…</option>';
        (data.teachers || []).forEach(t => {
            const opt = document.createElement('option');
            opt.value       = t.teacher_id;
            opt.textContent = t.teacher_name;
            sel.appendChild(opt);
        });
    } catch (e) { /* silent */ }
}

function esc(str) {
    if (!str) return '';
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

function doLogout() {
    localStorage.removeItem('academics_token');
    localStorage.removeItem('academics_id');
    localStorage.removeItem('academics_name');
    window.location.href = '/academics/academics_login.html';
}

// Init
loadSubjects();
