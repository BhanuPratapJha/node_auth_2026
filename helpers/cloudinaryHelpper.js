const cloudinary = require('../config/cloudinary');

const uploadToCloudinary = async (filePath, folder) => {
    try {
        const result = await cloudinary.uploader.upload(filePath, {
            folder: folder
        });
        return {
            url: result.secure_url,
            publicId: result.public_id,
            filename: result.original_filename,
            folder: folder
        };
    } catch (error) {
        console.error('Error uploading to Cloudinary:', error);
        throw new Error('Failed to upload image');
    }
};

module.exports = { uploadToCloudinary };