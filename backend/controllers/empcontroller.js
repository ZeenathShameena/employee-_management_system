const Employee = require('../model/employee');
const LeaveApplication = require('../model/leave');
const Salary = require('../model/salary');
const Resignation = require('../model/resignation');
const Issue = require('../model/issue');
const Department = require('../model/department');


const { doHash} = require('../utils/hashing');

//For Admin USE
exports.createEmployee = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      phone,
      dateOfBirth,
      gender,
      maritalStatus,
      expirience,
      degree,
      yearOfPassing,
      employeeId,
      department,
      position,
      salary,
      dateOfJoining,
      password
    } = req.body;

    if (!email || !firstName || !employeeId) {
      return res.status(400).json({ message: 'FirstName, Email, employeeId is required' });
    }

    const imageUrl = req.file ? req.file.path : null;

    const hashedPassword = await doHash(password, 12);

    const newEmployee = new Employee({
      firstName,
      lastName,
      email,
      phone,
      dateOfBirth,
      gender,
      maritalStatus,
      expirience,
      degree,
      yearOfPassing,
      employeeId,
      department,
      position,
      salary,
      dateOfJoining,
      imageUrl,
      password: hashedPassword,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    await newEmployee.save();


    const dept = await Department.findOne({ department });

    if (dept) {
      dept.totalMembers = (dept.totalMembers) + 1;

      // If position contains "head" (case-insensitive), update departmentHead
      if (position && position.toLowerCase().includes('head')) {
        dept.departmentHead = `${firstName} ${lastName}`;
      }

      await dept.save();
    }

    res.status(201).json({ message: 'Employee created successfully', employee: newEmployee });
  } catch (error) {
    console.error('Error creating employee:', error);
    if (error.code === 11000) {
      const field = Object.keys(error.keyValue)[0];
      return res.status(400).json({
        message: `An employee with this ${field} already exists`
      });
    }
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};


exports.getAllEmployees = async (req, res) => {
  try {
    const employees = await Employee.find().sort({ createdAt: 1 }); 
    res.status(200).json({ success: true, data: employees });
  } catch (error) {
    console.error('Error fetching employees:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};


exports.getEmpById = async (req, res) => {
  try {
    const { id } = req.params;
    const employees = await Employee.findById(id);
    if (!employees) {
      return res.status(404).json({ error: 'Employee not found' });
    }
    res.status(200).json({ success: true, data: employees });
  } catch (error) {
    console.error('Error fetching employees:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};


exports.updateEmployee = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      firstName,
      lastName,
      email,
      phone,
      dateOfBirth,
      gender,
      maritalStatus,
      expirience,
      degree,
      yearOfPassing,
      employeeId,
      department,
      position,
      salary,
      dateOfJoining,
    } = req.body;

    const imageUrl = req.file ? req.file.path : null;

    const existingEmployee = await Employee.findById(id);
    if (!existingEmployee) {
      return res.status(404).json({ error: 'Employee not found' });
    }

    // Check for duplicate email or phone (if updated)
    if (email && email !== existingEmployee.email) {
      const emailExists = await Employee.findOne({ email });
      if (emailExists) {
        return res.status(400).json({ error: 'Email already in use' });
      }
    }

    if (phone && phone !== existingEmployee.phone) {
      const phoneExists = await Employee.findOne({ phone });
      if (phoneExists) {
        return res.status(400).json({ error: 'Phone number already in use' });
      }
    }

    if (employeeId && employeeId !== existingEmployee.employeeId) {
      const idExists = await Employee.findOne({ employeeId });
      if (idExists) {
        return res.status(400).json({ error: 'Employee ID already in use' });
      }
    }

    //DEPARTMENT HANDLING
    const oldDepartment = existingEmployee.department;
    const newDepartment = department || oldDepartment;

    const oldPosition = existingEmployee.position;
    const newPosition = position || existingEmployee.position;

    const wasHead = oldPosition.toLowerCase().includes("head");
    const isHead = newPosition.toLowerCase().includes("head");


    // Update fields
    existingEmployee.firstName = firstName || existingEmployee.firstName;
    existingEmployee.lastName = lastName || existingEmployee.lastName;
    existingEmployee.email = email || existingEmployee.email;
    existingEmployee.phone = phone || existingEmployee.phone;
    existingEmployee.dateOfBirth = dateOfBirth || existingEmployee.dateOfBirth;
    existingEmployee.gender = gender || existingEmployee.gender;
    existingEmployee.maritalStatus = maritalStatus || existingEmployee.maritalStatus;
    existingEmployee.expirience = expirience || existingEmployee.expirience;
    existingEmployee.degree = degree || existingEmployee.degree;
    existingEmployee.yearOfPassing = yearOfPassing || existingEmployee.yearOfPassing;
    existingEmployee.employeeId = employeeId || existingEmployee.employeeId;
    existingEmployee.department = newDepartment;
    existingEmployee.position = newPosition;
    existingEmployee.salary = salary || existingEmployee.salary;
    existingEmployee.dateOfJoining = dateOfJoining || existingEmployee.dateOfJoining;
    if (imageUrl) {
      existingEmployee.imageUrl = imageUrl;
    }

    existingEmployee.updatedAt = new Date();

    await existingEmployee.save();


    // Update Department Counts if Department Changed
    if (oldDepartment !== newDepartment) {
      // Decrease count from old department
      await Department.findOneAndUpdate(
        { department: oldDepartment },
        { $inc: { totalMembers: -1 }, ...(wasHead && { departmentHead: "Not Assigned" }) },
        { new: true }
      );

      // Increase count in new department
      const newDept = await Department.findOneAndUpdate(
        { department: newDepartment },
        { $inc: { totalMembers: 1 } },
        { new: true }
      );

      if (newDept && newPosition.toLowerCase().includes("head")) {
        newDept.departmentHead = `${existingEmployee.firstName} ${existingEmployee.lastName}`;
        await newDept.save();
      }
    } else {
      const dept = await Department.findOne({ department: newDepartment });
      if (dept) {
        if (wasHead && !isHead) {
          dept.departmentHead = "Not Assigned";
        } else if (isHead) {
          dept.departmentHead = `${existingEmployee.firstName} ${existingEmployee.lastName}`;
        }
        await dept.save();
      }
    }


    res.status(200).json({ message: 'Employee updated successfully', employee: existingEmployee });

  } catch (error) {
    console.error('Error updating employee:', error);
    if (error.code === 11000) {
      const field = Object.keys(error.keyValue)[0];
      return res.status(400).json({
        message: `An employee with this ${field} already exists`
      });
    }
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};


exports.deleteEmployee = async (req, res) => {
  try {
    const { id } = req.params;

    const existing = await Employee.findByIdAndDelete(id);
    if (!existing) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    //Handle department count decrease
    if (existing.department) {
      const dept = await Department.findOne({ department: existing.department });
      if (dept) {
        dept.totalMembers = Math.max(0, (dept.totalMembers || 0) - 1);

        //If deleted employee was head, remove head name
        const fullName = `${existing.firstName} ${existing.lastName}`;
        if (dept.departmentHead === fullName) {
          dept.departmentHead = null;
        }
        await dept.save();
      }
    }

    // Delete related data
    await Promise.all([
      LeaveApplication.deleteMany({ employee: id }),
      Issue.deleteMany({ employee: id }),
      Resignation.deleteMany({ employee: id }),
      Salary.deleteMany({ employee: id })
    ]);

    
    res.status(200).json({ message: 'Employee deleted successfully', employee: existing });
  } catch (error) {
    console.error('Error deleting employee:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};


//For Staff USE
exports.getEmployee = async (req, res) => {
  try {
    const { userId } = req.user;

    const employee = await Employee.findById(userId)
    if (!employee) {
      return res.status(400)
      .json({ 
        error: 'Employee does not exists' });
    }

    res.status(200).json({ success: true, data: employee });
  } catch (error) {
    console.error('Error fetching employees:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.UpdateMe = async (req, res) => {
  try {
    const { userId } = req.user;
    const {
      firstName,
      lastName,
      email,
      phone,
      dateOfBirth,
      gender,
      maritalStatus
    } = req.body;

    const imageUrl = req.file ? req.file.path : null;

    const existingEmployee = await Employee.findById(userId);
    if (!existingEmployee) {
      return res.status(404).json({ error: 'Employee not found' });
    }

    if (email && email !== existingEmployee.email) {
      const emailExists = await Employee.findOne({ email });
      if (emailExists) {
        return res.status(400).json({ error: 'Email already in use' });
      }
    }

    if (phone && phone !== existingEmployee.phone) {
      const phoneExists = await Employee.findOne({ phone });
      if (phoneExists) {
        return res.status(400).json({ error: 'Phone number already in use' });
      }
    }

    // Update fields
    existingEmployee.firstName = firstName || existingEmployee.firstName;
    existingEmployee.lastName = lastName || existingEmployee.lastName;
    existingEmployee.email = email || existingEmployee.email;
    existingEmployee.phone = phone || existingEmployee.phone;
    existingEmployee.dateOfBirth = dateOfBirth || existingEmployee.dateOfBirth;
    existingEmployee.gender = gender || existingEmployee.gender;
    existingEmployee.maritalStatus = maritalStatus || existingEmployee.maritalStatus;
    if (imageUrl) {
      existingEmployee.imageUrl = imageUrl;
    }

    existingEmployee.updatedAt = new Date();

    await existingEmployee.save();

    res.status(200).json({ message: 'Employee updated successfully', employee: existingEmployee });

  } catch (error) {
    console.error('Error updating employee:', error);
    if (error.code === 11000) {
      const field = Object.keys(error.keyValue)[0];
      return res.status(400).json({
        message: `An employee with this ${field} already exists`
      });
    }
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};


