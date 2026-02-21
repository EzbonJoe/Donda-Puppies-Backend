const Service = require('../models/Service.js');

// @desc    Create a new service
// @route   POST /api/services
// @access  Admin
const createService = async (req, res) => {
  try {
    const images = req.files ? req.files.map(file => file.path) : [];
    const newService = new Service({ ...req.body, images });
    const savedService = await newService.save();
    res.status(201).json(savedService);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all services (optionally filter active ones)
// @route   GET /api/services
// @access  Public
const getServices = async (req, res) => {
  try {
    const { active } = req.query; // ?active=true
    const filter = active === "true" ? { isActive: true } : {};
    const services = await Service.find(filter).sort({ createdAt: -1 });
    res.json(services);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single service by ID
// @route   GET /api/services/:id
// @access  Public
const getServiceById = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) return res.status(404).json({ message: "Service not found" });
    res.json(service);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update service
// @route   PUT /api/services/:id
// @access  Admin
const updateService = async (req, res) => {
  try {
    const images = req.files ? req.files.map(file => file.path) : undefined;

    const updateData = { ...req.body };
    if (images) updateData.images = images;

    const updatedService = await Service.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!updatedService) return res.status(404).json({ message: "Service not found" });
    res.json(updatedService);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete service
// @route   DELETE /api/services/:id
// @access  Admin
const deleteService = async (req, res) => {
  try {
    const deleted = await Service.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Service not found" });
    res.json({ message: "Service deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  deleteService,
  updateService,
  getServices,
  createService,
  getServiceById
}
