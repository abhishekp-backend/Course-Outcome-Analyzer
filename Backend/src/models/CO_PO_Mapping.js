const mongoose = require('mongoose');

const coPoMappingSchema = new mongoose.Schema({
  subject: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Subject',
    required: [true, 'Subject reference is required']
  },
  co: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'CourseOutcome',
    required: [true, 'CO reference is required']
  },
  po: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ProgramOutcome',
    required: [true, 'PO reference is required']
  },
  correlationLevel: {
    type: Number,
    required: true,
    enum: [1, 2, 3], // 1 = Low, 2 = Medium, 3 = High
    default: 2
  },
  user: {
    type: String,
    required: [true, 'User reference is required']
  }
}, {
  timestamps: true
});

// Ensure unique CO-PO mapping per subject
coPoMappingSchema.index({ subject: 1, co: 1, po: 1 }, { unique: true });

module.exports = mongoose.model('CO_PO_Mapping', coPoMappingSchema);

