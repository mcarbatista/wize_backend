const express = require('express');
const router = express.Router();
const { upload } = require('../config/cloudinary');
const cloudinary = require("cloudinary").v2;

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});


// upload an image
router.post('/upload', upload.array('files', 10), (req, res) => {
    try {
        const fileUrls = req.files.map(file => file.path);
        res.json({ success: true, urls: fileUrls });
    } catch (error) {
        res.status(500).json({ error: 'Upload failed' });
    }
});

// delete an image
router.delete('/', async (req, res) => {
    const { public_id } = req.query;

    if (!public_id) {
        return res.status(400).json({ error: "Missing public_id" });
    }

    try {
        const result = await cloudinary.uploader.destroy(public_id);
        res.json({ result });
    } catch (error) {
        res.status(500).json({ error: "Failed to delete image", details: error.message });
    }
});
module.exports = router;
