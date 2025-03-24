const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Desarrollos = require("../models/Desarrollos");
const Propiedades = require("../models/Propiedades");

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

    // Verificación básica del ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: "ID inválido" });
    }

    try {
        const desarrollo = await Desarrollos.findById(id);
        if (!desarrollo) {
            return res.status(404).json({ error: "Desarrollo no encontrado" });
        }

        // Buscar propiedades relacionadas a este desarrollo
        const propiedades = await Propiedades.find({ desarrolloId: id });

        // Devolver todo junto
        res.json({ desarrollo, propiedades });
    } catch (err) {
        console.error("❌ Error al obtener desarrollo y propiedades:", err);
        res.status(500).json({ error: "Error interno del servidor" });
    }
});




module.exports = router;
