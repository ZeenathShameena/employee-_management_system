import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/Authcontext';
import { Modal, Button, Form, Table } from 'react-bootstrap';

const Salary = () => {
  const { user } = useAuth();
  const [employees, setEmployees] = useState([]);
  const [salaryHistory, setSalaryHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [historyLoading, setHistoryLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [salaryData, setSalaryData] = useState({
    amount: '',
    paidOn: '',
  });

  // Fetch All Employees
  const fetchEmployees = async () => {
    try {
      const res = await fetch('http://localhost:4500/api/employee/get-all', {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      const data = await res.json();
      if (data.success) {
        setEmployees(data.data);
      }
    } catch (err) {
      console.error('Failed to fetch employees', err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch Salary History
  const fetchSalaryHistory = async () => {
    try {
      const res = await fetch('http://localhost:4500/api/salary/all', {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      const data = await res.json();
      if (data.success) {
        setSalaryHistory(data.data);
      }
    } catch (err) {
      console.error('Failed to fetch salary history', err);
    } finally {
      setHistoryLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
    fetchSalaryHistory();
  }, []);

  const handleOpenModal = (employee) => {
    setSelectedEmployee(employee);
    setSalaryData({ amount: '', paidOn: '' });
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedEmployee(null);
  };

  const handleSalaryChange = (e) => {
    const { name, value } = e.target;
    setSalaryData((prev) => ({ ...prev, [name]: value }));
  };

  const handleGenerateSalary = async () => {
    try {
      const res = await fetch('http://localhost:4500/api/salary/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({
          employeeId: selectedEmployee._id,
          salary: salaryData.amount,
          date: salaryData.paidOn,
        }),
      });
      const data = await res.json();
      if (data.success) {
        alert('Salary Generated Successfully');
        handleCloseModal();
        fetchSalaryHistory(); // refresh history after new generation
      } else {
        alert(data.message || data.error || 'Failed to generate salary');
      }
    } catch (err) {
      console.error('Error generating salary:', err);
      alert('Error occurred');
    }
  };

  return (
    <div className="container mt-4">
      <h4 className="mb-3">Salary Generation</h4>

      {loading ? (
        <div>Loading employees...</div>
      ) : (
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Emp ID</th>
              <th>Name</th>
              <th>Department</th>
              <th>Monthly Salary</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {employees.map((emp) => (
              <tr key={emp._id}>
                <td>{emp.employeeId}</td>
                <td>{emp.firstName} {emp.lastName}</td>
                <td>{emp.department}</td>
                <td>{emp.salary}</td>
                <td>
                  <Button variant="success" size="sm" onClick={() => handleOpenModal(emp)}>
                    Generate Salary
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Generate Salary</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedEmployee && (
            <>
              <p><strong>{selectedEmployee.firstName} {selectedEmployee.lastName}</strong> ({selectedEmployee.employeeId})</p>
              <Form.Group className="mb-2">
                <Form.Label>Salary Amount</Form.Label>
                <Form.Control
                  type="number"
                  name="amount"
                  value={salaryData.amount}
                  onChange={handleSalaryChange}
                  required
                />
              </Form.Group>
              <Form.Group className="mb-2">
                <Form.Label>Paid On</Form.Label>
                <Form.Control
                  type="date"
                  name="paidOn"
                  value={salaryData.paidOn}
                  onChange={handleSalaryChange}
                  required
                />
              </Form.Group>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>Cancel</Button>
          <Button variant="primary" onClick={handleGenerateSalary}>Generate</Button>
        </Modal.Footer>
      </Modal>

      <h4 className="mb-3 mt-5">Salary Payment History</h4>

      {historyLoading ? (
        <div>Loading salary history...</div>
      ) : (
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Emp ID</th>
              <th>Name</th>
              <th>Amount Paid</th>
              <th>Date Paid</th>
            </tr>
          </thead>
          <tbody>
            {salaryHistory.map((record, index) => (
              <tr key={record._id}>
                <td>{record.employee?.employeeId}</td>
                <td>{record.employee?.firstName} {record.employee?.lastName}</td>
                <td>₹{record.salary}</td>
                <td>{new Date(record.date).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </div>
  );
};

export default Salary;
