import { useState, useEffect } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'
import {
  ClipboardList, Plus, Search, Filter, Eye, Pencil, Star,
  Calendar, Users, BarChart3, Clock, FileText, CheckCircle2,
  AlertCircle, ChevronDown, Send
} from 'lucide-react'
import './AssignmentsPage.css'

const TEACHER_STATS = [
  { label: 'Total Assignments', value: '24', icon: ClipboardList, color: '#5c6bc0' },
  { label: 'Pending Review', value: '8', icon: Clock, color: '#ff9800' },
  { label: 'Graded', value: '142', icon: CheckCircle2, color: '#4caf50' },
  { label: 'Average Score', value: '78%', icon: BarChart3, color: '#c9a96e' },
]

const STUDENT_STATS = [
  { label: 'My Assignments', value: '6', icon: ClipboardList, color: '#5c6bc0' },
  { label: 'Submitted', value: '4', icon: CheckCircle2, color: '#4caf50' },
  { label: 'Pending', value: '2', icon: Clock, color: '#ff9800' },
  { label: 'Average Score', value: '85%', icon: BarChart3, color: '#c9a96e' },
]

const COURSES = ['All Courses', 'CS-301 Data Structures', 'CS-401 Artificial Intelligence', 'CS-302 Database Systems', 'MATH-201 Linear Algebra']
const STATUSES = ['All', 'Active', 'Expired', 'Draft']

const ASSIGNMENTS = [
  {
    id: 1,
    title: 'Binary Search Tree Implementation',
    course: 'CS-301 Data Structures & Algorithms',
    description: 'Implement a complete BST with insert, delete, search, and traversal operations. Include unit tests for edge cases and complexity analysis.',
    dueDate: 'Jun 25, 2026',
    dueLabel: '3 days left',
    submitted: 34,
    total: 45,
    avgScore: 82,
    status: 'active',
    statusLabel: 'Active',
  },
  {
    id: 2,
    title: 'Neural Network from Scratch',
    course: 'CS-401 Artificial Intelligence',
    description: 'Build a feedforward neural network using only NumPy. Train it on the MNIST dataset and achieve at least 90% accuracy on the test set.',
    dueDate: 'Jun 23, 2026',
    dueLabel: 'Tomorrow',
    submitted: 28,
    total: 38,
    avgScore: 75,
    status: 'expiring',
    statusLabel: 'Due Soon',
  },
  {
    id: 3,
    title: 'ER Diagram & Normalization',
    course: 'CS-302 Database Systems',
    description: 'Design an ER diagram for a hospital management system. Normalize all relations up to BCNF and provide functional dependency analysis.',
    dueDate: 'Jun 20, 2026',
    dueLabel: 'Expired',
    submitted: 42,
    total: 45,
    avgScore: 79,
    status: 'expired',
    statusLabel: 'Expired',
  },
  {
    id: 4,
    title: 'Eigenvalue Decomposition Report',
    course: 'MATH-201 Linear Algebra',
    description: 'Write a comprehensive report on eigenvalue decomposition techniques and their applications in data science and machine learning.',
    dueDate: 'Jun 28, 2026',
    dueLabel: '6 days left',
    submitted: 20,
    total: 50,
    avgScore: null,
    status: 'active',
    statusLabel: 'Active',
  },
  {
    id: 5,
    title: 'Graph Algorithms Comparison',
    course: 'CS-301 Data Structures & Algorithms',
    description: 'Compare Dijkstra\'s, Bellman-Ford, and Floyd-Warshall algorithms. Implement all three and provide time/space complexity benchmarks.',
    dueDate: 'Jul 2, 2026',
    dueLabel: '10 days left',
    submitted: 0,
    total: 45,
    avgScore: null,
    status: 'draft',
    statusLabel: 'Draft',
  },
  {
    id: 6,
    title: 'SQL Query Optimization Lab',
    course: 'CS-302 Database Systems',
    description: 'Optimize a set of 15 complex SQL queries. Use EXPLAIN ANALYZE to measure performance improvements and document your optimization strategies.',
    dueDate: 'Jun 22, 2026',
    dueLabel: 'Today',
    submitted: 40,
    total: 45,
    avgScore: 84,
    status: 'expiring',
    statusLabel: 'Due Soon',
  },
]

