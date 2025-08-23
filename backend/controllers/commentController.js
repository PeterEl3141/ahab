const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const getAllComments = async (req, res) => {
    const { articleId } = req.params;
  
    try {
      const comments = await prisma.comment.findMany({
        where: { articleId: Number(articleId) },
        include: {
          user: {
            select: { id: true, email: true }
          },
          parent: true,
          children: true
        },
        orderBy: { createdAt: 'asc' }
      });
  
      // Recalculate likes/dislikes per comment
      const commentsWithReactions = await Promise.all(
        comments.map(async (comment) => {
          const [likes, dislikes] = await Promise.all([
            prisma.commentReaction.count({
              where: {
                commentId: comment.id,
                type: 'LIKE'
              }
            }),
            prisma.commentReaction.count({
              where: {
                commentId: comment.id,
                type: 'DISLIKE'
              }
            })
          ]);
  
          return {
            ...comment,
            likes,
            dislikes
          };
        })
      );
  
      res.json(commentsWithReactions);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch comments', details: error.message });
    }
  };
  


const createComment = async (req, res) => {
    const { content, articleId, parentId } = req.body;
  
    try {
      const newComment = await prisma.comment.create({
        data: {
          content,
          articleId: Number(articleId),
          userId: req.user.id,
          parentId: parentId ? Number(parentId) : null,
        },
        include: {
          user: { select: { id: true, email: true } },
          parent: true,
          children: true,
        },
      });
  
      res.status(201).json(newComment);
    } catch (error) {
      res.status(500).json({ error: 'Failed to create comment', details: error.message });
    }
  };

  

  const updateComment = async (req, res) => {
    const { id } = req.params;
    const { content } = req.body;
  
    try {
      const updatedComment = await prisma.comment.update({
        where: { id: Number(id) },
        data: { content },
        include: {
          user: {
            select: {
              id: true,
              email: true,
            },
          },
          children: true,
        },
      });
  
      res.json(updatedComment);
    } catch (error) {
      res
        .status(500)
        .json({ error: 'Failed to update comment', details: error.message });
    }
  };
  



  const likeComment = async (req, res) => {
    const { id } = req.params;
  
    try {
      const updated = await prisma.comment.update({
        where: { id: Number(id) },
        data: {
          likes: {
            increment: 1,
          },
        },
      });
  
      res.json(updated);
    } catch (error) {
      res
        .status(500)
        .json({ error: 'Failed to like comment', details: error.message });
    }
  };

  const dislikeComment = async (req, res) => {
    const { id } = req.params;
  
    try {
      const updated = await prisma.comment.update({
        where: { id: Number(id) },
        data: {
          dislikes: {
            increment: 1,
          },
        },
      });
  
      res.json(updated);
    } catch (error) {
      res
        .status(500)
        .json({ error: 'Failed to dislike comment', details: error.message });
    }
  };
  
  const toggleReaction = async (req, res) => {
    const { commentId, type } = req.body; // type should be 'LIKE' or 'DISLIKE'
    const userId = req.user.id;
  
    try {
      // Check for an existing reaction from this user to this comment
      const existing = await prisma.commentReaction.findUnique({
        where: {
          userId_commentId: {
            userId,
            commentId: Number(commentId)
          }
        }
      });
  
      if (existing) {
        if (existing.type === type) {
          // User clicked same reaction → remove it (toggle off)
          await prisma.commentReaction.delete({
            where: {
              userId_commentId: {
                userId,
                commentId: Number(commentId)
              }
            }
          });
          return res.json({ message: `${type} removed` });
        } else {
          // Switch reaction type
          const updated = await prisma.commentReaction.update({
            where: {
              userId_commentId: {
                userId,
                commentId: Number(commentId)
              }
            },
            data: { type }
          });
          return res.json({ message: `Reaction switched to ${type}`, updated });
        }
      } else {
        // No reaction yet → create one
        const created = await prisma.commentReaction.create({
          data: {
            userId,
            commentId: Number(commentId),
            type
          }
        });
        return res.status(201).json({ message: `${type} added`, created });
      }
  
    } catch (error) {
      res.status(500).json({ error: 'Failed to toggle reaction', details: error.message });
    }
  };
  

  async function collectDescendantIds(rootId) {
    const toVisit = [rootId];
    const all = new Set([rootId]);
  
    while (toVisit.length) {
      const children = await prisma.comment.findMany({
        where: { parentId: { in: toVisit } },
        select: { id: true },
      });
      toVisit.length = 0;
      for (const { id } of children) {
        if (!all.has(id)) {
          all.add(id);
          toVisit.push(id);
        }
      }
    }
    return [...all];
  }
  
 const deleteComment = async (req, res) => {
    try {
      const idNum = Number(req.params.id);
      const ids = await collectDescendantIds(idNum);
      await prisma.comment.deleteMany({ where: { id: { in: ids } } });
      return res.status(204).end();
    } catch (error) {
      console.error('deleteComment error', error);
      if (error.code === 'P2025') return res.status(404).json({ error: 'Comment not found' });
      return res.status(500).json({ error: 'Failed to delete comment', details: error.message });
    }
  };

  
  module.exports = {
    getAllComments,
    createComment,
    updateComment,
    deleteComment,
    likeComment,
    dislikeComment,
    toggleReaction
  }