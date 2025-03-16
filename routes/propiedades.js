const express = require("express");
const router = express.Router();
const Propiedades = require("../models/Propiedades");

// GET all propiedades
router.get("/", async (req, res) => {
    try {
        const propiedades = await Propiedades.find();
        res.json(propiedades);
    } catch (error) {
        console.error("❌ Error fetching propiedades:", error);
        res.status(500).json({ error: "Server error" });
    }
});

module.exports = router;
