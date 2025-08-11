const mongoose = require('mongoose');

const submissionSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  submittedAt: {
    type: Date,
    default: Date.now
  },
  files: [{
    name: String,
    fileUrl: String,
    fileType: String
  }],
  grade: {
    score: {
      type: Number,
      min: 0,
      max: 100
    },
    feedback: String,
    gradedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    gradedAt: Date
  },
  status: {
    type: String,
    enum: ['submitted', 'graded', 'late', 'not_submitted'],
    default: 'not_submitted'
  }
});

const assignmentSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  class: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Class',
    required: true
  },
  type: {
    type: String,
    enum: ['homework', 'test', 'quiz', 'project', 'exam'],
    required: true
  },
  dueDate: {
    type: Date,
    required: true
  },
  maxScore: {
    type: Number,
    default: 100
  },
  weight: {
    type: Number,
    default: 1,
    min: 0,
    max: 10
  },
  instructions: String,
  attachments: [{
    name: String,
    fileUrl: String,
    fileType: String
  }],
  submissions: [submissionSchema],
  isPublished: {
    type: Boolean,
    default: false
  },
  allowLateSubmission: {
    type: Boolean,
    default: false
  },
  latePenalty: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  }
}, {
  timestamps: true
});

// Index for efficient queries
assignmentSchema.index({ class: 1, dueDate: 1 });
assignmentSchema.index({ 'submissions.student': 1 });

module.exports = mongoose.model('Assignment', assignmentSchema); 