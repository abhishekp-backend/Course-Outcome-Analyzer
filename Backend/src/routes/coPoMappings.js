const express = require('express');
const { authenticateToken } = require('../middleware/auth');
const {
  createMapping,
  getMappingsBySubject,
  updateMapping,
  deleteMapping,
  calculatePOAttainment
} = require('../controllers/coPoMappingController');

const router = express.Router();

// All routes require authentication
router.use(authenticateToken);

// Create CO-PO mapping
router.post('/', createMapping);

// Get all mappings for a subject
router.get('/subject/:subjectId', getMappingsBySubject);

// Calculate PO attainment
router.post('/subject/:subjectId/po-attainment', calculatePOAttainment);

// Update mapping
router.put('/:id', updateMapping);

// Delete mapping
router.delete('/:id', deleteMapping);

module.exports = router;

