// models/StudentMarks.js
const mongoose = require("mongoose");

const studentMarksSchema = new mongoose.Schema(
  {
    prn: {
      type: String,
      required: true,
      trim: true,
    },
    class: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Class",
      required: [true, "Class Id is requied"],
    },
    subject: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subject",
      required: [true, "Subject is required"],
    },
    ut1co1: { type: Number, min: 0, max: 20, default: 0 },
    ut1co2: { type: Number, min: 0, max: 20, default: 0 },
    ut1co3: { type: Number, min: 0, max: 20, default: 0 },
    ut1co3: { type: Number, min: 0, max: 20, default: 0 },
    ut1co4: { type: Number, min: 0, max: 20, default: 0 },
    ut1co5: { type: Number, min: 0, max: 20, default: 0 },
    ut1co6: { type: Number, min: 0, max: 20, default: 0 },
    ut2co1: { type: Number, min: 0, max: 20, default: 0 },
    ut2co2: { type: Number, min: 0, max: 20, default: 0 },
    ut2co3: { type: Number, min: 0, max: 20, default: 0 },
    ut2co4: { type: Number, min: 0, max: 20, default: 0 },
    ut2co5: { type: Number, min: 0, max: 20, default: 0 },
    ut2co6: { type: Number, min: 0, max: 20, default: 0 },
    ia: { type: Number, min: 0, max: 40, default: 0 },
    pbl: { type: Number, min: 0, max: 20, default: 0 },
    tw: { type: Number, min: 0, max: 100, default: 0 },
    universityExam: { type: Number, min: 0, max: 60, default: 0 },
  },
  { timestamps: true },
);

module.exports = mongoose.model("StudentMarks", studentMarksSchema);
