// src/components/Featured/Featured.jsx
import React from 'react';
import './Featured.css';
import { Link } from 'react-router-dom';
import { getPreviewText, getHeroImage, getDate } from '../../helpers/articleHelpers';

const Featured = ({ article, reverse = false }) => {
  if (!article) return null;

  const previewText = getPreviewText(article);
  const img = getHeroImage(article);
  const date = getDate(article);

  return (
    <div className="featured">
      <Link to={`/article/${article.id}`} className="featured-tile-link">
        <div className={`featured-tile ${reverse ? 'reverse' : ''}`}>
          <div className="featured-left">
            <img src={img} alt={article.title} className="featured-image" />
          </div>
          <div className="featured-right">
            <h2>{article.title}</h2>
            <h4>{date ? new Date(date).toLocaleDateString() : '—'}</h4>
            <p>{previewText}</p>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default Featured;
