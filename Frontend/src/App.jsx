import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import SignUp from './components/Auth/Signup';
import Login from './components/Auth/Login';

// (Optional placeholders for now — you can replace later)
const PatientDashboard = () => <h1>Patient Dashboard</h1>;
const DoctorDashboard = () => <h1>Doctor Dashboard</h1>;
const AdminDashboard = () => <h1>Admin Dashboard</h1>;

function App() {
  return (
    <Router>
      <Routes>

        {/* Redirect to signup */}
        <Route path="/" element={<Navigate to="/signup" />} />

        {/* Auth Routes */}
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<Login />} />

        {/* Role-based Dashboards */}
        <Route path="/patient/dashboard" element={<PatientDashboard />} />
        <Route path="/doctor/dashboard" element={<DoctorDashboard />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/signup" />} />

      </Routes>
    </Router>
  );
}

export default App;