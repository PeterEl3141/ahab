import React, { useState } from 'react';
import './Footer.css';
import { Link } from 'react-router-dom';

const Footer = ({ onSubscribe }) => {
  const [email, setEmail] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmed = email.trim();
    if (!trimmed) return;
    // Hook this up later to your backend or Mailchimp/ConvertKit, etc.
    onSubscribe ? onSubscribe(trimmed) : alert(`Subscribed: ${trimmed}`);
    setEmail('');
  };

  return (
    <footer className="footer">
      <div className="footer-inner">
        {/* Left: Newsletter */}
        <div className="footer-left">
          <h3 className="footer-heading">Subscribe</h3>
          <p className="footer-copy">Fresh reviews & deep dives in your inbox.</p>
          <form className="subscribe-form" onSubmit={handleSubmit}>
            <label htmlFor="newsletter" className="sr-only">Email address</label>
            <input
              id="newsletter"
              type="email"
              placeholder="you@ahabsdream.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              required
            />
            <button type="submit">Join</button>
          </form>
        </div>

        {/* Right: Socials */}
        <div className="footer-right">
          <h3 className="footer-heading">Follow us</h3>
          <div className="socials">
            <a
              href="https://instagram.com/ahabsdream"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              title="Instagram"
            >
              <img
                src="/images/instagram.png"
                alt=""
                className="social-icon"
                width="28"
                height="28"
              />
            </a>
            <a
              href="https://youtube.com/@ahabsdream"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="YouTube"
              title="YouTube"
            >
              <img
                src="/images/youtube.png"
                alt=""
                className="social-icon"
                width="28"
                height="28"
              />
            </a>
            <a
              href="https://facebook.com/ahabsdream"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
              title="Facebook"
            >
              <img
                src="/images/facebook.png"
                alt=""
                className="social-icon"
                width="28"
                height="28"
              />
            </a>
          </div>
        </div>
      </div>

      {/* Lower strip */}
      <div className="footer-bar">
        <div className="footer-brand">
          <img
            src="/images/logo.png"
            alt="Ahab’s Dream"
            className="footer-logo"
            width="120"
            height="28"
          />
          <span>© {new Date().getFullYear()} Ahab’s Dream</span>
        </div>
        <nav className="footer-links" aria-label="Footer navigation">
          <Link to="/about">About</Link>
          <Link to="/articleList/music">Music</Link>
          <Link to="/articleList/books">Books</Link>
          <Link to="/articleList/blog">Blog</Link>
          <Link to="/contact">Contact</Link>
          <Link to="/privacy">Privacy</Link>
          <Link to="/terms">Terms</Link>
        </nav>
      </div>
    </footer>
  );
};

export default Footer;
