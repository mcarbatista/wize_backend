const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Usuarios = require('../models/Usuarios');

const JWT_SECRET = process.env.JWT_SECRET || 'somefallbacksecret';

// Example checkAdmin middleware verifies JWT and that user is an admin
async function checkAdmin(req, res, next) {
    try {
        // Expect Authorization: Bearer <token>
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(401).json({ error: 'No token provided' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback');
        const user = await Usuarios.findById(decoded.id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        if (user.role !== 'admin') {
            return res.status(403).json({ error: 'Only admins can create new users' });
        }

        req.user = user;
        next();
    } catch (err) {
        console.error('Error in checkAdmin:', err);
        return res.status(401).json({ error: 'Invalid or expired token' });
    }
}

// POST /api/auth/register
router.post('/register', checkAdmin, async (req, res) => {
    try {
        const { nombre, email, password, role } = req.body;

        // Check if user already exists
        const existingUser = await Usuarios.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: 'Email already in use' });
        }

        // Create and save the new user
        const newUser = new Usuarios({ nombre, email, password, role });
        await newUser.save();

        res.status(201).json({ message: 'User created successfully' });
    } catch (err) {
        console.error('Error in register:', err);
        res.status(500).json({ error: 'Server error' });
    }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find user
        const user = await Usuarios.findOne({ email });
        if (!user) {
            return res.status(400).json({ error: 'Invalid credentials' });
        }

        // Compare passwords
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ error: 'Invalid credentials' });
        }

        // Generate a token
        const token = jwt.sign(
            { id: user._id, role: user.role },
            JWT_SECRET,
            { expiresIn: '7d' } // token valid for 1 day
        );

        // Return token + optional user info
        res.json({
            message: 'Login successful',
            token,
            user: {
                nombre: user.nombre,
                email: user.email,
                role: user.role
            }
        });
    } catch (err) {
        console.error('Error in login:', err);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
