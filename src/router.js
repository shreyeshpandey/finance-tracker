import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Navbar from './components/Navbar';
import AddTransaction from './pages/AddTransaction';
import Dashboard from './pages/Dashboard';
import Home from './components/Home';

export default function AppRouter() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/add" element={<AddTransaction />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="*" element={<div style={{ padding: "2rem" }}><h2>404 - Page Not Found</h2></div>} />
      </Routes>
    </Router>
  );
}