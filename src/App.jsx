import { Routes, Route, Navigate } from 'react-router-dom'
import { ThemeProvider } from './contexts/ThemeContext'
import { AuthProvider, useAuth } from './contexts/AuthContext'

// Pages
import LoginPage from './pages/Login/LoginPage'
import DashboardLayout from './layouts/DashboardLayout'
import DashboardHome from './pages/Dashboard/DashboardHome'
import CoursesPage from './pages/Courses/CoursesPage'
import UsersPage from './pages/Users/UsersPage'
import ProfilePage from './pages/Profile/ProfilePage'
import AssignmentsPage from './pages/Assignments/AssignmentsPage'
import GradebookPage from './pages/Gradebook/GradebookPage'
import AttendancePage from './pages/Attendance/AttendancePage'
import GradesPage from './pages/Grades/GradesPage'
import TimetablePage from './pages/Timetable/TimetablePage'
import TranscriptsPage from './pages/Transcripts/TranscriptsPage'
import NotificationsPage from './pages/Notifications/NotificationsPage'
import MessagesPage from './pages/Messages/MessagesPage'
import SettingsPage from './pages/Settings/SettingsPage'
import FeesPage from './pages/Fees/FeesPage'
import CalendarPage from './pages/Calendar/CalendarPage'
import AnnouncementsPage from './pages/Announcements/AnnouncementsPage'
import ExamsPage from './pages/Exams/ExamsPage'
import NotFoundPage from './pages/NotFound/NotFoundPage'

/* ── Auth Guards ── */

function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth()
  
  if (loading) {
    return (
      <div className="app-loading">
        <div className="app-loading-spinner" />
        <p>Loading PU CMS...</p>
      </div>
    )
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }
  
  return children
}

function PublicRoute({ children }) {
  const { isAuthenticated, loading } = useAuth()
  
  if (loading) return null
  if (isAuthenticated) return <Navigate to="/dashboard" replace />
  
  return children
}

/**
 * Role-based route guard — restricts page access by user role.
 * If the user's role is not in the allowed list, redirect to /dashboard.
 */
function RoleRoute({ allowed, children }) {
  const { user } = useAuth()
  if (!user || !allowed.includes(user.role)) {
    return <Navigate to="/dashboard" replace />
  }
  return children
}

/* ── Placeholder for pages not yet built ── */

function PlaceholderPage() {
  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      minHeight: '400px', textAlign: 'center', gap: '16px', animation: 'fadeIn 0.4s ease'
    }}>
      <div style={{
        width: '80px', height: '80px', borderRadius: '20px',
        background: 'color-mix(in srgb, var(--color-accent) 10%, transparent)',
        color: 'var(--color-accent)', display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: '32px'
      }}>🚧</div>
      <h2 style={{ fontSize: '24px', fontWeight: 700, color: 'var(--color-text-primary)' }}>Coming Soon</h2>
      <p style={{ color: 'var(--color-text-tertiary)', maxWidth: '400px' }}>
        This feature is under development and will be available in the next update.
      </p>
    </div>
  )
}

/* ── Routes ── */

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={
        <PublicRoute>
          <LoginPage />
        </PublicRoute>
      } />
      
      <Route path="/" element={
        <ProtectedRoute>
          <DashboardLayout />
        </ProtectedRoute>
      }>
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<DashboardHome />} />
        
        {/* ── Shared (all authenticated roles) ── */}
        <Route path="profile" element={<ProfilePage />} />
        <Route path="notifications" element={<NotificationsPage />} />
        <Route path="messages" element={<MessagesPage />} />
        <Route path="settings" element={<SettingsPage />} />
        <Route path="calendar" element={<CalendarPage />} />
        <Route path="announcements" element={<AnnouncementsPage />} />

        {/* ── Courses — visible to student, teacher, hod, dean, admin ── */}
        <Route path="courses" element={
          <RoleRoute allowed={['student', 'teacher', 'hod', 'dean', 'admin']}>
            <CoursesPage />
          </RoleRoute>
        } />

        {/* ── Assignments — student (view/submit), teacher (create/grade), hod, admin ── */}
        <Route path="assignments" element={
          <RoleRoute allowed={['student', 'teacher', 'hod', 'admin']}>
            <AssignmentsPage />
          </RoleRoute>
        } />

        {/* ── Exams — student, teacher, hod, controller, admin ── */}
        <Route path="exams" element={
          <RoleRoute allowed={['student', 'teacher', 'hod', 'controller', 'admin']}>
            <ExamsPage />
          </RoleRoute>
        } />
        <Route path="quizzes" element={
          <RoleRoute allowed={['student', 'teacher', 'hod', 'controller', 'admin']}>
            <ExamsPage />
          </RoleRoute>
        } />

        {/* ── Teacher-specific pages ── */}
        <Route path="gradebook" element={
          <RoleRoute allowed={['teacher', 'hod', 'admin']}>
            <GradebookPage />
          </RoleRoute>
        } />
        <Route path="attendance" element={
          <RoleRoute allowed={['teacher', 'hod', 'admin']}>
            <AttendancePage />
          </RoleRoute>
        } />

        {/* ── Student-specific pages ── */}
        <Route path="grades" element={
          <RoleRoute allowed={['student']}>
            <GradesPage />
          </RoleRoute>
        } />
        <Route path="timetable" element={
          <RoleRoute allowed={['student', 'teacher', 'hod']}>
            <TimetablePage />
          </RoleRoute>
        } />
        <Route path="schedule" element={
          <RoleRoute allowed={['student', 'teacher', 'hod']}>
            <TimetablePage />
          </RoleRoute>
        } />
        <Route path="transcripts" element={
          <RoleRoute allowed={['student', 'registrar', 'clerk', 'admin']}>
            <TranscriptsPage />
          </RoleRoute>
        } />

        {/* ── Fee Management — student, treasurer, admin ── */}
        <Route path="fees" element={
          <RoleRoute allowed={['student', 'treasurer', 'admin']}>
            <FeesPage />
          </RoleRoute>
        } />

        {/* ── Admin-only: User Management ── */}
        <Route path="users" element={
          <RoleRoute allowed={['admin']}>
            <UsersPage />
          </RoleRoute>
        } />
        <Route path="users/*" element={
          <RoleRoute allowed={['admin']}>
            <UsersPage />
          </RoleRoute>
        } />
        
        {/* Catch-all for unbuilt pages */}
        <Route path="*" element={<PlaceholderPage />} />
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </ThemeProvider>
  )
}
