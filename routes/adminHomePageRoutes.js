const {
  getDashboardStats, getSalesOverTime
} = require("../controllers/adminHomePageController.js");
const { protect } = require("../middleware/authMiddleware.js");
const { isAdmin } = require("../middleware/adminMiddleware.js");
const express = require("express");
const router = express.Router();

router.get("/dashboard-stats", protect, isAdmin, getDashboardStats);
router.get("/sales", protect, isAdmin, getSalesOverTime);

module.exports = router;