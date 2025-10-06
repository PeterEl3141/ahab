// utils/uploadS3.js
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const multer = require('multer');
const path = require('path');
const crypto = require('crypto');

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  // On Railway, AWS creds come from env automatically; explicit is fine too:
  credentials: process.env.AWS_ACCESS_KEY_ID ? {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  } : undefined,
});

// Use memory storage; we’ll upload the buffer to S3
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB cap (tweak)
  fileFilter: (req, file, cb) => {
    const ok = /jpeg|jpg|png|gif|webp/i.test(path.extname(file.originalname));
    ok ? cb(null, true) : cb(new Error('Only image files are allowed'), false);
  }
});

function makeKey(file, folder = 'uploads') {
  const ext = path.extname(file.originalname).toLowerCase();
  const base = path.basename(file.originalname, ext)
    .replace(/[^a-z0-9\-_.]/gi, '_');
  const hash = crypto.randomBytes(6).toString('hex');
  return `${folder}/${Date.now()}-${base}-${hash}${ext}`;
}

function publicUrlForKey(key) {
  // Prefer CDN if provided; else native S3 URL
  const base =
    process.env.PUBLIC_CDN_URL ||
    `https://${process.env.S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com`;
  return `${base}/${key}`;
}

async function uploadBufferToS3({ buffer, contentType, key }) {
  await s3.send(new PutObjectCommand({
    Bucket: process.env.S3_BUCKET_NAME,
    Key: key,
    Body: buffer,
    ContentType: contentType,
    // If your bucket is public: keep this; if using CloudFront OAC: remove it.
    ACL: 'public-read',
    CacheControl: 'public, max-age=31536000, immutable',
  }));
  return publicUrlForKey(key);
}

module.exports = { upload, uploadBufferToS3, makeKey, publicUrlForKey };
