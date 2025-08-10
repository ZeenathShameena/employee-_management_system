import React from 'react';
import { NavLink } from 'react-router-dom';
import { FaHome, FaCalendarAlt, FaMoneyBill, FaCog, FaBug } from 'react-icons/fa';

const Sidebar = () => {
  return (
    <div className="bg-dark text-white p-3 vh-100" style={{ width: '250px', height: '100vh', position: 'fixed',top: '60px', left: 0, overflowY: 'auto' }}>
      <ul className="nav flex-column">
        <li className="nav-item">
          <NavLink to="/dashboard" className="nav-link text-white"> <FaHome className="me-2" /> Dashboard</NavLink>
        </li>
        {/* <li className="nav-item">
          <NavLink to="/dashboard/employees" className="nav-link text-white"> <FaUser className="me-2" /> Employees</NavLink>
        </li>
        <li className="nav-item">
          <NavLink to="/dashboard/departments" className="nav-link text-white"> <FaBuilding className="me-2" /> Departments</NavLink>
        </li> */}
        <li className="nav-item">
          <NavLink to="/dashboard/leaves" className="nav-link text-white"> <FaCalendarAlt className="me-2" /> Leaves</NavLink>
        </li>
        <li className="nav-item">
          <NavLink to="/dashboard/salary" className="nav-link text-white"> <FaMoneyBill className="me-2" /> Salary</NavLink>
        </li>
        <li className="nav-item">
          <NavLink to="/dashboard/issue" className="nav-link text-white"> <FaBug className="me-2" />Reported Issue</NavLink>
        </li>
        <li className="nav-item">
          <NavLink to="/dashboard/resignation" className="nav-link text-white"><FaCog className="me-2" />Resignation application</NavLink>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
