import { Router } from 'express'
import User from '../models/User.js'
import { protect, authorize } from '../middleware/auth.js'

const router = Router()

// All user routes require authentication
router.use(protect)

// ── GET /api/users ── (Admin, Registrar)
router.get('/', authorize('admin', 'vc', 'registrar'), async (req, res) => {
  try {
    const { role, department, search, page = 1, limit = 20 } = req.query
    const query = {}

    if (role) query.role = role
    if (department) query.department = new RegExp(department, 'i')
    if (search) {
      query.$or = [
        { firstName: new RegExp(search, 'i') },
        { lastName: new RegExp(search, 'i') },
        { email: new RegExp(search, 'i') },
      ]
    }

    const total = await User.countDocuments(query)
    const users = await User.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit))

    res.json({ users, total, page: Number(page), pages: Math.ceil(total / limit) })
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch users' })
  }
})

// ── GET /api/users/:id ──
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
    if (!user) return res.status(404).json({ error: 'User not found' })
    res.json({ user })
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch user' })
  }
})

// ── PUT /api/users/:id ── (Admin or self)
router.put('/:id', async (req, res) => {
  try {
    // Only admin can update other users; users can update themselves
    if (req.user.role !== 'admin' && req.user.id !== req.params.id) {
      return res.status(403).json({ error: 'Not authorized to update this user' })
    }

    const { password, role, ...updateData } = req.body

    // Only admin can change roles
    if (role && req.user.role === 'admin') {
      updateData.role = role
    }

    const user = await User.findByIdAndUpdate(req.params.id, updateData, { new: true, runValidators: true })
    if (!user) return res.status(404).json({ error: 'User not found' })
    res.json({ user })
  } catch (error) {
    res.status(500).json({ error: 'Failed to update user' })
  }
})

// ── DELETE /api/users/:id ── (Admin only)
router.delete('/:id', authorize('admin'), async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, { isActive: false }, { new: true })
    if (!user) return res.status(404).json({ error: 'User not found' })
    res.json({ message: 'User deactivated successfully' })
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete user' })
  }
})

export default router
