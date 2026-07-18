import { useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { Megaphone, Pin, Calendar, User, ChevronDown, ChevronUp, Plus, Search, Filter } from 'lucide-react'
import './AnnouncementsPage.css'

const ADMIN_ANNOUNCEMENTS = [
  { id: 101, title: 'CMS Server Maintenance — July 20, 2026', body: 'Scheduled maintenance window for CMS server upgrade. System will be offline from 2:00 AM to 6:00 AM PKT. All services including LMS, fee portal, and email will be temporarily unavailable.\n\nPlease plan accordingly and save any pending work before the maintenance window.', author: 'IT Infrastructure Team', date: 'Jul 18, 2026', pinned: true, category: 'System', urgent: true },
  { id: 102, title: 'Database Backup Schedule Updated', body: 'The automated backup schedule has been updated. Full backups now run at 3:00 AM daily (previously weekly). Incremental backups continue every 6 hours. This change is to comply with new data protection policies.', author: 'DBA Team', date: 'Jul 15, 2026', pinned: true, category: 'Technical' },
  { id: 103, title: 'CMS v1.1 — Patch Notes', body: 'Version 1.1 includes:\n• Role-based dashboard views\n• AI Study Buddy integration\n• Fee management module\n• Improved attendance tracking\n• Bug fixes for message delivery\n\nPlease report any issues to the IT help desk.', author: 'CMS Development Team', date: 'Jul 12, 2026', pinned: false, category: 'Technical' },
  { id: 104, title: 'HOD Request — Additional Lab Hours', body: 'The HOD of Computer Science has requested extended lab access hours (until 10 PM) for final year students during project season. Please review and approve if infrastructure supports it.', author: 'HOD Computer Science', date: 'Jul 10, 2026', pinned: false, category: 'Requests' },
  { id: 105, title: 'Dean Request — Guest Wi-Fi for Career Fair', body: 'The Dean of Computing has requested temporary guest Wi-Fi access setup for the upcoming Career Fair on July 25. Estimated 500+ external visitors expected.', author: 'Dean, Faculty of Computing', date: 'Jul 8, 2026', pinned: false, category: 'Requests' },
  { id: 106, title: 'SSL Certificate Renewal Notice', body: 'The SSL certificates for pu.edu.pk subdomains will expire on August 1, 2026. Auto-renewal has been configured but please verify post-renewal.', author: 'Security Team', date: 'Jul 5, 2026', pinned: false, category: 'System' },
]

const GENERAL_ANNOUNCEMENTS = [
  { id: 1, title: 'Mid-Term Examination Schedule — Spring 2026', body: 'The Controller of Examinations has published the mid-term examination date sheet for Spring 2026. Examinations will commence from July 1, 2026. Students are advised to collect their admit cards from the respective department offices by June 28.\n\nImportant: No student will be allowed to sit in the examination without a valid admit card and university ID.', author: 'Controller of Examinations', date: 'Jun 26, 2026', pinned: true, category: 'Examinations', urgent: true },
  { id: 2, title: 'Annual Career Fair — July 3, 2026', body: 'The Career Services Office is pleased to announce the Annual Career Fair 2026 featuring over 50 leading organizations. Companies including Google, Systems Limited, Netsol, Jazz, and many more will be present.\n\nDress code: Business formal. Bring updated CVs.', author: 'Career Services Office', date: 'Jun 25, 2026', pinned: true, category: 'Events' },
  { id: 3, title: 'Library Extended Hours During Exams', body: 'The Central Library will observe extended hours during the examination period (July 1-15). New timings: 8:00 AM to 11:00 PM. Group study rooms can be booked via the library portal.', author: 'Chief Librarian', date: 'Jun 24, 2026', pinned: false, category: 'Academic' },
  { id: 4, title: 'Fee Payment Deadline Reminder', body: 'Students are reminded that the last date for fee payment without late surcharge is June 30, 2026. After this date, a 5% late fee will be charged. Payment can be made online via HBL, JazzCash, EasyPaisa, or at the university bank branch.', author: 'Treasurer Office', date: 'Jun 23, 2026', pinned: false, category: 'Finance', urgent: true },
  { id: 5, title: 'New AI & Data Science Lab Inauguration', body: 'The Vice Chancellor will inaugurate the state-of-the-art AI & Data Science Lab at the Computer Science Department on July 5, 2026 at 10:00 AM. All faculty and students are invited.', author: 'VC Office', date: 'Jun 22, 2026', pinned: false, category: 'Events' },
  { id: 6, title: 'Summer Research Internship Program', body: 'Applications are now open for the Summer Research Internship Program 2026. Students with CGPA 3.0+ from all departments are eligible. Apply via the research portal by July 10, 2026.', author: 'Office of Research', date: 'Jun 20, 2026', pinned: false, category: 'Research' },
]

const ADMIN_CATEGORIES = ['All', 'System', 'Technical', 'Requests']
const GENERAL_CATEGORIES = ['All', 'Examinations', 'Academic', 'Events', 'Finance', 'Research']

export default function AnnouncementsPage() {
  const { user } = useAuth()
  const isAdmin = user?.role === 'admin'

  const announcements = isAdmin ? ADMIN_ANNOUNCEMENTS : GENERAL_ANNOUNCEMENTS
  const categories = isAdmin ? ADMIN_CATEGORIES : GENERAL_CATEGORIES

  const [expandedId, setExpandedId] = useState(announcements[0].id)
  const [category, setCategory] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')

  const filtered = announcements.filter(a => {
    const matchCategory = category === 'All' || a.category === category
    const matchSearch = a.title.toLowerCase().includes(searchQuery.toLowerCase()) || a.body.toLowerCase().includes(searchQuery.toLowerCase())
    return matchCategory && matchSearch
  })

  const pinned = filtered.filter(a => a.pinned)
  const regular = filtered.filter(a => !a.pinned)

  const canCreate = ['admin', 'vc', 'dean', 'hod', 'registrar', 'controller'].includes(user?.role)

  return (
    <div className="ann-page">
      <div className="ann-header">
        <div>
          <h1>Announcements</h1>
          <p>{isAdmin ? 'System notices, technical updates & authority requests' : 'Official notices from University of the Punjab'}</p>
        </div>
        {canCreate && (
          <button className="ann-create-btn" onClick={() => alert('New Announcement form — coming in next update')}><Plus size={16} /> New Announcement</button>
        )}
      </div>

      <div className="ann-toolbar">
        <div className="ann-search">
          <Search size={14} />
          <input placeholder="Search announcements..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
        </div>
        <div className="ann-categories">
          {categories.map(cat => (
            <button key={cat} className={`ann-cat-chip ${category === cat ? 'active' : ''}`} onClick={() => setCategory(cat)}>{cat}</button>
          ))}
        </div>
      </div>

      {pinned.length > 0 && (
        <div className="ann-section">
          <h3><Pin size={14} /> Pinned</h3>
          {pinned.map(ann => (
            <AnnouncementCard key={ann.id} ann={ann} expanded={expandedId === ann.id} onToggle={() => setExpandedId(expandedId === ann.id ? null : ann.id)} />
          ))}
        </div>
      )}

      <div className="ann-section">
        {pinned.length > 0 && <h3><Megaphone size={14} /> Recent</h3>}
        {regular.length === 0 && pinned.length === 0 ? (
          <div className="ann-empty"><Megaphone size={36} /><p>No announcements found</p></div>
        ) : (
          regular.map(ann => (
            <AnnouncementCard key={ann.id} ann={ann} expanded={expandedId === ann.id} onToggle={() => setExpandedId(expandedId === ann.id ? null : ann.id)} />
          ))
        )}
      </div>
    </div>
  )
}

function AnnouncementCard({ ann, expanded, onToggle }) {
  return (
    <div className={`ann-card ${ann.urgent ? 'ann-card--urgent' : ''} ${ann.pinned ? 'ann-card--pinned' : ''}`} onClick={onToggle}>
      <div className="ann-card__header">
        <div className="ann-card__title-row">
          {ann.pinned && <Pin size={14} className="ann-card__pin-icon" />}
          <h4>{ann.title}</h4>
          {ann.urgent && <span className="ann-card__urgent-badge">Urgent</span>}
        </div>
        <div className="ann-card__meta">
          <span><User size={12} /> {ann.author}</span>
          <span><Calendar size={12} /> {ann.date}</span>
          <span className="ann-card__cat">{ann.category}</span>
        </div>
      </div>
      {expanded && (
        <div className="ann-card__body">
          {ann.body.split('\n').map((p, i) => p.trim() ? <p key={i}>{p}</p> : <br key={i} />)}
        </div>
      )}
      <button className="ann-card__toggle">
        {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        {expanded ? 'Show less' : 'Read more'}
      </button>
    </div>
  )
}
