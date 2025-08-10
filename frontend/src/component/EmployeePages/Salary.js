import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/Authcontext';
import { Table } from 'react-bootstrap';

const Salary = () => {
  const { user } = useAuth();
  const [salaryRecords, setSalaryRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchSalaryHistory = async () => {
    try {
      const res = await fetch('http://localhost:4500/api/salary/show', {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      const data = await res.json();
      if (data.success) {
        setSalaryRecords(data.data);
      } else {
        console.error('Failed to fetch salary history');
      }
    } catch (err) {
      console.error('Error fetching salary history:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSalaryHistory();
  }, []);

  if (loading) {
    return <div className="p-4">Loading salary history...</div>;
  }

  return (
    <div className="p-4">
      <h4 className="mb-3">My Salary History</h4>
      {salaryRecords.length === 0 ? (
        <p>No salary records found.</p>
      ) : (
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>S.no</th>
              <th>Amount</th>
              <th>Paid On</th>
            </tr>
          </thead>
          <tbody>
            {salaryRecords.map((salary, index) => (
              <tr key={salary._id}>
                <td>{index + 1}</td>
                <td>₹{salary.salary}</td>
                <td>{new Date(salary.date).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </div>
  );
};

export default Salary;
