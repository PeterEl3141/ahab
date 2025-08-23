// src/pages/Auth/ForgotPassword.jsx
import React, { useState } from 'react';
import { forgotPassword } from '../../api/users';
import { useNavigate } from 'react-router-dom';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState('');
  const navigate = useNavigate();

  const onSubmit = async (e) => {
    e.preventDefault();
    setErr('');
    if (!email.trim()) return setErr('Please enter your email.');
    try {
      setLoading(true);
      await forgotPassword(email.trim());    // returns 200 even if email not found
      setSent(true);                         // <-- this toggles the UI below
    } catch (e) {
      console.error(e);
      setErr('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <div style={{ padding: '80px 8%', maxWidth: 520 }}>
        <h1>Check your email</h1>
        <p>
          If an account exists for <strong>{email}</strong>, we’ve sent a password reset link.
          It will expire in about an hour.
        </p>
        <div style={{ display: 'flex', gap: 12, marginTop: 16 }}>
          <button onClick={() => navigate('/')}>Back to Home</button>
          <button onClick={() => { setSent(false); }}>Send another</button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: '80px 8%', maxWidth: 520 }}>
      <h1>Forgot your password?</h1>
      <p>Enter the email you signed up with and we’ll send you a reset link.</p>

      <form onSubmit={onSubmit} style={{ display: 'grid', gap: 12, marginTop: 16 }}>
        <label htmlFor="fp-email">Email</label>
        <input
          id="fp-email"
          type="email"
          value={email}
          autoComplete="email"
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <button type="submit" disabled={loading}>
          {loading ? 'Sending…' : 'Send reset link'}
        </button>

        {err && <p className="error" role="alert">{err}</p>}
      </form>
    </div>
  );
}
