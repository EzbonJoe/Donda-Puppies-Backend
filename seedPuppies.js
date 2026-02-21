const mongoose = require("mongoose");
require("dotenv").config();

const Puppy = require("./models/PuppyModel"); // adjust path if needed

const puppies = [
  {
    name: "Max",
    breed: "Golden Retriever",
    ageInWeeks: 10,
    gender: "Male",
    priceCents: 120000, // $1200
    description: "Playful, friendly and great with kids.",
    images: [
      "/uploads/golden-retriever.jpg",
      "/uploads/golden-retriever.jpg"
    ],
    isAvailable: true,
    vaccinated: true,
    dewormed: true,
    bestSeller: true,
    trained: false
  },
  {
    name: "Bella",
    breed: "French Bulldog",
    ageInWeeks: 8,
    gender: "Female",
    priceCents: 150000,
    description: "Small, affectionate and perfect for apartments.",
    images: [
      "/uploads/bulldog.jpg"
    ],
    isAvailable: true,
    vaccinated: true,
    dewormed: true,
    bestSeller: true,
    trained: false
  },
  {
    name: "Rocky",
    breed: "German Shepherd",
    ageInWeeks: 12,
    gender: "Male",
    priceCents: 180000,
    description: "Strong, intelligent and protective family puppy.",
    images: [
      "/uploads/german-shepard.jpg"
    ],
    isAvailable: false,
    vaccinated: true,
    dewormed: true,
    bestSeller: true,
    trained: true
  },
  {
    name: "Luna",
    breed: "Indian-Spitz",
    ageInWeeks: 9,
    gender: "Female",
    priceCents: 100000,
    description: "Highly intelligent and hypoallergenic.",
    images: [
      "/uploads/Indian_Spitz_Dog.jpg"
    ],
    isAvailable: true,
    vaccinated: false,
    dewormed: true,
    bestSeller: true,
    trained: false
  }
];

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB Connected");

    await Puppy.deleteMany();
    console.log("🗑 Old puppies removed");

    await Puppy.insertMany(puppies);
    console.log("🌱 Puppies seeded successfully!");

    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

seedDatabase();
