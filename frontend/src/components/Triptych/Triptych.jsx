// Triptych.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import './Triptych.css';
import { getHeroImage, getDate } from '../../helpers/articleHelpers';

const Triptych = ({ articles = [] }) => {
  if (!articles.length) return null;

  return (
    <div className="triptych">
      {articles.map((article) => {
        const img = getHeroImage(article);
        const date = getDate(article);

        return (
          <Link
            key={article.id}
            to={`/article/${article.id}`}
            className="triptych-tile"
            aria-label={`Read ${article.title}`}
          >
            <img
              src={img}
              alt={article.title}
              className="triptych-image"
              loading="lazy"
            />
            <h2 className="triptych-tile-title">{article.title}</h2>
            <h3 className="triptych-tile-date">
              {date ? new Date(date).toLocaleDateString() : '—'}
            </h3>
          </Link>
        );
      })}
    </div>
  );
};
export default Triptych;
