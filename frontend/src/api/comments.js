import api from './axios';

// GET /comments/article/:articleId
export const getArticleComments = (articleId) =>
  api.get(`/comments/article/${articleId}`);

// POST /comments  (body: { content, articleId, parentId? })
export const postComment = ({ content, articleId, parentId = null }) =>
  api.post('/comments', { content, articleId, parentId });

// POST /comments/react  (body: { commentId, type: 'LIKE'|'DISLIKE' })
export const reactToComment = ({ commentId, type }) =>
  api.post('/comments/react', { commentId, type });

// Optional helpers if you need them later:
export const updateComment = (id, content) =>
  api.put(`/comments/${id}`, { content });

export const deleteComment = (id) =>
  api.delete(`/comments/${id}`);
