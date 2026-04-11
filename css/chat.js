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

    // Clear unread header highlight when user scrolls to bottom of messages
    if (messagesEl) {
        messagesEl.addEventListener('scroll', () => {
            const atBottom = messagesEl.scrollHeight - messagesEl.scrollTop - messagesEl.clientHeight < 60
            if (atBottom) _setHeaderUnread(false)
        })
    }
    let   _pastedFile     = null   // holds clipboard-pasted image

    // ── Reactions (server-side) ───────────────────────────────
    const REACTIONS = ['❤️','😂','😮','😢','😡','👍']

    // Get current user's own reaction
    function _getMyReaction(reactionsJson) {
        if (!reactionsJson) return null
        try {
            const r = typeof reactionsJson === 'string' ? JSON.parse(reactionsJson) : reactionsJson
            return r[`${myRole}_${myId}`]?.emoji || null
        } catch(e) { return null }
    }

    // Build grouped reaction bubbles HTML — shows all reactions from everyone
    function _renderReactions(reactionsJson, msgId) {
        if (!reactionsJson) return ''
        let r = {}
        try { r = typeof reactionsJson === 'string' ? JSON.parse(reactionsJson) : reactionsJson } catch(e) { return '' }
        const keys = Object.keys(r)
        if (!keys.length) return ''
        // Group by emoji
        const groups = {}
        keys.forEach(k => {
            const emoji = r[k].emoji
            if (!groups[emoji]) groups[emoji] = { emoji, count: 0, mine: false }
            groups[emoji].count++
            if (k === `${myRole}_${myId}`) groups[emoji].mine = true
        })
        return Object.values(groups).map(g =>
            `<span class="chat-reaction${g.mine ? ' chat-reaction-mine' : ''}" onclick="showReactionPicker(event,${msgId})" title="${g.count} reaction${g.count>1?'s':''}">${g.emoji}${g.count > 1 ? `<span class="chat-reaction-count">${g.count}</span>` : ''}</span>`
        ).join('')
    }
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
            return `<div class="chat-avatar role-${role}" style="width:${size}px;height:${size}px;font-size:${fs}px;flex-shrink:0;padding:0;overflow:hidden;"><img src="${escHtml(src)}" alt="${initial}" style="width:100%;height:100%;object-fit:cover;border-radius:50%;display:block;"></div>`
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

    // ── Image preview modal ──────────────────────────────────
    function _openImgPreview(url, name) {
        let overlay = document.getElementById('chatImgPreviewOverlay')
        if (!overlay) {
            overlay = document.createElement('div')
            overlay.id = 'chatImgPreviewOverlay'
            overlay.style.cssText = 'position:fixed;inset:0;z-index:99999;background:rgba(0,0,0,0.82);display:flex;align-items:center;justify-content:center;flex-direction:column;gap:12px;'
            overlay.innerHTML = `
                <button id="chatImgPreviewClose" style="position:absolute;top:16px;right:20px;background:rgba(255,255,255,0.12);border:none;color:#fff;font-size:22px;width:38px;height:38px;border-radius:50%;cursor:pointer;display:flex;align-items:center;justify-content:center;line-height:1;">×</button>
                <img id="chatImgPreviewImg" src="" alt="" style="max-width:90vw;max-height:80vh;border-radius:10px;object-fit:contain;box-shadow:0 8px 40px rgba(0,0,0,0.5);">
                <div id="chatImgPreviewName" style="color:rgba(255,255,255,0.7);font-size:12px;max-width:90vw;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;"></div>
                <a id="chatImgPreviewDownload" href="" download="" style="color:#9FE1CB;font-size:12px;text-decoration:none;padding:6px 14px;border:1px solid rgba(159,225,203,0.4);border-radius:20px;">Download</a>
            `
            document.body.appendChild(overlay)
            document.getElementById('chatImgPreviewClose').onclick = _closeImgPreview
            overlay.addEventListener('click', e => { if (e.target === overlay) _closeImgPreview() })
            document.addEventListener('keydown', e => { if (e.key === 'Escape') _closeImgPreview() })
        }
        document.getElementById('chatImgPreviewImg').src         = url
        document.getElementById('chatImgPreviewImg').alt         = name || ''
        document.getElementById('chatImgPreviewName').textContent = name || ''
        document.getElementById('chatImgPreviewDownload').href    = url
        document.getElementById('chatImgPreviewDownload').download = name || 'image'
        overlay.style.display = 'flex'
    }
    function _closeImgPreview() {
        const overlay = document.getElementById('chatImgPreviewOverlay')
        if (overlay) overlay.style.display = 'none'
    }
    window._openChatImgPreview = _openImgPreview

    function renderFileBubble(url, name, type) {
        const safeName = escHtml(name || 'file')
        const safeUrl  = escHtml(url)
        if (type && type.startsWith('image/')) {
            return `<div class="chat-file-img"><img src="${safeUrl}" alt="${safeName}" onclick="window._openChatImgPreview('${safeUrl}','${safeName}')" style="max-width:200px;max-height:180px;border-radius:8px;cursor:pointer;display:block;margin-top:4px;"></div>`
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
        _lastIncomingMsgId = 0   // reset so we don't sound on history when opening a conversation
        _setHeaderUnread(false)  // clear highlight when opening a new conversation

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

    let _lastIncomingMsgId = 0   // tracks last received msg id for in-conv sound

    function _setHeaderUnread(hasUnread) {
        const header = document.querySelector('.chat-panel-header')
        if (!header) return
        if (hasUnread) header.classList.add('has-unread')
        else header.classList.remove('has-unread')
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

            // Play sound when a new message arrives from the other person while conv is open
            const incomingMsgs = msgs.filter(m => !(String(m.sender_id) === String(myId) && m.sender_role === myRole) && !m.is_unsent)
            if (incomingMsgs.length > 0) {
                const latestIncoming = incomingMsgs[incomingMsgs.length - 1]
                if (_lastIncomingMsgId !== 0 && latestIncoming.id > _lastIncomingMsgId) {
                    playChatSound('message')
                    // Highlight panel header on new incoming message
                    _setHeaderUnread(true)
                }
                _lastIncomingMsgId = latestIncoming.id
            }

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
                            ${!unsent ? `<div class="chat-reaction-row">${_renderReactions(m.reactions, m.id)}</div>` : ''}
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
                _setHeaderUnread(false)   // user is at bottom — they can see the messages
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
    // ── Reactions ─────────────────────────────────────────────
    window.doReact = async function(msgId, emoji) {
        document.getElementById('chatMsgMenu')?.remove()
        // Optimistic toggle
        const myEmoji = _getMyReactionFromDom(msgId)
        const nextEmoji = myEmoji === emoji ? null : emoji
        // Persist to server — get back full updated reactions
        try {
            const res = await _fetch(`${endpoint}/messages/react/${msgId}`, {
                method: 'POST',
                body: JSON.stringify({ emoji: nextEmoji })
            })
            if (res.ok) {
                const msgEl = messagesEl?.querySelector(`[data-id="${msgId}"]`)
                if (msgEl) _applyReactionDom(msgEl, msgId, res.reactions)
            }
        } catch(e) { console.warn('[React]', e) }
    }

    function _getMyReactionFromDom(msgId) {
        const el = messagesEl?.querySelector(`[data-id="${msgId}"] .chat-reaction-mine`)
        return el ? el.textContent.trim().charAt(0) : null
    }

    function _applyReactionDom(msgEl, msgId, reactionsObj) {
        // reactionsObj: the updated reactions JSON from server response
        let rowEl = msgEl.querySelector('.chat-reaction-row')
        if (!rowEl) {
            rowEl = document.createElement('div')
            rowEl.className = 'chat-reaction-row'
            const timeEl = msgEl.querySelector('.chat-msg-time')
            if (timeEl) timeEl.after(rowEl)
            else msgEl.querySelector('.chat-msg-body')?.appendChild(rowEl)
        }
        rowEl.innerHTML = _renderReactions(reactionsObj, msgId)
    }

    window.showReactionPicker = function(e, msgId) {
        e.stopPropagation()
        document.getElementById('chatMsgMenu')?.remove()
        const menu = document.createElement('div')
        menu.id = 'chatMsgMenu'
        menu.style.cssText = 'position:fixed;z-index:99999;background:#fff;border:1.5px solid #e0eee9;border-radius:20px;box-shadow:0 6px 24px rgba(0,0,0,0.18);padding:6px 8px;'
        menu.innerHTML = `<div class="chat-ctx-reaction-row">${REACTIONS.map(r => `<button class="chat-ctx-react-btn" onclick="doReact(${msgId},'${r}')">${r}</button>`).join('')}</div>`
        const rect = e.currentTarget.getBoundingClientRect()
        let left = rect.left
        if (left + 220 > window.innerWidth) left = window.innerWidth - 228
        menu.style.left = left + 'px'
        menu.style.top  = (rect.top - 60) + 'px'
        document.body.appendChild(menu)
        setTimeout(() => document.addEventListener('click', () => menu.remove(), { once: true }), 10)
    }

    window.showMsgMenu = function(e, msgId, isSent, isUnsent) {
        e.stopPropagation()
        closeMsgMenu()

        const menu = document.createElement('div')
        menu.id = 'chatMsgMenu'

        let items = ''

        // ── Reaction row (always shown for non-unsent messages) ──
        if (!isUnsent) {
            items += `<div class="chat-ctx-reaction-row">`
            items += REACTIONS.map(r => `<button class="chat-ctx-react-btn" onclick="doReact(${msgId},'${r}')">${r}</button>`).join('')
            items += `</div>`
            items += `<div class="chat-ctx-divider"></div>`
        }

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
            visibility:hidden;
        `
        document.body.appendChild(menu)

        // Measure actual menu size after it's in the DOM
        const menuW = menu.offsetWidth  || 210
        const menuH = menu.offsetHeight || 280
        const rect  = e.currentTarget.getBoundingClientRect()
        const vw    = window.innerWidth
        const vh    = window.innerHeight
        const MARGIN = 8

        // Horizontal: prefer left-aligned to button, clamp within viewport
        let left = rect.right - menuW
        if (left < MARGIN)        left = MARGIN
        if (left + menuW > vw - MARGIN) left = vw - menuW - MARGIN

        // Vertical: prefer below button, flip above if not enough room
        let top = rect.bottom + 4
        if (top + menuH > vh - MARGIN) top = rect.top - menuH - 4
        if (top < MARGIN) top = MARGIN

        menu.style.top  = top + 'px'
        menu.style.left = left + 'px'
        menu.style.visibility = 'visible'

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
    // ── Drag to reposition chat panel ────────────────────────
    ;(function _initDrag() {
        const header = document.querySelector('.chat-panel-header')
        if (!panel || !header) return

        let _dragging = false
        let _startX = 0, _startY = 0
        let _startLeft = 0, _startTop = 0

        function _getRect() { return panel.getBoundingClientRect() }

        header.addEventListener('mousedown', e => {
            if (e.target.closest('.chat-close-btn')) return
            _dragging = true
            const rect = _getRect()
            // Convert current position to top/left if still using bottom/right
            panel.style.bottom = 'auto'
            panel.style.right  = 'auto'
            panel.style.left   = rect.left + 'px'
            panel.style.top    = rect.top  + 'px'
            panel.classList.add('dragging')
            _startX    = e.clientX
            _startY    = e.clientY
            _startLeft = rect.left
            _startTop  = rect.top
            e.preventDefault()
        })

        document.addEventListener('mousemove', e => {
            if (!_dragging) return
            const dx = e.clientX - _startX
            const dy = e.clientY - _startY
            const newLeft = Math.max(0, Math.min(window.innerWidth  - panel.offsetWidth,  _startLeft + dx))
            const newTop  = Math.max(0, Math.min(window.innerHeight - panel.offsetHeight, _startTop  + dy))
            panel.style.left = newLeft + 'px'
            panel.style.top  = newTop  + 'px'
        })

        document.addEventListener('mouseup', () => {
            if (!_dragging) return
            _dragging = false
            panel.classList.remove('dragging')
        })

        // Touch support
        header.addEventListener('touchstart', e => {
            if (e.target.closest('.chat-close-btn')) return
            const t = e.touches[0]
            const rect = _getRect()
            panel.style.bottom = 'auto'
            panel.style.right  = 'auto'
            panel.style.left   = rect.left + 'px'
            panel.style.top    = rect.top  + 'px'
            panel.classList.add('dragging')
            _dragging  = true
            _startX    = t.clientX
            _startY    = t.clientY
            _startLeft = rect.left
            _startTop  = rect.top
        }, { passive: true })

        document.addEventListener('touchmove', e => {
            if (!_dragging) return
            const t = e.touches[0]
            const dx = t.clientX - _startX
            const dy = t.clientY - _startY
            const newLeft = Math.max(0, Math.min(window.innerWidth  - panel.offsetWidth,  _startLeft + dx))
            const newTop  = Math.max(0, Math.min(window.innerHeight - panel.offsetHeight, _startTop  + dy))
            panel.style.left = newLeft + 'px'
            panel.style.top  = newTop  + 'px'
        }, { passive: true })

        document.addEventListener('touchend', () => {
            _dragging = false
            panel.classList.remove('dragging')
        })
    })()

    window.toggleChat = function() {
        // If minimized, restore the panel instead of toggling closed
        if (_isMinimized) {
            window.minimizeChat()
            return
        }
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
        panel?.classList.remove('minimized')
        _isMinimized = false
        const _mb = document.querySelector('.chat-minimize-btn')
        if (_mb) _mb.textContent = '−'
        _bubble.classList.remove('visible')
        clearInterval(_pollInterval)
        clearInterval(_convPollInterval)
        _convContact = null
    }

    let _isMinimized = false

    // Create bubble directly on body so it is never hidden by panel display:none
    const _bubble = document.createElement('div')
    _bubble.id = 'chatMiniBubble'
    _bubble.innerHTML = `
        <div id="chatMiniBubbleAvatar"></div>
        <div id="chatMiniBubbleEdit">
            <svg viewBox="0 0 24 24"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/></svg>
        </div>
        <div id="chatMiniBubbleUnread"></div>
    `
    _bubble.onclick = () => window.minimizeChat()
    document.body.appendChild(_bubble)

    function _renderBubbleAvatar(avatarEl, name, role, picFilename) {
        const colors = { admin:'#2e7d32', super_admin:'#f57f17', teacher:'#1565c0', student:'#6a1b9a', guard:'#00695c' }
        if (picFilename) {
            const src = _apiBase() + '/api/v1/uploads/profile_pictures/' + picFilename
            avatarEl.innerHTML = '<img src="' + src + '" style="width:100%;height:100%;object-fit:cover;border-radius:50%;display:block;">'
            avatarEl.style.background = 'transparent'
        } else {
            avatarEl.style.background = colors[role] || '#1a4545'
            avatarEl.innerHTML = avatarInitial(name)
        }
    }

    async function _updateMiniBubble() {
        const avatarEl = document.getElementById('chatMiniBubbleAvatar')
        if (!avatarEl) return
        if (_convContact) {
            // Always fetch the latest profile picture from the contacts list
            try {
                const data = await _fetch(`${endpoint}/messages/contacts`)
                if (data.ok && data.contacts) {
                    const match = data.contacts.find(c =>
                        String(c.contact_id) === String(_convContact.id) &&
                        c.contact_role === _convContact.role
                    )
                    const latestPic = match?.contact_profile_picture || _convContact.profilePicture || null
                    _renderBubbleAvatar(avatarEl, _convContact.name, _convContact.role, latestPic)
                    return
                }
            } catch(e) {}
            // Fallback to stored profilePicture
            _renderBubbleAvatar(avatarEl, _convContact.name, _convContact.role, _convContact.profilePicture)
        } else {
            avatarEl.style.background = '#1a4545'
            avatarEl.innerHTML = '<svg viewBox="0 0 24 24" style="width:28px;height:28px;fill:white;"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/></svg>'
        }
    }

    window.minimizeChat = function() {
        _isMinimized = !_isMinimized
        panel?.classList.toggle('minimized', _isMinimized)
        if (_isMinimized) {
            _updateMiniBubble()
            _bubble.classList.add('visible')
            clearInterval(_convPollInterval)
        } else {
            _bubble.classList.remove('visible')
            // Clear bubble unread badge on restore
            const bubbleUnread = document.getElementById('chatMiniBubbleUnread')
            if (bubbleUnread) { bubbleUnread.textContent = ''; bubbleUnread.classList.remove('visible') }
            if (_convContact) {
                clearInterval(_convPollInterval)
                _convPollInterval = setInterval(loadMessages, 4000)
            }
        }
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
        // Position relative to the emoji button
        const btnRect = document.getElementById('chatEmojiBtn')?.getBoundingClientRect()
        const pickerBottom = btnRect ? (window.innerHeight - btnRect.top + 8) : 80
        const pickerLeft   = btnRect ? Math.max(4, Math.min(btnRect.left, window.innerWidth - 280)) : 8
        picker.style.cssText = `
            position:fixed; bottom:${pickerBottom}px; left:${pickerLeft}px; z-index:99999;
            background:#fff; border:1.5px solid #dde8e6; border-radius:12px;
            box-shadow:0 4px 20px rgba(0,0,0,0.18);
            padding:10px; width:272px; max-height:220px;
            overflow-y:auto; display:none;
            grid-template-columns:repeat(8,1fr);
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
            btn.addEventListener('click', (ev) => {
                ev.stopPropagation()
                if (chatInput) {
                    const start = chatInput.selectionStart
                    const end   = chatInput.selectionEnd
                    const val   = chatInput.value
                    chatInput.value = val.slice(0, start) + emoji + val.slice(end)
                    chatInput.selectionStart = chatInput.selectionEnd = start + emoji.length
                    chatInput.focus()
                    chatInput.dispatchEvent(new Event('input'))
                }
                // Close after inserting
                picker.style.display = 'none'
                _emojiOpen = false
            })
            picker.appendChild(btn)
        })

        // Append to body so it's never clipped by overflow:hidden
        document.body.appendChild(picker)
        return picker
    }

    function toggleEmojiPicker() {
        const picker = buildEmojiPicker()
        _emojiOpen = !_emojiOpen
        if (_emojiOpen) {
            // Reposition each open so it tracks the button correctly
            const btnRect = document.getElementById('chatEmojiBtn')?.getBoundingClientRect()
            if (btnRect) {
                const bottom = window.innerHeight - btnRect.top + 8
                const left   = Math.max(4, Math.min(btnRect.left, window.innerWidth - 280))
                picker.style.bottom = bottom + 'px'
                picker.style.left   = left + 'px'
            }
            picker.style.display = 'grid'
        } else {
            picker.style.display = 'none'
        }
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

    // ── Notification sound (Web Audio API — no external files needed) ───
    let _audioCtx = null
    function _getAudioCtx() {
        if (!_audioCtx) {
            try { _audioCtx = new (window.AudioContext || window.webkitAudioContext)() } catch(e) {}
        }
        return _audioCtx
    }

    window.playChatSound = playChatSound
    function playChatSound(type = 'message') {
        try {
            const ctx = _getAudioCtx()
            if (!ctx) return

            // Resume if suspended (mobile autoplay policy) — wait for resume before playing
            const _play = () => {
                const now = ctx.currentTime
                _playChatTone(ctx, type, now)
            }
            if (ctx.state === 'suspended') {
                ctx.resume().then(_play).catch(() => {})
                return
            }

            const now = ctx.currentTime
            _playChatTone(ctx, type, now)
        } catch(e) { /* sound is non-critical */ }
    }

    function _playChatTone(ctx, type, now) {
        if (type === 'message') {
            const notes = [
                { freq: 880, start: 0,    dur: 0.12, gain: 0.28 },
                { freq: 1100, start: 0.13, dur: 0.12, gain: 0.22 }
            ]
            notes.forEach(({ freq, start, dur, gain }) => {
                const osc = ctx.createOscillator()
                const vol = ctx.createGain()
                osc.type      = 'sine'
                osc.frequency.setValueAtTime(freq, now + start)
                vol.gain.setValueAtTime(0, now + start)
                vol.gain.linearRampToValueAtTime(gain, now + start + 0.015)
                vol.gain.exponentialRampToValueAtTime(0.001, now + start + dur)
                osc.connect(vol)
                vol.connect(ctx.destination)
                osc.start(now + start)
                osc.stop(now + start + dur + 0.02)
            })
        } else if (type === 'reaction') {
            const osc = ctx.createOscillator()
            const vol = ctx.createGain()
            osc.type = 'sine'
            osc.frequency.setValueAtTime(1320, now)
            osc.frequency.exponentialRampToValueAtTime(990, now + 0.18)
            vol.gain.setValueAtTime(0, now)
            vol.gain.linearRampToValueAtTime(0.2, now + 0.012)
            vol.gain.exponentialRampToValueAtTime(0.001, now + 0.22)
            osc.connect(vol)
            vol.connect(ctx.destination)
            osc.start(now)
            osc.stop(now + 0.25)
        }
    }

    // Unlock AudioContext on first user interaction (required by browsers)
    ;(function _unlockAudio() {
        const unlock = () => {
            const ctx = _getAudioCtx()
            if (ctx && ctx.state === 'suspended') ctx.resume()
            document.removeEventListener('click',      unlock)
            document.removeEventListener('keydown',    unlock)
            document.removeEventListener('touchstart', unlock)
            document.removeEventListener('touchend',   unlock)
        }
        document.addEventListener('click',      unlock, { once: true, passive: true })
        document.addEventListener('keydown',    unlock, { once: true })
        document.addEventListener('touchstart', unlock, { once: true, passive: true })
        document.addEventListener('touchend',   unlock, { once: true, passive: true })
    })()

    // ── Toast notification ───────────────────────────────────
    let _toastTimeout = null
    function showMessageToast(name, role, message, contactId, contactRole, soundType = 'message') {
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
        toast.dataset.soundType = soundType
        const roleColors = { admin:'#4caf50', super_admin:'#ff9800', teacher:'#2196f3', student:'#9c27b0', guard:'#00bcd4' }
        const roleLabels = { admin:'Admin', super_admin:'Super Admin', teacher:'Teacher', student:'Student', guard:'Guard' }
        const initial   = (name || '?').charAt(0).toUpperCase()
        const color     = roleColors[role] || '#7aadaa'
        const roleLabel = roleLabels[role] || role

        // Try to find profile picture from cached contacts or contacts API
        const cachedContact = (_contacts || []).find(c =>
            String(c.contact_id) === String(contactId) && c.contact_role === contactRole
        )
        const picFilename = cachedContact?.contact_profile_picture || null

        const fallbackAvatar = `<div style="width:36px;height:36px;border-radius:50%;background:${color};display:flex;align-items:center;justify-content:center;font-weight:700;font-size:15px;flex-shrink:0;">${initial}</div>`

        const buildImgAvatar = (pic) => pic
            ? `<img src="${_apiBase()}/api/v1/uploads/profile_pictures/${pic}"
                   style="width:36px;height:36px;border-radius:50%;object-fit:cover;display:block;flex-shrink:0;"
                   onerror="this.replaceWith(Object.assign(document.createElement('div'),{innerHTML:'${initial}',style:'width:36px;height:36px;border-radius:50%;background:${color};display:flex;align-items:center;justify-content:center;font-weight:700;font-size:15px;flex-shrink:0;'}))">`
            : null

        let avatarHtmlStr = buildImgAvatar(picFilename) || fallbackAvatar

        // If no pic in cache, try fetching from contacts API asynchronously and update avatar later
        if (!picFilename && contactId && contactRole) {
            _fetch(`${endpoint}/messages/contacts`).then(cd => {
                if (!cd.ok) return
                const found = (cd.contacts || []).find(c =>
                    String(c.contact_id) === String(contactId) && c.contact_role === contactRole
                )
                if (found?.contact_profile_picture) {
                    const avatarEl = toast.querySelector('img, div[style*="border-radius:50%"]')
                    if (avatarEl && toast.contains(avatarEl)) {
                        const img = document.createElement('img')
                        img.src = `${_apiBase()}/api/v1/uploads/profile_pictures/${found.contact_profile_picture}`
                        img.style.cssText = 'width:36px;height:36px;border-radius:50%;object-fit:cover;display:block;flex-shrink:0;'
                        img.onerror = () => img.replaceWith(avatarEl.cloneNode(true))
                        avatarEl.replaceWith(img)
                        // Update cache
                        const existing = _contacts.find(c => String(c.contact_id) === String(contactId) && c.contact_role === contactRole)
                        if (existing) existing.contact_profile_picture = found.contact_profile_picture
                        else _contacts.push({ contact_id: contactId, contact_role: contactRole, contact_profile_picture: found.contact_profile_picture })
                    }
                }
            }).catch(() => {})
        }

        toast.innerHTML = `
            ${avatarHtmlStr}
            <div style="flex:1;min-width:0;">
                <div style="font-weight:700;font-size:13px;margin-bottom:2px;">${escHtml(name)}</div>
                <div style="font-size:11px;opacity:0.75;margin-bottom:4px;text-transform:uppercase;letter-spacing:0.5px;">${roleLabel}</div>
                <div style="font-size:12px;opacity:0.9;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${escHtml(message)}</div>
            </div>
            <div data-toast-close="1" style="font-size:18px;opacity:0.6;line-height:1;flex-shrink:0;padding:4px;">×</div>
        `
        toast.onclick = (e) => {
            // If clicked the × close button, just hide
            if (e.target.closest('[data-toast-close]')) {
                hideToast(toast)
                return
            }
            hideToast(toast)
            // Open chat panel then navigate to the conversation
            if (_isMinimized) {
                // Restore from minimized then open the conversation
                window.minimizeChat()
                setTimeout(() => window._chatOpenConv(contactId, contactRole, name), 150)
            } else if (!_isOpen) {
                window.toggleChat()
                setTimeout(() => window._chatOpenConv(contactId, contactRole, name), 350)
            } else {
                window._chatOpenConv(contactId, contactRole, name)
            }
        }

        // Play sound
        playChatSound(toast.dataset.soundType || 'message')

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
        if (!_isOpen || _isMinimized) {
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
                    // Update bubble unread badge when minimized
                    if (_isMinimized) {
                        const bubbleUnread = document.getElementById('chatMiniBubbleUnread')
                        if (bubbleUnread) {
                            const totalUnread = Object.values(_lastUnreadContacts).reduce((a, b) => a + b, 0) + (currUnread - prevUnread)
                            bubbleUnread.textContent = totalUnread > 99 ? '99+' : totalUnread
                            bubbleUnread.classList.add('visible')
                        }
                    }
                }
                _lastUnreadContacts[key] = currUnread
            })
            // Also check for reaction notifications
            _checkReactionNotifications()
        } else {
            // Panel is open — update tracking but still sound for OTHER conversations
            const contacts = data.contacts || []
            contacts.forEach(c => {
                const key        = `${c.contact_id}:${c.contact_role}`
                const prevUnread = _lastUnreadContacts[key] || 0
                const currUnread = parseInt(c.unread) || 0
                // Only play sound if the new message is NOT from the currently open conversation
                const isActiveConv = _convContact &&
                    String(_convContact.id)   === String(c.contact_id) &&
                    _convContact.role         === c.contact_role
                if (currUnread > prevUnread && currUnread > 0 && !isActiveConv) {
                    playChatSound('message')
                }
                _lastUnreadContacts[key] = currUnread
            })
            // Always check reaction notifications regardless of panel state
            _checkReactionNotifications()
        }
    }, 8000)

    // Reaction notification tracker
    let _lastReactionNotifId = 0
    async function _checkReactionNotifications() {
        try {
            const data = await _fetch(`${endpoint}/messages/reaction-notifications?after=${_lastReactionNotifId}`)
            if (!data.ok || !data.notifications?.length) return
            data.notifications.forEach(n => {
                if (n.id > _lastReactionNotifId) _lastReactionNotifId = n.id
                const meta = n.meta || {}
                // Only show toast if the reactor is not me
                if (String(meta.reactor_id) !== String(myId) || meta.reactor_role !== myRole) {
                    // Use live name from cached contacts if available
                    const reactorContact = (_contacts || []).find(c =>
                        String(c.contact_id) === String(meta.reactor_id) && c.contact_role === meta.reactor_role
                    )
                    const reactorName = reactorContact?.contact_name || n.title
                    showMessageToast(reactorName, meta.reactor_role || 'user', n.message, meta.reactor_id, meta.reactor_role, 'reaction')
                }
                // If the conversation is open, refresh messages to show the reaction
                if (_convContact &&
                    String(_convContact.id) === String(meta.reactor_id) &&
                    _convContact.role === meta.reactor_role) {
                    loadMessages()
                }
            })
        } catch(e) {}
    }

    // Initial load — seed BOTH _lastUnreadContacts AND _lastReactionNotifId
    // so we don't toast on page load for old notifications
    _fetch(`${endpoint}/messages/reaction-notifications?after=0&seed=1`).then(data => {
        if (data.ok && data.notifications?.length) {
            // Seed to the highest existing ID — only NEW ones after this will toast
            _lastReactionNotifId = Math.max(...data.notifications.map(n => n.id))
        }
    }).catch(() => {})

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