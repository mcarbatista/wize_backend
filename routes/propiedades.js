
const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Propiedad = require("../models/Propiedades");
const Desarrollos = require("../models/Desarrollos");

// ✅ GET todas las propiedades con info de desarrollo
router.get("/", async (req, res) => {
    try {
        const propiedades = await Propiedad.find().populate("DesarrolloId");
        res.json(propiedades);
    } catch (error) {
        console.error("❌ Error al obtener propiedades:", error);
        res.status(500).json({ error: "Error al obtener propiedades" });
    }
});

// ✅ GET una propiedad por ID
router.get("/:id", async (req, res) => {
    try {
        const prop = await Propiedad.findById(req.params.id).populate("DesarrolloId");
        if (!prop) return res.status(404).json({ error: "Propiedad no encontrada" });
        res.json(prop);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ✅ GET propiedades de un desarrollo
router.get("/desarrollos/:id", async (req, res) => {
    try {
        const props = await Propiedad.find({ DesarrolloId: req.params.id });
        res.json(props);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ✅ POST: crear nueva propiedad
router.post("/", async (req, res) => {
    try {
        const {
            Titulo, Precio, Dormitorios, Banos, Tamano_m2, DesarrolloId, Galeria, Plano
        } = req.body;

        if (!Titulo || !Precio || !Dormitorios || !Banos || !Tamano_m2 || !DesarrolloId) {
            return res.status(400).json({ error: "Faltan campos requeridos" });
        }

        const precioNum = Number(Precio);
        const tamanoNum = Number(Tamano_m2);

        if (isNaN(precioNum) || isNaN(tamanoNum)) {
            return res.status(400).json({ error: "Precio y Tamaño deben ser números válidos" });
        }

        const desarrollo = await Desarrollos.findById(DesarrolloId);
        if (!desarrollo) {
            return res.status(404).json({ error: "Desarrollo no encontrado" });
        }

        req.body.Resumen = desarrollo.Resumen;
        req.body.Descripcion = desarrollo.Descripcion;
        req.body.Ciudad = desarrollo.Ciudad;
        req.body.Barrio = desarrollo.Barrio;
        req.body.Ubicacion = desarrollo.Ubicacion;
        req.body.Estado = desarrollo.Estado;
        req.body.Entrega = desarrollo.Entrega;
        req.body.Forma_de_Pago = desarrollo.Forma_de_Pago;
        req.body.Gastos_Ocupacion = desarrollo.Gastos_Ocupacion;

        req.body.Precio = precioNum;
        req.body.Tamano_m2 = tamanoNum;
        req.body.Precio_Con_Formato = precioNum.toLocaleString("es-ES");

        if (Galeria && Galeria.length > 0) {
            req.body.Galeria = Galeria.map((img, index) => ({
                url: img.url,
                alt: img.alt || "",
                description: img.description || "",
                position: index,
            }));
        }

        if (Plano && Plano.length > 0) {
            req.body.Plano = Plano.map((img, index) => ({
                url: img.url,
                alt: img.alt || "",
                description: img.description || "",
                position: index,
            }));
        }

        const nuevaPropiedad = new Propiedad(req.body);
        await nuevaPropiedad.save();

        res.status(201).json(nuevaPropiedad);
    } catch (err) {
        console.error("❌ Error al crear propiedad:", err);
        res.status(500).json({ error: err.message || "Error al crear propiedad" });
    }
});

// ✅ PUT: actualizar propiedad existente
router.put("/:id", async (req, res) => {
    try {
        const {
            Precio,
            Tamano_m2,
            DesarrolloId,
            Galeria,
            Plano
        } = req.body;

        const precioNum = Number(Precio);
        const tamanoNum = Number(Tamano_m2);

        if (isNaN(precioNum) || isNaN(tamanoNum)) {
            return res.status(400).json({ error: "Precio y Tamaño deben ser números válidos" });
        }

        if (DesarrolloId) {
            const desarrollo = await Desarrollos.findById(DesarrolloId);
            if (!desarrollo) {
                return res.status(404).json({ error: "Desarrollo no encontrado" });
            }

            req.body.Resumen = desarrollo.Resumen;
            req.body.Descripcion = desarrollo.Descripcion;
            req.body.Ciudad = desarrollo.Ciudad;
            req.body.Barrio = desarrollo.Barrio;
            req.body.Ubicacion = desarrollo.Ubicacion;
        }

        req.body.Precio = precioNum;
        req.body.Tamano_m2 = tamanoNum;
        req.body.Precio_Con_Formato = precioNum.toLocaleString("es-ES");

        if (Galeria && Galeria.length > 0) {
            req.body.Galeria = Galeria.map((img, index) => ({
                url: img.url,
                alt: img.alt || "",
                description: img.description || "",
                position: index,
            }));
        }

        if (Plano && Plano.length > 0) {
            req.body.Plano = Plano.map((img, index) => ({
                url: img.url,
                alt: img.alt || "",
                description: img.description || "",
                position: index,
            }));
        }

        const updated = await Propiedad.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updated) return res.status(404).json({ error: "Propiedad no encontrada" });

        res.json(updated);
    } catch (err) {
        console.error("❌ Error al actualizar propiedad:", err);
        res.status(500).json({ error: err.message });
    }
});

// ✅ DELETE
router.delete("/:id", async (req, res) => {
    try {
        const deleted = await Propiedad.findByIdAndDelete(req.params.id);
        if (!deleted) return res.status(404).json({ error: "Propiedad no encontrada" });
        res.json({ message: "Propiedad eliminada correctamente" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;