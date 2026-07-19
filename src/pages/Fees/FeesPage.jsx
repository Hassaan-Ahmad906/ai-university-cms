import { useState, useEffect } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import {
  CreditCard, Download, CheckCircle2, Clock, AlertCircle,
  Receipt, TrendingUp, Wallet, FileText, Search, Eye, ChevronDown, ChevronRight, Users, Building2
} from 'lucide-react'
import './FeesPage.css'

const API = 'http://localhost:5000/api'
const TOKEN = () => localStorage.getItem('pu-lms-token')

const STUDENT_FEE_DATA = {
  summary: { total: 145000, paid: 100000, due: 45000, dueDate: 'June 30, 2026' },
  installments: [
    { id: 1, challan: 'PU-2026-0845', amount: 50000, dueDate: 'Feb 15, 2026', paidDate: 'Feb 12, 2026', status: 'paid', method: 'HBL Online' },
    { id: 2, challan: 'PU-2026-0846', amount: 50000, dueDate: 'Apr 15, 2026', paidDate: 'Apr 14, 2026', status: 'paid', method: 'JazzCash' },
    { id: 3, challan: 'PU-2026-0847', amount: 45000, dueDate: 'Jun 30, 2026', paidDate: null, status: 'pending', method: null },
  ],
  breakdown: [
    { label: 'Tuition Fee', amount: 85000 },
    { label: 'Lab Fee', amount: 15000 },
    { label: 'Library Fee', amount: 5000 },
    { label: 'Sports Fee', amount: 3000 },
    { label: 'Exam Fee', amount: 12000 },
    { label: 'IT/Computer Fee', amount: 10000 },
    { label: 'Student Welfare Fund', amount: 5000 },
    { label: 'Security Deposit', amount: 10000 },
  ],
}

const statusConfig = {
  paid: { icon: CheckCircle2, label: 'Paid', color: '#10b981' },
  pending: { icon: Clock, label: 'Pending', color: '#f59e0b' },
  overdue: { icon: AlertCircle, label: 'Overdue', color: '#ef4444' },
  partial: { icon: CreditCard, label: 'Partial', color: '#06b6d4' },
}

/* ── Student View ── */
function StudentFeeView() {
  const { summary, installments, breakdown } = STUDENT_FEE_DATA
  const paidPct = Math.round((summary.paid / summary.total) * 100)
  return (
    <>
      <div className="fee-progress-card">
        <div className="fee-progress-info">
          <h3>Fee Payment Progress — Spring 2026</h3>
          <p>Due Date: <strong>{summary.dueDate}</strong></p>
        </div>
        <div className="fee-progress-bar-wrap">
          <div className="fee-progress-bar"><div className="fee-progress-bar__fill" style={{ width: `${paidPct}%` }} /></div>
          <div className="fee-progress-labels">
            <span>Paid: <strong>₨ {summary.paid.toLocaleString()}</strong></span>
            <span>Due: <strong className="fee-due">₨ {summary.due.toLocaleString()}</strong></span>
          </div>
        </div>
        <button className="fee-pay-btn" onClick={() => alert('Online payment integration coming soon')}>
          <CreditCard size={16} /> Pay Now — ₨ {summary.due.toLocaleString()}
        </button>
      </div>
      <div className="fee-section">
        <h3><Receipt size={18} /> Payment History</h3>
        <div className="fee-installments">
          {installments.map(inst => {
            const sc = statusConfig[inst.status]; const StatusIcon = sc.icon
            return (
              <div key={inst.id} className="fee-inst-card">
                <div className="fee-inst-status" style={{ '--status-color': sc.color }}><StatusIcon size={18} /></div>
                <div className="fee-inst-details">
                  <div className="fee-inst-challan">Challan: {inst.challan}</div>
                  <div className="fee-inst-meta">Due: {inst.dueDate} {inst.paidDate && `• Paid: ${inst.paidDate}`}{inst.method && ` • via ${inst.method}`}</div>
                </div>
                <div className="fee-inst-amount">
                  <span className="fee-inst-amount-value">₨ {inst.amount.toLocaleString()}</span>
                  <span className="fee-inst-badge" style={{ background: `${sc.color}20`, color: sc.color }}>{sc.label}</span>
                </div>
                {inst.status === 'paid' && <button className="fee-inst-receipt" title="Download Receipt" onClick={() => alert('Receipt download coming soon')}><Download size={14} /></button>}
              </div>
            )
          })}
        </div>
      </div>
      <div className="fee-section">
        <h3><FileText size={18} /> Fee Breakdown</h3>
        <div className="fee-breakdown-card">
          {breakdown.map((item, i) => <div key={i} className="fee-breakdown-row"><span>{item.label}</span><span>₨ {item.amount.toLocaleString()}</span></div>)}
          <div className="fee-breakdown-row fee-breakdown-total"><span>Total</span><span>₨ {summary.total.toLocaleString()}</span></div>
        </div>
      </div>
    </>
  )
}

