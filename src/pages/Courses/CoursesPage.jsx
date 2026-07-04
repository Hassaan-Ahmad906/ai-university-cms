import { BookOpen, Plus, Search, Filter, Grid3X3, List } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
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
  const isStudent = user?.role === 'student'

  return (
    <div className="courses-page">
      <div className="courses-header">
        <div>
          <h1>Courses</h1>
          <p>{isStudent ? 'Browse and view your enrolled courses' : 'Manage and browse all available courses'}</p>
        </div>
        {!isStudent && (
          <button className="courses-add-btn">
            <Plus size={18} />
            <span>Add Course</span>
          </button>
        )}
      </div>

      <div className="courses-toolbar">
        <div className="courses-search">
          <Search size={18} />
          <input type="text" placeholder="Search courses by name, code, or teacher..." />
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
        {MOCK_COURSES.map((course, index) => (
          <div 
            key={course.id} 
            className="course-card"
            style={{ animationDelay: `${index * 0.08}s` }}
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
