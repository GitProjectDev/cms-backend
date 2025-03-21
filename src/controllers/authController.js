const User = require('../models/user');
const bcrypt = require('bcrypt');

const registerUser = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            req.flash('error', 'User already exists');
            return res.redirect('/auth/login');
        }

        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create and save new user
        const newUser = new User({
            name,
            email,
            password: hashedPassword,
            role
        });
        await newUser.save();

        // Log the user in by setting session
        req.session.user = { id: newUser._id, name: newUser.name, role: newUser.role };
        req.flash('success', 'User created successfully');
        return res.redirect('/dashboard');
    } catch (error) {
        console.error(error);
        req.flash('error', 'Server error, try again later');
        return res.redirect('/auth/register');
    }
};

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            req.flash('error', 'No user found with this email');
            return res.redirect('/auth/login');
        }

        // Verify password
        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            req.flash('error', 'Invalid password');
            return res.redirect('/auth/login');
        }

        // Set user in session
        req.session.user = { id: user._id, name: user.name, role: user.role };
        req.flash('success', 'Login successful');
        return res.redirect('/dashboard');
    } catch (error) {
        console.error(error);
        req.flash('error', 'Server error, try again later');
        return res.redirect('/auth/login');
    }
};

const changePassword = async (req, res) => {
    try {
        const userId = req.session.user.id; 
        const { oldPassword, newPassword } = req.body;

        // Find user
        const user = await User.findById(userId);
        if (!user) {
            req.flash('error', 'User not found');
            return res.redirect('/dashboard');
        }

        // Verify old password
        const isPasswordMatch = await bcrypt.compare(oldPassword, user.password);
        if (!isPasswordMatch) {
            req.flash('error', 'Incorrect old password');
            return res.redirect('/auth/change-password');
        }

        // Hash new password
        const salt = await bcrypt.genSalt(10);
        const newHashedPassword = await bcrypt.hash(newPassword, salt);

        // Update password
        user.password = newHashedPassword;
        await user.save();

        req.flash('success', 'Password updated successfully');
        return res.redirect('/dashboard');
    } catch (error) {
        console.error(error);
        req.flash('error', 'Server error, please try again later');
        return res.redirect('/auth/change-password');
    }
};

module.exports = { registerUser, loginUser, changePassword };