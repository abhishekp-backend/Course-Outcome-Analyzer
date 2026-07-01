const academicYear = require("../models/academicYear")

exports.getAllYears = async (req, res) => {
    try {
        const academic = await academicYear.find();
        return res.status(200).json({
            academicYears: academic
        });
    }
    catch (err) {
        return res.status(500).json(err)
    }
}

exports.createNewAcademic = async (req, res) => {
    try {
        const {year, label, startDate, endDate} = req.body;
        if (!year || !label || !startDate || !endDate) {
            return res.status(400).json({msg: "Invalid values!"})
        }
        const academicYearStatus = await academicYear.create({year: year.split("-")[0], label, startDate, endDate, isLocked: true});
        if (!academicYearStatus) {
            return res.status(500).json({error:"Failed to create new academic year"})
        }
        return res.status(200).json({success: true})
    }
    catch (err) {
        console.log("Academic year error: ", err);
        return res.status(500).json({error:err})
    }
}