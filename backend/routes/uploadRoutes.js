// routes/uploadRoutes.js
const express = require('express');
const router = express.Router();
const path = require('path');
const multer = require('multer');
const { PrismaClient } = require('@prisma/client');
const { authMiddleware } = require('../middleware/authMiddleware');

const { uploadBufferToS3 } = require('../utils/uploadS3');

const prisma = new PrismaClient();

/* ----------------------------- multer (memory) ----------------------------- */
const storage = multer.memoryStorage();

const imageFilter = (req, file, cb) => {
  // check both mimetype and extension just to be safe
  const okMime = /^image\/(jpeg|jpg|png|gif|webp|avif)$/.test(file.mimetype);
  const okExt  = /\.(jpe?g|png|gif|webp|avif)$/i.test(file.originalname);
  if (okMime && okExt) return cb(null, true);
  cb(new Error('Only image files are allowed!'), false);
};

const upload = multer({
  storage,
  fileFilter: imageFilter,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
});

/* ------------------------------- utilities -------------------------------- */
const safeName = (name) =>
  name.replace(/[^\w.\-]+/g, '_').replace(/_+/g, '_').toLowerCase();

const cacheForever = 'public, max-age=31536000, immutable';

/* --------------------------------- routes --------------------------------- */

// POST /api/upload/article-image
router.post(
  '/article-image',
  authMiddleware,
  upload.single('image'),
  async (req, res) => {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded.' });

    try {
      const ext = path.extname(req.file.originalname) || '';
      const key = `articles/${req.user.id}/${Date.now()}-${safeName(
        req.file.originalname.replace(ext, '')
      )}${ext}`;

      const { url } = await uploadBufferToS3({
        buffer: req.file.buffer,
        key,
        contentType: req.file.mimetype,
        cacheControl: cacheForever,
      });

      return res.status(200).json({ imageUrl: url, key });
    } catch (err) {
      console.error('[upload article-image] failed:', err);
      return res.status(500).json({ error: 'Failed to upload image.' });
    }
  }
);

// POST /api/upload/profile-picture
router.post(
  '/profile-picture',
  authMiddleware,
  upload.single('image'),
  async (req, res) => {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded.' });

    try {
      // You can overwrite per-user to keep one key, or keep multiple versions.
      const ext = path.extname(req.file.originalname) || '.jpg';
      const key = `profiles/${req.user.id}/avatar-${Date.now()}${ext}`;

      const { url } = await uploadBufferToS3({
        buffer: req.file.buffer,
        key,
        contentType: req.file.mimetype,
        cacheControl: cacheForever,
      });

      await prisma.user.update({
        where: { id: req.user.id },
        data: { profilePicture: url },
      });

      return res.status(200).json({ imageUrl: url, key });
    } catch (err) {
      console.error('[upload profile-picture] failed:', err);
      return res.status(500).json({ error: 'Failed to update profile picture.' });
    }
  }
);

module.exports = router;
