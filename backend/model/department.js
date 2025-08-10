const mongoose = require('mongoose');

const departmentSchema = mongoose.Schema(
{
  department: { 
    type: String, 
  },
  totalMembers: { type: Number, default: 0 },
  departmentHead: { type: String, default: 'Not Assigned' },
  
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Department', departmentSchema);