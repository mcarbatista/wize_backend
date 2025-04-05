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

                    // If it's an image, we convert to JPG synchronously.
                    // If it's a video, we do an EAGER transformation to MP4 (asynchronously).
                    const uploadOptions = {
                        folder: cloudinaryFolder,
                        resource_type: resourceType
                    };

                    if (resourceType === "video") {
                        // Provide an eager transformation array
                        uploadOptions.eager = [{ format: "mp4" }];
                        uploadOptions.eager_async = true;
                        // optionally: uploadOptions.eager_notification_url = "https://yourapp.com/cloudinary-webhook";
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
                                // The result for large videos may not have the final .mp4
                                // yet, because it's processed asynchronously. 
                                // The 'secure_url' here is for the original uploaded file.
                                // The MP4 version will be in result.eager (once processed).
                                resolve({
                                    url: result.secure_url,
                                    alt: file.originalname || "",
                                    description: "",
                                    position: index,
                                    // If it's a video and you want the final MP4 URL,
                                    // you can check result.eager after it's done:
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

        // For large videos, the returned `url` is typically the original resource (like .mov).
        // The final .mp4 version is created asynchronously. You can find it in `result.eager` 
        // after the transformation finishes, or handle it via a notification URL.

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
