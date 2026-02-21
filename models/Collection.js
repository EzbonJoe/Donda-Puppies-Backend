const mongoose = require('mongoose');

const collectionSchema = new mongoose.Schema({
  key: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  description: String,
  backgroundImage: String, 

  products: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }], // dog products
  puppies: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Puppy' }],   // optional puppy grouping
  services: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Service' }] // optional service grouping

}, { timestamps: true });

module.exports = mongoose.models.Collection || mongoose.model('Collection', collectionSchema);
