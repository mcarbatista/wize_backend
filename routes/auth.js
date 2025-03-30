// routes/auth.js

const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Usuarios = require('../models/Usuarios');

// Use the same secret everywhere
const JWT_SECRET = process.env.JWT_SECRET || 'somefallbacksecret';

// Middleware: Verify token & check user is admin
async function checkAdmin(req, res, next) {
    try {

        const bcrypt = require('bcryptjs');
        const testPassword = 'tomaswize2025';
        const testHash = '$2b$08$Zsw2BEF2BDOs8w4KLCAmy.Bj/TSf24MXMucEfbymzlFuYDTqdu5.K';
        bcrypt.compare(testPassword, testHash).then(console.log).catch(console.error);

        // Expect Authorization: Bearer <token>
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return res.status(401).json({ error: 'No token provided' });
        }

        const token = authHeader.split(' ')[1];
        if (!token) {
            return res.status(401).json({ error: 'No token provided' });
        }

        // Verify token with the same JWT_SECRET
        const decoded = jwt.verify(token, JWT_SECRET);

        // Check user existence in DB
        const user = await Usuarios.findById(decoded.id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Check user role
        if (user.role !== 'admin') {
            return res.status(403).json({ error: 'Only admins can create new users' });
        }

        // Attach user to req for next middleware/route
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
        let { nombre, email, password, phone, role } = req.body;
        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required' });
        }

        // Normalize inputs
        email = email.toLowerCase().trim();
        password = password.trim();

        // Check if user already exists
        const existingUser = await Usuarios.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: 'Email already in use' });
        }

        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        console.log("Register - Hashed password:", hashedPassword);

        // Create and save the new user
        const newUser = new Usuarios({
            nombre,
            email,
            phone,
            password: hashedPassword,
            role
        });
        await newUser.save();

        return res.status(201).json({ message: 'User created successfully' });
    } catch (err) {
        console.error('Error in register:', err);
        return res.status(500).json({ error: 'Server error' });
    }
});


// POST /api/auth/login
router.post('/login', async (req, res) => {
    try {
        let { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required' });
        }

        // Normalize inputs
        email = email.toLowerCase().trim();
        password = password.trim();

        // Find user
        const user = await Usuarios.findOne({ email });
        if (!user) {
            console.log("Login - No user found for:", email);
            return res.status(400).json({ error: 'Invalid credentials' });
        }

        // Debug: log stored hashed password
        console.log("Login - Stored hash:", user.password);

        // Compare passwords
        const isMatch = await bcrypt.compare(password, user.password);
        console.log("Login - Bcrypt compare result:", isMatch);
        if (!isMatch) {
            return res.status(400).json({ error: 'Invalid credentials' });
        }

        // Generate token
        const token = jwt.sign(
            { id: user._id, role: user.role },
            JWT_SECRET,
            { expiresIn: '7d' }
        );

        return res.json({
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
        return res.status(500).json({ error: 'Server error' });
    }
});



// GET /api/usuarios - Fetch all usuarios (protected; only admin)
router.get('/usuarios', checkAdmin, async (req, res) => {
    try {
        const usuarios = await Usuarios.find({});
        return res.json(usuarios);
    } catch (err) {
        console.error("Error fetching usuarios:", err);
        return res.status(500).json({ error: "Server error" });
    }
});

// GET /api/auth/logout
router.get('/logout', (req, res) => {
    // Since we're using JWT for authentication,
    // logging out is handled on the client by removing the token.
    return res.json({ message: 'Logout successful' });
});

// POST /api/auth/change-password
router.post('/change-password', async (req, res) => {
    try {
        // Expect Authorization: Bearer <token>
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return res.status(401).json({ error: 'No token provided' });
        }
        const token = authHeader.split(' ')[1];
        if (!token) {
            return res.status(401).json({ error: 'No token provided' });
        }

        const decoded = jwt.verify(token, JWT_SECRET);
        const user = await Usuarios.findById(decoded.id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const { currentPassword, newPassword } = req.body;
        if (!currentPassword || !newPassword) {
            return res.status(400).json({ error: 'Current password and new password are required' });
        }

        // Validate the current password
        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
            return res.status(400).json({ error: 'Current password is incorrect' });
        }

        // Hash the new password and update the user
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);
        user.password = hashedPassword;
        await user.save();

        return res.json({ message: 'Password updated successfully' });
    } catch (err) {
        console.error('Error in change-password:', err);
        return res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
