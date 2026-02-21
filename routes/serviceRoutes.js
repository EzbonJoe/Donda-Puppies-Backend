const express = require('express');
const { upload } = require('../middleware/upload.js');
const {
  createService,
  getServices,
  getServiceById,
  updateService,
  deleteService
} = require( "../controllers/serviceController.js");

const router = express.Router();

// Public routes
router.get("/", getServices);
router.get("/:id", getServiceById);

// Admin routes (protect with auth middleware later)
router.post("/", upload.array("images", 5), createService);
router.put("/:id", upload.array("images", 5), updateService);
router.delete("/:id", deleteService);

module.exports = router;
