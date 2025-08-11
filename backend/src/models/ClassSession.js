const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['present', 'absent', 'late', 'excused'],
    default: 'present'
  },
  notes: String,
  recordedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
});

const classSessionSchema = new mongoose.Schema({
  class: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Class',
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  startTime: String,
  endTime: String,
  topic: {
    type: String,
    trim: true
  },
  content: {
    type: String,
    trim: true
  },
  materials: [{
    name: String,
    fileUrl: String,
    fileType: String,
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  }],
  attendance: [attendanceSchema],
  notes: String,
  isCompleted: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Index for efficient queries
classSessionSchema.index({ class: 1, date: 1 });
classSessionSchema.index({ 'attendance.student': 1 });

module.exports = mongoose.model('ClassSession', classSessionSchema); 