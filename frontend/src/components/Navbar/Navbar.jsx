// src/components/Navbar/Navbar.jsx
import React, { useContext, useRef, useState, useEffect } from 'react';
import './Navbar.css';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../Context/AuthContext';
import { uploadProfilePicture, fetchMe } from '../../api/users';





const Navbar = ({ setShowLogin }) => {
  const navigate = useNavigate();

  // Auth
  const { token, user, logout, setUser } = useContext(AuthContext); // ensure setUser exists in context

  // Upload state
  const fileRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  

  const triggerFile = () => fileRef.current?.click();

  const onFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setUploading(true);
      const { imageUrl } = await uploadProfilePicture(file); // { imageUrl }

     // 1) Re-fetch the fresh user from backend
     const { data: fresh } = await fetchMe();

     // 2) Update context + localStorage
     if (setUser) setUser(fresh);
     localStorage.setItem('user', JSON.stringify(fresh));

    } catch (err) {
      console.error(err);
      alert('Failed to upload image.');
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };


  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const initials = user?.email ? user.email[0].toUpperCase() : '?';

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <Link to="/" className="brand" aria-label="Ahab’s Dream — Home">
          <img
            src="/images/logo.png"
            alt="Ahab’s Dream"
            className="brand-logo"
            width={128}   
            height={32}
          />
        </Link>
      </div>

      <div className="navbar-right">
        <ul className="navbar-links">
          <li><Link to="/books">BOOKS</Link></li>
          <li><Link to="/music">MUSIC</Link></li>
          <li><Link to="/blog">BLOG</Link></li>
          <li><Link to="/about">ABOUT</Link></li>

          {token && (
            <li className="dropdown">
              <span>DASHBOARD ▾</span>
              <ul className="dropdown-menu">
                <li><Link to="/dashboard">Editor</Link></li>
                <li><Link to="/unpublished">Unpublished Articles</Link></li>
              </ul>
            </li>
          )}
        </ul>

        {!token ? (
          <button onClick={() => setShowLogin(true)}>SIGN IN</button>
        ) : (
          <div className="navbar-profile dropdown" title={user?.email || 'Profile'}>
            {/* Avatar (don’t bind logout to avatar click) */}
            {user?.profilePicture ? (
              <img
              key={user.profilePicture}                 
              src={user.profilePicture}
              alt="avatar"
              className="navbar-avatar"
            />
            ) : (
              <div className="navbar-avatar-fallback">{initials}</div>
            )}

            {/* Profile menu */}
            <ul className="dropdown-menu">
              <li className="dropdown-item muted">{user?.email || 'Logged in'}</li>

              <li className="dropdown-item">
                <button type="button" onClick={triggerFile} disabled={uploading}>
                  {uploading ? 'Uploading…' : 'Update profile picture'}
                </button>
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  onChange={onFileChange}
                  style={{ display: 'none' }}
                />
              </li>

              <li className="dropdown-item">
                <button type="button" onClick={handleLogout}>Logout</button>
              </li>
            </ul>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
