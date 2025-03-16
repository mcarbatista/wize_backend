const mongoose = require('mongoose');

const PropertySchema = new mongoose.Schema({
    title: String,
    shortDescription: String,
    longDescription: String,
    price: Number,
    status: { type: String, enum: ['pre-sale', 'under construction', 'sale'], required: true },
    city: String,
    neighborhood: String,
    bedrooms: Number,
    bathrooms: Number,
    images: [String],
    videos: [String],
    blueprint: String,
    latitude: Number,
    longitude: Number,
    agent: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
});

module.exports = mongoose.model('Property', PropertySchema);
