const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Product = require("./models/Product");
const dns = require("node:dns/promises");

dotenv.config();

// 🔥 ADD THIS
try {
  dns.setServers(['1.1.1.1', '8.8.8.8']);
  console.log('Custom DNS servers set ✅');
} catch (err) {
  console.warn('Could not set custom DNS servers ⚠️');
}

const products = [
  // 🧴 SHAMPOO
  {
    name: "Puppy Gentle Oatmeal Shampoo",
    description: "Mild oatmeal shampoo specially formulated for puppies with sensitive skin.",
    category: "Shampoo",
    brand: "PetCare",
    priceCents: 3500000, // UGX 35,000
    stock: 50,
    images: ["/uploads/puppy-oatmeal-shampoo.jpg"],
  },
  {
    name: "Flea & Tick Defense Shampoo",
    description: "Deep cleansing shampoo that eliminates fleas and ticks while protecting your dog’s coat.",
    category: "Shampoo",
    brand: "VetShield",
    priceCents: 4500000, // UGX 45,000
    stock: 40,
    images: ["/uploads/flea-tick-shampoo.jpg"],
  },

  // 🦴 FOOD
  {
    name: "Premium Puppy Growth Formula",
    description: "High-protein dog food designed for healthy growth and strong bones.",
    category: "Food",
    brand: "Royal Bark",
    priceCents: 12000000, // UGX 120,000
    stock: 30,
    images: ["/uploads/puppy-food.jpg"],
  },
  {
    name: "Adult Dog Chicken & Rice",
    description: "Balanced nutrition for adult dogs with real chicken and rice.",
    category: "Food",
    brand: "Happy Paws",
    priceCents: 9500000, // UGX 95,000
    stock: 45,
    images: ["/uploads/adult-dog-food.jpg"],
  },

  // 🐕 ACCESSORIES
  {
    name: "Adjustable Leather Dog Collar",
    description: "Durable leather collar with adjustable strap and metal buckle.",
    category: "Accessories",
    brand: "BarkStyle",
    priceCents: 2500000, // UGX 25,000
    stock: 60,
    images: ["/uploads/leather-collar.jpg"],
  },
  {
    name: "Retractable Dog Leash (5m)",
    description: "Strong retractable leash giving your dog freedom while staying safe.",
    category: "Accessories",
    brand: "PawControl",
    priceCents: 4000000, // UGX 40,000
    stock: 35,
    images: ["/uploads/dog-leash.jpg"],
  },

  // 📦 OTHER
  {
    name: "Portable Dog Water Bottle",
    description: "Travel-friendly water bottle with built-in drinking tray.",
    category: "Other",
    brand: "TravelPet",
    priceCents: 3000000, // UGX 30,000
    stock: 70,
    images: ["/uploads/dog-water-bottle.jpg"],
  },
  {
    name: "Comfortable Dog Bed (Medium)",
    description: "Soft and cozy dog bed perfect for medium-sized dogs.",
    category: "Other",
    brand: "CozyPaws",
    priceCents: 8500000, // UGX 85,000
    stock: 20,
    images: ["/uploads/dog-bed.jpg"],
  },
];

const seedProducts = async () => {
  try {
    // ✅ WAIT for DB connection
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB Connected ✅");

    await Product.deleteMany();
    console.log("Old products deleted");

    await Product.insertMany(products);
    console.log("Products seeded successfully! 🚀");

    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

seedProducts();
