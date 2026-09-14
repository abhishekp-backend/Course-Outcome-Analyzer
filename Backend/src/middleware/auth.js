const jwt = require("jsonwebtoken");
const User = require("../models/User");
const HodUser = require("../models/HodUser");

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

// ==========================================
// AUTHENTICATE TOKEN
// ==========================================
const authenticateToken = async (req, res, next) => {
  try {
    // Get JWT from HTTP-only cookie
    const token = req.cookies?.auth_token;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Access token required",
      });
    }

    // Verify JWT
    const decoded = jwt.verify(token, JWT_SECRET);

    // ==========================================
    // ADMIN MANAGER
    // ==========================================
    if (decoded.role === "ADMIN-Manager") {
      /*
       * Admin currently uses a fixed admin account.
       *
       * Since generateToken() stores the username,
       * we verify that username here.
       */
      if (decoded.username !== "admin@bvdu.com") {
        return res.status(401).json({
          success: false,
          message: "Invalid admin credentials",
        });
      }

      req.user = {
        _id: decoded.userId,
        username: decoded.username,
        role: "ADMIN-Manager",
      };

      return next();
    }

    // ==========================================
    // HOD
    // ==========================================
    if (decoded.role === "HOD") {
      /*
       * decoded.userId contains hodUser._id.
       *
       * Therefore we MUST search using findById(),
       * NOT:
       *
       * HodUser.findOne({ email: decoded.userId })
       */
      const hodUser = await HodUser.findById(decoded.userId)
        .select("-password");

      if (!hodUser) {
        return res.status(401).json({
          success: false,
          message: "HOD not found",
        });
      }

      if (!hodUser.isActive) {
        return res.status(403).json({
          success: false,
          message: "HOD account is inactive",
        });
      }

      req.user = {
        ...hodUser.toObject(),
        role: "HOD",
      };

      return next();
    }

    // ==========================================
    // FACULTY
    // ==========================================
    if (decoded.role === "FACULTY") {
      /*
       * decoded.userId contains User._id.
       */
      const facultyUser = await User.findById(decoded.userId)
        .select("-password");

      if (!facultyUser) {
        return res.status(401).json({
          success: false,
          message: "Faculty user not found",
        });
      }

      if (!facultyUser.isActive) {
        return res.status(403).json({
          success: false,
          message: "Faculty account is inactive",
        });
      }

      req.user = {
        ...facultyUser.toObject(),
        role: "FACULTY",
      };

      console.log(req.user);

      return next();
    }

    // ==========================================
    // INVALID / UNKNOWN ROLE
    // ==========================================
    return res.status(403).json({
      success: false,
      message: "Invalid user role",
    });

  } catch (error) {
    // ==========================================
    // TOKEN EXPIRED
    // ==========================================
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        message: "Token expired",
      });
    }

    // ==========================================
    // INVALID TOKEN
    // ==========================================
    if (error.name === "JsonWebTokenError") {
      return res.status(403).json({
        success: false,
        message: "Invalid token",
      });
    }

    // ==========================================
    // OTHER ERRORS
    // ==========================================
    console.error("Auth middleware error:", error);

    return res.status(500).json({
      success: false,
      message: "Authentication error",
    });
  }
};

// ==========================================
// GENERATE TOKEN
// ==========================================
const generateToken = (userId, username, role, branchId) => {
  return jwt.sign(
    {
      userId,
      username,
      role,
      branchId,
    },
    JWT_SECRET,
    {
      expiresIn: "24h",
    }
  );
};

module.exports = {
  authenticateToken,
  generateToken,
};