const mongoose = require('mongoose');

const classSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  subject: {
    type: String,
    required: true,
    trim: true
  },
  teacher: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  students: [{
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    enrolledAt: {
      type: Date,
      default: Date.now
    },
    isActive: {
      type: Boolean,
      default: true
    }
  }],
  schedule: {
    dayOfWeek: {
      type: String,
      enum: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
    },
    startTime: String,
    endTime: String,
    room: String
  },
  academicYear: {
    type: String,
    required: true
  },
  semester: {
    type: String,
    enum: ['fall', 'spring', 'summer'],
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  maxStudents: {
    type: Number,
    default: 30
  }
}, {
  timestamps: true
});

// Index for efficient queries
classSchema.index({ teacher: 1, academicYear: 1, semester: 1 });
classSchema.index({ 'students.student': 1 });

module.exports = mongoose.model('Class', classSchema); 