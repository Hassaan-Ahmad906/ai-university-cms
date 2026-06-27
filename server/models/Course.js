import mongoose from 'mongoose'

const courseSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    unique: true,
    uppercase: true,
    trim: true,
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    default: '',
  },
  department: {
    type: String,
    required: true,
  },
  creditHours: {
    type: Number,
    required: true,
    min: 1,
    max: 6,
  },
  teacher: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  students: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }],
  semester: {
    type: String,
    required: true,
  },
  schedule: {
    type: String,
    default: '',
  },
  room: {
    type: String,
    default: '',
  },
  maxStudents: {
    type: Number,
    default: 50,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
}, { timestamps: true })

export default mongoose.model('Course', courseSchema)
