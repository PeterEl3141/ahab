import React from 'react'
import './Header.css'

const Header = ({headername, headercontent}) => {
  return (
    <div className='header'>
      <h2 className='header-title'>{headername}</h2>
      <h3 className='header-content'>{headercontent}</h3>
    </div>
  )
}

export default Header
