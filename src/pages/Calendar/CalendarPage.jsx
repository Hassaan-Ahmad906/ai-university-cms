import { useState } from 'react'
import { ChevronLeft, ChevronRight, Clock, MapPin, Plus, BookOpen, Award, Megaphone, PartyPopper, X, Trash2 } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import './CalendarPage.css'

const EVENT_TYPES = {
  class: { color: '#5c6bc0', icon: BookOpen, label: 'Class' },
  exam: { color: '#ef4444', icon: Award, label: 'Exam' },
  event: { color: '#c9a96e', icon: PartyPopper, label: 'Event' },
  holiday: { color: '#10b981', icon: PartyPopper, label: 'Holiday' },
  deadline: { color: '#f59e0b', icon: Clock, label: 'Deadline' },
  announcement: { color: '#8b5cf6', icon: Megaphone, label: 'Notice' },
}

const DEFAULT_EVENTS = [
  { id: 1, title: 'Data Structures Lecture', type: 'class', date: '2026-06-28', time: '10:00 AM', end: '11:30 AM', location: 'Room 204', desc: 'AVL Trees & Balancing' },
  { id: 2, title: 'AI Assignment Due', type: 'deadline', date: '2026-06-28', time: '11:59 PM', desc: 'Project Proposal Submission' },
  { id: 3, title: 'OOP Lab', type: 'class', date: '2026-06-29', time: '3:00 PM', end: '5:00 PM', location: 'Lab 3', desc: 'Design Patterns Workshop' },
  { id: 4, title: 'Mid-Term Examinations Begin', type: 'exam', date: '2026-07-01', time: '9:00 AM', location: 'Examination Hall', desc: 'All departments' },
  { id: 5, title: 'Career Fair 2026', type: 'event', date: '2026-07-03', time: '10:00 AM', end: '5:00 PM', location: 'Sports Complex', desc: '50+ companies participating' },
  { id: 6, title: 'Eid ul-Adha (Holiday)', type: 'holiday', date: '2026-07-07', desc: 'University closed' },
  { id: 7, title: 'Database Systems Quiz', type: 'exam', date: '2026-07-02', time: '2:00 PM', location: 'Room 301', desc: 'Chapters 5-8' },
  { id: 8, title: 'Semester Fee Last Date', type: 'deadline', date: '2026-06-30', time: '11:59 PM', desc: 'Late fee surcharge after this date' },
  { id: 9, title: 'Sports Week', type: 'event', date: '2026-07-10', time: '8:00 AM', location: 'Sports Complex', desc: 'Annual inter-department competition' },
  { id: 10, title: 'Computer Networks Lab', type: 'class', date: '2026-06-30', time: '11:00 AM', end: '12:30 PM', location: 'Lab 5' },
]

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

