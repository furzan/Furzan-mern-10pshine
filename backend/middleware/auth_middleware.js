const jwt = require('jsonwebtoken');
const db = require('../models');

const verifyToken = async (req, res, next) => {
    try {
        const authHeader = req.headers['authorization'];
        
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ message: "Access denied. No token provided." });
        }

        const token = authHeader.split(' ')[1];

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await db.User.findByPk(decoded.id, {
            attributes: ['id','token'] 
        });

        if (!user) {
            return res.status(401).json({ message: "User no longer exists." });
        }

        if (user.token !== token) {
            return res.status(401).json({ message: "Session expired. Please login again." });
        }

        req.user = user; 
        next();

    } catch (error) {
        console.error("JWT Verification Error:", error.message);
        
        const message = error.name === 'TokenExpiredError' ? "Token expired" : "Invalid token";
        return res.status(401).json({ message });
    }
};

module.exports = { verifyToken };