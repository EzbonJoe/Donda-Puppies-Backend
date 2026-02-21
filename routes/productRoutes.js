const express = require('express');
const router = express.Router();

const {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
} = require('../controllers/productController');

const { protect } = require('../middleware/authMiddleware.js');
const { isAdmin } = require('../middleware/adminMiddleware.js');
const { upload } = require('../middleware/upload.js');

router.get('/', getAllProducts);
router.post('/', upload.array('images', 10), protect, isAdmin, createProduct);
router.get('/:id', getProductById);
router.patch('/:id', upload.array('images', 10),protect, isAdmin, updateProduct);
router.delete('/:id', protect, isAdmin, deleteProduct);

module.exports = router;