import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../context/Authcontext';
import { useNavigate } from 'react-router-dom';
import { Dropdown, Image } from 'react-bootstrap';
import AdminNotification from '../Pages/Notification';
import EmpNotification from '../EmployeePages/Notification';

import 'font-awesome/css/font-awesome.min.css';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [imageUrl, setImageUrl] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const notificationRef = useRef();

  useEffect(() => {
    const fetchProfileImage = async () => {
      if (user?.role === 'employee' && user?.userId) {
        try {
          const res = await fetch(`http://localhost:4500/api/employee/get/${user.userId}`, {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${user.token}`,
            }
          });
          const data = await res.json();
          if (res.ok && data?.data?.imageUrl) {
            setImageUrl(data.data.imageUrl);
          } else {
            setImageUrl('https://via.placeholder.com/40');
          }
        } catch (error) {
          console.error("Failed to fetch profile image:", error);
          setImageUrl('https://via.placeholder.com/40');
        }
      }
    };
    fetchProfileImage();
  }, [user]);

  // Close notification dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = async () => {
    try {
      const response = await fetch('http://localhost:4500/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
        headers: {
          Authorization: `Bearer ${user.token}`,
        }
      });
      if (response.ok) {
        logout();
        navigate('/');
      } else {
        alert('Logout failed');
      }
    } catch (err) {
      console.error('Logout error:', err);
      alert('Something went wrong');
    }
  };

  return (
    <nav className="navbar navbar-dark bg-success px-3 justify-content-between" style={{ position: 'fixed', top: 0, width: '100%', zIndex: 500 }}>
      <span className="navbar-brand mb-0 h5 text-white">Employee Management System</span>

      <div className="d-flex align-items-center gap-3 position-relative">

        {/* Notification Bell */}
        <div style={{ position: 'relative' }} ref={notificationRef}>
          <i
            className="fa fa-bell text-white fs-4"
            style={{ cursor: 'pointer' }}
            onClick={() => setShowNotifications(!showNotifications)}
          ></i>

          {showNotifications && (
            <div
              style={{
                position: 'absolute',
                top: '45px',
                right: 0,
                zIndex: 1000,
                width: '350px',
                maxHeight: '400px',
                overflowY: 'auto',
                background: 'white',
                boxShadow: '0px 4px 8px rgba(0,0,0,0.2)',
                borderRadius: '8px',
              }}
            >
              {user?.role === 'admin' ? <AdminNotification /> : <EmpNotification />}
            </div>
          )}
        </div>

        {/* Profile Dropdown */}
        <Dropdown align="end">
          <Dropdown.Toggle variant="light" className="border-0 bg-transparent">
            <Image
              src={imageUrl || 'https://www.pngmart.com/files/21/Admin-Profile-Vector-PNG-Clipart.png'}
              roundedCircle
              width="40"
              height="40"
              style={{ objectFit: 'cover', cursor: 'pointer' }}
              alt="Profile"
            />
          </Dropdown.Toggle>

          <Dropdown.Menu>
            <Dropdown.Header>
              <strong>{user?.role === 'admin' ? 'Admin' : user?.name}</strong><br />
              <small>{user?.email}</small>
            </Dropdown.Header>
            <Dropdown.Divider />
            {user?.role === 'employee' ? (
              <>
                <Dropdown.Item onClick={() => navigate('/employee/profile')}>My Profile</Dropdown.Item>
                <Dropdown.Item onClick={() => navigate('/employee/resignation')}>Apply For Resignation</Dropdown.Item>
                <Dropdown.Item onClick={() => navigate('/employee/settings')}>Change Password</Dropdown.Item>
              </>
            ) : (
              <>
                <Dropdown.Item onClick={() => navigate('/dashboard/holiday')}>Add Holiday</Dropdown.Item>
                <Dropdown.Item onClick={() => navigate('/dashboard/settings')}>Change Password</Dropdown.Item>
              </>
            )}


            <Dropdown.Divider />
            <Dropdown.Item onClick={handleLogout}>Logout</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </div>
    </nav>
  );
};

export default Navbar;
