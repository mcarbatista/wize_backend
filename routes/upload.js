const express = require('express');
const router = express.Router();
const { upload } = require('../config/cloudinary');

router.post('/upload', upload.array('files', 10), (req, res) => {
    try {
        const fileUrls = req.files.map(file => file.path);
        res.json({ success: true, urls: fileUrls });
    } catch (error) {
        res.status(500).json({ error: 'Upload failed' });
    }
});

module.exports = router;
