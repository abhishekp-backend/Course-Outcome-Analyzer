const express = require('express');
const authRoutes = require('./auth');
const subjectRoutes = require('./subjects');
const studentRoutes = require('./students');
const coRoutes = require('./cos');
const poRoutes = require('./pos');
const coPoMappingRoutes = require('./coPoMappings');
const academicYearRoutes = require('./academic');
const branch = require("./branch")
const classes = require("./class")

const router = express.Router();

// Health check route
router.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// API routes
router.use('/auth', authRoutes);
router.use('/subjects', subjectRoutes);
router.use('/students', studentRoutes);
router.use('/cos', coRoutes);
router.use('/pos', poRoutes);
router.use('/co-po-mappings', coPoMappingRoutes);
router.use('/academic', academicYearRoutes);
router.use('/branch', branch);
router.use('/class', classes);

// Note: 404 handling will be done in the main server.js file

module.exports = router;