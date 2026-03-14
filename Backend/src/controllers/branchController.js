const Branch = require("../models/Branch");
const mongoose = require("mongoose")

exports.getBranches = async (req, res) => {
  try {
    const pipeline = [];

    if (req.query.academicYear) {
      pipeline.push({
        $match: {
          academicYear: mongoose.Types.ObjectId(req.query.academicYear)
        }
      });
    }

    pipeline.push(
      {
        $lookup: {
          from: "academicyears", // must match Mongo collection name
          localField: "academicYear",
          foreignField: "_id",
          as: "academicYear"
        }
      },
      {
        $unwind: {
          path: "$academicYear",
          preserveNullAndEmptyArrays: true // prevents dropping branches without a year
        }
      },
      {
        $project: {
          _id: 1,
          branchName: 1,
          academicYearLabel: "$academicYear.label"
        }
      }
    );

    const branches = await Branch.aggregate(pipeline);

    return res.status(200).json({ branches });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};


exports.createBranch = async (req, res) => {
  try {
    const { name, academicYear } = req.body;

    if (!name || !academicYear) {
      return res.status(400).json({ message: "Branch name and academicYear are required" });
    }

    // Check if branch already exists for the same year
    const exists = await Branch.findOne({ 
      branchName: name, 
      academicYear: academicYear 
    });
    if (exists) {
      return res.status(409).json({ message: "Branch already exists for this year" });
    }

    const branch = await Branch.create({
      branchName: name,
      academicYear: new mongoose.Types.ObjectId(academicYear)
    });

    return res.status(201).json({ success: true, branch });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};