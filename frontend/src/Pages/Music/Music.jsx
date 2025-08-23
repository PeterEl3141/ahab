// src/pages/Music/Music.jsx
import React, { useEffect, useState } from 'react';
import './Music.css';
import Header from '../../components/Header/Header';
import Triptych from '../../components/Triptych/Triptych';
import Featured from '../../components/Featured/Featured';
import { Link } from 'react-router-dom';
import { fetchArticles } from '../../api/articles';
import { sortByNewest } from '../../helpers/articleHelpers';

const Music = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState('');

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        setErr('');
        // backend expects category value exactly as stored; adjust if your enum is "Music"
        const { data } = await fetchArticles('music', true); 
        setArticles(Array.isArray(data) ? data : data?.items || []);
      } catch (e) {
        console.error(e);
        setErr('Failed to load music articles.');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const sorted = sortByNewest(articles);

  // Slices to avoid overlap:
  const featured0 = sorted[0];
  const featured1 = sorted[1];
  const triptychSlice = sorted.slice(2, 5); // next three

  return (
    <div>
      <Header headername="MUSIC" headercontent="Some of the most exciting music from the past 500 years or so" />
      <Link to="/articleList/music" className="view-all-link">View All Articles →</Link>

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

export default Music;
