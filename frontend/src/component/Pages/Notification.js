import React, { useEffect, useState } from 'react';
import moment from 'moment';
import { useAuth } from '../../context/Authcontext';

const Notification = () => {
  const { user } = useAuth();
  const [leaves, setLeaves] = useState([]);
  const [issues, setIssues] = useState([]);
  const [resignations, setResignations] = useState([]);
  const [holidays, setHolidays] = useState([]);

  const today = moment().startOf('day');

  // Fetch Leaves
  const fetchLeaves = async () => {
    const res = await fetch('http://localhost:4500/api/leave/details', {
      headers: { Authorization: `Bearer ${user.token}` }
    });
    const data = await res.json();
    if (data.success) {
      const filtered = data.data.filter(l =>
        l.status === 'Approved' &&
        moment(l.fromDate).isSameOrAfter(today)
      );
      setLeaves(filtered);
    }
  };

  // Fetch Issues
  const fetchIssues = async () => {
    const res = await fetch('http://localhost:4500/api/issue/all', {
      headers: { Authorization: `Bearer ${user.token}` }
    });
    const data = await res.json();
    if (data.success) {
      const unresolved = data.data.filter(issue => !issue.response || issue.response.trim() === "");
      setIssues(unresolved);
    }
  };

  // Fetch Resignations
  const fetchResignations = async () => {
    const res = await fetch('http://localhost:4500/api/resignation/get-all', {
      headers: { Authorization: `Bearer ${user.token}` }
    });
    const data = await res.json();
    if (data.success) {
      const pending = data.data.filter(res => res.status === 'Pending');
      setResignations(pending);
    }
  };

  // Fetch Holidays (next 3 upcoming)
  const fetchHolidays = async () => {
    const res = await fetch('http://localhost:4500/api/holiday/get-all', {
      headers: { Authorization: `Bearer ${user.token}` }
    });
    const data = await res.json();
    if (data.success) {
      const upcoming = data.holidays
        .filter(h => moment(h.date).isSameOrAfter(today))
        .sort((a, b) => new Date(a.date) - new Date(b.date))
        .slice(0, 3);
      setHolidays(upcoming);
    }
  };

  useEffect(() => {
    fetchLeaves();
    fetchIssues();
    fetchResignations();
    fetchHolidays();
  }, []);

  return (
    <div className="container mt-4">
      <h4 className="fw-bold">Notifications</h4>

      {/* Leaves */}
      <div className="card p-3 mb-3 shadow-sm">
        <h5 className="text-success">✅ Upcoming Approved Leaves</h5>
        {leaves.length === 0 ? <p className="text-muted">No upcoming leaves.</p> :
          leaves.map(l => (
            <p key={l._id} className="mb-2">
              <b>{l.employee.firstName} ({l.employee.employeeId})</b> - {l.employee.department}<br />
              {l.leaveType} for {l.days} day(s) from {moment(l.fromDate).format('DD.MM.YY')} to {moment(l.toDate).format('DD.MM.YY')}
            </p>
          ))
        }
      </div>

      {/* Issues */}
      <div className="card p-3 mb-3 shadow-sm">
        <h5 className="text-danger">🚨 Unresolved Issues</h5>
        {issues.length === 0 ? <p className="text-muted">No unresolved issues.</p> :
          issues.map(issue => (
            <p key={issue._id} className="mb-2">
              <b>{issue.employee?.firstName || 'N/A'}</b>: {issue.subject}
            </p>
          ))
        }
      </div>

      {/* Resignations */}
      <div className="card p-3 mb-3 shadow-sm">
        <h5 className="text-warning">⚠️ Pending Resignation Requests</h5>
        {resignations.length === 0 ? <p className="text-muted">No pending resignations.</p> :
          resignations.map(res => (
            <p key={res._id} className="mb-2">
              <b>{res.employee?.firstName} ({res.employee?.employeeId})</b> - {res.reason}
            </p>
          ))
        }
      </div>

      {/* Holidays */}
      <div className="card p-3 mb-3 shadow-sm">
        <h5 className="text-primary">🎉 Upcoming Holidays</h5>
        {holidays.length === 0 ? <p className="text-muted">No upcoming holidays.</p> :
          holidays.map(h => (
            <p key={h._id} className="mb-2">
              <b>{h.title}</b> on {moment(h.date).format('DD.MM.YYYY')}
            </p>
          ))
        }
      </div>
    </div>
  );
};

export default Notification;
