// routes/studentRoutes.js
const express = require('express');
const rateLimit = require('express-rate-limit');
const { 
  createStudentValidation,
  updateStudentValidation,
  handleValidationErrors
} = require('../../middleware/validation');
const { authenticateToken } = require('../../middleware/auth');
const {
  createStudent,
  getStudents,
  getStudentById,
  updateStudent,
  deleteStudent
} = require('../../controllers/studentController');

const router = express.Router();

// Rate limiting for student creation (optional)
const studentCreateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // allow up to 20 student creations per window
  message: {
    success: false,
    message: 'Too many requests, please try again later'
  }
});

// Create a new student
router.post(
  '/',
  authenticateToken,
  studentCreateLimiter,
  createStudentValidation,
  handleValidationErrors,
  createStudent
);

// Get all students
router.get(
  '/',
  authenticateToken,
  getStudents
);

// Get a single student by ID
router.get(
  '/:id',
  authenticateToken,
  getStudentById
);

// Update a student
router.put(
  '/:id',
  authenticateToken,
  updateStudentValidation,
  handleValidationErrors,
  updateStudent
);

// Delete a student
router.delete(
  '/:id',
  authenticateToken,
  deleteStudent
);

module.exports = router;
