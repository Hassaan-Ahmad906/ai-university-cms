import { useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import {
  ClipboardList, Clock, CheckCircle2, AlertCircle, Play, Eye, Lock,
  BarChart3, FileText, Calendar, Award, Plus, Timer
} from 'lucide-react'
import './ExamsPage.css'

const STUDENT_EXAMS = [
  { id: 1, title: 'Data Structures Quiz #4', course: 'CS-301', type: 'Quiz', questions: 20, duration: '30 min', date: 'Jun 29, 2026', time: '10:00 AM', status: 'upcoming', maxMarks: 20 },
  { id: 2, title: 'AI Mid-Term Examination', course: 'CS-401', type: 'Mid-Term', questions: 40, duration: '2 hours', date: 'Jul 2, 2026', time: '9:00 AM', status: 'upcoming', maxMarks: 100 },
  { id: 3, title: 'OOP Quiz #3', course: 'CS-205', type: 'Quiz', questions: 15, duration: '20 min', date: 'Jun 25, 2026', time: '3:00 PM', status: 'completed', marks: 17, maxMarks: 20 },
  { id: 4, title: 'Database Systems Quiz #2', course: 'CS-310', type: 'Quiz', questions: 25, duration: '30 min', date: 'Jun 20, 2026', time: '2:00 PM', status: 'completed', marks: 21, maxMarks: 25 },
  { id: 5, title: 'Computer Networks Mid-Term', course: 'CS-350', type: 'Mid-Term', questions: 35, duration: '1.5 hours', date: 'Jun 15, 2026', time: '9:00 AM', status: 'completed', marks: 72, maxMarks: 100 },
  { id: 6, title: 'Linear Algebra Quiz #5', course: 'MATH-201', type: 'Quiz', questions: 10, duration: '15 min', date: 'Jul 5, 2026', time: '8:30 AM', status: 'locked', maxMarks: 15 },
]

const TEACHER_EXAMS = [
  { id: 1, title: 'Data Structures Quiz #4', course: 'CS-301', type: 'Quiz', questions: 20, submissions: 0, total: 45, date: 'Jun 29', status: 'draft' },
  { id: 2, title: 'Data Structures Mid-Term', course: 'CS-301', type: 'Mid-Term', questions: 40, submissions: 38, total: 45, date: 'Jun 15', status: 'graded' },
  { id: 3, title: 'AI Quiz #3', course: 'CS-401', type: 'Quiz', questions: 15, submissions: 28, total: 30, date: 'Jun 20', status: 'grading' },
  { id: 4, title: 'Computer Networks Quiz #2', course: 'CS-350', type: 'Quiz', questions: 25, submissions: 40, total: 42, date: 'Jun 18', status: 'graded' },
]

const statusConfig = {
  upcoming: { icon: Clock, color: '#06b6d4', label: 'Upcoming' },
  completed: { icon: CheckCircle2, color: '#10b981', label: 'Completed' },
  locked: { icon: Lock, color: '#6b7280', label: 'Locked' },
  missed: { icon: AlertCircle, color: '#ef4444', label: 'Missed' },
  draft: { icon: FileText, color: '#f59e0b', label: 'Draft' },
  grading: { icon: ClipboardList, color: '#8b5cf6', label: 'Grading' },
  graded: { icon: CheckCircle2, color: '#10b981', label: 'Graded' },
}

function StudentView() {
  const [tab, setTab] = useState('all')
  const filtered = tab === 'all' ? STUDENT_EXAMS : STUDENT_EXAMS.filter(e => e.status === tab)

  return (
    <>
      <div className="exam-stats-row">
        {[
          { label: 'Upcoming Exams', value: STUDENT_EXAMS.filter(e => e.status === 'upcoming').length, icon: Clock, color: '#06b6d4' },
          { label: 'Completed', value: STUDENT_EXAMS.filter(e => e.status === 'completed').length, icon: CheckCircle2, color: '#10b981' },
          { label: 'Average Score', value: '85%', icon: BarChart3, color: '#c9a96e' },
          { label: 'Best Score', value: '92%', icon: Award, color: '#8b5cf6' },
        ].map((stat, i) => {
          const Icon = stat.icon
          return (
            <div key={i} className="exam-stat" style={{ '--sc': stat.color, animationDelay: `${i * 0.08}s` }}>
              <div className="exam-stat__icon"><Icon size={18} /></div>
              <div className="exam-stat__value">{stat.value}</div>
              <div className="exam-stat__label">{stat.label}</div>
            </div>
          )
        })}
      </div>

      <div className="exam-tabs">
        {['all', 'upcoming', 'completed', 'locked'].map(t => (
          <button key={t} className={`exam-tab ${tab === t ? 'active' : ''}`} onClick={() => setTab(t)}>
            {t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>

      <div className="exam-list">
        {filtered.map((exam, i) => {
          const sc = statusConfig[exam.status]
          const StatusIcon = sc.icon
          return (
            <div key={exam.id} className="exam-card" style={{ animationDelay: `${i * 0.06}s` }}>
              <div className="exam-card__accent" style={{ background: sc.color }} />
              <div className="exam-card__body">
                <div className="exam-card__top">
                  <div>
                    <span className="exam-card__type" style={{ color: sc.color, background: `${sc.color}15` }}>{exam.type}</span>
                    <h4>{exam.title}</h4>
                    <span className="exam-card__course">{exam.course}</span>
                  </div>
                  <span className="exam-card__status" style={{ color: sc.color, background: `${sc.color}15` }}>
                    <StatusIcon size={12} /> {sc.label}
                  </span>
                </div>
                <div className="exam-card__details">
                  <span><ClipboardList size={13} /> {exam.questions} questions</span>
                  <span><Timer size={13} /> {exam.duration}</span>
                  <span><Calendar size={13} /> {exam.date}, {exam.time}</span>
                  <span><Award size={13} /> {exam.maxMarks} marks</span>
                </div>
                {exam.status === 'completed' && (
                  <div className="exam-card__score">
                    <div className="exam-card__score-bar">
                      <div className="exam-card__score-fill" style={{ width: `${(exam.marks / exam.maxMarks) * 100}%`, background: exam.marks / exam.maxMarks >= 0.8 ? '#10b981' : exam.marks / exam.maxMarks >= 0.6 ? '#c9a96e' : '#ef4444' }} />
                    </div>
                    <span className="exam-card__score-text">{exam.marks}/{exam.maxMarks}</span>
                  </div>
                )}
                <div className="exam-card__actions">
                  {exam.status === 'upcoming' && <button className="exam-card__btn exam-card__btn--primary"><Play size={14} /> Start Exam</button>}
                  {exam.status === 'completed' && <button className="exam-card__btn"><Eye size={14} /> View Results</button>}
                  {exam.status === 'locked' && <button className="exam-card__btn" disabled><Lock size={14} /> Not Available Yet</button>}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </>
  )
}

function TeacherView() {
  return (
    <>
      <div className="exam-teacher-header">
        <button className="exam-create-btn"><Plus size={16} /> Create New Exam</button>
      </div>
      <div className="exam-list">
        {TEACHER_EXAMS.map((exam, i) => {
          const sc = statusConfig[exam.status]
          const StatusIcon = sc.icon
          return (
            <div key={exam.id} className="exam-card" style={{ animationDelay: `${i * 0.06}s` }}>
              <div className="exam-card__accent" style={{ background: sc.color }} />
              <div className="exam-card__body">
                <div className="exam-card__top">
                  <div>
                    <span className="exam-card__type" style={{ color: sc.color, background: `${sc.color}15` }}>{exam.type}</span>
                    <h4>{exam.title}</h4>
                    <span className="exam-card__course">{exam.course} • {exam.date}</span>
                  </div>
                  <span className="exam-card__status" style={{ color: sc.color, background: `${sc.color}15` }}>
                    <StatusIcon size={12} /> {sc.label}
                  </span>
                </div>
                <div className="exam-card__details">
                  <span><ClipboardList size={13} /> {exam.questions} questions</span>
                  <span><CheckCircle2 size={13} /> {exam.submissions}/{exam.total} submissions</span>
                </div>
                {exam.submissions > 0 && (
                  <div className="exam-card__score">
                    <div className="exam-card__score-bar">
                      <div className="exam-card__score-fill" style={{ width: `${(exam.submissions / exam.total) * 100}%` }} />
                    </div>
                    <span className="exam-card__score-text">{Math.round((exam.submissions / exam.total) * 100)}% submitted</span>
                  </div>
                )}
                <div className="exam-card__actions">
                  <button className="exam-card__btn"><Eye size={14} /> View</button>
                  {exam.status === 'grading' && <button className="exam-card__btn exam-card__btn--primary"><ClipboardList size={14} /> Grade Now</button>}
                  {exam.status === 'draft' && <button className="exam-card__btn exam-card__btn--primary"><Play size={14} /> Publish</button>}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </>
  )
}

export default function ExamsPage() {
  const { user } = useAuth()
  const isTeacher = ['teacher', 'admin', 'hod', 'controller'].includes(user?.role)

  return (
    <div className="exam-page">
      <div className="exam-header">
        <h1>{isTeacher ? 'Exam Management' : 'Quizzes & Exams'}</h1>
        <p>{isTeacher ? 'Create, manage, and grade examinations' : 'View upcoming and completed exams'}</p>
      </div>
      {isTeacher ? <TeacherView /> : <StudentView />}
    </div>
  )
}
