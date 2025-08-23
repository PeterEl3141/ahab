const express = require('express');
const router = express.Router();
const { sendMail } = require('../utils/mailer');
const {
  registerUser,
  loginUser,
  getUserProfile,
  forgotPassword,
  resetPassword,
  changePassword,
} = require('../controllers/userController');

const { authMiddleware } = require('../middleware/authMiddleware');

// Public routes
router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token', resetPassword);


// Protected route
router.get('/me', authMiddleware, (req,res)=> res.json(req.user));
router.get('/profile', authMiddleware, getUserProfile);
router.post('/change-password', authMiddleware, changePassword);

// Recovery
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

router.get('/debug-mail', async (req, res) => {
  try {
    const { previewUrl } = await sendMail({
      to: 'test@example.com',
      from: process.env.MAIL_FROM || 'no-reply@localhost',
      subject: 'Ahab test',
      text: 'Hello from Ahab’s Dream.',
    });
    console.log('debug-mail preview:', previewUrl || '(none)');
    res.json({ ok: true, previewUrl: previewUrl || null });
  } catch (e) {
    console.error('debug-mail failed:', e);
    res.status(500).json({ error: e.message });
  }
});

module.exports = router;
