import React, { useState } from 'react';
import { Form, Button, Alert, Container, Row, Col } from 'react-bootstrap';
import { useAuth } from '../../context/Authcontext';

const SettingsPage = () => {
  const { user } = useAuth();

  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [variant, setVariant] = useState('success');

  if (user === null) {
    return <div>Loading...</div>;
  }

  if (!user?.token) {
    return <Alert variant="danger">You must be logged in to change your password.</Alert>;
  }

  const handleChangePassword = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      setMessage('New password and confirm password do not match');
      setVariant('danger');
      return;
    }

    try {
      const res = await fetch('http://localhost:4500/api/auth/change-password', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({ oldPassword, newPassword }),
      });

      const data = await res.json();

      if (res.ok) {
        setVariant('success');
        setMessage('Password updated successfully');
        setOldPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        setVariant('danger');
        setMessage(data.message || 'Failed to update password');
      }
    } catch (error) {
      setVariant('danger');
      setMessage('Error connecting to server');
    }
  };

  return (
    <Container className="p-4">
      <Row className="justify-content-center">
        <Col md={6}>
          <h3>Change Password</h3>
          {message && <Alert variant={variant}>{message}</Alert>}

          <Form onSubmit={handleChangePassword}>
            <Form.Group className="mb-3" controlId="oldPassword">
              <Form.Label>Old Password</Form.Label>
              <Form.Control
                type="password"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="newPassword">
              <Form.Label>New Password</Form.Label>
              <Form.Control
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="confirmPassword">
              <Form.Label>Confirm Password</Form.Label>
              <Form.Control
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </Form.Group>

            <Button type="submit" variant="primary">
              Update Password
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default SettingsPage;
