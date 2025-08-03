import React from 'react'
import './Hero.css'
import Heroarticle from '../Heroarticle/Heroarticle'

const Hero = () => {
  return (
    <div className='hero'>
        <div className="hero-left">
            <h1 className='hero-title'>AHAB'S DREAM</h1>
            <p>//Raptures, ramblings & groovey reviews</p>
        </div>
      
       <Heroarticle/>
    </div>
  )
}

export default Hero
