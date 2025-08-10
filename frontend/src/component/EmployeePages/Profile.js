import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/Authcontext';
import { Modal, Button, Form } from 'react-bootstrap';
import { FaEdit } from 'react-icons/fa';

const Profile = () => {
  const { user } = useAuth();
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    gender: '',
    maritalStatus: '',
    imageUrl: '',
    imageFile: null,
  });

  const fetchEmployeeDetails = async () => {
    try {
      const res = await fetch(`http://localhost:4500/api/employee/get/${user.userId}`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });

      const data = await res.json();
      if (data.success) {
        setEmployee(data.data);
        setFormData({
          firstName: data.data.firstName,
          lastName: data.data.lastName,
          email: data.data.email,
          phone: data.data.phone,
          dateOfBirth: data.data.dateOfBirth?.split('T')[0],
          gender: data.data.gender,
          maritalStatus: data.data.maritalStatus,
          imageUrl: data.data.imageUrl || '',
          imageFile: null,
        });
      } else {
        console.error('Failed to fetch employee details');
      }
    } catch (err) {
      console.error('Error fetching employee:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    try {

      const updatedData = new FormData();
      updatedData.append('firstName', formData.firstName);
      updatedData.append('lastName', formData.lastName);
      updatedData.append('email', formData.email);
      updatedData.append('phone', formData.phone);
      updatedData.append('dateOfBirth', formData.dateOfBirth);
      updatedData.append('gender', formData.gender);
      updatedData.append('maritalStatus', formData.maritalStatus);
      if (formData.imageFile) {
        updatedData.append('image', formData.imageFile);
      } else {
        updatedData.append('imageUrl', formData.imageUrl);
      }

      const res = await fetch(`http://localhost:4500/api/employee/update-me/${user.userId}`, {
        method: 'PUT',
        headers: {
          // 'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`,
        },
        body: updatedData,
      });

      const data = await res.json();
      if (data.success) {
        setShowModal(false);
        fetchEmployeeDetails(); // Refresh profile after update
      } else {
        alert(data.message || data.error || 'Update failed');
      }
    } catch (err) {
      console.error('Update error:', err);
    }
  };

  useEffect(() => {
    fetchEmployeeDetails();
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, imageFile: file });
    }
  };

  if (loading) {
    return (
      <div className="text-center p-5">
        <div className="spinner-border text-primary" role="status" />
        <p>Loading profile...</p>
      </div>
    );
  }

  if (!employee) {
    return <div className="text-center mt-5">No employee data found.</div>;
  }

  return (
    <div className="p-4">
      <div className="card shadow mx-auto position-relative" style={{ maxWidth: '900px' }}>
        {/* Update Icon */}
        <FaEdit
          size={24}
          onClick={() => setShowModal(true)}
          style={{
            position: 'absolute',
            top: '15px',
            right: '15px',
            cursor: 'pointer',
            color: '#007bff',
          }}
        />
        <div className="row g-0">
          <h4 className="text-center mb-4 mt-4">PROFILE</h4>
          <div className="col-md-4 d-flex align-items-center justify-content-center" style={{ marginTop: '-200px' }}>
            <img
              src={employee.imageUrl || 'https://via.placeholder.com/150'}
              alt="Profile"
              className="img-fluid rounded-circle"
              style={{ width: '180px', height: '180px', objectFit: 'cover' }}
            />
          </div>
          <div className="col-md-8 p-4">
            <div className="row">
              <div className="col-md-6">
                <p><strong>Name:</strong> {employee.firstName} {employee.lastName}</p>
                <p><strong>Employee ID:</strong> {employee.employeeId}</p>
                <p><strong>Date of Birth:</strong> {new Date(employee.dateOfBirth).toLocaleDateString()}</p>
                <p><strong>Gender:</strong> {employee.gender}</p>
                <p><strong>Marital Status:</strong> {employee.maritalStatus}</p>
              </div>
              <div className="col-md-6">
                <p><strong>Phone:</strong> {employee.phone}</p>
                <p><strong>Email:</strong> {employee.email}</p>
                <p><strong>Experience:</strong> {employee.expirience}</p>
                <p><strong>Degree:</strong> {employee.degree}</p>
                <p><strong>Year of Passing:</strong> {employee.yearOfPassing}</p>
              </div>
            </div>
            <div className="row mt-3">
              <div className="col-md-6">
                <p><strong>Department:</strong> {employee.department}</p>
                <p><strong>Position:</strong> {employee.position}</p>
              </div>
              <div className="col-md-6">
                <p><strong>Salary:</strong> ₹{employee.salary}</p>
                <p><strong>Date of Joining:</strong> {new Date(employee.dateOfJoining).toLocaleDateString()}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal for Editing */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Update Profile</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>First Name</Form.Label>
              <Form.Control
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Last Name</Form.Label>
              <Form.Control
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Email</Form.Label>
              <Form.Control
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Phone</Form.Label>
              <Form.Control
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Date of Birth</Form.Label>
              <Form.Control
                type="date"
                value={formData.dateOfBirth}
                onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Gender</Form.Label>
              <Form.Select
                value={formData.gender}
                onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
              >
                <option value="">Select</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </Form.Select>
            </Form.Group>
            <Form.Group>
              <Form.Label>Marital Status</Form.Label>
              <Form.Select
                value={formData.maritalStatus}
                onChange={(e) => setFormData({ ...formData, maritalStatus: e.target.value })}
              >
                <option value="">Select</option>
                <option value="Single">Single</option>
                <option value="Married">Married</option>
              </Form.Select>
            </Form.Group>
            <Form.Group>
              <Form.Label>Profile Image</Form.Label>
              <div className="d-flex align-items-center mb-2">
                <img
                  src={
                    formData.imageFile
                      ? URL.createObjectURL(formData.imageFile)
                      : formData.imageUrl || 'https://via.placeholder.com/150'
                  }
                  alt="Preview"
                  className="rounded-circle me-3"
                  style={{ width: '80px', height: '80px', objectFit: 'cover', border: '2px solid #ddd' }}
                />
                <Button variant="outline-primary" onClick={() => document.getElementById('uploadImage').click()}>
                  Change Photo
                </Button>
                <Form.Control
                  id="uploadImage"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  style={{ display: 'none' }}
                />
              </div>
              <Form.Text className="text-muted">Select an image from your computer</Form.Text>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleUpdate}>
            Update
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Profile;
