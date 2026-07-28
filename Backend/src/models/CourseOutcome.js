const mongoose = require("mongoose");
const section = require("./Class");
const subject = require("./Subject");

// -----------------------------
// Term Work dynamic fields
// -----------------------------
const TwItemSchema = new mongoose.Schema(
  {
    label: String,
    co1: Number,
    co2: Number,
    co3: Number,
  },
  { _id: false },
);

// -----------------------------
// CO / PO base template (reused)
// -----------------------------
const assessmentItem = {
  name: String,
  question: String,
  totalMarks: { type: Number, default: 0 },
  t1: { type: Number, default: 0 },
  t2: { type: Number, default: 0 },
  t3: { type: Number, default: 0 },
  btLevel: { type: Number, default: 0 },
  topic: { type: String, default: "" },
};

const CourseOutcomeSchema = new mongoose.Schema(
  {
    classId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Class",
      required: true,
      unique: true,
      index: true,
    },

    // -----------------------------
    // COs
    // -----------------------------
    cos: {
      type: [assessmentItem],
      default: () =>
        Array.from({ length: 6 }, (_, i) => ({
          name: `CO${i + 1}`,
          question: "",
          totalMarks: 0,
          t1: 0,
          t2: 0,
          t3: 0,
          btLevel: 0,
          topic: "",
        })),
    },

    coTarget: {
      type: Number,
      min: 1,
      max: 100,
      default: 40,
    },

    coLevels: {
      t1: { type: Number, default: 80 },
      t2: { type: Number, default: 60 },
      t3: { type: Number, default: 40 },
    },

    // -----------------------------
    // POs
    // -----------------------------
    pos: {
      type: [assessmentItem],
      default: () =>
        Array.from({ length: 6 }, (_, i) => ({
          name: `PO${i + 1}`,
          question: "",
          totalMarks: 0,
          t1: 0,
          t2: 0,
          t3: 0,
          btLevel: 0,
          topic: "",
        })),
    },

    // -----------------------------
    // Term Work
    // -----------------------------
    tw: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },

    tws: {
      type: Number,
      min: 0,
      max: 10,
      default: 0,
    },

    // -----------------------------
    // Assessments
    // -----------------------------
    internalAssessment: {
      totalMarks: { type: Number, default: 0 },
      t1: { type: Number, default: 0 },
      t2: { type: Number, default: 0 },
      t3: { type: Number, default: 0 },
      target: { type: Number, default: 0 },
    },

    practicals: {
      totalMarks: { type: Number, default: 0 },
      t1: { type: Number, default: 0 },
      t2: { type: Number, default: 0 },
      t3: { type: Number, default: 0 },
      target: { type: Number, default: 0 },
    },

    pbl: {
      totalMarks: { type: Number, default: 0 },
      t1: { type: Number, default: 0 },
      t2: { type: Number, default: 0 },
      t3: { type: Number, default: 0 },
      target: { type: Number, default: 0 },
    },

    attendance: {
      totalMarks: { type: Number, default: 0 },
      t1: { type: Number, default: 0 },
      t2: { type: Number, default: 0 },
      t3: { type: Number, default: 0 },
      target: { type: Number, default: 0 },
    },

    universityExams: {
      totalMarks: { type: Number, default: 0 },
      t1: { type: Number, default: 0 },
      t2: { type: Number, default: 0 },
      t3: { type: Number, default: 0 },
      target: { type: Number, default: 0 },
    },
  },
  {
    timestamps: true,
  },
);

CourseOutcomeSchema.post(
  ["updateOne", "findOneAndUpdate", "updateMany"],
  async function () {
    try {
      const Class = mongoose.model("Class");
      const Subject = mongoose.model("Subject");

      const filter = this.getFilter();

      if (!filter.classId) return;

      await Class.findByIdAndUpdate(filter.classId, {
        updatedAt: new Date(),
      });

      const cls = await Class.findById(filter.classId).select("subject");

      if (!cls) return;

      await Subject.findByIdAndUpdate(cls.subject, {
        updatedAt: new Date(),
      });
    } catch (err) {
      console.error("[BACKEND] Failed to propagate updatedAt:", err);
    }
  },
);

module.exports = mongoose.model("CourseOutcome", CourseOutcomeSchema);
