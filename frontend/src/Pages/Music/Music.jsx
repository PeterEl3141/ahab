import React from 'react'
import './Music.css'
import Header from '../../components/Header/Header'
import Triptych from '../../components/Triptych/Triptych'
import { Link } from 'react-router-dom'
import Featured from '../../components/Featured/Featured'


const Music = () => {
  return (
    <div>
      <Header headername={'MUSIC'} headercontent={'Some of the most exciting music from the past 500 yaers or so'}/>
      <Link to="/articleList/music" className="view-all-link">
      View All Articles →
      </Link>
      <Featured category= "music" position={0}/>
      <Featured reverse category= "music" position={1}/>
      <Triptych category= "music" skipCount={2}/>
    </div>
  )
}

export default Music
