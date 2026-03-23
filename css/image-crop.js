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
                    <span class="crop-title">✂️ Crop Profile Picture</span>
                    <button class="crop-close-btn" id="cropCloseBtn">×</button>
                </div>
                <div class="crop-stage-wrap">
                    <div class="crop-stage" id="cropStage">
                        <canvas id="cropCanvas"></canvas>
                        <div class="crop-overlay">
                            <div class="crop-circle-guide"></div>
                        </div>
                        <div class="crop-drag-hint" id="cropDragHint">Drag to reposition</div>
                    </div>
                </div>
                <div class="crop-zoom-row">
                    <span class="crop-zoom-icon">🔍</span>
                    <input type="range" id="cropZoom" min="0.5" max="3" step="0.01" value="1" class="crop-zoom-slider">
                    <span id="cropZoomPct">100%</span>
                </div>
                <div class="crop-actions">
                    <button class="crop-btn-cancel" id="cropCancelBtn">Cancel</button>
                    <button class="crop-btn-confirm" id="cropConfirmBtn">✓ Apply</button>
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
        const stage   = document.getElementById('cropStage')
        const zoomEl  = document.getElementById('cropZoom')
        const zoomPct = document.getElementById('cropZoomPct')
        const hint    = document.getElementById('cropDragHint')

        modal.style.display = 'flex'

        const img = new Image()
        const url = URL.createObjectURL(file)
        img.onload = () => {
            URL.revokeObjectURL(url)

            const SIZE  = 320 // canvas display size
            const OUT   = 400 // output size
            canvas.width  = SIZE
            canvas.height = SIZE
            const ctx = canvas.getContext('2d')

            let zoom   = 1
            let ox     = 0 // offset x (pan)
            let oy     = 0 // offset y (pan)
            let dragging = false
            let lastX, lastY

            zoomEl.value = '1'
            zoomPct.textContent = '100%'

            // Center image initially
            const fitScale = Math.max(SIZE / img.width, SIZE / img.height)
            const initW = img.width  * fitScale
            const initH = img.height * fitScale
            ox = (SIZE - initW) / 2
            oy = (SIZE - initH) / 2

            function draw() {
                ctx.clearRect(0, 0, SIZE, SIZE)
                // 1. Draw image first
                const w = initW * zoom
                const h = initH * zoom
                ctx.drawImage(img, ox, oy, w, h)
                // 2. Dark overlay on the sides (outside the square crop area)
                const PAD = 8
                ctx.save()
                ctx.fillStyle = 'rgba(0,0,0,0.52)'
                // top strip
                ctx.fillRect(0, 0, SIZE, PAD)
                // bottom strip
                ctx.fillRect(0, SIZE - PAD, SIZE, PAD)
                // left strip
                ctx.fillRect(0, PAD, PAD, SIZE - PAD * 2)
                // right strip
                ctx.fillRect(SIZE - PAD, PAD, PAD, SIZE - PAD * 2)
                ctx.restore()
                // 3. Square border + corner handles
                ctx.save()
                ctx.strokeStyle = 'rgba(255,255,255,0.85)'
                ctx.lineWidth = 2
                ctx.strokeRect(PAD, PAD, SIZE - PAD * 2, SIZE - PAD * 2)
                // Corner handles
                const H = 14
                ctx.lineWidth = 3
                ctx.strokeStyle = '#fff'
                const x0 = PAD, y0 = PAD, x1 = SIZE - PAD, y1 = SIZE - PAD
                // top-left
                ctx.beginPath(); ctx.moveTo(x0, y0 + H); ctx.lineTo(x0, y0); ctx.lineTo(x0 + H, y0); ctx.stroke()
                // top-right
                ctx.beginPath(); ctx.moveTo(x1 - H, y0); ctx.lineTo(x1, y0); ctx.lineTo(x1, y0 + H); ctx.stroke()
                // bottom-left
                ctx.beginPath(); ctx.moveTo(x0, y1 - H); ctx.lineTo(x0, y1); ctx.lineTo(x0 + H, y1); ctx.stroke()
                // bottom-right
                ctx.beginPath(); ctx.moveTo(x1 - H, y1); ctx.lineTo(x1, y1); ctx.lineTo(x1, y1 - H); ctx.stroke()
                ctx.restore()
            }
            draw()

            // Zoom
            zoomEl.oninput = () => {
                const prev = zoom
                zoom = parseFloat(zoomEl.value)
                zoomPct.textContent = Math.round(zoom * 100) + '%'
                // Zoom toward center
                const cx = SIZE/2, cy = SIZE/2
                ox = cx - (cx - ox) * (zoom / prev)
                oy = cy - (cy - oy) * (zoom / prev)
                draw()
            }

            // Drag
            function getPos(e) {
                const r = canvas.getBoundingClientRect()
                if (e.touches) return { x: e.touches[0].clientX - r.left, y: e.touches[0].clientY - r.top }
                return { x: e.clientX - r.left, y: e.clientY - r.top }
            }
            canvas.onmousedown = canvas.ontouchstart = (e) => {
                e.preventDefault(); dragging = true
                const p = getPos(e); lastX = p.x; lastY = p.y
                hint.style.opacity = '0'
            }
            canvas.onmousemove = canvas.ontouchmove = (e) => {
                if (!dragging) return; e.preventDefault()
                const p = getPos(e)
                ox += p.x - lastX; oy += p.y - lastY
                lastX = p.x; lastY = p.y
                draw()
            }
            canvas.onmouseup = canvas.ontouchend = () => { dragging = false }

            // Confirm — export the circle crop
            document.getElementById('cropConfirmBtn').onclick = () => {
                const out = document.createElement('canvas')
                out.width = out.height = OUT
                const octx = out.getContext('2d')
                // Draw scaled image — plain square, no clip
                const scale = OUT / SIZE
                const w = initW * zoom * scale
                const h = initH * zoom * scale
                octx.drawImage(img, ox * scale, oy * scale, w, h)
                out.toBlob(blob => {
                    const dataUrl = out.toDataURL('image/jpeg', 0.92)
                    closeCropModal(inputEl)
                    onCropped(blob, dataUrl)
                }, 'image/jpeg', 0.92)
            }
        }
        img.src = url

        // Close handlers
        document.getElementById('cropCloseBtn').onclick  =
        document.getElementById('cropCancelBtn').onclick = () => {
            closeCropModal(inputEl)
        }
        document.querySelector('#cropModal .crop-backdrop').onclick = () => closeCropModal(inputEl)
    }

    function closeCropModal(inputEl) {
        const modal = document.getElementById('cropModal')
        if (modal) modal.style.display = 'none'
        if (inputEl) inputEl.value = ''
    }
})()