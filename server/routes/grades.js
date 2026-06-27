import { Router } from 'express'
import Grade from '../models/Grade.js'
import { protect, authorize } from '../middleware/auth.js'

const router = Router()
router.use(protect)

// ── GET /api/grades ── (Student sees own, Teacher sees course)
router.get('/', async (req, res) => {
  try {
    const { student, course, semester } = req.query
    const query = {}

    if (req.user.role === 'student') {
      query.student = req.user.id
    } else if (student) {
      query.student = student
    }
    if (course) query.course = course
    if (semester) query.semester = semester

    const grades = await Grade.find(query)
      .populate('course', 'code name creditHours')
      .populate('student', 'firstName lastName rollNumber')
      .sort({ semester: -1 })

    res.json({ grades })
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch grades' })
  }
})

// ── POST /api/grades ── (Teacher, Admin)
router.post('/', authorize('teacher', 'admin', 'controller'), async (req, res) => {
  try {
    const grade = await Grade.findOneAndUpdate(
      { student: req.body.student, course: req.body.course, semester: req.body.semester },
      req.body,
      { new: true, upsert: true, runValidators: true }
    )
    res.json({ grade })
  } catch (error) {
    res.status(500).json({ error: 'Failed to save grade' })
  }
})

// ── GET /api/grades/cgpa ── (Student own CGPA)
router.get('/cgpa', authorize('student'), async (req, res) => {
  try {
    const grades = await Grade.find({ student: req.user.id })
      .populate('course', 'creditHours')

    if (grades.length === 0) {
      return res.json({ cgpa: 0, totalCredits: 0, earnedCredits: 0, semesters: [] })
    }

    let totalPoints = 0
    let totalCredits = 0
    const semesters = {}

    for (const g of grades) {
      const credits = g.course?.creditHours || 3
      totalPoints += g.gpa * credits
      totalCredits += credits

      if (!semesters[g.semester]) semesters[g.semester] = { gpa: 0, credits: 0, points: 0 }
      semesters[g.semester].points += g.gpa * credits
      semesters[g.semester].credits += credits
    }

    const semesterList = Object.entries(semesters).map(([sem, data]) => ({
      semester: sem,
      gpa: Number((data.points / data.credits).toFixed(2)),
      credits: data.credits,
    }))

    res.json({
      cgpa: Number((totalPoints / totalCredits).toFixed(2)),
      totalCredits,
      earnedCredits: totalCredits,
      semesters: semesterList,
    })
  } catch (error) {
    res.status(500).json({ error: 'Failed to calculate CGPA' })
  }
})

export default router
