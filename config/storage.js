// config/storage.js
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('./cloudinary'); // this uses your configured cloudinary instance

const storage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: 'my-uploads', // You can change the folder name
        allowed_formats: ['jpg', 'png', 'jpeg'],
    },
});

module.exports = storage;
