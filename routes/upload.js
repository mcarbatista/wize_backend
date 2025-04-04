const express = require('express');
const router = express.Router();
const cloudinary = require("cloudinary").v2;
const multer = require("multer");
const streamifier = require("streamifier");

// ✅ Cloudinary config
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// ✅ Multer setup for memory upload
const storage = multer.memoryStorage();
const upload = multer({ storage });

// ✅ Upload images/videos to Cloudinary and return structured info for Galeria
router.post('/', upload.array('imagenes', 20), async (req, res) => {
    try {
        const folderName = req.body.folderName || "generico";
        // Allow custom folder from frontend
        const cloudinaryFolder = req.body.folder || `wize/desarrollos/fotos/${folderName}`;

        console.log("🛬 Archivos recibidos:", req.files);
        console.log("📁 Carpeta destino:", cloudinaryFolder);

        const uploads = await Promise.all(
            req.files.map((file, index) => {
                return new Promise((resolve, reject) => {
                    // Detect resource type based on file mimetype:
                    const resourceType = file.mimetype.startsWith("video/") ? "video" : "image";

                    // For video files, add a transformation to output as mp4.
                    const uploadOptions = {
                        folder: cloudinaryFolder,
                        resource_type: resourceType,
                        ...(resourceType === "video" && {
                            transformation: [{ format: "mp4" }]
                        })
                    };

                    const stream = cloudinary.uploader.upload_stream(
                        uploadOptions,
                        (error, result) => {
                            if (error) {
                                console.error("❌ Cloudinary error:", error);
                                reject(error);
                            } else {
                                resolve({
                                    url: result.secure_url,
                                    alt: file.originalname || "",
                                    description: "",
                                    position: index
                                });
                            }
                        }
                    );
                    streamifier.createReadStream(file.buffer).pipe(stream);
                });
            })
        );

        res.json({ success: true, galeria: uploads });
    } catch (error) {
        console.error("❌ Error al subir imágenes:", error);
        res.status(500).json({ success: false, error: 'Upload failed', details: error.message });
    }
});

// ✅ Delete image by Cloudinary public_id
router.delete('/', async (req, res) => {
    const { public_id } = req.query;

    if (!public_id) {
        return res.status(400).json({ error: "Missing public_id" });
    }

    try {
        const result = await cloudinary.uploader.destroy(public_id);
        res.json({ result });
    } catch (error) {
        console.error("❌ Error al borrar imagen:", error);
        res.status(500).json({ error: "Failed to delete image", details: error.message });
    }
});

module.exports = router;
