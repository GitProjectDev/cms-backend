// src/routes/dashboard.js
const express = require('express');
const router = express.Router();
const { renderDashboard } = require('../controllers/dashboardController');

// Protect this route with an authentication check if needed
router.get('/', (req, res, next) => {
  if (!req.session.user) {
    req.flash('error', 'Please log in first');
    return res.redirect('/auth/login');
  }
  next();
}, renderDashboard);

module.exports = router;
