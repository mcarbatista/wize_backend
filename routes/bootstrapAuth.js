// routes/bootstrapAuth.js
const express = require('express');
const router = express.Router();
const Usuarios = require('../models/Usuarios');

router.post('/bootstrap-register', async (req, res) => {
    try {
        const existingUser = await Usuarios.findOne({});
        if (existingUser) {
            return res.status(400).json({ error: 'A user already exists. Bootstrap is disabled.' });
        }

        const { nombre, email, password, role } = req.body;
        const newUser = new Usuarios({
            nombre,
            email,
            password,
            role: role || 'admin'
        });

        await newUser.save();
        res.status(201).json({ message: 'First user created successfully', user: newUser });
    } catch (err) {
        console.error('Error in bootstrap register:', err);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
