import React, { useEffect, useState } from 'react'
import './Home.css'
import Hero from '../../components/Hero/Hero'
import Triptych from '../../components/Triptych/Triptych'
import Mission from '../../components/Mission/Mission'
import Featured from '../../components/Featured/Featured'
import { fetchArticles } from '../../api/articles'
import { sortByNewest } from '../../helpers/articleHelpers'


const Home = () => {

  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState('');

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        setErr('');
        const { data } = await fetchArticles(undefined, true);
        const list = Array.isArray(data) ? data : data?.items || [];
        setArticles(sortByNewest(list));
      } catch (e) {
        console.error(e);
        setErr('Failed to load latest articles')
      } finally {
        setLoading(false);
      }
    })();
  }, []);

    
    const hero      = articles[0] || null;
    const featured1 = articles[1] || null;
    const featured2 = articles[2] || null;
    const triptych  = articles.slice(3, 6); 


  return (
    <>
      <Hero article={hero}/>
      <Triptych articles={triptych}/>
      <Featured article={featured1}/>
      <Featured article={featured2} reverse/>
      <Mission/>
    </>
  )
}

export default Home;
