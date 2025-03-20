const express = require("express");
const router = express.Router();
const Desarrollos = require("../models/Desarrollos");

// GET un Desarrollo
router.get("/api/desarrollos/:id", async (req, res) => {
    try {
        const desarrollo = await Desarrollos.findById(req.params.id);
        if (!desarrollo) return res.status(404).json({ message: "Desarrollo no encontrado" });
        res.json(desarrollo);
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ message: "Error interno del servidor" });
    }
});


module.exports = router;
