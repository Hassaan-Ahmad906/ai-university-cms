import { useState } from 'react'
import { ChevronLeft, ChevronRight, Clock, MapPin, Users, Plus, BookOpen, Award, Megaphone, PartyPopper } from 'lucide-react'
import './CalendarPage.css'

const EVENT_TYPES = {
  class: { color: '#5c6bc0', icon: BookOpen, label: 'Class' },
  exam: { color: '#ef4444', icon: Award, label: 'Exam' },
  event: { color: '#c9a96e', icon: PartyPopper, label: 'Event' },
  holiday: { color: '#10b981', icon: PartyPopper, label: 'Holiday' },
  deadline: { color: '#f59e0b', icon: Clock, label: 'Deadline' },
  announcement: { color: '#8b5cf6', icon: Megaphone, label: 'Notice' },
}

const EVENTS = [
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

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date(2026, 5, 28)) // June 28, 2026
  const [selectedDate, setSelectedDate] = useState('2026-06-28')
  const [filter, setFilter] = useState('all')

  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()
  const firstDay = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const today = '2026-06-28'

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1))
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1))

  const getEventsForDate = (dateStr) => EVENTS.filter(e => e.date === dateStr)
  const selectedEvents = EVENTS.filter(e => e.date === selectedDate && (filter === 'all' || e.type === filter))

  // Build calendar grid
  const calendarDays = []
  for (let i = 0; i < firstDay; i++) calendarDays.push(null)
  for (let d = 1; d <= daysInMonth; d++) calendarDays.push(d)

  return (
    <div className="cal-page">
      <div className="cal-header">
        <h1>Academic Calendar</h1>
        <p>University of the Punjab — Spring 2026</p>
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
            {Object.entries(EVENT_TYPES).map(([key, val]) => (
              <div key={key} className="cal-legend-item">
                <span className="cal-legend-dot" style={{ background: val.color }} />
                <span>{val.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Events Sidebar */}
        <div className="cal-events-panel">
          <div className="cal-events-header">
            <h3>{new Date(selectedDate + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</h3>
          </div>
          <div className="cal-event-filters">
            {['all', 'class', 'exam', 'deadline', 'event', 'holiday'].map(f => (
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
                  <div key={event.id} className="cal-event-card" style={{ '--event-color': typeInfo.color }}>
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
                  </div>
                )
              })
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
