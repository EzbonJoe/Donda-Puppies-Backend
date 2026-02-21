require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('./models/userModel.js');
const dns = require("node:dns/promises");

try {
  dns.setServers(['1.1.1.1', '8.8.8.8']);
  console.log('Custom DNS servers set ✅');
} catch (err) {
  console.warn('Could not set custom DNS servers ⚠️');
}

const seedUser = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected ✅");

    const hashedPassword = await bcrypt.hash('password123', 10);

    const user = new User({
      name: 'Test Puppy',
      email: 'puppy@test.com',
      password: hashedPassword,
      phone: '+256700000000',
      shippingAddress: {
        fullName: 'Test Puppy',
        phone: '+256700000000',
        addressLine: '123 Puppy Street',
        city: 'Kampala',
        region: 'Central'
      },
      dogOwnerInfo: {
        numberOfDogs: 1,
        favoriteBreed: 'Labrador'
      }
    });

    await user.save();
    console.log('User created successfully!');
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seedUser();
