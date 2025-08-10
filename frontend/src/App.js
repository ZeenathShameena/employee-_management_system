import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

import LoginPage from './component/LoginPage.js'; 
import ForgotPasswordPage from './component/ForgotPasswordPage.js'

import DashboardLayout from './Layouts/DashboardLayout.js';
import EmployeePage from './component/Pages/EmployeePage';
import DashboardHome from './component/Pages/DashboardHome';
import Departments from './component/Pages/Department'
import Leaves from './component/Pages/Leave'
import Salary from './component/Pages/Salary.js'
import Issue from './component/Pages/IssueReport.js'
import Resignation from './component/Pages/Resignation.js';
import AddHoliday from './component/Pages/AddHoliday.js';


import EmployeeLayout from './Layouts/EmployeeLayout.js';
import EmployeeLeave from './component/EmployeePages/Leave.js';
import EmployeeDashboard from './component/EmployeePages/Dashboard.js';
import EmployeeProfile from './component/EmployeePages/Profile.js';
import EmployeeSalary from './component/EmployeePages/Salary.js'
import EmployeeIssue from './component/EmployeePages/Issue.js'
import EmployeeResignation from './component/EmployeePages/Resignation.js';

import Settings from './component/Pages/SettingsPage.js';
import ProtectedRoute from './Routes/ProtectedRoute.js';
import NotFound from './component/ErrorPage.js';

function App() {
  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<LoginPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />


        {/* Admin Protected routes */}
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute role="admin">
            <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<DashboardHome /> } />
          <Route path="employees" element={<EmployeePage />} /> 
          <Route path="departments" element={<Departments />} />
          <Route path="leaves" element={<Leaves />} />
          <Route path="salary" element={<Salary />} />
          <Route path="issue" element={<Issue />} />
          <Route path="resignation" element={<Resignation />} />
          <Route path="holiday" element={<AddHoliday />} /> 
          <Route path="settings" element={<Settings />} /> 
        </Route>


        <Route path="/employee" element={<ProtectedRoute role="employee"> <EmployeeLayout /> </ProtectedRoute>}>
            <Route index element={<EmployeeDashboard />} />
            <Route path="profile" element={<EmployeeProfile />} />
            <Route path="leave" element={<EmployeeLeave />} />
            <Route path="salary" element={<EmployeeSalary />} />
            <Route path="issue" element={<EmployeeIssue />} />
            <Route path="settings" element={<Settings />} />
            <Route path="resignation" element={<EmployeeResignation />} />
        </Route>  

        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
