const express = require("express");
const router = express.Router();
const Desarrollos = require("../models/Desarrollos");
const mongoose = require("mongoose");

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

router.get("/:id", async (req, res) => {
    const { id } = req.params;

    // Verificamos si el ID es válido (evita crash si no es ObjectId)
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: "ID inválido" });
    }

    try {
        const desarrollo = await Desarrollos.findById(id);
        if (!desarrollo) {
            return res.status(404).json({ error: "Desarrollo no encontrado" });
        }
        res.json(desarrollo);
    } catch (err) {
        console.error("❌ Error al obtener desarrollo:", err);
        res.status(500).json({ error: "Error interno del servidor" });
    }
});



module.exports = router;
