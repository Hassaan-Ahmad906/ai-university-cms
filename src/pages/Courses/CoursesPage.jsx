import { useState, useEffect } from 'react'
import { BookOpen, Plus, Search, Filter, Grid3X3, List } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'
import './CoursesPage.css'

const MOCK_COURSES = [
  { id: 1, code: 'CS-301', name: 'Data Structures & Algorithms', department: 'Computer Science', credits: 3, semester: 'Fall 2026', teacher: 'Dr. Ahmad Khan', enrolled: 45, capacity: 50, status: 'active' },
  { id: 2, code: 'CS-401', name: 'Artificial Intelligence', department: 'Computer Science', credits: 3, semester: 'Fall 2026', teacher: 'Dr. Fatima Ali', enrolled: 38, capacity: 40, status: 'active' },
  { id: 3, code: 'CS-302', name: 'Database Systems', department: 'Computer Science', credits: 3, semester: 'Fall 2026', teacher: 'Prof. Hassan Raza', enrolled: 50, capacity: 50, status: 'full' },
  { id: 4, code: 'CS-205', name: 'Object Oriented Programming', department: 'Computer Science', credits: 3, semester: 'Fall 2026', teacher: 'Dr. Saima Noor', enrolled: 42, capacity: 50, status: 'active' },
  { id: 5, code: 'MATH-201', name: 'Linear Algebra', department: 'Mathematics', credits: 3, semester: 'Fall 2026', teacher: 'Dr. Usman Tariq', enrolled: 55, capacity: 60, status: 'active' },
  { id: 6, code: 'ENG-101', name: 'Technical Writing', department: 'English', credits: 2, semester: 'Fall 2026', teacher: 'Ms. Ayesha Malik', enrolled: 35, capacity: 40, status: 'active' },
]

const getStatusColor = (status) => {
  switch(status) {
    case 'active': return 'var(--color-success)'
    case 'full': return 'var(--color-warning)'
    case 'closed': return 'var(--color-error)'
    default: return 'var(--text-tertiary)'
  }
}

export default function CoursesPage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const canManage = ['admin', 'hod', 'dean'].includes(user?.role)

  const [courses, setCourses] = useState(MOCK_COURSES)
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const token = localStorage.getItem('pu-lms-token')
        const res = await fetch('http://localhost:5000/api/courses', {
          headers: { 'Authorization': `Bearer ${token}` }
        })
        if (res.ok) {
          const data = await res.json()
          if (data.courses?.length > 0) setCourses(data.courses)
        }
      } catch { /* use mock data */ }
      finally { setLoading(false) }
    }
    fetchCourses()
  }, [])

  const filtered = courses.filter(c =>
    c.name?.toLowerCase().includes(search.toLowerCase()) ||
    c.code?.toLowerCase().includes(search.toLowerCase())
  )

  if (loading) {
    return (
      <div className="courses-page" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '40vh' }}>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1rem' }}>Loading courses...</p>
      </div>
    )
  }

  return (
    <div className="courses-page">
      <div className="courses-header">
        <div>
          <h1>Courses</h1>
          <p>{user?.role === 'student' ? 'Browse and view your enrolled courses' : 'Manage and browse all available courses'}</p>
        </div>
        {canManage && (
          <button className="courses-add-btn" onClick={() => alert('Add Course form coming soon')}>
            <Plus size={18} />
            <span>Add Course</span>
          </button>
        )}
      </div>

      <div className="courses-toolbar">
        <div className="courses-search">
          <Search size={18} />
          <input
            type="text"
            placeholder="Search courses by name, code, or teacher..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="courses-toolbar-actions">
          <button className="courses-filter-btn">
            <Filter size={16} />
            <span>Filter</span>
          </button>
          <div className="courses-view-toggle">
            <button className="active"><Grid3X3 size={16} /></button>
            <button><List size={16} /></button>
          </div>
        </div>
      </div>

      <div className="courses-grid">
        {filtered.length === 0 && (
          <p style={{ color: 'var(--text-secondary)', gridColumn: '1 / -1', textAlign: 'center', padding: '2rem 0' }}>
            No courses found matching "{search}"
          </p>
        )}
        {filtered.map((course, index) => (
          <div
            key={course.id}
            className="course-card"
            style={{ animationDelay: `${index * 0.08}s`, cursor: 'pointer' }}
            onClick={() => navigate(`/courses/${course.id}`)}
          >
            <div className="course-card-header">
              <span className="course-code">{course.code}</span>
              <span
                className="course-status"
                style={{ '--status-color': getStatusColor(course.status) }}
              >
                {course.status}
              </span>
            </div>
            <h3 className="course-name">{course.name}</h3>
            <p className="course-teacher">{course.teacher}</p>
            <div className="course-meta">
              <span>{course.department}</span>
              <span>{course.credits} Credits</span>
            </div>
            <div className="course-enrollment">
              <div className="course-enrollment-bar">
                <div
                  className="course-enrollment-fill"
                  style={{ width: `${(course.enrolled / course.capacity) * 100}%` }}
                />
              </div>
              <span className="course-enrollment-text">
                {course.enrolled}/{course.capacity} enrolled
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
