const express = require('express');
const { authenticateToken } = require('../middleware/auth');
const {
  createCO,
  getCOsBySubject,
  updateCO,
  deleteCO,
  calculateCOAttainment
} = require('../controllers/coController');

const router = express.Router();

// All routes require authentication
router.use(authenticateToken);

// Create a new CO
router.post('/', createCO);

// Calculate CO attainment
router.get('/class/:classId', calculateCOAttainment);

// Get all COs for a subject
router.get('/subject/:classId', getCOsBySubject);


// Update a CO
router.post('/updateCO', updateCO);

// Delete a CO
router.delete('/:id', deleteCO);

module.exports = router;

