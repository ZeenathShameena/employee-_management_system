import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/Authcontext';
import { Form, Button, Card, Alert, Table } from 'react-bootstrap';

const Issue = () => {
  const { user } = useAuth();
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const [issues, setIssues] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(true);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess('');
    setError('');

    try {
      const res = await fetch('http://localhost:4500/api/issue/report', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({ subject, description }),
      });

      const data = await res.json();
      if (data.success) {
        setSuccess('Issue reported successfully.');
        setSubject('');
        setDescription('');
        fetchIssueHistory();  // refresh history after submitting
      } else {
        setError(data.message || 'Failed to report issue.');
      }
    } catch (err) {
      console.error('Error reporting issue:', err);
      setError('Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  const fetchIssueHistory = async () => {
    setHistoryLoading(true);
    try {
      const res = await fetch('http://localhost:4500/api/issue/get-response', {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      const data = await res.json();
      if (data.success) {
        setIssues(data.data);
      } else {
        setIssues([]);
      }
    } catch (error) {
      console.error('Failed to fetch issue history:', error);
    } finally {
      setHistoryLoading(false);
    }
  };

  useEffect(() => {
    fetchIssueHistory();
  }, []);

  return (
    <div className="container mt-4" style={{ maxWidth: '700px' }}>
      <Card className="shadow p-4 mb-4">
        <h4 className="mb-3 text-center">Report an Issue</h4>

        {success && <Alert variant="success">{success}</Alert>}
        {error && <Alert variant="danger">{error}</Alert>}

        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Subject</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Description</Form.Label>
            <Form.Control
              as="textarea"
              rows={4}
              placeholder="Describe your issue..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </Form.Group>

          <Button variant="primary" type="submit" disabled={loading}>
            {loading ? 'Submitting...' : 'Submit Issue'}
          </Button>
        </Form>
      </Card>

      <Card className="shadow p-4">
        <h4 className="mb-3 text-center">Issue History</h4>

        {historyLoading ? (
          <p>Loading history...</p>
        ) : issues.length === 0 ? (
          <p className="text-center">No issues reported yet.</p>
        ) : (
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Subject</th>
                <th>Description</th>
                <th>Response</th>
                <th>Updated At</th>
              </tr>
            </thead>
            <tbody>
              {issues.map((issue) => (
                <tr key={issue._id}>
                  <td>{issue.subject}</td>
                  <td>{issue.description}</td>
                  <td>{issue.response || 'No response yet'}</td>
                  <td>{new Date(issue.updatedAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </Card>
    </div>
  );
};

export default Issue;
