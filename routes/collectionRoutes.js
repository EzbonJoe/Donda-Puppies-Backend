const express = require('express');
const router = express.Router();

const {
  getAllCollections,
  getCollectionByKey,
  createCollection,
  updateCollection,
  deleteCollection
} = require('../controllers/collectionController.js'); // updated controller name

const { protect } = require('../middleware/authMiddleware.js');
const { isAdmin } = require('../middleware/adminMiddleware.js');
const { upload } = require('../middleware/upload.js');

// Public routes
router.get('/', getAllCollections);
router.get('/:key', getCollectionByKey);

// Admin routes
router.post('/', protect, isAdmin, upload.single('backgroundImage'), createCollection);
router.patch('/:id', protect, isAdmin, upload.single('backgroundImage'), updateCollection);
router.delete('/:id', protect, isAdmin, deleteCollection);

module.exports = router;
