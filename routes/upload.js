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

                    const uploadOptions = {
                        folder: cloudinaryFolder,
                        resource_type: resourceType
                    };

                    if (resourceType === "video") {
                        // Force synchronous conversion to MP4 via eager transformation.
                        // Removing eager_async ensures the transformation is processed before the response.
                        uploadOptions.eager = [{ format: "mp4" }];
                        // Optionally, you could also set uploadOptions.format = "mp4";
                    } else {
                        // Force images to be JPG
                        uploadOptions.format = "jpg";
                    }

                    const stream = cloudinary.uploader.upload_stream(
                        uploadOptions,
                        (error, result) => {
                            if (error) {
                                console.error("❌ Cloudinary error:", error);
                                reject(error);
                            } else {
                                // For videos, if the eager transformation is available, use it.
                                const finalUrl = (result.eager && result.eager.length > 0)
                                    ? result.eager[0].secure_url
                                    : result.secure_url;
                                resolve({
                                    url: finalUrl,
                                    alt: file.originalname || "",
                                    description: "",
                                    position: index,
                                    // Return the eager results for additional info if needed.
                                    eager: result.eager || []
                                });
                            }
                        }
                    );

                    streamifier.createReadStream(file.buffer).pipe(stream);
                    console.log("File buffer exists:", Buffer.isBuffer(file.buffer), "Buffer length:", file.buffer.length);
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
