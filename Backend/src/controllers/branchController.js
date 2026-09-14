const Branch = require("../models/Branch");
const mongoose = require("mongoose");
const HodUser = require("../models/HodUser");

function generateH_ID() {
  const now = new Date();

  const timestamp =
    "" +
    now.getFullYear() +
    (now.getMonth() + 101).toString().slice(1) +
    (now.getDate() + 100).toString().slice(1) +
    (now.getHours() + 100).toString().slice(1) +
    (now.getMinutes() + 100).toString().slice(1) +
    (now.getSeconds() + 100).toString().slice(1);

  const random = Math.floor(Math.random() * 0xffffff)
    .toString(16)
    .toUpperCase();
  const randomHex = "000000".substring(random.length) + random;

  return "H-" + timestamp + "-" + randomHex;
}

exports.getBranches = async (req, res) => {
  try {
    let matchQuery = {};

    if (req.query.academicYear) {
      matchQuery.academicYear = new mongoose.Types.ObjectId(
        req.query.academicYear,
      );
    }

    if (req?.user.branchId && req.user.branchId !== "all") {
      matchQuery._id = new mongoose.Types.ObjectId(req.user.branchId);
    }

    const pipeline = [
      {
        $match: matchQuery,
      },
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
    ];

    const branches = await Branch.aggregate(pipeline);

    return res.status(200).json({ branches });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

exports.createBranch = async (req, res) => {
  const { name, academicYear, hodEmail, hodPassword, hodUsername } = req.body;

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
      message: "HOD username is required.",
    });
  }

  if (!mongoose.Types.ObjectId.isValid(academicYear)) {
    return res.status(400).json({
      message: "Invalid academicYear",
    });
  }

  const academicYearId = new mongoose.Types.ObjectId(academicYear);
  const normalizedEmail = hodEmail.toLowerCase();

  const session = await mongoose.startSession();

  try {
    const exists = await Branch.findOne({
      branchName: name,
      academicYear: academicYearId,
    }).session(session);

    if (exists) {
      return res.status(409).json({
        message: "Branch already exists for this year",
      });
    }

    const [hodExists, userExists] = await Promise.all([
      HodUser.findOne({
        email: normalizedEmail,
      }).session(session),
    ]);

    if (hodExists || userExists) {
      return res.status(409).json({
        message: "HOD email already exists in this college.",
      });
    }

    let createdBranch;

    await session.withTransaction(async () => {
      const [branch] = await Branch.create(
        [
          {
            branchName: name,
            academicYear: academicYearId,
          },
        ],
        { session },
      );

      await HodUser.create(
        [
          {
            username: hodUsername,
            email: normalizedEmail,
            password: hodPassword,
            hodID: generateH_ID(),
            branchId: branch._id,
          },
        ],
        { session },
      );

      createdBranch = branch;
    });

    return res.status(201).json({
      success: true,
      branch: createdBranch,
    });
  } catch (err) {
    console.log(err);

    return res.status(500).json({
      error: err.message,
    });
  } finally {
    await session.endSession();
  }
};
