import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

function RegisterPage() {
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!form.name || !form.email || !form.password) {
      setError('All fields are required');
      return;
    }
    try {
      await register(form);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
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
      <h1>Create Account</h1>
      {error && (
        <div style={{ color: '#b91c1c', marginBottom: '1rem' }}>
          {error}
        </div>
      )}
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <label style={{ display: 'flex', flexDirection: 'column' }}>
          Full Name
          <input
            type="text"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
            style={{ padding: '0.6rem', borderRadius: '6px', border: '1px solid #cbd5f5' }}
          />
        </label>
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
            background: '#059669',
            color: '#fff',
            fontWeight: '600'
          }}
        >
          Register
        </button>
      </form>
      <p style={{ marginTop: '1rem' }}>
        Already have an account?{' '}
        <Link to="/login" style={{ color: '#059669' }}>
          Login
        </Link>
      </p>
    </section>
  );
}

export default RegisterPage;
