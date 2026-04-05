import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import SignUp from './components/Auth/Signup';
import Login from './components/Auth/Login';
import PatientAppointments from './components/patient/Appointments';
import PatientDashboard from './components/patient/Dashboard';
import PatientClinics from './components/patient/Clinics';
import PatientFeedback from './components/patient/Feedback';
import PatientAbout from './components/patient/About';
import DoctorDashboard from './components/doctor/DoctorDashboard';
import DoctorAppointments from './components/doctor/DoctorAppointments';
import DoctorClinics from './components/doctor/DoctorClinics';
import DoctorVaccines from './components/doctor/DoctorVaccines';
import DoctorDoses from './components/doctor/DoctorDoses';
import DoctorProfile from './components/doctor/DoctorProfile';
import AdminDashboard from './components/admin/AdminDashboard';

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

        {/* Doctor Routes */}
        <Route path="/doctor/dashboard" element={<DoctorDashboard />} />
        <Route path="/doctor/appointments" element={<DoctorAppointments />} />
        <Route path="/doctor/clinics" element={<DoctorClinics />} />
        <Route path="/doctor/vaccines" element={<DoctorVaccines />} />
        <Route path="/doctor/doses" element={<DoctorDoses />} />
        <Route path="/doctor/profile" element={<DoctorProfile />} />

        {/* Admin Routes */}
        <Route path="/admin/dashboard" element={<AdminDashboard />} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/signup" />} />
      </Routes>
    </Router>
  );
}

export default App;