const mongoose = require("mongoose");
const co = require("./CourseOutcome");
const Indirect = require("./Indirect");

const classSchema = new mongoose.Schema(
  {
    academicYear: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "AcademicYear",
      required: true
    },
    subject: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subject",
      required: true
    },
    branch: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Branch",
      required: true,
    },
    division: {
      type: String,
      required: true,
      uppercase: true,
      trim: true
    },
    faculty: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    semester: {
      type: Number,
      required: [true, "Semester is required"]
    },
    twCounts: {
      type: Number,
      default: 0,
    },
    noOfStudents: {
      type: Number,
      default: 0,
    },
    target: {
      type: Number,
      default: 1,
      min: 1,
      max: 100,
    }
  },
  { timestamps: true }
);

classSchema.post("save", async function (doc) {
  await co.create({
    classId: doc._id,
  })

  await Indirect.create({
    class: doc._id,
    academicYear: doc.academicYear,
  })
})

classSchema.post("delete", async function (doc) {
  await co.delete({
    classId: doc._id,
  })
})

module.exports = mongoose.models.Class || mongoose.model("Class", classSchema);
