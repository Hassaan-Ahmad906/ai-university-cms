import { useState, useEffect, useRef } from 'react'
import { Users, Plus, Search, MoreVertical, Shield, GraduationCap, BookOpen, Edit, Trash2, X, Building2, UserPlus, Check } from 'lucide-react'
import './UsersPage.css'

const API = 'http://localhost:5000/api'
const TOKEN = () => localStorage.getItem('pu-lms-token')
const HEADERS = () => ({ 'Content-Type': 'application/json', Authorization: `Bearer ${TOKEN()}` })

const ROLE_ICONS = { admin: Shield, teacher: BookOpen, student: GraduationCap, hod: Building2, dean: Building2, clerk: Users, vc: Shield, registrar: Users, treasurer: Users, controller: Users }
const ROLE_COLORS = { admin: '#ef4444', teacher: '#f59e0b', student: '#06b6d4', hod: '#10b981', dean: '#8b5cf6', clerk: '#6b7280', vc: '#c9a96e', registrar: '#ec4899', treasurer: '#f97316', controller: '#14b8a6' }
const ROLE_LABELS = { admin: 'Admin', teacher: 'Teacher', student: 'Student', hod: 'HOD', dean: 'Dean', clerk: 'Clerk', vc: 'VC', registrar: 'Registrar', treasurer: 'Treasurer', controller: 'Controller' }
const ROLES_LIST = ['student', 'teacher', 'hod', 'dean', 'clerk', 'registrar', 'treasurer', 'controller', 'admin', 'vc']
const DEPARTMENTS = ['Computer Science', 'Electrical Engineering', 'Mathematics', 'Physics', 'Chemistry', 'Business Administration', 'Economics', 'English', 'Law', 'Medicine', 'Administration', 'General']

function getName(u) { return u.name || `${u.firstName || ''} ${u.lastName || ''}`.trim() || 'Unknown' }
function getInitials(u) { return getName(u).split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase() }

/* ── Modal Backdrop ── */
function Modal({ open, onClose, title, children }) {
  if (!open) return null
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }} onClick={onClose}>
      <div style={{ background: 'var(--color-bg-primary, #fff)', borderRadius: '16px', padding: '0', maxWidth: '520px', width: '94%', boxShadow: '0 20px 60px rgba(0,0,0,0.25)', maxHeight: '90vh', overflow: 'auto', animation: 'fadeIn 0.2s ease' }} onClick={e => e.stopPropagation()}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 24px', borderBottom: '1px solid var(--color-border, #e5e5e5)' }}>
          <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 700, color: 'var(--color-text-primary, #1a1a2e)' }}>{title}</h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-tertiary, #999)', padding: '4px' }}><X size={20} /></button>
        </div>
        <div style={{ padding: '20px 24px' }}>{children}</div>
      </div>
    </div>
  )
}

