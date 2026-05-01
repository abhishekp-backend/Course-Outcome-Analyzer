const mongoose = require("mongoose")

const schemaFields = {};

for (let i = 1; i <= 10; i++) {
  for (let j = 1; j <= 3; j++) {
    schemaFields[`tw${i}co${j}`] = {
      type: Number,
      min: 0,
      max: 100,
      default: 0
    };
  }
}

const CourseOutcomeSchema = new mongoose.Schema(
  {
    classId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Class",
      required: true,
      unique: true,
      index: true,
    },

    // ===== COs =====
    cos: {
      type: [
        {
          name: String,
          question: String,
          totalMarks: Number,
          t1: Number,
          t2: Number,
          t3: Number,
          btLevel: Number,
          topic: String,
        },
      ],
      default: () => [
        { name: "CO1", question: "", totalMarks: 0, t1: 0, t2:0 , t3: 0, btLevel: 0, topic: "" },
        { name: "CO2", question: "", totalMarks: 0, t1: 0, t2:0 , t3: 0, btLevel: 0, topic: "" },
        { name: "CO3", question: "", totalMarks: 0, t1: 0, t2:0 , t3: 0, btLevel: 0, topic: "" },
        { name: "CO4", question: "", totalMarks: 0, t1: 0, t2:0 , t3: 0, btLevel: 0, topic: "" },
        { name: "CO5", question: "", totalMarks: 0, t1: 0, t2:0 , t3: 0, btLevel: 0, topic: "" },
        { name: "CO6", question: "", totalMarks: 0, t1: 0, t2:0 , t3: 0, btLevel: 0, topic: "" },
      ],
    },

    // Term Work
    tw: schemaFields,
    tws: {
      type: Number,
      min: 0,
      max: 10,
      default: 0
    },

    // ===== Assessments (pure JSON objects) =====
    internalAssessment: {
      type: mongoose.Schema.Types.Mixed,
      default: () => ({ totalMarks: 0, t1:0,t2:0,t3:0 }),
    },

    practicals: {
      type: mongoose.Schema.Types.Mixed,
      default: () => ({ totalMarks: 0, t1:0,t2:0,t3:0 }),
    },

    pbls: {
      type: mongoose.Schema.Types.Mixed,
      default: () => ({ totalMarks: 0, t1:0,t2:0,t3:0 }),
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("CourseOutcome", CourseOutcomeSchema);
