import React, { useState } from 'react';
import './Comment.css';

const Comment = ({
  comment,
  replies,
  getReplies,
  addReply,
  onLike,
  onDislike,
  onDelete,        // <-- add this
  currentUser,
}) => {
  const [showReplyBox, setShowReplyBox] = useState(false);
  const [replyText, setReplyText] = useState('');

  const handleReply = () => {
    const content = replyText.trim();
    if (!content) return;
    addReply(comment.id, content);
    setReplyText('');
    setShowReplyBox(false);
  };

  // Resolve author fields regardless of API shape
  const authorId =
    comment.authorId ??
    comment.userId ??
    comment.author?.id ??
    comment.user?.id;

  const authorEmail =
    comment.user?.email ??
    comment.author?.email ??
    'Anonymous';

  const isAdmin = currentUser?.role === 'ADMIN' || currentUser?.isAdmin === true;
  const isOwner =
    currentUser?.id != null &&
    authorId != null &&
    String(currentUser.id) === String(authorId);

  const canDelete = !!currentUser && (isAdmin || isOwner);

  return (
    <div className="comment">
      <div className="comment-content">
        <strong>{authorEmail}</strong>
        <p className="comment-text">{comment.content}</p>
        <span className="comment-date">
          {new Date(comment.createdAt).toLocaleString()}
        </span>
      </div>

      <div className="comment-actions">
        <button type="button" onClick={() => setShowReplyBox(p => !p)} disabled={!currentUser}>
          {showReplyBox ? 'Cancel' : 'Reply'}
        </button>
        <button type="button" onClick={() => onLike(comment.id)}>👍 {comment.likes ?? 0}</button>
        <button type="button" onClick={() => onDislike(comment.id)}>👎 {comment.dislikes ?? 0}</button>

        {canDelete && (
          <button type="button" className="comment-delete" onClick={() => onDelete(comment.id)}>
            Delete
          </button>
        )}
      </div>

      {showReplyBox && (
        <div className="reply-box">
          <textarea
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            placeholder="Write a reply..."
          />
          <button type="button" onClick={handleReply} disabled={!replyText.trim()}>
            Reply
          </button>
        </div>
      )}

      <div className="comment-replies">
        {replies.map((reply) => (
          <Comment
            key={reply.id}
            comment={reply}
            replies={getReplies(reply.id)}
            getReplies={getReplies}
            addReply={addReply}
            onLike={onLike}
            onDislike={onDislike}
            onDelete={onDelete}          
            currentUser={currentUser}
          />
        ))}
      </div>
    </div>
  );
};

export default Comment;
