const mongoose = require('mongoose'); 

const cartItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
  service: { type: mongoose.Schema.Types.ObjectId, ref: 'Service' },

  quantity: { type: Number, default: 1, min: 1 },

  // For services only
  serviceDate: { type: Date },
  serviceOptionId: { type: String },

  deliveryOptionId: {
    type: String, 
    default: "1"
  }
});

// Custom validation to ensure either product or service is set
cartItemSchema.pre('validate', function () {
  if (!this.product && !this.service) {
    throw new Error('Cart item must have either a product or a service.');
  }

  if (this.product && this.service) {
    throw new Error('Cart item cannot have both product and service.');
  }
});

const cartSchema = new mongoose.Schema({
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true, 
    unique: true // each user has only one cart
  },
  items: [cartItemSchema],
  createdAt: { type: Date, default: Date.now },
}, { timestamps: true });

module.exports = mongoose.model('Cart', cartSchema);
