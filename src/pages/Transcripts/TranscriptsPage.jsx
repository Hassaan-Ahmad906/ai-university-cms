import { useState, useEffect } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import {
  FileText, Download, Plus, Clock, CheckCircle2,
  AlertCircle, Package, Eye, Printer, Building2,
  GraduationCap, User, Hash, BookOpen, Send
} from 'lucide-react'
import './TranscriptsPage.css'

const MOCK_REQUESTS = [
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

const MOCK_SEMESTER_RECORDS = [
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
  const [requests, setRequests] = useState(MOCK_REQUESTS)
  const [semesterRecords, setSemesterRecords] = useState(MOCK_SEMESTER_RECORDS)
  const [loading, setLoading] = useState(true)

  const isRegistrarOrClerk = user && ['registrar', 'clerk', 'admin'].includes(user.role)

  // Fetch transcript data on mount
  useEffect(() => {
    const fetchTranscripts = async () => {
      try {
        const token = localStorage.getItem('pu-lms-token')
        const res = await fetch('http://localhost:5000/api/transcripts', {
          headers: { Authorization: `Bearer ${token}` },
        })
        if (!res.ok) throw new Error('Failed to fetch transcripts')
        const data = await res.json()
        if (data.requests) setRequests(data.requests)
        else if (Array.isArray(data)) setRequests(data)
        if (data.semesterRecords) setSemesterRecords(data.semesterRecords)
      } catch (err) {
        console.error('Error fetching transcripts, using mock data:', err)
        setRequests(MOCK_REQUESTS)
        setSemesterRecords(MOCK_SEMESTER_RECORDS)
      } finally {
        setLoading(false)
      }
    }
    fetchTranscripts()
  }, [])

  // Request a new transcript
  const handleRequestTranscript = async () => {
    try {
      const token = localStorage.getItem('pu-lms-token')
      const res = await fetch('http://localhost:5000/api/transcripts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ type: 'Official Transcript' }),
      })
      if (!res.ok) throw new Error('Failed to submit transcript request')
      const data = await res.json()
      setRequests(prev => [data.request || data, ...prev])
      setShowModal(false)
      alert('Transcript request submitted successfully!')
    } catch (err) {
      console.error('Error requesting transcript:', err)
      alert('Failed to submit request. Please try again.')
    }
  }

  // Update status (registrar/clerk only)
  const handleStatusUpdate = async (id, newStatus, newLabel) => {
    try {
      const token = localStorage.getItem('pu-lms-token')
      const res = await fetch(`http://localhost:5000/api/transcripts/${id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      })
      if (!res.ok) throw new Error('Failed to update status')
      setRequests(prev =>
        prev.map(r =>
          r.id === id ? { ...r, status: newStatus, statusLabel: newLabel } : r
        )
      )
    } catch (err) {
      console.error('Error updating status:', err)
      alert('Failed to update status. Please try again.')
    }
  }

  // Compute stats from requests
  const totalRequests = requests.length
  const pendingCount = requests.filter(r => r.status === 'processing').length
  const readyCount = requests.filter(r => r.status === 'ready').length

  const stats = [
    { label: 'Total Requests', value: totalRequests, icon: FileText, color: 'primary' },
    { label: 'Pending', value: pendingCount, icon: Clock, color: 'warning' },
    { label: 'Ready for Pickup', value: readyCount, icon: Package, color: 'success' },
  ]

  const totalCredits = semesterRecords.reduce((s, r) => s + r.credits, 0)
  const weightedGPA = semesterRecords.reduce((s, r) => s + r.credits * r.gpa, 0)
  const cgpa = totalCredits > 0 ? (weightedGPA / totalCredits).toFixed(2) : '0.00'

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
        <button className="transcript-request-btn" onClick={handleRequestTranscript}>
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
          {loading ? (
            <div style={{ padding: '2rem', textAlign: 'center', color: '#888' }}>Loading requests...</div>
          ) : (
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
                {requests.length === 0 ? (
                  <tr>
                    <td colSpan={6} style={{ textAlign: 'center', padding: '2rem', color: '#888' }}>
                      No transcript requests found.
                    </td>
                  </tr>
                ) : (
                  requests.map((req, i) => {
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
                            {isRegistrarOrClerk && req.status === 'processing' && (
                              <button
                                className="transcript-action-btn transcript-action-btn--download"
                                title="Mark Ready"
                                onClick={() => handleStatusUpdate(req.id, 'ready', 'Ready for Pickup')}
                              >
                                <CheckCircle2 size={15} />
                              </button>
                            )}
                            {isRegistrarOrClerk && req.status === 'ready' && (
                              <button
                                className="transcript-action-btn"
                                title="Mark Collected"
                                onClick={() => handleStatusUpdate(req.id, 'collected', 'Collected')}
                              >
                                <Package size={15} />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    )
                  })
                )}
              </tbody>
            </table>
          )}
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
            <button className="transcript-doc-btn transcript-doc-btn--request" onClick={handleRequestTranscript}>
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
