import { Router } from 'express'
import Message from '../models/Message.js'
import User from '../models/User.js'
import { protect } from '../middleware/auth.js'

const router = Router()
router.use(protect)

// ── GET /api/messages/conversations ── List all conversations
router.get('/conversations', async (req, res) => {
  try {
    // Get all unique users this user has messaged with
    const messages = await Message.aggregate([
      { $match: { $or: [{ sender: req.user.id }, { receiver: req.user.id }] } },
      { $sort: { createdAt: -1 } },
      {
        $group: {
          _id: {
            $cond: [{ $eq: ['$sender', req.user.id] }, '$receiver', '$sender']
          },
          lastMessage: { $first: '$text' },
          lastTime: { $first: '$createdAt' },
          unread: {
            $sum: {
              $cond: [{ $and: [{ $eq: ['$receiver', req.user.id] }, { $eq: ['$read', false] }] }, 1, 0]
            }
          }
        }
      },
      { $sort: { lastTime: -1 } }
    ])

    // Populate user info
    const userIds = messages.map(m => m._id)
    const users = await User.find({ _id: { $in: userIds } }).select('firstName lastName role avatar department')

    const conversations = messages.map(m => {
      const user = users.find(u => u._id.toString() === m._id.toString())
      return {
        user: user || { firstName: 'Unknown', lastName: '' },
        lastMessage: m.lastMessage,
        lastTime: m.lastTime,
        unread: m.unread,
      }
    })

    res.json({ conversations })
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch conversations' })
  }
})

// ── GET /api/messages/:userId ── Get messages with a specific user
router.get('/:userId', async (req, res) => {
  try {
    const messages = await Message.find({
      $or: [
        { sender: req.user.id, receiver: req.params.userId },
        { sender: req.params.userId, receiver: req.user.id },
      ]
    }).sort({ createdAt: 1 }).limit(100)

    // Mark received messages as read
    await Message.updateMany(
      { sender: req.params.userId, receiver: req.user.id, read: false },
      { read: true }
    )

    res.json({ messages })
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch messages' })
  }
})

// ── POST /api/messages ── Send a message
router.post('/', async (req, res) => {
  try {
    const { receiver, text } = req.body
    if (!receiver || !text) {
      return res.status(400).json({ error: 'Receiver and text are required' })
    }

    const message = await Message.create({ sender: req.user.id, receiver, text })
    res.status(201).json({ message })
  } catch (error) {
    res.status(500).json({ error: 'Failed to send message' })
  }
})

export default router
