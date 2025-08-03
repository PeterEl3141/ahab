// ArticleList.jsx
import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import dummyArticles from '../../DummyData';
import './ArticleList.css';

const ArticleList = () => {
  const { category } = useParams();
  const [selectedId, setSelectedId] = useState(null);

  const filteredArticles = dummyArticles.filter(
    article => article.category?.toLowerCase() === category.toLowerCase()
  );

  const selectedArticle =
    filteredArticles.find(article => article.id === selectedId) || filteredArticles[0];

  if (!filteredArticles.length) {
    return <p>No articles found in this category.</p>;
  }

  return (
    <div className="article-list-page">
      <div className="article-list-left">
        {filteredArticles.map(article => (
          <div
            key={article.id}
            className={`article-title ${selectedId === article.id ? 'active' : ''}`}
            onClick={() => setSelectedId(article.id)}
          >
            {article.title}
          </div>
        ))}
      </div>

      <div className="article-preview-right">
        {selectedArticle && (
          <div className="article-preview">
            {selectedArticle.blocks.slice(0, 3).map((block, i) => {
              switch (block.type) {
                case 'heading': return <h2 key={i}>{block.content}</h2>;
                case 'subheading': return <h3 key={i}>{block.content}</h3>;
                case 'paragraph': return <p key={i}>{block.content}</p>;
                case 'image': return <img key={i} src={block.content} alt="preview" />;
                default: return null;
              }
            })}
            <Link to={`/article/${selectedArticle.id}`} className="read-more-link">
              Read full article →
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default ArticleList;
