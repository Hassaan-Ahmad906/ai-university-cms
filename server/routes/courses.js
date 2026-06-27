import { Router } from 'express'
import Course from '../models/Course.js'
import { protect, authorize } from '../middleware/auth.js'

const router = Router()
router.use(protect)

// ── GET /api/courses ──
router.get('/', async (req, res) => {
  try {
    const { department, semester, search, page = 1, limit = 20 } = req.query
    const query = { isActive: true }

    if (department) query.department = new RegExp(department, 'i')
    if (semester) query.semester = semester
    if (search) {
      query.$or = [
        { name: new RegExp(search, 'i') },
        { code: new RegExp(search, 'i') },
      ]
    }

    // Students only see their enrolled courses
    if (req.user.role === 'student') {
      query.students = req.user.id
    }
    // Teachers see their own courses
    if (req.user.role === 'teacher') {
      query.teacher = req.user.id
    }

    const total = await Course.countDocuments(query)
    const courses = await Course.find(query)
      .populate('teacher', 'firstName lastName email')
      .sort({ code: 1 })
      .skip((page - 1) * limit)
      .limit(Number(limit))

    res.json({ courses, total, page: Number(page), pages: Math.ceil(total / limit) })
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch courses' })
  }
})

// ── GET /api/courses/:id ──
router.get('/:id', async (req, res) => {
  try {
    const course = await Course.findById(req.params.id)
      .populate('teacher', 'firstName lastName email')
      .populate('students', 'firstName lastName email rollNumber')
    if (!course) return res.status(404).json({ error: 'Course not found' })
    res.json({ course })
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch course' })
  }
})

// ── POST /api/courses ── (Admin, HOD)
router.post('/', authorize('admin', 'hod', 'dean'), async (req, res) => {
  try {
    const course = await Course.create(req.body)
    res.status(201).json({ course })
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ error: 'Course code already exists' })
    }
    res.status(500).json({ error: 'Failed to create course' })
  }
})

// ── PUT /api/courses/:id ──
router.put('/:id', authorize('admin', 'hod', 'teacher'), async (req, res) => {
  try {
    const course = await Course.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
    if (!course) return res.status(404).json({ error: 'Course not found' })
    res.json({ course })
  } catch (error) {
    res.status(500).json({ error: 'Failed to update course' })
  }
})

// ── POST /api/courses/:id/enroll ── (Student self-enrollment)
router.post('/:id/enroll', authorize('student'), async (req, res) => {
  try {
    const course = await Course.findById(req.params.id)
    if (!course) return res.status(404).json({ error: 'Course not found' })

    if (course.students.includes(req.user.id)) {
      return res.status(400).json({ error: 'Already enrolled in this course' })
    }

    if (course.students.length >= course.maxStudents) {
      return res.status(400).json({ error: 'Course is full' })
    }

    course.students.push(req.user.id)
    await course.save()
    res.json({ message: 'Enrolled successfully', course })
  } catch (error) {
    res.status(500).json({ error: 'Failed to enroll' })
  }
})

export default router
