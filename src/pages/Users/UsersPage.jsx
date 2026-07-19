import { useState, useEffect, useRef } from 'react'
import { Users, Plus, Search, MoreVertical, Shield, GraduationCap, BookOpen, Edit, Trash2, X, Building2, UserPlus, Check, ChevronDown, ChevronRight } from 'lucide-react'
import './UsersPage.css'

const API = 'http://localhost:5000/api'
const TOKEN = () => localStorage.getItem('pu-lms-token')
const HEADERS = () => ({ 'Content-Type': 'application/json', Authorization: `Bearer ${TOKEN()}` })

const ROLE_ICONS = { admin: Shield, teacher: BookOpen, student: GraduationCap, hod: Building2, dean: Building2, clerk: Users, vc: Shield, registrar: Users, treasurer: Users, controller: Users }
const ROLE_COLORS = { admin: '#ef4444', teacher: '#f59e0b', student: '#06b6d4', hod: '#10b981', dean: '#8b5cf6', clerk: '#6b7280', vc: '#c9a96e', registrar: '#ec4899', treasurer: '#f97316', controller: '#14b8a6' }
const ROLE_LABELS = { admin: 'Admin', teacher: 'Teacher', student: 'Student', hod: 'HOD', dean: 'Dean', clerk: 'Clerk', vc: 'Vice Chancellor', registrar: 'Registrar', treasurer: 'Treasurer', controller: 'Controller' }
const ROLES_LIST = ['student', 'teacher', 'hod', 'dean', 'clerk', 'registrar', 'treasurer', 'controller', 'admin', 'vc']
const DEPARTMENTS = ['Computer Science', 'Electrical Engineering', 'Mathematics', 'Physics', 'Chemistry', 'Business Administration', 'Economics', 'English', 'Law', 'Medicine', 'Administration', 'General']
const ROLE_ORDER = ['vc', 'admin', 'dean', 'hod', 'registrar', 'controller', 'treasurer', 'teacher', 'clerk', 'student']

function getName(u) { return u.name || `${u.firstName || ''} ${u.lastName || ''}`.trim() || 'Unknown' }
function getInitials(u) { return getName(u).split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase() }

/* ── Reusable Modal ── */
function Modal({ open, onClose, title, children }) {
  if (!open) return null
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }} onClick={onClose}>
      <div style={{ background: 'var(--color-bg-primary, #fff)', borderRadius: '16px', maxWidth: '520px', width: '94%', boxShadow: '0 20px 60px rgba(0,0,0,0.25)', maxHeight: '90vh', overflow: 'auto', animation: 'fadeIn 0.2s ease' }} onClick={e => e.stopPropagation()}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 24px', borderBottom: '1px solid var(--color-border, #e5e5e5)' }}>
          <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 700, color: 'var(--color-text-primary, #1a1a2e)' }}>{title}</h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-tertiary, #999)', padding: '4px' }}><X size={20} /></button>
        </div>
        <div style={{ padding: '20px 24px' }}>{children}</div>
      </div>
    </div>
  )
}

