import { Router } from 'express'
import User from '../models/User.js'
import Course from '../models/Course.js'
import Assignment from '../models/Assignment.js'
import Grade from '../models/Grade.js'
import Notification from '../models/Notification.js'
import Transcript from '../models/Transcript.js'
import { protect } from '../middleware/auth.js'

const router = Router()
router.use(protect)

// ── GET /api/dashboard/stats ── Role-aware dashboard data
router.get('/stats', async (req, res) => {
  try {
    const { role, id } = req.user
    const stats = {}

    switch (role) {
      case 'student': {
        const courses = await Course.countDocuments({ students: id })
        const pendingAssignments = await Assignment.countDocuments({ status: 'active' })
        const grades = await Grade.find({ student: id }).populate('course', 'creditHours')
        let cgpa = 0
        if (grades.length > 0) {
          let totalPoints = 0, totalCredits = 0
          grades.forEach(g => {
            const credits = g.course?.creditHours || 3
            totalPoints += g.gpa * credits
            totalCredits += credits
          })
          cgpa = totalCredits > 0 ? Number((totalPoints / totalCredits).toFixed(2)) : 0
        }
        const unreadNotifs = await Notification.countDocuments({ user: id, read: false })
        Object.assign(stats, { cgpa, enrolledCourses: courses, pendingAssignments, attendance: 87, unreadNotifications: unreadNotifs })
        break
      }

      case 'teacher': {
        const courses = await Course.countDocuments({ teacher: id })
        const totalStudents = await Course.aggregate([
          { $match: { teacher: id } },
          { $project: { count: { $size: '$students' } } },
          { $group: { _id: null, total: { $sum: '$count' } } }
        ])
        const pendingGrading = await Assignment.countDocuments({ teacher: id, status: 'active' })
        Object.assign(stats, {
          activeCourses: courses,
          totalStudents: totalStudents[0]?.total || 0,
          pendingGrading,
          avgAttendance: 84,
        })
        break
      }

      case 'admin': {
        const totalStudents = await User.countDocuments({ role: 'student', isActive: true })
        const totalFaculty = await User.countDocuments({ role: 'teacher', isActive: true })
        const activeCourses = await Course.countDocuments({ isActive: true })
        const departments = await User.distinct('department')
        Object.assign(stats, {
          totalStudents,
          totalFaculty,
          activeCourses,
          departments: departments.length,
          revenue: '₨ 45.2M',
          aiQueries: 1234,
        })
        break
      }

      case 'registrar': {
        const totalRequests = await Transcript.countDocuments()
        const pending = await Transcript.countDocuments({ status: { $in: ['pending', 'processing'] } })
        const ready = await Transcript.countDocuments({ status: 'ready' })
        const totalStudents = await User.countDocuments({ role: 'student', isActive: true })
        Object.assign(stats, { totalRequests, pending, ready, totalStudents })
        break
      }

      default: {
        const totalUsers = await User.countDocuments({ isActive: true })
        const totalCourses = await Course.countDocuments({ isActive: true })
        Object.assign(stats, { totalUsers, totalCourses })
      }
    }

    res.json({ role, stats })
  } catch (error) {
    console.error('Dashboard stats error:', error)
    res.status(500).json({ error: 'Failed to fetch dashboard stats' })
  }
})

export default router
