import React, { useState } from 'react';
import { useAuth } from '../../context/Authcontext';

const AddHoliday = () => {
  const { user } = useAuth();
    
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess('');
    setError('');
    setLoading(true);

    try {
      const response = await fetch('http://localhost:4500/api/holiday/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
           Authorization: `Bearer ${user.token}`
        },
        body: JSON.stringify({ title, date })
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setSuccess('Holiday added successfully!');
        setTitle('');
        setDate('');
      } else {
        setError(data.message || 'Failed to add holiday');
      }
    } catch (err) {
      console.error('Error adding holiday:', err);
      setError('Network error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-4">
      <h3>Add New Holiday</h3>

      {success && <div className="alert alert-success">{success}</div>}
      {error && <div className="alert alert-danger">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Holiday Title</label>
          <input
            type="text"
            className="form-control"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            placeholder="Eg: Independence Day"
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Date</label>
          <input
            type="date"
            className="form-control"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </div>

        <button
          type="submit"
          className="btn btn-primary"
          disabled={loading}
        >
          {loading ? 'Adding...' : 'Add Holiday'}
        </button>
      </form>
    </div>
  );
};

export default AddHoliday;
