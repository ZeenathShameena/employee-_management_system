import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/Authcontext';


const RegistrationForm = () => {
  const [departments, setDepartments] = useState([]);
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    // Personal Details
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    gender: '',
    maritalStatus: '',
    password: '',
    
    // Employee Details
    employeeId: '',
    department: '',
    position: '',
    salary: '',
    dateOfJoining: '',
    
    // Educational & Experience Details
    degree: '',
    yearOfPassing: '',
    expirience: ''
  });

  const [errors, setErrors] = useState({});
  const [imageFile, setImageFile] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
  const fetchDepartments = async () => {
    try {
      const res = await fetch('http://localhost:4500/api/dept/get-all', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${user.token}`, // attach JWT token here
        }
      });
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        setDepartments(data.data);
      } else {
        console.error('Unexpected API format:', data);
      }
    } catch (err) {
      console.error('Failed to fetch departments:', err);
    }
  };

  fetchDepartments();
}, []);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleImageChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  const validateForm = () => {
    const emailPattern = /^[^ ]+@[^ ]+\.[a-z]{2,3}$/;
    const phonePattern = /^[0-9]{10}$/;
    const formErrors = {};

    //Personal Information validation
    if (!formData.firstName.trim()) formErrors.firstName = 'First name is required';
    if (!formData.email || !emailPattern.test(formData.email)) formErrors.email = 'Valid email is required';
    if (!formData.phone || !phonePattern.test(formData.phone)) formErrors.phone = 'Valid 10-digit phone number required';
    if (!formData.dateOfBirth) formErrors.dateOfBirth = 'Date of Birth is required';
    if (!formData.gender) formErrors.gender = 'Gender is required';
    if (!formData.maritalStatus) formErrors.maritalStatus = 'Marital Status is required';
    if (!formData.password) formErrors.password = 'Password is required';

    // Employee Details validation
    if (!formData.employeeId.trim()) formErrors.employeeId = 'Employee ID is required';
    if (!formData.department) formErrors.department = 'Department is required';
    if (!formData.position.trim()) formErrors.position = 'Position is required';
    if (!formData.salary) formErrors.salary = 'Salary is required';
    if (!formData.dateOfJoining) formErrors.dateOfJoining = 'Date of joining is required';

    setErrors(formErrors);
    return Object.keys(formErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      // Create FormData for multipart/form-data
      const submitData = new FormData();
      
      // Add all form fields
      Object.keys(formData).forEach(key => {
        submitData.append(key, formData[key]);
      });
      
      // Add image if selected
      if (imageFile) {
        submitData.append('image', imageFile);
      }

      const response = await fetch('http://localhost:4500/api/employee/create', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${user.token}`, 
        },
        body: submitData
      });

      const result = await response.json();

      if (!response.ok) {
      alert(result.message || result.error || 'Failed to register employee');
      return;
     }
      // Show success modal
      setShowModal(true);
      
      // Reset form
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        dateOfBirth: '',
        gender: '',
        maritalStatus: '',
        password: '',
        employeeId: '',
        department: '',
        position: '',
        salary: '',
        dateOfJoining: '',
        degree: '',
        yearOfPassing: '',
        expirience: ''
      });
      setImageFile(null);
      setErrors({});
      
    } catch (error) {
      alert('Error: ' + error.message);
    }
  };

  const closeModal = () => {
    setShowModal(false);
  };

  return (
    <div className="container mt-4">
      <div className="row justify-content-center">
        <div className="col-md-10">
          <div className="card shadow">            
            <div className="card-body">
              <form onSubmit={handleSubmit}>
                {/* Personal Information Section */}
                <div className="mb-4">
                  <h5 className="text-primary mb-3">Personal Information</h5>
                  
                  <div className="row">
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label className="form-label">First Name *</label>
                        <input
                          type="text"
                          name="firstName"
                          className={`form-control ${errors.firstName ? 'is-invalid' : ''}`}
                          value={formData.firstName}
                          onChange={handleChange}
                          placeholder="Enter first name"
                        />
                        {errors.firstName && <div className="invalid-feedback">{errors.firstName}</div>}
                      </div>

                      <div className="mb-3">
                        <label className="form-label">Email Address *</label>
                        <input
                          type="email"
                          name="email"
                          className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                          value={formData.email}
                          onChange={handleChange}
                          placeholder="Enter email"
                        />
                        {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                      </div>

                      <div className="mb-3">
                        <label className="form-label">Phone *</label>
                        <input
                          type="text"
                          name="phone"
                          className={`form-control ${errors.phone ? 'is-invalid' : ''}`}
                          value={formData.phone}
                          onChange={handleChange}
                          placeholder="Enter phone number"
                        />
                        {errors.phone && <div className="invalid-feedback">{errors.phone}</div>}
                      </div>

                      <div className="mb-3">
                        <label className="form-label">Gender *</label>
                        <select
                          name="gender"
                          className={`form-select ${errors.gender ? 'is-invalid' : ''}`}
                          value={formData.gender}
                          onChange={handleChange}
                        >
                          <option value="">Select Gender</option>
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                          <option value="Other">Other</option>
                        </select>
                        {errors.gender && <div className="invalid-feedback">{errors.gender}</div>}
                      </div>

                      <div className="mb-3">
                        <label className="form-label">Password *</label>
                        <input
                          type="password"
                          name="password"
                          className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                          value={formData.password}
                          onChange={handleChange}
                          placeholder="Enter password"
                        />
                        {errors.password && <div className="invalid-feedback">{errors.password}</div>}
                      </div>
                    </div>

                    <div className="col-md-6">
                      <div className="mb-3">
                        <label className="form-label">Last Name</label>
                        <input
                          type="text"
                          name="lastName"
                          className={`form-control ${errors.lastName ? 'is-invalid' : ''}`}
                          value={formData.lastName}
                          onChange={handleChange}
                          placeholder="Enter last name"
                        />
                        {errors.lastName && <div className="invalid-feedback">{errors.lastName}</div>}
                      </div>

                      <div className="mb-3">
                        <label className="form-label">Date of Birth *</label>
                        <input
                          type="date"
                          name="dateOfBirth"
                          className={`form-control ${errors.dateOfBirth ? 'is-invalid' : ''}`}
                          value={formData.dateOfBirth}
                          onChange={handleChange}
                        />
                        {errors.dateOfBirth && <div className="invalid-feedback">{errors.dateOfBirth}</div>}
                      </div>

                      <div className="mb-3">
                        <label className="form-label">Marital Status *</label>
                        <select
                          name="maritalStatus"
                          className={`form-select ${errors.maritalStatus ? 'is-invalid' : ''}`}
                          value={formData.maritalStatus}
                          onChange={handleChange}
                        >
                          <option value="">Select Marital Status</option>
                          <option value="Single">Single</option>
                          <option value="Married">Married</option>
                          <option value="Divorced">Divorced</option>
                          <option value="Widowed">Widowed</option>
                        </select>
                        {errors.maritalStatus && <div className="invalid-feedback">{errors.maritalStatus}</div>}
                      </div>

                      <div className="mb-3">
                        <label className="form-label">Profile Image</label>
                        <input
                          type="file"
                          name="image"
                          accept="image/*"
                          className="form-control"
                          onChange={handleImageChange}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Employee Details Section */}
                <div className="mb-4">
                  <h5 className="text-primary mb-3">Employee Details</h5>
                  
                  <div className="row">
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label className="form-label">Employee ID *</label>
                        <input
                          type="text"
                          name="employeeId"
                          className={`form-control ${errors.employeeId ? 'is-invalid' : ''}`}
                          value={formData.employeeId}
                          onChange={handleChange}
                          placeholder="Enter employee ID"
                        />
                        {errors.employeeId && <div className="invalid-feedback">{errors.employeeId}</div>}
                      </div>

                      <div className="mb-3">
                        <label className="form-label">Department *</label>
                        <select
                          name="department"
                          className={`form-select ${errors.department ? 'is-invalid' : ''}`}
                          value={formData.department}
                          onChange={handleChange}
                        >
                          <option value="">Select Department</option>
                          {departments.map((dept) => (
                            <option key={dept._id} value={dept.department}>
                              {dept.department}
                            </option>
                          ))}
                        </select>
                        {errors.department && <div className="invalid-feedback">{errors.department}</div>}
                      </div>

                      <div className="mb-3">
                        <label className="form-label">Position *</label>
                        <input
                          type="text"
                          name="position"
                          className={`form-control ${errors.position ? 'is-invalid' : ''}`}
                          value={formData.position}
                          onChange={handleChange}
                          placeholder="Enter position"
                        />
                        {errors.position && <div className="invalid-feedback">{errors.position}</div>}
                      </div>
                    </div>

                    <div className="col-md-6">
                      <div className="mb-3">
                        <label className="form-label">Salary *</label>
                        <input
                          type="number"
                          name="salary"
                          className={`form-control ${errors.salary ? 'is-invalid' : ''}`}
                          value={formData.salary}
                          onChange={handleChange}
                          placeholder="Enter salary"
                        />
                        {errors.salary && <div className="invalid-feedback">{errors.salary}</div>}
                      </div>

                      <div className="mb-3">
                        <label className="form-label">Date of Joining *</label>
                        <input
                          type="date"
                          name="dateOfJoining"
                          className={`form-control ${errors.dateOfJoining ? 'is-invalid' : ''}`}
                          value={formData.dateOfJoining}
                          onChange={handleChange}
                        />
                        {errors.dateOfJoining && <div className="invalid-feedback">{errors.dateOfJoining}</div>}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Education & Experience Section */}
                <div className="mb-4">
                  <h5 className="text-primary mb-3">Education & Experience</h5>
                  
                  <div className="row">
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label className="form-label">Degree</label>
                        <input
                          type="text"
                          name="degree"
                          className="form-control"
                          value={formData.degree}
                          onChange={handleChange}
                          placeholder="Enter degree"
                        />
                      </div>

                      <div className="mb-3">
                        <label className="form-label">Year of Passing</label>
                        <input
                          type="number"
                          name="yearOfPassing"
                          className="form-control"
                          value={formData.yearOfPassing}
                          onChange={handleChange}
                          placeholder="Enter year of passing"
                          min="1950"
                          max="2030"
                        />
                      </div>
                    </div>

                    <div className="col-md-6">
                      <div className="mb-3">
                        <label className="form-label">Experience</label>
                        <textarea
                          name="expirience"
                          className="form-control"
                          value={formData.expirience}
                          onChange={handleChange}
                          placeholder="Enter work experience details"
                          rows="4"
                        />
                        <small className="form-text text-muted">
                          Include previous work experience, skills, and relevant background
                        </small>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="d-flex justify-content-center">
                  <button type="submit" className="btn btn-success btn-lg px-5">
                    Register Employee
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Success Modal */}
      {showModal && (
        <div className="modal fade show" style={{ display: 'block' }} tabIndex="-1">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header bg-success text-white">
                <h5 className="modal-title">Success</h5>
                <button type="button" className="btn-close" onClick={closeModal}></button>
              </div>
              <div className="modal-body">
                Employee registered successfully!
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={closeModal}>
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RegistrationForm;

















// import React, { useState, useEffect } from 'react';
// import { useAuth } from '../../context/Authcontext';


// const RegistrationForm = () => {
//   const [departments, setDepartments] = useState([]);
//   const { user } = useAuth();

//   const [formData, setFormData] = useState({
//     // Personal Details
//     firstName: '',
//     lastName: '',
//     email: '',
//     phone: '',
//     dateOfBirth: '',
//     gender: '',
//     maritalStatus: '',
//     password: '',
    
//     // Employee Details
//     employeeId: '',
//     department: '',
//     position: '',
//     salary: '',
//     dateOfJoining: '',
    
//     // Educational & Experience Details
//     degree: '',
//     yearOfPassing: '',
//     expirience: ''
//   });

//   const [errors, setErrors] = useState({});
//   const [imageFile, setImageFile] = useState(null);
//   const [showModal, setShowModal] = useState(false);

//   useEffect(() => {
//   const fetchDepartments = async () => {
//     try {
//       const res = await fetch('http://localhost:4500/api/dept/get-all', {
//         method: 'GET',
//         headers: {
//           Authorization: `Bearer ${user.token}`, // attach JWT token here
//         }
//       });
//       const data = await res.json();
//       if (data.success && Array.isArray(data.data)) {
//         setDepartments(data.data);
//       } else {
//         console.error('Unexpected API format:', data);
//       }
//     } catch (err) {
//       console.error('Failed to fetch departments:', err);
//     }
//   };

//   fetchDepartments();
// }, []);
//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({
//       ...formData,
//       [name]: value
//     });
//   };

//   const handleImageChange = (e) => {
//     setImageFile(e.target.files[0]);
//   };

//   const validateForm = () => {
//     const emailPattern = /^[^ ]+@[^ ]+\.[a-z]{2,3}$/;
//     const phonePattern = /^[0-9]{10}$/;
//     const formErrors = {};

//     //Personal Information validation
//     if (!formData.firstName.trim()) formErrors.firstName = 'First name is required';
//     if (!formData.email || !emailPattern.test(formData.email)) formErrors.email = 'Valid email is required';
//     if (!formData.phone || !phonePattern.test(formData.phone)) formErrors.phone = 'Valid 10-digit phone number required';
//     if (!formData.dateOfBirth) formErrors.dateOfBirth = 'Date of Birth is required';
//     if (!formData.gender) formErrors.gender = 'Gender is required';
//     if (!formData.maritalStatus) formErrors.maritalStatus = 'Marital Status is required';
//     if (!formData.password) formErrors.password = 'Password is required';

//     // Employee Details validation
//     if (!formData.employeeId.trim()) formErrors.employeeId = 'Employee ID is required';
//     if (!formData.department) formErrors.department = 'Department is required';
//     if (!formData.position.trim()) formErrors.position = 'Position is required';
//     if (!formData.salary) formErrors.salary = 'Salary is required';
//     if (!formData.dateOfJoining) formErrors.dateOfJoining = 'Date of joining is required';

//     setErrors(formErrors);
//     return Object.keys(formErrors).length === 0;
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!validateForm()) return;

//     try {
//       // Create FormData for multipart/form-data
//       // const submitData = new FormData();
      
//       // // Add all form fields
//       // // Object.keys(formData).forEach(key => {
//       // //   submitData.append(key, formData[key]);
//       // // });
      
//       // submitData.append('data', JSON.stringify(formData));

//       // // Add image if selected
//       // if (imageFile) {
//       //   submitData.append('image', imageFile);
//       // }

//       const response = await fetch('http://localhost:8080/form-data/add', {
//         method: 'POST',
//         headers: {
//            'Content-Type': 'application/json',
//           Authorization: `Bearer ${user.token}`, 
//         },
//         body: JSON.stringify(formData)
//       });

//       const result = await response.json();

//       if (!response.ok) {
//       alert(result.message || result.error || 'Failed to register employee');
//       return;
//      }
//       // Show success modal
//       setShowModal(true);
      
//       // Reset form
//       setFormData({
//         firstName: '',
//         lastName: '',
//         email: '',
//         phone: '',
//         dateOfBirth: '',
//         gender: '',
//         maritalStatus: '',
//         password: '',
//         employeeId: '',
//         department: '',
//         position: '',
//         salary: '',
//         dateOfJoining: '',
//         degree: '',
//         yearOfPassing: '',
//         expirience: ''
//       });
//       setImageFile(null);
//       setErrors({});
      
//     } catch (error) {
//       alert('Error: ' + error.message);
//     }
//   };

//   const closeModal = () => {
//     setShowModal(false);
//   };

//   return (
//     <div className="container mt-4">
//       <div className="row justify-content-center">
//         <div className="col-md-10">
//           <div className="card shadow">            
//             <div className="card-body">
//               <form onSubmit={handleSubmit}>
//                 {/* Personal Information Section */}
//                 <div className="mb-4">
//                   <h5 className="text-primary mb-3">Personal Information</h5>
                  
//                   <div className="row">
//                     <div className="col-md-6">
//                       <div className="mb-3">
//                         <label className="form-label">First Name *</label>
//                         <input
//                           type="text"
//                           name="firstName"
//                           className={`form-control ${errors.firstName ? 'is-invalid' : ''}`}
//                           value={formData.firstName}
//                           onChange={handleChange}
//                           placeholder="Enter first name"
//                         />
//                         {errors.firstName && <div className="invalid-feedback">{errors.firstName}</div>}
//                       </div>

//                       <div className="mb-3">
//                         <label className="form-label">Email Address *</label>
//                         <input
//                           type="email"
//                           name="email"
//                           className={`form-control ${errors.email ? 'is-invalid' : ''}`}
//                           value={formData.email}
//                           onChange={handleChange}
//                           placeholder="Enter email"
//                         />
//                         {errors.email && <div className="invalid-feedback">{errors.email}</div>}
//                       </div>

//                       <div className="mb-3">
//                         <label className="form-label">Phone *</label>
//                         <input
//                           type="text"
//                           name="phone"
//                           className={`form-control ${errors.phone ? 'is-invalid' : ''}`}
//                           value={formData.phone}
//                           onChange={handleChange}
//                           placeholder="Enter phone number"
//                         />
//                         {errors.phone && <div className="invalid-feedback">{errors.phone}</div>}
//                       </div>

//                       <div className="mb-3">
//                         <label className="form-label">Gender *</label>
//                         <select
//                           name="gender"
//                           className={`form-select ${errors.gender ? 'is-invalid' : ''}`}
//                           value={formData.gender}
//                           onChange={handleChange}
//                         >
//                           <option value="">Select Gender</option>
//                           <option value="Male">Male</option>
//                           <option value="Female">Female</option>
//                           <option value="Other">Other</option>
//                         </select>
//                         {errors.gender && <div className="invalid-feedback">{errors.gender}</div>}
//                       </div>

//                       <div className="mb-3">
//                         <label className="form-label">Password *</label>
//                         <input
//                           type="password"
//                           name="password"
//                           className={`form-control ${errors.password ? 'is-invalid' : ''}`}
//                           value={formData.password}
//                           onChange={handleChange}
//                           placeholder="Enter password"
//                         />
//                         {errors.password && <div className="invalid-feedback">{errors.password}</div>}
//                       </div>
//                     </div>

//                     <div className="col-md-6">
//                       <div className="mb-3">
//                         <label className="form-label">Last Name</label>
//                         <input
//                           type="text"
//                           name="lastName"
//                           className={`form-control ${errors.lastName ? 'is-invalid' : ''}`}
//                           value={formData.lastName}
//                           onChange={handleChange}
//                           placeholder="Enter last name"
//                         />
//                         {errors.lastName && <div className="invalid-feedback">{errors.lastName}</div>}
//                       </div>

//                       <div className="mb-3">
//                         <label className="form-label">Date of Birth *</label>
//                         <input
//                           type="date"
//                           name="dateOfBirth"
//                           className={`form-control ${errors.dateOfBirth ? 'is-invalid' : ''}`}
//                           value={formData.dateOfBirth}
//                           onChange={handleChange}
//                         />
//                         {errors.dateOfBirth && <div className="invalid-feedback">{errors.dateOfBirth}</div>}
//                       </div>

//                       <div className="mb-3">
//                         <label className="form-label">Marital Status *</label>
//                         <select
//                           name="maritalStatus"
//                           className={`form-select ${errors.maritalStatus ? 'is-invalid' : ''}`}
//                           value={formData.maritalStatus}
//                           onChange={handleChange}
//                         >
//                           <option value="">Select Marital Status</option>
//                           <option value="Single">Single</option>
//                           <option value="Married">Married</option>
//                           <option value="Divorced">Divorced</option>
//                           <option value="Widowed">Widowed</option>
//                         </select>
//                         {errors.maritalStatus && <div className="invalid-feedback">{errors.maritalStatus}</div>}
//                       </div>

//                       {/* <div className="mb-3">
//                         <label className="form-label">Profile Image</label>
//                         <input
//                           type="file"
//                           name="image"
//                           accept="image/*"
//                           className="form-control"
//                           onChange={handleImageChange}
//                         />
//                       </div> */}
//                     </div>
//                   </div>
//                 </div>

//                 {/* Employee Details Section */}
//                 <div className="mb-4">
//                   <h5 className="text-primary mb-3">Employee Details</h5>
                  
//                   <div className="row">
//                     <div className="col-md-6">
//                       <div className="mb-3">
//                         <label className="form-label">Employee ID *</label>
//                         <input
//                           type="text"
//                           name="employeeId"
//                           className={`form-control ${errors.employeeId ? 'is-invalid' : ''}`}
//                           value={formData.employeeId}
//                           onChange={handleChange}
//                           placeholder="Enter employee ID"
//                         />
//                         {errors.employeeId && <div className="invalid-feedback">{errors.employeeId}</div>}
//                       </div>

//                       <div className="mb-3">
//                         <label className="form-label">Department *</label>
//                         <select
//                           name="department"
//                           className={`form-select ${errors.department ? 'is-invalid' : ''}`}
//                           value={formData.department}
//                           onChange={handleChange}
//                         >
//                           <option value="">Select Department</option>
//                           {departments.map((dept) => (
//                             <option key={dept._id} value={dept.department}>
//                               {dept.department}
//                             </option>
//                           ))}
//                         </select>
//                         {errors.department && <div className="invalid-feedback">{errors.department}</div>}
//                       </div>

//                       <div className="mb-3">
//                         <label className="form-label">Position *</label>
//                         <input
//                           type="text"
//                           name="position"
//                           className={`form-control ${errors.position ? 'is-invalid' : ''}`}
//                           value={formData.position}
//                           onChange={handleChange}
//                           placeholder="Enter position"
//                         />
//                         {errors.position && <div className="invalid-feedback">{errors.position}</div>}
//                       </div>
//                     </div>

//                     <div className="col-md-6">
//                       <div className="mb-3">
//                         <label className="form-label">Salary *</label>
//                         <input
//                           type="number"
//                           name="salary"
//                           className={`form-control ${errors.salary ? 'is-invalid' : ''}`}
//                           value={formData.salary}
//                           onChange={handleChange}
//                           placeholder="Enter salary"
//                         />
//                         {errors.salary && <div className="invalid-feedback">{errors.salary}</div>}
//                       </div>

//                       <div className="mb-3">
//                         <label className="form-label">Date of Joining *</label>
//                         <input
//                           type="date"
//                           name="dateOfJoining"
//                           className={`form-control ${errors.dateOfJoining ? 'is-invalid' : ''}`}
//                           value={formData.dateOfJoining}
//                           onChange={handleChange}
//                         />
//                         {errors.dateOfJoining && <div className="invalid-feedback">{errors.dateOfJoining}</div>}
//                       </div>
//                     </div>
//                   </div>
//                 </div>

//                 {/* Education & Experience Section */}
//                 <div className="mb-4">
//                   <h5 className="text-primary mb-3">Education & Experience</h5>
                  
//                   <div className="row">
//                     <div className="col-md-6">
//                       <div className="mb-3">
//                         <label className="form-label">Degree</label>
//                         <input
//                           type="text"
//                           name="degree"
//                           className="form-control"
//                           value={formData.degree}
//                           onChange={handleChange}
//                           placeholder="Enter degree"
//                         />
//                       </div>

//                       <div className="mb-3">
//                         <label className="form-label">Year of Passing</label>
//                         <input
//                           type="number"
//                           name="yearOfPassing"
//                           className="form-control"
//                           value={formData.yearOfPassing}
//                           onChange={handleChange}
//                           placeholder="Enter year of passing"
//                           min="1950"
//                           max="2030"
//                         />
//                       </div>
//                     </div>

//                     <div className="col-md-6">
//                       <div className="mb-3">
//                         <label className="form-label">Experience</label>
//                         <textarea
//                           name="expirience"
//                           className="form-control"
//                           value={formData.expirience}
//                           onChange={handleChange}
//                           placeholder="Enter work experience details"
//                           rows="4"
//                         />
//                         <small className="form-text text-muted">
//                           Include previous work experience, skills, and relevant background
//                         </small>
//                       </div>
//                     </div>
//                   </div>
//                 </div>

//                 {/* Submit Button */}
//                 <div className="d-flex justify-content-center">
//                   <button type="submit" className="btn btn-success btn-lg px-5">
//                     Register Employee
//                   </button>
//                 </div>
//               </form>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Success Modal */}
//       {showModal && (
//         <div className="modal fade show" style={{ display: 'block' }} tabIndex="-1">
//           <div className="modal-dialog modal-dialog-centered">
//             <div className="modal-content">
//               <div className="modal-header bg-success text-white">
//                 <h5 className="modal-title">Success</h5>
//                 <button type="button" className="btn-close" onClick={closeModal}></button>
//               </div>
//               <div className="modal-body">
//                 Employee registered successfully!
//               </div>
//               <div className="modal-footer">
//                 <button type="button" className="btn btn-secondary" onClick={closeModal}>
//                   Close
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default RegistrationForm;





























