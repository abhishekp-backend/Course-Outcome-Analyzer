const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const hodUserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "Username is required"],
      unique: true,
      trim: true,
      minlength: [3, "Username must be at least 3 characters long"],
      maxlength: [30, "Username cannot exceed 30 characters"],
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        "Please enter a valid email",
      ],
    },

    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters long"],
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    lastLogin: {
      type: Date,
      default: null,
    },

    hodID: {
      type: String,
      required: [true, "HOD ID is required"],
      unique: true,
      trim: true,
    },

    branchId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Branch",
      required: [true, "Branch ID is required"],
    },
  },
  {
    timestamps: true,

    toJSON: {
      virtuals: true,
    },

    toObject: {
      virtuals: true,
    },
  }
);

// Virtual for HOD profile
// Password is intentionally excluded.
hodUserSchema.virtual("profile").get(function () {
  return {
    id: this._id,
    hodID: this.hodID,
    username: this.username,
    email: this.email,
    isActive: this.isActive,
    lastLogin: this.lastLogin,
    branchId: this.branchId,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt,
  };
});

// Hash password before saving
hodUserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);

    next();
  } catch (error) {
    next(error);
  }
});

// Compare plain-text password with hashed password
hodUserSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Find HOD by email
hodUserSchema.statics.findByEmail = function (email) {
  return this.findOne({
    email: email.trim().toLowerCase(),
  });
};

// Check whether HOD already exists
hodUserSchema.statics.userExists = function (email, username) {
  return this.findOne({
    $or: [
      {
        email: email.trim().toLowerCase(),
      },
      {
        username: username.trim(),
      },
    ],
  });
};

const HodUser = mongoose.model("HodUser", hodUserSchema);

module.exports = HodUser;