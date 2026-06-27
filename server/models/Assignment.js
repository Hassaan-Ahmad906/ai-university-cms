import mongoose from 'mongoose'

const assignmentSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, default: '' },
  course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  teacher: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  dueDate: { type: Date, required: true },
  totalMarks: { type: Number, required: true, default: 100 },
  status: { type: String, enum: ['active', 'expired', 'draft'], default: 'active' },
  attachments: [{ name: String, url: String }],
}, { timestamps: true })

export default mongoose.model('Assignment', assignmentSchema)
