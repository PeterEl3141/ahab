import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { resetPassword } from '../../api/users';

export default function ResetPassword() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const token = params.get('token') || '';
  const email = params.get('email') || '';

  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [msg, setMsg] = useState('');
  const [err, setErr] = useState('');

  const onSubmit = async (e) => {
    e.preventDefault();
    setErr(''); setMsg('');
    if (password !== confirm) return setErr('Passwords do not match.');
    try {
      await resetPassword({ token, email, password });
      setMsg('Password updated. You can sign in now.');
      setTimeout(() => navigate('/'), 1200); // or open your sign-in modal
    } catch (e) {
      console.error(e);
      setErr(e?.response?.data?.error || 'Invalid or expired reset link.');
    }
  };

  if (!token || !email) {
    return <p style={{ padding: '80px 8%' }}>Invalid reset link.</p>;
  }

  return (
    <div style={{ padding: '80px 8%' }}>
      <h1>Reset password</h1>
      <form onSubmit={onSubmit} style={{ display: 'grid', gap: 12, maxWidth: 420 }}>
        <label>New password</label>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <label>Confirm password</label>
        <input type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} required />
        <button type="submit">Reset</button>
        {msg && <p className="ok">{msg}</p>}
        {err && <p className="error">{err}</p>}
      </form>
    </div>
  );
}
