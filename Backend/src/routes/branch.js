const express = require("express");
const router = express.Router();

const {
  getBranches,
  createBranch
} = require("../controllers/branchController");
const { authenticateToken } = require("../middleware/auth")

/* ================= BRANCH ROUTES ================= */
router.use(authenticateToken)
// Fetch branches (with filter in body)
router.post("/getBranches", getBranches);

// Create new branch
router.post("/createBranch", createBranch);

module.exports = router;
