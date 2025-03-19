const express = require("express");
const router = express.Router();
const Desarrollos = require("../models/Desarrollos");

// GET all desarrollos
router.get("/", async (req, res) => {
    try {
        const desarrollos = await Desarrollos.find({});
        res.json(desarrollos);
    } catch (error) {
        console.error("❌ Error fetching desarrollos:", error);
        res.status(500).json({ error: error.message || "Server error" });
    }
});

module.exports = router;
