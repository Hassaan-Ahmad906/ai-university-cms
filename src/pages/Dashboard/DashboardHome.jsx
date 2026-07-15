import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { useTheme } from '../../contexts/ThemeContext'
import puLogoDark from '../../assets/logo/pu-logo-dark.png'
import puLogoLight from '../../assets/logo/pu-logo-light.png'
import {
  Sparkles, Sun, CloudSun, Moon, TrendingUp, TrendingDown,
  BookOpen, ClipboardList, CalendarClock, BarChart3, Users,
  GraduationCap, CreditCard, Brain, Shield, Settings,
  FileText, UserPlus, Send, Clock, AlertCircle, CheckCircle2,
  Activity, Server, Database, Zap, Building2, User,
  Award, Calendar, ScrollText, Bell, MessageSquare
} from 'lucide-react'
import './DashboardHome.css'

function getGreeting() {
  const h = new Date().getHours()
  if (h < 12) return { text: 'Good Morning', icon: Sun }
  if (h < 17) return { text: 'Good Afternoon', icon: CloudSun }
  return { text: 'Good Evening', icon: Moon }
}

/* ============================================================
   STUDENT DASHBOARD
   ============================================================ */
function StudentDashboard({ user, logo }) {
  const navigate = useNavigate()
  const greeting = getGreeting()
  const GreetIcon = greeting.icon

  const [aiInput, setAiInput] = useState('')
  const [aiResponse, setAiResponse] = useState('')
  const [aiLoading, setAiLoading] = useState(false)

  const handleAiAsk = async () => {
    if (!aiInput.trim() || aiLoading) return
    setAiLoading(true)
    setAiResponse('')
    try {
      const token = localStorage.getItem('pu-lms-token')
      const res = await fetch('http://localhost:5000/api/ai/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ message: aiInput }),
      })
      if (!res.ok) throw new Error('Request failed')
      const data = await res.json()
      setAiResponse(data.response || data.reply || 'I received your question. Let me think about that...')
    } catch {
      setAiResponse('AI Study Buddy is currently unavailable. Please try again later or contact your instructor for help.')
    } finally {
      setAiLoading(false)
    }
  }

  const stats = [
    { label: 'Current CGPA', value: '3.72', icon: BarChart3, trend: '+0.15', trendUp: true, color: '#c9a96e' },
    { label: 'Enrolled Courses', value: '6', icon: BookOpen, trend: null, trendUp: null, color: '#5c6bc0' },
    { label: 'Pending Assignments', value: '4', icon: ClipboardList, trend: '2 due soon', trendUp: false, color: '#ef5350' },
    { label: 'Attendance', value: '87%', icon: CalendarClock, trend: '+2%', trendUp: true, color: '#4caf50' },
  ]

  const deadlines = [
    { title: 'Data Structures Assignment #5', course: 'CS-301', due: 'Tomorrow, 11:59 PM', status: 'due-soon', statusLabel: 'Due Soon', iconType: 'warning' },
    { title: 'AI Project Proposal', course: 'CS-401', due: 'Jun 25, 2026', status: 'upcoming', statusLabel: 'Upcoming', iconType: 'normal' },
    { title: 'Database Lab Report', course: 'CS-302', due: 'Jun 22, 2026', status: 'upcoming', statusLabel: 'Upcoming', iconType: 'normal' },
    { title: 'OOP Mid-Term Prep', course: 'CS-205', due: 'Completed', status: 'submitted', statusLabel: 'Submitted', iconType: 'done' },
  ]

  const courses = [
    { code: 'CS-301', name: 'Data Structures & Algorithms', teacher: 'Dr. Ahmad Khan', progress: 68, nextClass: 'Mon 10:00 AM', banner: 'navy' },
    { code: 'CS-401', name: 'Artificial Intelligence', teacher: 'Dr. Fatima Ali', progress: 45, nextClass: 'Tue 2:00 PM', banner: 'gold' },
    { code: 'CS-302', name: 'Database Systems', teacher: 'Prof. Hassan Raza', progress: 72, nextClass: 'Wed 9:00 AM', banner: 'crimson' },
    { code: 'MATH-201', name: 'Linear Algebra', teacher: 'Dr. Usman Tariq', progress: 55, nextClass: 'Thu 11:00 AM', banner: 'info' },
  ]

  const announcements = [
    { date: 'Jun 19, 2026', title: 'Mid-Term Examination Schedule Released', preview: 'The Controller of Examinations has released the mid-term date sheet for Fall 2026. Students are advised to check their respective schedules.' },
    { date: 'Jun 17, 2026', title: 'Annual Sports Week Registration Open', preview: 'Registration for the Annual Sports Week 2026 is now open. Interested students can register through the student portal.' },
    { date: 'Jun 15, 2026', title: 'Library Extended Hours During Exams', preview: 'The central library will remain open until 11:00 PM during the examination period starting from June 25th.' },
  ]

  return (
    <div className="dash-home">
      {/* Welcome Section */}
      <div className="dash-welcome">
        <img src={logo} alt="University of the Punjab" className="dash-welcome__logo" />
        <div className="dash-welcome__content">
          <p className="dash-welcome__greeting">
            <GreetIcon size={18} /> {greeting.text}
          </p>
          <h1 className="dash-welcome__name">
            Welcome back, <span>{user?.firstName || 'Student'}</span>
          </h1>
          <p className="dash-welcome__quote">
            "The beautiful thing about learning is that nobody can take it away from you." — B.B. King
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="dash-stats-grid dash-stats-grid--4">
        {stats.map((stat, i) => {
          const Icon = stat.icon
          return (
            <div key={i} className="dash-stat-card" style={{ '--stat-accent': stat.color }}>
              <div className="dash-stat-card__icon">
                <Icon size={22} />
              </div>
              <div className="dash-stat-card__info">
                <span className="dash-stat-card__label">{stat.label}</span>
                <span className="dash-stat-card__value">{stat.value}</span>
                {stat.trend && (
                  <span className={`dash-stat-card__trend ${stat.trendUp ? 'up' : 'down'}`}>
                    {stat.trendUp ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                    {stat.trend}
                  </span>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* Two Column: Deadlines + Announcements */}
      <div className="dash-two-col">
        <div className="dash-card">
          <div className="dash-card__header">
            <h3 className="dash-card__title"><AlertCircle size={20} /> Upcoming Deadlines</h3>
            <span className="dash-card__badge dash-card__badge--count">4</span>
          </div>
          <div className="dash-deadlines">
            {deadlines.map((d, i) => (
              <div key={i} className="dash-deadline-item" onClick={() => navigate('/assignments')} style={{ cursor: 'pointer' }}>
                <div className={`dash-deadline-item__icon dash-deadline-item__icon--${d.iconType}`}>
                  {d.iconType === 'done' ? <CheckCircle2 size={18} /> : <ClipboardList size={18} />}
                </div>
                <div className="dash-deadline-item__info">
                  <div className="dash-deadline-item__title">{d.title}</div>
                  <div className="dash-deadline-item__meta">{d.course} • {d.due}</div>
                </div>
                <span className={`dash-deadline-item__status dash-deadline-item__status--${d.status}`}>
                  {d.statusLabel}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="dash-card">
          <div className="dash-card__header">
            <h3 className="dash-card__title"><FileText size={20} /> Announcements</h3>
            <a className="dash-section-link" onClick={() => navigate('/announcements')} style={{ cursor: 'pointer' }}>View all</a>
          </div>
          <div className="dash-announcements">
            {announcements.map((a, i) => (
              <div key={i} className="dash-announcement-item" onClick={() => navigate('/announcements')} style={{ cursor: 'pointer' }}>
                <div className="dash-announcement-item__date">{a.date}</div>
                <div className="dash-announcement-item__title">{a.title}</div>
                <div className="dash-announcement-item__preview">{a.preview}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* My Courses */}
      <div className="dash-section-header">
        <h2 className="dash-section-title"><BookOpen size={22} /> My Courses</h2>
        <a className="dash-section-link" onClick={() => navigate('/courses')} style={{ cursor: 'pointer' }}>View all courses →</a>
      </div>
      <div className="dash-courses-grid">
        {courses.map((c, i) => (
          <div key={i} className="dash-course-card" onClick={() => navigate('/courses')} style={{ cursor: 'pointer' }}>
            <div className={`dash-course-card__banner dash-course-card__banner--${c.banner}`} />
            <div className="dash-course-card__body">
              <div className="dash-course-card__code">{c.code}</div>
              <div className="dash-course-card__name">{c.name}</div>
              <div className="dash-course-card__teacher"><User size={14} /> {c.teacher}</div>
              <div className="dash-progress">
                <div className="dash-progress__header">
                  <span className="dash-progress__label">Progress</span>
                  <span className="dash-progress__value">{c.progress}%</span>
                </div>
                <div className="dash-progress__track">
                  <div className="dash-progress__fill" style={{ width: `${c.progress}%` }} />
                </div>
              </div>
              <div className="dash-course-card__next-class">
                <Clock size={14} /> Next: {c.nextClass}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* AI Study Buddy */}
      <div className="dash-ai-buddy">
        <div className="dash-ai-buddy__header">
          <div className="dash-ai-buddy__avatar"><Brain size={22} /></div>
          <div>
            <div className="dash-ai-buddy__name">AI Study Buddy</div>
            <div className="dash-ai-buddy__status"><span className="dash-ai-buddy__dot" /> Online</div>
          </div>
        </div>
        <p className="dash-ai-buddy__prompt">Ask me anything about your courses, assignments, or exam preparation...</p>
        <div className="dash-ai-buddy__input-row">
          <input
            className="dash-ai-buddy__input"
            placeholder="Type your question..."
            value={aiInput}
            onChange={(e) => setAiInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAiAsk()}
          />
          <button
            className="dash-ai-buddy__send"
            onClick={handleAiAsk}
            disabled={aiLoading || !aiInput.trim()}
          >
            <Send size={16} />
          </button>
        </div>
        {aiResponse && (
          <div className="dash-ai-buddy__response" style={{ marginTop: '12px', padding: '12px 16px', background: 'var(--bg-secondary, #f5f5f5)', borderRadius: '8px', fontSize: '0.92rem', lineHeight: 1.6, color: 'var(--text-primary, #333)' }}>
            <MessageSquare size={14} style={{ marginRight: 6, verticalAlign: 'middle', opacity: 0.6 }} />
            {aiResponse}
          </div>
        )}
      </div>
    </div>
  )
}

/* ============================================================
   ADMIN DASHBOARD
   ============================================================ */
function AdminDashboard({ user, logo }) {
  const navigate = useNavigate()
  const greeting = getGreeting()
  const GreetIcon = greeting.icon

  const stats = [
    { label: 'Total Users', value: '13,340', icon: Users, color: '#5c6bc0' },
    { label: 'System Uptime', value: '99.97%', icon: Server, color: '#10b981' },
    { label: 'DB Status', value: 'Connected', icon: Database, color: '#06b6d4' },
    { label: 'CMS Version', value: 'v1.0.0', icon: Shield, color: '#c9a96e' },
  ]

  const timeline = [
    { time: '2 min ago', content: '<strong>Dr. Ahmad Khan</strong> submitted grades for <strong>CS-301 Section A</strong>', highlight: true },
    { time: '15 min ago', content: '<strong>Registrar Office</strong> processed 12 transcript requests', highlight: false },
    { time: '1 hour ago', content: 'New student batch <strong>(142 students)</strong> imported to <strong>BS Computer Science</strong>', highlight: false },
    { time: '3 hours ago', content: '<strong>System Alert:</strong> Database backup completed successfully', highlight: false },
    { time: '5 hours ago', content: '<strong>Controller of Examinations</strong> published mid-term date sheet for Fall 2026', highlight: false },
  ]

  const quickActions = [
    { icon: Users, label: 'Manage Users', path: '/users' },
    { icon: Calendar, label: 'Events Calendar', path: '/calendar' },
    { icon: ScrollText, label: 'Announcements', path: '/announcements' },
    { icon: CreditCard, label: 'Fee Overview', path: '/fees' },
    { icon: Bell, label: 'Notifications', path: '/notifications' },
    { icon: Settings, label: 'Settings', path: '/settings' },
  ]

  const healthItems = [
    { label: 'Server Uptime', value: '99.97%', status: 'green' },
    { label: 'API Response Time', value: '142ms', status: 'green' },
    { label: 'Database Status', value: 'Connected', status: 'green' },
    { label: 'Storage Used', value: '67% of 500GB', status: 'yellow' },
  ]

  return (
    <div className="dash-home">
      {/* Welcome */}
      <div className="dash-welcome">
        <img src={logo} alt="University of the Punjab" className="dash-welcome__logo" />
        <div className="dash-welcome__content">
          <p className="dash-welcome__greeting"><GreetIcon size={18} /> {greeting.text}</p>
          <h1 className="dash-welcome__name">Welcome, <span>Admin</span></h1>
          <p className="dash-welcome__summary">PU Campus Management System — Technical Overview</p>
        </div>
      </div>

      {/* Stats */}
      <div className="dash-stats-grid dash-stats-grid--4">
        {stats.map((stat, i) => {
          const Icon = stat.icon
          return (
            <div key={i} className="dash-stat-card" style={{ '--stat-accent': stat.color }}>
              <div className="dash-stat-card__icon"><Icon size={22} /></div>
              <div className="dash-stat-card__info">
                <span className="dash-stat-card__label">{stat.label}</span>
                <span className="dash-stat-card__value">{stat.value}</span>
              </div>
            </div>
          )
        })}
      </div>

      {/* Activity + System Health */}
      <div className="dash-two-col">
        <div className="dash-card">
          <div className="dash-card__header">
            <h3 className="dash-card__title"><Activity size={20} /> Recent Activity</h3>
          </div>
          <div className="dash-timeline">
            {timeline.map((item, i) => (
              <div key={i} className="dash-timeline-item">
                <div className={`dash-timeline-item__dot ${item.highlight ? 'dash-timeline-item__dot--highlight' : ''}`} />
                <div className="dash-timeline-item__time">{item.time}</div>
                <div className="dash-timeline-item__content" dangerouslySetInnerHTML={{ __html: item.content }} />
              </div>
            ))}
          </div>
        </div>

        <div className="dash-card">
          <div className="dash-card__header">
            <h3 className="dash-card__title"><Server size={20} /> System Health</h3>
          </div>
          <div className="dash-health-items">
            {healthItems.map((item, i) => (
              <div key={i} className="dash-health-item">
                <div className="dash-health-item__left">
                  <span className={`dash-health-dot dash-health-dot--${item.status}`} />
                  <span className="dash-health-item__label">{item.label}</span>
                </div>
                <span className="dash-health-item__value">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="dash-card" style={{ marginBottom: 'var(--space-6)' }}>
        <div className="dash-card__header">
          <h3 className="dash-card__title"><Zap size={20} /> Quick Actions</h3>
        </div>
        <div className="dash-quick-actions">
          {quickActions.map((action, i) => {
            const Icon = action.icon
            return (
              <button key={i} className="dash-quick-action-btn" onClick={() => navigate(action.path)}>
                <div className="dash-quick-action-btn__icon"><Icon size={22} /></div>
                <span className="dash-quick-action-btn__label">{action.label}</span>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}

/* ============================================================
   TEACHER DASHBOARD
   ============================================================ */
function TeacherDashboard({ user, logo }) {
  const navigate = useNavigate()
  const greeting = getGreeting()
  const GreetIcon = greeting.icon

  const stats = [
    { label: 'Active Courses', value: '4', icon: BookOpen, color: '#5c6bc0' },
    { label: 'Total Students', value: '186', icon: Users, color: '#06b6d4' },
    { label: 'Pending Grading', value: '23', icon: ClipboardList, trend: '8 urgent', trendUp: false, color: '#ef5350' },
    { label: 'Avg. Attendance', value: '84%', icon: CalendarClock, trend: '+3%', trendUp: true, color: '#4caf50' },
  ]

  const todayClasses = [
    { time: '10:00 AM', course: 'CS-301 Data Structures', room: 'Room 204', students: 45 },
    { time: '12:00 PM', course: 'CS-401 Artificial Intelligence', room: 'Lab 3', students: 38 },
    { time: '3:00 PM', course: 'CS-205 OOP', room: 'Room 112', students: 52 },
  ]

  const recentSubmissions = [
    { student: 'Ahmed Khan', assignment: 'DS Assignment #5', course: 'CS-301', time: '10 min ago' },
    { student: 'Fatima Ali', assignment: 'AI Project Proposal', course: 'CS-401', time: '25 min ago' },
    { student: 'Usman Raza', assignment: 'DS Assignment #5', course: 'CS-301', time: '1 hour ago' },
    { student: 'Sara Malik', assignment: 'OOP Lab Report', course: 'CS-205', time: '2 hours ago' },
  ]

  const quickActions = [
    { icon: ClipboardList, label: 'Create Assignment', path: '/assignments' },
    { icon: FileText, label: 'Grade Submissions', path: '/gradebook' },
    { icon: CalendarClock, label: 'Mark Attendance', path: '/attendance' },
    { icon: Brain, label: 'AI Auto-Grade', path: '/gradebook' },
  ]

  return (
    <div className="dash-home">
      <div className="dash-welcome">
        <img src={logo} alt="University of the Punjab" className="dash-welcome__logo" />
        <div className="dash-welcome__content">
          <p className="dash-welcome__greeting"><GreetIcon size={18} /> {greeting.text}</p>
          <h1 className="dash-welcome__name">Welcome, <span>{user?.firstName || 'Professor'}</span></h1>
          <p className="dash-welcome__summary">You have 3 classes today and 23 submissions to review</p>
        </div>
      </div>

      <div className="dash-stats-grid dash-stats-grid--4">
        {stats.map((stat, i) => {
          const Icon = stat.icon
          return (
            <div key={i} className="dash-stat-card" style={{ '--stat-accent': stat.color }}>
              <div className="dash-stat-card__icon"><Icon size={22} /></div>
              <div className="dash-stat-card__info">
                <span className="dash-stat-card__label">{stat.label}</span>
                <span className="dash-stat-card__value">{stat.value}</span>
                {stat.trend && (
                  <span className={`dash-stat-card__trend ${stat.trendUp ? 'up' : 'down'}`}>
                    {stat.trendUp ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                    {stat.trend}
                  </span>
                )}
              </div>
            </div>
          )
        })}
      </div>

      <div className="dash-two-col">
        <div className="dash-card">
          <div className="dash-card__header">
            <h3 className="dash-card__title"><Clock size={20} /> Today's Classes</h3>
          </div>
          <div className="dash-deadlines">
            {todayClasses.map((cls, i) => (
              <div key={i} className="dash-deadline-item">
                <div className="dash-deadline-item__icon dash-deadline-item__icon--normal">
                  <BookOpen size={18} />
                </div>
                <div className="dash-deadline-item__info">
                  <div className="dash-deadline-item__title">{cls.course}</div>
                  <div className="dash-deadline-item__meta">{cls.time} • {cls.room} • {cls.students} students</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="dash-card">
          <div className="dash-card__header">
            <h3 className="dash-card__title"><FileText size={20} /> Recent Submissions</h3>
            <span className="dash-card__badge dash-card__badge--count">4</span>
          </div>
          <div className="dash-deadlines">
            {recentSubmissions.map((sub, i) => (
              <div key={i} className="dash-deadline-item">
                <div className="dash-deadline-item__icon dash-deadline-item__icon--warning">
                  <ClipboardList size={18} />
                </div>
                <div className="dash-deadline-item__info">
                  <div className="dash-deadline-item__title">{sub.student}</div>
                  <div className="dash-deadline-item__meta">{sub.assignment} • {sub.course} • {sub.time}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="dash-card" style={{ marginBottom: 'var(--space-6)' }}>
        <div className="dash-card__header">
          <h3 className="dash-card__title"><Zap size={20} /> Quick Actions</h3>
        </div>
        <div className="dash-quick-actions">
          {quickActions.map((action, i) => {
            const Icon = action.icon
            return (
              <button key={i} className="dash-quick-action-btn" onClick={() => navigate(action.path)}>
                <div className="dash-quick-action-btn__icon"><Icon size={22} /></div>
                <span className="dash-quick-action-btn__label">{action.label}</span>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}

/* ============================================================
   HOD DASHBOARD
   ============================================================ */
function HodDashboard({ user, logo }) {
  const navigate = useNavigate()
  const greeting = getGreeting()
  const GreetIcon = greeting.icon

  const stats = [
    { label: 'Faculty Members', value: '28', icon: Users, color: '#8b5cf6' },
    { label: 'Active Courses', value: '42', icon: BookOpen, color: '#5c6bc0' },
    { label: 'Students', value: '680', icon: GraduationCap, color: '#06b6d4' },
    { label: 'Avg. Result', value: '74%', icon: BarChart3, trend: '+2.3%', trendUp: true, color: '#4caf50' },
  ]

  const facultyPerformance = [
    { name: 'Dr. Sarah Malik', courses: 3, rating: 92, color: 'navy' },
    { name: 'Prof. Hassan Raza', courses: 4, rating: 88, color: 'gold' },
    { name: 'Dr. Fatima Ali', courses: 2, rating: 95, color: 'info' },
    { name: 'Dr. Ahmad Khan', courses: 3, rating: 85, color: 'success' },
  ]

  const quickActions = [
    { icon: Users, label: 'Assign Courses', path: '/courses' },
    { icon: Calendar, label: 'Manage Timetable', path: '/timetable' },
    { icon: BarChart3, label: 'View Reports', path: '/gradebook' },
    { icon: Brain, label: 'AI Workload', path: '/dashboard' },
  ]

  return (
    <div className="dash-home">
      <div className="dash-welcome">
        <img src={logo} alt="University of the Punjab" className="dash-welcome__logo" />
        <div className="dash-welcome__content">
          <p className="dash-welcome__greeting"><GreetIcon size={18} /> {greeting.text}</p>
          <h1 className="dash-welcome__name">Welcome, <span>{user?.firstName || 'HOD'}</span></h1>
          <p className="dash-welcome__summary">Department of {user?.department || 'Computer Science'} — Overview</p>
        </div>
      </div>

      <div className="dash-stats-grid dash-stats-grid--4">
        {stats.map((stat, i) => {
          const Icon = stat.icon
          return (
            <div key={i} className="dash-stat-card" style={{ '--stat-accent': stat.color }}>
              <div className="dash-stat-card__icon"><Icon size={22} /></div>
              <div className="dash-stat-card__info">
                <span className="dash-stat-card__label">{stat.label}</span>
                <span className="dash-stat-card__value">{stat.value}</span>
                {stat.trend && (
                  <span className={`dash-stat-card__trend ${stat.trendUp ? 'up' : 'down'}`}>
                    <TrendingUp size={12} /> {stat.trend}
                  </span>
                )}
              </div>
            </div>
          )
        })}
      </div>

      <div className="dash-two-col">
        <div className="dash-card">
          <div className="dash-card__header">
            <h3 className="dash-card__title"><Users size={20} /> Faculty Performance</h3>
          </div>
          <div className="dash-bar-chart">
            {facultyPerformance.map((f, i) => (
              <div key={i} className="dash-bar-row">
                <span className="dash-bar-row__label">{f.name}</span>
                <div className="dash-bar-row__track">
                  <div className={`dash-bar-row__fill dash-bar-row__fill--${f.color}`} style={{ width: `${f.rating}%`, animationDelay: `${i * 0.15}s` }}>
                    {f.rating}%
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="dash-card">
          <div className="dash-card__header">
            <h3 className="dash-card__title"><Zap size={20} /> Quick Actions</h3>
          </div>
          <div className="dash-quick-actions">
            {quickActions.map((action, i) => {
              const Icon = action.icon
              return (
                <button key={i} className="dash-quick-action-btn" onClick={() => navigate(action.path)}>
                  <div className="dash-quick-action-btn__icon"><Icon size={22} /></div>
                  <span className="dash-quick-action-btn__label">{action.label}</span>
                </button>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

/* ============================================================
   VC DASHBOARD
   ============================================================ */
function VcDashboard({ user, logo }) {
  const navigate = useNavigate()
  const greeting = getGreeting()
  const GreetIcon = greeting.icon

  const stats = [
    { label: 'Total Enrollment', value: '24,800', icon: GraduationCap, color: '#06b6d4' },
    { label: 'Faculties', value: '12', icon: Building2, color: '#8b5cf6' },
    { label: 'Annual Budget', value: '₨ 4.2B', icon: CreditCard, color: '#c9a96e' },
    { label: 'Research Papers', value: '342', icon: FileText, trend: '+18%', trendUp: true, color: '#10b981' },
    { label: 'Global Ranking', value: '#287', icon: Award, trend: '+12', trendUp: true, color: '#f59e0b' },
    { label: 'Faculty Count', value: '1,240', icon: Users, color: '#5c6bc0' },
  ]

  const pendingApprovals = [
    { title: 'New BS Data Science Program', from: 'Faculty of Computing', priority: 'urgent' },
    { title: 'Budget Reallocation — Library', from: 'Treasurer Office', priority: 'normal' },
    { title: 'Faculty Recruitment — Physics', from: 'Dean of Sciences', priority: 'normal' },
    { title: 'International Collaboration — MIT', from: 'Research Office', priority: 'urgent' },
  ]

  return (
    <div className="dash-home">
      <div className="dash-welcome">
        <img src={logo} alt="University of the Punjab" className="dash-welcome__logo" />
        <div className="dash-welcome__content">
          <p className="dash-welcome__greeting"><GreetIcon size={18} /> {greeting.text}</p>
          <h1 className="dash-welcome__name">Welcome, <span>Vice Chancellor</span></h1>
          <p className="dash-welcome__summary">University of the Punjab — Executive Dashboard</p>
        </div>
      </div>

      <div className="dash-stats-grid dash-stats-grid--6">
        {stats.map((stat, i) => {
          const Icon = stat.icon
          return (
            <div key={i} className="dash-stat-card" style={{ '--stat-accent': stat.color }}>
              <div className="dash-stat-card__icon"><Icon size={22} /></div>
              <div className="dash-stat-card__info">
                <span className="dash-stat-card__label">{stat.label}</span>
                <span className="dash-stat-card__value">{stat.value}</span>
                {stat.trend && (
                  <span className={`dash-stat-card__trend ${stat.trendUp ? 'up' : 'down'}`}>
                    <TrendingUp size={12} /> {stat.trend}
                  </span>
                )}
              </div>
            </div>
          )
        })}
      </div>

      <div className="dash-two-col">
        <div className="dash-card">
          <div className="dash-card__header">
            <h3 className="dash-card__title"><AlertCircle size={20} /> Pending Approvals</h3>
            <span className="dash-card__badge dash-card__badge--count">{pendingApprovals.length}</span>
          </div>
          <div className="dash-deadlines">
            {pendingApprovals.map((item, i) => (
              <div key={i} className="dash-deadline-item" onClick={() => navigate('/announcements')} style={{ cursor: 'pointer' }}>
                <div className={`dash-deadline-item__icon dash-deadline-item__icon--${item.priority === 'urgent' ? 'urgent' : 'normal'}`}>
                  <FileText size={18} />
                </div>
                <div className="dash-deadline-item__info">
                  <div className="dash-deadline-item__title">{item.title}</div>
                  <div className="dash-deadline-item__meta">From: {item.from}</div>
                </div>
                <span className={`dash-deadline-item__status dash-deadline-item__status--${item.priority === 'urgent' ? 'overdue' : 'upcoming'}`}>
                  {item.priority === 'urgent' ? 'Urgent' : 'Review'}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="dash-card">
          <div className="dash-card__header">
            <h3 className="dash-card__title"><BarChart3 size={20} /> Faculty Performance</h3>
          </div>
          <div className="dash-bar-chart">
            {[
              { name: 'Computing', value: 94, color: 'navy' },
              { name: 'Sciences', value: 87, color: 'gold' },
              { name: 'Arts', value: 82, color: 'info' },
              { name: 'Engineering', value: 91, color: 'success' },
              { name: 'Medicine', value: 89, color: 'crimson' },
            ].map((dept, i) => (
              <div key={i} className="dash-bar-row">
                <span className="dash-bar-row__label">{dept.name}</span>
                <div className="dash-bar-row__track">
                  <div className={`dash-bar-row__fill dash-bar-row__fill--${dept.color}`} style={{ width: `${dept.value}%`, animationDelay: `${i * 0.15}s` }}>
                    {dept.value}%
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

/* ============================================================
   DEAN DASHBOARD
   ============================================================ */
function DeanDashboard({ user, logo }) {
  const navigate = useNavigate()
  const greeting = getGreeting()
  const GreetIcon = greeting.icon

  const stats = [
    { label: 'Departments', value: '8', icon: Building2, color: '#8b5cf6' },
    { label: 'Faculty Members', value: '156', icon: Users, color: '#5c6bc0' },
    { label: 'Programs', value: '22', icon: Award, color: '#c9a96e' },
    { label: 'Student Satisfaction', value: '88%', icon: TrendingUp, trend: '+4%', trendUp: true, color: '#4caf50' },
  ]

  const quickActions = [
    { icon: Users, label: 'Review Faculty', path: '/courses' },
    { icon: Award, label: 'Programs', path: '/courses' },
    { icon: BarChart3, label: 'Reports', path: '/gradebook' },
    { icon: Brain, label: 'AI Analytics', path: '/dashboard' },
  ]

  return (
    <div className="dash-home">
      <div className="dash-welcome">
        <img src={logo} alt="University of the Punjab" className="dash-welcome__logo" />
        <div className="dash-welcome__content">
          <p className="dash-welcome__greeting"><GreetIcon size={18} /> {greeting.text}</p>
          <h1 className="dash-welcome__name">Welcome, <span>Dean</span></h1>
          <p className="dash-welcome__summary">{user?.department || 'Faculty of Computing'} — Overview</p>
        </div>
      </div>

      <div className="dash-stats-grid dash-stats-grid--4">
        {stats.map((stat, i) => {
          const Icon = stat.icon
          return (
            <div key={i} className="dash-stat-card" style={{ '--stat-accent': stat.color }}>
              <div className="dash-stat-card__icon"><Icon size={22} /></div>
              <div className="dash-stat-card__info">
                <span className="dash-stat-card__label">{stat.label}</span>
                <span className="dash-stat-card__value">{stat.value}</span>
                {stat.trend && (
                  <span className={`dash-stat-card__trend up`}><TrendingUp size={12} /> {stat.trend}</span>
                )}
              </div>
            </div>
          )
        })}
      </div>

      <div className="dash-two-col">
        <div className="dash-card">
          <div className="dash-card__header">
            <h3 className="dash-card__title"><BarChart3 size={20} /> Department Results</h3>
          </div>
          <div className="dash-bar-chart">
            {[
              { name: 'Computer Science', value: 88, color: 'navy' },
              { name: 'Software Eng.', value: 82, color: 'gold' },
              { name: 'Data Science', value: 91, color: 'info' },
              { name: 'IT', value: 78, color: 'success' },
              { name: 'Cyber Security', value: 85, color: 'crimson' },
            ].map((dept, i) => (
              <div key={i} className="dash-bar-row">
                <span className="dash-bar-row__label">{dept.name}</span>
                <div className="dash-bar-row__track">
                  <div className={`dash-bar-row__fill dash-bar-row__fill--${dept.color}`} style={{ width: `${dept.value}%`, animationDelay: `${i * 0.12}s` }}>
                    {dept.value}%
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="dash-card">
          <div className="dash-card__header">
            <h3 className="dash-card__title"><Zap size={20} /> Quick Actions</h3>
          </div>
          <div className="dash-quick-actions">
            {quickActions.map((action, i) => {
              const Icon = action.icon
              return (
                <button key={i} className="dash-quick-action-btn" onClick={() => navigate(action.path)}>
                  <div className="dash-quick-action-btn__icon"><Icon size={22} /></div>
                  <span className="dash-quick-action-btn__label">{action.label}</span>
                </button>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

/* ============================================================
   REGISTRAR DASHBOARD
   ============================================================ */
function RegistrarDashboard({ user, logo }) {
  const navigate = useNavigate()
  const greeting = getGreeting()
  const GreetIcon = greeting.icon

  const stats = [
    { label: 'Admission Applications', value: '2,340', icon: FileText, color: '#5c6bc0' },
    { label: 'Transcript Requests', value: '87', icon: ScrollText, trend: '12 pending', trendUp: false, color: '#ef5350' },
    { label: 'Active Students', value: '24,800', icon: GraduationCap, color: '#06b6d4' },
    { label: 'Degrees Issued (Year)', value: '3,420', icon: Award, color: '#c9a96e' },
  ]

  const recentRequests = [
    { type: 'Transcript', student: 'Ahmed Khan (CS-2022-045)', status: 'Processing', time: '30 min ago' },
    { type: 'Degree Verification', student: 'Sara Malik (EE-2019-112)', status: 'Ready', time: '1 hour ago' },
    { type: 'Migration Certificate', student: 'Usman Ali (BBA-2021-089)', status: 'Pending', time: '2 hours ago' },
    { type: 'Enrollment Letter', student: 'Fatima Zahra (CS-2023-067)', status: 'Completed', time: '3 hours ago' },
  ]

  const quickActions = [
    { icon: ScrollText, label: 'Transcripts', path: '/transcripts' },
    { icon: FileText, label: 'Announcements', path: '/announcements' },
    { icon: Calendar, label: 'Calendar', path: '/calendar' },
  ]

  return (
    <div className="dash-home">
      <div className="dash-welcome">
        <img src={logo} alt="University of the Punjab" className="dash-welcome__logo" />
        <div className="dash-welcome__content">
          <p className="dash-welcome__greeting"><GreetIcon size={18} /> {greeting.text}</p>
          <h1 className="dash-welcome__name">Welcome, <span>Registrar</span></h1>
          <p className="dash-welcome__summary">Office of the Registrar — Document Management</p>
        </div>
      </div>

      <div className="dash-stats-grid dash-stats-grid--4">
        {stats.map((stat, i) => {
          const Icon = stat.icon
          return (
            <div key={i} className="dash-stat-card" style={{ '--stat-accent': stat.color }}>
              <div className="dash-stat-card__icon"><Icon size={22} /></div>
              <div className="dash-stat-card__info">
                <span className="dash-stat-card__label">{stat.label}</span>
                <span className="dash-stat-card__value">{stat.value}</span>
                {stat.trend && (
                  <span className="dash-stat-card__trend down"><TrendingDown size={12} /> {stat.trend}</span>
                )}
              </div>
            </div>
          )
        })}
      </div>

      <div className="dash-two-col">
        <div className="dash-card">
          <div className="dash-card__header">
            <h3 className="dash-card__title"><Activity size={20} /> Recent Requests</h3>
          </div>
          <div className="dash-deadlines">
            {recentRequests.map((req, i) => (
              <div key={i} className="dash-deadline-item">
                <div className={`dash-deadline-item__icon dash-deadline-item__icon--${req.status === 'Ready' ? 'done' : req.status === 'Processing' ? 'warning' : 'normal'}`}>
                  <FileText size={18} />
                </div>
                <div className="dash-deadline-item__info">
                  <div className="dash-deadline-item__title">{req.type}</div>
                  <div className="dash-deadline-item__meta">{req.student} • {req.time}</div>
                </div>
                <span className={`dash-deadline-item__status dash-deadline-item__status--${req.status === 'Ready' ? 'submitted' : req.status === 'Processing' ? 'due-soon' : req.status === 'Completed' ? 'submitted' : 'upcoming'}`}>
                  {req.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="dash-card">
          <div className="dash-card__header">
            <h3 className="dash-card__title"><Zap size={20} /> Quick Actions</h3>
          </div>
          <div className="dash-quick-actions">
            {quickActions.map((action, i) => {
              const Icon = action.icon
              return (
                <button key={i} className="dash-quick-action-btn" onClick={() => navigate(action.path)}>
                  <div className="dash-quick-action-btn__icon"><Icon size={22} /></div>
                  <span className="dash-quick-action-btn__label">{action.label}</span>
                </button>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

/* ============================================================
   TREASURER DASHBOARD
   ============================================================ */
function TreasurerDashboard({ user, logo }) {
  const navigate = useNavigate()
  const greeting = getGreeting()
  const GreetIcon = greeting.icon

  const stats = [
    { label: 'Collections (Month)', value: '₨ 45.2M', icon: CreditCard, color: '#c9a96e' },
    { label: 'Pending Dues', value: '₨ 8.7M', icon: AlertCircle, color: '#ef5350' },
    { label: 'Scholarships Active', value: '1,240', icon: Award, color: '#10b981' },
    { label: 'Default Rate', value: '3.2%', icon: TrendingDown, trend: '-0.8%', trendUp: true, color: '#4caf50' },
  ]

  const quickActions = [
    { icon: CreditCard, label: 'Fee Structure', path: '/fees' },
    { icon: Award, label: 'Scholarships', path: '/fees' },
    { icon: BarChart3, label: 'Financial Report', path: '/fees' },
    { icon: FileText, label: 'Budget Plan', path: '/fees' },
  ]

  return (
    <div className="dash-home">
      <div className="dash-welcome">
        <img src={logo} alt="University of the Punjab" className="dash-welcome__logo" />
        <div className="dash-welcome__content">
          <p className="dash-welcome__greeting"><GreetIcon size={18} /> {greeting.text}</p>
          <h1 className="dash-welcome__name">Welcome, <span>Treasurer</span></h1>
          <p className="dash-welcome__summary">Treasury Department — Financial Overview</p>
        </div>
      </div>

      <div className="dash-stats-grid dash-stats-grid--4">
        {stats.map((stat, i) => {
          const Icon = stat.icon
          return (
            <div key={i} className="dash-stat-card" style={{ '--stat-accent': stat.color }}>
              <div className="dash-stat-card__icon"><Icon size={22} /></div>
              <div className="dash-stat-card__info">
                <span className="dash-stat-card__label">{stat.label}</span>
                <span className="dash-stat-card__value">{stat.value}</span>
                {stat.trend && (
                  <span className="dash-stat-card__trend up"><TrendingUp size={12} /> {stat.trend}</span>
                )}
              </div>
            </div>
          )
        })}
      </div>

      <div className="dash-two-col">
        <div className="dash-card">
          <div className="dash-card__header">
            <h3 className="dash-card__title"><BarChart3 size={20} /> Revenue by Faculty</h3>
          </div>
          <div className="dash-bar-chart">
            {[
              { name: 'Computing', value: 95, color: 'navy' },
              { name: 'Engineering', value: 88, color: 'gold' },
              { name: 'Medicine', value: 82, color: 'crimson' },
              { name: 'Business', value: 76, color: 'info' },
              { name: 'Arts', value: 61, color: 'success' },
            ].map((dept, i) => (
              <div key={i} className="dash-bar-row">
                <span className="dash-bar-row__label">{dept.name}</span>
                <div className="dash-bar-row__track">
                  <div className={`dash-bar-row__fill dash-bar-row__fill--${dept.color}`} style={{ width: `${dept.value}%`, animationDelay: `${i * 0.15}s` }}>
                    {dept.value}%
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="dash-card">
          <div className="dash-card__header">
            <h3 className="dash-card__title"><Zap size={20} /> Quick Actions</h3>
          </div>
          <div className="dash-quick-actions">
            {quickActions.map((action, i) => {
              const Icon = action.icon
              return (
                <button key={i} className="dash-quick-action-btn" onClick={() => navigate(action.path)}>
                  <div className="dash-quick-action-btn__icon"><Icon size={22} /></div>
                  <span className="dash-quick-action-btn__label">{action.label}</span>
                </button>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

/* ============================================================
   CLERK DASHBOARD
   ============================================================ */
function ClerkDashboard({ user, logo }) {
  const navigate = useNavigate()
  const greeting = getGreeting()
  const GreetIcon = greeting.icon

  const stats = [
    { label: 'Pending Documents', value: '14', icon: FileText, color: '#ef5350' },
    { label: 'Processed Today', value: '23', icon: CheckCircle2, color: '#4caf50' },
    { label: 'Student Inquiries', value: '8', icon: Users, color: '#06b6d4' },
    { label: 'Appointments Today', value: '5', icon: CalendarClock, color: '#c9a96e' },
  ]

  const documentQueue = [
    { type: 'Transcript Request', student: 'Ahmed Khan', submitted: '9:15 AM', priority: 'High' },
    { type: 'Enrollment Verification', student: 'Sara Malik', submitted: '10:30 AM', priority: 'Normal' },
    { type: 'Fee Receipt Copy', student: 'Ali Raza', submitted: '11:00 AM', priority: 'Low' },
    { type: 'Migration Certificate', student: 'Fatima Ali', submitted: '1:45 PM', priority: 'High' },
  ]

  return (
    <div className="dash-home">
      <div className="dash-welcome">
        <img src={logo} alt="University of the Punjab" className="dash-welcome__logo" />
        <div className="dash-welcome__content">
          <p className="dash-welcome__greeting"><GreetIcon size={18} /> {greeting.text}</p>
          <h1 className="dash-welcome__name">Welcome, <span>{user?.firstName || 'Staff'}</span></h1>
          <p className="dash-welcome__summary">Administrative Support — Document Processing</p>
        </div>
      </div>

      <div className="dash-stats-grid dash-stats-grid--4">
        {stats.map((stat, i) => {
          const Icon = stat.icon
          return (
            <div key={i} className="dash-stat-card" style={{ '--stat-accent': stat.color }}>
              <div className="dash-stat-card__icon"><Icon size={22} /></div>
              <div className="dash-stat-card__info">
                <span className="dash-stat-card__label">{stat.label}</span>
                <span className="dash-stat-card__value">{stat.value}</span>
              </div>
            </div>
          )
        })}
      </div>

      <div className="dash-card">
        <div className="dash-card__header">
          <h3 className="dash-card__title"><FileText size={20} /> Document Queue</h3>
          <span className="dash-card__badge dash-card__badge--count">{documentQueue.length}</span>
        </div>
        <div className="dash-deadlines">
          {documentQueue.map((doc, i) => (
            <div key={i} className="dash-deadline-item" onClick={() => navigate('/transcripts')} style={{ cursor: 'pointer' }}>
              <div className={`dash-deadline-item__icon dash-deadline-item__icon--${doc.priority === 'High' ? 'urgent' : doc.priority === 'Normal' ? 'warning' : 'normal'}`}>
                <FileText size={18} />
              </div>
              <div className="dash-deadline-item__info">
                <div className="dash-deadline-item__title">{doc.type}</div>
                <div className="dash-deadline-item__meta">{doc.student} • Submitted: {doc.submitted}</div>
              </div>
              <span className={`dash-deadline-item__status dash-deadline-item__status--${doc.priority === 'High' ? 'overdue' : doc.priority === 'Normal' ? 'due-soon' : 'upcoming'}`}>
                {doc.priority}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

/* ============================================================
   MAIN EXPORT — ROUTES BY ROLE
   ============================================================ */
export default function DashboardHome() {
  const { user } = useAuth()
  const { theme } = useTheme()
  const role = user?.role || 'student'
  const logo = theme === 'dark' ? puLogoDark : puLogoLight

  switch (role) {
    case 'student':
      return <StudentDashboard user={user} logo={logo} />
    case 'admin':
      return <AdminDashboard user={user} logo={logo} />
    case 'teacher':
      return <TeacherDashboard user={user} logo={logo} />
    case 'hod':
      return <HodDashboard user={user} logo={logo} />
    case 'vc':
      return <VcDashboard user={user} logo={logo} />
    case 'dean':
      return <DeanDashboard user={user} logo={logo} />
    case 'registrar':
      return <RegistrarDashboard user={user} logo={logo} />
    case 'treasurer':
      return <TreasurerDashboard user={user} logo={logo} />
    case 'clerk':
      return <ClerkDashboard user={user} logo={logo} />
    case 'controller':
      return <RolePlaceholder role={role} />
    default:
      return <RolePlaceholder role={role} />
  }
}

function RolePlaceholder({ role }) {
  return (
    <div className="dash-home">
      <div className="dash-placeholder">
        <div className="dash-placeholder__icon"><Shield size={40} /></div>
        <h2 className="dash-placeholder__title">{role} Dashboard</h2>
        <p className="dash-placeholder__subtitle">
          This dashboard is under construction.
        </p>
      </div>
    </div>
  )
}
