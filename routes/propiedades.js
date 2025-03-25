const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Propiedad = require("../models/Propiedades");
const Desarrollos = require("../models/Desarrollos");
const cloudinary = require("cloudinary").v2;
const multer = require("multer");
const streamifier = require("streamifier");

// ✅ Cloudinary config
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// ✅ Multer setup
const storage = multer.memoryStorage();
const upload = multer({ storage });

// ✅ Ruta: subir múltiples imágenes a Cloudinary
router.post("/upload", upload.array("imagenes"), async (req, res) => {
    try {
        const uploads = await Promise.all(
            req.files.map((file) => {
                return new Promise((resolve, reject) => {
                    const stream = cloudinary.uploader.upload_stream(
                        { folder: "propiedades" },
                        (error, result) => {
                            if (result) {
                                resolve({
                                    url: result.secure_url,
                                    public_id: result.public_id,
                                });
                            } else {
                                reject(error);
                            }
                        }
                    );
                    streamifier.createReadStream(file.buffer).pipe(stream);
                });
            })
        );

        res.json({ success: true, images: uploads });
    } catch (error) {
        console.error("❌ Upload error:", error);
        res.status(500).json({ success: false, error: "Image upload failed" });
    }
});

// ✅ Create property
router.post("/", async (req, res) => {
    try {
        const {
            Titulo,
            Precio,
            Estado,
            Dormitorios,
            Banos,
            Tamano_m2,
            DesarrolloId
        } = req.body;

        // Validaciones básicas
        if (!Titulo || !Precio || !Dormitorios || !Banos || !Tamano_m2 || !DesarrolloId) {
            return res.status(400).json({
                error: "Faltan campos requeridos: Título, Precio, Dormitorios, Baños, Tamaño m2 o Desarrollo"
            });
        }

        // Verificamos que precio y tamaño sean números válidos
        const precioNum = Number(Precio);
        const tamanoNum = Number(Tamano_m2);
        if (isNaN(precioNum) || isNaN(tamanoNum)) {
            return res.status(400).json({ error: "Precio y Tamaño m2 deben ser números válidos" });
        }

        // Buscar el desarrollo
        const desarrollo = await Desarrollos.findById(DesarrolloId);
        if (!desarrollo) {
            return res.status(404).json({ error: "Desarrollo no encontrado con ese ID" });
        }

        // Formatear precio con separador de miles
        const precioConFormato = precioNum.toLocaleString("es-ES");

        // Precopiar campos desde el desarrollo
        req.body.Resumen = desarrollo.Resumen;
        req.body.Descripcion = desarrollo.Descripcion;
        req.body.Ciudad = desarrollo.Ciudad;
        req.body.Barrio = desarrollo.Barrio;
        req.body.Ubicacion = desarrollo.Ubicacion;

        // Guardar valores numéricos y formateados
        req.body.Precio = precioNum;
        req.body.Tamano_m2 = tamanoNum;
        req.body.Precio_Con_Formato = precioConFormato;

        const newProp = new Propiedad(req.body);
        await newProp.save();
        res.status(201).json(newProp);
    } catch (err) {
        console.error("❌ Error al crear propiedad:", err);
        res.status(500).json({ error: err.message || "Error al crear propiedad" });
    }
});



// ✅ Get all properties with desarrollo info
router.get("/", async (req, res) => {
    try {
        const propiedades = await Propiedad.find().populate("DesarrolloId");
        res.json(propiedades);
    } catch (error) {
        console.error("❌ Error fetching propiedades:", error);
        res.status(500).json({ error: error.message || "Server error" });
    }
});

// ✅ Get one property
router.get("/:id", async (req, res) => {
    try {
        const prop = await Propiedad.findById(req.params.id).populate("DesarrolloId");
        if (!prop) return res.status(404).json({ error: "Not found" });
        res.json(prop);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ✅ Update property
router.put("/:id", async (req, res) => {
    try {
        const {
            Precio,
            Tamano_m2,
            DesarrolloId,
        } = req.body;

        // Validación de números
        const precioNum = Number(Precio);
        const tamanoNum = Number(Tamano_m2);
        if (isNaN(precioNum) || isNaN(tamanoNum)) {
            return res.status(400).json({ error: "Precio y Tamaño m2 deben ser números válidos" });
        }

        // Si hay desarrollo, traer sus datos
        if (DesarrolloId) {
            const desarrollo = await Desarrollos.findById(DesarrolloId);
            if (!desarrollo) {
                return res.status(404).json({ error: "Desarrollo no encontrado con ese ID" });
            }

            req.body.Resumen = desarrollo.Resumen;
            req.body.Descripcion = desarrollo.Descripcion;
            req.body.Ciudad = desarrollo.Ciudad;
            req.body.Barrio = desarrollo.Barrio;
            req.body.Ubicacion = desarrollo.Ubicacion;
        }

        // Actualizar numéricos y formateo
        req.body.Precio = precioNum;
        req.body.Tamano_m2 = tamanoNum;
        req.body.Precio_Con_Formato = precioNum.toLocaleString("es-ES");

        const updated = await Propiedad.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
        });

        if (!updated) return res.status(404).json({ error: "Propiedad no encontrada" });

        res.json(updated);
    } catch (err) {
        console.error("❌ Error al editar propiedad:", err);
        res.status(500).json({ error: err.message || "Error al actualizar propiedad" });
    }
});


// ✅ Delete property
router.delete("/:id", async (req, res) => {
    try {
        const deleted = await Propiedad.findByIdAndDelete(req.params.id);
        if (!deleted) return res.status(404).json({ error: "Not found" });
        res.json({ message: "Deleted" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ✅ Get propiedades by desarrollo ID
router.get("/desarrollos/:id", async (req, res) => {
    try {
        const props = await Propiedad.find({ DesarrolloId: req.params.id });
        res.json(props);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
