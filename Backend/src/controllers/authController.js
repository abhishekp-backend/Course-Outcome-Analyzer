const User = require('../models/User');
const { generateToken } = require('../middleware/auth');
const { asyncHandler } = require('../middleware/errorHandler');

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public

function generateFID() {
  const now = new Date();

  const timestamp = '' +
    now.getFullYear() +
    (now.getMonth() + 101).toString().slice(1) +
    (now.getDate() + 100).toString().slice(1) +
    (now.getHours() + 100).toString().slice(1) +
    (now.getMinutes() + 100).toString().slice(1) +
    (now.getSeconds() + 100).toString().slice(1);

  const random = Math.floor(Math.random() * 0xFFFFFF).toString(16).toUpperCase();
  const randomHex = '000000'.substring(random.length) + random;

  return 'F-' + timestamp + '-' + randomHex;
}

const register = asyncHandler(async (req, res) => {
  const { username, email, password, year } = req.body;

  // Check if user already exists
  const existingUser = await User.userExists(email, username);
  if (existingUser) {
    return res.status(400).json({
      success: false,
      message: 'User with this email or username already exists'
    });
  }
  const fID = generateFID()

  // Create new user
  const user = new User({
    username,
    email,
    password,
    fID,
    year
  });

  await user.save();

  // Generate token
  const token = generateToken(user._id, user.username, "FACULTY");

  res.status(201).json({
    token,
    user: {
      id: user._id,
      name: user.username,
      email: user.email
    }
  });
});

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
const login = asyncHandler(async (req, res) => {
  const { email, password, role } = req.body;
  if (role === "FACULTY") {
    // Find user by email
    const user = await User.findByEmail(email);
    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Invalid credentials'
      });
    }
    
    // Check if user is active
    if (!user.isActive) {
      return res.status(400).json({
        success: false,
        message: 'Account is deactivated'
      });
    }
    
    // Check password
    const isValidPassword = await user.comparePassword(password);
    if (!isValidPassword) {
      return res.status(400).json({
        success: false,
        message: 'Invalid credentials'
      });
    }
    // Update last login
    user.lastLogin = new Date();
    await user.save();
    // Generate token
    const token = generateToken(user._id, user.username, role);
  
    res.cookie("auth_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60*60*1000
    })
    return res.json({
      name: user.username,
      success: true
    });
  }
  else if (role === "ADMIN-Manager") {
    if (email === "admin@bvdu.com" || password === "AdminManager") {
      res.cookie("auth_token", generateToken(role, email, role), {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 60*60*1000
      })
      return res.status(200).json({sucess: true})
    }
    return res.status(401).json({sucess: false});
  }

});

// @desc    Get current user profile
// @route   GET /api/auth/profile
// @access  Private
const getProfile = asyncHandler(async (req, res) => {
  res.json({
    user: {
      id: req.user._id,
      name: req.user.username,
      email: req.user.email
    }
  });
});

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
const updateProfile = asyncHandler(async (req, res) => {
  const { username, email } = req.body;
  const user = await User.findById(req.user.id);

  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found'
    });
  }

  // Check if new email/username already exists
  if (email && email !== user.email) {
    const existingUser = await User.userExists(email, username || user.username);
    if (existingUser && existingUser._id.toString() !== user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: 'Email or username already exists'
      });
    }
  }

  // Update fields
  if (username) user.username = username;
  if (email) user.email = email;

  await user.save();

  res.json({
    user: {
      id: user._id,
      name: user.username,
      email: user.email
    }
  });
});

const logoutUser = asyncHandler(async (req, res) => {
  res.clearCookie("auth_token", {
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production"
  })
  return res.status(200).json({success: true})
})

const fetchUsers = asyncHandler(async (req, res) => {
  try {
    const filter = {year: new Date().getFullYear().toString()}
    if (req.query.branch) {
      filter[branch] = req.query.branch;
    }
    const faculties = await User.find(filter)
    return res.status(200).json(faculties)
  }
  catch (err) {
    return res.status(500).json({error: err})
  }
})

module.exports = {
  register,
  login,
  getProfile,
  updateProfile,
  logoutUser,
  fetchUsers
}; 