const Leave = require('../model/leave');
const Employee = require('../model/employee');
const transport = require('../middlewares/sendMail');


//For  Admin USE
exports.getAll = async (req, res) => {
  try {
    const leaveApplications = await Leave.find()
      .sort({ createdAt: -1 })
      .populate({
        path: 'employee',
        select: 'employeeId firstName department'
      });
    res.status(200).json({ success: true, data: leaveApplications });
  } catch (error) {
    console.error('Error fetching employees:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};


exports.updateLeaveStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['Approved', 'Rejected'].includes(status)) {
      return res.status(400).json({ message: 'Invalid action. Must Approve or Reject.' });
    }

    // Fetch leave first to get user email
    const leave = await Leave.findById(id).populate('employee'); // assuming employee ref in Leave schema

    if (!leave) {
      return res.status(404).json({ message: 'Leave application not found' });
    }

    // Update leave status
    leave.status = status;
    leave.updatedAt = new Date();
    await leave.save();

    // Send email notification
    let info = await transport.sendMail({
      from: process.env.NODE_CODE_SENDING_EMAIL_ADDRESS,
      to: leave.employee.email,
      subject: 'Leave Application Status Update',
      html: `
        <h2>Leave Application ${status}</h2>
        <p>Hi ${leave.employee.firstName},</p>
        <p>Your leave application from <strong>${leave.fromDate.toISOString().slice(0, 10)} to ${leave.toDate.toISOString().slice(0, 10)}</strong> has been <strong>${status.toLowerCase()}</strong>.</p>
        <p>Regards,<br/>Admin Team</p>
      `
    });

    res.status(200).json({
      success: true,
      message: `Leave ${status.toLowerCase()} successfully`,
    });

  } catch (error) {
    console.error('Error updating leave status:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};


//For EMP USE
exports.applyLeave = async (req, res) => {
  try {
    const { leaveType, fromDate, toDate, reason } = req.body;
    const { userId } = req.user; 

    // Validate required fields
    if (!leaveType || !fromDate || !toDate || !reason) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Ensure employee exists
    const employee = await Employee.findById(userId);
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    // Calculate number of days
    const from = new Date(fromDate);
    const to = new Date(toDate);
    const days = Math.floor((to - from) / (1000 * 60 * 60 * 24)) + 1;

    if (days <= 0) {
      return res.status(400).json({ message: 'Invalid leave date range' });
    }

    //Check for overlapping leaves
    const overlapping = await Leave.findOne({
      employee: userId,
      $or: [
        { fromDate: { $lte: to }, toDate: { $gte: from } }
      ],
      status: { $ne: 'Rejected' }
    });

    if (overlapping) {
      return res.status(400).json({ message: 'Already applied for Leave' });
    }

    // Save leave application
    const leave = new Leave({
      employee: userId,
      leaveType,
      fromDate: from,
      toDate: to,
      days,
      reason
    });

    await leave.save();

    res.status(201).json({ message: 'Leave application submitted successfully', leave });

  } catch (error) {
    console.error('Error applying for leave:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};


exports.LeaveHistory = async (req, res) => {
  try {
    const { userId } = req.user;

    const leaves = await Leave.find({ employee: userId })
    .populate('employee', 'firstName lastName employeeId')
    .sort({ createdAt: -1 })
    .select('-employee -createdAt -updatedAt');

    if (!leaves || leaves.length === 0) {
      return res.status(404).json({ error: 'No leave history found for this employee' });
    }

    res.status(201).json({ success: 'true', data: leaves });

  }catch (error){
    console.error('Error fetching leave history:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
}