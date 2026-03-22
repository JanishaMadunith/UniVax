import React from 'react'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SignUp from './components/Auth/Signup'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<SignUp />} />
        {/* Fallback */}
        {/* <Route path="*" element={<SignUp />} /> */}
      </Routes>
    </Router>
  )
}

export default App;
