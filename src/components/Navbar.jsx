// src/components/Navbar.jsx
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
        <Link to="/transactions" className={pathname === '/transactions' ? 'active' : ''}>Transactions</Link>
      </div>
      <button
  onClick={() => {
    localStorage.removeItem('finance_user');
    window.location.href = '/login';
  }}
>
  Logout
</button>
    </nav>
  );
}