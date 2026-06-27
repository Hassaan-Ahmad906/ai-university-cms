import { Router } from 'express'
import Attendance from '../models/Attendance.js'
import { protect, authorize } from '../middleware/auth.js'

const router = Router()
router.use(protect)

// ── GET /api/attendance ──
router.get('/', async (req, res) => {
  try {
    const { course, date, month } = req.query
    const query = {}
    if (course) query.course = course
    if (date) query.date = new Date(date)
    if (month) {
      const [year, m] = month.split('-')
      query.date = { $gte: new Date(year, m - 1, 1), $lt: new Date(year, m, 1) }
    }

    const attendance = await Attendance.find(query)
      .populate('course', 'code name')
      .populate('records.student', 'firstName lastName rollNumber')
      .sort({ date: -1 })

    res.json({ attendance })
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch attendance' })
  }
})

// ── POST /api/attendance ── (Teacher marks attendance)
router.post('/', authorize('teacher', 'admin'), async (req, res) => {
  try {
    const { course, date, records } = req.body

    const attendance = await Attendance.findOneAndUpdate(
      { course, date: new Date(date) },
      { course, date: new Date(date), markedBy: req.user.id, records },
      { new: true, upsert: true }
    )

    res.json({ attendance })
  } catch (error) {
    res.status(500).json({ error: 'Failed to save attendance' })
  }
})

// ── GET /api/attendance/student ── (Student own attendance)
router.get('/student', authorize('student'), async (req, res) => {
  try {
    const { course } = req.query
    const query = { 'records.student': req.user.id }
    if (course) query.course = course

    const attendance = await Attendance.find(query)
      .populate('course', 'code name')
      .sort({ date: -1 })

    // Calculate stats
    let total = 0, present = 0, absent = 0, late = 0
    attendance.forEach(a => {
      const record = a.records.find(r => r.student.toString() === req.user.id)
      if (record) {
        total++
        if (record.status === 'present') present++
        else if (record.status === 'absent') absent++
        else if (record.status === 'late') late++
      }
    })

    res.json({
      attendance,
      stats: { total, present, absent, late, percentage: total > 0 ? Math.round((present / total) * 100) : 0 },
    })
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch attendance' })
  }
})

export default router
