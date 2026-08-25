const mongoose = require("mongoose");
const Indirect = require("../models/Indirect");

const getIndirect = async (req, res) => {
  try {
    const { classId } = req.params;

    // -----------------------------
    // 1. Validate classId
    // -----------------------------
    if (!classId) {
      return res.status(400).json({
        success: false,
        message: "classId is required",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(classId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid classId",
      });
    }

    // -----------------------------
    // 2. Find indirect record
    // -----------------------------
    const indirect = await Indirect.findOne({
      class: new mongoose.Types.ObjectId(classId),
    }).lean();

    // -----------------------------
    // 3. Record not found
    // -----------------------------
    if (!indirect) {
      return res.status(404).json({
        success: false,
        message: "Indirect assessment record not found",
      });
    }

    // -----------------------------
    // 4. Return values
    // -----------------------------
    return res.status(200).json({
      success: true,
      data: indirect,
    });

  } catch (error) {
    console.error("Get indirect assessment error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

module.exports = {
  getIndirect,
};