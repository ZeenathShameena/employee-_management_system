import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import RegistrationForm from '../Form/RegistrationForm';
import { useAuth } from '../../context/Authcontext';


const EmployeePage = () => {
  const { user } = useAuth();

  const [employees, setEmployees] = useState([]);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [departments, setDepartments] = useState([]);

  const [editForm, setEditForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    gender: '',
    maritalStatus: '',
    department: '',
    position: '',
    salary: '',
    dateOfJoining: '',
    experience: '',
    degree: '',
    yearOfPassing: '',
    imageUrl: '',
    imageFile: null
  });

  const fetchEmployees = async () => {
    try {
      const response = await fetch('http://localhost:4500/api/employee/get-all', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`, 
        }
      });
      const data = await response.json();

      if (data.success) {
        setEmployees(data.data);
      }
    } catch (error) {
      console.error('Error fetching employees:', error);
    }
  };

  const fetchDepartments = async () => {
    try {
      const response = await fetch('http://localhost:4500/api/dept/get-all', {
        headers: {
          Authorization: `Bearer ${user.token}`,
        }
      });
      const data = await response.json();
      if (data.success) {
        setDepartments(data.data);
      }
    } catch (error) {
      console.error('Error fetching departments:', error);
    }
  };

useEffect(() => {
  fetchEmployees();
  fetchDepartments();
}, []);


  const handleDelete = async (_id) => {
    const confirm = window.confirm('Are you sure you want to delete this employee?');
    if (!confirm) return;

    try {
      const res = await fetch(`http://localhost:4500/api/employee/delete/${_id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${user.token}`, 
        }

      });
      const result = await res.json();
      if (result.success) {
        alert('Employee deleted successfully');
        setEmployees(employees.filter(emp => emp._id !== _id));
      } else {
        alert(result.message || 'Failed to delete');
      }
    } catch (err) {
      console.error('Delete error:', err);
      alert('Server error');
    }
  };

  const openEditModal = (emp) => {
    setEditingEmployee(emp);
    setEditForm({
      firstName: emp.firstName || '',
      lastName: emp.lastName || '',
      email: emp.email || '',
      phone: emp.phone || '',
      dateOfBirth: emp.dateOfBirth ? new Date(emp.dateOfBirth).toISOString().split('T')[0] : '',
      gender: emp.gender || '',
      maritalStatus: emp.maritalStatus || '',
      department: emp.department || '',
      position: emp.position || '',
      salary: emp.salary || '',
      dateOfJoining: emp.dateOfJoining ? new Date(emp.dateOfJoining).toISOString().split('T')[0] : '',
      experience: emp.expirience || emp.experience || '',
      degree: emp.degree || '',
      yearOfPassing: emp.yearOfPassing || '',
      imageUrl: emp.imageUrl || '',
      imageFile: null
    });

    const editModal = new window.bootstrap.Modal(document.getElementById('editEmployeeModal'));
    editModal.show();
  };

  const openViewModal = (emp) => {
    setSelectedEmployee(emp);
    const viewModal = new window.bootstrap.Modal(document.getElementById('viewEmployeeModal'));
    viewModal.show();
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setEditForm(prev => ({ 
        ...prev, 
        imageFile: file 
      }));
    }
  };

  const submitEdit = async () => {
    try {
      const formData = new FormData();
      
      // Append all form fields
      formData.append('firstName', editForm.firstName);
      formData.append('lastName', editForm.lastName);
      formData.append('email', editForm.email);
      formData.append('phone', editForm.phone);
      formData.append('dateOfBirth', editForm.dateOfBirth);
      formData.append('gender', editForm.gender);
      formData.append('maritalStatus', editForm.maritalStatus);
      formData.append('department', editForm.department);
      formData.append('position', editForm.position);
      formData.append('salary', editForm.salary);
      formData.append('dateOfJoining', editForm.dateOfJoining);
      formData.append('expirience', editForm.experience);
      formData.append('degree', editForm.degree);
      formData.append('yearOfPassing', editForm.yearOfPassing);
      
      // Append image file if selected, otherwise append existing imageUrl
      if (editForm.imageFile) {
        formData.append('image', editForm.imageFile);
      } else if (editForm.imageUrl) {
        formData.append('imageUrl', editForm.imageUrl);
      }

      const res = await fetch(`http://localhost:4500/api/employee/update/${editingEmployee._id}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${user.token}`, 
        },
        body: formData
      });

      const result = await res.json();
      if (res.ok) {
        alert('Employee updated successfully');
        fetchEmployees();
        const modal = window.bootstrap.Modal.getInstance(document.getElementById('editEmployeeModal'));
        modal.hide();
      } else {
        alert( result.message || result.error ||'Failed to update');
      }
    } catch (error) {
      console.error('Error updating employee:', error);
      alert('Server error');
    }
  };

  return (
    <div className="container mt-5">
      {/* <div className="card p-4 mb-3 shadow-sm">
        <h2 className="fw-bold">ABC Consulting Services</h2>
      </div> */}

      <div className="card p-4 shadow-sm">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5 className="fw-bold">Employee List</h5>
          <button className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#employeeModal">
            <i className="bi bi-plus-lg me-1"></i> Add Employee
          </button>
        </div>

        <table className="table table-borderless">
          <thead>
            <tr className="text-muted">
              <th>NAME</th>
              <th>EMAIL</th>
              <th>MOBILE</th>
              <th>EMPLOYEE ID</th>
              <th>DEPARTMENT</th>
              <th>POSITION</th>
              <th>ACTION</th>
            </tr>
          </thead>
          <tbody>
            {employees.length > 0 ? (
              employees.map((emp) => (
                <tr key={emp._id}>
                  <td>{emp.firstName || 'N/A'}</td>
                  <td>{emp.email || 'N/A'}</td>
                  <td>{emp.phone || 'N/A'}</td>
                  <td>{emp.employeeId || 'N/A'}</td>
                  <td>{emp.department || 'N/A'}</td>
                  <td>{emp.position || 'N/A'}</td>
                  <td>
                    <button className="btn btn-sm btn-info me-2" onClick={() => openViewModal(emp)}>View</button>
                    <button className="btn btn-sm btn-primary me-2" onClick={() => openEditModal(emp)}>Edit</button>
                    <button className="btn btn-sm btn-danger" onClick={() => handleDelete(emp._id)}>Delete</button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="text-center text-muted">No employees found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Add Modal */}
      <div className="modal fade" id="employeeModal" tabIndex="-1" aria-labelledby="employeeModalLabel" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered modal-lg">
          <div className="modal-content">
            <div className="modal-header bg-primary text-white">
              <h5 className="modal-title">Add New Employee</h5>
               <button
                type="button"
                className="btn-close btn-close-white"
                data-bs-dismiss="modal"
              ></button>
            </div>
            <div className="modal-body">
              <RegistrationForm />
            </div>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      <div className="modal fade" id="editEmployeeModal" tabIndex="-1" aria-labelledby="editEmployeeModalLabel" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header bg-warning">
              <h5 className="modal-title">Edit Employee</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div className="modal-body">
              <form>
                <div className="row">
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label className="form-label">First Name</label>
                      <input 
                        type="text" 
                        name="firstName" 
                        value={editForm.firstName} 
                        onChange={handleEditChange} 
                        className="form-control" 
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label className="form-label">Last Name</label>
                      <input 
                        type="text" 
                        name="lastName" 
                        value={editForm.lastName} 
                        onChange={handleEditChange} 
                        className="form-control" 
                      />
                    </div>
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label className="form-label">Email</label>
                      <input 
                        type="email" 
                        name="email" 
                        value={editForm.email} 
                        onChange={handleEditChange} 
                        className="form-control" 
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label className="form-label">Phone</label>
                      <input 
                        type="text" 
                        name="phone" 
                        value={editForm.phone} 
                        onChange={handleEditChange} 
                        className="form-control"
                      />
                    </div>
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label className="form-label">Date of Birth</label>
                      <input 
                        type="date" 
                        name="dateOfBirth" 
                        value={editForm.dateOfBirth} 
                        onChange={handleEditChange} 
                        className="form-control" 
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label className="form-label">Gender</label>
                      <select 
                        name="gender" 
                        value={editForm.gender} 
                        onChange={handleEditChange} 
                        className="form-select"
                      >
                        <option value="">Select Gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label className="form-label">Marital Status</label>
                      <select 
                        name="maritalStatus" 
                        value={editForm.maritalStatus} 
                        onChange={handleEditChange} 
                        className="form-select"
                      >
                        <option value="">Select Marital Status</option>
                        <option value="Single">Single</option>
                        <option value="Married">Married</option>
                        <option value="Divorced">Divorced</option>
                        <option value="Widowed">Widowed</option>
                      </select>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label className="form-label">Department</label>
                       <select 
                          name="department" 
                          value={editForm.department} 
                          onChange={handleEditChange} 
                          className="form-select"
                        >
                          <option value="">Select Department</option>
                          {departments.map((dept) => (
                            <option key={dept._id} value={dept.department}>{dept.department}</option>
                          ))}
                        </select>
                    </div>
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label className="form-label">Position</label>
                      <input 
                        type="text" 
                        name="position" 
                        value={editForm.position} 
                        onChange={handleEditChange} 
                        className="form-control" 
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label className="form-label">Salary</label>
                      <input 
                        type="number" 
                        name="salary" 
                        value={editForm.salary} 
                        onChange={handleEditChange} 
                        className="form-control" 
                      />
                    </div>
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label className="form-label">Date of Joining</label>
                      <input 
                        type="date" 
                        name="dateOfJoining" 
                        value={editForm.dateOfJoining} 
                        onChange={handleEditChange} 
                        className="form-control" 
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label className="form-label">Experience (in years)</label>
                      <input 
                        type="number" 
                        name="experience" 
                        value={editForm.experience} 
                        onChange={handleEditChange} 
                        className="form-control" 
                      />
                    </div>
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label className="form-label">Degree</label>
                      <input 
                        type="text" 
                        name="degree" 
                        value={editForm.degree} 
                        onChange={handleEditChange} 
                        className="form-control" 
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label className="form-label">Year of Passing</label>
                      <input 
                        type="number" 
                        name="yearOfPassing" 
                        value={editForm.yearOfPassing} 
                        onChange={handleEditChange} 
                        className="form-control" 
                      />
                    </div>
                  </div>
                </div>

                <div className="mb-3">
                  <label className="form-label">Profile Image</label>
                  <div className="d-flex align-items-center">
                    <div className="me-3">
                      {editForm.imageFile ? (
                        <img 
                          src={URL.createObjectURL(editForm.imageFile)} 
                          alt="Profile Preview" 
                          className="rounded-circle" 
                          style={{ 
                            width: '80px', 
                            height: '80px', 
                            objectFit: 'cover',
                            border: '2px solid #ddd'
                          }}
                        />
                      ) : editForm.imageUrl ? (
                        <img 
                          src={editForm.imageUrl} 
                          alt="Profile Preview" 
                          className="rounded-circle" 
                          style={{ 
                            width: '80px', 
                            height: '80px', 
                            objectFit: 'cover',
                            border: '2px solid #ddd'
                          }}
                          onError={(e) => {
                            e.target.style.display = 'none';
                          }}
                        />
                      ) : (
                        <div 
                          className="rounded-circle bg-light d-flex align-items-center justify-content-center"
                          style={{ 
                            width: '80px', 
                            height: '80px', 
                            border: '2px solid #ddd'
                          }}
                        >
                          <i className="bi bi-person-circle text-muted" style={{ fontSize: '2rem' }}></i>
                        </div>
                      )}
                    </div>
                    <div className="flex-grow-1">
                      <input 
                        type="file" 
                        accept="image/*"
                        onChange={handleImageChange}
                        className="form-control" 
                        id="imageUpload"
                        style={{ display: 'none' }}
                      />
                      <button 
                        type="button" 
                        className="btn btn-outline-primary"
                        onClick={() => document.getElementById('imageUpload').click()}
                      >
                        Change Photo
                      </button>
                      <small className="form-text text-muted d-block mt-1">Select an image from your computer</small>
                    </div>
                  </div>
                </div>
              </form>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
              <button className="btn btn-success" onClick={submitEdit}>Save Changes</button>
            </div>
          </div>
        </div>
      </div>

      {/* View Details Modal */}
      <div className="modal fade" id="viewEmployeeModal" tabIndex="-1" aria-labelledby="viewEmployeeModalLabel" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header bg-warning text-white">
              <h5 className="modal-title">Employee Details</h5>
              <button type="button" className="btn-close btn-close-white" data-bs-dismiss="modal"></button>
            </div>
            <div className="modal-body">
              {selectedEmployee && (
                <div>
                  <div className="mb-4 d-flex justify-content-center">
                    <img 
                      src={selectedEmployee.imageUrl} 
                      alt="___profile_" 
                      className="img-fluid rounded-circle" 
                      style={{ width: '150px', 
                          height: '150px', 
                          objectFit: 'cover',
                          maxHeight: '200px' }}
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
                </div>
              )}
            </div>
            <div className="modal-footer">
              <button className="btn btn-warning" data-bs-dismiss="modal">Close</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeePage;














// import React, { useState, useEffect } from 'react';
// import 'bootstrap/dist/css/bootstrap.min.css';
// import 'bootstrap/dist/js/bootstrap.bundle.min.js';
// import RegistrationForm from '../Form/RegistrationForm';
// import { useAuth } from '../../context/Authcontext';


// const EmployeePage = () => {
//   const { user } = useAuth();

//   const [employees, setEmployees] = useState([]);
//   const [editingEmployee, setEditingEmployee] = useState(null);
//   const [selectedEmployee, setSelectedEmployee] = useState(null);
//   const [departments, setDepartments] = useState([]);

//   const [editForm, setEditForm] = useState({
//     firstName: '',
//     lastName: '',
//     email: '',
//     phone: '',
//     dateOfBirth: '',
//     gender: '',
//     maritalStatus: '',
//     department: '',
//     position: '',
//     salary: '',
//     dateOfJoining: '',
//     experience: '',
//     degree: '',
//     yearOfPassing: '',
//     imageUrl: '',
//     imageFile: null
//   });

//   const fetchEmployees = async () => {
//     try {
//       const response = await fetch('http://localhost:8080/form-data', {
//         method: 'GET',
//         headers: {
//           'Content-Type': 'application/json',
//           Authorization: `Bearer ${user.token}`, 
//         }
//       });
//       const data = await response.json();
//       console.log("sff        ",data)
//       if (Array.isArray(data)) {
//         setEmployees(data);
//       }
//     } catch (error) {
//       console.error('Error fetching employees:', error);
//     }
//   };
//         console.log("Employee    ",employees)

//   const fetchDepartments = async () => {
//     try {
//       const response = await fetch('http://localhost:4500/api/dept/get-all', {
//         headers: {
//           Authorization: `Bearer ${user.token}`,
//         }
//       });
//       const data = await response.json();
//       if (data.success) {
//         setDepartments(data.data);
//       }
//     } catch (error) {
//       console.error('Error fetching departments:', error);
//     }
//   };

// useEffect(() => {
//   fetchEmployees();
//   fetchDepartments();
// }, []);


//   const handleDelete = async (id) => {
//     const confirm = window.confirm('Are you sure you want to delete this employee?');
//     if (!confirm) return;

//     try {
//       const res = await fetch(`http://localhost:8080/form-data/delete/${id}`, {
//         method: 'DELETE',
//         headers: {
//           Authorization: `Bearer ${user.token}`, 
//         }

//       });
//       const result = await res.json();
//       if (result.success) {
//         alert('Employee deleted successfully');
//         setEmployees(employees.filter(emp => emp.id !== id));
//       } else {
//         alert(result.message || 'Failed to delete');
//       }
//     } catch (err) {
//       console.error('Delete error:', err);
//       alert('Server error');
//     }
//   };

//   const openEditModal = (emp) => {
//     setEditingEmployee(emp);
//     setEditForm({
//       firstName: emp.firstName || '',
//       lastName: emp.lastName || '',
//       email: emp.email || '',
//       phone: emp.phone || '',
//       dateOfBirth: emp.dateOfBirth ? new Date(emp.dateOfBirth).toISOString().split('T')[0] : '',
//       gender: emp.gender || '',
//       maritalStatus: emp.maritalStatus || '',
//       department: emp.department || '',
//       position: emp.position || '',
//       salary: emp.salary || '',
//       dateOfJoining: emp.dateOfJoining ? new Date(emp.dateOfJoining).toISOString().split('T')[0] : '',
//       experience: emp.expirience || emp.experience || '',
//       degree: emp.degree || '',
//       yearOfPassing: emp.yearOfPassing || '',
//       imageUrl: emp.imageUrl || '',
//       imageFile: null
//     });

//     const editModal = new window.bootstrap.Modal(document.getElementById('editEmployeeModal'));
//     editModal.show();
//   };

//   const openViewModal = (emp) => {
//     setSelectedEmployee(emp);
//     const viewModal = new window.bootstrap.Modal(document.getElementById('viewEmployeeModal'));
//     viewModal.show();
//   };

//   const handleEditChange = (e) => {
//     const { name, value } = e.target;
//     setEditForm(prev => ({ ...prev, [name]: value }));
//   };

//   const handleImageChange = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       setEditForm(prev => ({ 
//         ...prev, 
//         imageFile: file 
//       }));
//     }
//   };

//   const submitEdit = async () => {
//     try {
//       const formData = new FormData();
      
//       // Append all form fields
//       formData.append('firstName', editForm.firstName);
//       formData.append('lastName', editForm.lastName);
//       formData.append('email', editForm.email);
//       formData.append('phone', editForm.phone);
//       formData.append('dateOfBirth', editForm.dateOfBirth);
//       formData.append('gender', editForm.gender);
//       formData.append('maritalStatus', editForm.maritalStatus);
//       formData.append('department', editForm.department);
//       formData.append('position', editForm.position);
//       formData.append('salary', editForm.salary);
//       formData.append('dateOfJoining', editForm.dateOfJoining);
//       formData.append('expirience', editForm.experience);
//       formData.append('degree', editForm.degree);
//       formData.append('yearOfPassing', editForm.yearOfPassing);
      
//       // Append image file if selected, otherwise append existing imageUrl
//       if (editForm.imageFile) {
//         formData.append('image', editForm.imageFile);
//       } else if (editForm.imageUrl) {
//         formData.append('imageUrl', editForm.imageUrl);
//       }

//       const res = await fetch(`http://localhost:4500/api/employee/update/${editingEmployee.id}`, {
//         method: 'PUT',
//         headers: {
//           Authorization: `Bearer ${user.token}`, 
//         },
//         body: formData
//       });

//       const result = await res.json();
//       if (res.ok) {
//         alert('Employee updated successfully');
//         fetchEmployees();
//         const modal = window.bootstrap.Modal.getInstance(document.getElementById('editEmployeeModal'));
//         modal.hide();
//       } else {
//         alert( result.message || result.error ||'Failed to update');
//       }
//     } catch (error) {
//       console.error('Error updating employee:', error);
//       alert('Server error');
//     }
//   };

//   return (
//     <div className="container mt-5">
//       {/* <div className="card p-4 mb-3 shadow-sm">
//         <h2 className="fw-bold">ABC Consulting Services</h2>
//       </div> */}

//       <div className="card p-4 shadow-sm">
//         <div className="d-flex justify-content-between align-items-center mb-3">
//           <h5 className="fw-bold">Employee List</h5>
//           <button className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#employeeModal">
//             <i className="bi bi-plus-lg me-1"></i> Add Employee
//           </button>
//         </div>

//         <table className="table table-borderless">
//           <thead>
//             <tr className="text-muted">
//               <th>NAME</th>
//               <th>EMAIL</th>
//               <th>MOBILE</th>
//               <th>EMPLOYEE ID</th>
//               <th>DEPARTMENT</th>
//               <th>POSITION</th>
//               <th>ACTION</th>
//             </tr>
//           </thead>
//           <tbody>
//             {Array.isArray(employees) && employees.length > 0 ? (
//               employees.map((emp) => (
//                 <tr key={emp._id}>
//                   <td>{emp.firstName || 'N/A'}</td>
//                   <td>{emp.email || 'N/A'}</td>
//                   <td>{emp.phone || 'N/A'}</td>
//                   <td>{emp.employeeId || 'N/A'}</td>
//                   <td>{emp.department || 'N/A'}</td>
//                   <td>{emp.position || 'N/A'}</td>
//                   <td>
//                     <button className="btn btn-sm btn-info me-2" onClick={() => openViewModal(emp)}>View</button>
//                     <button className="btn btn-sm btn-primary me-2" onClick={() => openEditModal(emp)}>Edit</button>
//                     <button className="btn btn-sm btn-danger" onClick={() => handleDelete(emp.id)}>Delete</button>
//                   </td>
//                 </tr>
//               ))
//             ) : (
//               <tr>
//                 <td colSpan="7" className="text-center text-muted">No employees found</td>
//               </tr>
//             )}
//           </tbody>
//         </table>
//       </div>

//       {/* Add Modal */}
//       <div className="modal fade" id="employeeModal" tabIndex="-1" aria-labelledby="employeeModalLabel" aria-hidden="true">
//         <div className="modal-dialog modal-dialog-centered modal-lg">
//           <div className="modal-content">
//             <div className="modal-header bg-primary text-white">
//               <h5 className="modal-title">Add New Employee</h5>
//                <button
//                 type="button"
//                 className="btn-close btn-close-white"
//                 data-bs-dismiss="modal"
//               ></button>
//             </div>
//             <div className="modal-body">
//               <RegistrationForm />
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Edit Modal */}
//       <div className="modal fade" id="editEmployeeModal" tabIndex="-1" aria-labelledby="editEmployeeModalLabel" aria-hidden="true">
//         <div className="modal-dialog modal-dialog-centered">
//           <div className="modal-content">
//             <div className="modal-header bg-warning">
//               <h5 className="modal-title">Edit Employee</h5>
//               <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
//             </div>
//             <div className="modal-body">
//               <form>
//                 <div className="row">
//                   <div className="col-md-6">
//                     <div className="mb-3">
//                       <label className="form-label">First Name</label>
//                       <input 
//                         type="text" 
//                         name="firstName" 
//                         value={editForm.firstName} 
//                         onChange={handleEditChange} 
//                         className="form-control" 
//                       />
//                     </div>
//                   </div>
//                   <div className="col-md-6">
//                     <div className="mb-3">
//                       <label className="form-label">Last Name</label>
//                       <input 
//                         type="text" 
//                         name="lastName" 
//                         value={editForm.lastName} 
//                         onChange={handleEditChange} 
//                         className="form-control" 
//                       />
//                     </div>
//                   </div>
//                 </div>

//                 <div className="row">
//                   <div className="col-md-6">
//                     <div className="mb-3">
//                       <label className="form-label">Email</label>
//                       <input 
//                         type="email" 
//                         name="email" 
//                         value={editForm.email} 
//                         onChange={handleEditChange} 
//                         className="form-control" 
//                       />
//                     </div>
//                   </div>
//                   <div className="col-md-6">
//                     <div className="mb-3">
//                       <label className="form-label">Phone</label>
//                       <input 
//                         type="text" 
//                         name="phone" 
//                         value={editForm.phone} 
//                         onChange={handleEditChange} 
//                         className="form-control"
//                       />
//                     </div>
//                   </div>
//                 </div>

//                 <div className="row">
//                   <div className="col-md-6">
//                     <div className="mb-3">
//                       <label className="form-label">Date of Birth</label>
//                       <input 
//                         type="date" 
//                         name="dateOfBirth" 
//                         value={editForm.dateOfBirth} 
//                         onChange={handleEditChange} 
//                         className="form-control" 
//                       />
//                     </div>
//                   </div>
//                   <div className="col-md-6">
//                     <div className="mb-3">
//                       <label className="form-label">Gender</label>
//                       <select 
//                         name="gender" 
//                         value={editForm.gender} 
//                         onChange={handleEditChange} 
//                         className="form-select"
//                       >
//                         <option value="">Select Gender</option>
//                         <option value="Male">Male</option>
//                         <option value="Female">Female</option>
//                         <option value="Other">Other</option>
//                       </select>
//                     </div>
//                   </div>
//                 </div>

//                 <div className="row">
//                   <div className="col-md-6">
//                     <div className="mb-3">
//                       <label className="form-label">Marital Status</label>
//                       <select 
//                         name="maritalStatus" 
//                         value={editForm.maritalStatus} 
//                         onChange={handleEditChange} 
//                         className="form-select"
//                       >
//                         <option value="">Select Marital Status</option>
//                         <option value="Single">Single</option>
//                         <option value="Married">Married</option>
//                         <option value="Divorced">Divorced</option>
//                         <option value="Widowed">Widowed</option>
//                       </select>
//                     </div>
//                   </div>
//                   <div className="col-md-6">
//                     <div className="mb-3">
//                       <label className="form-label">Department</label>
//                        <select 
//                           name="department" 
//                           value={editForm.department} 
//                           onChange={handleEditChange} 
//                           className="form-select"
//                         >
//                           <option value="">Select Department</option>
//                           {departments.map((dept) => (
//                             <option key={dept._id} value={dept.department}>{dept.department}</option>
//                           ))}
//                         </select>
//                     </div>
//                   </div>
//                 </div>

//                 <div className="row">
//                   <div className="col-md-6">
//                     <div className="mb-3">
//                       <label className="form-label">Position</label>
//                       <input 
//                         type="text" 
//                         name="position" 
//                         value={editForm.position} 
//                         onChange={handleEditChange} 
//                         className="form-control" 
//                       />
//                     </div>
//                   </div>
//                   <div className="col-md-6">
//                     <div className="mb-3">
//                       <label className="form-label">Salary</label>
//                       <input 
//                         type="number" 
//                         name="salary" 
//                         value={editForm.salary} 
//                         onChange={handleEditChange} 
//                         className="form-control" 
//                       />
//                     </div>
//                   </div>
//                 </div>

//                 <div className="row">
//                   <div className="col-md-6">
//                     <div className="mb-3">
//                       <label className="form-label">Date of Joining</label>
//                       <input 
//                         type="date" 
//                         name="dateOfJoining" 
//                         value={editForm.dateOfJoining} 
//                         onChange={handleEditChange} 
//                         className="form-control" 
//                       />
//                     </div>
//                   </div>
//                   <div className="col-md-6">
//                     <div className="mb-3">
//                       <label className="form-label">Experience (in years)</label>
//                       <input 
//                         type="number" 
//                         name="experience" 
//                         value={editForm.experience} 
//                         onChange={handleEditChange} 
//                         className="form-control" 
//                       />
//                     </div>
//                   </div>
//                 </div>

//                 <div className="row">
//                   <div className="col-md-6">
//                     <div className="mb-3">
//                       <label className="form-label">Degree</label>
//                       <input 
//                         type="text" 
//                         name="degree" 
//                         value={editForm.degree} 
//                         onChange={handleEditChange} 
//                         className="form-control" 
//                       />
//                     </div>
//                   </div>
//                   <div className="col-md-6">
//                     <div className="mb-3">
//                       <label className="form-label">Year of Passing</label>
//                       <input 
//                         type="number" 
//                         name="yearOfPassing" 
//                         value={editForm.yearOfPassing} 
//                         onChange={handleEditChange} 
//                         className="form-control" 
//                       />
//                     </div>
//                   </div>
//                 </div>

//                 {/* <div className="mb-3">
//                   <label className="form-label">Profile Image</label>
//                   <div className="d-flex align-items-center">
//                     <div className="me-3">
//                       {editForm.imageFile ? (
//                         <img 
//                           src={URL.createObjectURL(editForm.imageFile)} 
//                           alt="Profile Preview" 
//                           className="rounded-circle" 
//                           style={{ 
//                             width: '80px', 
//                             height: '80px', 
//                             objectFit: 'cover',
//                             border: '2px solid #ddd'
//                           }}
//                         />
//                       ) : editForm.imageUrl ? (
//                         <img 
//                           src={editForm.imageUrl} 
//                           alt="Profile Preview" 
//                           className="rounded-circle" 
//                           style={{ 
//                             width: '80px', 
//                             height: '80px', 
//                             objectFit: 'cover',
//                             border: '2px solid #ddd'
//                           }}
//                           onError={(e) => {
//                             e.target.style.display = 'none';
//                           }}
//                         />
//                       ) : (
//                         <div 
//                           className="rounded-circle bg-light d-flex align-items-center justify-content-center"
//                           style={{ 
//                             width: '80px', 
//                             height: '80px', 
//                             border: '2px solid #ddd'
//                           }}
//                         >
//                           <i className="bi bi-person-circle text-muted" style={{ fontSize: '2rem' }}></i>
//                         </div>
//                       )}
//                     </div>
//                     <div className="flex-grow-1">
//                       <input 
//                         type="file" 
//                         accept="image/*"
//                         onChange={handleImageChange}
//                         className="form-control" 
//                         id="imageUpload"
//                         style={{ display: 'none' }}
//                       />
//                       <button 
//                         type="button" 
//                         className="btn btn-outline-primary"
//                         onClick={() => document.getElementById('imageUpload').click()}
//                       >
//                         Change Photo
//                       </button>
//                       <small className="form-text text-muted d-block mt-1">Select an image from your computer</small>
//                     </div>
//                   </div>
//                 </div> */}
//               </form>
//             </div>
//             <div className="modal-footer">
//               <button className="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
//               <button className="btn btn-success" onClick={submitEdit}>Save Changes</button>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* View Details Modal */}
//       <div className="modal fade" id="viewEmployeeModal" tabIndex="-1" aria-labelledby="viewEmployeeModalLabel" aria-hidden="true">
//         <div className="modal-dialog modal-dialog-centered">
//           <div className="modal-content">
//             <div className="modal-header bg-warning text-white">
//               <h5 className="modal-title">Employee Details</h5>
//               <button type="button" className="btn-close btn-close-white" data-bs-dismiss="modal"></button>
//             </div>
//             <div className="modal-body">
//               {selectedEmployee && (
//                 <div>
//                   <div className="mb-4 d-flex justify-content-center">
//                     <img 
//                       src={selectedEmployee.imageUrl || 'https://via.placeholder.com/150'} 
//                       alt="___profile_" 
//                       className="img-fluid rounded-circle" 
//                       style={{ width: '150px', 
//                           height: '150px', 
//                           objectFit: 'cover',
//                           maxHeight: '200px' }}
//                     />
//                   </div>
//                   <div className="row">
//                     <div className="col-md-6">
//                       <p><strong>Name:</strong> {selectedEmployee.firstName} {selectedEmployee.lastName}</p>
//                       <p><strong>Employee ID:</strong> {selectedEmployee.employeeId || 'N/A'}</p>
//                       <p><strong>Date of Birth:</strong> {new Date(selectedEmployee.dateOfBirth).toLocaleDateString()}</p>
//                       <p><strong>Gender:</strong> {selectedEmployee.gender}</p>
//                       <p><strong>Department:</strong> {selectedEmployee.department}</p>
//                     </div>
//                     <div className="col-md-6">
//                       <p><strong>Email:</strong> {selectedEmployee.email}</p>
//                       <p><strong>Phone:</strong> {selectedEmployee.phone}</p>
//                       <p><strong>Marital Status:</strong> {selectedEmployee.maritalStatus}</p>
//                       <p><strong>Experience:</strong> {selectedEmployee.expirience}</p>
//                       <p><strong>Degree:</strong> {selectedEmployee.degree}</p>
//                     </div>
//                   </div>
//                   <div className="row mt-2">
//                     <div className="col-md-6">
//                       <p><strong>Year of Passing:</strong> {selectedEmployee.yearOfPassing}</p>
//                     </div>
//                     <div className="col-md-6">
//                       <p><strong>Position:</strong> {selectedEmployee.position}</p>
//                     </div>
//                   </div>
//                   <div className="row mt-2">
//                     <div className="col-md-6">
//                       <p><strong>Salary:</strong> {selectedEmployee.salary}</p>
//                     </div>
//                     <div className="col-md-6">
//                       <p><strong>Date of Joining:</strong> {new Date(selectedEmployee.dateOfJoining).toLocaleDateString()}</p>
//                     </div>
//                   </div>
//                 </div>
//               )}
//             </div>
//             <div className="modal-footer">
//               <button className="btn btn-warning" data-bs-dismiss="modal">Close</button>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default EmployeePage;