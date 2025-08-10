import React, { useState, useEffect } from 'react';
import { Form, Button, Alert, Container, Row, Col, Card } from 'react-bootstrap';
import { useAuth } from '../../context/Authcontext';

const Resignation = () => {
  const { user } = useAuth();
  const [reason, setReason] = useState('');
  const [resignationDate, setResignationDate] = useState('');
  const [resignationMsg, setResignationMsg] = useState('');
  const [resignationVariant, setResignationVariant] = useState('success');

  const [status, setStatus] = useState(null);  
  const [loadingStatus, setLoadingStatus] = useState(true);

  const fetchResignationStatus = async () => {
    setLoadingStatus(true);
    try {
      const res = await fetch('http://localhost:4500/api/resignation/status', {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      const data = await res.json();
      if (res.ok) setStatus(data.data);
      else setStatus(null);
    } catch (error) {
      console.error('Error fetching status', error);
      setStatus(null);
    } finally {
      setLoadingStatus(false);
    }
  };

  useEffect(() => {
    fetchResignationStatus();
  }, []);

  const handleResignationSubmit = async (e) => {
    e.preventDefault();
    setResignationMsg('');

    if (!reason || !resignationDate) {
      setResignationMsg('Please provide both reason and date');
      setResignationVariant('danger');
      return;
    }

    try {
      const res = await fetch('http://localhost:4500/api/resignation/apply', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({ reason, resignationDate }),
      });

      const data = await res.json();

      if (res.ok) {
        setResignationVariant('success');
        setResignationMsg('Resignation applied successfully');
        setReason('');
        setResignationDate('');
        fetchResignationStatus();
      } else {
        setResignationVariant('danger');
        setResignationMsg(data.message || data.error || 'Failed to apply for resignation');
      }
    } catch (error) {
      setResignationVariant('danger');
      setResignationMsg('Error connecting to server');
    }
  };

return (
    <Container className="p-4">
      <Row className="justify-content-center">
        <Col md={6}>
          <Card className="p-4 shadow mb-4">
            <h3>Apply for Resignation</h3>
            {resignationMsg && <Alert variant={resignationVariant}>{resignationMsg}</Alert>}

            <Form onSubmit={handleResignationSubmit}>
              <Form.Group className="mb-3">
                <Form.Label>Reason</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  placeholder="Reason for resignation"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Resignation Date</Form.Label>
                <Form.Control
                  type="date"
                  value={resignationDate}
                  onChange={(e) => setResignationDate(e.target.value)}
                  required
                />
              </Form.Group>

              <Button type="submit" variant="danger">Apply for Resignation</Button>
            </Form>
          </Card>

          <Card className="p-4 shadow">
            <h4>Resignation Status</h4>
            {loadingStatus ? (
              <Alert variant="info">Loading status...</Alert>
            ) : status ? (
              <div>
                <p><strong>Reason:</strong> {status.reason}</p>
                <p><strong>Resignation Date:</strong> {new Date(status.resignationDate).toLocaleDateString()}</p>
                <p><strong>Status:</strong> {status.status}</p>
                <p><strong>Admin Response:</strong> {status.adminResponse || 'Not responded yet'}</p>
                <p><strong>Last Updated:</strong> {new Date(status.updatedAt).toLocaleString()}</p>
              </div>
            ) : (
              <Alert variant="warning">No resignation application found.</Alert>
            )}
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Resignation;