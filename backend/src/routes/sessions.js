const express = require('express');
const ClassSession = require('../models/ClassSession');
const Class = require('../models/Class');

const router = express.Router();

// @route   GET /api/sessions
// @desc    Get all class sessions (with optional filters)
// @access  Private
router.get('/', async (req, res) => {
  try {
    const { class: classId, date, isCompleted } = req.query;
    const filter = {};

    if (classId) filter.class = classId;
    if (date) filter.date = { $gte: new Date(date) };
    if (isCompleted !== undefined) filter.isCompleted = isCompleted === 'true';

    const sessions = await ClassSession.find(filter)
      .populate('class', 'name subject')
      .populate('attendance.student', 'firstName lastName email')
      .populate('attendance.recordedBy', 'firstName lastName')
      .sort({ date: -1 });

    res.json(sessions);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/sessions/:id
// @desc    Get class session by ID
// @access  Private
router.get('/:id', async (req, res) => {
  try {
    const session = await ClassSession.findById(req.params.id)
      .populate('class', 'name subject')
      .populate('attendance.student', 'firstName lastName email')
      .populate('attendance.recordedBy', 'firstName lastName');

    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }

    res.json(session);
  } catch (error) {
    console.error(error.message);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Session not found' });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/sessions
// @desc    Create a new class session
// @access  Private (Teachers only)
router.post('/', async (req, res) => {
  try {
    const { class: classId, date, startTime, endTime, topic, content, materials } = req.body;

    // Check if class exists
    const classDoc = await Class.findById(classId);
    if (!classDoc) {
      return res.status(400).json({ message: 'Invalid class' });
    }

    const newSession = new ClassSession({
      class: classId,
      date,
      startTime,
      endTime,
      topic,
      content,
      materials: materials || []
    });

    const session = await newSession.save();
    await session.populate('class', 'name subject');

    res.json(session);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/sessions/:id
// @desc    Update a class session
// @access  Private (Teachers only)
router.put('/:id', async (req, res) => {
  try {
    const { date, startTime, endTime, topic, content, materials, isCompleted, notes } = req.body;

    const session = await ClassSession.findById(req.params.id);
    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }

    // Update fields
    if (date !== undefined) session.date = date;
    if (startTime !== undefined) session.startTime = startTime;
    if (endTime !== undefined) session.endTime = endTime;
    if (topic !== undefined) session.topic = topic;
    if (content !== undefined) session.content = content;
    if (materials !== undefined) session.materials = materials;
    if (isCompleted !== undefined) session.isCompleted = isCompleted;
    if (notes !== undefined) session.notes = notes;

    const updatedSession = await session.save();
    await updatedSession.populate('class', 'name subject');

    res.json(updatedSession);
  } catch (error) {
    console.error(error.message);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Session not found' });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/sessions/:id
// @desc    Delete a class session
// @access  Private (Teachers only)
router.delete('/:id', async (req, res) => {
  try {
    const session = await ClassSession.findById(req.params.id);
    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }

    await session.remove();
    res.json({ message: 'Session removed' });
  } catch (error) {
    console.error(error.message);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Session not found' });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/sessions/:id/attendance
// @desc    Record attendance for a session
// @access  Private (Teachers only)
router.post('/:id/attendance', async (req, res) => {
  try {
    const { attendance } = req.body;
    const session = await ClassSession.findById(req.params.id);

    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }

    // Update attendance records
    session.attendance = attendance;
    await session.save();

    await session.populate('attendance.student', 'firstName lastName email');
    await session.populate('attendance.recordedBy', 'firstName lastName');

    res.json(session);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/sessions/class/:classId/attendance-summary
// @desc    Get attendance summary for a class
// @access  Private
router.get('/class/:classId/attendance-summary', async (req, res) => {
  try {
    const { classId } = req.params;
    const { startDate, endDate } = req.query;

    const filter = { class: classId };
    if (startDate && endDate) {
      filter.date = { $gte: new Date(startDate), $lte: new Date(endDate) };
    }

    const sessions = await ClassSession.find(filter)
      .populate('attendance.student', 'firstName lastName email')
      .sort({ date: 1 });

    // Calculate attendance summary
    const summary = {};
    sessions.forEach(session => {
      session.attendance.forEach(record => {
        const studentId = record.student._id.toString();
        if (!summary[studentId]) {
          summary[studentId] = {
            student: record.student,
            totalSessions: 0,
            present: 0,
            absent: 0,
            late: 0,
            excused: 0
          };
        }
        
        summary[studentId].totalSessions++;
        summary[studentId][record.status]++;
      });
    });

    res.json(Object.values(summary));
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 