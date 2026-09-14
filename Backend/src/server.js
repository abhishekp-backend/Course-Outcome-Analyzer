// Suppress dotenv logging
process.env.DOTENV_CONFIG_SILENT = 'true';
process.env.DOTENV_CONFIG_DEBUG = 'false';
require('dotenv').config();
const express = require('express');
const cookieParser = require("cookie-parser")
const morgan = require('morgan');
const connectDB = require('./config/database');
const { setupSecurity } = require('./middleware/security');
const { errorHandler } = require('./middleware/errorHandler');
const routes = require('./routes');

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to database
connectDB();

// Security middleware
setupSecurity(app);

// Body parser
app.use(cookieParser())
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Logging middleware
// Custom minimal logging format
morgan.token('simple-message', (req, res) => {
  const path = req.originalUrl;
  const status = res.statusCode;
  const isSuccess = status >= 200 && status < 300;
  console.log("Status: ", status);
  
  if (path.includes('/api/auth/register') && req.method === 'POST') {
    return isSuccess ? 'Account created successfully' : 'Account creation failed';
  } else if (path.includes('/api/auth/login') && req.method === 'POST') {
    return isSuccess ? 'Login successful' : 'Login failed';
  }
  return `${status} - ${path}`;
});

app.use(morgan(':simple-message'));


// API routes
app.use('/api', routes);

// 404 handler for undefined routes
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`
  });
});

// Error handling middleware (must be last)
app.use(errorHandler);

// Start server
const server = app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  server.close(() => {
    console.log('Process terminated');
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully');
  server.close(() => {
    console.log('Process terminated');
  });
});

module.exports = app;