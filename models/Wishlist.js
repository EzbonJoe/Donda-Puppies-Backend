const mongoose = require('mongoose');

const wishlistSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true // one wishlist per user
  },
  products: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product'
    }
  ],
  puppies: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Puppy'
    }
  ]
}, { timestamps: true });

module.exports = mongoose.model('Wishlist', wishlistSchema);
