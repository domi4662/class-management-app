const express = require('express');
const Class = require('../models/Class');
const User = require('../models/User');

const router = express.Router();

// @route   GET /api/classes
// @desc    Get all classes (with optional filters)
// @access  Private
router.get('/', async (req, res) => {
  try {
    const { teacher, student, academicYear, semester, isActive } = req.query;
    const filter = {};

    if (teacher) filter.teacher = teacher;
    if (student) filter['students.student'] = student;
    if (academicYear) filter.academicYear = academicYear;
    if (semester) filter.semester = semester;
    if (isActive !== undefined) filter.isActive = isActive === 'true';

    const classes = await Class.find(filter)
      .populate('teacher', 'firstName lastName email')
      .populate('students.student', 'firstName lastName email')
      .sort({ createdAt: -1 });

    res.json(classes);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/classes/:id
// @desc    Get class by ID
// @access  Private
router.get('/:id', async (req, res) => {
  try {
    const classDoc = await Class.findById(req.params.id)
      .populate('teacher', 'firstName lastName email')
      .populate('students.student', 'firstName lastName email');

    if (!classDoc) {
      return res.status(404).json({ message: 'Class not found' });
    }

    res.json(classDoc);
  } catch (error) {
    console.error(error.message);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Class not found' });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/classes
// @desc    Create a new class
// @access  Private (Teachers only)
router.post('/', async (req, res) => {
  try {
    const { name, description, subject, teacher, schedule, academicYear, semester, maxStudents } = req.body;

    // Check if teacher exists and is actually a teacher
    const teacherUser = await User.findById(teacher);
    if (!teacherUser || teacherUser.role !== 'teacher') {
      return res.status(400).json({ message: 'Invalid teacher' });
    }

    const newClass = new Class({
      name,
      description,
      subject,
      teacher,
      schedule,
      academicYear,
      semester,
      maxStudents
    });

    const classDoc = await newClass.save();
    await classDoc.populate('teacher', 'firstName lastName email');

    res.json(classDoc);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/classes/:id
// @desc    Update a class
// @access  Private (Teacher of the class only)
router.put('/:id', async (req, res) => {
  try {
    const { name, description, subject, schedule, academicYear, semester, maxStudents, isActive } = req.body;

    const classDoc = await Class.findById(req.params.id);
    if (!classDoc) {
      return res.status(404).json({ message: 'Class not found' });
    }

    // Update fields
    if (name !== undefined) classDoc.name = name;
    if (description !== undefined) classDoc.description = description;
    if (subject !== undefined) classDoc.subject = subject;
    if (schedule !== undefined) classDoc.schedule = schedule;
    if (academicYear !== undefined) classDoc.academicYear = academicYear;
    if (semester !== undefined) classDoc.semester = semester;
    if (maxStudents !== undefined) classDoc.maxStudents = maxStudents;
    if (isActive !== undefined) classDoc.isActive = isActive;

    const updatedClass = await classDoc.save();
    await updatedClass.populate('teacher', 'firstName lastName email');

    res.json(updatedClass);
  } catch (error) {
    console.error(error.message);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Class not found' });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/classes/:id
// @desc    Delete a class
// @access  Private (Teacher of the class only)
router.delete('/:id', async (req, res) => {
  try {
    const classDoc = await Class.findById(req.params.id);
    if (!classDoc) {
      return res.status(404).json({ message: 'Class not found' });
    }

    await classDoc.remove();
    res.json({ message: 'Class removed' });
  } catch (error) {
    console.error(error.message);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Class not found' });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/classes/:id/enroll
// @desc    Enroll a student in a class
// @access  Private
router.post('/:id/enroll', async (req, res) => {
  try {
    const { studentId } = req.body;
    const classDoc = await Class.findById(req.params.id);

    if (!classDoc) {
      return res.status(404).json({ message: 'Class not found' });
    }

    // Check if student is already enrolled
    const isEnrolled = classDoc.students.some(
      enrollment => enrollment.student.toString() === studentId
    );

    if (isEnrolled) {
      return res.status(400).json({ message: 'Student already enrolled' });
    }

    // Check if class is full
    if (classDoc.students.length >= classDoc.maxStudents) {
      return res.status(400).json({ message: 'Class is full' });
    }

    classDoc.students.push({ student: studentId });
    await classDoc.save();

    await classDoc.populate('students.student', 'firstName lastName email');
    res.json(classDoc);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/classes/:id/enroll/:studentId
// @desc    Remove a student from a class
// @access  Private
router.delete('/:id/enroll/:studentId', async (req, res) => {
  try {
    const classDoc = await Class.findById(req.params.id);
    if (!classDoc) {
      return res.status(404).json({ message: 'Class not found' });
    }

    classDoc.students = classDoc.students.filter(
      enrollment => enrollment.student.toString() !== req.params.studentId
    );

    await classDoc.save();
    await classDoc.populate('students.student', 'firstName lastName email');
    
    res.json(classDoc);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 