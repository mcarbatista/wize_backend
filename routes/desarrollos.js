const express = require("express");
const router = express.Router();
const mongoose = require("mongoose"); // ✅ IMPORT NECESARIO
const cloudinary = require("cloudinary").v2;
const multer = require("multer");
const streamifier = require("streamifier");
const Desarrollos = require("../models/Desarrollos");
const Propiedad = require("../models/Propiedades");

// ✅ Multer setup
const storage = multer.memoryStorage();
const upload = multer({ storage });

// ✅ Cloudinary config
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// ✅ Ruta de prueba
router.get("/test", (req, res) => {
    res.send("✅ Ruta de desarrollos funciona");
});

// ✅ GET todos los desarrollos
router.get("/", async (req, res) => {
    try {
        const desarrollos = await Desarrollos.find({});
        res.json(desarrollos);
    } catch (error) {
        console.error("❌ Error fetching desarrollos:", error);
        res.status(500).json({ error: error.message || "Server error" });
    }
});

// ✅ GET desarrollo por ID + propiedades asociadas
router.get("/:id", async (req, res) => {
    try {
        const id = req.params.id;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ error: "ID inválido" });
        }

        const desarrollo = await Desarrollos.findById(id);
        if (!desarrollo) {
            return res.status(404).json({ error: "Desarrollo no encontrado" });
        }

        const propiedades = await Propiedad.find({ DesarrolloId: id });

        res.json({ desarrollo, propiedades });
    } catch (err) {
        console.error("❌ Error al obtener desarrollo:", err.message, err.stack);
        res.status(500).json({ error: "Error interno del servidor" });
    }
});

// ✅ POST nuevo desarrollo
router.post("/", async (req, res) => {
    try {
        console.log("📥 Payload recibido:", req.body);

        const nuevoDesarrollo = new Desarrollos(req.body);
        const saved = await nuevoDesarrollo.save();

        res.status(201).json(saved);
    } catch (err) {
        console.error("❌ Error al crear desarrollo:", err.message, err.stack);
        res.status(500).json({ error: "Error al crear desarrollo", details: err.message });
    }
});

// ✅ PUT actualizar desarrollo
router.put("/:id", async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: "ID inválido" });
    }

    try {
        const actualizado = await Desarrollos.findByIdAndUpdate(id, req.body, { new: true });
        if (!actualizado) {
            return res.status(404).json({ error: "Desarrollo no encontrado" });
        }
        res.json(actualizado);
    } catch (err) {
        console.error("❌ Error al actualizar desarrollo:", err.message, err.stack);
        res.status(500).json({ error: err.message });
    }
});

// ✅ DELETE desarrollo
router.delete("/:id", async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: "ID inválido" });
    }

    try {
        const eliminado = await Desarrollos.findByIdAndDelete(id);
        if (!eliminado) {
            return res.status(404).json({ error: "Desarrollo no encontrado" });
        }
        res.json({ message: "Desarrollo eliminado correctamente" });
    } catch (err) {
        console.error("❌ Error al eliminar desarrollo:", err.message, err.stack);
        res.status(500).json({ error: err.message });
    }
});

// ✅ PUT setear imagen principal
router.put("/:id/imagen-principal", async (req, res) => {
    const { url } = req.body;

    try {
        const desarrollo = await Desarrollos.findById(req.params.id);
        if (!desarrollo) return res.status(404).json({ error: "Desarrollo no encontrado" });

        desarrollo.Imagen = url;
        await desarrollo.save();
        res.json({ success: true, imagen: desarrollo.Imagen });
    } catch (err) {
        console.error("❌ Error al setear imagen principal:", err.message, err.stack);
        res.status(500).json({ error: "No se pudo actualizar imagen principal" });
    }
});

module.exports = router;
