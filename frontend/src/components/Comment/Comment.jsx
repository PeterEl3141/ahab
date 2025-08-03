import React, { useState } from 'react';
import './Comment.css';

const Comment = ({ comment, replies, addReply, getReplies, onLike, onDislike }) => {
  const [showReplyBox, setShowReplyBox] = useState(false);
  const [replyText, setReplyText] = useState('');

  const handleReply = () => {
    if (replyText.trim()) {
      addReply(comment.id, replyText);
      setReplyText('');
      setShowReplyBox(false);
    }
  };

  return (
    <div className="comment">
      <div className="comment-content">
        <strong>{comment.author}</strong>
        <p>{comment.content}</p>
        <span>{new Date(comment.timestamp).toLocaleString()}</span>
      </div>

      <div className="comment-actions">
        <button onClick={() => setShowReplyBox(prev => !prev)}>
          {showReplyBox ? 'Cancel' : 'Reply'}
        </button>
        <button onClick={() => onLike(comment.id)}>👍 {comment.likes || 0}</button>
        <button onClick={() => onDislike(comment.id)}>👎 {comment.dislikes || 0}</button>
      </div>

      {showReplyBox && (
        <div className="reply-box">
          <textarea
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            placeholder="Write a reply..."
          />
          <button onClick={handleReply}>Reply</button>
        </div>
      )}

      <div className="comment-replies">
        {replies.map(reply => (
          <Comment
            key={reply.id}
            comment={reply}
            replies={getReplies(reply.id)}
            addReply={addReply}
            getReplies={getReplies}
          />
        ))}
      </div>
    </div>
  );
};

export default Comment;
