const mongoose = require("mongoose");

const schemaFields = {};

for (let i = 1; i <= 10; i++) {
  for (let j = 1; j <= 3; j++) {
    schemaFields[`tw${i}co${j}`] = {
      type: Number,
      min: 0,
      max: 100,
      default: 0,
    };
  }
}

// NEW: string fields inside same tw object
for (let i = 1; i <= 10; i++) {
  schemaFields[`tw${i}co`] = {
    type: String,
    default: "",
  };
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
          target: Number,
        },
      ],
      default: () => [
        {
          name: "CO1",
          question: "",
          totalMarks: 0,
          btLevel: 0,
          topic: "",
        },
        {
          name: "CO2",
          question: "",
          totalMarks: 0,
          btLevel: 0,
          topic: "",
        },
        {
          name: "CO3",
          question: "",
          totalMarks: 0,
          btLevel: 0,
          topic: "",
        },
        {
          name: "CO4",
          question: "",
          totalMarks: 0,
          btLevel: 0,
          topic: "",
        },
        {
          name: "CO5",
          question: "",
          totalMarks: 0,
          btLevel: 0,
          topic: "",
        },
        {
          name: "CO6",
          question: "",
          totalMarks: 0,
          btLevel: 0,
          topic: "",
        },
      ],
    },
    coTarget: {
      type: Number,
      min: 1,
      max: 99,
      default: 40,
    },
    coLevels: {
      type: {
        t1: Number,
        t2: Number,
        t3: Number,
      },
      default: {
        t1: 80,
        t2: 60,
        t3: 40,
      }
    },

    // ===== POs =====
    pos: {
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
        {
          name: "PO1",
          question: "",
          totalMarks: 0,
          t1: 0,
          t2: 0,
          t3: 0,
          btLevel: 0,
          topic: "",
        },
        {
          name: "PO2",
          question: "",
          totalMarks: 0,
          t1: 0,
          t2: 0,
          t3: 0,
          btLevel: 0,
          topic: "",
        },
        {
          name: "PO3",
          question: "",
          totalMarks: 0,
          t1: 0,
          t2: 0,
          t3: 0,
          btLevel: 0,
          topic: "",
        },
        {
          name: "PO4",
          question: "",
          totalMarks: 0,
          t1: 0,
          t2: 0,
          t3: 0,
          btLevel: 0,
          topic: "",
        },
        {
          name: "PO5",
          question: "",
          totalMarks: 0,
          t1: 0,
          t2: 0,
          t3: 0,
          btLevel: 0,
          topic: "",
        },
        {
          name: "PO6",
          question: "",
          totalMarks: 0,
          t1: 0,
          t2: 0,
          t3: 0,
          btLevel: 0,
          topic: "",
        },
      ],
    },

    // Term Work
    tw: schemaFields,
    tws: {
      type: Number,
      min: 0,
      max: 10,
      default: 0,
    },

    // ===== Assessments (pure JSON objects) =====
    internalAssessment: {
      type: mongoose.Schema.Types.Mixed,
      default: () => ({ totalMarks: 0, t1: 0, t2: 0, t3: 0, target: 0 }),
    },

    practicals: {
      type: mongoose.Schema.Types.Mixed,
      default: () => ({ totalMarks: 0, t1: 0, t2: 0, t3: 0, target: 0 }),
    },

    pbls: {
      type: mongoose.Schema.Types.Mixed,
      default: () => ({ totalMarks: 0, t1: 0, t2: 0, t3: 0, target: 0 }),
    },

    attendance: {
      type: mongoose.Schema.Types.Mixed,
      default: () => ({ totalMarks: 0, t1: 0, t2: 0, t3: 0, target: 0 }),
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("CourseOutcome", CourseOutcomeSchema);
