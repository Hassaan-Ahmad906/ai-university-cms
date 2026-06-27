import { Router } from 'express'
import Transcript from '../models/Transcript.js'
import { protect, authorize } from '../middleware/auth.js'

const router = Router()
router.use(protect)

// ── GET /api/transcripts ──
router.get('/', async (req, res) => {
  try {
    const query = {}
    if (req.user.role === 'student') query.student = req.user.id
    if (req.query.status) query.status = req.query.status

    const transcripts = await Transcript.find(query)
      .populate('student', 'firstName lastName rollNumber program department')
      .populate('processedBy', 'firstName lastName')
      .sort({ createdAt: -1 })

    res.json({ transcripts })
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch transcripts' })
  }
})

// ── POST /api/transcripts ── (Student requests)
router.post('/', authorize('student'), async (req, res) => {
  try {
    const { type } = req.body
    const transcript = await Transcript.create({
      student: req.user.id,
      type: type || 'transcript',
      expectedDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
    })
    res.status(201).json({ transcript })
  } catch (error) {
    res.status(500).json({ error: 'Failed to create transcript request' })
  }
})

// ── PUT /api/transcripts/:id/status ── (Registrar, Clerk update status)
router.put('/:id/status', authorize('registrar', 'clerk', 'admin'), async (req, res) => {
  try {
    const { status, notes } = req.body
    const transcript = await Transcript.findByIdAndUpdate(
      req.params.id,
      { status, notes, processedBy: req.user.id },
      { new: true }
    ).populate('student', 'firstName lastName rollNumber')

    if (!transcript) return res.status(404).json({ error: 'Request not found' })
    res.json({ transcript })
  } catch (error) {
    res.status(500).json({ error: 'Failed to update transcript status' })
  }
})

export default router
