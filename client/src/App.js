import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AdminLogin from './component/AdminLogin';
import HomePage from './component/HomePage'; // Import component HomePage

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AdminLogin />} />
        <Route path="/home-page/*" element={<HomePage />} />
      </Routes>
    </Router>
  );
}

export default App;