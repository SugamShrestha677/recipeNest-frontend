import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

function LoginPage() {
  const { login } = useContext(AuthContext);
  const [form, setForm] = useState({ email: '', password: '' });
  const navigate = useNavigate();
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) {
      setError('Email and password are required');
      return;
    }
    try {
      await login(form);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <section
      style={{
        maxWidth: '420px',
        margin: '0 auto',
        padding: '2rem',
        background: '#fff',
        borderRadius: '10px',
        border: '1px solid #e5e7eb'
      }}
    >
      <h1>Login</h1>
      {error && (
        <div style={{ color: '#b91c1c', marginBottom: '1rem' }}>
          {error}
        </div>
      )}
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <label style={{ display: 'flex', flexDirection: 'column' }}>
          Email
          <input
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
            style={{ padding: '0.6rem', borderRadius: '6px', border: '1px solid #cbd5f5' }}
          />
        </label>
        <label style={{ display: 'flex', flexDirection: 'column' }}>
          Password
          <input
            type="password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
            style={{ padding: '0.6rem', borderRadius: '6px', border: '1px solid #cbd5f5' }}
          />
        </label>
        <button
          type="submit"
          style={{
            padding: '0.7rem',
            borderRadius: '6px',
            border: 'none',
            background: '#2563eb',
            color: '#fff',
            fontWeight: '600'
          }}
        >
          Login
        </button>
      </form>
      <p style={{ marginTop: '1rem' }}>
        Need an account?{' '}
        <Link to="/register" style={{ color: '#2563eb' }}>
          Register
        </Link>
      </p>
    </section>
  );
}

export default LoginPage;
