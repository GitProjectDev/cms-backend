const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const {
  registerUser,
  loginUser,
  changePassword,
  forgotPassword,
  resetPassword
} = require('../controllers/authController');

// Register
router.get('/register', (req, res) => res.render('auth/register'));
router.post('/register', registerUser);

// Login
router.get('/login', (req, res) => res.render('auth/login'));
router.post('/login', loginUser);

// Change Password
router.get('/change-password', authMiddleware, (req, res) => res.render('auth/change-password'));
router.post('/change-password', authMiddleware, changePassword);

// Forgot + Reset
router.get('/forgot-password', (req, res) => res.render('auth/forgot-password'));
router.post('/forgot-password', forgotPassword);

router.get('/reset-password', (req, res) => res.render('auth/reset-password', { email: req.query.email }));
router.post('/reset-password', resetPassword);

// Logout
router.get('/logout', (req, res) => {
  req.session.destroy(() => {
    res.clearCookie('sid');
    res.redirect('/auth/login');
  });
});

module.exports = router;
