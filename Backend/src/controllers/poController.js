const ProgramOutcome = require('../models/ProgramOutcome');

// Create a new Program Outcome
exports.createPO = async (req, res) => {
  try {
    const { poNumber, description, category } = req.body;

    const po = await ProgramOutcome.create({
      poNumber,
      description,
      category: category || 'Engineering Knowledge'
    });

    res.status(201).json({
      success: true,
      message: 'Program Outcome created successfully',
      data: po
    });
  } catch (error) {
    console.error('Error creating PO:', error);
    res.status(400).json({
      success: false,
      message: 'Failed to create Program Outcome',
      error: error.message
    });
  }
};

// Get all POs
exports.getAllPOs = async (req, res) => {
  try {
    const pos = await ProgramOutcome.find().sort({ poNumber: 1 });

    res.status(200).json({
      success: true,
      data: pos
    });
  } catch (error) {
    console.error('Error fetching POs:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch Program Outcomes',
      error: error.message
    });
  }
};

// Update a PO
exports.updatePO = async (req, res) => {
  try {
    const { id } = req.params;
    const { description, category } = req.body;

    const po = await ProgramOutcome.findByIdAndUpdate(
      id,
      { description, category },
      { new: true, runValidators: true }
    );

    if (!po) {
      return res.status(404).json({
        success: false,
        message: 'Program Outcome not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Program Outcome updated successfully',
      data: po
    });
  } catch (error) {
    console.error('Error updating PO:', error);
    res.status(400).json({
      success: false,
      message: 'Failed to update Program Outcome',
      error: error.message
    });
  }
};

// Delete a PO
exports.deletePO = async (req, res) => {
  try {
    const { id } = req.params;
    const po = await ProgramOutcome.findByIdAndDelete(id);

    if (!po) {
      return res.status(404).json({
        success: false,
        message: 'Program Outcome not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Program Outcome deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting PO:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete Program Outcome',
      error: error.message
    });
  }
};

