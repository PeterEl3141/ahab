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
const REGION = process.env.AWS_REGION || process.env.AWS_DEFAULT_REGION || 'us-east-1';
const CDN_BASE = process.env.CDN_BASE_URL; // optional (CloudFront etc.)
const S3_USE_ACL = process.env.S3_USE_ACL === 'true'; // default to FALSE

if (!BUCKET) {
  console.warn('[uploadRoutes] Missing S3_BUCKET env.');
}
console.log('[uploadRoutes] S3 config:', { BUCKET, REGION, S3_USE_ACL });

const s3 = new S3Client({
  region: REGION,
  credentials: (process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY)
    ? { accessKeyId: process.env.AWS_ACCESS_KEY_ID, secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY }
    : undefined,
});

// Memory upload so we can process with sharp
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 8 * 1024 * 1024 }, // 8MB
  fileFilter: (req, file, cb) => {
    const ok = /image\/(png|jpe?g|gif|webp)/i.test(file.mimetype);
    cb(ok ? null : new Error('Only PNG/JPG/GIF/WEBP images allowed'), ok);
  }
});

/**
 * Put buffer to S3, return public URL
 * NOTE: No ACL unless S3_USE_ACL=true
 */
async function putBufferToS3({ buffer, key, contentType, cacheControl = 'public, max-age=31536000, immutable' }) {
  const input = {
    Bucket: BUCKET,
    Key: key,
    Body: buffer,
    ContentType: contentType,
    CacheControl: cacheControl,
  };
  if (S3_USE_ACL) input.ACL = 'public-read';

  console.log('[uploadRoutes] PutObject →', {
    Bucket: BUCKET, Key: key, ContentType: contentType, ACL: S3_USE_ACL ? 'public-read' : undefined
  });

  const out = await s3.send(new PutObjectCommand(input));

  const base = CDN_BASE || `https://${BUCKET}.s3.${REGION}.amazonaws.com`;
  return { url: `${base}/${encodeURIComponent(key)}`, etag: out.ETag };
}

// Decide output format + process with sharp to match extension + contentType
async function processImageTo({ buffer, want }) {
  // want: 'jpg' | 'png' | 'webp' | 'gif' (gif we return original)
  if (want === 'gif') return { out: buffer, contentType: 'image/gif', ext: 'gif' };
  if (want === 'png') {
    const out = await sharp(buffer).png({ quality: 90 }).toBuffer();
    return { out, contentType: 'image/png', ext: 'png' };
  }
  if (want === 'webp') {
    const out = await sharp(buffer).webp({ quality: 80 }).toBuffer();
    return { out, contentType: 'image/webp', ext: 'webp' };
  }
  // default jpg
  const out = await sharp(buffer).jpeg({ quality: 82 }).toBuffer();
  return { out, contentType: 'image/jpeg', ext: 'jpg' };
}

function decideArticleTargetExt(mimetype) {
  // Keep GIF as GIF so animations survive. Otherwise convert to JPG (small + widely supported),
  // or preserve PNG/WEBP if you prefer. Change logic to taste.
  if (/gif/i.test(mimetype)) return 'gif';
  if (/png/i.test(mimetype)) return 'png';     // or 'jpg' if you prefer smaller
  if (/webp/i.test(mimetype)) return 'webp';   // or 'jpg'
  return 'jpg';
}

// ---- ARTICLE IMAGE ----
router.post('/article-image', authMiddleware, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded (field name must be "image")' });
    }

    const wantExt = decideArticleTargetExt(req.file.mimetype);
    const { out, contentType, ext } = await processImageTo({ buffer: req.file.buffer, want: wantExt });

    const key = `articles/${Date.now()}-${crypto.randomBytes(6).toString('hex')}.${ext}`;

    const { url } = await putBufferToS3({
      buffer: out,
      key,
      contentType,
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
});

// ---- PROFILE PICTURE ---- (normalize to 256x256 JPG)
router.post('/profile-picture', authMiddleware, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded (field name must be "image")' });
    }

    const avatar = await sharp(req.file.buffer)
      .resize(256, 256, { fit: 'cover' })
      .jpeg({ quality: 84 })
      .toBuffer();

    const key = `avatars/${req.user.id}-${Date.now()}.jpg`;

    const { url } = await putBufferToS3({
      buffer: avatar,
      key,
      contentType: 'image/jpeg',
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
});

module.exports = router;