/* ── Form Input ── */
const inputStyle = { width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1.5px solid var(--color-border, #e0e0e0)', background: 'var(--color-bg-secondary, #f8f8f8)', fontSize: '13.5px', color: 'var(--color-text-primary, #333)', outline: 'none', transition: 'border 0.2s', boxSizing: 'border-box' }
const labelStyle = { display: 'block', fontSize: '12.5px', fontWeight: 600, color: 'var(--color-text-secondary, #666)', marginBottom: '6px' }
const rowStyle = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }
const fieldStyle = { marginBottom: '16px' }
const btnPrimary = { padding: '10px 20px', borderRadius: '10px', border: 'none', background: 'var(--color-accent, #c9a96e)', color: '#fff', cursor: 'pointer', fontSize: '13.5px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px', width: '100%', justifyContent: 'center' }

export default function UsersPage() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState('all')
  const [menuOpenId, setMenuOpenId] = useState(null)
  const [toast, setToast] = useState(null)
  const menuRef = useRef(null)

  // Modals
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [editUser, setEditUser] = useState(null)
  const [deleteConfirm, setDeleteConfirm] = useState(null)

  // Add form
  const [addForm, setAddForm] = useState({ firstName: '', lastName: '', email: '', password: '', role: 'student', department: 'Computer Science', phone: '', rollNumber: '' })
  const [addLoading, setAddLoading] = useState(false)
  const [addError, setAddError] = useState('')

  // Edit form
  const [editForm, setEditForm] = useState({})
  const [editLoading, setEditLoading] = useState(false)
  const [editError, setEditError] = useState('')

  useEffect(() => { fetchUsers() }, [])

  useEffect(() => {
    const handleClick = (e) => { if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpenId(null) }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const showToast = (type, text) => { setToast({ type, text }); setTimeout(() => setToast(null), 4000) }

  const fetchUsers = async () => {
    try {
      const res = await fetch(`${API}/users`, { headers: { Authorization: `Bearer ${TOKEN()}` } })
      if (!res.ok) throw new Error()
      const data = await res.json()
      setUsers(data.users || [])
    } catch { setUsers([]) }
    finally { setLoading(false) }
  }

  /* ── Register User ── */
  const handleAddUser = async (e) => {
    e.preventDefault()
    setAddError('')
    if (!addForm.firstName || !addForm.lastName || !addForm.email || !addForm.password) {
      setAddError('First name, last name, email, and password are required'); return
    }
    if (addForm.password.length < 6) { setAddError('Password must be at least 6 characters'); return }
    setAddLoading(true)
    try {
      const res = await fetch(`${API}/auth/register`, { method: 'POST', headers: HEADERS(), body: JSON.stringify(addForm) })
      const data = await res.json()
      if (!res.ok) { setAddError(data.error || 'Registration failed'); return }
      setUsers(prev => [data.user, ...prev])
      setShowAddModal(false)
      setAddForm({ firstName: '', lastName: '', email: '', password: '', role: 'student', department: 'Computer Science', phone: '', rollNumber: '' })
      showToast('success', `${data.user.firstName} ${data.user.lastName} registered successfully`)
    } catch { setAddError('Server unreachable') }
    finally { setAddLoading(false) }
  }

  /* ── Edit User ── */
  const openEdit = (user) => {
    setEditUser(user)
    setEditForm({ firstName: user.firstName || '', lastName: user.lastName || '', email: user.email || '', department: user.department || '', role: user.role || 'student', phone: user.phone || '', isActive: user.isActive !== false })
    setEditError('')
    setShowEditModal(true)
    setMenuOpenId(null)
  }

  const handleEditUser = async (e) => {
    e.preventDefault()
    setEditError('')
    const uid = editUser._id || editUser.id
    setEditLoading(true)
    try {
      const res = await fetch(`${API}/users/${uid}`, { method: 'PUT', headers: HEADERS(), body: JSON.stringify(editForm) })
      const data = await res.json()
      if (!res.ok) { setEditError(data.error || 'Update failed'); return }
      setUsers(prev => prev.map(u => (u._id || u.id) === uid ? { ...u, ...data.user } : u))
      setShowEditModal(false)
      showToast('success', 'User updated successfully')
    } catch { setEditError('Server unreachable') }
    finally { setEditLoading(false) }
  }

  /* ── Deactivate User ── */
  const handleDelete = async (uid) => {
    try {
      const res = await fetch(`${API}/users/${uid}`, { method: 'DELETE', headers: { Authorization: `Bearer ${TOKEN()}` } })
      if (res.ok) {
        setUsers(prev => prev.map(u => (u._id || u.id) === uid ? { ...u, isActive: false } : u))
        showToast('success', 'User deactivated')
      } else { showToast('error', 'Failed to deactivate user') }
    } catch { showToast('error', 'Server unreachable') }
    setDeleteConfirm(null)
  }

  // Counts & filters
  const filtered = users.filter(u => {
    const q = search.toLowerCase()
    const matchSearch = !q || getName(u).toLowerCase().includes(q) || (u.email || '').toLowerCase().includes(q) || (u.department || '').toLowerCase().includes(q)
    const matchRole = roleFilter === 'all' || u.role === roleFilter
    return matchSearch && matchRole
  })
  const counts = { all: users.length, student: 0, teacher: 0, hod: 0, dean: 0, clerk: 0 }
  users.forEach(u => { if (counts[u.role] !== undefined) counts[u.role]++ })

  const roleTabs = [
    { key: 'all', label: 'All', count: counts.all },
    { key: 'student', label: 'Students', count: counts.student },
    { key: 'teacher', label: 'Faculty', count: counts.teacher },
    { key: 'hod', label: 'HOD', count: counts.hod },
    { key: 'dean', label: 'Dean', count: counts.dean },
    { key: 'clerk', label: 'Staff', count: counts.clerk },
  ]

  return (
    <div className="users-page">
      <div className="users-header">
        <div>
          <h1>User Management</h1>
          <p>Manage all university accounts — {users.length} users</p>
        </div>
        <button className="users-add-btn" onClick={() => { setAddError(''); setShowAddModal(true) }}>
          <Plus size={18} /><span>Register User</span>
        </button>
      </div>

      {/* Toast */}
      {toast && (
        <div style={{ padding: '10px 16px', borderRadius: '10px', marginBottom: '16px', fontSize: '13px', fontWeight: 600, background: toast.type === 'success' ? '#e8f5e9' : '#ffebee', color: toast.type === 'success' ? '#2e7d32' : '#c62828', border: `1px solid ${toast.type === 'success' ? '#a5d6a7' : '#ef9a9a'}`, display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Check size={16} /> {toast.text}
        </div>
      )}

      {/* Stats */}
      <div className="users-stats">
        {[
          { label: 'Total', value: users.length, color: '#5c6bc0' },
          { label: 'Students', value: counts.student, color: '#06b6d4' },
          { label: 'Faculty', value: counts.teacher + counts.hod + counts.dean, color: '#f59e0b' },
          { label: 'Staff', value: users.length - counts.student - counts.teacher - counts.hod - counts.dean, color: '#10b981' },
        ].map((s, i) => (
          <div key={i} className="users-stat-card" style={{ '--stat-color': s.color }}>
            <span className="users-stat-value">{s.value}</span>
            <span className="users-stat-label">{s.label}</span>
          </div>
        ))}
      </div>

      {/* Role Tabs */}
      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '16px' }}>
        {roleTabs.map(t => (
          <button key={t.key} onClick={() => setRoleFilter(t.key)} style={{
            padding: '6px 14px', borderRadius: '20px', fontSize: '12.5px', fontWeight: 600, cursor: 'pointer',
            border: roleFilter === t.key ? '1.5px solid var(--color-accent, #c9a96e)' : '1.5px solid var(--color-border, #e0e0e0)',
            background: roleFilter === t.key ? 'color-mix(in srgb, var(--color-accent, #c9a96e) 12%, transparent)' : 'transparent',
            color: roleFilter === t.key ? 'var(--color-accent, #c9a96e)' : 'var(--color-text-secondary, #888)',
          }}>{t.label} <span style={{ opacity: 0.5 }}>{t.count}</span></button>
        ))}
      </div>

      {/* Search */}
      <div className="users-toolbar">
        <div className="users-search">
          <Search size={18} />
          <input type="text" placeholder="Search by name, email, or department..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
      </div>

      {/* Table */}
      <div className="users-table-wrapper">
        {loading ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: '#888' }}>Loading users...</div>
        ) : filtered.length === 0 ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: '#888' }}>{search || roleFilter !== 'all' ? 'No users match your filters.' : 'No users registered yet. Click "Register User" to add one.'}</div>
        ) : (
          <table className="users-table">
            <thead><tr><th>User</th><th>Role</th><th>Department</th><th>Status</th><th>Joined</th><th></th></tr></thead>
            <tbody>
              {filtered.map((user, i) => {
                const uid = user._id || user.id
                const isActive = user.isActive !== false
                const RoleIcon = ROLE_ICONS[user.role] || Users
                return (
                  <tr key={uid || i} style={{ animationDelay: `${i * 0.03}s` }}>
                    <td>
                      <div className="users-cell-user">
                        <div className="users-avatar" style={{ background: ROLE_COLORS[user.role] || '#888' }}>{getInitials(user)}</div>
                        <div><div className="users-name">{getName(user)}</div><div className="users-email">{user.email}</div></div>
                      </div>
                    </td>
                    <td><span className="users-role-badge" style={{ '--role-color': ROLE_COLORS[user.role] }}><RoleIcon size={12} />{ROLE_LABELS[user.role] || user.role}</span></td>
                    <td className="users-dept">{user.department || '—'}</td>
                    <td><span className={`users-status ${isActive ? 'active' : 'inactive'}`}><span className="users-status-dot" />{isActive ? 'Active' : 'Inactive'}</span></td>
                    <td className="users-date">{user.createdAt ? new Date(user.createdAt).toLocaleDateString('en-PK', { year: 'numeric', month: 'short', day: 'numeric' }) : '—'}</td>
                    <td style={{ position: 'relative' }}>
                      <button className="users-action-btn" onClick={() => setMenuOpenId(menuOpenId === uid ? null : uid)}><MoreVertical size={16} /></button>
                      {menuOpenId === uid && (
                        <div ref={menuRef} style={{ position: 'absolute', right: 0, top: '100%', zIndex: 50, background: 'var(--color-bg-primary, #fff)', borderRadius: '10px', boxShadow: '0 8px 30px rgba(0,0,0,0.15)', border: '1px solid var(--color-border, #e0e0e0)', minWidth: '160px', padding: '6px', animation: 'fadeIn 0.15s ease' }}>
                          <button onClick={() => openEdit(user)} style={{ display: 'flex', alignItems: 'center', gap: '8px', width: '100%', padding: '8px 12px', border: 'none', background: 'none', cursor: 'pointer', borderRadius: '6px', fontSize: '13px', color: 'var(--color-text-primary, #333)' }}><Edit size={14} /> Edit User</button>
                          <button onClick={() => { setMenuOpenId(null); setDeleteConfirm(uid) }} style={{ display: 'flex', alignItems: 'center', gap: '8px', width: '100%', padding: '8px 12px', border: 'none', background: 'none', cursor: 'pointer', borderRadius: '6px', fontSize: '13px', color: '#ef4444' }}><Trash2 size={14} /> Deactivate</button>
                        </div>
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* ── ADD USER MODAL ── */}
      <Modal open={showAddModal} onClose={() => setShowAddModal(false)} title="Register New User">
        <form onSubmit={handleAddUser}>
          <div style={rowStyle}>
            <div style={fieldStyle}><label style={labelStyle}>First Name *</label><input style={inputStyle} value={addForm.firstName} onChange={e => setAddForm(p => ({ ...p, firstName: e.target.value }))} placeholder="e.g. Ahmad" /></div>
            <div style={fieldStyle}><label style={labelStyle}>Last Name *</label><input style={inputStyle} value={addForm.lastName} onChange={e => setAddForm(p => ({ ...p, lastName: e.target.value }))} placeholder="e.g. Khan" /></div>
          </div>
          <div style={fieldStyle}><label style={labelStyle}>Email *</label><input type="email" style={inputStyle} value={addForm.email} onChange={e => setAddForm(p => ({ ...p, email: e.target.value }))} placeholder="e.g. ahmad.khan@pu.edu.pk" /></div>
          <div style={fieldStyle}><label style={labelStyle}>Password *</label><input type="password" style={inputStyle} value={addForm.password} onChange={e => setAddForm(p => ({ ...p, password: e.target.value }))} placeholder="Min 6 characters" /></div>
          <div style={rowStyle}>
            <div style={fieldStyle}><label style={labelStyle}>Role</label><select style={inputStyle} value={addForm.role} onChange={e => setAddForm(p => ({ ...p, role: e.target.value }))}>{ROLES_LIST.map(r => <option key={r} value={r}>{ROLE_LABELS[r]}</option>)}</select></div>
            <div style={fieldStyle}><label style={labelStyle}>Department</label><select style={inputStyle} value={addForm.department} onChange={e => setAddForm(p => ({ ...p, department: e.target.value }))}>{DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}</select></div>
          </div>
          <div style={rowStyle}>
            <div style={fieldStyle}><label style={labelStyle}>Phone</label><input style={inputStyle} value={addForm.phone} onChange={e => setAddForm(p => ({ ...p, phone: e.target.value }))} placeholder="03XX-XXXXXXX" /></div>
            <div style={fieldStyle}><label style={labelStyle}>Roll Number</label><input style={inputStyle} value={addForm.rollNumber} onChange={e => setAddForm(p => ({ ...p, rollNumber: e.target.value }))} placeholder="CS-2026-001" /></div>
          </div>
          {addError && <div style={{ padding: '8px 14px', borderRadius: '8px', marginBottom: '14px', fontSize: '12.5px', background: '#ffebee', color: '#c62828', border: '1px solid #ffcdd2' }}>{addError}</div>}
          <button type="submit" disabled={addLoading} style={{ ...btnPrimary, opacity: addLoading ? 0.7 : 1 }}>
            <UserPlus size={16} /> {addLoading ? 'Registering...' : 'Register User'}
          </button>
        </form>
      </Modal>

      {/* ── EDIT USER MODAL ── */}
      <Modal open={showEditModal} onClose={() => setShowEditModal(false)} title={`Edit — ${editUser ? getName(editUser) : ''}`}>
        <form onSubmit={handleEditUser}>
          <div style={rowStyle}>
            <div style={fieldStyle}><label style={labelStyle}>First Name</label><input style={inputStyle} value={editForm.firstName || ''} onChange={e => setEditForm(p => ({ ...p, firstName: e.target.value }))} /></div>
            <div style={fieldStyle}><label style={labelStyle}>Last Name</label><input style={inputStyle} value={editForm.lastName || ''} onChange={e => setEditForm(p => ({ ...p, lastName: e.target.value }))} /></div>
          </div>
          <div style={fieldStyle}><label style={labelStyle}>Email</label><input type="email" style={inputStyle} value={editForm.email || ''} onChange={e => setEditForm(p => ({ ...p, email: e.target.value }))} /></div>
          <div style={rowStyle}>
            <div style={fieldStyle}><label style={labelStyle}>Role</label><select style={inputStyle} value={editForm.role || ''} onChange={e => setEditForm(p => ({ ...p, role: e.target.value }))}>{ROLES_LIST.map(r => <option key={r} value={r}>{ROLE_LABELS[r]}</option>)}</select></div>
            <div style={fieldStyle}><label style={labelStyle}>Department</label><select style={inputStyle} value={editForm.department || ''} onChange={e => setEditForm(p => ({ ...p, department: e.target.value }))}>{DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}</select></div>
          </div>
          <div style={fieldStyle}><label style={labelStyle}>Phone</label><input style={inputStyle} value={editForm.phone || ''} onChange={e => setEditForm(p => ({ ...p, phone: e.target.value }))} /></div>
          <div style={{ ...fieldStyle, display: 'flex', alignItems: 'center', gap: '10px' }}>
            <label style={{ ...labelStyle, margin: 0 }}>Active</label>
            <input type="checkbox" checked={editForm.isActive !== false} onChange={e => setEditForm(p => ({ ...p, isActive: e.target.checked }))} />
          </div>
          {editError && <div style={{ padding: '8px 14px', borderRadius: '8px', marginBottom: '14px', fontSize: '12.5px', background: '#ffebee', color: '#c62828', border: '1px solid #ffcdd2' }}>{editError}</div>}
          <button type="submit" disabled={editLoading} style={{ ...btnPrimary, opacity: editLoading ? 0.7 : 1 }}>
            <Check size={16} /> {editLoading ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      </Modal>

      {/* ── DELETE CONFIRM ── */}
      <Modal open={!!deleteConfirm} onClose={() => setDeleteConfirm(null)} title="Confirm Deactivation">
        <p style={{ margin: '0 0 20px', fontSize: '13.5px', color: 'var(--color-text-secondary, #888)', lineHeight: 1.6 }}>
          This will deactivate the user account. They will no longer be able to log in. This action can be reversed by editing the user.
        </p>
        <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
          <button onClick={() => setDeleteConfirm(null)} style={{ padding: '9px 18px', borderRadius: '10px', border: '1px solid var(--color-border, #e0e0e0)', background: 'none', cursor: 'pointer', fontSize: '13px', color: 'var(--color-text-primary, #333)' }}>Cancel</button>
          <button onClick={() => handleDelete(deleteConfirm)} style={{ padding: '9px 18px', borderRadius: '10px', border: 'none', background: '#ef4444', color: '#fff', cursor: 'pointer', fontSize: '13px', fontWeight: 600 }}>Deactivate</button>
        </div>
      </Modal>
    </div>
  )
}
