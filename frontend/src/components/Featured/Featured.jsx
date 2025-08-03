import React from 'react'
import './Featured.css'
import dummyArticles from '../../DummyData'
import { Link } from 'react-router-dom'

const Featured = ({ category, reverse = false, position = 0 }) => {
    const filtered = dummyArticles
      .filter(a => a.category === category)
      .sort((a, b) => new Date(b.date) - new Date(a.date)); // sort by most recent
  
    const selected = filtered[position]; // pick article based on position
    if (!selected) return null;
  
    const previewText =
      selected.blocks?.find(b => b.type === 'paragraph')?.content || "No preview available.";
  
    return (
      <div className="featured">
        <Link to={`/article/${selected.id}`} className="featured-tile-link">
          <div className={`featured-tile ${reverse ? 'reverse' : ''}`}>
            <div className="featured-left">
              <img src={selected.image} alt={selected.title} className="featured-image" />
            </div>
            <div className="featured-right">
              <h2>{selected.title}</h2>
              <h4>{selected.date}</h4>
              <p>{previewText}</p>
            </div>
          </div>
        </Link>
      </div>
    );
  };

  
  

export default Featured;
