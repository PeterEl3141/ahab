// src/pages/Blog/Blog.jsx
import React, { useEffect, useState } from 'react';
import './Blog.css';
import Header from '../../components/Header/Header';
import Triptych from '../../components/Triptych/Triptych';
import Featured from '../../components/Featured/Featured';
import { Link } from 'react-router-dom';
import { fetchArticles } from '../../api/articles';
import { sortByNewest } from '../../helpers/articleHelpers';

const Blog = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState('');

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        setErr('');
        // Ensure the category string matches your DB ('blog' vs 'Blog')
        const { data } = await fetchArticles('blog', true);
        setArticles(Array.isArray(data) ? data : data?.items || []);
      } catch (e) {
        console.error(e);
        setErr('Failed to load blog articles.');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const sorted = sortByNewest(articles);
  const featured0 = sorted[0];
  const featured1 = sorted[1];
  const triptychSlice = sorted.slice(2, 5);

  return (
    <div>
      <Header headername="BLOG" headercontent="Dispatches, ideas, and miscellany." />
      <Link to="/articleList/blog" className="view-all-link">View All Articles →</Link>

      {loading && <p>Loading…</p>}
      {!loading && err && <p className="error">{err}</p>}

      {!loading && !err && (
        <>
          <Featured article={featured0} />
          <Featured article={featured1} reverse />
          <Triptych articles={triptychSlice} />
        </>
      )}
    </div>
  );
};

export default Blog;



