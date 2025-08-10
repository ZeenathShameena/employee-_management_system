import { Link, Outlet } from 'react-router-dom';
import { FaUser, FaHome, FaCalendarAlt, FaMoneyBill, FaBug , FaCog } from 'react-icons/fa';
import TopNavbar from '../component/Navbar/Navbar';

const EmployeeLayout = () => {
  return (
    <div>
      <TopNavbar/>
        <div className="d-flex" >
          {/* Sidebar */}
          <div className="bg-dark text-white p-3 vh-100" style={{ width: '220px', height: '100vh', position: 'fixed',top: '60px', left: 0, overflowY: 'auto'}}>
            <ul className="nav flex-column">
              <li className="nav-item"><Link to="/employee" className="nav-link text-white"> <FaHome className="me-2" />Dashboard</Link></li>
              {/* <li className="nav-item"><Link to="/employee/profile" className="nav-link text-white"> <FaUser className="me-2" />My Profile</Link></li> */}
              <li className="nav-item"><Link to="/employee/leave" className="nav-link text-white"> <FaCalendarAlt className="me-2" />Leave</Link></li>
              <li className="nav-item"><Link to="/employee/salary" className="nav-link text-white"><FaMoneyBill className="me-2" />Salary</Link></li>
              <li className="nav-item"><Link to="/employee/issue" className="nav-link text-white"><FaBug className="me-2" />Report an Issue</Link></li>
              {/* <li className="nav-item"><Link to="/employee/settings" className="nav-link text-white"><FaCog className="me-2" />Settings</Link></li> */}
            </ul>
          </div>
          <div className="flex-grow-1 p-4" style={{ marginLeft: '220px', marginTop: '60px', width: '100%', minHeight: '100vh', }}>
            <Outlet />
          </div>
        </div>
    </div>
  );
};

export default EmployeeLayout;


