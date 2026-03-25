// ============================================================
// IMAGE CROP MODAL — shared module
// Usage: initImageCrop(inputEl, onCropped)
//   inputEl  — the <input type="file"> element
//   onCropped(blob, dataUrl) — called with the cropped result
// ============================================================

(function() {
    // Build modal HTML once
    function buildCropModal() {
        if (document.getElementById('cropModal')) return
        const modal = document.createElement('div')
        modal.id = 'cropModal'
        modal.innerHTML = `
            <div class="crop-backdrop"></div>
            <div class="crop-dialog">
                <div class="crop-header">
                    <div class="crop-title">
                        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M21 3L3 21M12 3H3v9M21 12v9h-9"/>
                            <circle cx="6" cy="6" r="3"/><circle cx="18" cy="18" r="3"/>
                        </svg>
                        <span>Crop Profile Picture</span>
                    </div>
                    <button class="crop-close-btn" id="cropCloseBtn" aria-label="Close">
                        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
                            <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                        </svg>
                    </button>
                </div>
                <div class="crop-stage-wrap">
                    <div class="crop-stage" id="cropStage">
                        <canvas id="cropCanvas"></canvas>
                        <div class="crop-drag-hint" id="cropDragHint">
                            <svg viewBox="0 0 24 24" width="13" height="13" fill="currentColor">
                                <path d="M13 6v5h5V9l4 4-4 4v-2h-5v5h2l-4 4-4-4h2v-5H4v2L0 13l4-4v2h5V6H7l4-4 4 4h-2z"/>
                            </svg>
                            Drag image or handles to adjust
                        </div>
                    </div>
                </div>
                <div class="crop-zoom-row">
                    <span class="crop-zoom-icon">
                        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
                            <circle cx="11" cy="11" r="7"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
                            <line x1="11" y1="8" x2="11" y2="14"/><line x1="8" y1="11" x2="14" y2="11"/>
                        </svg>
                    </span>
                    <input type="range" id="cropZoom" min="0.5" max="3" step="0.01" value="1" class="crop-zoom-slider">
                    <span id="cropZoomPct">100%</span>
                </div>
                <div class="crop-actions">
                    <button class="crop-btn-cancel" id="cropCancelBtn">
                        <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
                            <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                        </svg>
                        Cancel
                    </button>
                    <button class="crop-btn-confirm" id="cropConfirmBtn">
                        <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                            <polyline points="20 6 9 17 4 12"/>
                        </svg>
                        Apply
                    </button>
                </div>
            </div>
        `
        document.body.appendChild(modal)
    }

    window.initImageCrop = function(inputEl, onCropped) {
        buildCropModal()

        inputEl.addEventListener('change', function() {
            const file = this.files[0]
            if (!file || !file.type.startsWith('image/')) return
            openCropModal(file, onCropped, inputEl)
        })
    }

    function openCropModal(file, onCropped, inputEl) {
        const modal   = document.getElementById('cropModal')
        const canvas  = document.getElementById('cropCanvas')
        const zoomEl  = document.getElementById('cropZoom')
        const zoomPct = document.getElementById('cropZoomPct')
        const hint    = document.getElementById('cropDragHint')

        modal.style.display = 'flex'

        const img = new Image()
        const url = URL.createObjectURL(file)
        img.onload = () => {
            URL.revokeObjectURL(url)

            const SIZE = 320  // canvas display size
            const OUT  = 800  // output resolution
            const PAD  = 10   // initial crop inset
            const MIN  = 40   // minimum crop dimension
            const HIT  = 10   // hit radius for handles

            canvas.width  = SIZE
            canvas.height = SIZE
            const ctx = canvas.getContext('2d')

            // Image state
            let zoom = 1
            let ox = 0, oy = 0

            // Crop box in canvas coords
            let cb = { x: PAD, y: PAD, w: SIZE - PAD * 2, h: SIZE - PAD * 2 }

            // Drag state
            let dragMode = null
            let lastX, lastY

            zoomEl.value = '1'
            zoomPct.textContent = '100%'

            // Fit image to canvas
            const fitScale = Math.max(SIZE / img.width, SIZE / img.height)
            const initW = img.width  * fitScale
            const initH = img.height * fitScale
            ox = (SIZE - initW) / 2
            oy = (SIZE - initH) / 2

            // ── Handle definitions ─────────────────────────────────
            function getHandles() {
                const { x, y, w, h } = cb
                return [
                    { id: 'tl', x: x,       y: y,       cursor: 'nwse-resize' },
                    { id: 'tr', x: x + w,   y: y,       cursor: 'nesw-resize' },
                    { id: 'br', x: x + w,   y: y + h,   cursor: 'nwse-resize' },
                    { id: 'bl', x: x,       y: y + h,   cursor: 'nesw-resize' },
                    { id: 't',  x: x + w/2, y: y,       cursor: 'ns-resize'   },
                    { id: 'r',  x: x + w,   y: y + h/2, cursor: 'ew-resize'   },
                    { id: 'b',  x: x + w/2, y: y + h,   cursor: 'ns-resize'   },
                    { id: 'l',  x: x,       y: y + h/2, cursor: 'ew-resize'   },
                ]
            }

            // ── Hit testing ────────────────────────────────────────
            function hitTest(px, py) {
                for (const h of getHandles()) {
                    if (Math.abs(px - h.x) <= HIT && Math.abs(py - h.y) <= HIT)
                        return { mode: h.id, cursor: h.cursor }
                }
                if (px >= cb.x && px <= cb.x + cb.w && py >= cb.y && py <= cb.y + cb.h)
                    return { mode: 'move', cursor: 'move' }
                return { mode: 'pan', cursor: 'grab' }
            }

            // ── Apply drag delta ───────────────────────────────────
            function applyDrag(mode, dx, dy) {
                if (mode === 'pan') {
                    ox += dx; oy += dy
                    return
                }
                if (mode === 'move') {
                    cb.x = Math.max(0, Math.min(SIZE - cb.w, cb.x + dx))
                    cb.y = Math.max(0, Math.min(SIZE - cb.h, cb.y + dy))
                    return
                }
                let { x, y, w, h } = cb
                if (mode.includes('l')) { const nw = w - dx; if (nw >= MIN) { x += dx; w = nw } }
                if (mode.includes('r')) { const nw = w + dx; if (nw >= MIN)  w = nw }
                if (mode.includes('t')) { const nh = h - dy; if (nh >= MIN) { y += dy; h = nh } }
                if (mode.includes('b')) { const nh = h + dy; if (nh >= MIN)  h = nh }
                // Clamp to canvas
                x = Math.max(0, x); y = Math.max(0, y)
                if (x + w > SIZE) w = SIZE - x
                if (y + h > SIZE) h = SIZE - y
                cb = { x, y, w, h }
            }

            // ── Draw ───────────────────────────────────────────────
            function draw() {
                ctx.clearRect(0, 0, SIZE, SIZE)

                // 1. Image
                ctx.drawImage(img, ox, oy, initW * zoom, initH * zoom)

                // 2. Dark overlay outside crop box
                ctx.fillStyle = 'rgba(0,0,0,0.55)'
                ctx.fillRect(0,            0,           SIZE,              cb.y)
                ctx.fillRect(0,            cb.y + cb.h, SIZE,              SIZE - cb.y - cb.h)
                ctx.fillRect(0,            cb.y,        cb.x,              cb.h)
                ctx.fillRect(cb.x + cb.w,  cb.y,        SIZE - cb.x - cb.w, cb.h)

                // 3. Rule-of-thirds grid
                ctx.save()
                ctx.strokeStyle = 'rgba(255,255,255,0.18)'
                ctx.lineWidth = 1
                for (let i = 1; i < 3; i++) {
                    const gx = cb.x + cb.w * i / 3
                    const gy = cb.y + cb.h * i / 3
                    ctx.beginPath(); ctx.moveTo(gx, cb.y); ctx.lineTo(gx, cb.y + cb.h); ctx.stroke()
                    ctx.beginPath(); ctx.moveTo(cb.x, gy); ctx.lineTo(cb.x + cb.w, gy); ctx.stroke()
                }
                ctx.restore()

                // 4. Crop border
                ctx.save()
                ctx.strokeStyle = 'rgba(255,255,255,0.9)'
                ctx.lineWidth = 1.5
                ctx.strokeRect(cb.x, cb.y, cb.w, cb.h)
                ctx.restore()

                // 5. Handles
                ctx.save()
                ctx.shadowColor = 'rgba(0,0,0,0.5)'
                ctx.shadowBlur = 4

                const SIDES = { t: true, r: true, b: true, l: true }
                for (const h of getHandles()) {
                    if (SIDES[h.id]) {
                        // Side handle: pill bar
                        const isH = h.id === 't' || h.id === 'b'
                        const bw = isH ? 28 : 5
                        const bh = isH ? 5  : 28
                        ctx.fillStyle = 'rgba(255,255,255,0.95)'
                        roundRect(ctx, h.x - bw/2, h.y - bh/2, bw, bh, 3)
                        ctx.fill()
                    } else {
                        // Corner handle: L-shape
                        ctx.strokeStyle = '#fff'
                        ctx.lineWidth = 3
                        ctx.lineCap = 'round'
                        drawCornerL(ctx, h.id, h.x, h.y, 14)
                    }
                }
                ctx.shadowBlur = 0
                ctx.restore()
            }

            function roundRect(ctx, x, y, w, h, r) {
                ctx.beginPath()
                ctx.moveTo(x + r, y)
                ctx.lineTo(x + w - r, y); ctx.arcTo(x + w, y, x + w, y + r, r)
                ctx.lineTo(x + w, y + h - r); ctx.arcTo(x + w, y + h, x + w - r, y + h, r)
                ctx.lineTo(x + r, y + h); ctx.arcTo(x, y + h, x, y + h - r, r)
                ctx.lineTo(x, y + r); ctx.arcTo(x, y, x + r, y, r)
                ctx.closePath()
            }

            function drawCornerL(ctx, id, x, y, arm) {
                ctx.beginPath()
                if (id === 'tl') { ctx.moveTo(x, y + arm); ctx.lineTo(x, y); ctx.lineTo(x + arm, y) }
                if (id === 'tr') { ctx.moveTo(x - arm, y); ctx.lineTo(x, y); ctx.lineTo(x, y + arm) }
                if (id === 'br') { ctx.moveTo(x, y - arm); ctx.lineTo(x, y); ctx.lineTo(x - arm, y) }
                if (id === 'bl') { ctx.moveTo(x + arm, y); ctx.lineTo(x, y); ctx.lineTo(x, y - arm) }
                ctx.stroke()
            }

            draw()

            // ── Zoom ───────────────────────────────────────────────
            zoomEl.oninput = () => {
                const prev = zoom
                zoom = parseFloat(zoomEl.value)
                zoomPct.textContent = Math.round(zoom * 100) + '%'
                const cx = cb.x + cb.w / 2
                const cy = cb.y + cb.h / 2
                ox = cx - (cx - ox) * (zoom / prev)
                oy = cy - (cy - oy) * (zoom / prev)
                draw()
            }

            // ── Pointer helpers ────────────────────────────────────
            function getPos(e) {
                const r = canvas.getBoundingClientRect()
                const src = e.touches ? e.touches[0] : e
                return { x: src.clientX - r.left, y: src.clientY - r.top }
            }

            // ── Mouse / touch events ───────────────────────────────
            canvas.onmousedown = canvas.ontouchstart = (e) => {
                e.preventDefault()
                const p = getPos(e)
                const { mode, cursor } = hitTest(p.x, p.y)
                dragMode = mode
                canvas.style.cursor = mode === 'pan' ? 'grabbing' : cursor
                lastX = p.x; lastY = p.y
                hint.style.opacity = '0'
            }

            canvas.onmousemove = canvas.ontouchmove = (e) => {
                const p = getPos(e)
                if (!dragMode) {
                    canvas.style.cursor = hitTest(p.x, p.y).cursor
                    return
                }
                e.preventDefault()
                applyDrag(dragMode, p.x - lastX, p.y - lastY)
                lastX = p.x; lastY = p.y
                draw()
            }

            canvas.onmouseup = canvas.ontouchend = () => {
                dragMode = null
                canvas.style.cursor = 'default'
            }

            canvas.onmouseleave = () => {
                if (!dragMode) canvas.style.cursor = 'default'
            }

            // ── Confirm — export crop box region ───────────────────
            document.getElementById('cropConfirmBtn').onclick = () => {
                const scaleX = (initW * zoom) / img.width
                const scaleY = (initH * zoom) / img.height
                const sx = (cb.x - ox) / scaleX
                const sy = (cb.y - oy) / scaleY
                const sw = cb.w / scaleX
                const sh = cb.h / scaleY

                const out  = document.createElement('canvas')
                out.width  = OUT
                out.height = OUT
                const octx = out.getContext('2d')
                octx.drawImage(img, sx, sy, sw, sh, 0, 0, OUT, OUT)

                out.toBlob(blob => {
                    const dataUrl = out.toDataURL('image/jpeg', 0.92)
                    closeCropModal(inputEl)
                    onCropped(blob, dataUrl)
                }, 'image/jpeg', 0.92)
            }
        }
        img.src = url

        document.getElementById('cropCloseBtn').onclick  =
        document.getElementById('cropCancelBtn').onclick = () => closeCropModal(inputEl)
        document.querySelector('#cropModal .crop-backdrop').onclick = () => closeCropModal(inputEl)
    }

    function closeCropModal(inputEl) {
        const modal = document.getElementById('cropModal')
        if (modal) modal.style.display = 'none'
        if (inputEl) inputEl.value = ''
    }
})()