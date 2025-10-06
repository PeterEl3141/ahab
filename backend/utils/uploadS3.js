// routes/uploadRoutes.js
const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/authMiddleware');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const multer = require('multer');
const sharp = require('sharp');
const crypto = require('crypto');

// AWS SDK v3
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');

const BUCKET = process.env.S3_BUCKET;
const REGION = process.env.AWS_REGION;

// Fail fast if misconfigured (you'll see this in Railway logs on boot)
if (!BUCKET || !REGION) {
  console.warn(
    '[uploadRoutes] Missing S3 config. S3_BUCKET=%s AWS_REGION=%s',
    BUCKET,
    REGION
  );
}

const s3 = new S3Client({ region: REGION });

// Memory upload (so we can run sharp, etc.)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 8 * 1024 * 1024 }, // 8MB
  fileFilter: (req, file, cb) => {
    const ok = /image\/(png|jpe?g|gif|webp)/i.test(file.mimetype);
    cb(ok ? null : new Error('Only PNG/JPG/GIF/WEBP images allowed'), ok);
  }
});

// tiny helper: put buffer to S3 and return a public URL (assuming ACL/public)
async function putBufferToS3({ buffer, key, contentType }) {
  const useAcl = process.env.S3_USE_ACL !== 'false'; // default true
  const cmd = new PutObjectCommand({
    Bucket: BUCKET,
    Key: key,
    Body: buffer,
    ContentType: contentType,
    // If your bucket has "Block Public Access" OFF and policy allows public read:
    ACL: useAcl ? 'public-read' : undefined
  });
  const out = await s3.send(cmd);

  // If you use a CDN base (CloudFront), prefer that
  const base =
    process.env.CDN_BASE_URL ||
    `https://${BUCKET}.s3.${REGION}.amazonaws.com`;
  return {
    url: `${base}/${encodeURIComponent(key)}`,
    etag: out.ETag
  };
}

// ---- ARTICLE IMAGE ----
router.post(
  '/article-image',
  authMiddleware,
  upload.single('image'),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded (field name must be "image")' });
      }

      const ext =
        req.file.mimetype === 'image/png' ? 'png'
        : req.file.mimetype === 'image/gif' ? 'gif'
        : req.file.mimetype === 'image/webp' ? 'webp'
        : 'jpg';

      const key = `articles/${Date.now()}-${crypto.randomBytes(6).toString('hex')}.${ext}`;

      // Optional: normalize to webp/jpg to save bandwidth
      const processed =
        ext === 'png'
          ? await sharp(req.file.buffer).png({ quality: 90 }).toBuffer()
          : ext === 'gif'
          ? req.file.buffer // leave GIF alone unless you want to re-encode
          : await sharp(req.file.buffer).jpeg({ quality: 82 }).toBuffer();

      const { url } = await putBufferToS3({
        buffer: processed,
        key,
        contentType: req.file.mimetype
      });

      return res.status(200).json({ imageUrl: url });
    } catch (e) {
      console.error('[upload/article-image] Failed:', {
        name: e.name,
        code: e.code,
        message: e.message,
        $metadata: e.$metadata
      });
      return res.status(500).json({
        error: 'Upload failed',
        code: e.code || e.name || 'UNKNOWN'
      });
    }
  }
);

// ---- PROFILE PICTURE ----
router.post(
  '/profile-picture',
  authMiddleware,
  upload.single('image'),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded (field name must be "image")' });
      }

      // Resize to something avatar-ish
      const avatar = await sharp(req.file.buffer)
        .resize(256, 256, { fit: 'cover' })
        .jpeg({ quality: 84 })
        .toBuffer();

      const key = `avatars/${req.user.id}-${Date.now()}.jpg`;

      const { url } = await putBufferToS3({
        buffer: avatar,
        key,
        contentType: 'image/jpeg'
      });

      await prisma.user.update({
        where: { id: req.user.id },
        data: { profilePicture: url }
      });

      return res.status(200).json({ imageUrl: url });
    } catch (e) {
      console.error('[upload/profile-picture] Failed:', {
        name: e.name,
        code: e.code,
        message: e.message,
        $metadata: e.$metadata
      });
      return res.status(500).json({
        error: 'Upload failed',
        code: e.code || e.name || 'UNKNOWN'
      });
    }
  }
);

module.exports = router;
