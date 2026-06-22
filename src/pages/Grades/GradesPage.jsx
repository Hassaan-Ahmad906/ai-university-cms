import { useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import {
  BarChart3, Award, BookOpen, Star, TrendingUp,
  ChevronDown, GraduationCap, Medal, Sparkles
} from 'lucide-react'
import './GradesPage.css'

const semesterData = {
  'Fall 2025': {
    gpa: 3.58,
    courses: [
      { code: 'CS-301', name: 'Data Structures & Algorithms', credits: 3, grade: 'A', points: 4.00 },
      { code: 'CS-302', name: 'Database Systems', credits: 3, grade: 'A-', points: 3.67 },
      { code: 'CS-303', name: 'Computer Networks', credits: 3, grade: 'B+', points: 3.33 },
      { code: 'MATH-301', name: 'Numerical Computing', credits: 3, grade: 'A', points: 4.00 },
      { code: 'CS-304', name: 'Software Engineering', credits: 3, grade: 'B', points: 3.00 },
      { code: 'ENG-301', name: 'Technical Writing', credits: 2, grade: 'A-', points: 3.67 },
    ]
  },
  'Spring 2026': {
    gpa: 3.85,
    courses: [
      { code: 'CS-401', name: 'Artificial Intelligence', credits: 3, grade: 'A', points: 4.00 },
      { code: 'CS-402', name: 'Operating Systems', credits: 3, grade: 'A', points: 4.00 },
      { code: 'CS-403', name: 'Compiler Construction', credits: 3, grade: 'A-', points: 3.67 },
      { code: 'CS-404', name: 'Machine Learning', credits: 3, grade: 'A', points: 4.00 },
      { code: 'CS-405', name: 'Information Security', credits: 3, grade: 'B+', points: 3.33 },
      { code: 'MATH-401', name: 'Probability & Statistics', credits: 3, grade: 'A', points: 4.00 },
    ]
  }
}

const cgpaTrend = [
  { semester: 'Fall 2024', gpa: 3.45 },
  { semester: 'Spring 2025', gpa: 3.62 },
  { semester: 'Fall 2025', gpa: 3.58 },
  { semester: 'Spring 2026', gpa: 3.85 },
]

function getGradeClass(grade) {
  if (grade.startsWith('A')) return 'grades-grade--a'
  if (grade.startsWith('B')) return 'grades-grade--b'
  if (grade.startsWith('C')) return 'grades-grade--c'
  if (grade.startsWith('D')) return 'grades-grade--d'
  if (grade === 'F') return 'grades-grade--f'
  return ''
}

export default function GradesPage() {
  const { user } = useAuth()
  const [activeSemester, setActiveSemester] = useState('Spring 2026')
  const semesters = Object.keys(semesterData)
  const currentData = semesterData[activeSemester]
  const totalCredits = currentData.courses.reduce((sum, c) => sum + c.credits, 0)
  const totalPoints = currentData.courses.reduce((sum, c) => sum + (c.credits * c.points), 0)
  const semGPA = (totalPoints / totalCredits).toFixed(2)

  const cgpa = 3.72
  const cgpaPercent = (cgpa / 4.0) * 100

  return (
    <div className="grades-page">
      {/* Header */}
      <div className="grades-header">
        <div className="grades-header__left">
          <div className="grades-header__icon">
            <BarChart3 size={24} />
          </div>
          <div>
            <h1 className="grades-header__title">My Grades</h1>
            <p className="grades-header__subtitle">Track your academic performance and achievements</p>
          </div>
        </div>
        <div className="grades-header__badge">
          <Sparkles size={16} />
          <span>Spring 2026 Results Published</span>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grades-summary">
        {/* CGPA Card with Ring */}
        <div className="grades-card grades-card--cgpa" style={{ '--anim-order': 0 }}>
          <div className="grades-card__ring-wrapper">
            <div className="grades-card__ring" style={{ '--ring-percent': cgpaPercent }}>
              <svg viewBox="0 0 120 120" className="grades-ring-svg">
                <circle cx="60" cy="60" r="52" className="grades-ring-track" />
                <circle cx="60" cy="60" r="52" className="grades-ring-fill" 
                  strokeDasharray={`${cgpaPercent * 3.267} 326.73`} />
              </svg>
              <div className="grades-ring-value">
                <span className="grades-ring-number">{cgpa}</span>
                <span className="grades-ring-total">/4.00</span>
              </div>
            </div>
          </div>
          <div className="grades-card__info">
            <span className="grades-card__label">Current CGPA</span>
            <div className="grades-card__trend grades-card__trend--up">
              <TrendingUp size={14} /> +0.14 from last sem
            </div>
          </div>
        </div>

        {/* Semester GPA */}
        <div className="grades-card" style={{ '--anim-order': 1 }}>
          <div className="grades-card__icon grades-card__icon--blue">
            <BarChart3 size={22} />
          </div>
          <div className="grades-card__info">
            <span className="grades-card__label">Semester GPA</span>
            <span className="grades-card__value">{currentData.gpa.toFixed(2)}</span>
          </div>
          <div className="grades-card__accent-line grades-card__accent-line--blue" />
        </div>

        {/* Credits Earned */}
        <div className="grades-card" style={{ '--anim-order': 2 }}>
          <div className="grades-card__icon grades-card__icon--purple">
            <BookOpen size={22} />
          </div>
          <div className="grades-card__info">
            <span className="grades-card__label">Credits Earned</span>
            <span className="grades-card__value">96<span className="grades-card__value-suffix">/136</span></span>
          </div>
          <div className="grades-card__progress-mini">
            <div className="grades-card__progress-bar" style={{ width: `${(96/136)*100}%` }} />
          </div>
        </div>

        {/* Dean's List */}
        <div className="grades-card grades-card--deans" style={{ '--anim-order': 3 }}>
          <div className="grades-card__icon grades-card__icon--gold">
            <Medal size={22} />
          </div>
          <div className="grades-card__info">
            <span className="grades-card__label">Dean's List</span>
            <span className="grades-card__value grades-card__value--gold">
              <Award size={18} /> Yes
            </span>
          </div>
          <div className="grades-card__shimmer" />
        </div>
      </div>

      {/* Semester Tabs */}
      <div className="grades-tabs">
        {semesters.map((sem) => (
          <button
            key={sem}
            className={`grades-tab ${activeSemester === sem ? 'grades-tab--active' : ''}`}
            onClick={() => setActiveSemester(sem)}
          >
            <GraduationCap size={16} />
            {sem}
          </button>
        ))}
      </div>

      {/* Course Grades Table */}
      <div className="grades-table-wrapper" style={{ '--anim-order': 4 }}>
        <div className="grades-table-header">
          <h2 className="grades-table-title">
            <BookOpen size={20} />
            Course Grades — {activeSemester}
          </h2>
        </div>
        <div className="grades-table-scroll">
          <table className="grades-table">
            <thead>
              <tr>
                <th>Course Code</th>
                <th>Course Name</th>
                <th>Credit Hours</th>
                <th>Grade</th>
                <th>Grade Points</th>
              </tr>
            </thead>
            <tbody>
              {currentData.courses.map((course, i) => (
                <tr key={course.code} style={{ '--row-delay': `${i * 60}ms` }}>
                  <td>
                    <span className="grades-code">{course.code}</span>
                  </td>
                  <td className="grades-course-name">{course.name}</td>
                  <td className="grades-credits">{course.credits}</td>
                  <td>
                    <span className={`grades-grade-badge ${getGradeClass(course.grade)}`}>
                      {course.grade}
                    </span>
                  </td>
                  <td className="grades-points">{course.points.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="grades-table-footer">
                <td colSpan={2}>
                  <strong>Semester GPA</strong>
                </td>
                <td><strong>{totalCredits}</strong></td>
                <td />
                <td>
                  <span className="grades-semester-gpa">{semGPA}</span>
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* CGPA Trend */}
      <div className="grades-trend" style={{ '--anim-order': 5 }}>
        <h2 className="grades-trend__title">
          <TrendingUp size={20} />
          CGPA Trend
        </h2>
        <div className="grades-trend__bars">
          {cgpaTrend.map((item, i) => {
            const pct = (item.gpa / 4.0) * 100
            return (
              <div className="grades-trend__row" key={item.semester} style={{ '--bar-delay': `${i * 120}ms` }}>
                <span className="grades-trend__label">{item.semester}</span>
                <div className="grades-trend__track">
                  <div
                    className="grades-trend__fill"
                    style={{ '--bar-width': `${pct}%` }}
                  >
                    <span className="grades-trend__value">{item.gpa.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
