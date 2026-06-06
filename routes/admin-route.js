const express = require('express');
const router = express.Router();

// admin route
router.get('/', (req, res) => {
    res.json({ message:' Welcome to the admin Page!' });
});

module.exports = router;