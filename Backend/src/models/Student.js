const mongoose = require("mongoose");
const studentRecords = require("./studentRecords");

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
      unique: true,
      trim: true,
    },

    roll: {
      type: Number,
      required: [true, "Roll number is required"],
    },

    branch: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "branch",
      required: [true, "Branch is required"],
    },

    semester: {
      type: Number,
      required: [true, "Semester is required"],
    },

    division: {
      type: String,
      required: [true, "Division is required"],
      trim: true,
    },

    academicYear: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "AcademicYear",
      required: [true, "Academic Year is required"],
    },

    class: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "section",
      required: [true, "Class is required"],
    },
  },
  {
    timestamps: true,
  }
);

/**
 * Query patterns:
 * Student.find({
 *   academicYear,
 *   branch,
 *   semester,
 *   division
 * })
 */
studentSchema.index({
  academicYear: 1,
  branch: 1,
  semester: 1,
  division: 1,
});

/**
 * Fast PRN lookup
 */
studentSchema.index(
  { prn: 1 },
  { unique: true }
);

/**
 * Fast class-wise student retrieval
 */
studentSchema.index({
  class: 1,
  roll: 1,
});

/**
 * Cascade delete student records
 */
studentSchema.post("findOneAndDelete", async function (doc) {
  if (!doc) return;

  try {
    await studentRecords.deleteMany({
      prn: doc.prn,
    });

    console.log(
      `Deleted related student records for PRN: ${doc.prn}`
    );
  } catch (err) {
    console.error(
      `Failed to delete related records for PRN ${doc.prn}:`,
      err
    );
  }
});

module.exports = mongoose.model("Student", studentSchema);