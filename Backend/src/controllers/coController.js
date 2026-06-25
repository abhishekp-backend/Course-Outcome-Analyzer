const CourseOutcome = require("../models/CourseOutcome");
const Class = require("../models/class");
const CO_PO_Mapping = require("../models/CO_PO_Mapping");
const StudentMarks = require("../models/studentRecords");
const Student = require("../models/Student");
const mongoose = require("mongoose");

// Create a new Course Outcome
exports.createCO = async (req, res) => {
  try {
    const {
      subject,
      coNumber,
      description,
      assessmentMethods,
      weightage,
      threshold,
    } = req.body;

    const co = await CourseOutcome.create({
      subject,
      coNumber,
      description,
      assessmentMethods: assessmentMethods || [],
      weightage: weightage || new Map(),
      threshold: threshold || 60,
    });

    res.status(201).json({
      success: true,
      message: "Course Outcome created successfully",
      data: co,
    });
  } catch (error) {
    console.error("Error creating CO:", error);
    res.status(400).json({
      success: false,
      message: "Failed to create Course Outcome",
      error: error.message,
    });
  }
};

// Get all COs for a subject
exports.getCOsBySubject = async (req, res) => {
  try {
    const { classId } = req.params;
    const coData = await CourseOutcome.findOne({ classId: classId });

    res.status(200).json({
      success: true,
      data: coData,
    });
  } catch (error) {
    console.error("Error fetching COs:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch Course Outcomes",
      error: error.message,
    });
  }
};

