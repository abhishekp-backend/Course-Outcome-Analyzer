const mongoose = require("mongoose");
const StudentSubjectMap = require("./MapStudentAndSubject");
const studentRecords = require("./studentRecords");
const subject = require("./Subject")

const studentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Student name is required"],
      trim: true,
      minlength: [2, "Student name must be at least 2 characters long"],
      maxlength: [100, "Student name cannot exceed 100 characters"],
    },
    prn: {
      type: String,
      required: [true, "PRN is required"],
    },
    roll: {
      type: Number,
      required: [true, "Roll number is required"],
    },
    branch: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "branch",
      required: [true, "Branch is required"]
    },
    semester: {
      type: Number,
      required: [true, "Semester is required"]
    },
    division: {
      type: String,
      required: [true, "Division is required"]
    },
    academicYear: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "AcademicYear",
      required: [true, "Academic Year is required"],
    }
  },
  {
    timestamps: true,
  }
);

studentSchema.index({ subject: 1, roll: 1 });

// Delete related records when a student is deleted
studentSchema.post("findOneAndDelete", async function (doc, next) {
  if (!doc) return next(); // no document found

  try {
    // Delete records in studentRecords
    await studentRecords.deleteMany({ prn: doc.prn });

    console.log(`Deleted related records for student PRN: ${doc.prn}`);
    next();
  } catch (err) {
    next(err);
  }
});

module.exports = mongoose.model("Student", studentSchema);
