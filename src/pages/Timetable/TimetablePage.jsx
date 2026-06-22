import { useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import {
  CalendarDays, ChevronLeft, ChevronRight, Clock,
  MapPin, User, BookOpen, Zap
} from 'lucide-react'
import './TimetablePage.css'

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
const HOURS = [
  '8:00 AM', '9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
  '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM'
]

const COLORS = {
  navy: { bg: 'rgba(26, 35, 126, 0.25)', border: '#3949ab', text: '#9fa8da' },
  gold: { bg: 'rgba(201, 169, 110, 0.2)', border: '#c9a96e', text: '#d4ba8a' },
  crimson: { bg: 'rgba(183, 28, 28, 0.2)', border: '#e53935', text: '#ef9a9a' },
  teal: { bg: 'rgba(0, 150, 136, 0.2)', border: '#26a69a', text: '#80cbc4' },
  purple: { bg: 'rgba(156, 39, 176, 0.2)', border: '#ab47bc', text: '#ce93d8' },
}

const classes = [
  { id: 1, code: 'CS-401', name: 'Artificial Intelligence', teacher: 'Dr. Fatima Ali', room: 'CS Lab 3', day: 0, startHour: 8, duration: 1.5, color: 'navy' },
  { id: 2, code: 'CS-402', name: 'Operating Systems', teacher: 'Prof. Hassan Raza', room: 'Room 204', day: 0, startHour: 10, duration: 1, color: 'gold' },
  { id: 3, code: 'CS-403', name: 'Compiler Construction', teacher: 'Dr. Usman Tariq', room: 'Room 301', day: 1, startHour: 9, duration: 1.5, color: 'crimson' },
  { id: 4, code: 'CS-404', name: 'Machine Learning', teacher: 'Dr. Fatima Ali', room: 'CS Lab 1', day: 1, startHour: 14, duration: 2, color: 'teal' },
  { id: 5, code: 'CS-405', name: 'Information Security', teacher: 'Dr. Ahmad Khan', room: 'Room 105', day: 2, startHour: 8, duration: 1, color: 'purple' },
  { id: 6, code: 'MATH-401', name: 'Probability & Statistics', teacher: 'Dr. Sara Malik', room: 'Room 202', day: 2, startHour: 11, duration: 1, color: 'navy' },
  { id: 7, code: 'CS-401', name: 'Artificial Intelligence', teacher: 'Dr. Fatima Ali', room: 'Room 301', day: 3, startHour: 10, duration: 1, color: 'navy' },
  { id: 8, code: 'CS-402', name: 'Operating Systems', teacher: 'Prof. Hassan Raza', room: 'CS Lab 2', day: 3, startHour: 14, duration: 1.5, color: 'gold' },
  { id: 9, code: 'CS-403', name: 'Compiler Construction', teacher: 'Dr. Usman Tariq', room: 'Room 301', day: 4, startHour: 9, duration: 1, color: 'crimson' },
  { id: 10, code: 'MATH-401', name: 'Probability & Statistics', teacher: 'Dr. Sara Malik', room: 'Room 202', day: 4, startHour: 13, duration: 1, color: 'navy' },
]

function getTodayIndex() {
  const d = new Date().getDay()
  return d >= 1 && d <= 5 ? d - 1 : 0
}

export default function TimetablePage() {
  const { user } = useAuth()
  const [weekOffset, setWeekOffset] = useState(0)
  const todayIndex = getTodayIndex()

  const todayClasses = classes
    .filter(c => c.day === todayIndex)
    .sort((a, b) => a.startHour - b.startHour)

  const getWeekLabel = () => {
    const now = new Date()
    now.setDate(now.getDate() + weekOffset * 7)
    const monday = new Date(now)
    monday.setDate(now.getDate() - now.getDay() + 1)
    const friday = new Date(monday)
    friday.setDate(monday.getDate() + 4)
    const opts = { month: 'short', day: 'numeric' }
    return `${monday.toLocaleDateString('en-US', opts)} – ${friday.toLocaleDateString('en-US', opts)}, ${friday.getFullYear()}`
  }

  function formatHour(h) {
    const suffix = h >= 12 ? 'PM' : 'AM'
    const hr = h > 12 ? h - 12 : h === 0 ? 12 : h
    return `${hr}:00 ${suffix}`
  }

  return (
    <div className="tt-page">
      {/* Header */}
      <div className="tt-header">
        <div className="tt-header__left">
          <div className="tt-header__icon">
            <CalendarDays size={24} />
          </div>
          <div>
            <h1 className="tt-header__title">My Timetable</h1>
            <p className="tt-header__subtitle">Weekly class schedule</p>
          </div>
        </div>
        <div className="tt-header__nav">
          <button className="tt-nav-btn" onClick={() => setWeekOffset(w => w - 1)}>
            <ChevronLeft size={18} />
          </button>
          <div className="tt-header__week">
            <CalendarDays size={15} />
            <span>{getWeekLabel()}</span>
          </div>
          <button className="tt-nav-btn" onClick={() => setWeekOffset(w => w + 1)}>
            <ChevronRight size={18} />
          </button>
          <button className="tt-nav-btn tt-nav-btn--today" onClick={() => setWeekOffset(0)}>
            Today
          </button>
        </div>
      </div>

      {/* Timetable Grid */}
      <div className="tt-grid-wrapper" style={{ '--anim-order': 1 }}>
        <div className="tt-grid-scroll">
          <div className="tt-grid">
            {/* Corner cell */}
            <div className="tt-grid__corner">
              <Clock size={14} />
              <span>Time</span>
            </div>

            {/* Day headers */}
            {DAYS.map((day, i) => (
              <div
                key={day}
                className={`tt-grid__day-header ${i === todayIndex ? 'tt-grid__day-header--today' : ''}`}
              >
                <span className="tt-day-short">{day.slice(0, 3)}</span>
                <span className="tt-day-full">{day}</span>
                {i === todayIndex && <span className="tt-today-dot" />}
              </div>
            ))}

            {/* Time rows + cells */}
            {HOURS.map((hour, rowIdx) => (
              <>
                <div key={`time-${rowIdx}`} className="tt-grid__time">
                  {hour}
                </div>
                {DAYS.map((_, dayIdx) => (
                  <div key={`cell-${rowIdx}-${dayIdx}`} className="tt-grid__cell">
                    {/* render class blocks that start at this hour */}
                    {classes
                      .filter(c => c.day === dayIdx && c.startHour === 8 + rowIdx)
                      .map(cls => {
                        const color = COLORS[cls.color]
                        const heightUnits = cls.duration
                        return (
                          <div
                            key={cls.id}
                            className="tt-class-block"
                            style={{
                              '--block-bg': color.bg,
                              '--block-border': color.border,
                              '--block-text': color.text,
                              '--block-height': `calc(${heightUnits} * (60px + 1px) - 8px)`,
                            }}
                            title={cls.name}
                          >
                            <span className="tt-class-code">{cls.code}</span>
                            <span className="tt-class-room">
                              <MapPin size={10} /> {cls.room}
                            </span>
                            <span className="tt-class-teacher">
                              <User size={10} /> {cls.teacher}
                            </span>
                            <div className="tt-class-tooltip">{cls.name}</div>
                          </div>
                        )
                      })}
                  </div>
                ))}
              </>
            ))}
          </div>
        </div>
      </div>

      {/* Today's Classes */}
      <div className="tt-today" style={{ '--anim-order': 2 }}>
        <h2 className="tt-today__title">
          <Zap size={20} />
          Today's Classes — {DAYS[todayIndex]}
        </h2>
        <div className="tt-today__list">
          {todayClasses.length === 0 ? (
            <div className="tt-today__empty">
              <CalendarDays size={32} />
              <p>No classes today!</p>
            </div>
          ) : (
            todayClasses.map((cls, i) => {
              const color = COLORS[cls.color]
              return (
                <div
                  key={cls.id}
                  className="tt-today__card"
                  style={{
                    '--card-border': color.border,
                    '--card-bg': color.bg,
                    '--anim-delay': `${i * 80}ms`
                  }}
                >
                  <div className="tt-today__time-col">
                    <span className="tt-today__time-start">{formatHour(cls.startHour)}</span>
                    <div className="tt-today__time-line" />
                    <span className="tt-today__time-end">{formatHour(cls.startHour + cls.duration)}</span>
                  </div>
                  <div className="tt-today__info">
                    <span className="tt-today__code" style={{ color: color.border }}>{cls.code}</span>
                    <span className="tt-today__name">{cls.name}</span>
                    <div className="tt-today__meta">
                      <span><MapPin size={12} /> {cls.room}</span>
                      <span><User size={12} /> {cls.teacher}</span>
                    </div>
                  </div>
                  <div className="tt-today__duration">
                    <Clock size={14} />
                    {cls.duration}h
                  </div>
                </div>
              )
            })
          )}
        </div>
      </div>
    </div>
  )
}
