import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { useAuth } from '../../context/Authcontext';

const Holiday = () => {
  const { user } = useAuth();
  const [holidays, setHolidays] = useState([]);
  const [date, setDate] = useState(new Date());

  useEffect(() => {
    const fetchHolidays = async () => {
      try {
        const res = await fetch('http://localhost:4500/api/holiday/get-all', {
          headers: {
            Authorization: `Bearer ${user.token}`
          }
        });
        const data = await res.json();
        if (data.success) {
          setHolidays(data.holidays);
        }
      } catch (error) {
        console.error('Error fetching holidays:', error);
      }
    };
    fetchHolidays();
  }, [user.token]);

  const tileContent = ({ date, view }) => {
    if (view === 'month') {
      const holiday = holidays.find(h =>
        new Date(h.date).toDateString() === date.toDateString()
      );
      if (holiday) {
        return (
          <div title={holiday.title} style={{
            width: '8px',
            height: '8px',
            backgroundColor: 'red',
            borderRadius: '50%',
            margin: '0 auto',
            marginTop: '3px',
          }}></div>
        );
      }
    }
    return null;
  };

  return (
    <div style={{ maxWidth: '500px', margin: '30px auto', textAlign: 'center' }}>
      <h3>Company Holiday Calendar</h3>
      <Calendar
        onChange={setDate}
        value={date}
        tileContent={tileContent}
      />
    </div>
  );
};

export default Holiday;
