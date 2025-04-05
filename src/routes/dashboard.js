
const express = require('express');
const router = express.Router();
const { renderDashboard } = require('../controllers/dashboardController'); 


router.get('/', renderDashboard); 

module.exports = router;
