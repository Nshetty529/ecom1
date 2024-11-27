const User = require('../models/User');
const Cart = require('../models/Cart');        // Add this import
const Order = require('../models/Order');      // Add this import
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');;


// Register User
const registerUser = async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const user = await User.create({ name, email, password });
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '30d' });
        
        res.status(201).json({
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// login user

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  console.log("Login Request Body:", req.body);

  try {
    // Find the user by email
    const user = await User.findOne({ email });
    console.log("User found in DB:", user);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Compare the password
    const isMatch = await bcrypt.compare(password, user.password);
    console.log("Password match:", isMatch);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Generate the token
    const token = jwt.sign(
      { id: user._id, isAdmin: user.isAdmin },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );
    console.log("Generated Token:", token);

    res.status(200).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
      },
    });
  } catch (error) {
    console.error("Login error:", error.message);
    res.status(500).json({ message: error.message });
  }
};





// Get User Profile
const getUserProfile = async (req, res) => {
    try {
        console.log('Getting user profile for user ID:', req.user.id); // Debug log

        const user = await User.findById(req.user.id).select('-password');
        console.log('User found:', user); // Debug log

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(user);
    } catch (error) {
        console.error('Error fetching user profile:', error.message);
        res.status(500).json({ message: error.message });
    }
};


// Update User Profile
const updateUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Update fields if provided
        user.name = req.body.name || user.name;
        user.email = req.body.email || user.email;

        // Update password if provided
        if (req.body.password) {
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(req.body.password, salt);
        }

        const updatedUser = await user.save();

        // Generate new token with updated info
        const token = jwt.sign({ id: updatedUser._id }, process.env.JWT_SECRET, { expiresIn: '30d' });

        res.status(200).json({
            token,
            user: {
                id: updatedUser._id,
                name: updatedUser.name,
                email: updatedUser.email
            }
        });
    } catch (error) {
        console.error('Error updating user profile:', error.message);
        res.status(500).json({ message: error.message });
    }
};

// Delete User Profile
const deleteProfile = async (req, res) => {
    try {
        console.log('Delete profile route hit');
        console.log('User ID:', req.user.id);

        const user = await User.findById(req.user.id);

        if (!user) {
            console.log('User not found');
            return res.status(404).json({ message: 'User not found' });
        }

        // Delete user's cart
        await Cart.deleteMany({ user: req.user.id });
        console.log('User cart deleted');

        // Delete user's orders
        await Order.deleteMany({ user: req.user.id });
        console.log('User orders deleted');

        // Delete the user
        await User.findByIdAndDelete(req.user.id);
        console.log('User deleted');

        res.status(200).json({ 
            message: 'User profile and associated data deleted successfully' 
        });

    } catch (error) {
        console.error('Error deleting user profile:', error.message);
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    registerUser,
    loginUser,
    getUserProfile,
    updateUserProfile,
    deleteProfile
};



