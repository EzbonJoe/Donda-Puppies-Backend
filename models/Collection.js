const mongoose = require('mongoose');

const collectionSchema = new mongoose.Schema({
  key: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  description: String,

  // Cloudinary image URL
  backgroundImage: {
    type: String,
  },

  // Cloudinary public_id (needed for deletion)
  backgroundImagePublicId: {
    type: String,
  },

  products: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
  puppies: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Puppy' }],
  services: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Service' }]

}, { timestamps: true });

module.exports =
  mongoose.models.Collection ||
  mongoose.model('Collection', collectionSchema);