import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { useAuth } from '../../context/Authcontext';
import EmployeePage from './EmployeePage';
import Department from './Department';
import Notification from './Notification';
import Holiday from './Holiday';

const DashboardHome = () => {
  const { user } = useAuth();
  const [holidays, setHolidays] = useState([]);
  const [date, setDate] = useState(new Date());
  const [dashboardData, setDashboardData] = useState({
    totalEmployees: 0,
    totalDepartments: 0,
    loading: true,
    error: null
  });

    useEffect(() => {
    const fetchHolidays = async () => {
      const res = await fetch('http://localhost:4500/api/holidays');
      const data = await res.json();
      const holidayDates = data.map(h => new Date(h.date).toDateString());
      setHolidays(holidayDates);
    };
    fetchHolidays();
  }, []);

  const tileContent = ({ date, view }) => {
    if (view === 'month' && holidays.includes(date.toDateString())) {
      return (
        <div
          style={{
            width: '8px',
            height: '8px',
            backgroundColor: 'red',
            borderRadius: '50%',
            margin: '0 auto',
            marginTop: '3px',
          }}
        ></div>
      );
    }
    return null;
  };

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await fetch('http://localhost:4500/api/auth/count', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${user.token}`
          }
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch dashboard data');
        }
        
        const data = await response.json();
        
        if (data.success) {
          setDashboardData({
            totalEmployees: data.totalEmployees,
            totalDepartments: data.totalDepartments,
            loading: false,
            error: null
          });
        } else {
          throw new Error('API returned unsuccessful response');
        }
      } catch (error) {
        setDashboardData(prev => ({
          ...prev,
          loading: false,
          error: error.message
        }));
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <div>
      <div className="card p-4 mb-3 shadow-sm">
        <h2 className="fw-bold">ABC Consulting Services</h2>
        <p className="text-muted">Employee Management System</p>
      </div>

      <div className="row mt-4">
        <div className="col-md-4">
          <div className="card text-center">
            <div className="card-body">
              <h5>Total Employees</h5>
              {dashboardData.loading ? (
                <div className="spinner-border spinner-border-sm" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              ) : dashboardData.error ? (
                <p className="text-danger">Error loading data</p>
              ) : (
                <p className="fs-4 fw-bold">{dashboardData.totalEmployees}</p>
              )}
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card text-center">
            <div className="card-body">
              <h5>Total Departments</h5>
              {dashboardData.loading ? (
                <div className="spinner-border spinner-border-sm" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              ) : dashboardData.error ? (
                <p className="text-danger">Error loading data</p>
              ) : (
                <p className="fs-4 fw-bold">{dashboardData.totalDepartments}</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {dashboardData.error && (
        <div className="alert alert-danger mt-3" role="alert">
          <strong>Error:</strong> {dashboardData.error}
        </div>
      )}
      <EmployeePage/>
        <div style={{
          height: '10px',
          background: '#f8f9fa',
          margin: '20px 0'
        }}></div>
      <Department/>
        <div style={{
          height: '10px',
          background: '#f8f9fa',
          margin: '20px 0'
        }}></div>
      <Notification/>
        <div style={{
          height: '10px',
          background: '#f8f9fa',
          margin: '20px 0'
        }}></div>
      <Holiday/>

    </div>
  );
};

export default DashboardHome;




