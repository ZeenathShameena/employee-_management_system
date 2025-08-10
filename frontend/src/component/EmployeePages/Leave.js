import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/Authcontext';

const Leave = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    leaveType: '',
    fromDate: '',
    toDate: '',
    reason: ''
  });

  const [leaveHistory, setLeaveHistory] = useState([]);

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const applyLeave = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:4500/api/leave/apply', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`
        },
        body: JSON.stringify(formData)
      });

      const result = await res.json();
      if (res.ok) {
        alert('Leave applied successfully');
        setFormData({ leaveType: '', fromDate: '', toDate: '', reason: '' });
        fetchLeaveHistory();
      } else {
        alert(result.message || 'Leave application failed');
      }
    } catch (err) {
      console.error(err);
      alert('Server error');
    }
  };

  const fetchLeaveHistory = async () => {
    try {
      const res = await fetch('http://localhost:4500/api/leave/history', {
        headers: { 
          Authorization: `Bearer ${user.token}` 
        }
      });
      const data = await res.json();
      console.log("dvdv     ",data)
      if (res.ok){
        setLeaveHistory(data.data || []);
      } 
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchLeaveHistory();
  }, []);

  return (
    <div>
      <h4>Apply Leave</h4>
      <form onSubmit={applyLeave}>
        <div className="mb-3">
          <label>Leave Type</label>
          <select name="leaveType" value={formData.leaveType} onChange={handleChange} className="form-select">
            <option value="">Select Type</option>
            <option value="Sick Leave">Sick</option>
            <option value="Emergency Leave">Emergency</option>
            <option value="Paternity Leave">Paternity</option>
            <option value="Maternity Leave">Maternity</option>
            <option value="Casual Leave">Casual</option>
          </select>
        </div>

        <div className="mb-3">
          <label>From Date</label>
          <input type="date" name="fromDate" value={formData.fromDate} onChange={handleChange} className="form-control" />
        </div>

        <div className="mb-3">
          <label>To Date</label>
          <input type="date" name="toDate" value={formData.toDate} onChange={handleChange} className="form-control" />
        </div>

        <div className="mb-3">
          <label>Reason</label>
          <textarea name="reason" value={formData.reason} onChange={handleChange} className="form-control" />
        </div>

        <button type="submit" className="btn btn-primary">Apply Leave</button>
      </form>

      <hr />
      <h5 className="mt-4">Leave History</h5>
      <ul className="list-group">
        {leaveHistory.map((leave, idx) => (
          <li key={idx} className="list-group-item">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <strong>{leave.leaveType}</strong> 
                <br />
                <small className="text-muted">
                  {new Date(leave.fromDate).toLocaleDateString()} to {new Date(leave.toDate).toLocaleDateString()}
                </small>
                <br />
                <small className="text-muted">
                  <strong>{leave.days} Day</strong> 
                </small>
                <br />
                <small>Reason: {leave.reason}</small>
              </div>
              <span className={`badge bg-${leave.status === 'Approved' ? 'success' : leave.status === 'Rejected' ? 'danger' : 'warning'} text-uppercase`}>
                {leave.status}
              </span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Leave;
