const express = require('express');

const {
  createPuppy,
  getPuppies,
  getPuppyById,
  updatePuppy,
  deletePuppy
} = require("../controllers/puppyController.js");

const router = express.Router();
const { upload } = require('../middleware/upload.js');

// Public routes
router.get("/", getPuppies);
router.get("/:id", getPuppyById);

// Admin routes (protected later with auth middleware)
router.post("/", upload.array("images", 5), createPuppy); // max 5 images
router.put("/:id", upload.array("images", 5), updatePuppy);
router.delete("/:id", deletePuppy);

module.exports = router;
