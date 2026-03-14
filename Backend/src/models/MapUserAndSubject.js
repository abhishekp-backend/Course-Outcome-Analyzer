const mongoose = require('mongoose');

const facultySubjectMapSchema = new mongoose.Schema({
  fID: {
    type: String,
    required: [true, 'Faculty ID is required']
  },
  subjectID: {
    type: String,
    required: [true, 'Subject ID is required'],
  }
});

module.exports = mongoose.model('FacultySubjectMap', facultySubjectMapSchema);
