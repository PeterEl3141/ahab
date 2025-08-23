import React, { useEffect, useMemo, useState } from "react";
import Comment from "../Comment/Comment.jsx";
import "./Comments.css";
import {
  getArticleComments,
  postComment,
  reactToComment,
  deleteComment
} from "../../api/comments";

// Pass `currentUser` if you have auth; otherwise you can omit it.
const Comments = ({ articleId, currentUser }) => {
  const [comments, setComments] = useState([]);
  const [text, setText] = useState("");
  const [busy, setBusy] = useState(false);



  // Load from backend
  const load = async () => {
    try {
      const { data } = await getArticleComments(articleId);
      setComments(data || []);
    } catch (e) {
      console.error("Failed to load comments", e);
    }
  };

  useEffect(() => {
    if (articleId) load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [articleId]);

  // Group by parent for fast tree building
  const byParent = useMemo(() => {
    const map = new Map();
    for (const c of comments) {
      const key = c.parentId ?? null;
      if (!map.has(key)) map.set(key, []);
      map.get(key).push(c);
    }
    return map;
  }, [comments]);

  const getReplies = (parentId) => byParent.get(parentId) || [];
  const topLevel = byParent.get(null) || [];

  const handleSubmit = async () => {
    const content = text.trim();
    if (!content || busy) return;
    try {
      setBusy(true);
      await postComment({ content, articleId, parentId: null });
      setText("");
      await load(); // refetch to include server fields & counts
    } catch (e) {
      console.error("Failed to post comment", e);
    } finally {
      setBusy(false);
    }
  };

  const addReply = async (parentId, replyText) => {
    const content = replyText.trim();
    if (!content || busy) return;
    try {
      setBusy(true);
      await postComment({ content, articleId, parentId });
      await load();
    } catch (e) {
      console.error("Failed to post reply", e);
    } finally {
      setBusy(false);
    }
  };

  const handleLike = async (id) => {
    try {
      await reactToComment({ commentId: id, type: "LIKE" });
      await load();
    } catch (e) {
      console.error("Failed to react (like)", e);
    }
  };

  const handleDislike = async (id) => {
    try {
      await reactToComment({ commentId: id, type: "DISLIKE" });
      await load();
    } catch (e) {
      console.error("Failed to react (dislike)", e);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this comment? This cannot be undone.")) return;
    try {
      setBusy(true);
      await deleteComment(id);
      await load();
    } catch (e) {
      console.error("Failed to delete comment", e);
      alert("Failed to delete comment.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="comments-section">
      <h2>Comments</h2>

      <div className="comment-form">
        <textarea
          placeholder={currentUser ? "Write a comment…" : "Log in to comment"}
          value={text}
          onChange={(e) => setText(e.target.value)}
          disabled={busy}
        />
        <button
          onClick={handleSubmit}
          disabled={!currentUser || busy || !text.trim()}
        >
          {busy ? "Posting…" : "Comment"}
        </button>
      </div>

      {topLevel.map((comment) => (
        <Comment
          key={comment.id}
          comment={comment}
          replies={getReplies(comment.id)}
          getReplies={getReplies}
          addReply={addReply}
          onLike={handleLike}
          onDislike={handleDislike}
          currentUser={currentUser}
          onDelete={handleDelete}
        />
      ))}
    </div>
  );
};

export default Comments;
