const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const { registerUser, loginUser, changePassword } = require('../controllers/authController');

// Render registration form
router.get('/register', (req, res) => {
  res.render('auth/register');
});

// Handle registration
router.post('/register', registerUser);

// Render login form
router.get('/login', (req, res) => {
  res.render('auth/login');
});

// Handle login
router.post('/login', loginUser);

// Render change password form (protected)
router.get('/change-password', authMiddleware, (req, res) => {
  res.render('auth/change-password');
});

// Handle change password (protected)
router.post('/change-password', authMiddleware, changePassword);

// Logout
router.get('/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/auth/login');
  });
});

module.exports = router;
