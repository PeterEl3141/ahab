// src/components/Login/Login.jsx
import React, { useState, useContext } from 'react';
import './Login.css';
import api from '../../api/axios';              // ← your axios instance
import { AuthContext } from '../../Context/AuthContext'; // ← your context
import { useNavigate } from 'react-router-dom';

const Login = ({ onClose }) => {
  const { login } = useContext(AuthContext);

  const [isLoginMode, setIsLoginMode] = useState(true);
  // Using email (backend expects email), you can relabel the placeholder as “Email”
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const toggleMode = () => {
    setIsLoginMode(!isLoginMode);
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!isLoginMode && password !== confirmPassword) {
      setError("Passwords don't match.");
      return;
    }

    try {
      setSubmitting(true);

      if (isLoginMode) {
        // LOGIN
        const res = await api.post('/users/login', { email, password });
        login(res.data.user, res.data.token);
        onClose?.(); // close modal on success
      } else {
        // SIGN UP
        const res = await api.post('/users/register', { email, password });
        login(res.data.user, res.data.token);
        onClose?.();
      }
    } catch (err) {
      const msg = err?.response?.data?.error || 'Something went wrong. Please try again.';
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="login-overlay" onClick={onClose}>
      <div className="login-box" onClick={(e) => e.stopPropagation()}>
        <button className="close-button" onClick={onClose} aria-label="Close">×</button>

        <h2>{isLoginMode ? 'LOG IN' : 'SIGN UP'}</h2>

        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email*"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
          />

          <input
            type="password"
            placeholder="Password*"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete={isLoginMode ? 'current-password' : 'new-password'}
          />

          {!isLoginMode && (
            <input
              type="password"
              placeholder="Repeat password*"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              autoComplete="new-password"
            />
          )}

          {error && <div className="login-error">{error}</div>}

          <button type="submit" disabled={submitting} className='submit-button'>
            {submitting ? (isLoginMode ? 'Logging in…' : 'Signing up…') : (isLoginMode ? 'LOG IN' : 'SIGN UP')}
          </button>
        </form>

        <div className="login-footer">
          {isLoginMode ? (
            <>
              Don’t have an account?{' '}
              <a onClick={toggleMode}>Sign up here.</a>
            </>
          ) : (
            <>
              Already have an account?{' '}
              <a onClick={toggleMode}>Log in here.</a>
            </>
          )}
          <button onClick={() => navigate('/forgot-password')} className="linkish">
          Forgot your password?
        </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
