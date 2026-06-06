const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    console.log("tokem", req.user);
    res.json({ message: 'Welcome to the home page!' });
});

module.exports = router;