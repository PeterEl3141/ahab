import React from 'react'
import './Home.css'
import Hero from '../../components/Hero/Hero'
import Triptych from '../../components/Triptych/Triptych'
import Mission from '../../components/Mission/Mission'
import Featured from '../../components/Featured/Featured'


const Home = () => {
  return (
    <>
      <Hero/>
      <Triptych category='music' skipCount={2}/>
      <Mission/>
      <Featured category='books' position={0}/>
    </>
  )
}

export default Home;
