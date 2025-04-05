const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('../models/User');
const nodemailer = require('nodemailer');

const registerUser = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            req.flash('error', 'User already exists');
            return res.redirect('/auth/register');
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

//login 
const loginUser = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    req.flash('error', 'Invalid email or password');
    return res.redirect('/auth/login');
  }

  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    req.flash('error', 'Invalid email or password');
    return res.redirect('/auth/login');
  }

  req.session.regenerate((err) => {
    if (err) {
      req.flash('error', 'Session error');
      return res.redirect('/auth/login');
    }

    // Set the user session here
    req.session.user = { id: user._id, name: user.name, role: user.role }; 
    req.session.ip = req.ip;
    req.session.userAgent = req.headers['user-agent'];

    req.flash('success', 'Logged in successfully');
    res.redirect('/dashboard');
  });
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
 
// for Reset and forgot password 

// Generate OTP
const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

// Gmail transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS,
  }
});

// Forgot Password
const forgotPassword = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    req.flash('error', 'No user found with this email');
    return res.redirect('/auth/forgot-password');
  }

  const otp = generateOTP();
  const expiry = new Date(Date.now() + 5 * 60 * 1000); // 5 mins later

  user.resetOTP = otp;
  user.otpExpires = expiry;
  await user.save();

  const mailOptions = {
    from: process.env.GMAIL_USER,
    to: email,
    subject: 'Password Reset OTP',
    html: `<p>Your OTP is: <b>${otp}</b></p><p>Valid for 5 minutes only.</p>`
  };

  await transporter.sendMail(mailOptions);
  req.flash('success', 'OTP sent to your email');
  res.redirect(`/auth/reset-password?email=${email}`);
};

// Reset Password
const resetPassword = async (req, res) => {
  const { email, otp, newPassword } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    req.flash('error', 'No user found');
    return res.redirect(`/auth/reset-password?email=${email}`);
  }

  const now = new Date();

  if (!user.resetOTP || !user.otpExpires || user.resetOTP !== otp || user.otpExpires < now) {
    req.flash('error', 'Invalid or expired OTP');
    return res.redirect(`/auth/reset-password?email=${email}`);
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);
  user.password = hashedPassword;
  user.resetOTP = null;
  user.otpExpires = null;
  await user.save();

  req.flash('success', 'Password reset successful');
  res.redirect('/auth/login');

};

module.exports = {
  registerUser,
  loginUser,
  changePassword,
  forgotPassword,
  resetPassword
};


module.exports = { registerUser, loginUser, changePassword,forgotPassword,resetPassword };