const express = require("express")
const {authenticateToken} = require("../middleware/auth")
const {getAllClasses, createClass} = require("../controllers/classController")
const router = express.Router();

router.post("/fetchClasses", authenticateToken, getAllClasses);
router.post("/createClass", authenticateToken, createClass);

module.exports = router;