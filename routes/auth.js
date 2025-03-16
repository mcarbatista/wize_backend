const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const { body, validationResult } = require('express-validator');

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log("🔍 Login Attempt:", { email, password });

        const user = await User.findOne({ email });

        if (!user) {
            console.log("❌ User not found");
            return res.status(401).json({ error: "Invalid User" });
        }

        console.log("✅ User Found:", user);

        const isMatch = await bcrypt.compare(password, user.password);
        console.log("🔍 Password Match:", isMatch);

        if (!isMatch) {
            console.log("❌ Password does not match");
            return res.status(401).json({ error: "Invalid Password" });
        }

    } catch (error) {
        console.error("❌ Login Error:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

module.exports = router;