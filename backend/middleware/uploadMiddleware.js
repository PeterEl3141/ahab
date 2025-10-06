// utils/uploadMiddleware.js (or routes/middleware/uploadMiddleware.js)
const fs = require('fs');
const path = require('path');
const multer = require('multer');

// Use a single source of truth for where files are stored.
// In production (Railway), set: UPLOAD_DIR=/data/uploads (with a Volume mounted there)
const UPLOAD_DIR = process.env.UPLOAD_DIR || path.join(__dirname, '..', 'uploads');

// Ensure the directory exists at boot
fs.mkdirSync(UPLOAD_DIR, { recursive: true });

// Configure storage
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, UPLOAD_DIR),
  filename: (_req, file, cb) => {
    // Keep original name but prefix a timestamp to avoid collisions
    // (Optionally you could sanitize file.originalname here)
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
  },
});

// Filter for image-only uploads (checks BOTH mimetype and extension)
const fileFilter = (_req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();
  const allowedExt = /\.(jpe?g|png|gif|webp|avif)$/i.test(ext);
  const allowedMime = /^image\//i.test(file.mimetype);

  if (allowedExt && allowedMime) return cb(null, true);
  return cb(new Error('Only image files are allowed!'), false);
};

// If you want to add size limits later, you can uncomment this and set UPLOAD_MAX_MB
// const limits = process.env.UPLOAD_MAX_MB
//   ? { fileSize: Number(process.env.UPLOAD_MAX_MB) * 1024 * 1024 }
//   : undefined;

const upload = multer({ storage, fileFilter /*, limits*/ });

module.exports = upload;
