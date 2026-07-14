import { useState, useEffect } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import {
  CalendarClock, Calendar, ChevronDown, Users, TrendingUp,
  BookOpen, Check, X, Clock, Save, UserCheck, UserX, AlertCircle
} from 'lucide-react'
import './AttendancePage.css'

const API_BASE = 'http://localhost:5000/api'

const COURSES = [
  { id: 'cs301', label: 'CS-301 Data Structures & Algorithms' },
  { id: 'cs401', label: 'CS-401 Artificial Intelligence' },
  { id: 'cs302', label: 'CS-302 Database Systems' },
  { id: 'math201', label: 'MATH-201 Linear Algebra' },
]

const STATS = [
  { label: "Today's Attendance", value: '87%', icon: UserCheck, color: '#4caf50' },
  { label: 'Average This Month', value: '82%', icon: TrendingUp, color: '#5c6bc0' },
  { label: 'Classes Held', value: '18/22', icon: BookOpen, color: '#c9a96e' },
]

const WEEK_DAYS = [
  { day: 'Mon', date: 16, status: 'taken' },
  { day: 'Tue', date: 17, status: 'taken' },
  { day: 'Wed', date: 18, status: 'taken' },
  { day: 'Thu', date: 19, status: 'holiday', label: 'Holiday' },
  { day: 'Fri', date: 20, status: 'taken' },
  { day: 'Sat', date: 21, status: 'taken' },
  { day: 'Sun', date: 22, status: 'today' },
]

const INITIAL_STUDENTS = [
  { id: 1, name: 'Ahmed Hassan', roll: 'CS-2026-001', status: 'present' },
  { id: 2, name: 'Fatima Zahra', roll: 'CS-2026-004', status: 'present' },
  { id: 3, name: 'Muhammad Ali', roll: 'CS-2026-007', status: 'present' },
  { id: 4, name: 'Ayesha Khan', roll: 'CS-2026-012', status: 'present' },
  { id: 5, name: 'Usman Tariq', roll: 'CS-2026-015', status: 'absent' },
  { id: 6, name: 'Sana Malik', roll: 'CS-2026-019', status: 'present' },
  { id: 7, name: 'Bilal Aslam', roll: 'CS-2026-022', status: 'late' },
  { id: 8, name: 'Hira Nawaz', roll: 'CS-2026-028', status: 'present' },
  { id: 9, name: 'Zain Ul Abideen', roll: 'CS-2026-031', status: 'present' },
  { id: 10, name: 'Maham Farooq', roll: 'CS-2026-035', status: 'present' },
]

function getInitials(name) {
  return name.split(' ').slice(0, 2).map(w => w[0]).join('')
}

function StudentAttendanceView() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        const token = localStorage.getItem('pu-lms-token')
        const res = await fetch(`${API_BASE}/attendance/student`, {
          headers: { Authorization: `Bearer ${token}` }
        })
        if (res.ok) {
          const data = await res.json()
          setStats(data)
        }
      } catch {
        // API unreachable — use fallback
      } finally {
        setLoading(false)
      }
    }
    fetchAttendance()
  }, [])

  const fallbackStats = {
    totalClasses: 42,
    present: 36,
    absent: 4,
    late: 2,
    percentage: 85.7,
  }

  const data = stats || fallbackStats

  return (
    <>
      {/* Overall Stats */}
      <div className="attend-stats">
        <div className="attend-stat-card" style={{ '--stat-color': '#4caf50', '--stagger': 0 }}>
          <div className="attend-stat-card__icon"><UserCheck size={20} /></div>
          <div className="attend-stat-card__info">
            <span className="attend-stat-card__value">{data.percentage?.toFixed?.(1) ?? data.percentage}%</span>
            <span className="attend-stat-card__label">Overall Attendance</span>
          </div>
          <div className="attend-stat-card__ring">
            <svg viewBox="0 0 36 36" className="attend-stat-card__svg">
              <path className="attend-stat-card__ring-bg" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
              <path className="attend-stat-card__ring-fill" strokeDasharray={`${data.percentage}, 100`} d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" style={{ stroke: '#4caf50' }} />
            </svg>
          </div>
        </div>
        <div className="attend-stat-card" style={{ '--stat-color': '#5c6bc0', '--stagger': 1 }}>
          <div className="attend-stat-card__icon"><BookOpen size={20} /></div>
          <div className="attend-stat-card__info">
            <span className="attend-stat-card__value">{data.present}/{data.totalClasses}</span>
            <span className="attend-stat-card__label">Classes Attended</span>
          </div>
        </div>
        <div className="attend-stat-card" style={{ '--stat-color': '#ef5350', '--stagger': 2 }}>
          <div className="attend-stat-card__icon"><UserX size={20} /></div>
          <div className="attend-stat-card__info">
            <span className="attend-stat-card__value">{data.absent}</span>
            <span className="attend-stat-card__label">Absences</span>
          </div>
        </div>
      </div>

      {/* Week Calendar */}
      <div className="attend-calendar">
        <h3 className="attend-calendar__title">
          <Calendar size={16} />
          This Week — June 16 – 22, 2026
        </h3>
        <div className="attend-calendar__grid">
          {WEEK_DAYS.map((d, i) => (
            <div
              key={d.day}
              className={`attend-cal-day attend-cal-day--${d.status}`}
              style={{ '--stagger': i }}
            >
              <span className="attend-cal-day__name">{d.day}</span>
              <span className="attend-cal-day__date">{d.date}</span>
              <div className="attend-cal-day__dot" />
              {d.label && <span className="attend-cal-day__label">{d.label}</span>}
            </div>
          ))}
        </div>
      </div>

      {/* Summary */}
      <div className="attend-summary">
        <div className="attend-summary__item attend-summary__item--present">
          <UserCheck size={16} />
          <span>Present: <strong>{data.present}</strong></span>
        </div>
        <div className="attend-summary__item attend-summary__item--absent">
          <UserX size={16} />
          <span>Absent: <strong>{data.absent}</strong></span>
        </div>
        <div className="attend-summary__item attend-summary__item--late">
          <Clock size={16} />
          <span>Late: <strong>{data.late}</strong></span>
        </div>
      </div>

      {loading && <p style={{ textAlign: 'center', color: '#888', marginTop: 16 }}>Loading attendance data...</p>}
    </>
  )
}

