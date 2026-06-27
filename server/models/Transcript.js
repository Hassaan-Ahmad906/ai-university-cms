import mongoose from 'mongoose'

const transcriptSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, enum: ['transcript', 'degree_verification', 'migration_certificate', 'enrollment_letter'], required: true },
  status: { type: String, enum: ['pending', 'processing', 'ready', 'collected', 'rejected'], default: 'pending' },
  requestDate: { type: Date, default: Date.now },
  expectedDate: { type: Date },
  processedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  notes: { type: String, default: '' },
}, { timestamps: true })

export default mongoose.model('Transcript', transcriptSchema)
