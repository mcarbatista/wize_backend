// checkAuth.js
const jwt = require('jsonwebtoken');
const Usuarios = require('../models/Usuarios');

const JWT_SECRET = process.env.JWT_SECRET || 'somefallbacksecret';

// Check if user has a valid token (logged in)
async function checkAuth(req, res, next) {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(401).json({ error: 'No token provided' });
        }
        const decoded = jwt.verify(token, JWT_SECRET);

        // Optionally, fetch user from DB if needed
        const user = await Usuarios.findById(decoded.id);
        if (!user) return res.status(404).json({ error: 'User not found' });

        // Attach user to request
        req.user = user;
        next();
    } catch (err) {
        console.error('checkAuth error:', err);
        return res.status(401).json({ error: 'Invalid token' });
    }
}

// Optionally check for admin
function checkAdminRole(req, res, next) {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Requires admin role' });
    }
    next();
}

module.exports = { checkAuth, checkAdminRole };
