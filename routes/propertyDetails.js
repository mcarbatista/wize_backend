const express = require("express");
const router = express.Router();
const Propiedades = require("../models/Propiedades");

// GET una propiedad
router.get("/:id", async (req, res) => {
    try {
        const propiedades = await Propiedades.findOne({ _id: id });
        console.log("🆔 Searching for property with ID:", id); // Debugging
        if (!propiedades) return res.status(404).json({ message: "Propiedad no encontrada" });
        res.json(propiedades);
    } catch (error) {
        console.error("❌ Error fetching propiedades:", error);
        res.status(500).json({ error: error.message || "Server error" });
    }
});


module.exports = router;