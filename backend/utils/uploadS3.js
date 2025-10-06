// utils/uploadS3.js
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');

const S3_BUCKET   = process.env.S3_BUCKET;
const AWS_REGION  = process.env.AWS_REGION || process.env.AWS_DEFAULT_REGION || 'us-east-1';

if (!S3_BUCKET) {
  console.warn('[uploadS3] S3_BUCKET is not set. Uploads will fail until set.');
}

const s3 = new S3Client({
  region: AWS_REGION,
  credentials: (process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY)
    ? {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      }
    : undefined,
});

/**
 * Upload a Buffer to S3 and return its public URL.
 * @param {Object} opts
 * @param {Buffer} opts.buffer
 * @param {String} opts.key   - e.g. "uploads/175588....webp"
 * @param {String} opts.contentType - e.g. "image/webp"
 * @param {String} [opts.cacheControl]
 * @param {String} [opts.acl] - usually 'public-read'
 */
async function uploadBufferToS3({ buffer, key, contentType, cacheControl = 'public, max-age=31536000, immutable', acl = 'public-read' }) {
  if (!S3_BUCKET) throw new Error('S3_BUCKET env not set');
  const cmd = new PutObjectCommand({
    Bucket: S3_BUCKET,
    Key: key,
    Body: buffer,
    ContentType: contentType,
    CacheControl: cacheControl,
  });
  await s3.send(cmd);
  return getPublicUrl(key);
}

function getPublicUrl(key) {
  return `https://${S3_BUCKET}.s3.${AWS_REGION}.amazonaws.com/${key}`;
}

module.exports = {
  uploadBufferToS3,
  getPublicUrl,
};
