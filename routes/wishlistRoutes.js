const express = require('express');
const { addToWishlist, getWishlist, removeFromWishlist } = require('../controllers/wishlistController.js');
const { protect } = require('../middleware/authMiddleware.js');

const router = express.Router();

// Add a product or puppy to the wishlist
router.post('/add', protect, addToWishlist);

// Get the user's wishlist
router.get('/', protect, getWishlist);

// Remove a product or puppy from the wishlist
// Frontend should pass { productId } or { puppyId } in request body
router.delete('/remove', protect, removeFromWishlist);

module.exports = router;
