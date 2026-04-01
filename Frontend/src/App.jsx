import React from 'react'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SignUp from './components/Auth/Signup'
import VaccineCatalog from './components/VaccineCatalog/VaccineCatalog'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<SignUp />} />
        <Route path="/vaccines" element={<VaccineCatalog />} />
        {/* Fallback */}
        {/* <Route path="*" element={<SignUp />} /> */}
      </Routes>
    </Router>
  )
}

export default App;
