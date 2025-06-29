import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import '../styles/Navbar.css';

export default function Navbar() {
  const { pathname } = useLocation();

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-logo">💰 Finance Tracker</Link>

      <div className="nav-links">
        <Link to="/dashboard" className={pathname === '/dashboard' ? 'active' : ''}>Dashboard</Link>
        <Link to="/add" className={pathname === '/add' ? 'active' : ''}>Add</Link>
      </div>
    </nav>
  );
}