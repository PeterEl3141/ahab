// middleware/ownershipMiddleware.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// middleware/ownershipMiddleware.js (quick hardening)
const ensureOwnerOrAdmin = async (req, res, next) => {
  try {
    if (!req.user?.id) return res.status(401).json({ error: 'Unauthorized' });

    const idNum = Number(req.params.id);
    const article = await prisma.article.findUnique({ where: { id: idNum } });
    if (!article) return res.status(404).json({ error: 'Article not found' });

    const isOwner = article.authorId === req.user.id; // ensure both are the same type
    const isAdmin = req.user.role === 'ADMIN';
    if (!isOwner && !isAdmin) return res.status(403).json({ error: 'Forbidden' });

    next();
  } catch (e) {
    console.error('ensureOwnerOrAdmin error:', e);
    res.status(500).json({ error: 'Ownership check failed' });
  }
};


module.exports = { ensureOwnerOrAdmin };

