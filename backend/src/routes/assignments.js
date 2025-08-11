const express = require('express');
const Assignment = require('../models/Assignment');
const Class = require('../models/Class');

const router = express.Router();

// @route   GET /api/assignments
// @desc    Get all assignments (with optional filters)
// @access  Private
router.get('/', async (req, res) => {
  try {
    const { class: classId, type, isPublished, student } = req.query;
    const filter = {};

    if (classId) filter.class = classId;
    if (type) filter.type = type;
    if (isPublished !== undefined) filter.isPublished = isPublished === 'true';
    if (student) filter['submissions.student'] = student;

    const assignments = await Assignment.find(filter)
      .populate('class', 'name subject')
      .populate('submissions.student', 'firstName lastName email')
      .populate('submissions.gradedBy', 'firstName lastName')
      .sort({ dueDate: 1 });

    res.json(assignments);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/assignments/:id
// @desc    Get assignment by ID
// @access  Private
router.get('/:id', async (req, res) => {
  try {
    const assignment = await Assignment.findById(req.params.id)
      .populate('class', 'name subject')
      .populate('submissions.student', 'firstName lastName email')
      .populate('submissions.gradedBy', 'firstName lastName');

    if (!assignment) {
      return res.status(404).json({ message: 'Assignment not found' });
    }

    res.json(assignment);
  } catch (error) {
    console.error(error.message);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Assignment not found' });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/assignments
// @desc    Create a new assignment
// @access  Private (Teachers only)
router.post('/', async (req, res) => {
  try {
    const { title, description, class: classId, type, dueDate, maxScore, weight, instructions, attachments } = req.body;

    // Check if class exists
    const classDoc = await Class.findById(classId);
    if (!classDoc) {
      return res.status(400).json({ message: 'Invalid class' });
    }

    const newAssignment = new Assignment({
      title,
      description,
      class: classId,
      type,
      dueDate,
      maxScore,
      weight,
      instructions,
      attachments: attachments || []
    });

    const assignment = await newAssignment.save();
    await assignment.populate('class', 'name subject');

    res.json(assignment);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/assignments/:id
// @desc    Update an assignment
// @access  Private (Teachers only)
router.put('/:id', async (req, res) => {
  try {
    const { title, description, type, dueDate, maxScore, weight, instructions, attachments, isPublished } = req.body;

    const assignment = await Assignment.findById(req.params.id);
    if (!assignment) {
      return res.status(404).json({ message: 'Assignment not found' });
    }

    // Update fields
    if (title !== undefined) assignment.title = title;
    if (description !== undefined) assignment.description = description;
    if (type !== undefined) assignment.type = type;
    if (dueDate !== undefined) assignment.dueDate = dueDate;
    if (maxScore !== undefined) assignment.maxScore = maxScore;
    if (weight !== undefined) assignment.weight = weight;
    if (instructions !== undefined) assignment.instructions = instructions;
    if (attachments !== undefined) assignment.attachments = attachments;
    if (isPublished !== undefined) assignment.isPublished = isPublished;

    const updatedAssignment = await assignment.save();
    await updatedAssignment.populate('class', 'name subject');

    res.json(updatedAssignment);
  } catch (error) {
    console.error(error.message);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Assignment not found' });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/assignments/:id
// @desc    Delete an assignment
// @access  Private (Teachers only)
router.delete('/:id', async (req, res) => {
  try {
    const assignment = await Assignment.findById(req.params.id);
    if (!assignment) {
      return res.status(404).json({ message: 'Assignment not found' });
    }

    await assignment.remove();
    res.json({ message: 'Assignment removed' });
  } catch (error) {
    console.error(error.message);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Assignment not found' });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/assignments/:id/submit
// @desc    Submit an assignment
// @access  Private (Students only)
router.post('/:id/submit', async (req, res) => {
  try {
    const { files } = req.body;
    const assignment = await Assignment.findById(req.params.id);

    if (!assignment) {
      return res.status(404).json({ message: 'Assignment not found' });
    }

    if (!assignment.isPublished) {
      return res.status(400).json({ message: 'Assignment is not published' });
    }

    // Check if already submitted
    const existingSubmission = assignment.submissions.find(
      sub => sub.student.toString() === req.user.id
    );

    if (existingSubmission) {
      return res.status(400).json({ message: 'Assignment already submitted' });
    }

    // Add submission
    assignment.submissions.push({
      student: req.user.id,
      files: files || [],
      status: 'submitted'
    });

    await assignment.save();
    await assignment.populate('submissions.student', 'firstName lastName email');

    res.json(assignment);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/assignments/:id/grade/:submissionId
// @desc    Grade a submission
// @access  Private (Teachers only)
router.put('/:id/grade/:submissionId', async (req, res) => {
  try {
    const { score, feedback } = req.body;
    const assignment = await Assignment.findById(req.params.id);

    if (!assignment) {
      return res.status(404).json({ message: 'Assignment not found' });
    }

    const submission = assignment.submissions.id(req.params.submissionId);
    if (!submission) {
      return res.status(404).json({ message: 'Submission not found' });
    }

    // Update grade
    submission.grade = {
      score,
      feedback,
      gradedBy: req.user.id,
      gradedAt: new Date()
    };
    submission.status = 'graded';

    await assignment.save();
    await assignment.populate('submissions.gradedBy', 'firstName lastName');

    res.json(assignment);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/assignments/class/:classId/grades
// @desc    Get grades summary for a class
// @access  Private
router.get('/class/:classId/grades', async (req, res) => {
  try {
    const { classId } = req.params;
    const assignments = await Assignment.find({ class: classId, isPublished: true })
      .populate('submissions.student', 'firstName lastName email')
      .populate('submissions.grade.gradedBy', 'firstName lastName');

    // Calculate grades summary
    const summary = {};
    assignments.forEach(assignment => {
      assignment.submissions.forEach(submission => {
        const studentId = submission.student._id.toString();
        if (!summary[studentId]) {
          summary[studentId] = {
            student: submission.student,
            assignments: [],
            totalScore: 0,
            totalWeight: 0,
            averageGrade: 0
          };
        }

        if (submission.grade && submission.grade.score !== undefined) {
          const grade = {
            assignment: assignment.title,
            score: submission.grade.score,
            maxScore: assignment.maxScore,
            weight: assignment.weight,
            percentage: (submission.grade.score / assignment.maxScore) * 100
          };

          summary[studentId].assignments.push(grade);
          summary[studentId].totalScore += (grade.percentage * assignment.weight);
          summary[studentId].totalWeight += assignment.weight;
        }
      });
    });

    // Calculate average grades
    Object.values(summary).forEach(student => {
      if (student.totalWeight > 0) {
        student.averageGrade = student.totalScore / student.totalWeight;
      }
    });

    res.json(Object.values(summary));
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 