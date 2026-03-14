const mongoose = require('mongoose');

const studentSubjectMapSchema = new mongoose.Schema({
  studentId: {
    type: String,  // PRN as unique student ID
    required: [true, 'Student PRN is required'],
    trim: true,
  },
  subjectId: {
    type: String,
    required: [true, 'Subject ID is required'],
  }
});

module.exports = mongoose.model('StudentSubjectMap', studentSubjectMapSchema);
