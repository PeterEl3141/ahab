import React from 'react'
import './Books.css'
import Header from '../../components/Header/Header'
import Featured from '../../components/Featured/Featured'
import Triptych from '../../components/Triptych/Triptych'
import { Link } from 'react-router-dom'
import ShakesPortal from '../../components/ShakesPortal/ShakesPortal'


const Books = () => {
  return (
    <div>
      <Header headername={'BOOKS'} headercontent={'some splendifirous book reviews'}/>
      <Link to="/articleList/books" className="view-all-link">
      View All Articles →
      </Link>
      <Featured category= "books" position={0}/>
      <Featured reverse category= "books" position={1}/>
      <Triptych category= "books" skipCount={2}/>
      <ShakesPortal />
    </div>
  )
}

export default Books
