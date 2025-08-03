import React, { useState } from 'react'
import { Outlet, Route, Routes } from 'react-router-dom'
import Navbar from './components/Navbar/Navbar';
import Footer from './components/Footer/Footer';
import Login from './components/Login/Login';

function App() {

  const [showLogin, setShowLogin] = useState(false);

  return (
    <>
    {showLogin?<Login setShowLogin={setShowLogin} onClose={() => setShowLogin(false)}/>:<></>}
      <div className='app'>
        <Navbar setShowLogin={setShowLogin} showLogin={showLogin} />
          <main>
            <Outlet/>
          </main>
        <Footer />
      </div>
    </>
  )
}

export default App
