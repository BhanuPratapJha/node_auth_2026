require('dotenv').config();
require('./models/user');

const connectToDatabase = require('./database/db');
const express = require('express');
const authRoutes = require('./routes/auth-route');
const adminRoutes = require('./routes/admin-route');
const homeRoutes = require('./routes/home-route');
const userAuthenticated = require('./middleware/user-authenticated');
const adminMiddleware = require('./middleware/admin-middleware');
const imageRoutes = require('./routes/image-route');

connectToDatabase();

const app = express();

// Middleware - Add this BEFORE routes
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/admin',userAuthenticated, adminMiddleware, adminRoutes);
app.use('/api/home',userAuthenticated, homeRoutes);
app.use('/api/images', imageRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
