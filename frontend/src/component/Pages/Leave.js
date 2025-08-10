import React, { useState, useEffect } from 'react';
import { Table, Button, FormControl, InputGroup } from 'react-bootstrap';
import { useAuth } from '../../context/Authcontext';

const Leave = () => {

  const { user } = useAuth();
  const [leaves, setLeaves] = useState([]);
  const [filteredLeaves, setFilteredLeaves] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedLeave, setSelectedLeave] = useState(null);

  // Fetch leaves from API
  const fetchLeaves = async () => {
    try {
      const res = await fetch('http://localhost:4500/api/leave/details', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${user.token}`
        }
      });
      const response = await res.json();
      
      const data = response.data || [];
      setLeaves(data);
      setFilteredLeaves(data);
    } catch (err) {
      console.error('Error fetching leaves:', err);
      setLeaves([]);
      setFilteredLeaves([]);
    }
  };

  const handleStatusUpdate = async (newStatus) => {
  if (!selectedLeave?._id) return;

  try {
    const res = await fetch(`http://localhost:4500/api/leave/update-status/${selectedLeave._id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${user.token}`
      },
      body: JSON.stringify({ status: newStatus })
    });

    const result = await res.json();

    if (res.ok) {
      alert(`Leave status updated to ${newStatus}`);
      fetchLeaves(); // refresh table
      const modal = window.bootstrap.Modal.getInstance(document.getElementById('viewEmployeeModal'));
      modal.hide();
    } else {
      alert(result.message || 'Failed to update leave status');
    }
  } catch (error) {
    console.error('Error updating status:', error);
    alert('Something went wrong');
  }
};


  useEffect(() => {
    fetchLeaves();
  }, []);

  const openViewModal = async (leave) => {
    setSelectedLeave(leave);
    setLoading(true);
    try {
      // Get employee ID from the leave object
      const employeeId = leave.employee?._id;
      
      if (!employeeId) {
        console.error('Employee ID not found');
        setLoading(false);
        return;
      }

      // Fetch employee details from API
      const res = await fetch(`http://localhost:4500/api/employee/get/${employeeId}`, {
        method: 'GET',
        headers: {
          // 'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`,
        }
      });
      const response = await res.json();
      
      if (response.success && response.data) {
        setSelectedEmployee(response.data);
        
        // Show modal after data is loaded
        const viewModal = new window.bootstrap.Modal(document.getElementById('viewEmployeeModal'));
        viewModal.show();
      } else {
        console.error('Failed to fetch employee data:', response.message || 'Unknown error');
      }
    } catch (err) {
      console.error('Error fetching employee details:', err);
    } finally {
      setLoading(false);
    }
  };

  // Search + Status Filter
  useEffect(() => {
    const filtered = leaves.filter(leave => {
      const empId = leave.employee?.employeeId || '';
      const name = leave.employee?.firstName || '';
      
      const matchesSearch = empId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter ? leave.status === statusFilter : true;
      
      return matchesSearch && matchesStatus;
    });
    setFilteredLeaves(filtered);
  }, [searchTerm, statusFilter, leaves]);

  return (
    <div className="p-4">
      <h3>Manage Leaves</h3>

      <div className="d-flex justify-content-between align-items-center mb-3">
        <InputGroup style={{ maxWidth: 300 }}>
          <FormControl
            placeholder="Search By Emp ID"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </InputGroup>

        <div className="d-flex gap-2">
          <Button
            variant={statusFilter === 'Pending' ? 'primary' : 'outline-primary'}
            onClick={() => setStatusFilter('Pending')}
          >
            Pending
          </Button>
          <Button
            variant={statusFilter === 'Approved' ? 'success' : 'outline-success'}
            onClick={() => setStatusFilter('Approved')}
          >
            Approved
          </Button>
          <Button
            variant={statusFilter === 'Rejected' ? 'danger' : 'outline-danger'}
            onClick={() => setStatusFilter('Rejected')}
          >
            Rejected
          </Button>
          <Button variant="secondary" onClick={() => setStatusFilter('')}>
            Reset
          </Button>
        </div>
      </div>

      <Table striped bordered hover>
        <thead>
          <tr>
            <th>S No</th>
            <th>Emp ID</th>
            <th>Name</th>
            <th>Leave Type</th>
            <th>Department</th>
            <th>Days</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {filteredLeaves.length > 0 ? (
            filteredLeaves.map((leave, index) => (
              <tr key={leave._id}>
                <td>{index + 1}</td>
                <td>{leave.employee?.employeeId || 'N/A'}</td>
                <td>{leave.employee?.firstName || 'N/A'}</td>
                <td>{leave.leaveType}</td>
                <td>{leave.employee?.department || 'N/A'}</td>
                <td>{leave.days}</td>
                <td>{leave.status}</td>
                <td>
                  <Button 
                    size="sm" 
                    variant="info" 
                    onClick={() => openViewModal(leave)}
                    disabled={loading}
                  >
                    {loading ? 'Loading...' : 'View'}
                  </Button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="8" className="text-center">No leaves found</td>
            </tr>
          )}
        </tbody>
      </Table>

      {/* View Details Modal */}
      <div className="modal fade" id="viewEmployeeModal" tabIndex="-1" aria-labelledby="viewEmployeeModalLabel" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header bg-warning text-white">
              <h5 className="modal-title">Employee Details</h5>
              <button type="button" className="btn-close btn-close-white" data-bs-dismiss="modal"></button>
            </div>
            <div className="modal-body">
              {selectedEmployee ? (
                <div>
                  <div className="mb-4 d-flex justify-content-center">
                    <img 
                      src={selectedEmployee.imageUrl} 
                      alt="___profile_" 
                      className="img-fluid rounded-circle" 
                      style={{ width: '150px', height: '150px', objectFit: 'cover', maxHeight: '200px' }}
                    />
                  </div>
                  <div className="row">
                    <div className="col-md-6">
                      <p><strong>Name:</strong> {selectedEmployee.firstName} {selectedEmployee.lastName}</p>
                      <p><strong>Employee ID:</strong> {selectedEmployee.employeeId || 'N/A'}</p>
                      <p><strong>Date of Birth:</strong> {new Date(selectedEmployee.dateOfBirth).toLocaleDateString()}</p>
                      <p><strong>Gender:</strong> {selectedEmployee.gender}</p>
                      <p><strong>Department:</strong> {selectedEmployee.department}</p>
                    </div>
                    <div className="col-md-6">
                      <p><strong>Email:</strong> {selectedEmployee.email}</p>
                      <p><strong>Phone:</strong> {selectedEmployee.phone}</p>
                      <p><strong>Marital Status:</strong> {selectedEmployee.maritalStatus}</p>
                      <p><strong>Experience:</strong> {selectedEmployee.expirience}</p>
                      <p><strong>Degree:</strong> {selectedEmployee.degree}</p>
                    </div>
                  </div>
                  <div className="row mt-2">
                    <div className="col-md-6">
                      <p><strong>Year of Passing:</strong> {selectedEmployee.yearOfPassing}</p>
                    </div>
                    <div className="col-md-6">
                      <p><strong>Position:</strong> {selectedEmployee.position}</p>
                    </div>
                  </div>
                  <div className="row mt-2">
                    <div className="col-md-6">
                      <p><strong>Salary:</strong> {selectedEmployee.salary}</p>
                    </div>
                    <div className="col-md-6">
                      <p><strong>Date of Joining:</strong> {new Date(selectedEmployee.dateOfJoining).toLocaleDateString()}</p>
                    </div>
                  </div>

                  <hr />
                  <h5 className="text-primary mb-2">Leave Details</h5>
                  <div className="row">
                    <div className="col-md-6">
                      <p><strong>Leave Type:</strong> {selectedLeave?.leaveType}</p>
                      <p><strong>Reason:</strong> {selectedLeave?.reason || 'N/A'}</p>
                    </div>
                    <div className="col-md-6">
                      <p><strong>From Date:</strong> {new Date(selectedLeave?.fromDate).toLocaleDateString()}</p>
                      <p><strong>To Date:</strong> {new Date(selectedLeave?.toDate).toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center">
                  <div className="spinner-border" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                  <p>Loading employee details...</p>
                </div>
              )}
            </div>

            <div className="modal-footer d-flex justify-content-between">
              <div>
                <button className="btn btn-success me-2" onClick={() => handleStatusUpdate('Approved')}>Approve</button>
                <button className="btn btn-danger" onClick={() => handleStatusUpdate('Rejected')}>Reject</button>
              </div>
              <button className="btn btn-warning" data-bs-dismiss="modal">Close</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Leave;