import React, { useContext } from 'react'
import './Navbar.css'
import { Link, useNavigate } from 'react-router-dom'
import { AuthContext }from '../../Context/AuthContext'
import Login from '../Login/Login'

const Navbar = ({setShowLogin, showLogin}) => {
    const { token, setToken } = useContext(AuthContext);
    const navigate = useNavigate();

    const logout = () => {
        localStorage.removeItem("token");
        setToken("");
        navigate('/')
      }
  return (
    <nav className='navbar'>
        <div className="navbar-left">
            <Link to='/'>Logo</Link>
        </div>
        <div className="navbar-right">
            <ul className="navbar-links">
                <li><Link to='books'>BOOKS</Link></li>
                <li><Link to='music'>MUSIC</Link></li>
                <li><Link to='blog'>BLOG</Link></li>
                <li><Link to='about'>ABOUT</Link></li>
                <li className="dropdown">
                    <span>DASHBOARD ▾</span>
                    <ul className="dropdown-menu">
                        <li><Link to="/dashboard">Editor</Link></li>
                        <li><Link to="/unpublished">Unpublished Articles</Link></li>
                    </ul>
                </li>
            </ul>
            {!token ? (
            <button onClick={() => setShowLogin(true)}>SIGN IN</button>
            ) : (
            <div className='navbar-profile'>
                <div onClick={logout}><p>LOGOUT</p></div>
            </div>
            )}
        </div>
    </nav>
  )
}

export default Navbar
