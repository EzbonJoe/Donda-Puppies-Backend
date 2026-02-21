const express = require('express');
const router = express.Router();

const {
  getBestSellingPuppies
} = require('../controllers/bestSellerController');

router.get('/best-sellers', getBestSellingPuppies);

module.exports = router;