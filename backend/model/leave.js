const mongoose = require('mongoose');

const leaveSchema = mongoose.Schema({
  employee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee',
    required: true
  },
  leaveType: {
    type: String,
    enum: ['Sick Leave', 'Casual Leave', 'Emergency Leave', 'Maternity Leave', 'Paternity Leave'],
    required: true
  },
  reason: {
    type: String
  },
  fromDate: { type: Date, required: true },
  toDate: { type: Date, required: true },

  days: { type: Number, required: true },

  status: {
    type: String,
    enum: ['Pending', 'Approved', 'Rejected'],
    default: 'Pending'
  },
  
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('LeaveApplication', leaveSchema);