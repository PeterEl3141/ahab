import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchArticles } from '../../api/articles';
import { renderPreviewBlock } from '../../helpers/renderPreviewBlock.jsx';
import './ArticleList.css'

const ArticleList = () => {
  const { category } = useParams();
  const [articles, setArticles] = useState([]);
  const [selected, setSelected] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const loadArticles = async () => {
      try {
        const { data } = await fetchArticles(category, true);
        setArticles(data);
        if (data.length > 0) setSelected(data[0]);
      } catch (error) {
        console.error('Error fetching articles:', error);
      }
    };
    loadArticles();
  }, [category]);

  return (
    <div  className='article-list-page'>
      {/* Left list */}
      <div className='article-list-left' >
        <h2>{category} Articles</h2>
        {articles.map(a => (
          <div
            key={a.id}
            style={{
              padding: '0.5rem',
              background: selected?.id === a.id ? '#eee' : 'transparent',
              cursor: 'pointer'
            }}
            onClick={() => setSelected(a)}
          >
            <h4 className='article-title'>{a.title}</h4>
            <p className='article-meta'>{a.author?.email}</p>
          </div>
        ))}
      </div>

      {/* Right preview */}
      <div className='article-preview-right'>
        {selected ? (
          <>
            <h2>{selected.title}</h2>
            <p>By {selected.author?.email}</p>
            <button className='article-list-button' onClick={() => navigate(`/article/${selected.id}`)}>Read full</button>
            <div style={{ marginTop: '1rem' }}>
            {(selected.blocks ?? []).slice(0, 3).map((b, i) => renderPreviewBlock(b, i))}
            {Array.isArray(selected.blocks) && selected.blocks.length > 3 && (
              <div style={{ marginTop: '.5rem', opacity: 0.6 }}>…</div>
            )}
            </div>
          </>
        ) : (
          <p>No articles found in this category.</p>
        )}
      </div>
    </div>
  );
};

export default ArticleList;
