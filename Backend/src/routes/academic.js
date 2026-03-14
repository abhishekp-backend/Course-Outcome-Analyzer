const express = require("express")
const { authenticateToken } = require("../middleware/auth")
const { getAllYears, createNewAcademic } = require("../controllers/academicYearController")

const router = express.Router()

router.post("/getYears", authenticateToken, getAllYears)
router.post("/new", authenticateToken, createNewAcademic)

module.exports = router;