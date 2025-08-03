import React from 'react'
import './Triptych.css'
import dummyArticles from '../../DummyData'

const Triptych = ({ category, skipCount = 2, maxCount = 3 }) => {
  const filtered = dummyArticles
    .filter(a => a.category === category)
    .sort((a, b) => new Date(b.date) - new Date(a.date)); // most recent first

  const triptychArticles = filtered.slice(skipCount, skipCount + maxCount); // skip + limit

  return (
    <div className='triptych'>
      {triptychArticles.map((article) => (
        <div className='triptych-tile' key={article.id}>
          <img src={article.image} alt={`${article.title} screenshot`} className='triptych-image' />
          <h2 className='triptych-tile-title'>{article.title}</h2>
          <h3 className='triptych-tile-date'>{article.date}</h3>
        </div>
      ))}
    </div>
  );
};

export default Triptych;



