const express = require('express');
const rateLimit = require('express-rate-limit');
const { 
  registerValidation, 
  loginValidation, 
  handleValidationErrors 
} = require('../middleware/validation');
const { authenticateToken } = require('../middleware/auth');
const {
  register,
  login,
  getProfile,
  updateProfile,
  logoutUser,
  fetchUsers
} = require('../controllers/authController');

const router = express.Router();

// Rate limiting for auth routes (more lenient for development)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // limit each IP to 20 requests per windowMs (increased from 5)
  message: {
    success: false,
    message: 'Too many authentication attempts, please try again later'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Register route
router.post('/register', 
  authLimiter,
  registerValidation,
  handleValidationErrors,
  register
);

// Login route
router.post('/login',
  authLimiter,
  loginValidation,
  handleValidationErrors,
  login
);

// Logout route
router.post('/logout',
  logoutUser
);

// Fetch all users
router.get('/getFaculties', authenticateToken, fetchUsers);

// Protected routes
router.get('/profile', authenticateToken, getProfile);
router.put('/profile', authenticateToken, updateProfile);

module.exports = router; 