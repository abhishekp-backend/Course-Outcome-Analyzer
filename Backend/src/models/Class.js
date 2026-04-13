const mongoose = require("mongoose");
const co = require("./CourseOutcome")

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
    }
  },
  { timestamps: true }
);

classSchema.post("save", async function (doc) {
  await co.create({
    classId: doc._id,
  })
})

classSchema.post("delete", async function (doc) {
  await co.delete({
    classId: doc._id,
  })
})

module.exports = mongoose.models.Class || mongoose.model("Class", classSchema);
