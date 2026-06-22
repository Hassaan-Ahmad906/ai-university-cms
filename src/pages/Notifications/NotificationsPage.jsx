import { useState } from 'react'
import { Bell, Check, Trash2, Settings, Filter, BookOpen, CreditCard, FileText, AlertCircle, Calendar, Brain } from 'lucide-react'
import './NotificationsPage.css'

const MOCK_NOTIFICATIONS = [
  { id: 1, type: 'assignment', icon: BookOpen, title: 'New Assignment Posted', message: 'Data Structures Assignment #6 has been posted. Due: Jun 28, 2026', time: '5 min ago', read: false },
  { id: 2, type: 'payment', icon: CreditCard, title: 'Fee Payment Reminder', message: 'Your semester fee payment of ₨ 45,000 is due by June 30, 2026', time: '1 hour ago', read: false },
  { id: 3, type: 'announcement', icon: FileText, title: 'Mid-Term Schedule Released', message: 'The Controller of Examinations has published the mid-term date sheet', time: '3 hours ago', read: false },
  { id: 4, type: 'alert', icon: AlertCircle, title: 'Low Attendance Warning', message: 'Your attendance in CS-205 OOP is below 75%. Minimum required: 80%', time: '5 hours ago', read: true },
  { id: 5, type: 'event', icon: Calendar, title: 'Career Fair Tomorrow', message: 'Annual Career Fair 2026 at Sports Complex. 50+ companies participating', time: '8 hours ago', read: true },
  { id: 6, type: 'ai', icon: Brain, title: 'AI Study Recommendation', message: 'Based on your quiz performance, we recommend reviewing Chapter 7: Trees & Graphs', time: '1 day ago', read: true },
  { id: 7, type: 'assignment', icon: BookOpen, title: 'Grade Published', message: 'Your grade for AI Quiz #3 has been published. Score: 88/100', time: '1 day ago', read: true },
  { id: 8, type: 'announcement', icon: FileText, title: 'Library Extended Hours', message: 'Central Library will remain open until 11 PM during exam period', time: '2 days ago', read: true },
]

const TYPE_COLORS = {
  assignment: '#5c6bc0',
  payment: '#c9a96e',
  announcement: '#06b6d4',
  alert: '#ef5350',
  event: '#10b981',
  ai: '#8b5cf6',
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS)
  const [filter, setFilter] = useState('all')

  const unreadCount = notifications.filter(n => !n.read).length
  const filtered = filter === 'all' ? notifications : filter === 'unread' ? notifications.filter(n => !n.read) : notifications.filter(n => n.type === filter)

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })))
  }

  const markRead = (id) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n))
  }

  const deleteNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id))
  }

  return (
    <div className="notif-page">
      <div className="notif-header">
        <div>
          <h1>Notifications</h1>
          <p>{unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}</p>
        </div>
        <div className="notif-header-actions">
          <button className="notif-mark-all-btn" onClick={markAllRead}>
            <Check size={16} /> Mark all read
          </button>
        </div>
      </div>

      <div className="notif-filters">
        {['all', 'unread', 'assignment', 'payment', 'announcement', 'alert'].map(f => (
          <button key={f} className={`notif-filter-chip ${filter === f ? 'active' : ''}`} onClick={() => setFilter(f)}>
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      <div className="notif-list">
        {filtered.length === 0 ? (
          <div className="notif-empty">
            <Bell size={40} />
            <p>No notifications to show</p>
          </div>
        ) : (
          filtered.map(notif => {
            const Icon = notif.icon
            return (
              <div key={notif.id} className={`notif-item ${notif.read ? '' : 'unread'}`} onClick={() => markRead(notif.id)}>
                <div className="notif-item__icon" style={{ '--notif-color': TYPE_COLORS[notif.type] || '#5c6bc0' }}>
                  <Icon size={18} />
                </div>
                <div className="notif-item__content">
                  <div className="notif-item__title">{notif.title}</div>
                  <div className="notif-item__message">{notif.message}</div>
                  <div className="notif-item__time">{notif.time}</div>
                </div>
                <div className="notif-item__actions">
                  {!notif.read && <span className="notif-item__dot" />}
                  <button className="notif-item__delete" onClick={(e) => { e.stopPropagation(); deleteNotification(notif.id) }}>
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
