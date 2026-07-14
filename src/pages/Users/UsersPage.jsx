import { useState, useEffect } from 'react'
import { Users, Plus, Search, Filter, MoreVertical, Shield, GraduationCap, BookOpen } from 'lucide-react'
import './UsersPage.css'

const MOCK_USERS = [
  { id: 1, name: 'Dr. Ahmad Khan', email: 'ahmad.khan@pu.edu.pk', role: 'teacher', department: 'Computer Science', status: 'active', joined: '2024-03-15' },
  { id: 2, name: 'Fatima Zahra', email: 'fatima.zahra@pu.edu.pk', role: 'student', department: 'Computer Science', status: 'active', joined: '2025-09-01' },
  { id: 3, name: 'Prof. Hassan Raza', email: 'hassan.raza@pu.edu.pk', role: 'hod', department: 'Computer Science', status: 'active', joined: '2020-01-10' },
  { id: 4, name: 'Ayesha Malik', email: 'ayesha.malik@pu.edu.pk', role: 'clerk', department: 'Administration', status: 'active', joined: '2023-06-20' },
  { id: 5, name: 'Dr. Usman Tariq', email: 'usman.tariq@pu.edu.pk', role: 'dean', department: 'Faculty of Sciences', status: 'active', joined: '2019-08-01' },
  { id: 6, name: 'Ali Hassan', email: 'ali.hassan@pu.edu.pk', role: 'student', department: 'Mathematics', status: 'inactive', joined: '2024-09-01' },
  { id: 7, name: 'Dr. Saima Noor', email: 'saima.noor@pu.edu.pk', role: 'teacher', department: 'Computer Science', status: 'active', joined: '2022-02-15' },
  { id: 8, name: 'Muhammad Bilal', email: 'm.bilal@pu.edu.pk', role: 'student', department: 'Electrical Engineering', status: 'active', joined: '2025-09-01' },
]

const ROLE_ICONS = { admin: Shield, teacher: BookOpen, student: GraduationCap, hod: Users, dean: Users, clerk: Users }
const ROLE_COLORS = { admin: '#ef4444', teacher: '#f59e0b', student: '#06b6d4', hod: '#10b981', dean: '#8b5cf6', clerk: '#6b7280' }

export default function UsersPage() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem('pu-lms-token')
        const res = await fetch('http://localhost:5000/api/users', {
          headers: { Authorization: `Bearer ${token}` },
        })
        if (!res.ok) throw new Error('Failed to fetch users')
        const data = await res.json()
        setUsers(Array.isArray(data) ? data : data.users || MOCK_USERS)
      } catch (err) {
        console.error('Error fetching users, using mock data:', err)
        setUsers(MOCK_USERS)
      } finally {
        setLoading(false)
      }
    }
    fetchUsers()
  }, [])

  const filteredUsers = users.filter(user => {
    const q = search.toLowerCase()
    return (
      (user.name || '').toLowerCase().includes(q) ||
      (user.email || '').toLowerCase().includes(q) ||
      (user.department || '').toLowerCase().includes(q)
    )
  })

  const totalUsers = users.length
  const studentCount = users.filter(u => u.role === 'student').length
  const facultyCount = users.filter(u => ['teacher', 'hod', 'dean'].includes(u.role)).length
  const staffCount = users.filter(u => ['clerk', 'admin'].includes(u.role)).length

  return (
    <div className="users-page">
      <div className="users-header">
        <div>
          <h1>User Management</h1>
          <p>Manage all university accounts and permissions</p>
        </div>
        <button className="users-add-btn" onClick={() => alert('User creation form coming soon')}>
          <Plus size={18} />
          <span>Add User</span>
        </button>
      </div>

      <div className="users-stats">
        {[
          { label: 'Total Users', value: totalUsers.toLocaleString(), color: 'var(--color-primary)' },
          { label: 'Students', value: studentCount.toLocaleString(), color: '#06b6d4' },
          { label: 'Faculty', value: facultyCount.toLocaleString(), color: '#f59e0b' },
          { label: 'Staff', value: staffCount.toLocaleString(), color: '#10b981' },
        ].map((stat, i) => (
          <div key={i} className="users-stat-card" style={{ '--stat-color': stat.color, animationDelay: `${i * 0.1}s` }}>
            <span className="users-stat-value">{stat.value}</span>
            <span className="users-stat-label">{stat.label}</span>
          </div>
        ))}
      </div>

      <div className="users-toolbar">
        <div className="users-search">
          <Search size={18} />
          <input type="text" placeholder="Search users..." value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <button className="users-filter-btn">
          <Filter size={16} />
          <span>Filter</span>
        </button>
      </div>

      <div className="users-table-wrapper">
        {loading ? (
          <div style={{ padding: '2rem', textAlign: 'center', color: '#888' }}>Loading users...</div>
        ) : (
          <table className="users-table">
            <thead>
              <tr>
                <th>
                  <input type="checkbox" />
                </th>
                <th>User</th>
                <th>Role</th>
                <th>Department</th>
                <th>Status</th>
                <th>Joined</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ textAlign: 'center', padding: '2rem', color: '#888' }}>
                    {search ? 'No users match your search.' : 'No users found.'}
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user, index) => {
                  const RoleIcon = ROLE_ICONS[user.role] || Users
                  return (
                    <tr key={user.id} style={{ animationDelay: `${index * 0.05}s` }}>
                      <td><input type="checkbox" /></td>
                      <td>
                        <div className="users-cell-user">
                          <div className="users-avatar" style={{ background: ROLE_COLORS[user.role] }}>
                            {user.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                          </div>
                          <div>
                            <div className="users-name">{user.name}</div>
                            <div className="users-email">{user.email}</div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className="users-role-badge" style={{ '--role-color': ROLE_COLORS[user.role] }}>
                          <RoleIcon size={12} />
                          {user.role}
                        </span>
                      </td>
                      <td className="users-dept">{user.department}</td>
                      <td>
                        <span className={`users-status ${user.status}`}>
                          <span className="users-status-dot" />
                          {user.status}
                        </span>
                      </td>
                      <td className="users-date">{new Date(user.joined).toLocaleDateString('en-PK', { year: 'numeric', month: 'short', day: 'numeric' })}</td>
                      <td>
                        <button className="users-action-btn">
                          <MoreVertical size={16} />
                        </button>
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
  )
}
