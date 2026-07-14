import { useState, useEffect } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import Sidebar from '../components/common/Sidebar/Sidebar'
import Topbar from '../components/common/Topbar/Topbar'
import AIChatWidget from '../components/AIChatWidget/AIChatWidget'
import { useAuth } from '../contexts/AuthContext'
import { useTheme } from '../contexts/ThemeContext'
import {
  LayoutDashboard, BookOpen, Users, ClipboardList,
  Calendar, CalendarClock, FileText, CreditCard, Bell, MessageSquare,
  Settings, UserCheck, BookMarked, PenTool, ScrollText
} from 'lucide-react'
import './DashboardLayout.css'

const MENU_BY_ROLE = {
  admin: [
    { icon: <LayoutDashboard size={20} />, label: 'Dashboard', path: '/dashboard' },
    { icon: <Users size={20} />, label: 'User Management', path: '/users' },
    { icon: <Calendar size={20} />, label: 'Academic Calendar', path: '/calendar' },
    { icon: <ScrollText size={20} />, label: 'Announcements', path: '/announcements' },
    { icon: <CreditCard size={20} />, label: 'Fee Management', path: '/fees' },
    { icon: <Bell size={20} />, label: 'Notifications', path: '/notifications' },
    { icon: <MessageSquare size={20} />, label: 'Messages', path: '/messages' },
    { icon: <Settings size={20} />, label: 'Settings', path: '/settings' },
  ],
  vc: [
    { icon: <LayoutDashboard size={20} />, label: 'Dashboard', path: '/dashboard' },
    { icon: <ScrollText size={20} />, label: 'Announcements', path: '/announcements' },
    { icon: <Calendar size={20} />, label: 'Academic Calendar', path: '/calendar' },
    { icon: <MessageSquare size={20} />, label: 'Messages', path: '/messages' },
    { icon: <Bell size={20} />, label: 'Notifications', path: '/notifications' },
    { icon: <Settings size={20} />, label: 'Settings', path: '/settings' },
  ],
  dean: [
    { icon: <LayoutDashboard size={20} />, label: 'Dashboard', path: '/dashboard' },
    { icon: <ScrollText size={20} />, label: 'Announcements', path: '/announcements' },
    { icon: <Calendar size={20} />, label: 'Academic Calendar', path: '/calendar' },
    { icon: <MessageSquare size={20} />, label: 'Messages', path: '/messages' },
    { icon: <Bell size={20} />, label: 'Notifications', path: '/notifications' },
    { icon: <Settings size={20} />, label: 'Settings', path: '/settings' },
  ],
  hod: [
    { icon: <LayoutDashboard size={20} />, label: 'Dashboard', path: '/dashboard' },
    { icon: <BookOpen size={20} />, label: 'Courses', path: '/courses' },
    { icon: <CalendarClock size={20} />, label: 'Timetable', path: '/timetable' },
    { icon: <Calendar size={20} />, label: 'Academic Calendar', path: '/calendar' },
    { icon: <ScrollText size={20} />, label: 'Announcements', path: '/announcements' },
    { icon: <MessageSquare size={20} />, label: 'Messages', path: '/messages' },
    { icon: <Settings size={20} />, label: 'Settings', path: '/settings' },
  ],
  teacher: [
    { icon: <LayoutDashboard size={20} />, label: 'Dashboard', path: '/dashboard' },
    { icon: <BookOpen size={20} />, label: 'My Courses', path: '/courses' },
    { icon: <PenTool size={20} />, label: 'Assignments', path: '/assignments' },
    { icon: <ClipboardList size={20} />, label: 'Quizzes & Exams', path: '/exams' },
    { icon: <BookMarked size={20} />, label: 'Gradebook', path: '/gradebook' },
    { icon: <UserCheck size={20} />, label: 'Attendance', path: '/attendance' },
    { icon: <Calendar size={20} />, label: 'Schedule', path: '/schedule' },
    { icon: <MessageSquare size={20} />, label: 'Messages', path: '/messages' },
    { icon: <Bell size={20} />, label: 'Notifications', path: '/notifications' },
    { icon: <Settings size={20} />, label: 'Settings', path: '/settings' },
  ],
  student: [
    { icon: <LayoutDashboard size={20} />, label: 'Dashboard', path: '/dashboard' },
    { icon: <BookOpen size={20} />, label: 'My Courses', path: '/courses' },
    { icon: <PenTool size={20} />, label: 'Assignments', path: '/assignments' },
    { icon: <ClipboardList size={20} />, label: 'Quizzes & Exams', path: '/exams' },
    { icon: <BookMarked size={20} />, label: 'Grades', path: '/grades' },
    { icon: <CalendarClock size={20} />, label: 'Timetable', path: '/timetable' },
    { icon: <CreditCard size={20} />, label: 'Fee & Payments', path: '/fees' },
    { icon: <FileText size={20} />, label: 'Transcripts', path: '/transcripts' },
    { icon: <MessageSquare size={20} />, label: 'Messages', path: '/messages' },
    { icon: <Bell size={20} />, label: 'Notifications', path: '/notifications' },
    { icon: <Settings size={20} />, label: 'Settings', path: '/settings' },
  ],
  registrar: [
    { icon: <LayoutDashboard size={20} />, label: 'Dashboard', path: '/dashboard' },
    { icon: <FileText size={20} />, label: 'Transcripts', path: '/transcripts' },
    { icon: <ScrollText size={20} />, label: 'Announcements', path: '/announcements' },
    { icon: <Calendar size={20} />, label: 'Academic Calendar', path: '/calendar' },
    { icon: <MessageSquare size={20} />, label: 'Messages', path: '/messages' },
    { icon: <Settings size={20} />, label: 'Settings', path: '/settings' },
  ],
  treasurer: [
    { icon: <LayoutDashboard size={20} />, label: 'Dashboard', path: '/dashboard' },
    { icon: <CreditCard size={20} />, label: 'Fee Management', path: '/fees' },
    { icon: <ScrollText size={20} />, label: 'Announcements', path: '/announcements' },
    { icon: <MessageSquare size={20} />, label: 'Messages', path: '/messages' },
    { icon: <Settings size={20} />, label: 'Settings', path: '/settings' },
  ],
  clerk: [
    { icon: <LayoutDashboard size={20} />, label: 'Dashboard', path: '/dashboard' },
    { icon: <FileText size={20} />, label: 'Transcripts', path: '/transcripts' },
    { icon: <Calendar size={20} />, label: 'Calendar', path: '/calendar' },
    { icon: <MessageSquare size={20} />, label: 'Messages', path: '/messages' },
    { icon: <Settings size={20} />, label: 'Settings', path: '/settings' },
  ],
  controller: [
    { icon: <LayoutDashboard size={20} />, label: 'Dashboard', path: '/dashboard' },
    { icon: <ClipboardList size={20} />, label: 'Examinations', path: '/exams' },
    { icon: <Calendar size={20} />, label: 'Academic Calendar', path: '/calendar' },
    { icon: <ScrollText size={20} />, label: 'Announcements', path: '/announcements' },
    { icon: <MessageSquare size={20} />, label: 'Messages', path: '/messages' },
    { icon: <Settings size={20} />, label: 'Settings', path: '/settings' },
  ],
}

