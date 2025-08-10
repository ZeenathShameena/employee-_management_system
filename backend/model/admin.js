const mongoose = require('mongoose');

const adminSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required:[true, 'Name required!']
        },
        email: {
            type: String,
            required: [true, 'Email  required!'],
            trim: true,
            unique: [true, 'Email must be unique!'],
            minLength: [5, 'Email must have 5 characters!'],
            lowercase: true,
        },
        password: {
            type: String,
            required: [true, 'Password must be provided!'],
            trim: true,
            select: false,
        },
        role:{
            type: String,
            default: 'admin'
        },
        forgotPasswordCode: {
            type: String,
            select: false,
        },
        forgotPasswordCodeValidation: {
            type: Number,
            select: false,
        }
});

module.exports = mongoose.model('Admin', adminSchema);

