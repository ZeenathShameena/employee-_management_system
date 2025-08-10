const Department = require('../model/department');
const Employee = require('../model/employee');


exports.createDepartment = async (req, res) => {
  try {
    const { department } = req.body;

    if (!department) {
      return res.status(400).json({ message: 'Department name is required' });
    }

    const existing = await Department.findOne({ department });
    if (existing) {
      return res.status(400).json({ message: 'Department already exists' });
    }

    const newDept = new Department({ department });
    await newDept.save();

    res.status(201).json({ success: true, message: 'Department created successfully', department: newDept });
  } catch (error) {
    console.error('Error creating department:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.updateDepartment = async (req, res) => {
  try {
    const { id } = req.params;
    const { department } = req.body;

    if (!department) {
      return res.status(400).json({ error: 'Department name is required' });
    }

    // Find the department by ID
    const dept = await Department.findById(id);
    if (!dept) {
      return res.status(404).json({ error: 'Department not found' });
    }

    const exists = await Department.findOne({ department });
    if (exists) {
      return res.status(400).json({ error: 'Department with this name already exists' });
    }

    const oldDeptName = dept.department;

    // Update department name
    dept.department = department;
    dept.updatedAt = new Date();
    await dept.save();

    // Update employees having old department name
    const updateResult = await Employee.updateMany(
      { department: oldDeptName },
      { department: department }
    );

    res.status(200).json({ success: true, message: 'Department updated successfully' });

  } catch (error) {
    console.error('Error updating department:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};


exports.getDepartments = async (req, res) => {
  try {
    const departments = await Department.find().sort({ createdAt: 1 });
    res.status(200).json({success: true, data: departments });
  } catch (error) {
    console.error('Error fetching departments:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};


exports.getEmployeesByDeptName = async (req, res) => {
  try {
    const { deptName } = req.params;

    if (!deptName) {
      return res.status(400).json({ success: false, message: "Department name is required" });
    }

    const employees = await Employee.find({ department: deptName })
      .select('firstName lastName employeeId phone position');

    if (employees.length === 0) {
      return res.status(404).json({ success: false, message: "No employees found in this department" });
    }

    res.status(200).json({
      success: true,
      department: deptName,
      count: employees.length,
      employees
    });
  } catch (error) {
    console.error("Error fetching employees by department:", error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};


exports.deleteDepartment = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await Department.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ message: 'Department not found' });
    }

    res.status(200).json({ success: true, message: 'Department deleted successfully' });
  } catch (error) {
    console.error('Error deleting department:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};