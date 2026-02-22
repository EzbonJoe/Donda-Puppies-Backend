const Puppy = require('../models/PuppyModel.js');

// @desc    Create a new puppy
// @route   POST /api/puppies
// @access  Admin
const createPuppy = async (req, res) => {
  try {
    const images = req.files
      ? req.files.map(file => `/uploads/${file.filename}`)
      : [];

    const newPuppy = new Puppy({ ...req.body, images });
    const savedPuppy = await newPuppy.save();

    res.status(201).json(savedPuppy);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all puppies (optionally filter by availability)
// @route   GET /api/puppies
// @access  Public
const getPuppies = async (req, res) => {
  try {
    const { available } = req.query; // ?available=true
    const filter = available === "true" ? { isAvailable: true } : {};
    const puppies = await Puppy.find(filter).sort({ createdAt: -1 });
    res.json(puppies);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single puppy by ID
// @route   GET /api/puppies/:id
// @access  Public
const getPuppyById = async (req, res) => {
  try {
    const puppy = await Puppy.findById(req.params.id);
    if (!puppy) return res.status(404).json({ message: "Puppy not found" });
    res.json(puppy);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update puppy
// @route   PUT /api/puppies/:id
// @access  Admin

// Update Puppy with new images
const updatePuppy = async (req, res) => {
  try {
    const images = req.files ? req.files.map(file => file.path) : undefined;

    const updateData = { ...req.body };
    if (images) updateData.images = images; // only overwrite if new images uploaded

    const updatedPuppy = await Puppy.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!updatedPuppy) return res.status(404).json({ message: "Puppy not found" });
    res.json(updatedPuppy);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// @desc    Delete puppy
// @route   DELETE /api/puppies/:id
// @access  Admin
const deletePuppy = async (req, res) => {
  try {
    const deleted = await Puppy.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Puppy not found" });
    res.json({ message: "Puppy deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  deletePuppy,
  updatePuppy,
  getPuppyById,
  getPuppies,
  createPuppy
}
