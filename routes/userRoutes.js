const express = require('express');
const router = express.Router();
const { getUserProfile, updateUserProfile, getAllUsers, updateUser, deleteUser, changePassword, logoutAllDevices } = require('../controllers/userController.js');
const { protect } = require('../middleware/authMiddleware.js');

// Route to get user profile
router.get('/profile', protect, getUserProfile);

// Route to update user profile
router.patch('/profile', protect, updateUserProfile); 

// Route to get all users (admin only)
router.get('/', protect, getAllUsers);

// Route to change password
router.patch('/change-password', protect, changePassword);

// Route to logout from all devices
router.post('/logout-all', protect, logoutAllDevices);

// Route to update user (admin only)
router.patch('/:id', protect, updateUser);

// Route to delete user (admin only)
router.delete('/:id', protect, deleteUser);




module.exports = router;