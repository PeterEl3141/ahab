const express = require('express');
const router = express.Router();
const {authMiddleware} = require('../middleware/authMiddleware');
const {getAllComments, createComment, updateComment, deleteComment, likeComment, dislikeComment, toggleReaction} = require('../controllers/commentController')


//public
router.get('/article/:articleId', getAllComments);

//protected
router.post('/', authMiddleware, createComment);
router.put('/:id', authMiddleware, updateComment);
router.delete('/:id', authMiddleware, deleteComment);

router.patch('/:id/like', authMiddleware, likeComment);
router.patch('/:id/dislike', authMiddleware, dislikeComment);
router.post('/react', authMiddleware, toggleReaction);



module.exports = router;