export default function AssignmentsPage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const isTeacher = ['teacher', 'admin', 'hod'].includes(user?.role)
  const isStudent = user?.role === 'student'
  const stats = isStudent ? STUDENT_STATS : TEACHER_STATS
  const [assignments, setAssignments] = useState(ASSIGNMENTS)
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [courseFilter, setCourseFilter] = useState('All Courses')
  const [statusFilter, setStatusFilter] = useState('All')

  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        const token = localStorage.getItem('pu-lms-token')
        const res = await fetch('http://localhost:5000/api/assignments', {
          headers: { 'Authorization': `Bearer ${token}` }
        })
        if (res.ok) {
          const data = await res.json()
          if (data.assignments?.length > 0) setAssignments(data.assignments)
        }
      } catch { /* use mock data */ }
      finally { setLoading(false) }
    }
    fetchAssignments()
  }, [])

  const filteredAssignments = assignments.filter(a => {
    const matchesSearch = a.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.course?.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCourse = courseFilter === 'All Courses' || a.course?.includes(courseFilter.split(' ').slice(0, 1).join(''))
    const matchesStatus = statusFilter === 'All' ||
      (statusFilter === 'Active' && a.status === 'active') ||
      (statusFilter === 'Expired' && a.status === 'expired') ||
      (statusFilter === 'Draft' && a.status === 'draft')
    return matchesSearch && matchesCourse && matchesStatus
  })

  return (
    <div className="assign-page">
      {/* Header */}
      <div className="assign-header">
        <div className="assign-header__left">
          <div className="assign-header__icon">
            <ClipboardList size={24} />
          </div>
          <div>
            <h1 className="assign-header__title">Assignments</h1>
            <p className="assign-header__subtitle">
              {isStudent ? 'View and submit your assignments' : 'Manage and grade your course assignments'}
            </p>
          </div>
        </div>
        {isTeacher && (
          <button className="assign-create-btn" onClick={() => alert('Create Assignment form coming soon')}>
            <Plus size={18} />
            <span>Create Assignment</span>
          </button>
        )}
      </div>

      {/* Stats */}
      <div className="assign-stats">
        {stats.map((stat, i) => {
          const Icon = stat.icon
          return (
            <div key={i} className="assign-stat-card" style={{ '--stat-color': stat.color, '--stagger': i }}>
              <div className="assign-stat-card__icon">
                <Icon size={20} />
              </div>
              <div className="assign-stat-card__info">
                <span className="assign-stat-card__value">{stat.value}</span>
                <span className="assign-stat-card__label">{stat.label}</span>
              </div>
              <div className="assign-stat-card__glow" />
            </div>
          )
        })}
      </div>

      {/* Filters */}
      <div className="assign-filters">
        <div className="assign-search">
          <Search size={16} className="assign-search__icon" />
          <input
            type="text"
            placeholder="Search assignments..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="assign-search__input"
          />
        </div>
        <div className="assign-filter-group">
          <div className="assign-select-wrapper">
            <select
              value={courseFilter}
              onChange={(e) => setCourseFilter(e.target.value)}
              className="assign-select"
            >
              {COURSES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <ChevronDown size={14} className="assign-select__chevron" />
          </div>
          <div className="assign-select-wrapper">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="assign-select"
            >
              {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
            <ChevronDown size={14} className="assign-select__chevron" />
          </div>
        </div>
      </div>

      {/* Assignment List */}
      <div className="assign-list">
        {filteredAssignments.map((assignment, i) => (
          <div
            key={assignment.id}
            className={`assign-card assign-card--${assignment.status}`}
            style={{ '--stagger': i }}
          >
            <div className={`assign-card__status-bar assign-card__status-bar--${assignment.status}`} />
            <div className="assign-card__content">
              <div className="assign-card__top">
                <div className="assign-card__main">
                  <div className="assign-card__title-row">
                    <h3 className="assign-card__title">{assignment.title}</h3>
                    <span className={`assign-card__badge assign-card__badge--${assignment.status}`}>
                      {assignment.statusLabel}
                    </span>
                  </div>
                  <span className="assign-card__course">{assignment.course}</span>
                  <p className="assign-card__desc">{assignment.description}</p>
                </div>
              </div>
              <div className="assign-card__meta">
                <div className="assign-card__meta-item">
                  <Calendar size={14} />
                  <span>{assignment.dueDate}</span>
                  <span className={`assign-card__due-label assign-card__due-label--${assignment.status}`}>
                    {assignment.dueLabel}
                  </span>
                </div>
                <div className="assign-card__meta-item">
                  <Users size={14} />
                  <span>{assignment.submitted}/{assignment.total} submitted</span>
                  <div className="assign-card__progress-bar">
                    <div
                      className="assign-card__progress-fill"
                      style={{ width: `${(assignment.submitted / assignment.total) * 100}%` }}
                    />
                  </div>
                </div>
                {assignment.avgScore !== null && (
                  <div className="assign-card__meta-item">
                    <Star size={14} />
                    <span>Avg: {assignment.avgScore}%</span>
                  </div>
                )}
              </div>
              <div className="assign-card__actions">
                <button className="assign-action-btn assign-action-btn--view" onClick={() => alert(`Viewing: ${assignment.title}`)}>
                  <Eye size={14} />
                  <span>View</span>
                </button>
                {isStudent && (
                  <button className="assign-action-btn assign-action-btn--grade" onClick={() => alert(`Submit Assignment: ${assignment.title}`)}>
                    <Send size={14} />
                    <span>Submit</span>
                  </button>
                )}
                {isTeacher && (
                  <>
                    <button className="assign-action-btn assign-action-btn--edit" onClick={() => alert(`Edit Assignment: ${assignment.title}`)}>
                      <Pencil size={14} />
                      <span>Edit</span>
                    </button>
                    <button className="assign-action-btn assign-action-btn--grade" onClick={() => alert(`Grade Assignment: ${assignment.title}`)}>
                      <FileText size={14} />
                      <span>Grade</span>
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredAssignments.length === 0 && (
        <div className="assign-empty">
          <AlertCircle size={40} />
          <p>No assignments match your filters</p>
        </div>
      )}
    </div>
  )
}
