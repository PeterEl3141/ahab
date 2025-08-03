import React, { useEffect, useState } from 'react';
import Comment from '../Comment/Comment.jsx';
import './Comments.css';

const Comments = ({ articleId }) => {
  const [comments, setComments] = useState([]);
  const [text, setText] = useState('');

  // Load from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(`comments-${articleId}`);
    if (stored) {
      setComments(JSON.parse(stored));
    }
  }, [articleId]);

  // Save to localStorage when comments change
  useEffect(() => {
    localStorage.setItem(`comments-${articleId}`, JSON.stringify(comments));
  }, [comments, articleId]);

  const handleSubmit = () => {
    if (!text.trim()) return;

    const newComment = {
      id: Date.now(),
      content: text.trim(),
      author: 'John Doe', // Temporary static user
      timestamp: new Date().toISOString(),
      parentId: null,
    };

    setComments(prev => [...prev, newComment]);
    setText('');
  };


  const handleLike = (id) => {
    setComments(prev => prev.map(c => c.id === id ? {...c, likes: (c.likes || 0) + 1} : c))
  }

  const handleDislike = (id) => {
    setComments(prev => prev.map(c => c.id === id ? {...c, dislikes: (c.dislikes || 0) + 1 } : c))
  }


  // Recursive function to structure nested comments
  const getReplies = (parentId) => {
    return comments.filter(c => c.parentId === parentId);
  };

  const addReply = (parentId, replyText) => {
    const reply = {
      id: Date.now(),
      content: replyText,
      author: 'John Doe',
      timestamp: new Date().toISOString(),
      parentId,
    };
    setComments(prev => [...prev, reply]);
  };

  const topLevelComments = comments.filter(c => c.parentId === null);

  return (
    <div className="comments-section">
      <h2>Comments</h2>
      <div className="comment-form">
        <textarea
          placeholder="Write a comment..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <button onClick={handleSubmit}>Comment</button>
      </div>

      {topLevelComments.map(comment => (
        <Comment
          key={comment.id}
          comment={comment}
          replies={getReplies(comment.id)}
          addReply={addReply}
          getReplies={getReplies}
          onLike={handleLike}
          onDislike={handleDislike}
        />
      ))}
    </div>
  );
};

export default Comments;
