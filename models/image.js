const mongoose = require('mongoose');

const imageSchema = new mongoose.Schema({
    url: { type: String, required: true },
    publicId: { type: String, required: true },
    filename: { type: String, required: true },
    uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    uploadedAt: { type: Date, default: Date.now }
});

const Image = mongoose.model('Image', imageSchema);

module.exports = Image;