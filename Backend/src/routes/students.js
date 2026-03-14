const express = require('express');
const { authenticateToken } = require('../middleware/auth');
const {
  addStudent,
  getAllStudents,
  getStudentById,
  updateStudent,
  updateStudentMarks,
  deleteStudent,
  uploadStudents
} = require('../controllers/studentController');

const router = express.Router();

// Student routes
router.post('/', authenticateToken, addStudent);
router.post('/getStudents', authenticateToken, getAllStudents);
router.post('/getStudent', authenticateToken, getStudentById);
router.put('/:id', authenticateToken, updateStudent);
router.delete('/:id', authenticateToken, deleteStudent);
router.post('/upload-excel', authenticateToken, uploadStudents);

module.exports = router;