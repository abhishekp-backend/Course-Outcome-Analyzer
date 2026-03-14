const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const cors = require('cors');

// General rate limiter
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // limit each IP to 100 requests per windowMs
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again later'
  }
});

// CORS configuration - allow all origins for development
const corsOptions = {
  origin: true, // Allow all origins
  credentials: true,
  optionsSuccessStatus: 200
};

// Security middleware setup
const setupSecurity = (app) => {
  // Basic security headers
  app.use(helmet());
  
  // CORS
  app.use(cors(corsOptions));
  
  // Rate limiting
  app.use('/api', generalLimiter);
  
  // Body parser security
  app.use((req, res, next) => {
    if (req.body && Object.keys(req.body).length > 0) {
      // Limit payload size
      if (JSON.stringify(req.body).length > 10000) {
        return res.status(413).json({
          success: false,
          message: 'Payload too large'
        });
      }
    }
    next();
  });
};

module.exports = {
  setupSecurity
}; 