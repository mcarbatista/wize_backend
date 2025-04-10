const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Propiedad = require("../models/Propiedades");
const Desarrollos = require("../models/Desarrollos");
const { checkAuth, checkAdminRole } = require('../middleware/checkAuth');

// GET todas las propiedades
router.get("/", async (req, res) => {
    try {
        const propiedades = await Propiedad.find().populate("DesarrolloId");
        res.json(propiedades);
    } catch (error) {
        console.error("❌ Error al obtener propiedades:", error);
        res.status(500).json({ error: "Error al obtener propiedades" });
    }
});

// GET una propiedad por ID
router.get("/:id", async (req, res) => {
    try {
        const prop = await Propiedad.findById(req.params.id).populate("DesarrolloId");
        if (!prop) return res.status(404).json({ error: "Propiedad no encontrada" });
        res.json(prop);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET propiedades de un desarrollo
router.get("/desarrollos/:id", async (req, res) => {
    try {
        const props = await Propiedad.find({ DesarrolloId: req.params.id });
        res.json(props);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST: crear nueva propiedad (extendido para flujo “no desarrollo”)
router.post("/", checkAuth, checkAdminRole, async (req, res) => {
    try {
        const {
            Titulo,
            Precio,
            Dormitorios,
            Banos,
            Tamano_m2,
            DesarrolloId,
            Galeria,
            Plano,
            // manual-only fields:
            Estado,
            Tipo,
            Entrega,
            Forma_de_Pago,
            Gastos_Ocupacion,
            Ciudad,
            Barrio,
            Ubicacion,
            Mapa,
            Resumen,
            Descripcion,
            Descripcion_Expandir,
            Owner,
            Email,
            Celular,
            Imagen
        } = req.body;

        // Basic required fields for both flows
        if (!Titulo || !Precio || !Dormitorios || !Banos || !Tamano_m2 || !Owner) {
            return res.status(400).json({ error: "Faltan campos requeridos básicos" });
        }

        // Validate numbers
        const precioNum = Number(Precio);
        const tamanoNum = Number(Tamano_m2);
        if (!Number.isInteger(precioNum) || !Number.isInteger(tamanoNum)) {
            return res.status(400).json({ error: "Precio y Tamaño deben ser enteros válidos" });
        }

        // If belongs to a desarrollo, fetch and inject shared fields
        if (DesarrolloId) {
            if (!mongoose.isValidObjectId(DesarrolloId)) {
                return res.status(400).json({ error: "DesarrolloId inválido" });
            }
            const desarrollo = await Desarrollos.findById(DesarrolloId);
            if (!desarrollo) {
                return res.status(404).json({ error: "Desarrollo no encontrado" });
            }

            // inject
            req.body.Resumen = desarrollo.Resumen;
            req.body.Descripcion = desarrollo.Descripcion;
            req.body.Descripcion_Expandir = desarrollo.Descripcion_Expandir;
            req.body.Ciudad = desarrollo.Ciudad;
            req.body.Barrio = desarrollo.Barrio;
            req.body.Ubicacion = desarrollo.Ubicacion;
            req.body.Estado = desarrollo.Estado;
            req.body.Entrega = desarrollo.Entrega;
            req.body.Forma_de_Pago = desarrollo.Forma_de_Pago;
            req.body.Gastos_Ocupacion = desarrollo.Gastos_Ocupacion;
        } else {
            // No desarrollo: require manual fields
            const manualReq = [
                Estado, Tipo, Entrega, Forma_de_Pago,
                Gastos_Ocupacion, Ciudad, Barrio, Ubicacion,
                Resumen, Descripcion, Descripcion_Expandir
            ];
            if (manualReq.some(f => f == null)) {
                return res.status(400).json({ error: "Faltan campos manuales requeridos para propiedad independiente" });
            }
        }

        // finalize numeric and formatted fields
        req.body.Precio = precioNum;
        req.body.Tamano_m2 = tamanoNum;
        req.body.Precio_Con_Formato = precioNum.toLocaleString("es-ES");

        // Process gallery
        if (Galeria && Array.isArray(Galeria)) {
            req.body.Galeria = Galeria.map((img, idx) => ({
                url: img.url,
                alt: img.alt || "",
                description: img.description || "",
                position: idx
            }));
        }

        // Process planos
        if (Plano && Array.isArray(Plano)) {
            req.body.Plano = Plano.map((img, idx) => ({
                url: img.url,
                alt: img.alt || "",
                description: img.description || "",
                position: idx
            }));
        }

        // Build and save
        const nuevaPropiedad = new Propiedad({
            Titulo: req.body.Titulo,
            Precio: req.body.Precio,
            Precio_Con_Formato: req.body.Precio_Con_Formato,
            Estado: req.body.Estado,
            Imagen: Imagen,
            Galeria: req.body.Galeria || [],
            Tipo: req.body.Tipo,
            Entrega: req.body.Entrega,
            Dormitorios: req.body.Dormitorios,
            Banos: req.body.Banos,
            Tamano_m2: req.body.Tamano_m2,
            Metraje: req.body.Metraje,
            Piso: req.body.Piso,
            Plano: req.body.Plano || [],
            Unidad: req.body.Unidad,
            Forma_de_Pago: req.body.Forma_de_Pago,
            Gastos_Ocupacion: req.body.Gastos_Ocupacion,
            Owner: req.body.Owner,
            Celular: req.body.Celular,
            Email: req.body.Email,
            DesarrolloId: DesarrolloId || null,
            Ciudad: req.body.Ciudad,
            Barrio: req.body.Barrio,
            Ubicacion: req.body.Ubicacion,
            Resumen: req.body.Resumen,
            Descripcion: req.body.Descripcion,
            Descripcion_Expandir: req.body.Descripcion_Expandir,
            Mapa: req.body.Mapa
        });

        await nuevaPropiedad.save();
        res.status(201).json(nuevaPropiedad);

    } catch (err) {
        console.error("❌ Error al crear propiedad:", err);
        res.status(500).json({ error: err.message || "Error al crear propiedad" });
    }
});

// PUT, DELETE remain unchanged...
router.put("/:id", checkAuth, checkAdminRole, async (req, res) => {
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


router.delete("/:id", checkAuth, checkAdminRole, async (req, res) => {
    try {
        const deleted = await Propiedad.findByIdAndDelete(req.params.id);
        if (!deleted) return res.status(404).json({ error: "Propiedad no encontrada" });
        res.json({ message: "Propiedad eliminada correctamente" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
