import { useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import {
  FileText, Download, Plus, Clock, CheckCircle2,
  AlertCircle, Package, Eye, Printer, Building2,
  GraduationCap, User, Hash, BookOpen, Send
} from 'lucide-react'
import './TranscriptsPage.css'

const stats = [
  { label: 'Total Requests', value: 3, icon: FileText, color: 'primary' },
  { label: 'Pending', value: 1, icon: Clock, color: 'warning' },
  { label: 'Ready for Pickup', value: 1, icon: Package, color: 'success' },
]

const requests = [
  {
    id: 'TR-2026-001',
    type: 'Official Transcript',
    date: 'Jun 10, 2026',
    status: 'processing',
    statusLabel: 'Processing',
    expectedDate: 'Jun 25, 2026',
  },
  {
    id: 'TR-2026-002',
    type: 'Degree Verification Letter',
    date: 'Jun 05, 2026',
    status: 'ready',
    statusLabel: 'Ready for Pickup',
    expectedDate: 'Jun 18, 2026',
  },
  {
    id: 'TR-2025-018',
    type: 'Official Transcript',
    date: 'Jan 15, 2026',
    status: 'collected',
    statusLabel: 'Collected',
    expectedDate: 'Jan 28, 2026',
  },
]

const semesterRecords = [
  { semester: 'Fall 2024', credits: 18, gpa: 3.45 },
  { semester: 'Spring 2025', credits: 18, gpa: 3.62 },
  { semester: 'Fall 2025', credits: 17, gpa: 3.58 },
  { semester: 'Spring 2026', credits: 18, gpa: 3.85 },
]

function getStatusClass(status) {
  if (status === 'processing') return 'transcript-status--processing'
  if (status === 'ready') return 'transcript-status--ready'
  if (status === 'collected') return 'transcript-status--collected'
  return ''
}

function getStatusIcon(status) {
  if (status === 'processing') return AlertCircle
  if (status === 'ready') return CheckCircle2
  if (status === 'collected') return Package
  return Clock
}

export default function TranscriptsPage() {
  const { user } = useAuth()
  const [showModal, setShowModal] = useState(false)

  const totalCredits = semesterRecords.reduce((s, r) => s + r.credits, 0)
  const weightedGPA = semesterRecords.reduce((s, r) => s + r.credits * r.gpa, 0)
  const cgpa = (weightedGPA / totalCredits).toFixed(2)

  const studentName = user ? `${user.firstName} ${user.lastName}` : 'Muhammad Ahmed'
  const rollNumber = '2022-CS-142'
  const program = 'BS Computer Science'
  const department = user?.department || 'Computer Science'

  return (
    <div className="transcript-page">
      {/* Header */}
      <div className="transcript-header">
        <div className="transcript-header__left">
          <div className="transcript-header__icon">
            <FileText size={24} />
          </div>
          <div>
            <h1 className="transcript-header__title">Transcripts & Documents</h1>
            <p className="transcript-header__subtitle">Request and manage your academic documents</p>
          </div>
        </div>
        <button className="transcript-request-btn" onClick={() => setShowModal(!showModal)}>
          <Plus size={18} />
          Request Transcript
        </button>
      </div>

      {/* Stats */}
      <div className="transcript-stats">
        {stats.map((stat, i) => {
          const Icon = stat.icon
          return (
            <div
              key={stat.label}
              className={`transcript-stat-card transcript-stat-card--${stat.color}`}
              style={{ '--anim-order': i }}
            >
              <div className={`transcript-stat-icon transcript-stat-icon--${stat.color}`}>
                <Icon size={22} />
              </div>
              <div className="transcript-stat-info">
                <span className="transcript-stat-label">{stat.label}</span>
                <span className="transcript-stat-value">{stat.value}</span>
              </div>
            </div>
          )
        })}
      </div>

      {/* Requests Table */}
      <div className="transcript-table-wrapper" style={{ '--anim-order': 3 }}>
        <div className="transcript-table-header">
          <h2 className="transcript-table-title">
            <Clock size={20} />
            Active Requests
          </h2>
        </div>
        <div className="transcript-table-scroll">
          <table className="transcript-table">
            <thead>
              <tr>
                <th>Request ID</th>
                <th>Document Type</th>
                <th>Request Date</th>
                <th>Status</th>
                <th>Expected Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((req, i) => {
                const StatusIcon = getStatusIcon(req.status)
                return (
                  <tr key={req.id} style={{ '--row-delay': `${i * 80}ms` }}>
                    <td>
                      <span className="transcript-req-id">{req.id}</span>
                    </td>
                    <td className="transcript-doc-type">
                      <FileText size={14} />
                      {req.type}
                    </td>
                    <td className="transcript-date">{req.date}</td>
                    <td>
                      <span className={`transcript-status-pill ${getStatusClass(req.status)}`}>
                        <StatusIcon size={13} />
                        {req.statusLabel}
                      </span>
                    </td>
                    <td className="transcript-date">{req.expectedDate}</td>
                    <td>
                      <div className="transcript-actions">
                        <button className="transcript-action-btn" title="View">
                          <Eye size={15} />
                        </button>
                        {req.status === 'ready' && (
                          <button className="transcript-action-btn transcript-action-btn--download" title="Download">
                            <Download size={15} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Academic Record Preview */}
      <div className="transcript-preview" style={{ '--anim-order': 4 }}>
        <h2 className="transcript-preview-heading">
          <GraduationCap size={20} />
          Academic Record Preview
        </h2>

        <div className="transcript-document">
          {/* University Header */}
          <div className="transcript-doc-header">
            <div className="transcript-doc-logo">
              <Building2 size={28} />
            </div>
            <div className="transcript-doc-uni">
              <h3 className="transcript-doc-uni-name">University of the Punjab</h3>
              <p className="transcript-doc-uni-sub">Office of the Controller of Examinations</p>
              <p className="transcript-doc-uni-tagline">Established 1882 — Lahore, Pakistan</p>
            </div>
            <div className="transcript-doc-seal">
              <GraduationCap size={28} />
            </div>
          </div>

          <div className="transcript-doc-divider">
            <span>UNOFFICIAL TRANSCRIPT</span>
          </div>

          {/* Student Info */}
          <div className="transcript-doc-student">
            <div className="transcript-doc-field">
              <User size={14} />
              <span className="transcript-doc-field-label">Student Name</span>
              <span className="transcript-doc-field-value">{studentName}</span>
            </div>
            <div className="transcript-doc-field">
              <Hash size={14} />
              <span className="transcript-doc-field-label">Roll Number</span>
              <span className="transcript-doc-field-value">{rollNumber}</span>
            </div>
            <div className="transcript-doc-field">
              <BookOpen size={14} />
              <span className="transcript-doc-field-label">Program</span>
              <span className="transcript-doc-field-value">{program}</span>
            </div>
            <div className="transcript-doc-field">
              <Building2 size={14} />
              <span className="transcript-doc-field-label">Department</span>
              <span className="transcript-doc-field-value">{department}</span>
            </div>
          </div>

          {/* Semester Table */}
          <table className="transcript-doc-table">
            <thead>
              <tr>
                <th>Semester</th>
                <th>Credit Hours</th>
                <th>GPA</th>
              </tr>
            </thead>
            <tbody>
              {semesterRecords.map((rec, i) => (
                <tr key={rec.semester} style={{ '--row-delay': `${i * 60}ms` }}>
                  <td>{rec.semester}</td>
                  <td className="transcript-doc-center">{rec.credits}</td>
                  <td className="transcript-doc-center">
                    <span className="transcript-doc-gpa">{rec.gpa.toFixed(2)}</span>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td><strong>Cumulative</strong></td>
                <td className="transcript-doc-center"><strong>{totalCredits}</strong></td>
                <td className="transcript-doc-center">
                  <span className="transcript-doc-cgpa">{cgpa}</span>
                </td>
              </tr>
            </tfoot>
          </table>

          {/* Actions */}
          <div className="transcript-doc-actions">
            <button className="transcript-doc-btn transcript-doc-btn--download">
              <Download size={16} />
              Download PDF
            </button>
            <button className="transcript-doc-btn transcript-doc-btn--request">
              <Send size={16} />
              Request Official Copy
            </button>
          </div>

          {/* Watermark */}
          <div className="transcript-doc-watermark">UNOFFICIAL</div>
        </div>
      </div>
    </div>
  )
}
