// Safe stubs — replaced by initChat() once it runs
window.toggleChat     = function() { console.warn('[Chat] Not initialized yet'); }
window.closeChat      = function() {}
window.chatBackToList = function() {}
window._chatOpenConv  = function() {}

// ============================================================
// CHAT / MESSAGING SYSTEM — shared module
// Usage: initChat({ endpoint, token, myId, myRole, myName, apiFetch })
// ============================================================
function initChat({ endpoint, getToken, myId, myRole, myName }) {

    const _fetch = async (path, opts = {}) => {
        const res = await fetch(path, {
            ...opts,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + getToken(),
                ...(opts.headers || {})
            }
        })
        return res.json()
    }

    let _contacts = []
    let _isSearching = false
    let _convContact = null
    let _pollInterval = null
    let _convPollInterval = null
    let _isOpen = false

    // ── DOM ──────────────────────────────────────────────────
    const panel    = document.getElementById('chatPanel')
    const badge    = document.getElementById('chatBadge')
    const listView = document.getElementById('chatListView')
    const convView = document.getElementById('chatConvView')
    const searchInput   = document.getElementById('chatSearchInput')
    const contactsEl    = document.getElementById('chatContacts')
    const convNameEl    = document.getElementById('chatConvName')
    const convRoleEl    = document.getElementById('chatConvRole')
    const convAvatarEl  = document.getElementById('chatConvAvatar')
    const messagesEl    = document.getElementById('chatMessages')
    const chatInput     = document.getElementById('chatInput')

    if (!panel) return // not injected yet

    // ── Helpers ──────────────────────────────────────────────
    function roleColor(role) {
        return { admin:'#2e7d32', super_admin:'#f57f17', teacher:'#1565c0', student:'#6a1b9a', guard:'#00695c' }[role] || '#888'
    }
    function roleLabel(role) {
        return { admin:'Admin', super_admin:'Super Admin', teacher:'Teacher', student:'Student', guard:'Guard' }[role] || role
    }
    function avatarInitial(name) { return (name || '?').charAt(0).toUpperCase() }
    function formatTime(dt) {
        if (!dt) return ''
        const d = new Date(dt.replace ? dt.replace(' ', 'T') : dt)
        const now = new Date()
        const diff = (now - d) / 1000
        if (diff < 60)    return 'now'
        if (diff < 3600)  return Math.floor(diff/60) + 'm'
        if (diff < 86400) return d.toLocaleTimeString('en-PH', { hour:'2-digit', minute:'2-digit' })
        return d.toLocaleDateString('en-PH', { month:'short', day:'numeric' })
    }
    function escHtml(s) {
        return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')
    }

    function renderFileBubble(url, name, type) {
        const safeName = escHtml(name || 'file')
        const safeUrl  = escHtml(url)
        if (type && type.startsWith('image/')) {
            return `<div class="chat-file-img"><img src="${safeUrl}" alt="${safeName}" onclick="window.open('${safeUrl}','_blank')" style="max-width:200px;max-height:180px;border-radius:8px;cursor:pointer;display:block;margin-top:4px;"></div>`
        }
        const icon = getFileIcon(type)
        return `<a class="chat-file-attach" href="${safeUrl}" target="_blank" download="${safeName}">
            <span style="font-size:20px;">${icon}</span>
            <span class="chat-file-name">${safeName}</span>
        </a>`
    }

    function getFileIcon(type) {
        if (!type) return '📎'
        if (type.startsWith('image/'))        return '🖼️'
        if (type.startsWith('video/'))        return '🎬'
        if (type.startsWith('audio/'))        return '🎵'
        if (type.includes('pdf'))             return '📄'
        if (type.includes('word') || type.includes('document')) return '📝'
        if (type.includes('sheet') || type.includes('excel'))   return '📊'
        if (type.includes('zip') || type.includes('rar'))       return '🗜️'
        return '📎'
    }

    // ── Contacts list ────────────────────────────────────────
    async function loadContacts(query = '') {
        const url = query
            ? `${endpoint}/messages/search?q=${encodeURIComponent(query)}`
            : `${endpoint}/messages/contacts`
        const data = await _fetch(url)

        if (!data.ok) return

        if (query) {
            // Search results — show as potential new conversations
            renderContactList(data.users || [], true)
        } else {
            _contacts = data.contacts || []
            const unread = data.unread || 0
            if (badge) {
                badge.textContent = unread > 99 ? '99+' : unread
                badge.style.display = unread > 0 ? 'flex' : 'none'
            }
            renderContactList(_contacts, false)
        }
    }

    function renderContactList(list, isSearch) {
        if (!contactsEl) return
        if (!list.length) {
            contactsEl.innerHTML = `
                <div class="chat-empty">
                    <svg viewBox="0 0 24 24"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z"/></svg>
                    ${isSearch ? 'No users found' : 'No conversations yet.<br>Search to start one.'}
                </div>`
            return
        }
        contactsEl.innerHTML = list.map(c => {
            const id   = c.id   || c.contact_id
            const role = c.role || c.contact_role
            const name = c.name || c.contact_name
            const unread = c.unread || 0
            const preview = c.last_message ? escHtml(c.last_message).substring(0, 35) + (c.last_message.length > 35 ? '…' : '') : ''
            return `
            <div class="chat-contact-item ${unread > 0 ? 'has-unread' : ''}"
                 onclick="window._chatOpenConv(${id}, '${role}', '${escHtml(name)}')">
                <div class="chat-avatar role-${role}">${avatarInitial(name)}</div>
                <div class="chat-contact-info">
                    <div class="chat-contact-name">${escHtml(name)}</div>
                    <div class="chat-contact-role">${roleLabel(role)}</div>
                    ${preview ? `<div class="chat-contact-preview">${preview}</div>` : ''}
                </div>
                ${unread > 0 ? `<div class="chat-unread-badge">${unread}</div>` : ''}
            </div>`
        }).join('')
    }

    // ── Conversation ─────────────────────────────────────────
    window._chatOpenConv = async function(contactId, contactRole, contactName) {
        _convContact = { id: contactId, role: contactRole, name: contactName }

        if (convNameEl)   convNameEl.textContent   = contactName
        if (convRoleEl)   convRoleEl.textContent   = roleLabel(contactRole)
        if (convAvatarEl) {
            convAvatarEl.textContent  = avatarInitial(contactName)
            convAvatarEl.className    = `chat-avatar role-${contactRole}`
        }

        listView?.classList.remove('active')
        convView?.classList.add('active')

        await loadMessages()
        clearInterval(_convPollInterval)
        _convPollInterval = setInterval(loadMessages, 4000)
    }

    async function loadMessages() {
        if (!_convContact || !messagesEl) return
        try {
            const data = await _fetch(`${endpoint}/messages/conversation?contact_id=${_convContact.id}&contact_role=${_convContact.role}`)
            if (!data.ok) {
                messagesEl.innerHTML = `<div class="chat-empty" style="color:#e57373;">
                    <svg viewBox="0 0 24 24" style="fill:#e57373"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/></svg>
                    Could not load messages.<br><small style="opacity:.7">${escHtml(data.message || 'Server error')}</small>
                </div>`
                return
            }
            const msgs = data.messages || []
            const wasAtBottom = messagesEl.scrollHeight - messagesEl.scrollTop - messagesEl.clientHeight < 60
            messagesEl.innerHTML = msgs.map(m => {
                const sent = String(m.sender_id) === String(myId) && m.sender_role === myRole
                return `
                <div class="chat-msg ${sent ? 'sent' : 'recv'}">
                    ${!sent ? `<div class="chat-msg-sender">${escHtml(m.sender_name)}</div>` : ''}
                    <div class="chat-bubble">
                        ${m.content ? escHtml(m.content) : ''}
                        ${m.file_url ? renderFileBubble(m.file_url, m.file_name, m.file_type) : ''}
                    </div>
                    <div class="chat-msg-time">${formatTime(m.created_at)}</div>
                </div>`
            }).join('') || `<div class="chat-empty">
                <svg viewBox="0 0 24 24"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/></svg>
                Say hello!
            </div>`

            if (wasAtBottom || msgs.length === 0) {
                messagesEl.scrollTop = messagesEl.scrollHeight
            }
            loadContacts()
        } catch (e) {
            console.error('[Chat] loadMessages error:', e)
            messagesEl.innerHTML = `<div class="chat-empty" style="color:#e57373;">Failed to load messages.</div>`
        }
    }

    // ── Send message ─────────────────────────────────────────
    async function sendMessage() {
        if (!_convContact || !chatInput) return
        const content  = chatInput.value.trim()
        const fileInput = document.getElementById('chatFileInput')
        const file     = fileInput?.files[0]
        if (!content && !file) return

        chatInput.value = ''
        chatInput.style.height = 'auto'
        if (fileInput) fileInput.value = ''
        clearFilePreview()

        const formData = new FormData()
        formData.append('receiver_id',   _convContact.id)
        formData.append('receiver_role', _convContact.role)
        formData.append('receiver_name', _convContact.name)
        if (content) formData.append('content', content)
        if (file)    formData.append('file', file)

        await fetch(`${endpoint}/messages/send`, {
            method: 'POST',
            headers: { 'Authorization': 'Bearer ' + getToken() },
            body: formData
        })
        await loadMessages()
    }

    function clearFilePreview() {
        const prev = document.getElementById('chatFilePreview')
        if (prev) prev.innerHTML = ''
    }

    // ── Panel toggle — assigned immediately so onclick works ─
    window.toggleChat = function() {
        _isOpen = !_isOpen
        panel?.classList.toggle('open', _isOpen)
        if (_isOpen) {
            showListView()
            loadContacts()
            clearInterval(_pollInterval)
            _pollInterval = setInterval(() => { if (!_convContact && !_isSearching) loadContacts() }, 6000)
        } else {
            clearInterval(_pollInterval)
            clearInterval(_convPollInterval)
            _convContact = null
        }
    }

    window.closeChat = function() {
        _isOpen = false
        panel?.classList.remove('open')
        clearInterval(_pollInterval)
        clearInterval(_convPollInterval)
        _convContact = null
    }

    function showListView() {
        convView?.classList.remove('active')
        listView?.classList.add('active')
        clearInterval(_convPollInterval)
        _convContact = null
    }

    window.chatBackToList = function() {
        showListView()
        loadContacts()
    }

    // ── Event listeners ──────────────────────────────────────
    if (searchInput) {
        let debounce
        searchInput.addEventListener('input', () => {
            clearTimeout(debounce)
            debounce = setTimeout(() => {
                const q = searchInput.value.trim()
                if (q.length >= 1) {
                    _isSearching = true
                    loadContacts(q)
                } else {
                    _isSearching = false
                    loadContacts()
                }
            }, 300)
        })
        // Clear search state when input is cleared
        searchInput.addEventListener('blur', () => {
            if (!searchInput.value.trim()) _isSearching = false
        })
    }

    if (chatInput) {
        chatInput.addEventListener('keydown', e => {
            if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage() }
        })
        chatInput.addEventListener('input', () => {
            chatInput.style.height = 'auto'
            chatInput.style.height = Math.min(chatInput.scrollHeight, 80) + 'px'
        })
    }

    document.getElementById('chatSendBtn')?.addEventListener('click', sendMessage)

    // File attach preview
    document.getElementById('chatFileInput')?.addEventListener('change', (e) => {
        const file = e.target.files[0]
        const prev = document.getElementById('chatFilePreview')
        if (!prev) return
        if (!file) { prev.innerHTML = ''; return }

        const sizeMB = (file.size / 1024 / 1024).toFixed(1)
        if (file.size > 100 * 1024 * 1024) {
            prev.innerHTML = `<div class="chat-file-preview-item error">⚠️ File too large (${sizeMB}MB). Max 100MB.</div>`
            e.target.value = ''
            return
        }
        const icon = getFileIcon(file.type)
        prev.innerHTML = `
            <div class="chat-file-preview-item">
                <span>${icon}</span>
                <span class="chat-file-preview-name">${escHtml(file.name)}</span>
                <span class="chat-file-preview-size">${sizeMB}MB</span>
                <button onclick="document.getElementById('chatFileInput').value='';document.getElementById('chatFilePreview').innerHTML=''" class="chat-file-remove">×</button>
            </div>`
    })

    // ── Toast notification ───────────────────────────────────
    let _toastTimeout = null
    function showMessageToast(name, role, message, contactId, contactRole) {
        let toast = document.getElementById('chatToast')
        if (!toast) {
            toast = document.createElement('div')
            toast.id = 'chatToast'
            toast.style.cssText = `
                position:fixed; bottom:20px; right:20px; z-index:9999;
                background:#1a4545; color:white; border-radius:12px;
                padding:12px 16px; max-width:280px; min-width:220px;
                box-shadow:0 4px 20px rgba(0,0,0,0.3);
                display:flex; align-items:flex-start; gap:10px;
                cursor:pointer; transform:translateY(100px); opacity:0;
                transition:transform 0.3s ease, opacity 0.3s ease;
                font-family:inherit;
            `
            document.body.appendChild(toast)
        }
        const roleColors = { admin:'#4caf50', super_admin:'#ff9800', teacher:'#2196f3', student:'#9c27b0', guard:'#00bcd4' }
        const roleLabels = { admin:'Admin', super_admin:'Super Admin', teacher:'Teacher', student:'Student', guard:'Guard' }
        const initial   = (name || '?').charAt(0).toUpperCase()
        const color     = roleColors[role] || '#7aadaa'
        const roleLabel = roleLabels[role] || role

        toast.innerHTML = `
            <div style="width:36px;height:36px;border-radius:50%;background:${color};
                        display:flex;align-items:center;justify-content:center;
                        font-weight:700;font-size:15px;flex-shrink:0;">${initial}</div>
            <div style="flex:1;min-width:0;">
                <div style="font-weight:700;font-size:13px;margin-bottom:2px;">${escHtml(name)}</div>
                <div style="font-size:11px;opacity:0.75;margin-bottom:4px;text-transform:uppercase;letter-spacing:0.5px;">${roleLabel}</div>
                <div style="font-size:12px;opacity:0.9;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${escHtml(message)}</div>
            </div>
            <div style="font-size:18px;opacity:0.6;line-height:1;flex-shrink:0;">×</div>
        `
        toast.onclick = (e) => {
            if (e.target.closest('div:last-child')) {
                hideToast(toast)
                return
            }
            hideToast(toast)
            if (!_isOpen) window.toggleChat()
            setTimeout(() => window._chatOpenConv(contactId, contactRole, name), 100)
        }

        // Animate in
        requestAnimationFrame(() => {
            toast.style.transform = 'translateY(0)'
            toast.style.opacity   = '1'
        })

        clearTimeout(_toastTimeout)
        _toastTimeout = setTimeout(() => hideToast(toast), 5000)
    }

    function hideToast(toast) {
        if (!toast) return
        toast.style.transform = 'translateY(100px)'
        toast.style.opacity   = '0'
    }

    // Background unread poll (every 8s) — detects new messages and shows toast
    let _lastUnreadContacts = {}

    setInterval(async () => {
        const data = await _fetch(`${endpoint}/messages/contacts`)
        if (!data.ok) return

        const unread = data.unread || 0
        if (badge) {
            badge.textContent = unread > 99 ? '99+' : unread
            badge.style.display = unread > 0 ? 'flex' : 'none'
        }

        // Detect newly unread contacts and show toast
        if (!_isOpen) {
            const contacts = data.contacts || []
            contacts.forEach(c => {
                const id         = c.contact_id
                const role       = c.contact_role
                const name       = c.contact_name
                const senderName = c.last_sender_name || name
                const key        = `${id}:${role}`
                const prevUnread = _lastUnreadContacts[key] || 0
                const currUnread = parseInt(c.unread) || 0
                if (currUnread > prevUnread && currUnread > 0) {
                    showMessageToast(senderName, role, c.last_message || 'New message', id, role)
                }
                _lastUnreadContacts[key] = currUnread
            })
        } else {
            // Reset tracking when panel is open (messages are being read)
            const contacts = data.contacts || []
            contacts.forEach(c => {
                _lastUnreadContacts[`${c.contact_id}:${c.contact_role}`] = parseInt(c.unread) || 0
            })
        }
    }, 8000)

    // Initial load — seed _lastUnreadContacts FIRST so we don't toast on page load
    _fetch(`${endpoint}/messages/contacts`).then(data => {
        if (data.ok) {
            (data.contacts || []).forEach(c => {
                _lastUnreadContacts[`${c.contact_id}:${c.contact_role}`] = parseInt(c.unread) || 0
            })
            // Update badge on load
            const unread = data.unread || 0
            if (badge) {
                badge.textContent = unread > 99 ? '99+' : unread
                badge.style.display = unread > 0 ? 'flex' : 'none'
            }
        }
    })
}