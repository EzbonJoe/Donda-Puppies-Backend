const mongoose = require('mongoose');

const addressSchema = new mongoose.Schema({
  fullName: { type: String },
  phone: { type: String },
  addressLine: { type: String },
  city: { type: String },
  region: { type: String },
}, { _id: false });

const UserSchema = new mongoose.Schema({
  name : {
    type: String,
    required: [true, 'Name is required'],
    trim: true
  },

  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    trim: true,
    lowercase: true,
    validate: {
      validator: function(v) {
        return /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/.test(v);
      },
      message: props => `${props.value} is not a valid email!`
    }
  },

  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters long']
  },

  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    trim: true,
    validate: {
      validator: function(v) {
        return /^(\+?\d{7,15})$/.test(v);
      },
      message: props => `${props.value} is not a valid phone number!`
    }
  },

  shippingAddress: addressSchema,  // new field

  dogOwnerInfo: {                  // optional
    numberOfDogs: { type: Number, default: 0 },
    favoriteBreed: { type: String }
  },

  avatar: { type: String },        // optional user profile image

  newsletterSubscribed: { type: Boolean, default: true },

  tokenVersion: { type: Number, default: 0 }, 
  isAdmin: { type: Boolean, default: false }

}, { timestamps: true });

module.exports = mongoose.models.User || mongoose.model('User', UserSchema);
