const express = require("express");
const router = express.Router();
const cloudinary = require("cloudinary").v2;
const multer = require("multer");
const streamifier = require("streamifier");
const Desarrollos = require("../models/Desarrollos");

// ✅ Multer setup
const storage = multer.memoryStorage();
const upload = multer({ storage });

// ✅ Cloudinary config (si no está centralizado)
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// ✅ Ruta de prueba
router.get("/test", (req, res) => {
    res.send("✅ Ruta de desarrollos funciona");
});

// ✅ GET all desarrollos
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
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: "ID inválido" });
    }

    try {
        const desarrollo = await Desarrollos.findById(id);
        if (!desarrollo) {
            return res.status(404).json({ error: "Desarrollo no encontrado" });
        }

        const propiedades = await Propiedades.find({ DesarrolloId: id });
        res.json({ desarrollo, propiedades });
    } catch (err) {
        console.error("❌ Error al obtener desarrollo:", err);
        res.status(500).json({ error: "Error interno del servidor" });
    }
});

// ✅ POST crear nuevo desarrollo
// ✅ POST: Crear desarrollo con imágenes
router.post("/", upload.array("imagenes"), async (req, res) => {
    try {
        const {
            Proyecto_Nombre,
            Precio,
            Estado,
            Resumen,
            Descripcion,
            Ciudad,
            Barrio,
            Ubicacion,
            Email,
            Celular,
            Entrega,
            Forma_de_Pago,
            Gastos_Ocupacion,
            Tipo,
            Imagen_Principal_Url,
        } = req.body;

        // Validaciones básicas
        if (
            !Proyecto_Nombre ||
            !Precio ||
            !Estado ||
            !Resumen ||
            !Descripcion ||
            !Ciudad ||
            !Barrio ||
            !Ubicacion
        ) {
            return res.status(400).json({ error: "Faltan campos obligatorios" });
        }

        // Subir imágenes a Cloudinary
        const imagenesSubidas = await Promise.all(
            req.files.map((file, index) => {
                return new Promise((resolve, reject) => {
                    const stream = cloudinary.uploader.upload_stream(
                        {
                            folder: "desarrollos",
                        },
                        (error, result) => {
                            if (error) return reject(error);
                            resolve({
                                url: result.secure_url,
                                position: index,
                                alt: file.originalname,
                            });
                        }
                    );
                    streamifier.createReadStream(file.buffer).pipe(stream);
                });
            })
        );

        const imagenPrincipal =
            Imagen_Principal_Url ||
            (imagenesSubidas.length > 0 ? imagenesSubidas[0].url : null);

        // Crear nuevo desarrollo
        const nuevoDesarrollo = new Desarrollo({
            Proyecto_Nombre,
            Precio,
            Estado,
            Resumen,
            Descripcion,
            Ciudad,
            Barrio,
            Ubicacion,
            Email,
            Celular,
            Entrega,
            Forma_de_Pago,
            Gastos_Ocupacion,
            Tipo,
            Galeria: imagenesSubidas,
            Imagen: imagenPrincipal,
        });

        const saved = await nuevoDesarrollo.save();
        res.status(201).json(saved);
    } catch (err) {
        console.error("❌ Error al crear desarrollo:", err);
        res.status(500).json({ error: "Error al crear desarrollo" });
    }
});

// ✅ PUT actualizar desarrollo existente
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
        console.error("❌ Error al actualizar desarrollo:", err);
        res.status(500).json({ error: err.message });
    }
});

// ✅ DELETE eliminar desarrollo
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
        console.error("❌ Error al eliminar desarrollo:", err);
        res.status(500).json({ error: err.message });
    }
});

// ✅ POST imagen de desarrollo
// router.post("/:id/imagenes", upload.array("imagenes"), async (req, res) => {
//     try {
//         const desarrollo = await Desarrollos.findById(req.params.id);
//         if (!desarrollo) return res.status(404).json({ error: "Desarrollo no encontrado" });

//         const uploads = await Promise.all(
//             req.files.map((file, index) => {
//                 return new Promise((resolve, reject) => {
//                     const stream = cloudinary.uploader.upload_stream(
//                         { folder: "desarrollos" },
//                         (error, result) => {
//                             if (result) {
//                                 resolve({
//                                     url: result.secure_url,
//                                     position: desarrollo.Galeria.length + index
//                                 });
//                             } else {
//                                 reject(error);
//                             }
//                         }
//                     );
//                     streamifier.createReadStream(file.buffer).pipe(stream);
//                 });
//             })
//         );

//         desarrollo.Galeria.push(...uploads);
//         await desarrollo.save();

//         res.json({ success: true, galeria: desarrollo.Galeria });
//     } catch (error) {
//         console.error("❌ Error subiendo imágenes:", error);
//         res.status(500).json({ error: "Error al subir imágenes" });
//     }
// });

// ✅ PUT imagen principal de desarrollo
router.put("/:id/imagen-principal", async (req, res) => {
    const { url } = req.body;

    try {
        const desarrollo = await Desarrollos.findById(req.params.id);
        if (!desarrollo) return res.status(404).json({ error: "Desarrollo no encontrado" });

        desarrollo.Imagen = url;
        await desarrollo.save();
        res.json({ success: true, imagen: desarrollo.Imagen });
    } catch (err) {
        console.error("❌ Error al setear imagen principal:", err);
        res.status(500).json({ error: "No se pudo actualizar imagen principal" });
    }
});


module.exports = router;
