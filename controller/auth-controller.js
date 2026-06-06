const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
// register controller

const registerUser = async (req, res) => {
    try {
        const { username, email, password, role } = req.body;
        // Validate input
        if (!username || !email || !password) {
            return res.status(400).json({ message: 'All fields are required' });
        }
        
        // Check if user already exists
        const existingUser = await User.findOne({$or:[{ email, username }]});
        if (existingUser) {
            return res.status(409).json({ message: 'User already exists' });
        }
        
        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        console.log("sdknjfsd");
        // Create new user
        const newUser = new User({ username, email, password: hashedPassword, role });
        await newUser.save();
        console.log("sdknjf");
        if(newUser){
            res.status(201).json({ message: 'User registered successfully' });
            console.log('User registered successfully:', newUser);
        }else {
            res.status(500).json({ message: 'Failed to register user' });
        }

    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}
//login controller
const loginUser = async (req, res) => {
    try {
        console.log("Login request received with body:", req.body);
        const { username, password } = req.body;
        // Validate input
        if (!username || !password) {
            return res.status(400).json({ message: 'username and password are required' });
        }
        // Check if user exists
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(401).json({ message: 'user does not exist' });
        }
        // Compare password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        // Generate JWT token
        const token = jwt.sign({ userId: user._id, username: user.username, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.status(200).json({ success: true, accessToken: token, message: 'Login successful' });
    } catch (error) {
        console.error('Error logging in:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

// update password user controller

const updateUserPassword = async(req, res) => {
    try{
        const { userId } = req.user;
        const { currentPassword, newPassword } = req.body;

        if(!currentPassword || !newPassword) {
            return res.status(400).json({ message: 'Current and new password are required' });
        }

        const user = await User.findById(userId);
        if(!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if(!isMatch) {
            return res.status(401).json({ message: 'Current password is incorrect' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedNewPassword = await bcrypt.hash(newPassword, salt);

        user.password = hashedNewPassword;
        await user.save();

        res.status(200).json({ success: true, message: 'Password updated successfully' });

    }catch(error){
        console.error('Error updating user password:', error);
        res.status(500).json({ message: 'Internal server error, failed to update user password' });
    }
}

module.exports = {
    registerUser,
    loginUser,
    updateUserPassword
};