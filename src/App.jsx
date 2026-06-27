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
import NotFoundPage from './pages/NotFound/NotFoundPage'

function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth()
  
  if (loading) {
    return (
      <div className="app-loading">
        <div className="app-loading-spinner" />
        <p>Loading PU LMS...</p>
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
        
        {/* Shared */}
        <Route path="courses" element={<CoursesPage />} />
        <Route path="users" element={<UsersPage />} />
        <Route path="profile" element={<ProfilePage />} />
        <Route path="notifications" element={<NotificationsPage />} />
        <Route path="messages" element={<MessagesPage />} />
        <Route path="settings" element={<SettingsPage />} />
        
        {/* Teacher */}
        <Route path="assignments" element={<AssignmentsPage />} />
        <Route path="gradebook" element={<GradebookPage />} />
        <Route path="attendance" element={<AttendancePage />} />
        
        {/* Student */}
        <Route path="grades" element={<GradesPage />} />
        <Route path="timetable" element={<TimetablePage />} />
        <Route path="transcripts" element={<TranscriptsPage />} />
        
        {/* Catch-all for unbuilt pages */}
        <Route path="*" element={<PlaceholderPage />} />
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}

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

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </ThemeProvider>
  )
}
