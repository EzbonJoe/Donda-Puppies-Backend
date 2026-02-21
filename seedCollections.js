const mongoose = require("mongoose");
require("dotenv").config();

const Collection = require("./models/Collection"); // adjust path
const Puppy = require("./models/PuppyModel");            // to reference puppies

// Example seed data
const collections = [
  {
    key: "golden-retrievers",
    name: "Golden Retrievers",
    description: "Friendly, loyal, and playful pups perfect for families.",
    backgroundImage: "/uploads/golden-retriever.jpg",
    puppies: [],  // we will populate later with ObjectId of puppies
  },
  {
    key: "french-bulldogs",
    name: "French Bulldogs",
    description: "Compact and affectionate pups ideal for apartment living.",
    backgroundImage: "/uploads/bulldog.jpg",
    puppies: [],
  },
  {
    key: "vaccinated-puppies",
    name: "Vaccinated Puppies",
    description: "All puppies in this collection are fully vaccinated and healthy.",
    backgroundImage: "/uploads/german-shepard.jpg",
    puppies: [],
  },
  {
    key: "featured-puppies",
    name: "Featured Puppies",
    description: "Our handpicked puppies ready for their forever homes.",
    backgroundImage: "/uploads/pitbull.jpg",
    puppies: [],
  }
];

const seedCollections = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB Connected");

    await Collection.deleteMany();
    console.log("🗑 Old collections removed");

    // Optional: link puppies dynamically
    const allPuppies = await Puppy.find();
    
    collections.forEach((col) => {
      // Example: assign first 2 puppies to featured
      if (col.key === "featured-puppies") col.puppies = allPuppies.slice(0, 2).map(p => p._id);

      // Example: assign Golden Retrievers only
      if (col.key === "golden-retrievers")
        col.puppies = allPuppies.filter(p => p.breed === "Golden Retriever").map(p => p._id);

      if (col.key === "french-bulldogs")
        col.puppies = allPuppies.filter(p => p.breed === "French Bulldog").map(p => p._id);

      if (col.key === "vaccinated-puppies")
        col.puppies = allPuppies.filter(p => p.vaccinated).map(p => p._id);
    });

    await Collection.insertMany(collections);
    console.log("🌱 Collections seeded successfully!");

    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

seedCollections();
