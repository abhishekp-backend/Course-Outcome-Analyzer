const express = require('express');
const { authenticateToken } = require('../middleware/auth');
const {
  createPO,
  getAllPOs,
  updatePO,
  deletePO
} = require('../controllers/poController');

const router = express.Router();

// All routes require authentication
router.use(authenticateToken);

// Create a new PO
router.post('/', createPO);

// Get all POs
router.get('/', getAllPOs);

// Update a PO
router.put('/:id', updatePO);

// Delete a PO
router.delete('/:id', deletePO);

module.exports = router;

