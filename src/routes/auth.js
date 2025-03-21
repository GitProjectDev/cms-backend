const express = require('express');
const router = express.Router();
const flash = require('connect-flash');
const authMiddleware = require('../middleware/auth');
const { registerUser, loginUser, changePassword } = require('../controllers/authController');

// Render registration form
router.get('/register', (req, res) => {
    res.render('auth/register', { error: req.flash('error'), success: req.flash('success') });
});

// Handle registration
router.post('/register', registerUser);

// Render login form
router.get('/login', (req, res) => {
    res.render('auth/login', { error: req.flash('error'), success: req.flash('success') });
});

// Handle login
router.post('/login', loginUser);

// Render change password form
router.get('/change-password', authMiddleware, (req, res) => {
    res.render('auth/change-password', { error: req.flash('error'), success: req.flash('success') });
});

// Handle change password
router.post('/change-password', authMiddleware, changePassword);







// Logout
router.get('/logout', (req, res) => {
    req.session.destroy(() => {
        res.redirect('/auth/login');
    });
});

module.exports = router;