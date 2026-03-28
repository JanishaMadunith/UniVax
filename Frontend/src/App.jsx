import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import SignUp from './components/Auth/Signup';
import Login from './components/Auth/Login';
import PatientAppointments from './components/patient/Appointments';
import PatientDashboard from './components/patient/Dashboard';
import PatientClinics from './components/patient/Clinics';
import PatientFeedback from './components/patient/Feedback';
import PatientAbout from './components/patient/About';

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

        {/* Patient Routes */}
        <Route path="/patient/dashboard" element={<PatientDashboard />} />
        <Route path="/patient/clinics" element={<PatientClinics />} />
        <Route path="/patient/appointments" element={<PatientAppointments />} />
        <Route path="/patient/feedback" element={<PatientFeedback />} />
        <Route path="/patient/about" element={<PatientAbout />} />

        {/* Role-based Dashboards */}
        <Route path="/doctor/dashboard" element={<DoctorDashboard />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/signup" />} />
      </Routes>
    </Router>
  );
}

export default App;