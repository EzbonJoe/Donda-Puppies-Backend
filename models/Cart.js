const mongoose = require('mongoose'); 

const cartItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
  service: { type: mongoose.Schema.Types.ObjectId, ref: 'Service' },
  puppy: { type: mongoose.Schema.Types.ObjectId, ref: 'Puppy' }, // new field for puppies
  

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
  if (!this.product && !this.service && !this.puppy) {
    throw new Error('Cart item must have either a product, service, or puppy.');
  }

  if ((this.product && this.service) || (this.product && this.puppy) || (this.service && this.puppy)) {
    throw new Error('Cart item cannot have more than one of product, service, or puppy.');

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
