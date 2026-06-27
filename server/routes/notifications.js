import { Router } from 'express'
import Notification from '../models/Notification.js'
import { protect } from '../middleware/auth.js'

const router = Router()
router.use(protect)

// ── GET /api/notifications ──
router.get('/', async (req, res) => {
  try {
    const { read, page = 1, limit = 20 } = req.query
    const query = { user: req.user.id }
    if (read !== undefined) query.read = read === 'true'

    const total = await Notification.countDocuments(query)
    const unreadCount = await Notification.countDocuments({ user: req.user.id, read: false })
    const notifications = await Notification.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit))

    res.json({ notifications, total, unreadCount, page: Number(page) })
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch notifications' })
  }
})

// ── PUT /api/notifications/read-all ──
router.put('/read-all', async (req, res) => {
  try {
    await Notification.updateMany({ user: req.user.id, read: false }, { read: true })
    res.json({ message: 'All notifications marked as read' })
  } catch (error) {
    res.status(500).json({ error: 'Failed to update notifications' })
  }
})

// ── PUT /api/notifications/:id/read ──
router.put('/:id/read', async (req, res) => {
  try {
    const notification = await Notification.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      { read: true },
      { new: true }
    )
    if (!notification) return res.status(404).json({ error: 'Notification not found' })
    res.json({ notification })
  } catch (error) {
    res.status(500).json({ error: 'Failed to update notification' })
  }
})

// ── DELETE /api/notifications/:id ──
router.delete('/:id', async (req, res) => {
  try {
    await Notification.findOneAndDelete({ _id: req.params.id, user: req.user.id })
    res.json({ message: 'Notification deleted' })
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete notification' })
  }
})

export default router
