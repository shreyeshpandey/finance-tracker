// src/pages/Home.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Home.css';

export default function Home() {
  return (
    <div className="home-container">
      <h1>Welcome to 💰 Finance Tracker</h1>
      <p>Track, filter, and export all your site transactions easily.</p>

      <div className="home-buttons">
        <Link to="/transactions">
          <button className="home-button">➕ Add Transaction</button>
        </Link>
        <Link to="/dashboard">
          <button className="home-button">📊 View Dashboard</button>
        </Link>
      </div>
    </div>
  );
}