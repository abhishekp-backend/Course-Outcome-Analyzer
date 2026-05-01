const Subject = require("../models/Subject");
const Class = require("../models/class");
const User = require("../models/User");
const Branch = require("../models/Branch");
const mongoose = require("mongoose");

// Get all subjects for a user
exports.getUserSubjects = async (req, res) => {
  try {
    const subjects = await Class.aggregate([
      {
        $match: {
          faculty: new mongoose.Types.ObjectId(req.user.id),
        },
      },
      {
        $lookup: {
          from: "subjects",
          localField: "subject",
          foreignField: "_id",
          as: "subject",
        },
      },
      { $unwind: "$subject" },
      {
        $lookup: {
          from: "branches",
          localField: "subject.branch",
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
          name: "$subject.name",
          branch: "$branch.branchName",
        },
      },
    ]);

    res.status(200).json({
      success: true,
      message: "Subjects retrieved successfully",
      data: subjects,
    });
  } catch (error) {
    console.error("Error fetching subjects:", error);
    res.status(500).json({
      success: false,
      message: "Failed to retrieve subjects",
      error: error.message,
    });
  }
};

// Create a new subject
exports.createSubject = async (req, res) => {
  try {
    const { name, branch, semester, year, facultyId, division } = req.body;

    const subject = await Subject.create({
      name,
      branch: new mongoose.Types.ObjectId(branch),
      semester,
      academicYear: new mongoose.Types.ObjectId(year),
    });

    const subID = subject._id;

    res.status(201).json({
      success: true,
      message: "Subject created successfully",
      data: subject,
    });
  } catch (error) {
    console.error("Error creating subject:", error);
    res.status(400).json({
      success: false,
      message: "Failed to create subject",
      error: error.message,
    });
  }
};

// Update a subject
exports.updateSubject = async (req, res) => {
  try {
    const { id } = req.params;
    const { facultyId, branch, semester, name } = req.body.data;

    const updates = {};
    let hasChanges = false;

    if (facultyId) {
      hasChanges = true;
      updates.user = new mongoose.Types.ObjectId(facultyId);
    }
    if (branch) {
      hasChanges = true;
      updates.branch = new mongoose.Types.ObjectId(branch);
    }
    if (semester) {
      hasChanges = true;
      updates.branch = semester;
    }
    if (name) {
      hasChanges = true;
      updates.name = name;
    }

    const subject = await Subject.findByIdAndUpdate(
      id,
      { $set: updates },
      {
        new: true,
        runValidators: true,
        context: "query",
      },
    );

    if (!subject) {
      return res.status(404).json({
        success: false,
        message: "Subject not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Subject updated successfully",
      data: subject,
    });
  } catch (error) {
    console.error("Error updating subject:", error);
    res.status(400).json({
      success: false,
      message: "Failed to update subject",
      error: error.message,
    });
  }
};

// Delete a subject
exports.deleteSubject = async (req, res) => {
  try {
    const { id } = req.params;

    const subject = await Subject.findById(id);

    if (!subject) {
      return res.status(404).json({
        success: false,
        message: "Subject not found",
      });
    }

    await Subject.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Subject deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting subject:", error);
    res.status(400).json({
      success: false,
      message: "Failed to delete subject",
      error: error.message,
    });
  }
};

exports.getSubject = async (req, res) => {
  try {
    const { id } = req.params;

    const classExists = await Class.exists({ _id: id });
    if (!classExists) {
      return res.status(400).json({
        message: "Class not found",
        status: false,
      });
    }

    const subjectInfo = await Class.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(id),
        },
      },
      {
        $lookup: {
          from: "subjects",
          localField: "subject",
          foreignField: "_id",
          as: "subject",
        },
      },
      { $unwind: { path: "$subject", preserveNullAndEmptyArrays: true } },

      {
        $lookup: {
          from: "branches",
          localField: "branch",
          foreignField: "_id",
          as: "branch",
        },
      },
      { $unwind: { path: "$branch", preserveNullAndEmptyArrays: true } },

      {
        $project: {
          _id: 1,
          division: 1,
          subjectName: "$subject.name",
          name: 1,
          branch: "$branch.branchName",
        },
      },
    ]);

    return res.status(200).json({
      message: "Subject found",
      info: subjectInfo,
      status: true,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      msg: "Internal Server Error!",
    });
  }
};

exports.getAllSubjects = async (req, res) => {
  try {
    const { year } = req.params;
    const subject = await Subject.findBy({ year: year });

    if (!subjet) {
      return res.status(200).json({});
    }

    const result = {
      name: subject.name,
      branch: subject.branch,
      semester: subject.semester,
      year: subject.year,
    };

    const faculty = await User.find({ fID: subject.user });
    if (!faculty) {
      result[faculty] = "None";
    } else {
      result[faculty] = faculty.username;
    }

    return res.status(200).json(res);
  } catch (err) {
    return res.status(500).json(err);
  }
};

exports.getAcademicSubjects = async (req, res) => {
  try {
    const pipeline = [
      {
        $match: {
          academicYear: new mongoose.Types.ObjectId(req.params.academicYearId),
        },
      },
    ];

    if (req.params.branch) {
      pipeline[0].$match.branch = new mongoose.Types.ObjectId(req.query.branch);
    }

    pipeline.push(
      {
        $lookup: {
          from: "academicyears", // must match Mongo collection name
          localField: "academicYear",
          foreignField: "_id",
          as: "academicYear",
        },
      },
      { $unwind: "$academicYear" },
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
          name: 1,
          semester: 1,
          academicYear: "$academicYear.label",
          branchName: "$branch.branchName",
          faculty: "$faculty.username",
          division: "$division.division",
        },
      },
    );

    const subjects = await Subject.aggregate(pipeline);

    return res.status(200).json({ subjects });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
