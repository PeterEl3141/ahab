require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');
const userRoutes = require('./routes/userRoutes')
const articleRoutes = require('./routes/articleRoutes');
const uploadRoutes = require('./routes/uploadRoutes');
const commentRoutes = require('./routes/commentRoutes');
const fs = require('fs');
const path = require('path');

const app = express();
const prisma = new PrismaClient();

const UPLOAD_DIR = process.env.UPLOAD_DIR || path.join(__dirname, 'uploads');
fs.mkdirSync(UPLOAD_DIR, { recursive: true });


// CORS
const allowlist = new Set([
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'https://ahabsdream.com',
  'https://www.ahabsdream.com',
  ...(process.env.CORS_ALLOWLIST ? process.env.CORS_ALLOWLIST.split(',').map(s => s.trim()) : [])
]);

const isAllowed = (origin) => {
  if (!origin) return true; // SSR, Postman, curl
  if (allowlist.has(origin)) return true;

  // Allow any Vercel preview domain: https://<anything>.vercel.app
  try {
    const { hostname } = new URL(origin);
    if (hostname.endsWith('.vercel.app')) return true;
  } catch { /* ignore bad origin */ }

  return false;
};

app.use(cors({
  origin: (origin, cb) => isAllowed(origin) ? cb(null, true) : cb(new Error('Not allowed by CORS')),
  credentials: true,
  methods: ['GET','POST','PUT','PATCH','DELETE','OPTIONS'],
  allowedHeaders: ['Content-Type','Authorization'],
  optionsSuccessStatus: 204,
}));

app.use(express.json());



//serve routes
app.use('/uploads', express.static(UPLOAD_DIR));


//API routes 
app.use('/api/users', userRoutes);
app.use('/api/articles', articleRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/comments', commentRoutes);

// Basic test route
app.get('/', (req, res) => {
  res.send('API is running...');
});


app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something broke!' });
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`🚀 Backend running at http://localhost:${PORT}`);
});
