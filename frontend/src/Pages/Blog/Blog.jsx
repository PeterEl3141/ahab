import React from 'react'
import './Blog.css'
import Triptych from '../../components/Triptych/Triptych'
import Header from '../../components/Header/Header'
import { Link } from 'react-router-dom'
import Featured from '../../components/Featured/Featured'

const Blog = () => {
  return (
    <div>
      <Header headername={'Blog'} headercontent={'A collection of '}/>
      <Link to="/articleList/blog" className="view-all-link">
        View All Articles →
      </Link>
      <Featured category="blog" position={0}/>
      <Featured reverse category="blog" position={1}/>
      <Triptych category="blog" skipCount={2}/>
    </div>
  )
}

export default Blog
