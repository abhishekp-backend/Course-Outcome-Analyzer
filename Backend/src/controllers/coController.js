const CourseOutcome = require("../models/CourseOutcome");
const Class = require("../models/class");
const CO_PO_Mapping = require("../models/CO_PO_Mapping");
const StudentMarks = require("../models/studentRecords");
const Student = require("../models/Student");
const Section = require("../models/Class");
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
    let { classId, cos, values, assess } = req.body;

    // -----------------------------
    // 1. Validate classId
    // -----------------------------
    if (!classId) {
      return res.status(400).json({
        success: false,
        message: "Update any data first!",
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

        // Update Course Outcomes
        for (const key in fields) {
          setQuery[`cos.$[${alias}].${key}`] = fields[key];
        }

        // Update Program Outcomes
        for (const key in fields) {
          setQuery[`pos.$[${alias}].${key}`] = fields[key];
        }

        arrayFilters.push({
          [`${alias}._id`]: coObjId,
        });
      });
    }

    // -----------------------------
    // 3. CO Target & CO Levels
    // -----------------------------
    if (values && typeof values === "object") {
      if (values.target !== undefined) {
        setQuery["coTarget"] = values.target;
      }

      if (values.levels && typeof values.levels === "object") {
        for (const key in values.levels) {
          setQuery[`coLevels.${key}`] = values.levels[key];
        }
      }
    }

    // -----------------------------
    // 4. TWS update
    // -----------------------------
    if (typeof assess?.tws === "number") {
      setQuery["tws"] = assess.tws;
    }

    // -----------------------------
    // 5. Assessment updates
    // -----------------------------
    if (assess?.tw && typeof assess.tw === "object") {
      for (const key in assess.tw) {
        setQuery[`tw.${key}`] = assess.tw[key];
      }
    }

    // -----------------------------
    // 6. Other assessments
    // -----------------------------
    if (Object.keys(assess).length > 0) {
      for (const key in assess) {
        setQuery[key] = assess[key];
      }
    }

    // -----------------------------
    // 7. Guard: nothing to update
    // -----------------------------
    if (Object.keys(setQuery).length === 0) {
      return res.status(400).json({
        success: false,
        message: "No valid fields to update",
      });
    }

    // -----------------------------
    // 8. Execute update
    // -----------------------------
    await CourseOutcome.updateMany(
      { classId: classObjId },
      { $set: setQuery },
      {
        arrayFilters: arrayFilters.length ? arrayFilters : undefined,
        runValidators: true,
      },
    );

    await Section.updateOne(
      {
        _id: classObjId,
      },
      {
        updatedAt: new Date(),
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
  try {
    const { classId } = req.params;

    const marks = await StudentMarks.find({ class: classId });
    const coDoc = await CourseOutcome.findOne({ classId });

    if (!coDoc) {
      return res.status(404).json({
        success: false,
        message: "Course Outcome document not found.",
      });
    }

    const coFields = [
      "ut1co1",
      "ut1co2",
      "ut1co3",
      "ut2co4",
      "ut2co5",
      "ut2co6",
    ];

    const assessFields = ["universityExams"];

    const coAttainment = {};
    const assessAttainment = {};

    // Initialize statistics for each CO
    coFields.forEach((field, index) => {
      coAttainment[field] = {
        target: coDoc.coTarget,
        total: coDoc.cos[index].totalMarks,
        achieved: 0,
        totalStudents: marks.length,
        attainmentPercentage: 0,
        level: 0,
      };
    });

    // Initialize statistics for each Assessment
    assessFields.forEach((field, index) => {
      assessAttainment[field] = {
        target: coDoc[field].target,
        total: coDoc[field].totalMarks,
        achieved: 0,
        totalStudents: marks.length,
        attainmentPercentage: 0,
        level: 0,
      };
    });

    // Count students achieving the target
    for (const student of marks) {
      coFields.forEach((field) => {
        const score = student[field] ?? 0;
        const total = coAttainment[field].total;

        if (total <= 0) return;

        const percentage = (score / total) * 100;

        if (percentage >= coDoc.coTarget) {
          coAttainment[field].achieved++;
        }
      });

      assessFields.forEach((field) => {
        const score = student[field] ?? 0;
        const total = assessAttainment[field].total;

        if (total <= 0) return;

        const percentage = (score / total) * 100;

        if (percentage >= coDoc[field].target) {
          assessAttainment[field].achieved++;
        }
      });
    }

    let level1 = 0;
    let level2 = 0;
    let level3 = 0;

    // Calculate coAttainment percentage and assign level
    coFields.forEach((field) => {
      const data = coAttainment[field];

      data.attainmentPercentage =
        data.totalStudents === 0
          ? 0
          : Number(((data.achieved / data.totalStudents) * 100).toFixed(2));

      if (data.attainmentPercentage >= coDoc.coLevels.t1) {
        data.level = 3;
        level3++;
      } else if (data.attainmentPercentage >= coDoc.coLevels.t2) {
        data.level = 2;
        level2++;
      } else if (data.attainmentPercentage >= coDoc.coLevels.t3) {
        data.level = 1;
        level1++;
      } else {
        data.level = 0;
      }
    });

    assessFields.forEach((field) => {
      const data = assessAttainment[field];

      data.attainmentPercentage =
        data.totalStudents === 0
          ? 0
          : Number(((data.achieved / data.totalStudents) * 100).toFixed(2));
      
      if (data.attainmentPercentage >= coDoc[field].t1) {
        data.level = 3;
        level3++;
      } else if (data.attainmentPercentage >= coDoc[field].t2) {
        data.level = 2;
        level2++;
      } else if (data.attainmentPercentage >= coDoc[field].t3) {
        data.level = 1;
        level1++;
      }
      else {
        data.level = 0;
      }
    });

    return res.status(200).json({
      success: true,
      coAttainment,
      assessAttainment,
      summary: {
        level1,
        level2,
        level3,
      },
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

exports.calculateCOAttainmentTW = async (req, res) => {
  const { classId } = req.params;

  const marks = await StudentMarks.find({ class: classId });
  const record = await CourseOutcome.findOne({ classId });
  const cos = record.cos;

  const coFields = Object.keys(record.tw || {}); // keep TW-driven loop

  let lv1 = 0,
    lv2 = 0,
    lv3 = 0;

  const mappings = marks.map((student) => {
    const result = {};

    for (let field of coFields) {
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