export default function AttendancePage() {
  const { user } = useAuth()
  const [selectedCourseId, setSelectedCourseId] = useState(COURSES[0].id)
  const [students, setStudents] = useState(INITIAL_STUDENTS)
  const [saveMessage, setSaveMessage] = useState(null)
  const [saving, setSaving] = useState(false)

  const selectedCourse = COURSES.find(c => c.id === selectedCourseId)

  const toggleStatus = (id, newStatus) => {
    setStudents(prev =>
      prev.map(s => s.id === id ? { ...s, status: newStatus } : s)
    )
  }

  const handleSaveAttendance = async () => {
    setSaving(true)
    setSaveMessage(null)
    try {
      const token = localStorage.getItem('pu-lms-token')
      const today = new Date().toISOString().split('T')[0]
      const res = await fetch(`${API_BASE}/attendance`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          course: selectedCourseId,
          date: today,
          records: students.map(s => ({ student: s.id, status: s.status })),
        }),
      })
      if (res.ok) {
        setSaveMessage({ type: 'success', text: 'Attendance saved successfully!' })
      } else {
        const data = await res.json().catch(() => null)
        setSaveMessage({ type: 'error', text: data?.message || 'Failed to save attendance.' })
      }
    } catch {
      setSaveMessage({ type: 'error', text: 'Server unreachable. Please try again later.' })
    } finally {
      setSaving(false)
      setTimeout(() => setSaveMessage(null), 5000)
    }
  }

  const presentCount = students.filter(s => s.status === 'present').length
  const absentCount = students.filter(s => s.status === 'absent').length
  const lateCount = students.filter(s => s.status === 'late').length

  // Student role: show read-only view
  if (user?.role === 'student') {
    return (
      <div className="attend-page">
        <div className="attend-header">
          <div className="attend-header__left">
            <div className="attend-header__icon"><CalendarClock size={24} /></div>
            <div>
              <h1 className="attend-header__title">My Attendance</h1>
              <p className="attend-header__subtitle">View your attendance records</p>
            </div>
          </div>
          <div className="attend-header__right">
            <div className="attend-date-display">
              <Calendar size={16} />
              <span>June 22, 2026</span>
              <span className="attend-date-display__badge">Today</span>
            </div>
          </div>
        </div>
        <StudentAttendanceView />
      </div>
    )
  }

  // Teacher / Admin: marking interface
  return (
    <div className="attend-page">
      {/* Header */}
      <div className="attend-header">
        <div className="attend-header__left">
          <div className="attend-header__icon">
            <CalendarClock size={24} />
          </div>
          <div>
            <h1 className="attend-header__title">Attendance</h1>
            <p className="attend-header__subtitle">Mark and manage class attendance</p>
          </div>
        </div>
        <div className="attend-header__right">
          <div className="attend-date-display">
            <Calendar size={16} />
            <span>June 22, 2026</span>
            <span className="attend-date-display__badge">Today</span>
          </div>
          <div className="attend-select-wrapper">
            <select
              value={selectedCourseId}
              onChange={(e) => setSelectedCourseId(e.target.value)}
              className="attend-select"
            >
              {COURSES.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
            </select>
            <ChevronDown size={14} className="attend-select__chevron" />
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="attend-stats">
        {STATS.map((stat, i) => {
          const Icon = stat.icon
          return (
            <div key={i} className="attend-stat-card" style={{ '--stat-color': stat.color, '--stagger': i }}>
              <div className="attend-stat-card__icon">
                <Icon size={20} />
              </div>
              <div className="attend-stat-card__info">
                <span className="attend-stat-card__value">{stat.value}</span>
                <span className="attend-stat-card__label">{stat.label}</span>
              </div>
              <div className="attend-stat-card__ring">
                <svg viewBox="0 0 36 36" className="attend-stat-card__svg">
                  <path
                    className="attend-stat-card__ring-bg"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <path
                    className="attend-stat-card__ring-fill"
                    strokeDasharray={`${parseInt(stat.value)}, 100`}
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    style={{ stroke: stat.color }}
                  />
                </svg>
              </div>
            </div>
          )
        })}
      </div>

      {/* Week Calendar */}
      <div className="attend-calendar">
        <h3 className="attend-calendar__title">
          <Calendar size={16} />
          This Week — June 16 – 22, 2026
        </h3>
        <div className="attend-calendar__grid">
          {WEEK_DAYS.map((d, i) => (
            <div
              key={d.day}
              className={`attend-cal-day attend-cal-day--${d.status}`}
              style={{ '--stagger': i }}
            >
              <span className="attend-cal-day__name">{d.day}</span>
              <span className="attend-cal-day__date">{d.date}</span>
              <div className="attend-cal-day__dot" />
              {d.label && <span className="attend-cal-day__label">{d.label}</span>}
            </div>
          ))}
        </div>
      </div>

      {/* Student List */}
      <div className="attend-student-list">
        <div className="attend-student-list__header">
          <h3 className="attend-student-list__title">
            <Users size={16} />
            Students
          </h3>
          <span className="attend-student-list__count">{students.length} students</span>
        </div>

        <div className="attend-students">
          {students.map((student, i) => (
            <div
              key={student.id}
              className={`attend-student attend-student--${student.status}`}
              style={{ '--stagger': i }}
            >
              <div className="attend-student__left">
                <div className={`attend-student__avatar attend-student__avatar--${student.status}`}>
                  {getInitials(student.name)}
                </div>
                <div className="attend-student__info">
                  <span className="attend-student__name">{student.name}</span>
                  <span className="attend-student__roll">{student.roll}</span>
                </div>
              </div>
              <div className="attend-student__pills">
                <button
                  className={`attend-pill attend-pill--present ${student.status === 'present' ? 'attend-pill--active' : ''}`}
                  onClick={() => toggleStatus(student.id, 'present')}
                >
                  <Check size={12} />
                  Present
                </button>
                <button
                  className={`attend-pill attend-pill--absent ${student.status === 'absent' ? 'attend-pill--active' : ''}`}
                  onClick={() => toggleStatus(student.id, 'absent')}
                >
                  <X size={12} />
                  Absent
                </button>
                <button
                  className={`attend-pill attend-pill--late ${student.status === 'late' ? 'attend-pill--active' : ''}`}
                  onClick={() => toggleStatus(student.id, 'late')}
                >
                  <Clock size={12} />
                  Late
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="attend-summary">
          <div className="attend-summary__item attend-summary__item--present">
            <UserCheck size={16} />
            <span>Present: <strong>{presentCount}</strong></span>
          </div>
          <div className="attend-summary__item attend-summary__item--absent">
            <UserX size={16} />
            <span>Absent: <strong>{absentCount}</strong></span>
          </div>
          <div className="attend-summary__item attend-summary__item--late">
            <Clock size={16} />
            <span>Late: <strong>{lateCount}</strong></span>
          </div>
        </div>

        {/* Save Message */}
        {saveMessage && (
          <div className={`attend-save-message attend-save-message--${saveMessage.type}`} style={{
            padding: '10px 16px', margin: '12px 0', borderRadius: 8, textAlign: 'center', fontWeight: 500,
            background: saveMessage.type === 'success' ? '#e8f5e9' : '#ffebee',
            color: saveMessage.type === 'success' ? '#2e7d32' : '#c62828',
          }}>
            <AlertCircle size={14} style={{ marginRight: 6, verticalAlign: 'middle' }} />
            {saveMessage.text}
          </div>
        )}

        {/* Save Button */}
        <div className="attend-save-section">
          <button className="attend-save-btn" onClick={handleSaveAttendance} disabled={saving}>
            <Save size={18} />
            <span>{saving ? 'Saving...' : 'Save Attendance'}</span>
          </button>
        </div>
      </div>
    </div>
  )
}
