const express = require('express');
const router = express.Router()
const { setBestSeller } = require('../controllers/adminBestSellerController');
const { isAdmin } = require('../middleware/adminMiddleware');

router.patch('/puppy/:id/best-seller', isAdmin, setBestSeller);

module.exports = router;