const express = require('express');
const router = require('express').Router();
const { uploadImage, getUserImages, deleteImage } = require('../controller/image-controller');
const userAuthenticated = require('../middleware/user-authenticated');
const adminMiddleware = require('../middleware/admin-middleware');
const upladMiddleware = require('../middleware/upload-middleware');
// const  getUserImages  = require('../controller/image-controller');
// const upload
//upload image
const multer = require('multer');
// const upload = multer({ dest: 'uploads/' });


router.post('/upload', userAuthenticated,adminMiddleware,  upladMiddleware.single('image'), uploadImage);

//get user images
router.get('/my-images', userAuthenticated, getUserImages);

//delete image by id
router.delete('/delete/:imageId', userAuthenticated, deleteImage);

module.exports = router;

