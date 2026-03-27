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
    const chatInput       = document.getElementById('chatInput')
    let   _pastedFile     = null   // holds clipboard-pasted image
    const pinBar          = document.getElementById('chatPinBar')
    const pinBarText      = document.getElementById('chatPinBarText')
    const pinnedPanel     = document.getElementById('chatPinnedPanel')
    const pinnedList      = document.getElementById('chatPinnedList')

    if (!panel) return // not injected yet

    let _pinnedOpen = false
    window.togglePinnedPanel = function() {
        _pinnedOpen = !_pinnedOpen
        if (pinnedPanel) pinnedPanel.style.display = _pinnedOpen ? 'block' : 'none'
        const arrow = document.getElementById('chatPinBarArrow')
        if (arrow) arrow.textContent = _pinnedOpen ? '▴' : '▾'
    }

    // ── Helpers ──────────────────────────────────────────────
    function roleColor(role) {
        return { admin:'#2e7d32', super_admin:'#f57f17', teacher:'#1565c0', student:'#6a1b9a', guard:'#00695c' }[role] || '#888'
    }
    function roleLabel(role) {
        return { admin:'Admin', super_admin:'Super Admin', teacher:'Teacher', student:'Student', guard:'Guard' }[role] || role
    }
    function avatarInitial(name) { return (name || '?').charAt(0).toUpperCase() }
    const _apiBase = () => (typeof URL_BASED !== 'undefined' ? URL_BASED : (typeof BASE_URL !== 'undefined' ? BASE_URL : '')).replace('/api/v1','')

    function avatarHtml(name, role, picUrl, size = 40) {
        const initial = avatarInitial(name)
        const fs      = Math.round(size * 0.38)
        if (picUrl) {
            const src = _apiBase() + '/api/v1/uploads/profile_pictures/' + picUrl
            return `<img class="chat-avatar-img" src="${escHtml(src)}" width="${size}" height="${size}" alt="${initial}" style="width:${size}px;height:${size}px;border-radius:50%;object-fit:cover;flex-shrink:0;">`
        }
        return `<div class="chat-avatar role-${role}" style="width:${size}px;height:${size}px;font-size:${fs}px;flex-shrink:0;">${initial}</div>`
    }
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
                 onclick="window._chatOpenConv(${id}, '${role}', '${escHtml(name)}', '${c.profile_picture || c.contact_profile_picture || ''}')">
                ${avatarHtml(name, role, c.profile_picture || c.contact_profile_picture, 40)}
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
    window._chatOpenConv = async function(contactId, contactRole, contactName, profilePicture) {
        _convContact = { id: contactId, role: contactRole, name: contactName, profilePicture: profilePicture || null }

        if (convNameEl)   convNameEl.textContent   = contactName
        if (convRoleEl)   convRoleEl.textContent   = roleLabel(contactRole)
        const convAvatarContainer = document.getElementById('chatConvAvatarWrap')
        if (convAvatarContainer) {
            convAvatarContainer.innerHTML = avatarHtml(contactName, contactRole, _convContact.profilePicture, 40)
        } else if (convAvatarEl) {
            convAvatarEl.textContent = avatarInitial(contactName)
            convAvatarEl.className   = `chat-avatar role-${contactRole}`
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
            // Find last sent message index for seen receipt
            let lastSentIdx = -1
            let contactPicFromMsg = _convContact.profilePicture
            msgs.forEach((m, i) => {
                if (String(m.sender_id) === String(myId) && m.sender_role === myRole && !m.is_unsent) {
                    lastSentIdx = i
                    // receiver_profile_picture on sent msgs = the contact's pic
                    if (m.receiver_profile_picture) contactPicFromMsg = m.receiver_profile_picture
                }
            })

            messagesEl.innerHTML = msgs.map((m, idx) => {
                const sent   = String(m.sender_id) === String(myId) && m.sender_role === myRole
                const unsent = m.is_unsent == 1
                const pinned = m.is_pinned == 1
                const isLastSent = sent && idx === lastSentIdx
                const seenAvatarEl = avatarHtml(_convContact.name, _convContact.role, contactPicFromMsg, 16)
                const seenReceipt = isLastSent && m.is_read == 1
                    ? `<div class="chat-seen-receipt">${seenAvatarEl} Seen ${m.read_at ? formatTime(m.read_at) : ''}</div>`
                    : isLastSent ? `<div class="chat-seen-receipt chat-seen-sent">✓✓ Delivered</div>` : ''

                const recvPic = !sent ? (m.sender_profile_picture || null) : null
                const avatarEl = !sent ? avatarHtml(m.sender_name, m.sender_role, recvPic, 28) : ''
                return `
                <div class="chat-msg ${sent ? 'sent' : 'recv'} ${unsent ? 'unsent' : ''} ${pinned ? 'pinned' : ''}" data-id="${m.id}">
                    <div class="chat-msg-row ${sent ? 'chat-msg-row-sent' : 'chat-msg-row-recv'}">
                        ${!sent ? avatarEl : ''}
                        <div class="chat-msg-body">
                            ${!sent ? `<div class="chat-msg-sender">${escHtml(m.sender_name)}</div>` : ''}
                            <div class="chat-msg-wrap">
                                <button class="chat-msg-menu-btn" onclick="showMsgMenu(event,${m.id},${sent},${unsent})" title="Options">⋯</button>
                                <div class="chat-bubble">
                                    ${unsent
                                        ? `<span class="chat-unsent-label">${sent ? 'You unsent a message' : escHtml(m.sender_name) + ' unsent a message'}</span>`
                                        : `${m.content ? escHtml(m.content) : ''}${m.file_url ? renderFileBubble(m.file_url, m.file_name, m.file_type) : ''}${m.is_edited ? '<span class="chat-edited-label"> (edited)</span>' : ''}`
                                    }
                                </div>
                            </div>
                            ${pinned && !unsent ? '<div class="chat-pin-label">📌 Pinned</div>' : ''}
                            <div class="chat-msg-time">${formatTime(m.created_at)}</div>
                        </div>
                    </div>
                    ${seenReceipt}
                </div>`
            }).join('') || `<div class="chat-empty">
                <svg viewBox="0 0 24 24"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/></svg>
                Say hello!
            </div>`

            if (wasAtBottom || msgs.length === 0) {
                messagesEl.scrollTop = messagesEl.scrollHeight
            }

            // Update pin bar
            const pinnedMsgs = msgs.filter(m => m.is_pinned == 1 && m.is_unsent != 1)
            if (pinBar) {
                if (pinnedMsgs.length > 0) {
                    pinBar.style.display = 'flex'
                    if (pinBarText) pinBarText.textContent = `${pinnedMsgs.length} pinned message${pinnedMsgs.length > 1 ? 's' : ''}`
                } else {
                    pinBar.style.display = 'none'
                    if (pinnedPanel) pinnedPanel.style.display = 'none'
                    _pinnedOpen = false
                }
            }

            // Render pinned panel list
            if (pinnedList) {
                pinnedList.innerHTML = pinnedMsgs.length ? pinnedMsgs.map(m => `
                    <div class="chat-pinned-item" onclick="scrollToMsg(${m.id})">
                        <div class="chat-pinned-item-sender">${escHtml(m.sender_name)}</div>
                        <div class="chat-pinned-item-content">
                            ${m.file_url
                                ? `📎 ${escHtml(m.file_name || 'file')}`
                                : escHtml((m.content || '').substring(0, 80) + (m.content?.length > 80 ? '…' : ''))}
                        </div>
                        <button class="chat-pinned-unpin" onclick="event.stopPropagation();doPin(${m.id})" title="Unpin">×</button>
                    </div>`).join('')
                : '<div style="padding:16px;text-align:center;color:#aaa;font-size:13px;">No pinned messages</div>'
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
        const file     = fileInput?.files[0] || _pastedFile
        if (!content && !file) return

        // Hard cap — safety net even if preview check was bypassed
        if (file && file.size > 20 * 1024 * 1024) {
            const sizeMB = (file.size / 1024 / 1024).toFixed(1)
            const prev = document.getElementById('chatFilePreview')
            if (prev) prev.innerHTML = `<div class="chat-file-preview-item error">⚠️ File too large (${sizeMB}MB). Max 20MB.</div>`
            if (fileInput) fileInput.value = ''
            _pastedFile = null
            return
        }

        // Handle edit mode
        if (_editingMsgId) {
            const msgId = _editingMsgId
            window.cancelEdit()
            const res = await _fetch(`${endpoint}/messages/edit/${msgId}`, {
                method: 'PUT',
                body: JSON.stringify({ content })
            })
            if (res.ok) await loadMessages()
            return
        }

        chatInput.value = ''
        chatInput.style.height = 'auto'
        if (fileInput) fileInput.value = ''
        _pastedFile = null
        clearFilePreview()

        const formData = new FormData()
        formData.append('receiver_id',   _convContact.id)
        formData.append('receiver_role', _convContact.role)
        formData.append('receiver_name', _convContact.name)
        if (content) formData.append('content', content)
        if (file)    formData.append('file', file)

        // Show sending indicator bubble
        const msgList = document.getElementById('chatMessages')
        const sendingBubble = document.createElement('div')
        sendingBubble.id = 'chatSendingBubble'
        sendingBubble.className = 'chat-msg sent'

        const isImage = file && file.type.startsWith('image/')

        if (isImage) {
            // For images: show thumbnail with spinner overlay immediately using FileReader
            const objectUrl = URL.createObjectURL(file)
            sendingBubble.innerHTML = `
                <div class="chat-bubble chat-sending-bubble chat-sending-img-bubble">
                    ${content ? `<div class="chat-sending-caption">${escHtml(content)}</div>` : ''}
                    <div class="chat-sending-img-wrap">
                        <img src="${objectUrl}" class="chat-sending-img" alt="${escHtml(file.name)}">
                        <div class="chat-sending-img-overlay">
                            <div class="chat-sending-spinner"></div>
                        </div>
                    </div>
                    <div class="chat-sending-status">
                        <div class="chat-sending-dots">
                            <span></span><span></span><span></span>
                        </div>
                        <span class="chat-sending-label">Sending…</span>
                    </div>
                </div>`
            if (msgList) {
                msgList.appendChild(sendingBubble)
                msgList.scrollTop = msgList.scrollHeight
            }

            // Let the browser paint the bubble before the upload blocks the thread
            await new Promise(r => requestAnimationFrame(() => setTimeout(r, 0)))

            await fetch(`${endpoint}/messages/send`, {
                method: 'POST',
                headers: { 'Authorization': 'Bearer ' + getToken() },
                body: formData
            })

            URL.revokeObjectURL(objectUrl)
        } else {
            // For text / non-image files: show name + animated dots
            const fileIcon = file ? `<div class="chat-sending-file">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66L9.41 17.41a2 2 0 0 1-2.83-2.83l8.49-8.48"/></svg>
                    <span>${escHtml(file.name)}</span>
                </div>` : `<span>${escHtml(content)}</span>`
            sendingBubble.innerHTML = `
                <div class="chat-bubble chat-sending-bubble">
                    ${fileIcon}
                    <div class="chat-sending-status">
                        <div class="chat-sending-dots">
                            <span></span><span></span><span></span>
                        </div>
                        <span class="chat-sending-label">Sending…</span>
                    </div>
                </div>`
            if (msgList) {
                msgList.appendChild(sendingBubble)
                msgList.scrollTop = msgList.scrollHeight
            }

            // Let the browser paint the bubble before the upload blocks the thread
            await new Promise(r => requestAnimationFrame(() => setTimeout(r, 0)))

            await fetch(`${endpoint}/messages/send`, {
                method: 'POST',
                headers: { 'Authorization': 'Bearer ' + getToken() },
                body: formData
            })
        }

        sendingBubble.remove()
        await loadMessages()
    }

    function clearFilePreview() {
        const prev = document.getElementById('chatFilePreview')
        if (prev) prev.innerHTML = ''
    }

    // ── 3-dot message menu ───────────────────────────────────
    window.showMsgMenu = function(e, msgId, isSent, isUnsent) {
        e.stopPropagation()
        closeMsgMenu()

        const menu = document.createElement('div')
        menu.id = 'chatMsgMenu'

        let items = ''
        if (!isUnsent) {
            if (isSent) {
                items += `<div class="chat-ctx-item" onclick="doEdit(${msgId})"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg> Edit</div>`
            }
            items += `<div class="chat-ctx-item" onclick="doPin(${msgId})"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="17" x2="12" y2="22"/><path d="M5 17h14v-1.76a2 2 0 0 0-1.11-1.79l-1.78-.9A2 2 0 0 1 15 10.76V6h1a2 2 0 0 0 0-4H8a2 2 0 0 0 0 4h1v4.76a2 2 0 0 1-1.11 1.79l-1.78.9A2 2 0 0 0 5 15.24V17z"/></svg> Pin</div>`
            items += `<div class="chat-ctx-item" onclick="doForward(${msgId})"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 17 20 12 15 7"/><path d="M4 18v-2a4 4 0 0 1 4-4h12"/></svg> Forward</div>`
            items += `<div class="chat-ctx-divider"></div>`
            items += `<div class="chat-ctx-item chat-ctx-danger" onclick="doDeleteForMe(${msgId})"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg> Delete for me</div>`
            if (isSent) {
                items += `<div class="chat-ctx-item chat-ctx-danger" onclick="doUnsend(${msgId})"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="9" y1="9" x2="15" y2="15"/><line x1="15" y1="9" x2="9" y2="15"/></svg> Delete for everyone</div>`
            }
        }

        menu.innerHTML = items || '<div class="chat-ctx-item" style="color:#aaa;cursor:default;">No actions</div>'
        menu.style.cssText = `
            position:fixed; z-index:99999;
            background:#fff; border:1.5px solid #e0eee9;
            border-radius:12px; box-shadow:0 6px 24px rgba(0,0,0,0.18);
            padding:6px; min-width:200px; overflow:hidden;
        `
        const rect = e.currentTarget.getBoundingClientRect()
        let top  = rect.bottom + 4
        let left = rect.left - 160
        if (left < 8) left = 8
        if (top + 220 > window.innerHeight) top = rect.top - 220
        menu.style.top  = top + 'px'
        menu.style.left = left + 'px'
        document.body.appendChild(menu)
        setTimeout(() => document.addEventListener('click', closeMsgMenu, { once: true }), 10)
    }

    function closeMsgMenu() {
        document.getElementById('chatMsgMenu')?.remove()
    }

    window.doDeleteForMe = async function(msgId) {
        closeMsgMenu()
        const res = await _fetch(`${endpoint}/messages/delete-for-me/${msgId}`, { method: 'DELETE' })
        if (res.ok) await loadMessages()
    }

    window.doUnsend = async function(msgId) {
        closeMsgMenu()
        if (!confirm('Delete for everyone? They will see "this message was deleted".')) return
        const res = await _fetch(`${endpoint}/messages/unsend/${msgId}`, { method: 'DELETE' })
        if (res.ok) await loadMessages()
    }

    window.doPin = async function(msgId) {
        closeMsgMenu()
        const res = await _fetch(`${endpoint}/messages/pin/${msgId}`, { method: 'POST', body: '{}' })
        if (res.ok) await loadMessages()
    }

    window.scrollToMsg = function(msgId) {
        // Close pinned panel and scroll to the message
        if (pinnedPanel) pinnedPanel.style.display = 'none'
        _pinnedOpen = false
        const arrow = document.getElementById('chatPinBarArrow')
        if (arrow) arrow.textContent = '▾'
        setTimeout(() => {
            const el = messagesEl?.querySelector(`[data-id="${msgId}"]`)
            if (el) {
                el.scrollIntoView({ behavior: 'smooth', block: 'center' })
                el.classList.add('chat-msg-highlight')
                setTimeout(() => el.classList.remove('chat-msg-highlight'), 1500)
            }
        }, 100)
    }

    window.doForward = function(msgId) {
        closeMsgMenu()
        const msgEl = messagesEl?.querySelector(`[data-id="${msgId}"] .chat-bubble`)
        const text  = msgEl?.innerText?.trim() || ''
        if (!text) return
        window.chatBackToList()
        setTimeout(() => {
            if (chatInput) {
                chatInput.value = '↪️ ' + text
                chatInput.dispatchEvent(new Event('input'))
                chatInput.focus()
            }
        }, 200)
    }

    let _editingMsgId = null

    window.doEdit = function(msgId) {
        closeMsgMenu()
        // Get current message text from bubble
        const msgEl   = messagesEl?.querySelector(`[data-id="${msgId}"] .chat-bubble`)
        const current = msgEl?.childNodes[0]?.textContent?.trim() || ''

        // Show inline edit bar above input
        _editingMsgId = msgId
        let editBar = document.getElementById('chatEditBar')
        if (!editBar) {
            editBar = document.createElement('div')
            editBar.id = 'chatEditBar'
            editBar.className = 'chat-edit-bar'
            const filePreview = document.getElementById('chatFilePreview')
            filePreview?.parentNode?.insertBefore(editBar, filePreview)
        }
        editBar.innerHTML = `
            <div class="chat-edit-bar-inner">
                <span class="chat-edit-bar-icon">✏️</span>
                <span class="chat-edit-bar-label">Editing message</span>
                <button class="chat-edit-bar-cancel" onclick="cancelEdit()">×</button>
            </div>
        `
        editBar.style.display = 'block'

        // Pre-fill input with current message
        if (chatInput) {
            chatInput.value = current
            chatInput.dispatchEvent(new Event('input'))
            chatInput.focus()
            chatInput.select()
        }
    }

    window.cancelEdit = function() {
        _editingMsgId = null
        const editBar = document.getElementById('chatEditBar')
        if (editBar) editBar.style.display = 'none'
        if (chatInput) {
            chatInput.value = ''
            chatInput.style.height = 'auto'
        }
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

        // ── Ctrl+V / paste image from clipboard ──────────────
        chatInput.addEventListener('paste', e => {
            const items = e.clipboardData?.items
            if (!items) return
            for (const item of items) {
                if (item.kind === 'file' && item.type.startsWith('image/')) {
                    e.preventDefault()
                    const file = item.getAsFile()
                    if (!file) return
                    setPastedFile(file)
                    return
                }
            }
        })

        // ── Right-click context menu with Paste option ────────
        chatInput.addEventListener('contextmenu', async e => {
            // Only intercept if clipboard might have an image
            // We show our custom menu always so user can paste text too
            try {
                const clipItems = await navigator.clipboard.read().catch(() => null)
                if (!clipItems) return // browser denied — fall back to native
                const hasImage = clipItems.some(item => item.types.some(t => t.startsWith('image/')))
                if (!hasImage) return // no image in clipboard — use native menu
                e.preventDefault()

                // Remove any existing custom menu
                document.getElementById('chatPasteMenu')?.remove()

                const menu = document.createElement('div')
                menu.id = 'chatPasteMenu'
                menu.className = 'chat-paste-menu'
                menu.innerHTML = `
                    <div class="chat-paste-menu-item" id="chatPasteMenuItem">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <rect x="9" y="2" width="6" height="4" rx="1"/>
                            <path d="M9 2H7a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2h-2"/>
                        </svg>
                        Paste Image
                    </div>`

                menu.style.left = e.clientX + 'px'
                menu.style.top  = e.clientY + 'px'
                document.body.appendChild(menu)

                document.getElementById('chatPasteMenuItem').addEventListener('click', async () => {
                    menu.remove()
                    try {
                        const items = await navigator.clipboard.read()
                        for (const item of items) {
                            const imageType = item.types.find(t => t.startsWith('image/'))
                            if (imageType) {
                                const blob = await item.getType(imageType)
                                const ext  = imageType.split('/')[1] || 'png'
                                const file = new File([blob], `screenshot.${ext}`, { type: imageType })
                                setPastedFile(file)
                                break
                            }
                        }
                    } catch(err) { console.warn('Clipboard read failed:', err) }
                })

                // Close on outside click
                setTimeout(() => {
                    const close = (ev) => { if (!menu.contains(ev.target)) { menu.remove(); document.removeEventListener('click', close) } }
                    document.addEventListener('click', close)
                }, 0)
            } catch(err) { /* fall back to native context menu */ }
        })
    }

    function setPastedFile(file) {
        const sizeMB = (file.size / 1024 / 1024).toFixed(1)
        const prev   = document.getElementById('chatFilePreview')
        if (file.size > 20 * 1024 * 1024) {
            if (prev) prev.innerHTML = `<div class="chat-file-preview-item error">⚠️ File too large (${sizeMB}MB). Max 20MB.</div>`
            return
        }
        _pastedFile = file
        // Show image thumbnail preview
        const url = URL.createObjectURL(file)
        if (prev) {
            prev.innerHTML = `
                <div class="chat-file-preview-item chat-file-preview-img-item">
                    <img src="${url}" class="chat-file-preview-thumb" alt="screenshot">
                    <span class="chat-file-preview-name">${escHtml(file.name)}</span>
                    <span class="chat-file-preview-size">${sizeMB}MB</span>
                    <button class="chat-file-remove" id="chatPasteRemove">×</button>
                </div>`
            document.getElementById('chatPasteRemove')?.addEventListener('click', () => {
                URL.revokeObjectURL(url)
                _pastedFile = null
                prev.innerHTML = ''
            })
        }
        chatInput?.focus()
    }

    document.getElementById('chatSendBtn')?.addEventListener('click', sendMessage)

    // ── Emoji Picker ─────────────────────────────────────────
    const EMOJIS = [
        '😀','😁','😂','🤣','😃','😄','😅','😆','😊','😋','😎','😍','🥰','😘','😗',
        '🤔','🤗','😐','😑','😶','😏','😒','🙄','😬','🤥','😌','😔','😪','🤤','😴',
        '😷','🤒','🤕','🤢','🤧','🥵','🥶','😵','🤯','🤠','🥳','😎','🤓','🧐',
        '😈','👿','💀','☠️','💩','🤡','👹','👺','👻','👽','👾','🤖',
        '👋','🤚','🖐️','✋','🖖','👌','🤏','✌️','🤞','🤟','🤘','👍','👎','✊','👊',
        '❤️','🧡','💛','💚','💙','💜','🖤','🤍','🤎','💔','❣️','💕','💞','💓','💗',
        '🔥','✨','⭐','🌟','💫','💥','🎉','🎊','🎈','🎁','🏆','🥇','🎯',
        '😂','💯','👀','🙌','🤝','🙏','💪','🦾','✍️','👏','🤲',
        '🐶','🐱','🐭','🐹','🐰','🦊','🐻','🐼','🐨','🐯','🦁','🐮','🐷',
        '🍕','🍔','🍟','🌮','🌯','🍜','🍝','🍣','🍱','🍛','🍦','🍰','🎂','☕','🧋',
        '🚀','🛸','🌍','🌙','☀️','⚡','🌈','❄️','🌊','🔮'
    ]

    let _emojiOpen = false

    function buildEmojiPicker() {
        let picker = document.getElementById('chatEmojiPicker')
        if (picker) return picker

        picker = document.createElement('div')
        picker.id = 'chatEmojiPicker'
        picker.style.cssText = `
            position:absolute; bottom:60px; left:8px; z-index:9999;
            background:#fff; border:1.5px solid #dde8e6; border-radius:12px;
            box-shadow:0 4px 20px rgba(0,0,0,0.15);
            padding:10px; width:272px; max-height:220px;
            overflow-y:auto; display:none;
            display:grid; grid-template-columns:repeat(8,1fr);
            gap:2px;
        `
        EMOJIS.forEach(emoji => {
            const btn = document.createElement('button')
            btn.textContent = emoji
            btn.type = 'button'
            btn.style.cssText = `
                background:none; border:none; cursor:pointer;
                font-size:22px; padding:4px; border-radius:6px;
                transition:background 0.15s; line-height:1;
            `
            btn.addEventListener('mouseenter', () => btn.style.background = '#f0f5f5')
            btn.addEventListener('mouseleave', () => btn.style.background = 'none')
            btn.addEventListener('click', () => {
                if (chatInput) {
                    const start = chatInput.selectionStart
                    const end   = chatInput.selectionEnd
                    const val   = chatInput.value
                    chatInput.value = val.slice(0, start) + emoji + val.slice(end)
                    chatInput.selectionStart = chatInput.selectionEnd = start + emoji.length
                    chatInput.focus()
                    chatInput.dispatchEvent(new Event('input'))
                }
            })
            picker.appendChild(btn)
        })

        // Append inside the chat panel so it stays within bounds
        const convView = document.getElementById('chatConvView')
        if (convView) convView.appendChild(picker)
        else document.body.appendChild(picker)
        return picker
    }

    function toggleEmojiPicker() {
        const picker = buildEmojiPicker()
        _emojiOpen = !_emojiOpen
        picker.style.display = _emojiOpen ? 'grid' : 'none'
    }

    document.getElementById('chatEmojiBtn')?.addEventListener('click', (e) => {
        e.stopPropagation()
        toggleEmojiPicker()
    })

    // Close emoji picker when clicking outside
    document.addEventListener('click', (e) => {
        if (_emojiOpen && !e.target.closest('#chatEmojiPicker') && !e.target.closest('#chatEmojiBtn')) {
            const picker = document.getElementById('chatEmojiPicker')
            if (picker) picker.style.display = 'none'
            _emojiOpen = false
        }
    })

    // ── File attach preview
    document.getElementById('chatFileInput')?.addEventListener('change', (e) => {
        const file = e.target.files[0]
        const prev = document.getElementById('chatFilePreview')
        if (!prev) return
        if (!file) { prev.innerHTML = ''; return }

        const sizeMB = (file.size / 1024 / 1024).toFixed(1)
        if (file.size > 20 * 1024 * 1024) {
            prev.innerHTML = `<div class="chat-file-preview-item error">⚠️ File too large (${sizeMB}MB). Max 20MB.</div>`
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