import mongoose from 'mongoose'

const gradeSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  semester: { type: String, required: true },
  assignments: { type: Number, default: 0 },
  quizzes: { type: Number, default: 0 },
  midterm: { type: Number, default: 0 },
  final: { type: Number, default: 0 },
  total: { type: Number, default: 0 },
  grade: { type: String, enum: ['A', 'A-', 'B+', 'B', 'B-', 'C+', 'C', 'C-', 'D', 'F', 'W', 'I'], default: 'I' },
  gpa: { type: Number, default: 0, min: 0, max: 4 },
}, { timestamps: true })

gradeSchema.index({ student: 1, course: 1, semester: 1 }, { unique: true })

export default mongoose.model('Grade', gradeSchema)