// Update a CO
exports.updateCO = async (req, res) => {
  try {
    let { classId, cos, assess } = req.body;

    // -----------------------------
    // 1. Validate classId
    // -----------------------------
    if (!classId) {
      return res.status(400).json({
        success: false,
        message: "classId is required",
      });
    }

    const classObjectId = Array.isArray(classId) ? classId[0] : classId;
    const classObjId = new mongoose.Types.ObjectId(classObjectId);

    const setQuery = {};
    const arrayFilters = [];

    // -----------------------------
    // 2. COS updates (array updates)
    // -----------------------------
    if (Array.isArray(cos) && cos.length > 0) {
      cos.forEach((co, index) => {
        if (!co._id) return;

        const alias = `elem${index}`;
        const { _id, ...fields } = co;

        const coObjId = new mongoose.Types.ObjectId(_id);

        // Update COS
        for (const key in fields) {
          setQuery[`cos.$[${alias}].${key}`] = fields[key];
        }

        // Update POS (if they share the same structure/ids)
        for (const key in fields) {
          setQuery[`pos.$[${alias}].${key}`] = fields[key];
        }

        // Add array filter ONLY ONCE
        arrayFilters.push({
          [`${alias}._id`]: coObjId,
        });
      });
    }

    // -----------------------------
    // 3. TWS update (simple field)
    // -----------------------------
    if (typeof assess.tws === "number") {
      setQuery["tws"] = assess.tws;
    }

    // -----------------------------
    // 4. ASSESS updates (flat object)
    // -----------------------------
    if (assess && typeof assess === "object") {
      for (const key in assess?.tw) {
        setQuery[`tw.${key}`] = assess?.tw[key];
      }
    }
    // -----------------------------
    // 5. Guard: nothing to update
    // -----------------------------
    if (Object.keys(setQuery).length === 0) {
      return res.status(400).json({
        success: false,
        message: "No valid fields to update",
      });
    }

    // -----------------------------
    // 6. Execute update
    // -----------------------------
    await CourseOutcome.updateMany(
      { classId: classObjId },
      { $set: setQuery },
      {
        arrayFilters: arrayFilters.length ? arrayFilters : undefined,
        runValidators: true,
      },
    );

    return res.status(200).json({
      success: true,
      message: "Updated successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Delete a CO
exports.deleteCO = async (req, res) => {
  try {
    const { id } = req.params;
    const co = await CourseOutcome.findByIdAndDelete(id);

    if (!co) {
      return res.status(404).json({
        success: false,
        message: "Course Outcome not found",
      });
    }

    // Also delete related CO-PO mappings
    await CO_PO_Mapping.deleteMany({ co: id });

    res.status(200).json({
      success: true,
      message: "Course Outcome deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting CO:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete Course Outcome",
      error: error.message,
    });
  }
};

// Calculate CO Attainment for a subject
// exports.calculateCOAttainment = async (req, res) => {
//   try {
//     const { classId } = req.params;

//     const courseOutcome = await CourseOutcome.findOne({ classId: classId }).lean();

//     if (!courseOutcome)
//       return res.status(404).json({
//         success: false,
//         message: "CO not found",
//       });

//     const studentMarks = await StudentMarks.find({ class: classId }).lean();
//     console.log(studentMarks)

//     // ===== FAST LOOKUP MAP =====
//     const marksMap = new Map();

//     for (const mark of studentMarks) marksMap.set(mark.prn, mark);

//     // ===== PRECOMPUTE NORMALIZATION FACTORS =====

//     const toolMax = {
//       t1:
//         (courseOutcome.internalAssessment?.t1 || 0) +
//         (courseOutcome.termWork?.t1 || 0) +
//         (courseOutcome.practicals?.t1 || 0) +
//         (courseOutcome.pbls?.t1 || 0),

//       t2:
//         (courseOutcome.internalAssessment?.t2 || 0) +
//         (courseOutcome.termWork?.t2 || 0) +
//         (courseOutcome.practicals?.t2 || 0) +
//         (courseOutcome.pbls?.t2 || 0),

//       t3:
//         (courseOutcome.internalAssessment?.t3 || 0) +
//         (courseOutcome.termWork?.t3 || 0) +
//         (courseOutcome.practicals?.t3 || 0) +
//         (courseOutcome.pbls?.t3 || 0),
//     };

//     const threshold = 60;

//     const results = [];

//     // ===== LOOP COs =====
//     for (const co of courseOutcome.cos) {
//       const coT1 = co.t1 || 0;
//       const coT2 = co.t2 || 0;
//       const coT3 = co.t3 || 0;

//       const coTotal = co.totalMarks || 0;

//       let attainedCount = 0;
//       let totalPercentageSum = 0;

//       const studentAttainments = [];

//       // ===== LOOP STUDENTS =====
//       for (const student of students) {
//         const marks = marksMap.get(student.prn);

//         if (!marks) continue;

//         // ===== FAST TOOL SUM =====

//         const studentT1 =
//           (marks.internalAssessment?.t1 || 0) +
//           (marks.termWork?.t1 || 0) +
//           (marks.practicals?.t1 || 0) +
//           (marks.pbls?.t1 || 0);

//         const studentT2 =
//           (marks.internalAssessment?.t2 || 0) +
//           (marks.termWork?.t2 || 0) +
//           (marks.practicals?.t2 || 0) +
//           (marks.pbls?.t2 || 0);

//         const studentT3 =
//           (marks.internalAssessment?.t3 || 0) +
//           (marks.termWork?.t3 || 0) +
//           (marks.practicals?.t3 || 0) +
//           (marks.pbls?.t3 || 0);

//         // ===== NORMALIZED CONTRIBUTION =====

//         const contributionT1 =
//           toolMax.t1 > 0 ? (studentT1 / toolMax.t1) * coT1 : 0;

//         const contributionT2 =
//           toolMax.t2 > 0 ? (studentT2 / toolMax.t2) * coT2 : 0;

//         const contributionT3 =
//           toolMax.t3 > 0 ? (studentT3 / toolMax.t3) * coT3 : 0;

//         const obtained = contributionT1 + contributionT2 + contributionT3;

//         const percentage = coTotal > 0 ? (obtained / coTotal) * 100 : 0;

//         const attained = percentage >= threshold;

//         if (attained) attainedCount++;

//         totalPercentageSum += percentage;

//         studentAttainments.push({
//           prn: student.prn,
//           name: student.name,
//           roll: student.roll,

//           obtainedMarks: Number(obtained.toFixed(2)),

//           percentage: Number(percentage.toFixed(2)),

//           attained,
//         });
//       }

//       const totalStudents = studentAttainments.length;

//       const averagePercentage =
//         totalStudents > 0 ? totalPercentageSum / totalStudents : 0;

//       const attainmentPercentage =
//         totalStudents > 0 ? (attainedCount / totalStudents) * 100 : 0;

//       results.push({
//         coName: co.name,

//         question: co.question,

//         totalMarks: coTotal,

//         averagePercentage: Number(averagePercentage.toFixed(2)),

//         attainmentPercentage: Number(attainmentPercentage.toFixed(2)),

//         attainedStudents: attainedCount,

//         totalStudents,

//         studentAttainments,
//       });
//     }

//     res.status(200).json({
//       success: true,
//       data: results,
//     });
//   } catch (err) {
//     console.error(err);

//     res.status(500).json({
//       success: false,
//       message: err.message,
//     });
//   }
// };

exports.calculateCOAttainment = async (req, res) => {
  const { classId } = req.params;
  const marks = await StudentMarks.find({ class: classId });
  const cos = await CourseOutcome.findOne({ classId });
  const dbFields = Array.from({ length: 6 }, (_, i) => `ut1co${i + 1}`);
  let lv1 = 0,
    lv2 = 0,
    lv3 = 0;
  const mappings = marks.map((student) => {
    const result = {};

    for (let field of dbFields) {
      const index = Number(field.at(-1)); // assuming co1, co2, etc.
      const score = student[field];
      const thresholds = cos.cos[index - 1];
      result[field] =
        score >= thresholds.t1
          ? 3
          : score >= thresholds.t2
            ? 2
            : score >= thresholds.t3
              ? 1
              : 0;
      if (score >= thresholds.t1) {
        lv1++;
      } else if (score >= thresholds.t2) {
        lv2++;
      } else if (score >= thresholds.t3) {
        lv3++;
      }
    }

    return result;
  });

  return res.status(200).json({ mappings, lv1, lv2, lv3 });
};

exports.calculateCOAttainmentTW = async (req, res) => {
  const { classId } = req.params;

  const marks = await StudentMarks.find({ class: classId });
  const record = await YourModel.findOne({ classId });
  const cos = record.cos;

  const dbFields = Object.keys(record.tw || {}); // keep TW-driven loop

  let lv1 = 0,
    lv2 = 0,
    lv3 = 0;

  const mappings = marks.map((student) => {
    const result = {};

    for (let field of dbFields) {
      const score = student.tw?.[field] ?? 0;

      // extract CO index from tw1co3 → 3
      const coIndex = Number(field.split("co")[1]);

      const thresholds = cos[coIndex - 1];

      result[field] =
        score >= thresholds.t1
          ? 3
          : score >= thresholds.t2
            ? 2
            : score >= thresholds.t3
              ? 1
              : 0;

      if (score >= thresholds.t1) {
        lv1++;
      } else if (score >= thresholds.t2) {
        lv2++;
      } else if (score >= thresholds.t3) {
        lv3++;
      }
    }

    return result;
  });

  return res.status(200).json({ mappings, lv1, lv2, lv3 });
};
