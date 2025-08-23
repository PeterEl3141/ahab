const express = require('express');
const router = express.Router();
const {
  getAllArticles,
  createArticle,
  getArticleById,
  updateArticle,
  togglePublishArticle,
  deleteArticle,
  searchArticles
} = require('../controllers/articleController');
const { authMiddleware } = require('../middleware/authMiddleware');
const { ensureOwnerOrAdmin } = require('../middleware/ownershipMiddleware');
const {ensureAdmin} = require('../middleware/ensureAdmin')

// Public routes
router.get('/', getAllArticles);
router.get('/:id', getArticleById);
router.get('/search', searchArticles);


// Protected routes
router.post('/', authMiddleware, ensureAdmin, createArticle);
router.put('/:id', authMiddleware, ensureOwnerOrAdmin, updateArticle);
router.put('/:id/publish', authMiddleware, ensureAdmin, togglePublishArticle);
router.delete('/:id', authMiddleware, ensureOwnerOrAdmin, deleteArticle);

module.exports = router;
