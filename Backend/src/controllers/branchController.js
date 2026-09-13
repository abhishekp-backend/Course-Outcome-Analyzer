const Branch = require("../models/Branch");
const mongoose = require("mongoose");
const User = require("../models/User");
const HodUser = require("../models/HodUser");

function generateH_ID() {
  const now = new Date();

  const timestamp = '' +
    now.getFullYear() +
    (now.getMonth() + 101).toString().slice(1) +
    (now.getDate() + 100).toString().slice(1) +
    (now.getHours() + 100).toString().slice(1) +
    (now.getMinutes() + 100).toString().slice(1) +
    (now.getSeconds() + 100).toString().slice(1);

  const random = Math.floor(Math.random() * 0xFFFFFF).toString(16).toUpperCase();
  const randomHex = '000000'.substring(random.length) + random;

  return 'H-' + timestamp + '-' + randomHex;
}

exports.getBranches = async (req, res) => {
  try {
    const pipeline = [];

    if (req.query.academicYear) {
      pipeline.push({
        $match: {
          academicYear: mongoose.Types.ObjectId(req.query.academicYear),
        },
      });
    }

    pipeline.push(
      {
        $lookup: {
          from: "academicyears",
          localField: "academicYear",
          foreignField: "_id",
          as: "academicYear",
        },
      },
      {
        $unwind: {
          path: "$academicYear",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: {
          _id: 1,
          branchName: 1,
          academicYearLabel: "$academicYear.label",
        },
      },
    );

    const branches = await Branch.aggregate(pipeline);

    return res.status(200).json({ branches });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

exports.createBranch = async (req, res) => {
  const session = await mongoose.startSession();

  try {
    const { name, academicYear, hodEmail, hodPassword, hodUsername } =
      req.body;

    if (!name || !academicYear) {
      return res.status(400).json({
        message: "Branch name and academicYear are required",
      });
    }

    if (!hodEmail || !hodPassword) {
      return res.status(400).json({
        message: "HOD email or password not given.",
      });
    }

    if (!hodUsername) {
      return res.status(400).json({
        message: "HOD username and fID are required.",
      });
    }

    const academicYearId = new mongoose.Types.ObjectId(academicYear);

    // Check if branch already exists for the same academic year
    const exists = await Branch.findOne({
      branchName: name,
      academicYear: academicYearId,
    }).session(session);

    if (exists) {
      return res.status(409).json({
        message: "Branch already exists for this year",
      });
    }

    // Check HOD email in HodUser collection
    const hodExists = await HodUser.findOne({
      email: hodEmail.toLowerCase(),
    }).session(session);

    if (hodExists) {
      return res.status(409).json({
        message: "HOD email already exists in this college.",
      });
    }

    await session.withTransaction(async () => {
      // 1. Create Branch
      const [branch] = await Branch.create(
        [
          {
            branchName: name,
            academicYear: academicYearId,
          },
        ],
        { session },
      );

      // 2. Create HOD user
      await HodUser.create(
        [
          {
            username: hodUsername,
            email: hodEmail,
            password: hodPassword,
            hodID: generateH_ID(),
            branchId: branch._id,
          },
        ],
        { session },
      );

      // Make branch available outside transaction
      req.createdBranch = branch;
    });

    return res.status(201).json({
      success: true,
      branch: req.createdBranch,
    });
  } catch (err) {
    return res.status(500).json({
      error: err.message,
    });
  } finally {
    await session.endSession();
  }
};
