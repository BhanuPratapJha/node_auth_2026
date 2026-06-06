const express = require('express');
const jwt = require('jsonwebtoken');

const userAuthenticated = (req, res, next) => {

    const authHeader = req.headers["authorization"];
    console.log(authHeader);
    const token = authHeader && authHeader.split(" ")[1];
    console.log("token", token);
    if(!token) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        console.log("sadsa",decoded);
        req.user = decoded;
        return next();
    } catch (err) {
        return res.status(500).json({ message: 'Unauthorized' });
    }
    
    
    // res.status(401).json({ message: 'Unauthorized' });
};

module.exports = userAuthenticated;