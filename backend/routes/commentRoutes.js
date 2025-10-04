const express = require('express');
const router = express.Router();
const {authMiddleware} = require('../middleware/authMiddleware');
const {ensureCommentOwnerOrAdmin} = require('../middleware/ensureCommentOwnerOrAdmin');
const {getAllComments, createComment, updateComment, deleteComment, likeComment, dislikeComment, toggleReaction} = require('../controllers/commentController')


//public
router.get('/article/:articleId', getAllComments);

//protected
router.post('/', authMiddleware, createComment);
router.put('/:id', authMiddleware, ensureCommentOwnerOrAdmin, updateComment);
router.delete('/:id', authMiddleware, ensureCommentOwnerOrAdmin, deleteComment);

router.patch('/:id/like', authMiddleware, likeComment);
router.patch('/:id/dislike', authMiddleware, dislikeComment);
router.post('/react', authMiddleware, toggleReaction);



module.exports = router;