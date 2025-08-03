import React from 'react'
import './Heroarticle.css'
import dummyArticles from '../../DummyData'



const Heroarticle = () => {
  return (
    <div className='card'>
      {dummyArticles.slice(0, 1).map((article, index) => (
        <div key={article.id}>
          <img src={article.image} alt={`${article.title} screenshot`} className='hero-article-image' />
          <h3>{article.title}</h3>
          <p>READ THE LATEST REVIEW</p>
        </div>
      ))}
    </div>
  )
}

export default Heroarticle
