const mongoose = require('mongoose');

const employeeSchema = mongoose.Schema(
{
  // Personal Details
  firstName: { type: String },
  lastName: { type: String},
  email: { type: String, unique: true },
  password: { type: String, select: false},
  phone: { type: String, unique: true },
  dateOfBirth: { type: Date },
  gender: { type: String, enum: ['Male', 'Female', 'Other'] },
  maritalStatus: { type: String, enum: ['Single', 'Married', 'Divorced', 'Widowed'] },
  expirience: { type: String },
  degree: { type: String },
  yearOfPassing: { type: Number },
  
  // Employee Details
  employeeId: { type: String, unique: true, sparse: true },
  department: { type: String},
  position: { type: String },
  salary: { type: Number },
  dateOfJoining: { type: Date },
  
  // Documents
  imageUrl: { type: String },

  role:{
    type: String,
    default: 'employee'
  },
  forgotPasswordCode: {
    type: String,
    select: false,
  },
  forgotPasswordCodeValidation: {
    type: Number,
    select: false,
  },
  
  // Timestamps
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Employee', employeeSchema);