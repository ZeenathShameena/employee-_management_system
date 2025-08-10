import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/Authcontext';
import { Table, Button, Modal, Form, Alert } from 'react-bootstrap';

const IssueReport = () => {
  const { user } = useAuth();
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [responseText, setResponseText] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [showModal, setShowModal] = useState(false);

  // Fetch issues
  const fetchIssues = async () => {
    try {
      const res = await fetch('http://localhost:4500/api/issue/all', {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      const data = await res.json();
      if (data.success) {
        setIssues(data.data);
      } else {
        setErrorMessage('Failed to load issues');
      }
    } catch (error) {
      console.error('Error fetching issues:', error);
      setErrorMessage('Server error fetching issues');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIssues();
  }, []);

  const handleOpenModal = (issue) => {
    setSelectedIssue(issue);
    setResponseText('');
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedIssue(null);
    setResponseText('');
  };

  const handleSubmitResponse = async () => {
    try {
      const res = await fetch(`http://localhost:4500/api/issue/reponse/${selectedIssue._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`
        },
        body: JSON.stringify({ response: responseText })
      });
      const data = await res.json();
      if (data.success) {
        setSuccessMessage('Response sent successfully!');
        handleCloseModal();
        fetchIssues();
      } else {
        setErrorMessage(data.message || 'Failed to send response');
      }
    } catch (err) {
      console.error('Error sending response:', err);
      setErrorMessage('Server error while sending response');
    }
  };

  return (
    <div className="container mt-4">
      <h4 className="mb-3">Reported Issues</h4>

      {successMessage && <Alert variant="success">{successMessage}</Alert>}
      {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}

      {loading ? (
        <p>Loading issues...</p>
      ) : (
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Employee</th>
              <th>EMP ID</th>
              <th>Subject</th>
              <th>Description</th>
              <th>Reported On</th>
              <th>Response</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {issues.length === 0 ? (
              <tr><td colSpan="6" className="text-center">No issues found.</td></tr>
            ) : (
              issues.map((issue) => (
                <tr key={issue._id}>
                  <td>{issue.employee?.firstName} {issue.employee?.lastName}</td>
                  <td>{issue.employee.employeeId}</td>
                  <td>{issue.subject}</td>
                  <td>{issue.description}</td>
                  <td>{new Date(issue.createdAt).toLocaleDateString()}</td>
                  <td>{issue.response || 'Not responded'}</td>
                  <td>
                    <Button size="sm" onClick={() => handleOpenModal(issue)}>
                      Respond
                    </Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </Table>
      )}

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Respond to Issue</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedIssue && (
            <>
              <p><strong>Subject:</strong> {selectedIssue.subject}</p>
              <p><strong>Description:</strong> {selectedIssue.description}</p>
              <Form.Group>
                <Form.Label>Response</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  value={responseText}
                  onChange={(e) => setResponseText(e.target.value)}
                  placeholder="Write your response here"
                />
              </Form.Group>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>Cancel</Button>
          <Button variant="primary" onClick={handleSubmitResponse}>Submit Response</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default IssueReport;
