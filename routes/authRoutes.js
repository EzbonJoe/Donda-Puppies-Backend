const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const { registerUser, loginUser } = require('../controllers/authController.js');

// Route to register a new user
router.post('/register', registerUser);

// Route to log in an existing user
router.post('/login', loginUser);

module.exports = router;