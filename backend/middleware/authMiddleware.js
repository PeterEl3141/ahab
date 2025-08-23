const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const authMiddleware = async (req, res, next) => {
    const authHeader = req.headers.authorization;

    if(!authHeader || !authHeader.startsWith('Bearer')){
        return res.status(401).json({message: 'No token provided. Access denied'})
    };

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await prisma.user.findUnique({
            where: { id: decoded.id },
            select: { id: true, email: true, role: true, profilePicture: true }, // <- SAFE
          });

        if(!user) return res.status(401).json({message: 'User not found'});

        req.user = user;
        console.log("Authenticated user:", user);
        next();
    } catch (error) {
        console.error('JWT error:', error);
        res.status(401).json({ message: 'Invalid or expired token.' });
    }
}

module.exports = {authMiddleware};