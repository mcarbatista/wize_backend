const express = require("express");
const router = express.Router();
const Desarrollos = require("../models/Desarrollos");
const Propiedad = require("../models/Propiedad");

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

router.get("/:id/propiedades", async (req, res) => {
    try {
        const propiedades = await Propiedad.find({ desarrollo: req.params.id });
        res.json(propiedades);
    } catch (err) {
        res.status(500).json({ error: "Error al obtener propiedades." });
    }
});




module.exports = router;
