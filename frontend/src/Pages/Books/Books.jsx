// src/pages/Books/Books.jsx
import React, { useEffect, useState } from 'react';
import './Books.css';
import Header from '../../components/Header/Header';
import Triptych from '../../components/Triptych/Triptych';
import Featured from '../../components/Featured/Featured';
import { Link } from 'react-router-dom';
import { fetchArticles } from '../../api/articles';
import { sortByNewest } from '../../helpers/articleHelpers';
import ShakesPortal from '../../components/ShakesPortal/ShakesPortal';

const Books = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState('');

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        setErr('');
        // Make sure this matches your backend’s stored value exactly (e.g., 'Books' vs 'books')
        const { data } = await fetchArticles('books', true);
        setArticles(Array.isArray(data) ? data : data?.items || []);
      } catch (e) {
        console.error(e);
        setErr('Failed to load book articles.');
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
      <Header headername="BOOKS" headercontent="Reviews, essays, and notes on literature." />
      <Link to="/articleList/books" className="view-all-link">View All Articles →</Link>

      {loading && <p>Loading…</p>}
      {!loading && err && <p className="error">{err}</p>}

      {!loading && !err && (
        <>
          <Featured article={featured0} />
          <Featured article={featured1} reverse />
          <Triptych articles={triptychSlice} />
          <ShakesPortal />
        </>
      )}
    </div>
  );
};

export default Books;
