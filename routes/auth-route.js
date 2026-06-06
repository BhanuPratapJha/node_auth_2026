const express = require('express');
const router = express.Router();
const {registerUser,loginUser, updateUserPassword} = require('../controller/auth-controller');
const userAuthenticated = require('../middleware/user-authenticated');

router.post('/register', registerUser);

router.post('/login', loginUser);

router.post('/change-password', userAuthenticated, updateUserPassword);


module.exports = router;