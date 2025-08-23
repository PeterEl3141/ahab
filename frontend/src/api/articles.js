import api from './axios';

// Lists
export const fetchArticles = (category, published = true) =>
  api.get('/articles', { params: { category, published } });

export const fetchArticleById = (id) => api.get(`/articles/${id}`);

// Create/Update
export const createArticle = ({ title, category, blocks, published = false }) =>
  api.post('/articles', { title, category, blocks, published });

export const updateArticle = (id, { title, category, blocks }) =>
  api.put(`/articles/${id}`, { title, category, blocks });

// Publish / Unpublish (PUT with explicit state)
export const publishArticle   = (id) => api.put(`/articles/${id}/publish`, { published: true });
export const unpublishArticle = (id) => api.put(`/articles/${id}/publish`, { published: false });
// Optional: one helper to toggle either way
export const setPublished = (id, published) => api.put(`/articles/${id}/publish`, { published });

// Delete
export const deleteArticle = (id) => api.delete(`/articles/${id}`);

// Image upload (Multer). Backend returns { imageUrl }
export const uploadImage = async (file) => {
  const form = new FormData();
  form.append('image', file);
  const { data } = await api.post('/upload/article-image', form, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return { url: data.imageUrl };
};
