const express = require("express");
const { authenticateToken } = require("../middleware/auth");
const Student = require("../models/Student");
const branch = require("../models/Branch");
const section = require("../models/Class");
const subject = require("../models/Subject");
const marks = require("../models/studentRecords");
const { isObject, flattenObject } = require("../utils/checkField");
const mongoose = require("mongoose");
const multer = require("multer");
const xlsx = require("xlsx");
const path = require("path");

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    if (
      file.mimetype ===
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
      file.mimetype === "application/vnd.ms-excel"
    ) {
      cb(null, true);
    } else {
      cb(new Error("Only Excel files are allowed"), false);
    }
  },
});

// Add a new student
exports.addStudent = async (req, res) => {
  try {
    const { name, prn, roll, mobile, subject } = req.body;

    // Check if student with same PRN already exists
    const existingStudent = await Student.findOne({ prn, subject });
    if (existingStudent) {
      return res.status(400).json({
        success: false,
        message: "Student with this PRN already exists",
      });
    }

    // Create new student
    const student = new Student({
      name,
      prn,
      roll,
      mobile,
      subject,
    });
    await student.save();

    res.status(201).json({
      success: true,
      message: "Student added successfully",
      data: student,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Failed to add student",
      error: error.message,
    });
  }
};

// Get all students
exports.getAllStudents = async (req, res) => {
  try {
    const filter = req.query;

    let classRoom = await section.findById(filter.class, {
      _id: 0,
      academicYear: 1,
      division: 1,
      semester: 1,
      branch: 1,
    });

    if (filter) {
      if (!classRoom) {
        return res.status(404).json({
          success: false,
          message: "Section not found",
        });
      }

      const classId = new mongoose.Types.ObjectId(filter.class);

      classRoom = classRoom.toObject();
      const students = await Student.aggregate([
        { $match: classRoom },
        { $sort: { roll: 1 } },

        {
          $lookup: {
            from: "studentmarks",
            let: {
              studentPrn: "$prn",
            },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [
                      { $eq: ["$prn", "$$studentPrn"] },
                      { $eq: ["$class", classId] },
                    ],
                  },
                },
              },
              {
                $project: {
                  _id: 0,
                  prn: 0,
                },
              },
            ],
            as: "performance",
          },
        },
      ]);

      res.status(200).json({
        success: true,
        count: students.length,
        data: students,
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch students",
      error: error.message,
    });
  }
};

// Get a single student by ID
exports.getStudentById = async (req, res) => {
  try {
    const { prn, subjectID } = req.body;
    let students = await Student.find({ subject: subjectID, prn: prn });

    let result = await Promise.all(
      students.map(async (e) => {
        let res = await marks.findOne(
          { prn: e.prn },
          { _id: 0, prn: 0, subject: 0 },
        );
        return {
          roll: e.roll,
          name: e.name,
          prn: e.prn,
          ...res?._doc, // spreading mongoose doc safely
        };
      }),
    );

    if (!result || result.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch student",
      error: error.message,
    });
  }
};

// Update a student
exports.updateStudentMarks = async (req, res) => {
  try {
    const { name, roll, mobile, subject } = req.body;

    // Find student and update
    const student = await Student.findByIdAndUpdate(
      req.params.id,
      { name, roll, mobile, subject },
      { new: true, runValidators: true },
    );

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Student updated successfully",
      data: student,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update student",
      error: error.message,
    });
  }
};

exports.updateStudent = async (req, res) => {
  try {
    const { id, data } = req.body;

    for (let prn in data) {
      let temp = data[prn];
      if (isObject(temp)) {
        temp = flattenObject(data[prn]);
      }

      await marks.updateOne(
        { subject: id, prn: prn },
        { $set: temp },
        { upsert: true },
      );
    }

    return res
      .status(200)
      .json({ status: true, message: "Marks updated successfully!" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Failed to update marks!",
    });
  }
};

// Delete a student
exports.deleteStudent = async (req, res) => {
  try {
    const student = await Student.findOneAndDelete({ prn: req.params.id });

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Student deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete student",
      error: error.message,
    });
  }
};

exports.uploadStudents = [
  upload.single("file"),
  async (req, res) => {
    const session = await mongoose.startSession();

    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: "No file uploaded",
        });
      }

      let { id, academicId, classId } = req.body;
      id = JSON.parse(id);

      const workbook = xlsx.read(req.file.buffer, {
        type: "buffer",
      });

      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const rows = xlsx.utils.sheet_to_json(sheet);

      const branchDoc = await branch.findOne(
        { branchName: id.branch },
        { _id: 1 },
      );

      if (!branchDoc) {
        return res.status(404).json({
          success: false,
          message: "Branch not found",
        });
      }

      const sectionDoc = await section.findById(classId);

      if (!sectionDoc) {
        return res.status(404).json({
          success: false,
          message: "Section not found",
        });
      }

      const subjectDoc = await subject.findById(sectionDoc.subject, {
        _id: 1,
      });

      if (!subjectDoc) {
        return res.status(404).json({
          success: false,
          message: "Subject not found",
        });
      }

      const studentInfos = rows.map((row) => ({
        name: row.Name,
        prn: row.PRN,
        roll: row.Roll,
        branch: branchDoc._id,
        semester: sectionDoc.semester,
        division: id.division,
        academicYear: academicId,
        class: classId,
      }));

      const studentMarks = rows.map((row) => ({
        prn: row.PRN,
        subject: subjectDoc._id,
        class: classId,

        ut1co1: Number(row["UT1-CO1"] || 0),
        ut1co2: Number(row["UT1-CO2"] || 0),
        ut1co3: Number(row["UT1-CO3"] || 0),
        ut1co4: Number(row["UT1-CO4"] || 0),
        ut1co5: Number(row["UT1-CO5"] || 0),
        ut1co6: Number(row["UT1-CO6"] || 0),

        ut2co1: Number(row["UT2-CO1"] || 0),
        ut2co2: Number(row["UT2-CO2"] || 0),
        ut2co3: Number(row["UT2-CO3"] || 0),
        ut2co4: Number(row["UT2-CO4"] || 0),
        ut2co5: Number(row["UT2-CO5"] || 0),
        ut2co6: Number(row["UT2-CO6"] || 0),

        ia: Number(row.IA ?? 0),
        pbl: Number(row.PBL ?? 0),
        tw: Number(row.TW ?? 0),

        universityExam: Number(
          row["UniversityExam"] ||
            row["universityExam"] ||
            row["University"] ||
            0,
        ),
      }));

      await session.withTransaction(async () => {
        await Student.insertMany(studentInfos, {
          session,
          ordered: true,
        });

        await section.updateOne(
          { _id: new mongoose.Types.ObjectId(classId) },
          { noOfStudents: studentInfos.length },
        );

        await marks.insertMany(studentMarks, {
          session,
          ordered: true,
        });
      });

      return res.status(200).json({
        success: true,
        message: "Students uploaded successfully",
        count: studentInfos.length,
      });
    } catch (error) {
      console.error(error);

      return res.status(500).json({
        success: false,
        message: "Failed to process file",
        error: error.message,
      });
    } finally {
      await session.endSession();
    }
  },
];
