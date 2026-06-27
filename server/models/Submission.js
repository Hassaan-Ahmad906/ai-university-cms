import mongoose from 'mongoose'

const submissionSchema = new mongoose.Schema({
  assignment: { type: mongoose.Schema.Types.ObjectId, ref: 'Assignment', required: true },
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  content: { type: String, default: '' },
  attachments: [{ name: String, url: String }],
  marks: { type: Number, default: null },
  feedback: { type: String, default: '' },
  gradedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  gradedAt: { type: Date },
  status: { type: String, enum: ['submitted', 'graded', 'late', 'resubmitted'], default: 'submitted' },
}, { timestamps: true })

submissionSchema.index({ assignment: 1, student: 1 }, { unique: true })

export default mongoose.model('Submission', submissionSchema)
