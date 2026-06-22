import { Routes, Route, Navigate } from 'react-router-dom'
import { ThemeProvider } from './contexts/ThemeContext'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import LoginPage from './pages/Login/LoginPage'
import DashboardLayout from './layouts/DashboardLayout'
import DashboardHome from './pages/Dashboard/DashboardHome'
import CoursesPage from './pages/Courses/CoursesPage'
import UsersPage from './pages/Users/UsersPage'
import ProfilePage from './pages/Profile/ProfilePage'
import AssignmentsPage from './pages/Assignments/AssignmentsPage'
import GradebookPage from './pages/Gradebook/GradebookPage'
import AttendancePage from './pages/Attendance/AttendancePage'
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
        <Route path="courses" element={<CoursesPage />} />
        <Route path="users" element={<UsersPage />} />
        <Route path="profile" element={<ProfilePage />} />
        <Route path="assignments" element={<AssignmentsPage />} />
        <Route path="gradebook" element={<GradebookPage />} />
        <Route path="attendance" element={<AttendancePage />} />
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
