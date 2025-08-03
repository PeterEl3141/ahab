import React, { useState } from 'react';
import './Login.css';

const Login = ({ onClose }) => {
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const toggleMode = () => {
    setIsLoginMode(!isLoginMode);
    setUsername('');
    setPassword('');
    setConfirmPassword('');
  };

  return (
    <div className="login-overlay">
      <div className="login-box">
        <span className="close-button" onClick={onClose}>×</span>
        <h2>{isLoginMode ? 'LOG IN' : 'SIGN UP'}</h2>
        <input
          type="text"
          placeholder="Username*"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password*"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {!isLoginMode && (
          <input
            type="password"
            placeholder="Repeat password*"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        )}
        <button>{isLoginMode ? 'LOG IN' : 'SIGN UP'}</button>
        <div className="login-footer">
          {isLoginMode ? (
            <>
              Don’t have an account?
              <a onClick={toggleMode}>Sign up here.</a>
            </>
          ) : (
            <>
              Already have an account?
              <a onClick={toggleMode}>Log in here.</a>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;

