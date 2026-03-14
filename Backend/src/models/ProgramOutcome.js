const mongoose = require('mongoose');

const programOutcomeSchema = new mongoose.Schema({
  poNumber: {
    type: Number,
    required: [true, 'PO number is required'],
    unique: true,
    min: [1, 'PO number must be at least 1'],
    max: [12, 'PO number cannot exceed 12']
  },
  description: {
    type: String,
    required: [true, 'PO description is required'],
    trim: true
  },
  category: {
    type: String,
    enum: ['Engineering Knowledge', 'Problem Analysis', 'Design/Development', 
           'Investigation', 'Modern Tools', 'Engineer and Society', 
           'Environment', 'Ethics', 'Individual/Team', 'Communication', 
           'Project Management', 'Lifelong Learning'],
    default: 'Engineering Knowledge'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('ProgramOutcome', programOutcomeSchema);

