import { useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { useTheme } from '../../contexts/ThemeContext'
import { Sun, Moon, Monitor, Globe, Bell, Shield, Key, Database, Palette, Save } from 'lucide-react'
import './SettingsPage.css'

export default function SettingsPage() {
  const { user } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const [activeTab, setActiveTab] = useState('appearance')

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
          {activeTab === 'appearance' && (
            <div className="settings-section">
              <h2>Appearance</h2>
              <p className="settings-section__desc">Customize how PU LMS looks on your device</p>

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
                  <button className="settings-theme-card">
                    <Monitor size={24} />
                    <span>System</span>
                  </button>
                </div>
              </div>

              <div className="settings-group">
                <label className="settings-label">Font Size</label>
                <select className="settings-select">
                  <option>Small (13px)</option>
                  <option selected>Default (14px)</option>
                  <option>Large (16px)</option>
                </select>
              </div>

              <div className="settings-group">
                <div className="settings-toggle-row">
                  <div>
                    <span className="settings-toggle-title">Compact Sidebar</span>
                    <span className="settings-toggle-desc">Use a narrower sidebar by default</span>
                  </div>
                  <label className="settings-toggle">
                    <input type="checkbox" />
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
                    <input type="checkbox" defaultChecked />
                    <span className="settings-toggle-slider" />
                  </label>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="settings-section">
              <h2>Notifications</h2>
              <p className="settings-section__desc">Choose what notifications you receive</p>

              {[
                { title: 'Assignment Updates', desc: 'When new assignments are posted or graded', default: true },
                { title: 'Course Announcements', desc: 'Important announcements from your courses', default: true },
                { title: 'Fee Reminders', desc: 'Payment due date reminders', default: true },
                { title: 'Messages', desc: 'When you receive a new message', default: true },
                { title: 'AI Recommendations', desc: 'Personalized study suggestions from AI', default: false },
                { title: 'System Updates', desc: 'Platform maintenance and updates', default: false },
              ].map((item, i) => (
                <div key={i} className="settings-group">
                  <div className="settings-toggle-row">
                    <div>
                      <span className="settings-toggle-title">{item.title}</span>
                      <span className="settings-toggle-desc">{item.desc}</span>
                    </div>
                    <label className="settings-toggle">
                      <input type="checkbox" defaultChecked={item.default} />
                      <span className="settings-toggle-slider" />
                    </label>
                  </div>
                </div>
              ))}
            </div>
          )}

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
                    <input type="checkbox" />
                    <span className="settings-toggle-slider" />
                  </label>
                </div>
              </div>

              <div className="settings-group">
                <label className="settings-label">Change Password</label>
                <div className="settings-password-group">
                  <input type="password" className="settings-input" placeholder="Current password" />
                  <input type="password" className="settings-input" placeholder="New password" />
                  <input type="password" className="settings-input" placeholder="Confirm new password" />
                </div>
                <button className="settings-save-btn"><Key size={16} /> Update Password</button>
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

          {activeTab === 'language' && (
            <div className="settings-section">
              <h2>Language & Region</h2>
              <p className="settings-section__desc">Set your preferred language and regional settings</p>

              <div className="settings-group">
                <label className="settings-label">Language</label>
                <select className="settings-select">
                  <option selected>English</option>
                  <option>اردو (Urdu)</option>
                  <option>العربية (Arabic)</option>
                </select>
              </div>

              <div className="settings-group">
                <label className="settings-label">Time Zone</label>
                <select className="settings-select">
                  <option selected>Asia/Karachi (PKT, UTC+5)</option>
                  <option>Asia/Dubai (GST, UTC+4)</option>
                  <option>Europe/London (GMT, UTC+0)</option>
                </select>
              </div>

              <div className="settings-group">
                <label className="settings-label">Date Format</label>
                <select className="settings-select">
                  <option selected>DD/MM/YYYY</option>
                  <option>MM/DD/YYYY</option>
                  <option>YYYY-MM-DD</option>
                </select>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
