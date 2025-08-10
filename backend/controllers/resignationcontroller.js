const Resignation = require('../model/resignation');


exports.getAllResignations = async (req, res) => {
  try {
    const resignations = await Resignation.find()
      .populate('employee', 'firstName lastName employeeId department')
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, data: resignations });
  } catch (error) {
    console.error('Error fetching resignations:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.respondToResignation = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, adminResponse } = req.body;

    if (!['Accepted', 'Rejected'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status' });
    }

    const resignation = await Resignation.findById(id);
    if (!resignation) return res.status(404).json({ success: false, message: 'Resignation not found' });

    resignation.status = status;
    resignation.adminResponse = adminResponse || null;
    resignation.updatedAt = new Date();

    await resignation.save();

    res.status(200).json({ success: true, message: 'Response updated', resignation });
  } catch (error) {
    console.error('Error responding to resignation:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};



exports.submitResignation = async (req, res) => {
  try {
    const { userId } = req.user;
    const { reason, resignationDate } = req.body;

    if (!reason || !resignationDate) {
      return res.status(400).json({ success: false, message: 'Reason and Date required' });
    }

     const existingResignation = await Resignation.findOne({ employee: userId }).sort({ createdAt: -1 });

    if (existingResignation) {
      if (existingResignation.status !== 'Rejected') {
        return res.status(400).json({
          success: false,
          error: "Resignation already Applied"
        });
      }
    }

    const resignation = new Resignation({
      employee: userId,
      reason,
      resignationDate
    });

    await resignation.save();

    res.status(201).json({ success: true, message: 'Resignation submitted successfully', resignation });

  } catch (error) {
    console.error('Error submitting resignation:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

exports.getStatus = async (req, res) => {
  try {
    const { userId } = req.user;

    const resignation = await Resignation.findOne({ employee: userId }).sort({ createdAt: -1 });

    if (!resignation) {
      return res.status(404).json({ success: false, message: 'No resignation record found for this employee' });
    }

    res.status(200).json({ success: true, data: resignation });

  } catch (error) {
    console.error('Error fetching resignation:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

