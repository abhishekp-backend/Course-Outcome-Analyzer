const mongoose = require('mongoose');
const section = require('./Class');
const courseOutcome = require("./CourseOutcome");

const subjectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Subject name is required'],
    trim: true,
    minlength: [2, 'Subject name must be at least 2 characters long'],
    maxlength: [100, 'Subject name cannot exceed 100 characters']
  },
  branch: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "branch",
    required: [true, 'Branch is required'],
    trim: true
  },
  semester: {
    type: Number,
    required: [true, 'Semester is required'],
    min: [1, 'Semester must be at least 1'],
    max: [8, 'Semester cannot exceed 8']
  },
  academicYear: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "AcademicYear",
    required: [true, 'Year is required'],
  },
}, {
  timestamps: true
});

subjectSchema.post("findOneAndDelete", async function (doc) {
  if (!doc) return;

  try {
    await section.deleteMany({
      subject: doc._id,
    });
    
    await courseOutcome.deleteMany({
      subject: doc._id,
    });
  }
  catch (error) {
    console.log(error);
  }
});

module.exports = mongoose.model('Subject', subjectSchema);