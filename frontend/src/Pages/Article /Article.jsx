import React from 'react'
import './Article.css'
import dummyArticles from '../../DummyData.js'
import { useParams } from 'react-router-dom'
import Comments from '../../components/Comments/Comments.jsx'

const Article = () => {
    const {id} = useParams();
    const article = dummyArticles.find((a) => a.id === Number(id));
    if (!article) return <p>Artilce not found</p>

  return (
    <div className='article'>
   {article.blocks.map((block, index) => (
  <div key={index}>
    {(() => {
      switch (block.type) {
        case 'heading': return <h1>{block.content}</h1>;
        case 'subheading': return <h2>{block.content}</h2>;
        case 'paragraph': return <p>{block.content}</p>;
        case 'image': return <img src={block.content} alt="article visual" />;
        default: return null;
      }
    })()}
  </div>
))}
    <Comments articleId={id} />
  </div>
  )
}

export default Article
