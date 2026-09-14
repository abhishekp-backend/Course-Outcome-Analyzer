const Class = require("../models/class");
const mongoose = require("mongoose");

exports.getAllClasses = async (req, res) => {
  try {
    let matchQuery = {};

    console.log("USER:", req.user);

    if (req.user.branchId && req.user.branchId !== "all") {
      matchQuery.branch = new mongoose.Types.ObjectId(req.user.branchId);
    }

    console.log("\nMatch Query:\n", matchQuery);

    const classes = await Class.aggregate([
      {
        $match: matchQuery,
      },

      // lookup academicYear
      {
        $lookup: {
          from: "academicyears",
          localField: "academicYear",
          foreignField: "_id",
          as: "academicYear",
        },
      },
      { $unwind: "$academicYear" },

      // lookup Faculty
      {
        $lookup: {
          from: "users",
          localField: "faculty",
          foreignField: "_id",
          as: "faculty",
        },
      },
      { $unwind: "$faculty" },

      // lookup subjects
      {
        $lookup: {
          from: "subjects",
          localField: "subject",
          foreignField: "_id",
          as: "subject",
        },
      },
      { $unwind: "$subject" },

      // lookup branches
      {
        $lookup: {
          from: "branches",
          localField: "branch",
          foreignField: "_id",
          as: "branch",
        },
      },
      { $unwind: "$branch" },

      {
        $project: {
          _id: 1,
          division: 1,
          semester: "$subject.semester",
          academicYear: "$academicYear.label",
          subject: "$subject.name",
          faculty: "$faculty.username",
          branch: "$branch.branchName",
        },
      },

      { $sort: { createdAt: -1 } },
    ]);

    return res.status(200).json({
      success: true,
      data: classes,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: err.message });
  }
};

exports.createClass = async (req, res) => {
  try {
    const {
      academicYearId,
      division,
      facultyId,
      semester,
      subjectId,
      branchId,
    } = req.body;

    if (
      !academicYearId ||
      !subjectId ||
      !division ||
      !facultyId ||
      !semester ||
      !branchId
    ) {
      return res.status(400).json({ msg: "Invalid values!" });
    }

    const exists = await Class.findOne({
      academicYear: academicYearId,
      division: division.toUpperCase(),
      faculty: facultyId,
      semester,
      subject: subjectId,
      branch: branchId,
    });

    if (exists) {
      return res.status(409).json({
        msg: "Class / Section already exists",
      });
    }

    const newClass = await Class.create({
      academicYear: academicYearId,
      division: division.toUpperCase(),
      faculty: facultyId,
      semester,
      subject: subjectId,
      branch: branchId,
    });

    return res.status(201).json({
      success: true,
      data: newClass,
    });
  } catch (err) {
    return res.status(500).json({
      error: err.message,
    });
  }
};
