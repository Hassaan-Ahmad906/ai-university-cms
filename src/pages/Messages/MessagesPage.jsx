import { useState, useEffect, useRef } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { Send, Search, Phone, Video, MoreVertical, Paperclip, Smile, Check, CheckCheck, Plus, X, Users, ArrowLeft } from 'lucide-react'
import './MessagesPage.css'

const API = 'http://localhost:5000/api'
const TOKEN = () => localStorage.getItem('pu-lms-token')

/* Roles a student can message (higher authority only) */
const STUDENT_CAN_MSG = ['teacher', 'hod', 'dean', 'registrar', 'clerk', 'admin', 'vc', 'controller', 'treasurer']

export default function MessagesPage() {
  const { user } = useAuth()
  const role = user?.role || 'student'
  const [conversations, setConversations] = useState([])
  const [selectedChat, setSelectedChat] = useState(null)
  const [messages, setMessages] = useState([])
  const [messageInput, setMessageInput] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [loadingConvos, setLoadingConvos] = useState(true)
  const [loadingMessages, setLoadingMessages] = useState(false)

  // New conversation modal
  const [showNewMsg, setShowNewMsg] = useState(false)
  const [userSearch, setUserSearch] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [searchLoading, setSearchLoading] = useState(false)

  const messagesEndRef = useRef(null)

  // Auto-scroll
  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages])

  // Fetch conversations
  useEffect(() => {
    const fetchConvos = async () => {
      try {
        const res = await fetch(`${API}/messages/conversations`, { headers: { Authorization: `Bearer ${TOKEN()}` } })
        if (!res.ok) throw new Error()
        const data = await res.json()
        const list = data.conversations || []
        // Map API format to UI format
        setConversations(list.map(c => ({
          id: c.user?._id || c.user?.id,
          name: c.user ? `${c.user.firstName || ''} ${c.user.lastName || ''}`.trim() : 'Unknown',
          role: c.user?.role || '',
          department: c.user?.department || '',
          avatar: c.user ? `${(c.user.firstName || '')[0] || ''}${(c.user.lastName || '')[0] || ''}`.toUpperCase() : '??',
          lastMessage: c.lastMessage || '',
          time: c.lastTime ? timeAgo(new Date(c.lastTime)) : '',
          unread: c.unread || 0,
          online: false,
        })))
      } catch {
        setConversations([])
      } finally { setLoadingConvos(false) }
    }
    fetchConvos()
  }, [])

  // Fetch messages for selected chat
  useEffect(() => {
    if (!selectedChat?.id) return
    const fetchMsgs = async () => {
      setLoadingMessages(true)
      try {
        const res = await fetch(`${API}/messages/${selectedChat.id}`, { headers: { Authorization: `Bearer ${TOKEN()}` } })
        if (!res.ok) throw new Error()
        const data = await res.json()
        const list = data.messages || []
        setMessages(list.map(m => ({
          id: m._id || m.id,
          sender: m.sender === user?.id || m.sender?._id === user?.id || m.sender === user?._id ? 'me' : 'them',
          text: m.text,
          time: new Date(m.createdAt || Date.now()).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }),
          status: m.read ? 'read' : 'delivered',
        })))
      } catch { setMessages([]) }
      finally { setLoadingMessages(false) }
    }
    fetchMsgs()
  }, [selectedChat?.id, user])

  // Send message
  const handleSend = async () => {
    if (!messageInput.trim() || !selectedChat?.id) return
    const text = messageInput.trim()
    const newMsg = { id: Date.now(), sender: 'me', text, time: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }), status: 'sent' }
    setMessages(prev => [...prev, newMsg])
    setMessageInput('')
    try {
      await fetch(`${API}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${TOKEN()}` },
        body: JSON.stringify({ receiver: selectedChat.id, text }),
      })
    } catch { /* shown locally */ }
  }

  // Search users for new conversation
  useEffect(() => {
    if (!userSearch.trim() || userSearch.length < 2) { setSearchResults([]); return }
    const timeout = setTimeout(async () => {
      setSearchLoading(true)
      try {
        const res = await fetch(`${API}/users?search=${encodeURIComponent(userSearch)}&limit=10`, { headers: { Authorization: `Bearer ${TOKEN()}` } })
        if (!res.ok) throw new Error()
        const data = await res.json()
        let results = data.users || []
        // For students: only show higher authority
        if (role === 'student') {
          results = results.filter(u => STUDENT_CAN_MSG.includes(u.role))
        }
        // Exclude self
        results = results.filter(u => (u._id || u.id) !== user?.id && (u._id || u.id) !== user?._id)
        setSearchResults(results)
      } catch { setSearchResults([]) }
      finally { setSearchLoading(false) }
    }, 400)
    return () => clearTimeout(timeout)
  }, [userSearch, role, user])

  // Start new conversation
  const startConversation = (u) => {
    const uid = u._id || u.id
    const name = `${u.firstName || ''} ${u.lastName || ''}`.trim()
    const avatar = `${(u.firstName || '')[0] || ''}${(u.lastName || '')[0] || ''}`.toUpperCase()
    // Check if conversation already exists
    const existing = conversations.find(c => c.id === uid)
    if (existing) {
      setSelectedChat(existing)
    } else {
      const newConvo = { id: uid, name, role: u.role, department: u.department, avatar, lastMessage: '', time: 'New', unread: 0 }
      setConversations(prev => [newConvo, ...prev])
      setSelectedChat(newConvo)
    }
    setShowNewMsg(false)
    setUserSearch('')
    setSearchResults([])
    setMessages([])
  }

  const ROLE_LABELS = { admin: 'Admin', teacher: 'Teacher', student: 'Student', hod: 'HOD', dean: 'Dean', clerk: 'Clerk', vc: 'VC', registrar: 'Registrar', treasurer: 'Treasurer', controller: 'Controller' }

  const filteredConversations = conversations.filter(c =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="msg-page">
      {/* Sidebar */}
      <div className="msg-sidebar">
        <div className="msg-sidebar__header">
          <h2>Messages</h2>
          <button onClick={() => setShowNewMsg(true)} style={{ background: 'var(--color-accent, #c9a96e)', border: 'none', borderRadius: '10px', padding: '7px 14px', color: '#fff', cursor: 'pointer', fontSize: '12.5px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '5px' }}>
            <Plus size={14} /> New
          </button>
        </div>
        <div className="msg-sidebar__search">
          <Search size={16} />
          <input placeholder="Search conversations..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
        </div>
        <div className="msg-sidebar__list">
          {loadingConvos ? (
            <div style={{ padding: '2rem', textAlign: 'center', color: '#888', fontSize: '13px' }}>Loading conversations...</div>
          ) : filteredConversations.length === 0 ? (
            <div style={{ padding: '2rem', textAlign: 'center', color: '#888', fontSize: '13px' }}>
              {conversations.length === 0 ? 'No conversations yet. Click "New" to start one.' : 'No matching conversations.'}
            </div>
          ) : (
            filteredConversations.map(conv => (
              <div key={conv.id} className={`msg-conv ${selectedChat?.id === conv.id ? 'active' : ''}`} onClick={() => setSelectedChat(conv)}>
                <div className="msg-conv__avatar">
                  {conv.avatar}
                  {conv.online && <span className="msg-conv__online" />}
                </div>
                <div className="msg-conv__info">
                  <div className="msg-conv__name">{conv.name}</div>
                  <div className="msg-conv__preview">{conv.lastMessage || 'Start a conversation...'}</div>
                </div>
                <div className="msg-conv__meta">
                  <span className="msg-conv__time">{conv.time}</span>
                  {conv.unread > 0 && <span className="msg-conv__badge">{conv.unread}</span>}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Chat Area */}
      <div className="msg-chat">
        {selectedChat ? (
          <>
            <div className="msg-chat__header">
              <div className="msg-chat__header-info">
                <div className="msg-chat__header-avatar">{selectedChat.avatar}</div>
                <div>
                  <div className="msg-chat__header-name">{selectedChat.name}</div>
                  <div className="msg-chat__header-status">{ROLE_LABELS[selectedChat.role] || selectedChat.role}{selectedChat.department ? ` — ${selectedChat.department}` : ''}</div>
                </div>
              </div>
            </div>

            <div className="msg-chat__messages">
              {loadingMessages ? (
                <div style={{ padding: '2rem', textAlign: 'center', color: '#888' }}>Loading messages...</div>
              ) : messages.length === 0 ? (
                <div style={{ padding: '3rem', textAlign: 'center', color: '#888', fontSize: '13.5px' }}>
                  <Send size={32} style={{ opacity: 0.3, marginBottom: 12 }} />
                  <p>No messages yet. Start the conversation!</p>
                </div>
              ) : (
                messages.map(msg => (
                  <div key={msg.id} className={`msg-bubble ${msg.sender === 'me' ? 'msg-bubble--sent' : 'msg-bubble--received'}`}>
                    <div className="msg-bubble__text">{msg.text}</div>
                    <div className="msg-bubble__meta">
                      <span>{msg.time}</span>
                      {msg.sender === 'me' && (msg.status === 'read' ? <CheckCheck size={14} className="msg-bubble__read" /> : <Check size={14} />)}
                    </div>
                  </div>
                ))
              )}
              <div ref={messagesEndRef} />
            </div>

            <div className="msg-chat__input-area">
              <input
                className="msg-chat__input"
                placeholder="Type a message..."
                value={messageInput}
                onChange={e => setMessageInput(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend() } }}
              />
              <button className="msg-chat__send-btn" onClick={handleSend} disabled={!messageInput.trim()}>
                <Send size={18} />
              </button>
            </div>
          </>
        ) : (
          <div className="msg-chat__empty">
            <Send size={48} />
            <h3>Select a conversation</h3>
            <p>Choose from your contacts or start a new message</p>
          </div>
        )}
      </div>

      {/* ── NEW MESSAGE MODAL ── */}
      {showNewMsg && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 1000, display: 'flex', alignItems: 'flex-start', justifyContent: 'center', paddingTop: '10vh', background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }} onClick={() => setShowNewMsg(false)}>
          <div style={{ background: 'var(--color-bg-primary, #fff)', borderRadius: '16px', maxWidth: '440px', width: '94%', boxShadow: '0 20px 60px rgba(0,0,0,0.25)', animation: 'fadeIn 0.2s ease', overflow: 'hidden' }} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', borderBottom: '1px solid var(--color-border, #e5e5e5)' }}>
              <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 700 }}>New Message</h3>
              <button onClick={() => setShowNewMsg(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#999', padding: '4px' }}><X size={20} /></button>
            </div>
            <div style={{ padding: '16px 20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'var(--color-bg-secondary, #f5f5f5)', borderRadius: '10px', padding: '8px 14px', marginBottom: '12px' }}>
                <Search size={16} style={{ color: '#999', flexShrink: 0 }} />
                <input
                  autoFocus
                  placeholder={role === 'student' ? 'Search faculty, HOD, admin...' : 'Search users by name or email...'}
                  value={userSearch}
                  onChange={e => setUserSearch(e.target.value)}
                  style={{ flex: 1, border: 'none', background: 'none', outline: 'none', fontSize: '13.5px', color: 'var(--color-text-primary, #333)' }}
                />
              </div>
              {role === 'student' && (
                <p style={{ fontSize: '11.5px', color: '#999', margin: '0 0 10px', fontStyle: 'italic' }}>
                  Students can message faculty, HOD, dean, and other administrative staff
                </p>
              )}
              <div style={{ maxHeight: '300px', overflow: 'auto' }}>
                {searchLoading ? (
                  <div style={{ padding: '1.5rem', textAlign: 'center', color: '#888', fontSize: '13px' }}>Searching...</div>
                ) : userSearch.length < 2 ? (
                  <div style={{ padding: '1.5rem', textAlign: 'center', color: '#aaa', fontSize: '13px' }}>Type at least 2 characters to search</div>
                ) : searchResults.length === 0 ? (
                  <div style={{ padding: '1.5rem', textAlign: 'center', color: '#888', fontSize: '13px' }}>No users found</div>
                ) : (
                  searchResults.map(u => {
                    const uid = u._id || u.id
                    const name = `${u.firstName || ''} ${u.lastName || ''}`.trim()
                    const initials = `${(u.firstName || '')[0] || ''}${(u.lastName || '')[0] || ''}`.toUpperCase()
                    return (
                      <div key={uid} onClick={() => startConversation(u)} style={{
                        display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 12px', borderRadius: '10px', cursor: 'pointer', transition: 'background 0.15s',
                      }} onMouseEnter={e => e.currentTarget.style.background = 'var(--color-bg-secondary, #f0f0f0)'}
                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                        <div style={{ width: 38, height: 38, borderRadius: '50%', background: '#5c6bc0', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: 700, flexShrink: 0 }}>{initials}</div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: '13.5px', fontWeight: 600, color: 'var(--color-text-primary, #333)' }}>{name}</div>
                          <div style={{ fontSize: '12px', color: '#888' }}>{ROLE_LABELS[u.role] || u.role}{u.department ? ` • ${u.department}` : ''}</div>
                        </div>
                      </div>
                    )
                  })
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function timeAgo(date) {
  const now = new Date()
  const diff = Math.floor((now - date) / 1000)
  if (diff < 60) return 'Just now'
  if (diff < 3600) return `${Math.floor(diff / 60)} min ago`
  if (diff < 86400) return `${Math.floor(diff / 3600)} hr ago`
  if (diff < 172800) return 'Yesterday'
  return date.toLocaleDateString('en-PK', { month: 'short', day: 'numeric' })
}
