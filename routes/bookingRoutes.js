const express = require('express');
const {
  createBooking,
  getUserBookings,
  getAllBookings,
  updateBookingStatus,
  deleteBooking
} = require ("../controllers/bookingController.js");

const { protect } = require("../middleware/authMiddleware.js"); // implement auth
const { isAdmin } = require('../middleware/adminMiddleware.js'); 

const router = express.Router();

// User routes
router.post("/", protect, createBooking);
router.get("/my", protect, getUserBookings);

// Admin routes
router.get("/", protect, isAdmin, getAllBookings);
router.put("/:id", protect, isAdmin, updateBookingStatus);
router.delete("/:id", protect, isAdmin, deleteBooking);

module.exports = router;

