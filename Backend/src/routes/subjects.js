const express = require('express');
const { authenticateToken } = require('../middleware/auth');
const subjectController = require('../controllers/subjectController');

const router = express.Router();

// All routes require authentication
router.use(authenticateToken);

// Get all subjects for a user
router.get('/', subjectController.getUserSubjects);

// Get subject information
router.get('/subjectInfo/:id', subjectController.getSubject);

// Get yearly subject for admin
router.get('/academic-year/:academicYearId', subjectController.getAcademicSubjects);

// Create a new subject
router.post('/', subjectController.createSubject);

// Update a subject
router.put('/:id', subjectController.updateSubject);

// Delete a subject
router.delete('/:id', subjectController.deleteSubject);

module.exports = router;