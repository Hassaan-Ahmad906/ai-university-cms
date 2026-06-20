import { useAuth } from '../../contexts/AuthContext'
import {
  Sparkles, Sun, CloudSun, Moon, TrendingUp, TrendingDown,
  BookOpen, ClipboardList, CalendarClock, BarChart3, Users,
  GraduationCap, CreditCard, Brain, Shield, Settings,
  FileText, UserPlus, Send, Clock, AlertCircle, CheckCircle2,
  Activity, Server, Database, Zap, Building2, User
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
function StudentDashboard({ user }) {
  const greeting = getGreeting()
  const GreetIcon = greeting.icon

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
              <div key={i} className="dash-deadline-item">
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
            <a className="dash-section-link">View all</a>
          </div>
          <div className="dash-announcements">
            {announcements.map((a, i) => (
              <div key={i} className="dash-announcement-item">
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
        <a className="dash-section-link">View all courses →</a>
      </div>
      <div className="dash-courses-grid">
        {courses.map((c, i) => (
          <div key={i} className="dash-course-card">
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
          <input className="dash-ai-buddy__input" placeholder="Type your question..." />
          <button className="dash-ai-buddy__send"><Send size={16} /></button>
        </div>
      </div>
    </div>
  )
}

/* ============================================================
   ADMIN DASHBOARD
   ============================================================ */
function AdminDashboard({ user }) {
  const greeting = getGreeting()
  const GreetIcon = greeting.icon

  const stats = [
    { label: 'Total Students', value: '12,450', icon: GraduationCap, color: '#06b6d4' },
    { label: 'Total Faculty', value: '890', icon: Users, color: '#8b5cf6' },
    { label: 'Active Courses', value: '340', icon: BookOpen, color: '#5c6bc0' },
    { label: 'Departments', value: '45', icon: Building2, color: '#10b981' },
    { label: 'Revenue (Month)', value: '₨ 45.2M', icon: CreditCard, color: '#c9a96e' },
    { label: 'AI Queries Today', value: '1,234', icon: Brain, color: '#f59e0b' },
  ]

  const timeline = [
    { time: '2 min ago', content: '<strong>Dr. Ahmad Khan</strong> submitted grades for <strong>CS-301 Section A</strong>', highlight: true },
    { time: '15 min ago', content: '<strong>Registrar Office</strong> processed 12 transcript requests', highlight: false },
    { time: '1 hour ago', content: 'New student batch <strong>(142 students)</strong> imported to <strong>BS Computer Science</strong>', highlight: false },
    { time: '3 hours ago', content: '<strong>System Alert:</strong> Database backup completed successfully', highlight: false },
    { time: '5 hours ago', content: '<strong>Controller of Examinations</strong> published mid-term date sheet for Fall 2026', highlight: false },
  ]

  const departments = [
    { name: 'Computer Science', value: 92, color: 'navy' },
    { name: 'Mathematics', value: 78, color: 'gold' },
    { name: 'Physics', value: 85, color: 'info' },
    { name: 'English', value: 71, color: 'success' },
    { name: 'Chemistry', value: 67, color: 'crimson' },
  ]

  const quickActions = [
    { icon: UserPlus, label: 'Add User' },
    { icon: BookOpen, label: 'Create Course' },
    { icon: BarChart3, label: 'View Reports' },
    { icon: Settings, label: 'System Settings' },
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
        <div className="dash-welcome__content">
          <p className="dash-welcome__greeting"><GreetIcon size={18} /> {greeting.text}</p>
          <h1 className="dash-welcome__name">Welcome, <span>Admin</span></h1>
          <p className="dash-welcome__summary">University of the Punjab LMS — System Overview</p>
        </div>
      </div>

      {/* Stats */}
      <div className="dash-stats-grid dash-stats-grid--6">
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

      {/* Activity + Performance */}
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
            <h3 className="dash-card__title"><BarChart3 size={20} /> Department Performance</h3>
          </div>
          <div className="dash-bar-chart">
            {departments.map((dept, i) => (
              <div key={i} className="dash-bar-row">
                <span className="dash-bar-row__label">{dept.name}</span>
                <div className="dash-bar-row__track">
                  <div
                    className={`dash-bar-row__fill dash-bar-row__fill--${dept.color}`}
                    style={{ width: `${dept.value}%`, animationDelay: `${i * 0.15}s` }}
                  >
                    {dept.value}%
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions + System Health */}
      <div className="dash-two-col">
        <div className="dash-card">
          <div className="dash-card__header">
            <h3 className="dash-card__title"><Zap size={20} /> Quick Actions</h3>
          </div>
          <div className="dash-quick-actions">
            {quickActions.map((action, i) => {
              const Icon = action.icon
              return (
                <button key={i} className="dash-quick-action-btn">
                  <div className="dash-quick-action-btn__icon"><Icon size={22} /></div>
                  <span className="dash-quick-action-btn__label">{action.label}</span>
                </button>
              )
            })}
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
    </div>
  )
}

/* ============================================================
   PLACEHOLDER FOR OTHER ROLES
   ============================================================ */
function RolePlaceholder({ role }) {
  const roleNames = {
    vc: 'Vice Chancellor',
    dean: 'Dean',
    hod: 'Head of Department',
    registrar: 'Registrar',
    treasurer: 'Treasurer',
    clerk: 'Clerk',
    controller: 'Controller of Examinations',
  }

  return (
    <div className="dash-home">
      <div className="dash-placeholder">
        <div className="dash-placeholder__icon"><Shield size={40} /></div>
        <h2 className="dash-placeholder__title">{roleNames[role] || role} Dashboard</h2>
        <p className="dash-placeholder__subtitle">
          This dashboard is currently being built. All features for the {roleNames[role] || role} role will be available soon.
        </p>
      </div>
    </div>
  )
}

/* ============================================================
   MAIN EXPORT — ROUTES BY ROLE
   ============================================================ */
export default function DashboardHome() {
  const { user } = useAuth()
  const role = user?.role || 'student'

  switch (role) {
    case 'student':
      return <StudentDashboard user={user} />
    case 'admin':
      return <AdminDashboard user={user} />
    default:
      return <RolePlaceholder role={role} />
  }
}
