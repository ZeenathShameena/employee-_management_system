import React from 'react';
import { FaUser, FaQuoteLeft } from 'react-icons/fa';
import { useAuth } from '../../context/Authcontext';
import Holiday from '../Pages/Holiday';
import Notification from './Notification';

const Dashboard = () => {
  const { user } = useAuth();

  return (
    <div className="container mt-4">
      {/* Welcome Card */}
      <div className="card shadow-sm mb-4" style={{ maxWidth: '500px' }}>
        <div className="card-body d-flex align-items-center">
          <FaUser size={30} className="text-success me-3" />
          <div>
            <h5 className="card-title mb-0">Welcome Back</h5>
            <strong className="text-capitalize">{user.name}</strong>
          </div>
        </div>
      </div>

      {/* Greeting Message */}
      <div className="card shadow-sm p-4">
        <h4 className="text-success">ABC Consulting Services Welcomes You!</h4>
        <p className="mb-0">
          We're glad to have you onboard, <strong className="text-capitalize">{user.name}</strong>. 
          Explore your dashboard to manage your leaves, profile, and more.
        </p>

        {/* Optional Quote */}
        <div className="mt-4 p-3 bg-light border-start border-5 border-success rounded">
          <FaQuoteLeft className="me-2 text-muted" />
          <em>“Hard work beats talent when talent doesn't work hard.”</em>
          <br />
          <span className="text-muted">– Tim Notke</span>
        </div>
      </div>
        <div style={{
          height: '10px',
          background: '#f8f9fa',
          margin: '20px 0'
        }}></div>
        <Holiday/>
        <Notification/>
    </div>
  );
};

export default Dashboard;