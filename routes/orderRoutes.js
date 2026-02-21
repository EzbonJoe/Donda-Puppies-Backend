const express = require('express');
const router = express.Router();
const {
  placeOrder,
  getMyOrders,
  getOrderById,
  getAllOrders,
  updateOrderStatus
} = require('../controllers/orderController.js');

const { protect } = require('../middleware/authMiddleware.js');
const { isAdmin } = require('../middleware/adminMiddleware.js');

router.post('/place', protect, placeOrder); // Place a new order
router.get('/my-orders', protect, getMyOrders); // Get orders for the authenticated user
router.get('/admin', protect, isAdmin, getAllOrders); // Get all orders (admin only)
router.get('/:id', protect, getOrderById); // Get a specific order by ID for the authenticated user
router.patch('/:id/status', protect, isAdmin, updateOrderStatus); // Update order status (admin only)

module.exports = router;