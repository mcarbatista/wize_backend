// routes/admin.js
const express = require("express");
const router = express.Router();
const Desarrollos = require("../models/Desarrollos");
const Propiedades = require("../models/Propiedades");

// Example middlewares for token validation and admin role checks
// Adjust these imports to match your actual middleware file names
const { checkAuth, checkAdminRole } = require("../middleware/checkAuth");

// GET /api/admin
// A simple endpoint to confirm the admin route is working
router.get("/", checkAuth, checkAdminRole, (req, res) => {
    res.json({ message: "Welcome to the Admin API" });
});

// GET /api/admin/desarrollos
// Returns all desarrollos (admin only)
router.get("/desarrollos", checkAuth, checkAdminRole, async (req, res) => {
    try {
        const desarrollos = await Desarrollos.find({});
        res.json(desarrollos);
    } catch (err) {
        console.error("Error fetching desarrollos:", err);
        res.status(500).json({ error: "Server error" });
    }
});

// GET /api/admin/propiedades
// Returns all propiedades (admin only)
router.get("/propiedades", checkAuth, checkAdminRole, async (req, res) => {
    try {
        const propiedades = await Propiedades.find({});
        res.json(propiedades);
    } catch (err) {
        console.error("Error fetching propiedades:", err);
        res.status(500).json({ error: "Server error" });
    }
});

module.exports = router;
