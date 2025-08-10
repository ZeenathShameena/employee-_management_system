import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, InputGroup, FormControl } from 'react-bootstrap';
import { useAuth } from '../../context/Authcontext';

const Department = () => {
  const { user } = useAuth();

  const [departments, setDepartments] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newDept, setNewDept] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const [showEmployeesModal, setShowEmployeesModal] = useState(false);
  const [selectedDept, setSelectedDept] = useState('');
  const [employees, setEmployees] = useState([]);

  const [editModal, setEditModal] = useState(false);
  const [editDept, setEditDept] = useState('');
  const [editDeptId, setEditDeptId] = useState('');

  const fetchDepartments = async () => {
    try {
      const res = await fetch('http://localhost:4500/api/dept/get-all', {
        method: 'GET',
        headers: { Authorization: `Bearer ${user.token}` },
      });
      const data = await res.json();
      setDepartments(data.data);
    } catch (error) {
      console.error('Error fetching departments:', error);
    }
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  const handleAddDepartment = async () => {
    try {
      const response = await fetch('http://localhost:4500/api/dept/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({ department: newDept })
      });
      const result = await response.json();

      if (response.ok) {
        setNewDept('');
        setShowModal(false);
        fetchDepartments();
      } else {
        alert(result.message || result.error || 'Failed to Add Department');
      }
    } catch (error) {
      console.error('Error adding department:', error);
    }
  };

  const handleDelete = async (_id) => {
    const confirm = window.confirm('Are you sure you want to delete this department?');
    if (!confirm) return;

    try {
      const res = await fetch(`http://localhost:4500/api/dept/delete/${_id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${user.token}` }
      });
      const result = await res.json();
      if (result.success) {
        setDepartments(departments.filter(dep => dep._id !== _id));
      } else {
        alert(result.message || 'Failed to delete');
      }
    } catch (err) {
      console.error('Delete error:', err);
      alert('Server error');
    }
  };

  const handleViewEmployees = async (deptName) => {
    setSelectedDept(deptName);
    setShowEmployeesModal(true);
    setEmployees([]);

    try {
      const res = await fetch(`http://localhost:4500/api/dept/employees-list/${deptName}`, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      const data = await res.json();
      if (data.employees) {
        setEmployees(data.employees);
      }
    } catch (err) {
      console.error('Failed to fetch employees:', err);
    }
  };

  const handleOpenEditModal = (dept) => {
    setEditDept(dept.department);
    setEditDeptId(dept._id);
    setEditModal(true);
  };

  const handleUpdateDepartment = async () => {
    try {
      const res = await fetch(`http://localhost:4500/api/dept/update/${editDeptId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({ department: editDept })
      });
      const data = await res.json();
      if (res.ok) {
        alert('Department updated successfully');
        fetchDepartments();
        setEditModal(false);
      } else {
        alert(data.message || 'Failed to update department');
      }
    } catch (err) {
      console.error('Update error:', err);
      alert('Server error');
    }
  };

  const filteredDepartments = departments?.filter(dept =>
    dept.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-4">
      <h3>Manage Departments</h3>

      <div className="d-flex justify-content-between align-items-center mb-3">
        <InputGroup style={{ maxWidth: 300 }}>
          <FormControl
            placeholder="Search By Department"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </InputGroup>

        <Button variant="success" onClick={() => setShowModal(true)}>
          + Add New Department
        </Button>
      </div>

      <Table striped bordered hover>
        <thead>
          <tr>
            <th>S No</th>
            <th>Department</th>
            <th>Department Head</th>
            <th>Total Members</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {filteredDepartments?.map((dept, index) => (
            <tr key={dept._id}>
              <td>{index + 1}</td>
              <td>
                <div className="d-flex justify-content-between align-items-center">
                  <span>{dept.department}</span>
                  <Button
                    variant="outline-primary"
                    size="sm"
                    onClick={() => handleOpenEditModal(dept)}
                  >✎</Button>
                </div>
              </td>
              <td>{dept.departmentHead}</td>
              <td>
                {dept.totalMembers}{' '}
                <Button
                  size="sm"
                  variant="info"
                  onClick={() => handleViewEmployees(dept.department)}
                >View</Button>
              </td>
              <td>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => handleDelete(dept._id)}
                >Delete</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Add Department Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add Department</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group>
            <Form.Label>Department Name</Form.Label>
            <Form.Control
              type="text"
              value={newDept}
              onChange={(e) => setNewDept(e.target.value)}
              placeholder="Enter department name"
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>Close</Button>
          <Button variant="primary" onClick={handleAddDepartment}>Add</Button>
        </Modal.Footer>
      </Modal>

      {/* Edit Department Modal */}
      <Modal show={editModal} onHide={() => setEditModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Department</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group>
            <Form.Label>Department Name</Form.Label>
            <Form.Control
              type="text"
              value={editDept}
              onChange={(e) => setEditDept(e.target.value)}
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setEditModal(false)}>Cancel</Button>
          <Button variant="primary" onClick={handleUpdateDepartment}>Update</Button>
        </Modal.Footer>
      </Modal>

      {/* Employees List Modal */}
      <Modal show={showEmployeesModal} onHide={() => setShowEmployeesModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Employees in {selectedDept}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {employees.length === 0 ? (
            <p>No employees found.</p>
          ) : (
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>S No</th>
                  <th>Name</th>
                  <th>Emp ID</th>
                  <th>Phone</th>
                  <th>Position</th>
                </tr>
              </thead>
              <tbody>
                {employees.map((emp, idx) => (
                  <tr key={emp._id}>
                    <td>{idx + 1}</td>
                    <td>{emp.firstName} {emp.lastName}</td>
                    <td>{emp.employeeId}</td>
                    <td>{emp.phone}</td>
                    <td>{emp.position}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default Department;
