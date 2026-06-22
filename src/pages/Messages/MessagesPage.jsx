import { useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { Send, Search, MoreVertical, Phone, Video, Paperclip, Smile, Check, CheckCheck } from 'lucide-react'
import './MessagesPage.css'

const MOCK_CONVERSATIONS = [
  { id: 1, name: 'Dr. Ahmad Khan', role: 'Professor', avatar: 'AK', lastMessage: 'Please submit your assignment before the deadline.', time: '2 min ago', unread: 2, online: true },
  { id: 2, name: 'Sara Malik', role: 'Student', avatar: 'SM', lastMessage: 'Thank you for the feedback!', time: '1 hour ago', unread: 0, online: true },
  { id: 3, name: 'CS-301 Group', role: 'Group Chat', avatar: 'CS', lastMessage: 'Ali: Has anyone started the project?', time: '3 hours ago', unread: 5, online: false },
  { id: 4, name: 'Dr. Fatima Ali', role: 'Professor', avatar: 'FA', lastMessage: 'The quiz will cover chapters 5-8.', time: 'Yesterday', unread: 0, online: false },
  { id: 5, name: 'Registrar Office', role: 'Office', avatar: 'RO', lastMessage: 'Your transcript request has been processed.', time: 'Yesterday', unread: 0, online: false },
  { id: 6, name: 'Usman Raza', role: 'Student', avatar: 'UR', lastMessage: 'Can we study together for the midterm?', time: '2 days ago', unread: 0, online: false },
]

const MOCK_MESSAGES = [
  { id: 1, sender: 'them', text: 'Good afternoon! I wanted to remind everyone about the upcoming assignment deadline.', time: '2:30 PM', status: 'read' },
  { id: 2, sender: 'them', text: 'The deadline for Data Structures Assignment #5 is tomorrow at 11:59 PM. Please make sure to submit on time.', time: '2:31 PM', status: 'read' },
  { id: 3, sender: 'me', text: 'Thank you for the reminder, Dr. Khan. I have a question about the binary tree implementation in Question 3.', time: '2:45 PM', status: 'read' },
  { id: 4, sender: 'them', text: 'Sure, what specifically is confusing you about it?', time: '2:47 PM', status: 'read' },
  { id: 5, sender: 'me', text: 'I\'m not sure whether to use iterative or recursive approach for the level-order traversal.', time: '2:50 PM', status: 'read' },
  { id: 6, sender: 'them', text: 'For level-order traversal, the iterative approach using a queue is more intuitive and efficient. Use BFS with a queue data structure.', time: '2:52 PM', status: 'read' },
  { id: 7, sender: 'them', text: 'Please submit your assignment before the deadline. Let me know if you have any other questions.', time: '3:00 PM', status: 'delivered' },
]

export default function MessagesPage() {
  const { user } = useAuth()
  const [selectedChat, setSelectedChat] = useState(MOCK_CONVERSATIONS[0])
  const [messageInput, setMessageInput] = useState('')
  const [searchQuery, setSearchQuery] = useState('')

  const filteredConversations = MOCK_CONVERSATIONS.filter(c =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="msg-page">
      {/* Sidebar */}
      <div className="msg-sidebar">
        <div className="msg-sidebar__header">
          <h2>Messages</h2>
        </div>
        <div className="msg-sidebar__search">
          <Search size={16} />
          <input placeholder="Search conversations..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
        </div>
        <div className="msg-sidebar__list">
          {filteredConversations.map(conv => (
            <div key={conv.id} className={`msg-conv ${selectedChat?.id === conv.id ? 'active' : ''}`} onClick={() => setSelectedChat(conv)}>
              <div className="msg-conv__avatar">
                {conv.avatar}
                {conv.online && <span className="msg-conv__online" />}
              </div>
              <div className="msg-conv__info">
                <div className="msg-conv__name">{conv.name}</div>
                <div className="msg-conv__preview">{conv.lastMessage}</div>
              </div>
              <div className="msg-conv__meta">
                <span className="msg-conv__time">{conv.time}</span>
                {conv.unread > 0 && <span className="msg-conv__badge">{conv.unread}</span>}
              </div>
            </div>
          ))}
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
                  <div className="msg-chat__header-status">{selectedChat.online ? 'Online' : selectedChat.role}</div>
                </div>
              </div>
              <div className="msg-chat__header-actions">
                <button className="msg-chat__action-btn"><Phone size={18} /></button>
                <button className="msg-chat__action-btn"><Video size={18} /></button>
                <button className="msg-chat__action-btn"><MoreVertical size={18} /></button>
              </div>
            </div>

            <div className="msg-chat__messages">
              {MOCK_MESSAGES.map(msg => (
                <div key={msg.id} className={`msg-bubble ${msg.sender === 'me' ? 'msg-bubble--sent' : 'msg-bubble--received'}`}>
                  <div className="msg-bubble__text">{msg.text}</div>
                  <div className="msg-bubble__meta">
                    <span>{msg.time}</span>
                    {msg.sender === 'me' && (
                      msg.status === 'read' ? <CheckCheck size={14} className="msg-bubble__read" /> : <Check size={14} />
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="msg-chat__input-area">
              <button className="msg-chat__attach-btn"><Paperclip size={18} /></button>
              <input className="msg-chat__input" placeholder="Type a message..." value={messageInput} onChange={e => setMessageInput(e.target.value)} />
              <button className="msg-chat__emoji-btn"><Smile size={18} /></button>
              <button className="msg-chat__send-btn"><Send size={18} /></button>
            </div>
          </>
        ) : (
          <div className="msg-chat__empty">
            <Send size={48} />
            <h3>Select a conversation</h3>
            <p>Choose from your contacts to start messaging</p>
          </div>
        )}
      </div>
    </div>
  )
}
