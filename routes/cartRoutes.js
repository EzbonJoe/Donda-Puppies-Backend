const express = require('express');
const router = express.Router();

const {
  createNewCart,
  getCartById,
  addItemToCart,
  updateCartItem,
  removeItemFromCart,
  clearCart,
  updateDeliveryOptionId
} = require('../controllers/cartControllers.js'); // note singular name match

const { protect } = require('../middleware/authMiddleware.js');

// Create a new cart for the logged-in user
router.post('/', protect, createNewCart);

// Add item to cart (product or service)
router.post('/add-item', protect, addItemToCart);


// Update cart item (quantity, service date, service option)
router.patch('/update-item', protect, updateCartItem);

// Remove item from cart
router.delete('/remove-item', protect, removeItemFromCart);

// Update delivery option for products
router.patch('/update-delivery-option', protect, updateDeliveryOptionId);

// Get cart by user ID
router.get('/:userId', protect, getCartById);

// Clear entire cart
router.delete('/clear/:userId', protect, clearCart);

module.exports = router;
