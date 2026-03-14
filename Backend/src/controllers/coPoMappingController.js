const CO_PO_Mapping = require('../models/CO_PO_Mapping');
const CourseOutcome = require('../models/CourseOutcome');
const ProgramOutcome = require('../models/ProgramOutcome');

// Create CO-PO mapping
exports.createMapping = async (req, res) => {
  try {
    const { subject, co, po, correlationLevel } = req.body;

    const mapping = await CO_PO_Mapping.create({
      subject,
      co,
      po,
      correlationLevel: correlationLevel || 2,
      user: req.user.id
    });

    // Populate CO and PO details
    await mapping.populate('co', 'coNumber description');
    await mapping.populate('po', 'poNumber description');

    res.status(201).json({
      success: true,
      message: 'CO-PO mapping created successfully',
      data: mapping
    });
  } catch (error) {
    console.error('Error creating CO-PO mapping:', error);
    res.status(400).json({
      success: false,
      message: 'Failed to create CO-PO mapping',
      error: error.message
    });
  }
};

// Get all CO-PO mappings for a subject
exports.getMappingsBySubject = async (req, res) => {
  try {
    const { subjectId } = req.params;
    const mappings = await CO_PO_Mapping.find({ subject: subjectId })
      .populate('co', 'coNumber description')
      .populate('po', 'poNumber description category')
      .sort({ 'co.coNumber': 1, 'po.poNumber': 1 });

    res.status(200).json({
      success: true,
      data: mappings
    });
  } catch (error) {
    console.error('Error fetching CO-PO mappings:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch CO-PO mappings',
      error: error.message
    });
  }
};

// Update CO-PO mapping
exports.updateMapping = async (req, res) => {
  try {
    const { id } = req.params;
    const { correlationLevel } = req.body;

    const mapping = await CO_PO_Mapping.findByIdAndUpdate(
      id,
      { correlationLevel },
      { new: true, runValidators: true }
    ).populate('co', 'coNumber description')
      .populate('po', 'poNumber description');

    if (!mapping) {
      return res.status(404).json({
        success: false,
        message: 'CO-PO mapping not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'CO-PO mapping updated successfully',
      data: mapping
    });
  } catch (error) {
    console.error('Error updating CO-PO mapping:', error);
    res.status(400).json({
      success: false,
      message: 'Failed to update CO-PO mapping',
      error: error.message
    });
  }
};

// Delete CO-PO mapping
exports.deleteMapping = async (req, res) => {
  try {
    const { id } = req.params;
    const mapping = await CO_PO_Mapping.findByIdAndDelete(id);

    if (!mapping) {
      return res.status(404).json({
        success: false,
        message: 'CO-PO mapping not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'CO-PO mapping deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting CO-PO mapping:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete CO-PO mapping',
      error: error.message
    });
  }
};

// Calculate PO Attainment from CO Attainment
exports.calculatePOAttainment = async (req, res) => {
  try {
    const { subjectId } = req.params;
    
    // Get all CO-PO mappings for the subject
    const mappings = await CO_PO_Mapping.find({ subject: subjectId })
      .populate('co', 'coNumber')
      .populate('po', 'poNumber description');

    // Get CO attainment data (this would come from CO controller)
    // For now, we'll structure it to work with CO attainment results
    const coAttainmentData = req.body.coAttainment || [];

    // Group by PO
    const poAttainmentMap = {};
    
    mappings.forEach(mapping => {
      const poId = mapping.po._id.toString();
      const poNumber = mapping.po.poNumber;
      const correlationLevel = mapping.correlationLevel;
      const coNumber = mapping.co.coNumber;

      if (!poAttainmentMap[poId]) {
        poAttainmentMap[poId] = {
          poId,
          poNumber,
          description: mapping.po.description,
          cos: [],
          weightedAttainment: 0,
          totalWeight: 0
        };
      }

      // Find CO attainment
      const coAttainment = coAttainmentData.find(c => c.coNumber === coNumber);
      if (coAttainment) {
        // Weight by correlation level (1=0.33, 2=0.67, 3=1.0)
        const weight = correlationLevel / 3;
        poAttainmentMap[poId].cos.push({
          coNumber,
          attainment: coAttainment.averagePercentage,
          correlationLevel,
          weight
        });
        poAttainmentMap[poId].weightedAttainment += coAttainment.averagePercentage * weight;
        poAttainmentMap[poId].totalWeight += weight;
      }
    });

    // Calculate final PO attainment
    const poAttainments = Object.values(poAttainmentMap).map(po => ({
      poId: po.poId,
      poNumber: po.poNumber,
      description: po.description,
      averageAttainment: po.totalWeight > 0
        ? parseFloat((po.weightedAttainment / po.totalWeight).toFixed(2))
        : 0,
      cos: po.cos
    }));

    res.status(200).json({
      success: true,
      data: poAttainments
    });
  } catch (error) {
    console.error('Error calculating PO attainment:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to calculate PO attainment',
      error: error.message
    });
  }
};

