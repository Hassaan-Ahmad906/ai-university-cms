import { Router } from 'express'
import Assignment from '../models/Assignment.js'
import Submission from '../models/Submission.js'
import { protect, authorize } from '../middleware/auth.js'

const router = Router()
router.use(protect)

// ── GET /api/assignments ──
router.get('/', async (req, res) => {
  try {
    const { course, status, page = 1, limit = 20 } = req.query
    const query = {}

    if (course) query.course = course
    if (status) query.status = status
    if (req.user.role === 'teacher') query.teacher = req.user.id

    const total = await Assignment.countDocuments(query)
    const assignments = await Assignment.find(query)
      .populate('course', 'code name')
      .populate('teacher', 'firstName lastName')
      .sort({ dueDate: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit))

    res.json({ assignments, total, page: Number(page), pages: Math.ceil(total / limit) })
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch assignments' })
  }
})

// ── POST /api/assignments ── (Teacher)
router.post('/', authorize('teacher', 'admin'), async (req, res) => {
  try {
    const assignment = await Assignment.create({ ...req.body, teacher: req.user.id })
    res.status(201).json({ assignment })
  } catch (error) {
    res.status(500).json({ error: 'Failed to create assignment' })
  }
})

// ── POST /api/assignments/:id/submit ── (Student)
router.post('/:id/submit', authorize('student'), async (req, res) => {
  try {
    const assignment = await Assignment.findById(req.params.id)
    if (!assignment) return res.status(404).json({ error: 'Assignment not found' })

    const submission = await Submission.findOneAndUpdate(
      { assignment: req.params.id, student: req.user.id },
      { ...req.body, student: req.user.id, assignment: req.params.id, status: 'submitted' },
      { new: true, upsert: true }
    )
    res.json({ submission })
  } catch (error) {
    res.status(500).json({ error: 'Failed to submit assignment' })
  }
})

// ── PUT /api/assignments/:id/grade ── (Teacher)
router.put('/:id/grade', authorize('teacher', 'admin'), async (req, res) => {
  try {
    const { studentId, marks, feedback } = req.body
    const submission = await Submission.findOneAndUpdate(
      { assignment: req.params.id, student: studentId },
      { marks, feedback, gradedBy: req.user.id, gradedAt: new Date(), status: 'graded' },
      { new: true }
    )
    if (!submission) return res.status(404).json({ error: 'Submission not found' })
    res.json({ submission })
  } catch (error) {
    res.status(500).json({ error: 'Failed to grade submission' })
  }
})

// ── GET /api/assignments/:id/submissions ── (Teacher)
router.get('/:id/submissions', authorize('teacher', 'admin'), async (req, res) => {
  try {
    const submissions = await Submission.find({ assignment: req.params.id })
      .populate('student', 'firstName lastName email rollNumber')
      .sort({ createdAt: -1 })
    res.json({ submissions })
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch submissions' })
  }
})

export default router