const iS = { width: '100%', padding: '9px 14px', borderRadius: '10px', border: '1.5px solid var(--color-border, #e0e0e0)', background: 'var(--color-bg-secondary, #f8f8f8)', fontSize: '13.5px', color: 'var(--color-text-primary, #333)', outline: 'none', boxSizing: 'border-box' }
const lS = { display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--color-text-secondary, #666)', marginBottom: '5px' }

export default function CalendarPage() {
  const { user } = useAuth()
  const role = user?.role || 'student'
  const isAdmin = role === 'admin'
  const canManage = ['admin', 'hod', 'dean', 'registrar'].includes(role)

  const [events, setEvents] = useState(DEFAULT_EVENTS)
  const [currentDate, setCurrentDate] = useState(new Date())
  const todayObj = new Date()
  const today = `${todayObj.getFullYear()}-${String(todayObj.getMonth() + 1).padStart(2, '0')}-${String(todayObj.getDate()).padStart(2, '0')}`
  const [selectedDate, setSelectedDate] = useState(today)
  const [filter, setFilter] = useState('all')

  // Add event modal
  const [showAddEvent, setShowAddEvent] = useState(false)
  const [newEvent, setNewEvent] = useState({ title: '', type: 'event', date: '', time: '', end: '', location: '', desc: '' })

  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()
  const firstDay = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1))
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1))

  // Role-based event filtering
  const roleEvents = isAdmin ? events.filter(e => ['event', 'holiday', 'announcement'].includes(e.type)) : events
  const getEventsForDate = (dateStr) => roleEvents.filter(e => e.date === dateStr)
  const selectedEvents = roleEvents.filter(e => e.date === selectedDate && (filter === 'all' || e.type === filter))

  const filterChips = isAdmin
    ? ['all', 'event', 'holiday', 'announcement']
    : ['all', 'class', 'exam', 'deadline', 'event', 'holiday']

  const legendTypes = isAdmin
    ? Object.entries(EVENT_TYPES).filter(([key]) => ['event', 'holiday', 'announcement'].includes(key))
    : Object.entries(EVENT_TYPES)

  // Allowed event types for creation based on role
  const addableTypes = isAdmin
    ? [{ v: 'event', l: 'Event' }, { v: 'holiday', l: 'Holiday' }, { v: 'announcement', l: 'Notice' }]
    : [{ v: 'class', l: 'Class' }, { v: 'exam', l: 'Exam' }, { v: 'event', l: 'Event' }, { v: 'holiday', l: 'Holiday' }, { v: 'deadline', l: 'Deadline' }, { v: 'announcement', l: 'Notice' }]

  const calendarDays = []
  for (let i = 0; i < firstDay; i++) calendarDays.push(null)
  for (let d = 1; d <= daysInMonth; d++) calendarDays.push(d)

  const handleAddEvent = (e) => {
    e.preventDefault()
    if (!newEvent.title || !newEvent.date) return
    const evt = { ...newEvent, id: Date.now() }
    setEvents(prev => [...prev, evt])
    setShowAddEvent(false)
    setNewEvent({ title: '', type: 'event', date: '', time: '', end: '', location: '', desc: '' })
    setSelectedDate(evt.date)
  }

  const handleDeleteEvent = (id) => {
    setEvents(prev => prev.filter(e => e.id !== id))
  }

  return (
    <div className="cal-page">
      <div className="cal-header" style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <div>
          <h1>{isAdmin ? 'Events Calendar' : 'Academic Calendar'}</h1>
          <p>{isAdmin ? 'University events, holidays & notices' : 'University of the Punjab — Spring 2026'}</p>
        </div>
        {canManage && (
          <button
            onClick={() => { setNewEvent(p => ({ ...p, date: selectedDate })); setShowAddEvent(true) }}
            style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '9px 18px', borderRadius: '10px', border: 'none', background: 'var(--color-accent, #c9a96e)', color: '#fff', cursor: 'pointer', fontSize: '13px', fontWeight: 600, flexShrink: 0 }}
          >
            <Plus size={16} /> Add Event
          </button>
        )}
      </div>

      <div className="cal-layout">
        {/* Calendar Grid */}
        <div className="cal-calendar-card">
          <div className="cal-month-nav">
            <button onClick={prevMonth}><ChevronLeft size={18} /></button>
            <h2>{MONTHS[month]} {year}</h2>
            <button onClick={nextMonth}><ChevronRight size={18} /></button>
          </div>
          <div className="cal-grid-header">
            {DAYS.map(d => <div key={d} className="cal-day-label">{d}</div>)}
          </div>
          <div className="cal-grid">
            {calendarDays.map((day, i) => {
              if (!day) return <div key={`e${i}`} className="cal-cell cal-cell--empty" />
              const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
              const dayEvents = getEventsForDate(dateStr)
              const isToday = dateStr === today
              const isSelected = dateStr === selectedDate
              return (
                <div key={day} className={`cal-cell ${isToday ? 'cal-cell--today' : ''} ${isSelected ? 'cal-cell--selected' : ''} ${dayEvents.length > 0 ? 'cal-cell--has-events' : ''}`} onClick={() => setSelectedDate(dateStr)}>
                  <span className="cal-cell__day">{day}</span>
                  {dayEvents.length > 0 && (
                    <div className="cal-cell__dots">
                      {dayEvents.slice(0, 3).map(e => (
                        <span key={e.id} className="cal-cell__dot" style={{ background: EVENT_TYPES[e.type].color }} />
                      ))}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
          <div className="cal-legend">
            {legendTypes.map(([key, val]) => (
              <div key={key} className="cal-legend-item">
                <span className="cal-legend-dot" style={{ background: val.color }} />
                <span>{val.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Events Sidebar */}
        <div className="cal-events-panel">
          <div className="cal-events-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <h3>{new Date(selectedDate + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</h3>
            {canManage && (
              <button onClick={() => { setNewEvent(p => ({ ...p, date: selectedDate })); setShowAddEvent(true) }} style={{ background: 'none', border: '1.5px solid var(--color-accent, #c9a96e)', borderRadius: '8px', padding: '4px 10px', cursor: 'pointer', color: 'var(--color-accent, #c9a96e)', fontSize: '11.5px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Plus size={12} /> Add
              </button>
            )}
          </div>
          <div className="cal-event-filters">
            {filterChips.map(f => (
              <button key={f} className={`cal-filter-chip ${filter === f ? 'active' : ''}`} onClick={() => setFilter(f)}>
                {f === 'all' ? 'All' : EVENT_TYPES[f]?.label || f}
              </button>
            ))}
          </div>
          <div className="cal-events-list">
            {selectedEvents.length === 0 ? (
              <div className="cal-events-empty">
                <PartyPopper size={32} />
                <p>No events on this day</p>
              </div>
            ) : (
              selectedEvents.map(event => {
                const typeInfo = EVENT_TYPES[event.type]
                const Icon = typeInfo.icon
                return (
                  <div key={event.id} className="cal-event-card" style={{ '--event-color': typeInfo.color, position: 'relative' }}>
                    <div className="cal-event-accent" />
                    <div className="cal-event-icon"><Icon size={16} /></div>
                    <div className="cal-event-info">
                      <div className="cal-event-title">{event.title}</div>
                      {event.desc && <div className="cal-event-desc">{event.desc}</div>}
                      <div className="cal-event-meta">
                        {event.time && <span><Clock size={12} /> {event.time}{event.end ? ` - ${event.end}` : ''}</span>}
                        {event.location && <span><MapPin size={12} /> {event.location}</span>}
                      </div>
                    </div>
                    {canManage && (
                      <button onClick={() => handleDeleteEvent(event.id)} title="Remove event" style={{ position: 'absolute', top: '8px', right: '8px', background: 'none', border: 'none', cursor: 'pointer', color: '#ccc', padding: '3px', borderRadius: '6px', transition: 'color 0.15s' }}
                        onMouseEnter={e => e.currentTarget.style.color = '#ef4444'}
                        onMouseLeave={e => e.currentTarget.style.color = '#ccc'}>
                        <Trash2 size={13} />
                      </button>
                    )}
                  </div>
                )
              })
            )}
          </div>
        </div>
      </div>

      {/* ── ADD EVENT MODAL ── */}
      {showAddEvent && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }} onClick={() => setShowAddEvent(false)}>
          <div style={{ background: 'var(--color-bg-primary, #fff)', borderRadius: '16px', maxWidth: '460px', width: '94%', boxShadow: '0 20px 60px rgba(0,0,0,0.25)', animation: 'fadeIn 0.2s ease' }} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px 22px', borderBottom: '1px solid var(--color-border, #e5e5e5)' }}>
              <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 700 }}>Add New Event</h3>
              <button onClick={() => setShowAddEvent(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#999' }}><X size={20} /></button>
            </div>
            <form onSubmit={handleAddEvent} style={{ padding: '18px 22px' }}>
              <div style={{ marginBottom: '14px' }}><label style={lS}>Title *</label><input style={iS} value={newEvent.title} onChange={e => setNewEvent(p => ({ ...p, title: e.target.value }))} placeholder="e.g. Career Fair 2026" required /></div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '14px' }}>
                <div><label style={lS}>Type</label><select style={iS} value={newEvent.type} onChange={e => setNewEvent(p => ({ ...p, type: e.target.value }))}>{addableTypes.map(t => <option key={t.v} value={t.v}>{t.l}</option>)}</select></div>
                <div><label style={lS}>Date *</label><input type="date" style={iS} value={newEvent.date} onChange={e => setNewEvent(p => ({ ...p, date: e.target.value }))} required /></div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '14px' }}>
                <div><label style={lS}>Start Time</label><input style={iS} value={newEvent.time} onChange={e => setNewEvent(p => ({ ...p, time: e.target.value }))} placeholder="e.g. 10:00 AM" /></div>
                <div><label style={lS}>End Time</label><input style={iS} value={newEvent.end} onChange={e => setNewEvent(p => ({ ...p, end: e.target.value }))} placeholder="e.g. 5:00 PM" /></div>
              </div>
              <div style={{ marginBottom: '14px' }}><label style={lS}>Location</label><input style={iS} value={newEvent.location} onChange={e => setNewEvent(p => ({ ...p, location: e.target.value }))} placeholder="e.g. Sports Complex" /></div>
              <div style={{ marginBottom: '18px' }}><label style={lS}>Description</label><textarea style={{ ...iS, minHeight: '60px', resize: 'vertical' }} value={newEvent.desc} onChange={e => setNewEvent(p => ({ ...p, desc: e.target.value }))} placeholder="Brief description..." /></div>
              <button type="submit" style={{ width: '100%', padding: '10px', borderRadius: '10px', border: 'none', background: 'var(--color-accent, #c9a96e)', color: '#fff', cursor: 'pointer', fontSize: '13.5px', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                <Plus size={16} /> Add Event
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
