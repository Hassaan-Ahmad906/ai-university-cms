import { useState } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import Sidebar from '../components/common/Sidebar/Sidebar'
import Topbar from '../components/common/Topbar/Topbar'
import { useAuth } from '../contexts/AuthContext'
import { useTheme } from '../contexts/ThemeContext'
import {
  LayoutDashboard, BookOpen, Users, GraduationCap, ClipboardList,
  Calendar, FileText, CreditCard, Bell, MessageSquare, BarChart3,
  Settings, Shield, Building2, Award, UserCheck, Briefcase,
  BookMarked, PenTool, ScrollText, Landmark, Brain, HelpCircle
} from 'lucide-react'
import './DashboardLayout.css'

const MENU_BY_ROLE = {
  admin: [
    { icon: <LayoutDashboard size={20} />, label: 'Dashboard', path: '/dashboard' },
    { icon: <Users size={20} />, label: 'User Management', path: '/users', children: [
      { label: 'All Users', path: '/users' },
      { label: 'Roles & Permissions', path: '/users/roles' },
      { label: 'Bulk Import', path: '/users/import' },
    ]},
    { icon: <Building2 size={20} />, label: 'Departments', path: '/departments' },
    { icon: <BookOpen size={20} />, label: 'Courses', path: '/courses' },
    { icon: <Calendar size={20} />, label: 'Academic Calendar', path: '/calendar' },
    { icon: <CreditCard size={20} />, label: 'Fee Structure', path: '/fees' },
    { icon: <BarChart3 size={20} />, label: 'Reports & Analytics', path: '/reports' },
    { icon: <Brain size={20} />, label: 'AI Services', path: '/ai-config' },
    { icon: <Bell size={20} />, label: 'Notifications', path: '/notifications' },
    { icon: <Settings size={20} />, label: 'Settings', path: '/settings' },
  ],
  vc: [
    { icon: <LayoutDashboard size={20} />, label: 'Dashboard', path: '/dashboard' },
    { icon: <BarChart3 size={20} />, label: 'University Analytics', path: '/analytics' },
    { icon: <UserCheck size={20} />, label: 'Approvals', path: '/approvals' },
    { icon: <Building2 size={20} />, label: 'Faculties', path: '/faculties' },
    { icon: <Award size={20} />, label: 'Programs', path: '/programs' },
    { icon: <ScrollText size={20} />, label: 'Announcements', path: '/announcements' },
    { icon: <MessageSquare size={20} />, label: 'Messages', path: '/messages' },
    { icon: <Brain size={20} />, label: 'AI Insights', path: '/ai-insights' },
  ],
  dean: [
    { icon: <LayoutDashboard size={20} />, label: 'Dashboard', path: '/dashboard' },
    { icon: <Building2 size={20} />, label: 'Departments', path: '/departments' },
    { icon: <Users size={20} />, label: 'Faculty Members', path: '/faculty' },
    { icon: <BookOpen size={20} />, label: 'Courses', path: '/courses' },
    { icon: <Award size={20} />, label: 'Programs', path: '/programs' },
    { icon: <BarChart3 size={20} />, label: 'Performance', path: '/performance' },
    { icon: <ClipboardList size={20} />, label: 'Curriculum Review', path: '/curriculum' },
    { icon: <Brain size={20} />, label: 'AI Analytics', path: '/ai-analytics' },
  ],
  hod: [
    { icon: <LayoutDashboard size={20} />, label: 'Dashboard', path: '/dashboard' },
    { icon: <Users size={20} />, label: 'Faculty', path: '/faculty' },
    { icon: <BookOpen size={20} />, label: 'Courses', path: '/courses' },
    { icon: <GraduationCap size={20} />, label: 'Students', path: '/students' },
    { icon: <Calendar size={20} />, label: 'Timetable', path: '/timetable' },
    { icon: <ClipboardList size={20} />, label: 'Workload', path: '/workload' },
    { icon: <BarChart3 size={20} />, label: 'Reports', path: '/reports' },
    { icon: <Brain size={20} />, label: 'AI Scheduler', path: '/ai-scheduler' },
  ],
  teacher: [
    { icon: <LayoutDashboard size={20} />, label: 'Dashboard', path: '/dashboard' },
    { icon: <BookOpen size={20} />, label: 'My Courses', path: '/courses' },
    { icon: <PenTool size={20} />, label: 'Assignments', path: '/assignments' },
    { icon: <ClipboardList size={20} />, label: 'Quizzes', path: '/quizzes' },
    { icon: <BookMarked size={20} />, label: 'Gradebook', path: '/gradebook' },
    { icon: <UserCheck size={20} />, label: 'Attendance', path: '/attendance' },
    { icon: <GraduationCap size={20} />, label: 'Students', path: '/students' },
    { icon: <MessageSquare size={20} />, label: 'Messages', path: '/messages' },
    { icon: <Calendar size={20} />, label: 'Schedule', path: '/schedule' },
    { icon: <Brain size={20} />, label: 'AI Assistant', path: '/ai-assistant' },
  ],
  student: [
    { icon: <LayoutDashboard size={20} />, label: 'Dashboard', path: '/dashboard' },
    { icon: <BookOpen size={20} />, label: 'My Courses', path: '/courses' },
    { icon: <PenTool size={20} />, label: 'Assignments', path: '/assignments' },
    { icon: <ClipboardList size={20} />, label: 'Quizzes & Exams', path: '/exams' },
    { icon: <BookMarked size={20} />, label: 'Grades', path: '/grades' },
    { icon: <Calendar size={20} />, label: 'Timetable', path: '/timetable' },
    { icon: <CreditCard size={20} />, label: 'Fee & Payments', path: '/fees' },
    { icon: <FileText size={20} />, label: 'Transcripts', path: '/transcripts' },
    { icon: <MessageSquare size={20} />, label: 'Messages', path: '/messages' },
    { icon: <Brain size={20} />, label: 'AI Study Buddy', path: '/ai-assistant' },
    { icon: <HelpCircle size={20} />, label: 'Help & Support', path: '/support' },
  ],
  registrar: [
    { icon: <LayoutDashboard size={20} />, label: 'Dashboard', path: '/dashboard' },
    { icon: <GraduationCap size={20} />, label: 'Admissions', path: '/admissions' },
    { icon: <Users size={20} />, label: 'Student Records', path: '/students' },
    { icon: <FileText size={20} />, label: 'Transcripts', path: '/transcripts' },
    { icon: <ScrollText size={20} />, label: 'Certificates', path: '/certificates' },
    { icon: <Landmark size={20} />, label: 'Degree Audit', path: '/degree-audit' },
    { icon: <BarChart3 size={20} />, label: 'Reports', path: '/reports' },
  ],
  treasurer: [
    { icon: <LayoutDashboard size={20} />, label: 'Dashboard', path: '/dashboard' },
    { icon: <CreditCard size={20} />, label: 'Fee Management', path: '/fees' },
    { icon: <Briefcase size={20} />, label: 'Scholarships', path: '/scholarships' },
    { icon: <BarChart3 size={20} />, label: 'Financial Reports', path: '/finance-reports' },
    { icon: <ScrollText size={20} />, label: 'Budget', path: '/budget' },
  ],
  clerk: [
    { icon: <LayoutDashboard size={20} />, label: 'Dashboard', path: '/dashboard' },
    { icon: <FileText size={20} />, label: 'Document Queue', path: '/documents' },
    { icon: <ScrollText size={20} />, label: 'Transcripts', path: '/transcripts' },
    { icon: <Users size={20} />, label: 'Student Inquiry', path: '/inquiries' },
    { icon: <Calendar size={20} />, label: 'Appointments', path: '/appointments' },
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

  // Build user object in the format Sidebar/Topbar expect
  const userForComponents = {
    name: `${user?.firstName || ''} ${user?.lastName || ''}`.trim() || 'User',
    role: user?.role?.replace(/^\w/, c => c.toUpperCase()) || 'Student',
    avatar: user?.avatar || null,
    email: user?.email || '',
  }

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
          notificationCount={5}
        />
        <main className="dashboard-content">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
