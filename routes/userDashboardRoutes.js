const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();

const { getUserDashboard } = require('../controllers/userDashboardController.js');
const { protect } = require('../middleware/authMiddleware.js');

// Route to get user dashboard data
router.get('/dashboard', protect, getUserDashboard);

module.exports = router;