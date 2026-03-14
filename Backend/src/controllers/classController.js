const Class = require("../models/class");

exports.getAllClasses = async (req, res) => {
  try {
    const classes = await Class.aggregate([
      // lookup academicYear
      {
        $lookup: {
          from: "academicyears",        // MongoDB collection name (lowercase + plural usually)
          localField: "academicYear",
          foreignField: "_id",
          as: "academicYear"
        }
      },
      { $unwind: "$academicYear" },    // flatten array
      
      // lookup Faculty
      {
        $lookup: {
          from: "users",        // MongoDB collection name (lowercase + plural usually)
          localField: "faculty",
          foreignField: "_id",
          as: "faculty"
        }
      },
      { $unwind: "$faculty" },    // flatten array
      
      // lookup subjects
      {
        $lookup: {
          from: "subjects",             // MongoDB collection name
          localField: "subject",
          foreignField: "_id",
          as: "subject"
        }
      },
      { $unwind: "$subject" },          // flatten array
      
      // lookup branches
      {
        $lookup: {
          from: "branches",        // MongoDB collection name (lowercase + plural usually)
          localField: "subject.branch",
          foreignField: "_id",
          as: "branch",
        }
      },
      { $unwind: "$branch" },    // flatten array

      // optional: project only fields you need
      {
        $project: {
          _id: 1,
          division: 1,
          "semester": "$subject.semester",
          "academicYear": "$academicYear.label",      // adjust field names as per your schema
          "subject": "$subject.name",
          "faculty": "$faculty.username",
          "branch": "$branch.branchName",
        }
      },

      { $sort: { createdAt: -1 } }    // latest first
    ]);

    return res.status(200).json({ success: true, data: classes });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

exports.createClass = async (req, res) => {
  try {
    const { academicYearId, classId, division, facultyId, semester, subjectId } = req.body;

    if (!academicYearId || !subjectId || !division || !facultyId || !semester) {
      return res.status(400).json({ msg: "Invalid values!" });
    }

    const exists = await Class.findOne({
      academicYear: academicYearId,
      classId: classId,
      division: division.toUpperCase(),
      faculty: facultyId,
      semester: semester,
      subject: subjectId,
    });

    if (exists) {
      return res.status(409).json({ msg: "Class / Section already exists" });
    }

    const newClass = await Class.create({
      academicYear: academicYearId,
      classId: classId,
      division: division.toUpperCase(),
      faculty: facultyId,
      semester: semester,
      subject: subjectId,
    });

    return res.status(201).json({ success: true, data: newClass });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

