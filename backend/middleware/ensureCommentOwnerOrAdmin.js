// middleware/ensureCommentOwnerOrAdmin.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const ensureCommentOwnerOrAdmin = async (req, res, next) => {
  try {
    if (!req.user?.id) return res.status(401).json({ error: 'Unauthorized' });
    const idNum = Number(req.params.id);

    const comment = await prisma.comment.findUnique({
      where: { id: idNum },
      select: { authorId: true },
    });
    if (!comment) return res.status(404).json({ error: 'Comment not found' });

    const userId = typeof req.user.id === 'string' ? Number(req.user.id) : req.user.id;
    const isOwner = comment.authorId === userId;
    const isAdmin = req.user.role === 'ADMIN';

    if (!isOwner && !isAdmin) return res.status(403).json({ error: 'Forbidden' });
    next();
  } catch (e) {
    console.error('ensureCommentOwnerOrAdmin error', e);
    res.status(500).json({ error: 'Ownership check failed' });
  }
};

module.exports = {ensureCommentOwnerOrAdmin}