/* ── Treasurer View ── */
function TreasurerFeeView() {
  const [searchQuery, setSearchQuery] = useState('')
  const [students, setStudents] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const res = await fetch(`${API}/users?role=student&limit=50`, { headers: { Authorization: `Bearer ${TOKEN()}` } })
        if (!res.ok) throw new Error()
        const data = await res.json()
        setStudents(data.users || [])
      } catch { setStudents([]) }
      finally { setLoading(false) }
    }
    fetchStudents()
  }, [])

  const total = students.length
  const filtered = students.filter(s => {
    const name = `${s.firstName || ''} ${s.lastName || ''}`.toLowerCase()
    const q = searchQuery.toLowerCase()
    return !q || name.includes(q) || (s.email || '').toLowerCase().includes(q) || (s.rollNumber || '').toLowerCase().includes(q)
  })

  return (
    <>
      <div className="fee-stats-grid">
        {[
          { label: 'Total Students', value: total, icon: Users, color: '#5c6bc0' },
          { label: 'Departments', value: [...new Set(students.map(s => s.department))].filter(Boolean).length, icon: Building2, color: '#10b981' },
          { label: 'Active', value: students.filter(s => s.isActive !== false).length, icon: CheckCircle2, color: '#4caf50' },
          { label: 'Inactive', value: students.filter(s => s.isActive === false).length, icon: AlertCircle, color: '#ef4444' },
        ].map((stat, i) => {
          const Icon = stat.icon
          return (
            <div key={i} className="fee-stat-card" style={{ '--accent': stat.color, animationDelay: `${i * 0.1}s` }}>
              <div className="fee-stat-icon"><Icon size={20} /></div>
              <div className="fee-stat-value">{stat.value}</div>
              <div className="fee-stat-label">{stat.label}</div>
            </div>
          )
        })}
      </div>
      <div className="fee-section">
        <div className="fee-section-header">
          <h3>Student Fee Records</h3>
          <div className="fee-search-bar"><Search size={14} /><input placeholder="Search by name, email, or roll..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} /></div>
        </div>
        <div className="fee-table-wrap">
          {loading ? (
            <div style={{ padding: '2rem', textAlign: 'center', color: '#888' }}>Loading students...</div>
          ) : (
            <table className="fee-table">
              <thead><tr><th>Student</th><th>Roll No</th><th>Department</th><th>Semester</th><th>Action</th></tr></thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr><td colSpan={5} style={{ textAlign: 'center', padding: '2rem', color: '#888' }}>No students found</td></tr>
                ) : (
                  filtered.map((s, i) => (
                    <tr key={s._id || i} style={{ animationDelay: `${i * 0.03}s` }}>
                      <td className="fee-table-name">{s.firstName} {s.lastName}</td>
                      <td>{s.rollNumber || '—'}</td>
                      <td>{s.department || '—'}</td>
                      <td>{s.semester || '—'}</td>
                      <td><button className="fee-table-action" onClick={() => alert(`Fee details for ${s.firstName} ${s.lastName} — coming soon`)}><Eye size={14} /></button></td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </>
  )
}

/* ── Admin View — Department → Students hierarchy ── */
function AdminFeeView() {
  const [students, setStudents] = useState([])
  const [loading, setLoading] = useState(true)
  const [expandedDept, setExpandedDept] = useState(null)
  const [search, setSearch] = useState('')

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const res = await fetch(`${API}/users?role=student&limit=200`, { headers: { Authorization: `Bearer ${TOKEN()}` } })
        if (!res.ok) throw new Error()
        const data = await res.json()
        setStudents(data.users || [])
      } catch { setStudents([]) }
      finally { setLoading(false) }
    }
    fetchStudents()
  }, [])

  // Group by department
  const departments = {}
  students.forEach(s => {
    const dept = s.department || 'Unassigned'
    if (!departments[dept]) departments[dept] = []
    departments[dept].push(s)
  })
  const sortedDepts = Object.keys(departments).sort()

  const filteredDepts = search
    ? sortedDepts.filter(d => d.toLowerCase().includes(search.toLowerCase()) || departments[d].some(s => `${s.firstName} ${s.lastName}`.toLowerCase().includes(search.toLowerCase())))
    : sortedDepts

  return (
    <>
      <div className="fee-stats-grid">
        {[
          { label: 'Total Students', value: students.length, icon: Users, color: '#5c6bc0' },
          { label: 'Departments', value: sortedDepts.length, icon: Building2, color: '#10b981' },
          { label: 'Fee Structure', value: '₨ 145K/sem', icon: Wallet, color: '#c9a96e' },
          { label: 'System Status', value: 'Online', icon: CheckCircle2, color: '#4caf50' },
        ].map((stat, i) => {
          const Icon = stat.icon
          return (
            <div key={i} className="fee-stat-card" style={{ '--accent': stat.color, animationDelay: `${i * 0.1}s` }}>
              <div className="fee-stat-icon"><Icon size={20} /></div>
              <div className="fee-stat-value">{stat.value}</div>
              <div className="fee-stat-label">{stat.label}</div>
            </div>
          )
        })}
      </div>

      <div className="fee-section">
        <div className="fee-section-header">
          <h3>Students by Department</h3>
          <div className="fee-search-bar"><Search size={14} /><input placeholder="Search department or student..." value={search} onChange={e => setSearch(e.target.value)} /></div>
        </div>

        {loading ? (
          <div style={{ padding: '2rem', textAlign: 'center', color: '#888' }}>Loading students...</div>
        ) : filteredDepts.length === 0 ? (
          <div style={{ padding: '2rem', textAlign: 'center', color: '#888' }}>No students registered yet</div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {filteredDepts.map(dept => {
              const deptStudents = departments[dept]
              const isExpanded = expandedDept === dept
              return (
                <div key={dept} style={{ borderRadius: '12px', border: '1px solid var(--color-border, #e5e5e5)', overflow: 'hidden', transition: 'all 0.2s' }}>
                  <div
                    onClick={() => setExpandedDept(isExpanded ? null : dept)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '12px', padding: '14px 18px', cursor: 'pointer',
                      background: isExpanded ? 'color-mix(in srgb, var(--color-accent, #c9a96e) 8%, transparent)' : 'var(--color-bg-primary, #fff)',
                      transition: 'background 0.2s',
                    }}
                  >
                    {isExpanded ? <ChevronDown size={18} style={{ color: 'var(--color-accent, #c9a96e)' }} /> : <ChevronRight size={18} style={{ color: '#999' }} />}
                    <Building2 size={18} style={{ color: 'var(--color-accent, #c9a96e)' }} />
                    <span style={{ flex: 1, fontWeight: 600, fontSize: '14px', color: 'var(--color-text-primary, #333)' }}>{dept}</span>
                    <span style={{ fontSize: '12.5px', fontWeight: 600, padding: '3px 10px', borderRadius: '12px', background: 'color-mix(in srgb, var(--color-accent, #c9a96e) 15%, transparent)', color: 'var(--color-accent, #c9a96e)' }}>
                      {deptStudents.length} student{deptStudents.length !== 1 ? 's' : ''}
                    </span>
                  </div>
                  {isExpanded && (
                    <div style={{ borderTop: '1px solid var(--color-border, #e5e5e5)' }}>
                      <table className="fee-table" style={{ margin: 0 }}>
                        <thead><tr><th>Student</th><th>Roll No</th><th>Semester</th><th>Email</th><th>Status</th></tr></thead>
                        <tbody>
                          {deptStudents.map((s, j) => (
                            <tr key={s._id || j}>
                              <td className="fee-table-name">{s.firstName} {s.lastName}</td>
                              <td>{s.rollNumber || '—'}</td>
                              <td>{s.semester || '—'}</td>
                              <td style={{ fontSize: '12.5px', color: '#888' }}>{s.email}</td>
                              <td>
                                <span className="fee-table-badge" style={{ background: s.isActive !== false ? '#10b98120' : '#ef444420', color: s.isActive !== false ? '#10b981' : '#ef4444' }}>
                                  {s.isActive !== false ? 'Active' : 'Inactive'}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>
    </>
  )
}

/* ── Main Export ── */
export default function FeesPage() {
  const { user } = useAuth()
  const role = user?.role
  const isAdmin = role === 'admin'
  const isTreasurer = role === 'treasurer'

  return (
    <div className="fee-page">
      <div className="fee-header">
        <h1>{isAdmin ? 'Fee Overview — By Department' : isTreasurer ? 'Fee Management' : 'Fee & Payments'}</h1>
        <p>{isAdmin ? 'View student fee records grouped by department' : isTreasurer ? 'Manage university fee collections and reports' : 'View and manage your fee payments'}</p>
      </div>
      {isAdmin ? <AdminFeeView /> : isTreasurer ? <TreasurerFeeView /> : <StudentFeeView />}
    </div>
  )
}
