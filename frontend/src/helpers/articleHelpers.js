export const getPreviewText = (article) =>
  article?.blocks?.find(b => b.type === 'paragraph')?.content || 'No preview available.';

export const getHeroImage = (article) =>
  article?.image // if you later store a top-level image
  || article?.blocks?.find(b => b.type === 'image')?.content
  || '/placeholder.jpg';

export const getDate = (article) =>
  article.publishedAt || article.updatedAt || article.createdAt;

export const sortByNewest = (arr = []) =>
  [...arr].sort((a, b) => new Date(getDate(b)) - new Date(getDate(a)));
