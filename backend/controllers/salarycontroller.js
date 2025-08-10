const Salary = require('../model/salary');
const Employee = require('../model/employee');

exports.addSalary = async (req, res) => {
  try {
    const { employeeId, date, salary } = req.body;

    // Check if employee exists
    const employee = await Employee.findById(employeeId);
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    const newSalary = new Salary({
      employee: employeeId,
      date,
      salary
    });

    await newSalary.save();

    res.status(201).json({ success: true, message: 'Salary added successfully', data: newSalary });
  } catch (error) {
    console.error('Error adding salary:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

exports.getAllSalary = async (req, res) => {
  try {

    const salaryRecords = await Salary.find()
       .populate({
        path: 'employee',
        select: 'firstName lastName employeeId' 
      })
      .sort({ createdAt: -1 });

    if (!salaryRecords) {
      return res.status(404).json({ message: 'salaryRecords not found' });
    }

    res.status(200).json({ success: true, data: salaryRecords });
  } catch (error) {
    console.error('Error fetching salary:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};


exports.getMySalary = async (req, res) => {
  try {
    const { userId } = req.user;

    const salaryRecords = await Salary.find({ employee: userId }).sort({ date: -1 });
    if (!salaryRecords) {
      return res.status(404).json({ message: 'salaryRecords not found' });
    }

    res.status(200).json({ success: true, data: salaryRecords });
  } catch (error) {
    console.error('Error fetching salary:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};