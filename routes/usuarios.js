const express = require("express");
const router = express.Router();
const Usuarios = require("../models/Usuarios");

// GET all usuarios
router.get("/", async (req, res) => {
    try {
        const usuarios = await Usuarios.find({});
        res.json(usuarios);
    } catch (error) {
        console.error("❌ Error fetching usuarios:", error);
        res.status(500).json({ error: error.message || "Server error" });
    }
});

module.exports = router;
