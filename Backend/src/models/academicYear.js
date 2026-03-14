const mongoose = require('mongoose');

const academicYear = new mongoose.Schema(
  {
    year: {
      type: String,
      required: true,
      unique: true,
    },

    // For UI display if needed
    label: {
      type: String,
      required: true // "2024–25"
    },

    startDate: {
      type: Date,
      required: true
    },

    endDate: {
      type: Date,
      required: true
    },

    // If true → no writes allowed to this year
    isLocked: {
      type: Boolean,
      default: false
    },
  },
  {
    timestamps: true
  }
);

// Ensure endDate > startDate
academicYear.pre('save', function (next) {
  if (this.endDate <= this.startDate) {
    return next(new Error('endDate must be after startDate'));
  }
  next();
});

module.exports = mongoose.model('AcademicYear', academicYear);
