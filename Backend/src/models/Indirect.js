const mongoose = require("mongoose");

const indirectSchema = new mongoose.Schema(
    {
        academicYear: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "AcademicYear",
            required: true,
        },
        class: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "section",
            required: [true, "Class is required"],
        },
        level1: {
            type: Number,
            default: 0,
        },
        level2: {
            type: Number,
            default: 0
        },
        level3: {
            type: Number,
            default: 0,
        }
    }
);

indirectSchema.index(
  {
    academicYear: 1,
    class: 1,
  },
  {
    unique: true,
  }
);

indirectSchema.index(
  {
    class: 1,
  },
  {
    unique: true,
  }
);

module.exports = mongoose.model("Indirect", indirectSchema);