import { useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import {
  BookOpen, Download, BarChart3, TrendingUp, TrendingDown,
  Users, ChevronDown, ChevronLeft, ChevronRight, Award,
  ArrowUpDown
} from 'lucide-react'
import './GradebookPage.css'

const COURSES = [
  'CS-301 Data Structures & Algorithms',
  'CS-401 Artificial Intelligence',
  'CS-302 Database Systems',
  'MATH-201 Linear Algebra',
]

const SUMMARY = [
  { label: 'Class Average', value: '76.4%', icon: BarChart3, color: '#5c6bc0', trend: '+2.1%' },
  { label: 'Highest Score', value: '95%', icon: TrendingUp, color: '#4caf50', trend: null },
  { label: 'Lowest Score', value: '42%', icon: TrendingDown, color: '#ef5350', trend: null },
  { label: 'Total Students', value: '45', icon: Users, color: '#c9a96e', trend: null },
]

const DISTRIBUTION = [
  { grade: 'A', count: 8, color: '#4caf50', label: 'A (80-100)' },
  { grade: 'B', count: 15, color: '#66bb6a', label: 'B (70-79)' },
  { grade: 'C', count: 12, color: '#ffb74d', label: 'C (60-69)' },
  { grade: 'D', count: 7, color: '#ff9800', label: 'D (50-59)' },
  { grade: 'F', count: 3, color: '#ef5350', label: 'F (<50)' },
]

const COLUMNS = ['Student Name', 'Roll No', 'Assignment 1', 'Assignment 2', 'Quiz 1', 'Midterm', 'Total', 'Grade']

function getLetterGrade(total) {
  if (total >= 85) return { letter: 'A', class: 'a' }
  if (total >= 80) return { letter: 'A-', class: 'a' }
  if (total >= 75) return { letter: 'B+', class: 'b' }
  if (total >= 70) return { letter: 'B', class: 'b' }
  if (total >= 65) return { letter: 'B-', class: 'b' }
  if (total >= 60) return { letter: 'C+', class: 'c' }
  if (total >= 55) return { letter: 'C', class: 'c' }
  if (total >= 50) return { letter: 'D', class: 'd' }
  return { letter: 'F', class: 'f' }
}

function getScoreClass(score) {
  if (score >= 80) return 'gradebook-score--high'
  if (score >= 60) return 'gradebook-score--mid'
  if (score >= 50) return 'gradebook-score--low'
  return 'gradebook-score--fail'
}

const STUDENTS = [
  { name: 'Ahmed Hassan', roll: 'CS-2026-001', a1: 88, a2: 92, q1: 85, mid: 78, total: 86, initials: 'AH' },
  { name: 'Fatima Zahra', roll: 'CS-2026-004', a1: 95, a2: 90, q1: 92, mid: 88, total: 91, initials: 'FZ' },
  { name: 'Muhammad Ali', roll: 'CS-2026-007', a1: 72, a2: 68, q1: 75, mid: 70, total: 71, initials: 'MA' },
  { name: 'Ayesha Khan', roll: 'CS-2026-012', a1: 85, a2: 78, q1: 80, mid: 82, total: 81, initials: 'AK' },
  { name: 'Usman Tariq', roll: 'CS-2026-015', a1: 55, a2: 60, q1: 48, mid: 52, total: 54, initials: 'UT' },
  { name: 'Sana Malik', roll: 'CS-2026-019', a1: 90, a2: 95, q1: 88, mid: 92, total: 91, initials: 'SM' },
  { name: 'Bilal Aslam', roll: 'CS-2026-022', a1: 40, a2: 45, q1: 38, mid: 42, total: 41, initials: 'BA' },
  { name: 'Hira Nawaz', roll: 'CS-2026-028', a1: 78, a2: 82, q1: 70, mid: 68, total: 75, initials: 'HN' },
]

export default function GradebookPage() {
  const { user } = useAuth()
  const [selectedCourse, setSelectedCourse] = useState(COURSES[0])
  const maxCount = Math.max(...DISTRIBUTION.map(d => d.count))

  return (
    <div className="gradebook-page">
      {/* Header */}
      <div className="gradebook-header">
        <div className="gradebook-header__left">
          <div className="gradebook-header__icon">
            <BookOpen size={24} />
          </div>
          <div>
            <h1 className="gradebook-header__title">Gradebook</h1>
            <p className="gradebook-header__subtitle">View and manage student grades</p>
          </div>
        </div>
        <div className="gradebook-header__right">
          <div className="gradebook-select-wrapper">
            <select
              value={selectedCourse}
              onChange={(e) => setSelectedCourse(e.target.value)}
              className="gradebook-select"
            >
              {COURSES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <ChevronDown size={14} className="gradebook-select__chevron" />
          </div>
          <button className="gradebook-export-btn">
            <Download size={16} />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="gradebook-summary">
        {SUMMARY.map((s, i) => {
          const Icon = s.icon
          return (
            <div key={i} className="gradebook-summary-card" style={{ '--stat-color': s.color, '--stagger': i }}>
              <div className="gradebook-summary-card__icon">
                <Icon size={20} />
              </div>
              <div className="gradebook-summary-card__info">
                <span className="gradebook-summary-card__value">{s.value}</span>
                <span className="gradebook-summary-card__label">{s.label}</span>
              </div>
              {s.trend && (
                <span className="gradebook-summary-card__trend gradebook-summary-card__trend--up">
                  {s.trend}
                </span>
              )}
            </div>
          )
        })}
      </div>

      {/* Grade Distribution */}
      <div className="gradebook-distribution">
        <h3 className="gradebook-distribution__title">
          <Award size={18} />
          Grade Distribution
        </h3>
        <div className="gradebook-distribution__chart">
          {DISTRIBUTION.map((d, i) => (
            <div key={d.grade} className="gradebook-dist-bar" style={{ '--stagger': i }}>
              <span className="gradebook-dist-bar__label">{d.label}</span>
              <div className="gradebook-dist-bar__track">
                <div
                  className="gradebook-dist-bar__fill"
                  style={{
                    '--bar-width': `${(d.count / maxCount) * 100}%`,
                    '--bar-color': d.color,
                  }}
                />
              </div>
              <span className="gradebook-dist-bar__count">{d.count}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Grade Table */}
      <div className="gradebook-table-wrapper">
        <div className="gradebook-table-scroll">
          <table className="gradebook-table">
            <thead>
              <tr>
                {COLUMNS.map(col => (
                  <th key={col} className="gradebook-th">
                    <div className="gradebook-th__content">
                      <span>{col}</span>
                      {!['Student Name', 'Roll No', 'Grade'].includes(col) && (
                        <ArrowUpDown size={12} className="gradebook-th__sort" />
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {STUDENTS.map((student, i) => {
                const grade = getLetterGrade(student.total)
                return (
                  <tr key={student.roll} className="gradebook-row" style={{ '--stagger': i }}>
                    <td className="gradebook-td gradebook-td--name">
                      <div className="gradebook-student">
                        <div className="gradebook-avatar">{student.initials}</div>
                        <span>{student.name}</span>
                      </div>
                    </td>
                    <td className="gradebook-td gradebook-td--roll">
                      <span className="gradebook-roll">{student.roll}</span>
                    </td>
                    <td className={`gradebook-td gradebook-td--score ${getScoreClass(student.a1)}`}>
                      {student.a1}
                    </td>
                    <td className={`gradebook-td gradebook-td--score ${getScoreClass(student.a2)}`}>
                      {student.a2}
                    </td>
                    <td className={`gradebook-td gradebook-td--score ${getScoreClass(student.q1)}`}>
                      {student.q1}
                    </td>
                    <td className={`gradebook-td gradebook-td--score ${getScoreClass(student.mid)}`}>
                      {student.mid}
                    </td>
                    <td className={`gradebook-td gradebook-td--score gradebook-td--total ${getScoreClass(student.total)}`}>
                      <strong>{student.total}</strong>
                    </td>
                    <td className="gradebook-td">
                      <span className={`gradebook-grade-badge gradebook-grade-badge--${grade.class}`}>
                        {grade.letter}
                      </span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Footer / Pagination */}
      <div className="gradebook-footer">
        <span className="gradebook-footer__info">
          Showing <strong>1–8</strong> of <strong>45</strong> students
        </span>
        <div className="gradebook-pagination">
          <button className="gradebook-page-btn" disabled>
            <ChevronLeft size={16} />
          </button>
          <button className="gradebook-page-btn gradebook-page-btn--active">1</button>
          <button className="gradebook-page-btn">2</button>
          <button className="gradebook-page-btn">3</button>
          <button className="gradebook-page-btn">4</button>
          <button className="gradebook-page-btn">5</button>
          <button className="gradebook-page-btn">6</button>
          <button className="gradebook-page-btn">
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  )
}
