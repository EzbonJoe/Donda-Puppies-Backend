const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },

  description: {
    type: String
  },

  category: {
    type: String,
    enum: ["Grooming", "Training", "Other"],
    required: true
  },

  priceCents: {
    type: Number,
    required: true,
    min: 0
  },

  durationMinutes: {
    type: Number,
    required: true,
    min: 1
  },

  images: [String], // Optional images for service

  isActive: {
    type: Boolean,
    default: true
  }

}, { timestamps: true });

serviceSchema.index({ name: "text", description: "text" });

module.exports = mongoose.models.Service || mongoose.model('Service', serviceSchema);