export default function DashboardLayout() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { user, logout } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const navigate = useNavigate()

  const menuItems = MENU_BY_ROLE[user?.role] || MENU_BY_ROLE.student

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  // Proper role display names
  const ROLE_LABELS = {
    admin: 'Admin', vc: 'Vice Chancellor', dean: 'Dean', hod: 'HOD',
    teacher: 'Teacher', student: 'Student', registrar: 'Registrar',
    treasurer: 'Treasurer', clerk: 'Clerk', controller: 'Controller'
  }

  // Build user object in the format Sidebar/Topbar expect
  const userForComponents = {
    name: `${user?.firstName || ''} ${user?.lastName || ''}`.trim() || 'User',
    role: ROLE_LABELS[user?.role] || user?.role || 'Student',
    avatar: user?.avatar || null,
    email: user?.email || '',
  }

  // Fetch unread notification count
  const [notifCount, setNotifCount] = useState(0)
  useEffect(() => {
    const fetchNotifCount = async () => {
      try {
        const token = localStorage.getItem('pu-lms-token')
        if (!token) return
        const res = await fetch('http://localhost:5000/api/notifications', {
          headers: { 'Authorization': `Bearer ${token}` }
        })
        if (res.ok) {
          const data = await res.json()
          setNotifCount(data.unreadCount || 0)
        }
      } catch { /* server offline */ }
    }
    fetchNotifCount()
  }, [])

  return (
    <div className={`dashboard-layout ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
      <Sidebar
        menuItems={menuItems}
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
        mobileOpen={mobileMenuOpen}
        onMobileClose={() => setMobileMenuOpen(false)}
        user={userForComponents}
        roleBadge={userForComponents.role}
      />

      <div className="dashboard-main">
        <Topbar
          onMenuClick={() => setMobileMenuOpen(true)}
          user={userForComponents}
          theme={theme}
          onThemeToggle={toggleTheme}
          onLogout={handleLogout}
          notificationCount={notifCount}
        />
        <main className="dashboard-content">
          <Outlet />
        </main>
      </div>

      <AIChatWidget />
    </div>
  )
}
