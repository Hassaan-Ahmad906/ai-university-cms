import { useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { Megaphone, Pin, Calendar, User, ChevronDown, ChevronUp, Plus, Search, Filter } from 'lucide-react'
import './AnnouncementsPage.css'

const ANNOUNCEMENTS = [
  { id: 1, title: 'Mid-Term Examination Schedule — Spring 2026', body: 'The Controller of Examinations has published the mid-term examination date sheet for Spring 2026. Examinations will commence from July 1, 2026. Students are advised to collect their admit cards from the respective department offices by June 28.\n\nImportant: No student will be allowed to sit in the examination without a valid admit card and university ID.', author: 'Controller of Examinations', date: 'Jun 26, 2026', pinned: true, category: 'Examinations', urgent: true },
  { id: 2, title: 'Annual Career Fair — July 3, 2026', body: 'The Career Services Office is pleased to announce the Annual Career Fair 2026 featuring over 50 leading organizations. Companies including Google, Systems Limited, Netsol, Jazz, and many more will be present.\n\nDress code: Business formal. Bring updated CVs.', author: 'Career Services Office', date: 'Jun 25, 2026', pinned: true, category: 'Events' },
  { id: 3, title: 'Library Extended Hours During Exams', body: 'The Central Library will observe extended hours during the examination period (July 1-15). New timings: 8:00 AM to 11:00 PM. Group study rooms can be booked via the library portal.', author: 'Chief Librarian', date: 'Jun 24, 2026', pinned: false, category: 'Academic' },
  { id: 4, title: 'Fee Payment Deadline Reminder', body: 'Students are reminded that the last date for fee payment without late surcharge is June 30, 2026. After this date, a 5% late fee will be charged. Payment can be made online via HBL, JazzCash, EasyPaisa, or at the university bank branch.', author: 'Treasurer Office', date: 'Jun 23, 2026', pinned: false, category: 'Finance', urgent: true },
  { id: 5, title: 'New AI & Data Science Lab Inauguration', body: 'The Vice Chancellor will inaugurate the state-of-the-art AI & Data Science Lab at the Computer Science Department on July 5, 2026 at 10:00 AM. All faculty and students are invited.', author: 'VC Office', date: 'Jun 22, 2026', pinned: false, category: 'Events' },
  { id: 6, title: 'Summer Research Internship Program', body: 'Applications are now open for the Summer Research Internship Program 2026. Students with CGPA 3.0+ from all departments are eligible. Apply via the research portal by July 10, 2026.', author: 'Office of Research', date: 'Jun 20, 2026', pinned: false, category: 'Research' },
]

const CATEGORIES = ['All', 'Examinations', 'Academic', 'Events', 'Finance', 'Research']

export default function AnnouncementsPage() {
  const { user } = useAuth()
  const [expandedId, setExpandedId] = useState(ANNOUNCEMENTS[0].id)
  const [category, setCategory] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')

  const filtered = ANNOUNCEMENTS.filter(a => {
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
          <p>Official notices from University of the Punjab</p>
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
          {CATEGORIES.map(cat => (
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
