import React from 'react'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SignUp from './components/Auth/Signup'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/home" element={<Home />} />
        <Route path="/" element={<Map />} />
        <Route path="/payment" element={<CardPayment />} />
        {/* Fallback */}
        <Route path="*" element={<SignUp />} />
      </Routes>
    </Router>
  )
}

export default App;
