import { useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { useTheme } from '../../contexts/ThemeContext'
import { Sun, Moon, Monitor, Globe, Bell, Shield, Key, Palette, Save, Check } from 'lucide-react'
import './SettingsPage.css'

export default function SettingsPage() {
  const { user } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const [activeTab, setActiveTab] = useState('appearance')

  // Appearance state
  const [fontSize, setFontSize] = useState('14')
  const [compactSidebar, setCompactSidebar] = useState(false)
  const [animations, setAnimations] = useState(true)

  // Notification state
  const [notifPrefs, setNotifPrefs] = useState({
    assignments: true, announcements: true, fees: true,
    messages: true, ai: false, system: false,
  })

  // Security state
  const [twoFactor, setTwoFactor] = useState(false)
  const [currentPwd, setCurrentPwd] = useState('')
  const [newPwd, setNewPwd] = useState('')
  const [confirmPwd, setConfirmPwd] = useState('')
  const [pwdMsg, setPwdMsg] = useState(null)
  const [pwdLoading, setPwdLoading] = useState(false)

  // Language state
  const [language, setLanguage] = useState('en')
  const [timezone, setTimezone] = useState('Asia/Karachi')
  const [dateFormat, setDateFormat] = useState('DD/MM/YYYY')

  // Saved state feedback
  const [savedTab, setSavedTab] = useState(null)

  const handleSavePrefs = (tabName) => {
    setSavedTab(tabName)
    setTimeout(() => setSavedTab(null), 2500)
  }

  const handleUpdatePassword = async () => {
    setPwdMsg(null)
    if (!currentPwd || !newPwd || !confirmPwd) {
      setPwdMsg({ type: 'error', text: 'Please fill in all password fields' })
      return
    }
    if (newPwd.length < 6) {
      setPwdMsg({ type: 'error', text: 'New password must be at least 6 characters' })
      return
    }
    if (newPwd !== confirmPwd) {
      setPwdMsg({ type: 'error', text: 'New password and confirmation do not match' })
      return
    }
    setPwdLoading(true)
    try {
      const token = localStorage.getItem('pu-lms-token')
      const res = await fetch('http://localhost:5000/api/auth/change-password', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ currentPassword: currentPwd, newPassword: newPwd }),
      })
      if (res.ok) {
        setPwdMsg({ type: 'success', text: 'Password updated successfully!' })
        setCurrentPwd('')
        setNewPwd('')
        setConfirmPwd('')
      } else {
        const data = await res.json().catch(() => ({}))
        setPwdMsg({ type: 'error', text: data.error || 'Failed to update password. Check your current password.' })
      }
    } catch {
      setPwdMsg({ type: 'error', text: 'Server unreachable. Password not changed.' })
    } finally {
      setPwdLoading(false)
    }
  }

  const toggleNotifPref = (key) => {
    setNotifPrefs(prev => ({ ...prev, [key]: !prev[key] }))
  }

  const tabs = [
    { id: 'appearance', label: 'Appearance', icon: Palette },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'language', label: 'Language', icon: Globe },
  ]

  return (
    <div className="settings-page">
      <div className="settings-header">
        <h1>Settings</h1>
        <p>Manage your account preferences</p>
      </div>

      <div className="settings-layout">
        <nav className="settings-nav">
          {tabs.map(tab => {
            const Icon = tab.icon
            return (
              <button key={tab.id} className={`settings-nav__item ${activeTab === tab.id ? 'active' : ''}`} onClick={() => setActiveTab(tab.id)}>
                <Icon size={18} />
                <span>{tab.label}</span>
              </button>
            )
          })}
        </nav>

        <div className="settings-content">
          {/* ── APPEARANCE ── */}
          {activeTab === 'appearance' && (
            <div className="settings-section">
              <h2>Appearance</h2>
              <p className="settings-section__desc">Customize how PU CMS looks on your device</p>

              <div className="settings-group">
                <label className="settings-label">Theme</label>
                <div className="settings-theme-grid">
                  <button className={`settings-theme-card ${theme === 'dark' ? 'active' : ''}`} onClick={() => theme !== 'dark' && toggleTheme()}>
                    <Moon size={24} />
                    <span>Dark</span>
                  </button>
                  <button className={`settings-theme-card ${theme === 'light' ? 'active' : ''}`} onClick={() => theme !== 'light' && toggleTheme()}>
                    <Sun size={24} />
                    <span>Light</span>
                  </button>
                  <button className="settings-theme-card" onClick={() => {
                    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
                    if ((prefersDark && theme !== 'dark') || (!prefersDark && theme !== 'light')) toggleTheme()
                  }}>
                    <Monitor size={24} />
                    <span>System</span>
                  </button>
                </div>
              </div>

              <div className="settings-group">
                <label className="settings-label">Font Size</label>
                <select className="settings-select" value={fontSize} onChange={e => setFontSize(e.target.value)}>
                  <option value="13">Small (13px)</option>
                  <option value="14">Default (14px)</option>
                  <option value="16">Large (16px)</option>
                </select>
              </div>

              <div className="settings-group">
                <div className="settings-toggle-row">
                  <div>
                    <span className="settings-toggle-title">Compact Sidebar</span>
                    <span className="settings-toggle-desc">Use a narrower sidebar by default</span>
                  </div>
                  <label className="settings-toggle">
                    <input type="checkbox" checked={compactSidebar} onChange={() => setCompactSidebar(!compactSidebar)} />
                    <span className="settings-toggle-slider" />
                  </label>
                </div>
              </div>

              <div className="settings-group">
                <div className="settings-toggle-row">
                  <div>
                    <span className="settings-toggle-title">Animations</span>
                    <span className="settings-toggle-desc">Enable smooth transitions and animations</span>
                  </div>
                  <label className="settings-toggle">
                    <input type="checkbox" checked={animations} onChange={() => setAnimations(!animations)} />
                    <span className="settings-toggle-slider" />
                  </label>
                </div>
              </div>

              <button className="settings-save-btn" onClick={() => handleSavePrefs('appearance')}>
                {savedTab === 'appearance' ? <><Check size={16} /> Saved!</> : <><Save size={16} /> Save Preferences</>}
              </button>
            </div>
          )}

          {/* ── NOTIFICATIONS ── */}
          {activeTab === 'notifications' && (
            <div className="settings-section">
              <h2>Notifications</h2>
              <p className="settings-section__desc">Choose what notifications you receive</p>

              {[
                { key: 'assignments', title: 'Assignment Updates', desc: 'When new assignments are posted or graded' },
                { key: 'announcements', title: 'Course Announcements', desc: 'Important announcements from your courses' },
                { key: 'fees', title: 'Fee Reminders', desc: 'Payment due date reminders' },
                { key: 'messages', title: 'Messages', desc: 'When you receive a new message' },
                { key: 'ai', title: 'AI Recommendations', desc: 'Personalized study suggestions from AI' },
                { key: 'system', title: 'System Updates', desc: 'Platform maintenance and updates' },
              ].map(item => (
                <div key={item.key} className="settings-group">
                  <div className="settings-toggle-row">
                    <div>
                      <span className="settings-toggle-title">{item.title}</span>
                      <span className="settings-toggle-desc">{item.desc}</span>
                    </div>
                    <label className="settings-toggle">
                      <input type="checkbox" checked={notifPrefs[item.key]} onChange={() => toggleNotifPref(item.key)} />
                      <span className="settings-toggle-slider" />
                    </label>
                  </div>
                </div>
              ))}

              <button className="settings-save-btn" onClick={() => handleSavePrefs('notifications')}>
                {savedTab === 'notifications' ? <><Check size={16} /> Saved!</> : <><Save size={16} /> Save Preferences</>}
              </button>
            </div>
          )}

          {/* ── SECURITY ── */}
          {activeTab === 'security' && (
            <div className="settings-section">
              <h2>Security</h2>
              <p className="settings-section__desc">Manage your security preferences</p>

              <div className="settings-group">
                <div className="settings-toggle-row">
                  <div>
                    <span className="settings-toggle-title">Two-Factor Authentication</span>
                    <span className="settings-toggle-desc">Add an extra layer of security to your account</span>
                  </div>
                  <label className="settings-toggle">
                    <input type="checkbox" checked={twoFactor} onChange={() => setTwoFactor(!twoFactor)} />
                    <span className="settings-toggle-slider" />
                  </label>
                </div>
              </div>

              <div className="settings-group">
                <label className="settings-label">Change Password</label>
                <div className="settings-password-group">
                  <input type="password" className="settings-input" placeholder="Current password" value={currentPwd} onChange={e => setCurrentPwd(e.target.value)} />
                  <input type="password" className="settings-input" placeholder="New password (min 6 chars)" value={newPwd} onChange={e => setNewPwd(e.target.value)} />
                  <input type="password" className="settings-input" placeholder="Confirm new password" value={confirmPwd} onChange={e => setConfirmPwd(e.target.value)} />
                </div>
                {pwdMsg && (
                  <div style={{
                    padding: '8px 14px', borderRadius: '8px', marginTop: '10px', fontSize: '12.5px', fontWeight: 500,
                    background: pwdMsg.type === 'success' ? '#e8f5e9' : '#ffebee',
                    color: pwdMsg.type === 'success' ? '#2e7d32' : '#c62828',
                    border: `1px solid ${pwdMsg.type === 'success' ? '#c8e6c9' : '#ffcdd2'}`
                  }}>
                    {pwdMsg.text}
                  </div>
                )}
                <button className="settings-save-btn" onClick={handleUpdatePassword} disabled={pwdLoading} style={{ marginTop: '12px' }}>
                  <Key size={16} /> {pwdLoading ? 'Updating...' : 'Update Password'}
                </button>
              </div>

              <div className="settings-group">
                <label className="settings-label">Active Sessions</label>
                <div className="settings-session">
                  <div className="settings-session__info">
                    <Monitor size={18} />
                    <div>
                      <span className="settings-session__device">Chrome on Windows</span>
                      <span className="settings-session__location">Lahore, Pakistan • Current session</span>
                    </div>
                  </div>
                  <span className="settings-session__active">Active</span>
                </div>
              </div>
            </div>
          )}

          {/* ── LANGUAGE ── */}
          {activeTab === 'language' && (
            <div className="settings-section">
              <h2>Language & Region</h2>
              <p className="settings-section__desc">Set your preferred language and regional settings</p>

              <div className="settings-group">
                <label className="settings-label">Language</label>
                <select className="settings-select" value={language} onChange={e => setLanguage(e.target.value)}>
                  <option value="en">English</option>
                  <option value="ur">اردو (Urdu)</option>
                  <option value="ar">العربية (Arabic)</option>
                </select>
              </div>

              <div className="settings-group">
                <label className="settings-label">Time Zone</label>
                <select className="settings-select" value={timezone} onChange={e => setTimezone(e.target.value)}>
                  <option value="Asia/Karachi">Asia/Karachi (PKT, UTC+5)</option>
                  <option value="Asia/Dubai">Asia/Dubai (GST, UTC+4)</option>
                  <option value="Europe/London">Europe/London (GMT, UTC+0)</option>
                </select>
              </div>

              <div className="settings-group">
                <label className="settings-label">Date Format</label>
                <select className="settings-select" value={dateFormat} onChange={e => setDateFormat(e.target.value)}>
                  <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                  <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                  <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                </select>
              </div>

              <button className="settings-save-btn" onClick={() => handleSavePrefs('language')}>
                {savedTab === 'language' ? <><Check size={16} /> Saved!</> : <><Save size={16} /> Save Preferences</>}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
