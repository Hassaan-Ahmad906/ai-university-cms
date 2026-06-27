/**
 * Database Seeder — Populates MongoDB with realistic mock data
 * Run: node server/utils/seedData.js
 */
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import User from '../models/User.js'
import Course from '../models/Course.js'
import Assignment from '../models/Assignment.js'
import Grade from '../models/Grade.js'
import Notification from '../models/Notification.js'

dotenv.config()

const USERS = [
  { email: 'admin@pu.edu.pk', password: 'demo123', firstName: 'Muhammad', lastName: 'Ali', role: 'admin', department: 'IT Administration' },
  { email: 'vc@pu.edu.pk', password: 'demo123', firstName: 'Prof. Dr. Khalid', lastName: 'Mahmood', role: 'vc', department: 'Vice Chancellor Office' },
  { email: 'dean@pu.edu.pk', password: 'demo123', firstName: 'Dr. Usman', lastName: 'Tariq', role: 'dean', department: 'Faculty of Computing' },
  { email: 'hod@pu.edu.pk', password: 'demo123', firstName: 'Prof. Fatima', lastName: 'Zahra', role: 'hod', department: 'Computer Science' },
  { email: 'teacher@pu.edu.pk', password: 'demo123', firstName: 'Dr. Sarah', lastName: 'Malik', role: 'teacher', department: 'Computer Science' },
  { email: 'teacher2@pu.edu.pk', password: 'demo123', firstName: 'Dr. Ahmad', lastName: 'Khan', role: 'teacher', department: 'Computer Science' },
  { email: 'student@pu.edu.pk', password: 'demo123', firstName: 'Ahmed', lastName: 'Khan', role: 'student', department: 'Computer Science', rollNumber: 'CS-2022-045', semester: 6, program: 'BS Computer Science' },
  { email: 'student2@pu.edu.pk', password: 'demo123', firstName: 'Sara', lastName: 'Malik', role: 'student', department: 'Computer Science', rollNumber: 'CS-2022-089', semester: 6, program: 'BS Computer Science' },
  { email: 'student3@pu.edu.pk', password: 'demo123', firstName: 'Usman', lastName: 'Raza', role: 'student', department: 'Computer Science', rollNumber: 'CS-2022-112', semester: 6, program: 'BS Computer Science' },
  { email: 'student4@pu.edu.pk', password: 'demo123', firstName: 'Fatima', lastName: 'Ali', role: 'student', department: 'Computer Science', rollNumber: 'CS-2022-067', semester: 6, program: 'BS Computer Science' },
  { email: 'student5@pu.edu.pk', password: 'demo123', firstName: 'Ali', lastName: 'Hassan', role: 'student', department: 'Computer Science', rollNumber: 'CS-2022-134', semester: 6, program: 'BS Computer Science' },
  { email: 'registrar@pu.edu.pk', password: 'demo123', firstName: 'Dr. Amina', lastName: 'Bibi', role: 'registrar', department: 'Registrar Office' },
  { email: 'treasurer@pu.edu.pk', password: 'demo123', firstName: 'Mr. Faisal', lastName: 'Shahzad', role: 'treasurer', department: 'Treasury' },
  { email: 'clerk@pu.edu.pk', password: 'demo123', firstName: 'Ayesha', lastName: 'Siddiqui', role: 'clerk', department: 'Administration' },
  { email: 'controller@pu.edu.pk', password: 'demo123', firstName: 'Dr. Nasir', lastName: 'Hussain', role: 'controller', department: 'Controller of Examinations' },
]

