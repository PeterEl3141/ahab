const ensureAdmin = async (req, res, next) => {
    if (!req.user?.id) return res.status(401).json({ error: 'Unauthorized' });
    if (req.user.role !== 'ADMIN') return res.status(403).json({ error: 'Admin only' });
    next();
  };



  module.exports = {ensureAdmin};
  