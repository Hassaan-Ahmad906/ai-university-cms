import { useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import {
  CreditCard, Download, CheckCircle2, Clock, AlertCircle,
  Receipt, TrendingUp, Wallet, FileText, Search, Filter, Eye
} from 'lucide-react'
import './FeesPage.css'

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

const TREASURER_DATA = {
  stats: [
    { label: 'Total Collections', value: '₨ 234.5M', icon: Wallet, trend: '+12%', color: '#10b981' },
    { label: 'Pending Dues', value: '₨ 45.2M', icon: Clock, trend: '-5%', color: '#f59e0b' },
    { label: 'Defaulters', value: '342', icon: AlertCircle, trend: '+18', color: '#ef4444' },
    { label: 'Scholarships Issued', value: '156', icon: TrendingUp, trend: '+23', color: '#8b5cf6' },
  ],
  recent: [
    { student: 'Ali Hassan', roll: 'CS-2022-134', amount: 45000, date: 'Jun 27, 2026', status: 'paid' },
    { student: 'Zainab Fatima', roll: 'EE-2023-089', amount: 52000, date: 'Jun 27, 2026', status: 'paid' },
    { student: 'Hamza Raza', roll: 'BBA-2022-056', amount: 38000, date: 'Jun 26, 2026', status: 'partial' },
    { student: 'Noor ul Ain', roll: 'CS-2024-012', amount: 45000, date: 'Jun 25, 2026', status: 'overdue' },
    { student: 'Bilal Ahmad', roll: 'ME-2023-078', amount: 48000, date: 'Jun 25, 2026', status: 'paid' },
  ],
}

const statusConfig = {
  paid: { icon: CheckCircle2, label: 'Paid', color: '#10b981' },
  pending: { icon: Clock, label: 'Pending', color: '#f59e0b' },
  overdue: { icon: AlertCircle, label: 'Overdue', color: '#ef4444' },
  partial: { icon: CreditCard, label: 'Partial', color: '#06b6d4' },
}

function StudentFeeView() {
  const { summary, installments, breakdown } = STUDENT_FEE_DATA
  const paidPercentage = Math.round((summary.paid / summary.total) * 100)

  return (
    <>
      {/* Payment Progress */}
      <div className="fee-progress-card">
        <div className="fee-progress-info">
          <h3>Fee Payment Progress — Spring 2026</h3>
          <p>Due Date: <strong>{summary.dueDate}</strong></p>
        </div>
        <div className="fee-progress-bar-wrap">
          <div className="fee-progress-bar">
            <div className="fee-progress-bar__fill" style={{ width: `${paidPercentage}%` }} />
          </div>
          <div className="fee-progress-labels">
            <span>Paid: <strong>₨ {summary.paid.toLocaleString()}</strong></span>
            <span>Due: <strong className="fee-due">₨ {summary.due.toLocaleString()}</strong></span>
          </div>
        </div>
        <button className="fee-pay-btn" onClick={() => alert('Online payment integration coming soon')}>
          <CreditCard size={16} /> Pay Now — ₨ {summary.due.toLocaleString()}
        </button>
      </div>

      {/* Installments */}
      <div className="fee-section">
        <h3><Receipt size={18} /> Payment History</h3>
        <div className="fee-installments">
          {installments.map(inst => {
            const sc = statusConfig[inst.status]
            const StatusIcon = sc.icon
            return (
              <div key={inst.id} className="fee-inst-card">
                <div className="fee-inst-status" style={{ '--status-color': sc.color }}>
                  <StatusIcon size={18} />
                </div>
                <div className="fee-inst-details">
                  <div className="fee-inst-challan">Challan: {inst.challan}</div>
                  <div className="fee-inst-meta">
                    Due: {inst.dueDate} {inst.paidDate && `• Paid: ${inst.paidDate}`}
                    {inst.method && ` • via ${inst.method}`}
                  </div>
                </div>
                <div className="fee-inst-amount">
                  <span className="fee-inst-amount-value">₨ {inst.amount.toLocaleString()}</span>
                  <span className="fee-inst-badge" style={{ background: `${sc.color}20`, color: sc.color }}>{sc.label}</span>
                </div>
                {inst.status === 'paid' && (
                  <button className="fee-inst-receipt" title="Download Receipt" onClick={() => alert('Receipt download coming soon')}>
                    <Download size={14} />
                  </button>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Fee Breakdown */}
      <div className="fee-section">
        <h3><FileText size={18} /> Fee Breakdown</h3>
        <div className="fee-breakdown-card">
          {breakdown.map((item, i) => (
            <div key={i} className="fee-breakdown-row">
              <span>{item.label}</span>
              <span>₨ {item.amount.toLocaleString()}</span>
            </div>
          ))}
          <div className="fee-breakdown-row fee-breakdown-total">
            <span>Total</span>
            <span>₨ {summary.total.toLocaleString()}</span>
          </div>
        </div>
      </div>
    </>
  )
}

function TreasurerFeeView() {
  const [searchQuery, setSearchQuery] = useState('')
  return (
    <>
      <div className="fee-stats-grid">
        {TREASURER_DATA.stats.map((stat, i) => {
          const Icon = stat.icon
          return (
            <div key={i} className="fee-stat-card" style={{ '--accent': stat.color, animationDelay: `${i * 0.1}s` }}>
              <div className="fee-stat-icon"><Icon size={20} /></div>
              <div className="fee-stat-value">{stat.value}</div>
              <div className="fee-stat-label">{stat.label}</div>
              <span className="fee-stat-trend" style={{ color: stat.color }}>{stat.trend}</span>
            </div>
          )
        })}
      </div>

      <div className="fee-section">
        <div className="fee-section-header">
          <h3>Recent Transactions</h3>
          <div className="fee-search-bar">
            <Search size={14} />
            <input placeholder="Search by name or roll..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
          </div>
        </div>
        <div className="fee-table-wrap">
          <table className="fee-table">
            <thead>
              <tr><th>Student</th><th>Roll No</th><th>Amount</th><th>Date</th><th>Status</th><th>Action</th></tr>
            </thead>
            <tbody>
              {TREASURER_DATA.recent.filter(r => r.student.toLowerCase().includes(searchQuery.toLowerCase()) || r.roll.toLowerCase().includes(searchQuery.toLowerCase())).map((row, i) => {
                const sc = statusConfig[row.status]
                return (
                  <tr key={i} style={{ animationDelay: `${i * 0.05}s` }}>
                    <td className="fee-table-name">{row.student}</td>
                    <td>{row.roll}</td>
                    <td>₨ {row.amount.toLocaleString()}</td>
                    <td>{row.date}</td>
                    <td><span className="fee-table-badge" style={{ background: `${sc.color}20`, color: sc.color }}>{sc.label}</span></td>
                    <td><button className="fee-table-action" onClick={() => alert('Payment details view coming soon')}><Eye size={14} /></button></td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </>
  )
}

export default function FeesPage() {
  const { user } = useAuth()
  const isTreasurer = ['treasurer', 'admin'].includes(user?.role)

  return (
    <div className="fee-page">
      <div className="fee-header">
        <h1>{isTreasurer ? 'Fee Management' : 'Fee & Payments'}</h1>
        <p>{isTreasurer ? 'Manage university fee collections and reports' : 'View and manage your fee payments'}</p>
      </div>
      {isTreasurer ? <TreasurerFeeView /> : <StudentFeeView />}
    </div>
  )
}
