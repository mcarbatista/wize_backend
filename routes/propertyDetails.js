const express = require("express");
const router = express.Router();
const Desarrollos = require("../models/Propiedades");

// GET una propiedad
router.get("/api/propiedades/:id", async (req, res) => {
    try {
        const property = await Property.findById(req.params.id);
        if (!property) return res.status(404).json({ message: "Propiedad no encontrada" });
        res.json(property);
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ message: "Error interno del servidor" });
    }
});


module.exports = router;
