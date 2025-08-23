// controllers/articles.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Helper: accept blocks as JSON or JSON-string
function normalizeBlocks(blocks) {
  if (blocks && typeof blocks === 'string') {
    try { return JSON.parse(blocks); } catch { /* keep as-is */ }
  }
  return blocks ?? null;
}

// GET all articles
const getAllArticles = async (req, res) => {
  console.log('GET /api/articles query=', req.query);

  try {
    const { category, published } = req.query;

    const where = {};

    // robust boolean parsing from query string (?published=true/false)
    if (typeof published !== 'undefined') {
      where.published = String(published).toLowerCase() === 'true';
    }

    if (category) {
      // If `category` is a STRING column in your Prisma model:
      where.category = { equals: String(category), mode: 'insensitive' };

      // If instead `category` is a Prisma ENUM, comment the line above
      // and use this tiny mapper:
      // const map = { books: 'Books', music: 'Music', blog: 'Blog' };
      // const mapped = map[String(category).toLowerCase()];
      // if (mapped) where.category = mapped;
    }

    const articles = await prisma.article.findMany({
      where, // <-- use `where`, not `filters`
      include: {
        author: { select: { id: true, email: true, profilePicture: true } },
      },
      orderBy: [
        // prefer newest published first if you have this column
        //{ publishedAt: 'desc' },
        { updatedAt: 'desc' },
        { createdAt: 'desc' },
      ],
    });

    res.json(articles);
  } catch (error) {
    console.error('getAllArticles error:', error);
    res.status(500).json({ error: 'Failed to fetch articles', details: error.message });
  }
};


// GET article by ID
const getArticleById = async (req, res) => {
  const { id } = req.params;
  try {
    const article = await prisma.article.findUnique({
      where: { id: Number(id) },
      include: {
        author: { select: { id: true, email: true, profilePicture: true } },
        // If you want comment authors for your Comments component later:
        comments: {
          orderBy: { createdAt: 'asc' },
          include: { user: { select: { id: true, email: true, profilePicture: true } } },
        },
      },
    });

    if (!article) return res.status(404).json({ error: 'Article not found' });
    res.json(article);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch article', details: error.message });
  }
};

// CREATE article
const createArticle = async (req, res) => {
  const { title, category, blocks, published = false } = req.body;
  try {
    const newArticle = await prisma.article.create({
      data: {
        title,
        category,
        blocks: blocks, // ensure JSON shape
        published,
        authorId: req.user?.id ?? null,  // requires auth middleware; otherwise allow null
      },
      include: { author: { select: { id: true, email: true, profilePicture: true } } },
    });
    res.status(201).json(newArticle);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create article', details: error.message });
  }
};

// UPDATE article
const updateArticle = async (req, res) => {
    const { id } = req.params;
    const { title, category, blocks, published } = req.body;
    try {
      const updated = await prisma.article.update({
        where: { id: Number(id) },
        data: {
          ...(title !== undefined && { title }),
          ...(category !== undefined && { category }),
          ...(blocks !== undefined ? { blocks } : {}),
          // optional: if you keep this, you still have ensureOwnerOrAdmin on the route
          ...(published !== undefined && { published, publishedAt: published ? new Date() : null }),
        },
        include: { author: { select: { id: true, email: true, profilePicture: true } } },
      });
      res.json(updated);
    } catch (error) {
      if (error.code === 'P2025') return res.status(404).json({ error: 'Article not found' });
      res.status(500).json({ error: 'Failed to update article', details: error.message });
    }
  };

// PUBLISH / UNPUBLISH article
// controllers/articleController.js (or wherever you defined it)
const togglePublishArticle = async (req, res) => {
  console.log('PUT /articles/%s/publish body=%o user=%o', req.params.id, req.body, { id: req.user?.id, role: req.user?.role });
  const idNum = Number(req.params.id);
  const desired = typeof req.body?.published === 'boolean' ? req.body.published : undefined;

  try {
    const current = await prisma.article.findUnique({
      where: { id: idNum },
      select: { id: true, published: true },
    });
    if (!current) return res.status(404).json({ error: 'Article not found' });

    const next = desired ?? !current.published;

    const article = await prisma.article.update({
      where: { id: idNum },
      data: {
        published: next,
        // comment this line if your schema doesn't have publishedAt yet
        //publishedAt: next ? new Date() : null,
      },
      include: { author: { select: { id: true, email: true, profilePicture: true } } },
    });

    res.json(article);
  } catch (error) {
    if (error.code === 'P2025') return res.status(404).json({ error: 'Article not found' });
    console.error('togglePublishArticle error:', error);
    res.status(500).json({ error: 'Failed to update publishing state', details: error.message });
  }
};


// DELETE article
const deleteArticle = async (req, res) => {
    const { id } = req.params;
    try {
      // If your schema doesn’t cascade, delete children explicitly:
      // await prisma.comment.deleteMany({ where: { articleId: Number(id) } });
  
      await prisma.article.delete({ where: { id: Number(id) } });
      res.status(204).end();
    } catch (error) {
      if (error.code === 'P2025') return res.status(404).json({ error: 'Article not found' });
      res.status(500).json({ error: 'Failed to delete article', details: error.message });
    }
  };

// SEARCH articles (ship-now version: title only for speed/reliability)
const searchArticles = async (req, res) => {
  const { category, published, query } = req.query;
  try {
    const filters = {
      ...(category ? { category } : {}),
      ...(published !== undefined ? { published: published === 'true' } : {}),
      ...(query
        ? { title: { contains: query, mode: 'insensitive' } }
        : {}),
    };

    const articles = await prisma.article.findMany({
      where: filters,
      include: { author: { select: { id: true, email: true, profilePicture: true } } },
      orderBy: { createdAt: 'desc' },
    });

    res.json(articles);
  } catch (error) {
    res.status(500).json({ error: 'Search failed', details: error.message });
  }
};

module.exports = {
  getAllArticles,
  getArticleById,
  createArticle,
  updateArticle,
  togglePublishArticle,
  deleteArticle,
  searchArticles,
};
