const Image = require('../models/image');
const cloudinary = require('../config/cloudinary');
const { uploadToCloudinary } = require('../helpers/cloudinaryHelpper');

const uploadImage = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        // upload to cloudinary

        const { path } = req.file;
        const folder = 'user_uploads';
        const uploadResult = await uploadToCloudinary(path, folder);

        const newImage = new Image({ 
            url: uploadResult.url,
            publicId: uploadResult.publicId,
            filename: req.file.originalname,
            uploadedBy: req.user.userId
        });

        await newImage.save();

        res.status(201).json({ success: true,message: 'Image uploaded successfully', image: newImage });
    } catch (error) {
        console.error('Error uploading image:', error);
        res.status(500).json({ message: 'Failed to upload image' });
    }
};

const getUserImages = async (req, res) => {
    try {
        const images = await Image.find({});
        res.status(200).json({ success: true, images });
    } catch (error) {
        console.error('Error fetching user images:', error);
        res.status(500).json({ message: 'Failed to fetch images' });
    }
};

// delete image by id
const deleteImage = async (req, res) => {
    try {
        const { imageId } = req.params;
        const image = await Image.findById(imageId);

        if (!image) {
            return res.status(404).json({ message: 'Image not found' });
        }

        if (image.uploadedBy.toString() !== req.user.userId) {
            return res.status(403).json({ message: 'Unauthorized to delete this image' });
        }

        // delete from cloudinary
        await cloudinary.uploader.destroy(image.publicId);

        // delete from database
        await Image.findByIdAndDelete(imageId);

        res.status(200).json({ success: true, message: 'Image deleted successfully' });
    } catch (error) {
        console.error('Error deleting image:', error);
        res.status(500).json({ message: 'Failed to delete image' });
    }
};

module.exports = { uploadImage, getUserImages, deleteImage };