const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
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
    required: true,
    enum: ["Shampoo", "Accessories", "Food", "Other"]
  },

  brand: {
    type: String
  },

  priceCents: { 
    type: Number, 
    required: true,
    min: 0
  },

  stock: {
    type: Number,
    default: 0,
    min: 0
  },

  images: [{ type: String }],
  imagesPublicIds: [{ type: String }],

  isActive: {
    type: Boolean,
    default: true
  }

}, { timestamps: true });

productSchema.index({ name: "text", description: "text" });

module.exports = mongoose.models.Product || mongoose.model('Product', productSchema);
