const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  itemType: {
    type: String,
    required: true,
    enum: ["Product", "Service", "Puppy"]  
  },
  product: { 
    type: mongoose.Schema.Types.ObjectId, 
    refPath: 'items.itemType', // dynamic ref
    required: true 
  },
  quantity: { type: Number, required: true, min: 1 },
  deliveryType: { 
    type: String,
    enum: ['Home Delivery', 'Pickup'], 
    default: 'Pickup' 
  }
});

const shippingAddressSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  phone: { type: String, required: true },
  addressLine: { type: String, required: true },
  city: { type: String, required: true },
  region: { type: String, required: true }
});

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },

  items: [orderItemSchema],

  shippingAddress: shippingAddressSchema, // optional if all items are pickup

  paymentMethod: {
    type: String,
    required: true,
    enum: ['Cash on Delivery', 'Mobile Money', 'Credit Card']
  },

  totalAmount: { type: Number, required: true },

  paymentStatus: {
    type: String,
    enum: ['Pending', 'Paid', 'Failed'],
    default: 'Pending'
  },

  status: {
    type: String,
    enum: ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'],
    default: 'Pending'
  },

  deliveryDate: { type: Date }, 
  trackingNumber: { type: String }, 
  paidAt: { type: Date }, 
  deliveredAt: { type: Date }, 

}, { timestamps: true });

module.exports = mongoose.models.Order || mongoose.model('Order', orderSchema);