const iS = { width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1.5px solid var(--color-border, #e0e0e0)', background: 'var(--color-bg-secondary, #f8f8f8)', fontSize: '13.5px', color: 'var(--color-text-primary, #333)', outline: 'none', transition: 'border 0.2s', boxSizing: 'border-box' }
const lS = { display: 'block', fontSize: '12.5px', fontWeight: 600, color: 'var(--color-text-secondary, #666)', marginBottom: '6px' }
const rS = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }
const fS = { marginBottom: '16px' }
const bP = { padding: '10px 20px', borderRadius: '10px', border: 'none', background: 'var(--color-accent, #c9a96e)', color: '#fff', cursor: 'pointer', fontSize: '13.5px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px', width: '100%', justifyContent: 'center' }

export default function UsersPage() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [menuOpenId, setMenuOpenId] = useState(null)
  const [toast, setToast] = useState(null)
  const [expandedRoles, setExpandedRoles] = useState({})
  const [expandedDepts, setExpandedDepts] = useState({})
  const menuRef = useRef(null)

  // Modals
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [editUser, setEditUser] = useState(null)
  const [deleteConfirm, setDeleteConfirm] = useState(null)

  // Add form
  const [addForm, setAddForm] = useState({ firstName: '', lastName: '', email: '', password: '', role: 'student', department: 'Computer Science', phone: '', rollNumber: '', semester: '', program: '' })
  const [addLoading, setAddLoading] = useState(false)
  const [addError, setAddError] = useState('')

  // Edit form
  const [editForm, setEditForm] = useState({})
  const [editLoading, setEditLoading] = useState(false)
  const [editError, setEditError] = useState('')

  useEffect(() => { fetchUsers() }, [])
  useEffect(() => {
    const h = (e) => { if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpenId(null) }
    document.addEventListener('mousedown', h); return () => document.removeEventListener('mousedown', h)
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

  const handleAddUser = async (e) => {
    e.preventDefault(); setAddError('')
    if (!addForm.firstName || !addForm.lastName || !addForm.email || !addForm.password) { setAddError('First name, last name, email, and password are required'); return }
    if (addForm.password.length < 6) { setAddError('Password must be at least 6 characters'); return }
    setAddLoading(true)
    try {
      const res = await fetch(`${API}/auth/register`, { method: 'POST', headers: HEADERS(), body: JSON.stringify(addForm) })
      const data = await res.json()
      if (!res.ok) { setAddError(data.error || 'Registration failed'); return }
      setUsers(prev => [data.user, ...prev])
      setShowAddModal(false)
      setAddForm({ firstName: '', lastName: '', email: '', password: '', role: 'student', department: 'Computer Science', phone: '', rollNumber: '', semester: '', program: '' })
      showToast('success', `${data.user.firstName} ${data.user.lastName} registered successfully`)
    } catch { setAddError('Server unreachable') }
    finally { setAddLoading(false) }
  }

  const openEdit = (u) => {
    setEditUser(u)
    setEditForm({ firstName: u.firstName || '', lastName: u.lastName || '', email: u.email || '', department: u.department || '', role: u.role || 'student', phone: u.phone || '', isActive: u.isActive !== false })
    setEditError(''); setShowEditModal(true); setMenuOpenId(null)
  }

  const handleEditUser = async (e) => {
    e.preventDefault(); setEditError('')
    const uid = editUser._id || editUser.id; setEditLoading(true)
    try {
      const res = await fetch(`${API}/users/${uid}`, { method: 'PUT', headers: HEADERS(), body: JSON.stringify(editForm) })
      const data = await res.json()
      if (!res.ok) { setEditError(data.error || 'Update failed'); return }
      setUsers(prev => prev.map(u => (u._id || u.id) === uid ? { ...u, ...data.user } : u))
      setShowEditModal(false); showToast('success', 'User updated successfully')
    } catch { setEditError('Server unreachable') }
    finally { setEditLoading(false) }
  }

  const handleDelete = async (uid) => {
    try {
      const res = await fetch(`${API}/users/${uid}`, { method: 'DELETE', headers: { Authorization: `Bearer ${TOKEN()}` } })
      if (res.ok) { setUsers(prev => prev.map(u => (u._id || u.id) === uid ? { ...u, isActive: false } : u)); showToast('success', 'User deactivated') }
      else { showToast('error', 'Failed to deactivate user') }
    } catch { showToast('error', 'Server unreachable') }
    setDeleteConfirm(null)
  }

  // Filter by search
  const filtered = users.filter(u => {
    const q = search.toLowerCase()
    return !q || getName(u).toLowerCase().includes(q) || (u.email || '').toLowerCase().includes(q) || (u.department || '').toLowerCase().includes(q)
  })

  // Group by role → department
  const grouped = {}
  filtered.forEach(u => {
    const r = u.role || 'student'
    if (!grouped[r]) grouped[r] = {}
    const dept = u.department || 'Unassigned'
    if (!grouped[r][dept]) grouped[r][dept] = []
    grouped[r][dept].push(u)
  })

  // Sort roles by defined order
  const sortedRoles = ROLE_ORDER.filter(r => grouped[r])

  const toggleRole = (r) => setExpandedRoles(prev => ({ ...prev, [r]: !prev[r] }))
  const toggleDept = (key) => setExpandedDepts(prev => ({ ...prev, [key]: !prev[key] }))

  // Counts
  const roleCounts = {}
  users.forEach(u => { roleCounts[u.role] = (roleCounts[u.role] || 0) + 1 })

  return (
    <div className="users-page">
      <div className="users-header">
        <div>
          <h1>User Management</h1>
          <p>Manage all university accounts — {users.length} users across {Object.keys(roleCounts).length} roles</p>
        </div>
        <button className="users-add-btn" onClick={() => { setAddError(''); setShowAddModal(true) }}>
          <Plus size={18} /><span>Register User</span>
        </button>
      </div>

      {toast && (
        <div style={{ padding: '10px 16px', borderRadius: '10px', marginBottom: '16px', fontSize: '13px', fontWeight: 600, background: toast.type === 'success' ? '#e8f5e9' : '#ffebee', color: toast.type === 'success' ? '#2e7d32' : '#c62828', border: `1px solid ${toast.type === 'success' ? '#a5d6a7' : '#ef9a9a'}`, display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Check size={16} /> {toast.text}
        </div>
      )}

      {/* Stats */}
      <div className="users-stats">
        {[
          { label: 'Total', value: users.length, color: '#5c6bc0' },
          { label: 'Students', value: roleCounts.student || 0, color: '#06b6d4' },
          { label: 'Faculty', value: (roleCounts.teacher || 0) + (roleCounts.hod || 0) + (roleCounts.dean || 0), color: '#f59e0b' },
          { label: 'Staff', value: users.length - (roleCounts.student || 0) - (roleCounts.teacher || 0) - (roleCounts.hod || 0) - (roleCounts.dean || 0), color: '#10b981' },
        ].map((s, i) => (
          <div key={i} className="users-stat-card" style={{ '--stat-color': s.color }}>
            <span className="users-stat-value">{s.value}</span>
            <span className="users-stat-label">{s.label}</span>
          </div>
        ))}
      </div>

      {/* Search */}
      <div className="users-toolbar">
        <div className="users-search">
          <Search size={18} />
          <input type="text" placeholder="Search by name, email, or department..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
      </div>

      {/* ── GROUPED VIEW: Role → Department → Users ── */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {loading ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: '#888' }}>Loading users...</div>
        ) : sortedRoles.length === 0 ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: '#888' }}>{search ? 'No users match your search.' : 'No users registered yet.'}</div>
        ) : (
          sortedRoles.map(role => {
            const depts = grouped[role]
            const sortedDepts = Object.keys(depts).sort()
            const roleCount = Object.values(depts).reduce((a, b) => a + b.length, 0)
            const isRoleOpen = expandedRoles[role] !== false // open by default
            const RoleIcon = ROLE_ICONS[role] || Users

            return (
              <div key={role} style={{ borderRadius: '14px', border: '1px solid var(--color-border, #e5e5e5)', overflow: 'hidden' }}>
                {/* Role Header */}
                <div
                  onClick={() => toggleRole(role)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '12px', padding: '14px 20px', cursor: 'pointer',
                    background: `color-mix(in srgb, ${ROLE_COLORS[role]} 6%, var(--color-bg-primary, #fff))`,
                    borderBottom: isRoleOpen ? '1px solid var(--color-border, #e5e5e5)' : 'none',
                    transition: 'background 0.2s',
                  }}
                >
                  {isRoleOpen ? <ChevronDown size={18} style={{ color: ROLE_COLORS[role] }} /> : <ChevronRight size={18} style={{ color: '#999' }} />}
                  <div style={{ width: 34, height: 34, borderRadius: '10px', background: `${ROLE_COLORS[role]}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: ROLE_COLORS[role] }}>
                    <RoleIcon size={18} />
                  </div>
                  <span style={{ flex: 1, fontWeight: 700, fontSize: '14.5px', color: 'var(--color-text-primary, #1a1a2e)' }}>
                    {ROLE_LABELS[role] || role}
                  </span>
                  <span style={{ fontSize: '12px', fontWeight: 600, padding: '3px 12px', borderRadius: '12px', background: `${ROLE_COLORS[role]}18`, color: ROLE_COLORS[role] }}>
                    {roleCount} user{roleCount !== 1 ? 's' : ''}
                  </span>
                </div>

                {/* Departments inside this role */}
                {isRoleOpen && (
                  <div style={{ padding: '4px 8px 8px' }}>
                    {sortedDepts.map(dept => {
                      const deptUsers = depts[dept]
                      const deptKey = `${role}-${dept}`
                      const isDeptOpen = expandedDepts[deptKey] !== false

                      return (
                        <div key={deptKey} style={{ marginTop: '4px' }}>
                          {/* Department Header */}
                          <div
                            onClick={() => toggleDept(deptKey)}
                            style={{
                              display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 14px', borderRadius: '10px',
                              cursor: 'pointer', transition: 'background 0.15s',
                              background: isDeptOpen ? 'var(--color-bg-secondary, #f8f8f8)' : 'transparent',
                            }}
                          >
                            {isDeptOpen ? <ChevronDown size={14} style={{ color: '#999' }} /> : <ChevronRight size={14} style={{ color: '#ccc' }} />}
                            <Building2 size={14} style={{ color: 'var(--color-accent, #c9a96e)' }} />
                            <span style={{ flex: 1, fontSize: '13px', fontWeight: 600, color: 'var(--color-text-secondary, #555)' }}>{dept}</span>
                            <span style={{ fontSize: '11.5px', color: '#999', fontWeight: 500 }}>{deptUsers.length}</span>
                          </div>

                          {/* Users Table */}
                          {isDeptOpen && (
                            <div style={{ paddingLeft: '12px', paddingRight: '4px' }}>
                              <table className="users-table" style={{ marginTop: '4px' }}>
                                <thead><tr><th>User</th><th>Email</th><th>Status</th><th>Joined</th><th></th></tr></thead>
                                <tbody>
                                  {deptUsers.map((user, i) => {
                                    const uid = user._id || user.id
                                    const isActive = user.isActive !== false
                                    return (
                                      <tr key={uid || i}>
                                        <td>
                                          <div className="users-cell-user">
                                            <div className="users-avatar" style={{ background: ROLE_COLORS[user.role] || '#888', width: 32, height: 32, fontSize: '11px' }}>{getInitials(user)}</div>
                                            <div><div className="users-name" style={{ fontSize: '13px' }}>{getName(user)}</div></div>
                                          </div>
                                        </td>
                                        <td style={{ fontSize: '12.5px', color: 'var(--color-text-secondary, #888)' }}>{user.email}</td>
                                        <td><span className={`users-status ${isActive ? 'active' : 'inactive'}`}><span className="users-status-dot" />{isActive ? 'Active' : 'Inactive'}</span></td>
                                        <td className="users-date" style={{ fontSize: '12px' }}>{user.createdAt ? new Date(user.createdAt).toLocaleDateString('en-PK', { year: 'numeric', month: 'short' }) : '—'}</td>
                                        <td style={{ position: 'relative' }}>
                                          <button className="users-action-btn" onClick={(e) => { e.stopPropagation(); setMenuOpenId(menuOpenId === uid ? null : uid) }}><MoreVertical size={14} /></button>
                                          {menuOpenId === uid && (
                                            <div ref={menuRef} style={{ position: 'absolute', right: 0, top: '100%', zIndex: 50, background: 'var(--color-bg-primary, #fff)', borderRadius: '10px', boxShadow: '0 8px 30px rgba(0,0,0,0.15)', border: '1px solid var(--color-border, #e0e0e0)', minWidth: '150px', padding: '5px' }}>
                                              <button onClick={() => openEdit(user)} style={{ display: 'flex', alignItems: 'center', gap: '8px', width: '100%', padding: '8px 12px', border: 'none', background: 'none', cursor: 'pointer', borderRadius: '6px', fontSize: '12.5px', color: 'var(--color-text-primary, #333)' }}><Edit size={13} /> Edit</button>
                                              <button onClick={() => { setMenuOpenId(null); setDeleteConfirm(uid) }} style={{ display: 'flex', alignItems: 'center', gap: '8px', width: '100%', padding: '8px 12px', border: 'none', background: 'none', cursor: 'pointer', borderRadius: '6px', fontSize: '12.5px', color: '#ef4444' }}><Trash2 size={13} /> Deactivate</button>
                                            </div>
                                          )}
                                        </td>
                                      </tr>
                                    )
                                  })}
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
            )
          })
        )}
      </div>

      {/* ── ADD USER MODAL ── */}
      <Modal open={showAddModal} onClose={() => setShowAddModal(false)} title="Register New User">
        <form onSubmit={handleAddUser}>
          <div style={rS}>
            <div style={fS}><label style={lS}>First Name *</label><input style={iS} value={addForm.firstName} onChange={e => setAddForm(p => ({ ...p, firstName: e.target.value }))} placeholder="e.g. Ahmad" /></div>
            <div style={fS}><label style={lS}>Last Name *</label><input style={iS} value={addForm.lastName} onChange={e => setAddForm(p => ({ ...p, lastName: e.target.value }))} placeholder="e.g. Khan" /></div>
          </div>
          <div style={fS}><label style={lS}>Email *</label><input type="email" style={iS} value={addForm.email} onChange={e => setAddForm(p => ({ ...p, email: e.target.value }))} placeholder="e.g. ahmad.khan@pu.edu.pk" /></div>
          <div style={fS}><label style={lS}>Password *</label><input type="password" style={iS} value={addForm.password} onChange={e => setAddForm(p => ({ ...p, password: e.target.value }))} placeholder="Min 6 characters" /></div>
          <div style={rS}>
            <div style={fS}><label style={lS}>Role</label><select style={iS} value={addForm.role} onChange={e => setAddForm(p => ({ ...p, role: e.target.value }))}>{ROLES_LIST.map(r => <option key={r} value={r}>{ROLE_LABELS[r]}</option>)}</select></div>
            <div style={fS}><label style={lS}>Department</label><select style={iS} value={addForm.department} onChange={e => setAddForm(p => ({ ...p, department: e.target.value }))}>{DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}</select></div>
          </div>
          <div style={rS}>
            <div style={fS}><label style={lS}>Phone</label><input style={iS} value={addForm.phone} onChange={e => setAddForm(p => ({ ...p, phone: e.target.value }))} placeholder="03XX-XXXXXXX" /></div>
            <div style={fS}><label style={lS}>Roll Number</label><input style={iS} value={addForm.rollNumber} onChange={e => setAddForm(p => ({ ...p, rollNumber: e.target.value }))} placeholder="CS-2026-001" /></div>
          </div>
          {addForm.role === 'student' && (
            <div style={rS}>
              <div style={fS}><label style={lS}>Semester</label><input type="number" min="1" max="8" style={iS} value={addForm.semester} onChange={e => setAddForm(p => ({ ...p, semester: e.target.value }))} placeholder="1-8" /></div>
              <div style={fS}><label style={lS}>Program</label><input style={iS} value={addForm.program} onChange={e => setAddForm(p => ({ ...p, program: e.target.value }))} placeholder="e.g. BSCS" /></div>
            </div>
          )}
          {addError && <div style={{ padding: '8px 14px', borderRadius: '8px', marginBottom: '14px', fontSize: '12.5px', background: '#ffebee', color: '#c62828', border: '1px solid #ffcdd2' }}>{addError}</div>}
          <button type="submit" disabled={addLoading} style={{ ...bP, opacity: addLoading ? 0.7 : 1 }}><UserPlus size={16} /> {addLoading ? 'Registering...' : 'Register User'}</button>
        </form>
      </Modal>

      {/* ── EDIT USER MODAL ── */}
      <Modal open={showEditModal} onClose={() => setShowEditModal(false)} title={`Edit — ${editUser ? getName(editUser) : ''}`}>
        <form onSubmit={handleEditUser}>
          <div style={rS}>
            <div style={fS}><label style={lS}>First Name</label><input style={iS} value={editForm.firstName || ''} onChange={e => setEditForm(p => ({ ...p, firstName: e.target.value }))} /></div>
            <div style={fS}><label style={lS}>Last Name</label><input style={iS} value={editForm.lastName || ''} onChange={e => setEditForm(p => ({ ...p, lastName: e.target.value }))} /></div>
          </div>
          <div style={fS}><label style={lS}>Email</label><input type="email" style={iS} value={editForm.email || ''} onChange={e => setEditForm(p => ({ ...p, email: e.target.value }))} /></div>
          <div style={rS}>
            <div style={fS}><label style={lS}>Role</label><select style={iS} value={editForm.role || ''} onChange={e => setEditForm(p => ({ ...p, role: e.target.value }))}>{ROLES_LIST.map(r => <option key={r} value={r}>{ROLE_LABELS[r]}</option>)}</select></div>
            <div style={fS}><label style={lS}>Department</label><select style={iS} value={editForm.department || ''} onChange={e => setEditForm(p => ({ ...p, department: e.target.value }))}>{DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}</select></div>
          </div>
          <div style={fS}><label style={lS}>Phone</label><input style={iS} value={editForm.phone || ''} onChange={e => setEditForm(p => ({ ...p, phone: e.target.value }))} /></div>
          <div style={{ ...fS, display: 'flex', alignItems: 'center', gap: '10px' }}>
            <label style={{ ...lS, margin: 0 }}>Active</label>
            <input type="checkbox" checked={editForm.isActive !== false} onChange={e => setEditForm(p => ({ ...p, isActive: e.target.checked }))} />
          </div>
          {editError && <div style={{ padding: '8px 14px', borderRadius: '8px', marginBottom: '14px', fontSize: '12.5px', background: '#ffebee', color: '#c62828', border: '1px solid #ffcdd2' }}>{editError}</div>}
          <button type="submit" disabled={editLoading} style={{ ...bP, opacity: editLoading ? 0.7 : 1 }}><Check size={16} /> {editLoading ? 'Saving...' : 'Save Changes'}</button>
        </form>
      </Modal>

      {/* ── DELETE CONFIRM ── */}
      <Modal open={!!deleteConfirm} onClose={() => setDeleteConfirm(null)} title="Confirm Deactivation">
        <p style={{ margin: '0 0 20px', fontSize: '13.5px', color: 'var(--color-text-secondary, #888)', lineHeight: 1.6 }}>This will deactivate the user. They won't be able to log in. This can be reversed by editing the user.</p>
        <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
          <button onClick={() => setDeleteConfirm(null)} style={{ padding: '9px 18px', borderRadius: '10px', border: '1px solid var(--color-border, #e0e0e0)', background: 'none', cursor: 'pointer', fontSize: '13px' }}>Cancel</button>
          <button onClick={() => handleDelete(deleteConfirm)} style={{ padding: '9px 18px', borderRadius: '10px', border: 'none', background: '#ef4444', color: '#fff', cursor: 'pointer', fontSize: '13px', fontWeight: 600 }}>Deactivate</button>
        </div>
      </Modal>
    </div>
  )
}
