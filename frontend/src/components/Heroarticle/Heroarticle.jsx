import React from 'react'
import './Heroarticle.css'
import { Link } from 'react-router-dom'
import { getHeroImage, getDate } from '../../helpers/articleHelpers'

const Heroarticle = ({article}) => {

  if(!article) return null; 

  const img = getHeroImage(article);
  const date = getDate(article);

  return (
    <div className='card'>
      <Link to={`/article/${article.id}`} className='hero-article-link'>
          <img src={img} 
          alt={`${article.title} screenshot`} 
          className='hero-article-image' 
          loading='eager'
          fetchPriority='high'
          />
          <h3>{article.title}</h3>
          <h4>{date ? new Date(date).toLocaleDateString() : '—'}</h4>
          <p className='hero-article-kicker'>READ THE LATEST REVIEW</p>
      </Link>
    </div>
  )
}

export default Heroarticle
