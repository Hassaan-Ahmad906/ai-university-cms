import mongoose from 'mongoose'

const notificationSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, enum: ['assignment', 'payment', 'announcement', 'alert', 'event', 'ai', 'message'], required: true },
  title: { type: String, required: true },
  message: { type: String, required: true },
  read: { type: Boolean, default: false },
  link: { type: String, default: '' },
}, { timestamps: true })

notificationSchema.index({ user: 1, read: 1 })

export default mongoose.model('Notification', notificationSchema)
