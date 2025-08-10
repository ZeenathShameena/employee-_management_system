import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Form, Alert } from 'react-bootstrap';
import { useAuth } from '../../context/Authcontext';

const Resignation = () => {
  const { user } = useAuth();
  const [resignations, setResignations] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [selectedResignation, setSelectedResignation] = useState(null);
  const [status, setStatus] = useState('');
  const [adminResponse, setAdminResponse] = useState('');
  const [message, setMessage] = useState('');

  // Fetch all resignations
  const fetchResignations = async () => {
    try {
      const res = await fetch('http://localhost:4500/api/resignation/get-all', {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      const data = await res.json();
      if (data.success) setResignations(data.data);
    } catch (err) {
      console.error('Error fetching resignations:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResignations();
  }, []);

  // Open Modal
  const handleOpenModal = (resignation) => {
    setSelectedResignation(resignation);
    setStatus(resignation.status || '');
    setAdminResponse(resignation.adminResponse || '');
    setShowModal(true);
    setMessage('');
  };

  // Close Modal
  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedResignation(null);
    setStatus('');
    setAdminResponse('');
  };

  // Handle Status Update
  const handleUpdateStatus = async () => {
    if (!status) {
      setMessage('Please select status');
      return;
    }

    try {
      const res = await fetch(`http://localhost:4500/api/resignation/update-status/${selectedResignation._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({ status, adminResponse })
      });
      const data = await res.json();
      if (res.ok) {
        alert('Status updated successfully');
        fetchResignations();
        handleCloseModal();
      } else {
        alert(data.message || 'Failed to update status');
      }
    } catch (err) {
      console.error('Error updating status:', err);
      alert('Server error');
    }
  };

  return (
    <div className="container mt-4">
      <h4 className="mb-3">Resignation Requests</h4>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Emp ID</th>
              <th>Reason</th>
              <th>Resignation Date</th>
              <th>Status</th>
              <th>Admin Response</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {resignations.map((resign) => (
              <tr key={resign._id}>
                <td>{resign.employee?.employeeId}</td>
                <td>{resign.reason}</td>
                <td>{new Date(resign.resignationDate).toLocaleDateString()}</td>
                <td>{resign.status}</td>
                <td>{resign.adminResponse || '-'}</td>
                <td>
                  <Button size="sm" variant="primary" onClick={() => handleOpenModal(resign)}>
                    Update
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Update Status</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {message && <Alert variant="danger">{message}</Alert>}
          <Form.Group className="mb-3">
            <Form.Label>Status</Form.Label>
            <Form.Select value={status} onChange={(e) => setStatus(e.target.value)} required>
              <option value="">Select Status</option>
              <option value="Pending">Pending</option>
              <option value="Accepted">Accepted</option>
              <option value="Rejected">Rejected</option>
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Admin Response</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={adminResponse}
              onChange={(e) => setAdminResponse(e.target.value)}
              placeholder="Enter response (optional)"
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>Cancel</Button>
          <Button variant="success" onClick={handleUpdateStatus}>Update</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Resignation;