async function seed() {
  const uri = process.env.MONGODB_URI
  if (!uri || uri.includes('YOUR_PASSWORD_HERE')) {
    console.log('❌ Configure MONGODB_URI in .env first!')
    console.log('   See setup_guide.md for instructions')
    process.exit(1)
  }

  try {
    await mongoose.connect(uri)
    console.log('✅ Connected to MongoDB')

    // Clear existing data
    console.log('🗑️  Clearing existing data...')
    await Promise.all([
      User.deleteMany({}),
      Course.deleteMany({}),
      Assignment.deleteMany({}),
      Grade.deleteMany({}),
      Notification.deleteMany({}),
    ])

    // Create users
    console.log('👥 Creating users...')
    const users = await User.create(USERS)
    const userMap = {}
    users.forEach(u => { userMap[u.email] = u })

    const teacher1 = userMap['teacher@pu.edu.pk']
    const teacher2 = userMap['teacher2@pu.edu.pk']
    const students = users.filter(u => u.role === 'student')
    const studentIds = students.map(s => s._id)

    // Create courses
    console.log('📚 Creating courses...')
    const courses = await Course.create([
      { code: 'CS-301', name: 'Data Structures & Algorithms', department: 'Computer Science', creditHours: 3, teacher: teacher1._id, students: studentIds, semester: 'Spring 2026', room: 'Room 204', schedule: 'Mon/Wed 10:00-11:30' },
      { code: 'CS-401', name: 'Artificial Intelligence', department: 'Computer Science', creditHours: 3, teacher: teacher1._id, students: studentIds.slice(0, 3), semester: 'Spring 2026', room: 'Lab 3', schedule: 'Tue/Thu 12:00-1:30' },
      { code: 'CS-205', name: 'Object Oriented Programming', department: 'Computer Science', creditHours: 3, teacher: teacher2._id, students: studentIds, semester: 'Spring 2026', room: 'Room 112', schedule: 'Mon/Wed 3:00-4:30' },
      { code: 'CS-310', name: 'Database Systems', department: 'Computer Science', creditHours: 3, teacher: teacher2._id, students: studentIds.slice(0, 4), semester: 'Spring 2026', room: 'Room 301', schedule: 'Tue/Thu 9:00-10:30' },
      { code: 'CS-350', name: 'Computer Networks', department: 'Computer Science', creditHours: 3, teacher: teacher1._id, students: studentIds.slice(1, 5), semester: 'Spring 2026', room: 'Room 205', schedule: 'Wed/Fri 11:00-12:30' },
      { code: 'MATH-201', name: 'Linear Algebra', department: 'Mathematics', creditHours: 3, teacher: teacher2._id, students: studentIds, semester: 'Spring 2026', room: 'Room 101', schedule: 'Mon/Wed 8:00-9:30' },
    ])

    // Create assignments
    console.log('📝 Creating assignments...')
    const now = new Date()
    await Assignment.create([
      { title: 'Binary Tree Implementation', description: 'Implement AVL tree with insertion and deletion', course: courses[0]._id, teacher: teacher1._id, dueDate: new Date(now.getTime() + 3 * 24 * 3600000), totalMarks: 100, status: 'active' },
      { title: 'Graph Traversal Algorithms', description: 'Implement BFS and DFS with real-world applications', course: courses[0]._id, teacher: teacher1._id, dueDate: new Date(now.getTime() + 7 * 24 * 3600000), totalMarks: 80, status: 'active' },
      { title: 'AI Project Proposal', description: 'Submit your semester project proposal', course: courses[1]._id, teacher: teacher1._id, dueDate: new Date(now.getTime() + 5 * 24 * 3600000), totalMarks: 50, status: 'active' },
      { title: 'OOP Design Patterns', description: 'Implement Observer and Strategy patterns in Java', course: courses[2]._id, teacher: teacher2._id, dueDate: new Date(now.getTime() + 10 * 24 * 3600000), totalMarks: 100, status: 'active' },
      { title: 'SQL Query Optimization', description: 'Optimize the given queries and explain your approach', course: courses[3]._id, teacher: teacher2._id, dueDate: new Date(now.getTime() - 2 * 24 * 3600000), totalMarks: 60, status: 'expired' },
      { title: 'Network Protocol Analysis', description: 'Analyze TCP/IP packet captures using Wireshark', course: courses[4]._id, teacher: teacher1._id, dueDate: new Date(now.getTime() + 14 * 24 * 3600000), totalMarks: 80, status: 'draft' },
    ])

    // Create grades (for previous semester)
    console.log('📊 Creating grades...')
    const gradeData = []
    for (const student of students) {
      gradeData.push(
        { student: student._id, course: courses[0]._id, semester: 'Fall 2025', assignments: 85, quizzes: 78, midterm: 72, final: 80, total: 79, grade: 'B+', gpa: 3.3 },
        { student: student._id, course: courses[2]._id, semester: 'Fall 2025', assignments: 92, quizzes: 88, midterm: 85, final: 90, total: 89, grade: 'A', gpa: 4.0 },
        { student: student._id, course: courses[5]._id, semester: 'Fall 2025', assignments: 70, quizzes: 65, midterm: 68, final: 72, total: 69, grade: 'C+', gpa: 2.3 },
      )
    }
    await Grade.create(gradeData)

    // Create notifications for student
    console.log('🔔 Creating notifications...')
    const student1 = students[0]
    await Notification.create([
      { user: student1._id, type: 'assignment', title: 'New Assignment Posted', message: 'Data Structures Assignment #6 has been posted. Due: 3 days', read: false },
      { user: student1._id, type: 'payment', title: 'Fee Payment Reminder', message: 'Your semester fee payment of ₨ 45,000 is due by June 30, 2026', read: false },
      { user: student1._id, type: 'announcement', title: 'Mid-Term Schedule Released', message: 'The Controller of Examinations has published the mid-term date sheet', read: true },
      { user: student1._id, type: 'ai', title: 'AI Study Recommendation', message: 'Based on your quiz performance, we recommend reviewing Chapter 7: Trees & Graphs', read: true },
    ])

    console.log('\n✅ DATABASE SEEDED SUCCESSFULLY!')
    console.log(`   👥 ${users.length} users created`)
    console.log(`   📚 ${courses.length} courses created`)
    console.log(`   📝 6 assignments created`)
    console.log(`   📊 ${gradeData.length} grade records created`)
    console.log(`   🔔 4 notifications created`)
    console.log('\n📋 Login Credentials (all passwords: demo123):')
    USERS.forEach(u => console.log(`   ${u.role.padEnd(12)} → ${u.email}`))

    process.exit(0)
  } catch (error) {
    console.error('❌ Seed error:', error.message)
    process.exit(1)
  }
}

seed()
