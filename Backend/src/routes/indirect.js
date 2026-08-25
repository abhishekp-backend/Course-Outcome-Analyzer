const express = require("express");
const router = express.Router();

const {
  getIndirect,
} = require("../controllers/indirectAttainmentController");

// GET indirect assessment values by class ID
router.get("/:classId", getIndirect);

module.exports = router;