const express = require("express");
const router = express.Router();
const mongoose = require("mongoose"); // ✅ ADD THIS LINE
const Propiedad = require("../models/Propiedades");
const cloudinary = require("cloudinary").v2;
const multer = require("multer");
const streamifier = require("streamifier");

// ✅ Cloudinary config
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = multer.memoryStorage();
const upload = multer({ storage });


// ✅ Upload multiple images to Cloudinary
router.post("/upload", upload.array("imagenes"), async (req, res) => {
    try {
        const files = req.files;
        const uploads = await Promise.all(
            files.map(
                (file) =>
                    new Promise((resolve, reject) => {
                        const stream = cloudinary.uploader.upload_stream(
                            { folder: "propiedades" },
                            (error, result) => {
                                if (result) resolve(result);
                                else reject(error);
                            }
                        );
                        streamifier.createReadStream(file.buffer).pipe(stream);
                    })
            )
        );
        res.json(uploads.map((u) => ({ url: u.secure_url })));
    } catch (err) {
        console.error("Upload error:", err);
        res.status(500).json({ error: "Image upload failed" });
    }
});

// ✅ Create property
router.post("/", async (req, res) => {
    try {
        const newProp = new Propiedad(req.body);
        await newProp.save();
        res.status(201).json(newProp);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET all propiedades
router.get("/", async (req, res) => {
    try {
        const propiedades = await Propiedades.find({});
        res.json(propiedades);
    } catch (error) {
        console.error("❌ Error fetching propiedades:", error);
        res.status(500).json({ error: error.message || "Server error" });
    }
});

// ✅ Get one property
router.get("/:id", async (req, res) => {
    try {
        const prop = await Propiedad.findById(req.params.id);
        if (!prop) return res.status(404).json({ error: "Not found" });
        res.json(prop);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ✅ Update property
router.put("/:id", async (req, res) => {
    try {
        const updated = await Propiedad.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
        });
        if (!updated) return res.status(404).json({ error: "Not found" });
        res.json(updated);
    } catch (err) {
        res.status(500).json({ error: err.message });
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

router.get("/desarrollo/:id", async (req, res) => {
    try {
        const props = await Propiedad.find({ DesarrolloId: req.params.id });
        res.json(props);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
