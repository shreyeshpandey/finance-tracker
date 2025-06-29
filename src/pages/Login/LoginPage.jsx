import React, { useState } from 'react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../firebase/config';
import '../../styles/LoginPage.css';
import { toast } from 'react-toastify';

export default function LoginPage() {
  const [form, setForm] = useState({ username: '', password: '' });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!form.username || !form.password) {
      toast.error('Please enter both username and password.');
      return;
    }

    try {
      const q = query(
        collection(db, 'users'),
        where('username', '==', form.username),
        where('password', '==', form.password)
      );
      const snapshot = await getDocs(q);

      if (snapshot.empty) {
        toast.error('Invalid credentials.');
      } else {
        const user = snapshot.docs[0].data();
        localStorage.setItem('finance_user', JSON.stringify(user));
        toast.success('Login successful!');
        window.location.href = '/';
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error('Something went wrong.');
    }
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleLogin}>
        <h2>Login</h2>
        <input
          type="text"
          name="username"
          value={form.username}
          onChange={handleChange}
          placeholder="Username"
          required
        />
        <input
          type="password"
          name="password"
          value={form.password}
          onChange={handleChange}
          placeholder="Password"
          required
        />
        <button type="submit">Login</button>
      </form>
    </div>
  );
}