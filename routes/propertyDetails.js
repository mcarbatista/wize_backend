const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Propiedades = require("../models/Propiedades");

// ✅ GET a single property by ID
router.get("/:id", async (req, res) => {
    try {
        const { id } = req.params; // ✅ Extract id from the request parameters
        console.log("📢 Fetching property with ID:", id);

        // ✅ Ensure ID is valid before querying MongoDB
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "ID inválido" });
        }

        const propiedad = await Propiedades.findById(id); // ✅ Use findById

        if (!propiedad) return res.status(404).json({ message: "Propiedad no encontrada" });

        res.json(propiedad);
    } catch (error) {
        console.error("❌ Error fetching propiedades:", error);
        res.status(500).json({ error: "Server error" });
    }
});

module.exports = router;
