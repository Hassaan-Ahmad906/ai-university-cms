import { Router } from 'express'
import { protect } from '../middleware/auth.js'
import { chatWithAI, getStudyRecommendations, autoGradeSubmission } from '../services/geminiService.js'

const router = Router()
router.use(protect)

// ── POST /api/ai/chat ── AI Chatbot
router.post('/chat', async (req, res) => {
  try {
    const { message, context } = req.body
    if (!message) {
      return res.status(400).json({ error: 'Message is required' })
    }

    const response = await chatWithAI(message, req.user.role, context)
    res.json({ response })
  } catch (error) {
    console.error('AI chat error:', error)
    res.status(500).json({ error: 'AI service temporarily unavailable' })
  }
})

// ── GET /api/ai/study-recommendations ── (Student)
router.get('/study-recommendations', async (req, res) => {
  try {
    const recommendations = await getStudyRecommendations(req.user)
    res.json({ recommendations })
  } catch (error) {
    res.status(500).json({ error: 'Failed to get recommendations' })
  }
})

// ── POST /api/ai/auto-grade ── (Teacher)
router.post('/auto-grade', async (req, res) => {
  try {
    const { submissionContent, rubric, totalMarks } = req.body
    const result = await autoGradeSubmission(submissionContent, rubric, totalMarks)
    res.json({ result })
  } catch (error) {
    res.status(500).json({ error: 'AI grading failed' })
  }
})

export default router
