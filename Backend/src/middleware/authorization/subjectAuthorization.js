const Subject = require("../../models/Subject");

const authorizeSubject = async (req, res, next) => {
  try {
    const subjectId = req.params.id;
    const hodBranchId = req.user.id;

    const subject = await Subject.findById(subjectId);

    if (!subject) {
      return res.status(404).json({
        success: false,
        message: "Subject not found",
      });
    }

    // Allow access only if the subject belongs to the HOD's branch
    if (subject.branchId.toString() !== hodBranchId.toString()) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to access this subject",
      });
    }

    next();
  } catch (error) {
    next(error);
  }
};

module.exports = {
  authorizeSubject,
};