const mongoose = require('mongoose');

const puppySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },

  breed: {
    type: String,
    required: true
  },

  ageInWeeks: { // easier for puppies
    type: Number,
    required: true,
    min: 0
  },

  gender: {
    type: String,
    required: true,
    enum: ['Male', 'Female']
  },

  priceCents: {
    type: Number,
    required: true,
    min: 0
  },

  description: {
    type: String
  },

  images: [String], // multiple pictures of the puppy

  isAvailable: {
    type: Boolean,
    default: true
  },

  vaccinated: {
    type: Boolean,
    default: false
  },

  dewormed: {
    type: Boolean,
    default: false
  },

  trained: {
    type: Boolean,
    default: false
  },
  bestSeller: {
    type: Boolean,
    default: false
  }

}, { timestamps: true });

puppySchema.index({ name: "text", breed: "text", description: "text" });

module.exports = mongoose.models.Puppy || mongoose.model('Puppy', puppySchema);
