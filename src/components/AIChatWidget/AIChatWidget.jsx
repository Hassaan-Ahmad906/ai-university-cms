import { useState, useRef, useEffect } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { Bot, X, Send, Minimize2, Maximize2, Sparkles, User } from 'lucide-react'
import './AIChatWidget.css'

const INITIAL_MESSAGES = {
  student: { text: "Hi! I'm your PU Study Buddy 🎓 Ask me anything about your courses, assignments, or exam preparation!", sender: 'ai' },
  teacher: { text: "Hello Professor! I'm your Teaching Assistant AI. I can help with grading rubrics, quiz generation, and lesson planning.", sender: 'ai' },
  admin: { text: "Welcome! I'm your Admin AI Assistant. I can help analyze data, generate reports, and suggest optimizations.", sender: 'ai' },
}

export default function AIChatWidget() {
  const { user } = useAuth()
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [messages, setMessages] = useState([])
  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)

  const role = user?.role || 'student'
  const aiName = role === 'student' ? 'Study Buddy' : role === 'teacher' ? 'Teaching AI' : 'Admin AI'

  // Initialize with welcome message
  useEffect(() => {
    const initial = INITIAL_MESSAGES[role] || INITIAL_MESSAGES.student
    setMessages([{ ...initial, id: 'welcome', time: new Date() }])
  }, [role])

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Focus input when opened
  useEffect(() => {
    if (isOpen && !isMinimized) inputRef.current?.focus()
  }, [isOpen, isMinimized])

  const sendMessage = async () => {
    const text = input.trim()
    if (!text) return

    const userMsg = { id: Date.now(), text, sender: 'user', time: new Date() }
    setMessages(prev => [...prev, userMsg])
    setInput('')
    setIsTyping(true)

    try {
      const response = await fetch('http://localhost:5000/api/ai/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('pu-lms-token')}`,
        },
        body: JSON.stringify({ message: text }),
      })

      let aiText
      if (response.ok) {
        const data = await response.json()
        aiText = data.response
      } else {
        throw new Error('API error')
      }

      setMessages(prev => [...prev, { id: Date.now() + 1, text: aiText, sender: 'ai', time: new Date() }])
    } catch {
      // Smart offline fallback
      await new Promise(r => setTimeout(r, 800))
      let fallback
      if (role === 'student') {
        fallback = "🎓 I'm here to help with your studies! Try asking about:\n• Course concepts (e.g., 'Explain binary search trees')\n• Exam tips (e.g., 'How to prepare for midterms')\n• Assignment help (e.g., 'Tips for AVL tree implementation')\n\nConnect to the server for full AI-powered responses!"
      } else if (role === 'teacher') {
        fallback = "📚 Teaching Assistant (Offline): I can help with grading rubrics, quiz generation, and lesson planning. Connect to the server for AI-powered assistance!"
      } else {
        fallback = `🏛️ ${aiName} (Offline): I can assist with analytics, reports, and workflow optimization. Connect to the server for full AI capabilities.`
      }
      setMessages(prev => [...prev, { id: Date.now() + 1, text: fallback, sender: 'ai', time: new Date() }])
    } finally {
      setIsTyping(false)
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  if (!isOpen) {
    return (
      <button className="ai-chat-fab" onClick={() => setIsOpen(true)} title={`Open ${aiName}`}>
        <div className="ai-chat-fab__glow" />
        <Sparkles size={24} />
        <span className="ai-chat-fab__pulse" />
      </button>
    )
  }

  return (
    <div className={`ai-chat-widget ${isMinimized ? 'minimized' : ''}`}>
      {/* Header */}
      <div className="ai-chat__header" onClick={() => isMinimized && setIsMinimized(false)}>
        <div className="ai-chat__header-info">
          <div className="ai-chat__avatar"><Bot size={18} /></div>
          <div>
            <div className="ai-chat__name">PU {aiName}</div>
            <div className="ai-chat__status">
              <span className="ai-chat__status-dot" />
              {isTyping ? 'Typing...' : 'Online'}
            </div>
          </div>
        </div>
        <div className="ai-chat__header-actions">
          <button onClick={(e) => { e.stopPropagation(); setIsMinimized(!isMinimized) }}>
            {isMinimized ? <Maximize2 size={14} /> : <Minimize2 size={14} />}
          </button>
          <button onClick={() => setIsOpen(false)}><X size={14} /></button>
        </div>
      </div>

      {/* Messages */}
      {!isMinimized && (
        <>
          <div className="ai-chat__messages">
            {messages.map(msg => (
              <div key={msg.id} className={`ai-chat__msg ai-chat__msg--${msg.sender}`}>
                {msg.sender === 'ai' && (
                  <div className="ai-chat__msg-avatar"><Bot size={14} /></div>
                )}
                <div className="ai-chat__msg-bubble">
                  <div className="ai-chat__msg-text">{msg.text}</div>
                  <div className="ai-chat__msg-time">
                    {msg.time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
                {msg.sender === 'user' && (
                  <div className="ai-chat__msg-avatar ai-chat__msg-avatar--user"><User size={14} /></div>
                )}
              </div>
            ))}
            {isTyping && (
              <div className="ai-chat__msg ai-chat__msg--ai">
                <div className="ai-chat__msg-avatar"><Bot size={14} /></div>
                <div className="ai-chat__msg-bubble">
                  <div className="ai-chat__typing">
                    <span /><span /><span />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="ai-chat__input-area">
            <input
              ref={inputRef}
              className="ai-chat__input"
              placeholder={`Ask ${aiName} anything...`}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <button className="ai-chat__send" onClick={sendMessage} disabled={!input.trim()}>
              <Send size={16} />
            </button>
          </div>
        </>
      )}
    </div>
  )
}
