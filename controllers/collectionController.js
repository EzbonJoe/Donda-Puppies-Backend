const Collection = require('../models/Collection.js'); 
const cloudinary = require("../config/cloudinary");
const slugify = require('slugify');

// Get all collections
const getAllCollections = async (req, res) => {
  try {
    const collections = await Collection.find()
      .populate('products')
      .populate('puppies')
      .populate('services');
    res.status(200).json(collections);
  } catch (error) {
    console.error('Error fetching collections:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

// Get collection by key
const getCollectionByKey = async (req, res) => {
  const { key } = req.params;
  try {
    const collection = await Collection.findOne({ key })
      .populate('products')
      .populate('puppies')
      .populate('services');

    if (!collection) {
      return res.status(404).json({ message: 'Collection not found' });
    }

    res.status(200).json(collection);
  } catch(error) {
    console.error('Error fetching collection:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

// Create a new collection
const createCollection = async (req, res) => {
  const { name, description, products, puppies, services } = req.body;
  const backgroundImage = req.file ? req.file.path : "";
  const backgroundImagePublicId = req.file ? req.file.filename : "";
  try {
    const parsedProducts = products ? JSON.parse(products) : [];
    const parsedPuppies = puppies ? JSON.parse(puppies) : [];
    const parsedServices = services ? JSON.parse(services) : [];
    const key = slugify(name, { lower: true, strict: true });

    const existing = await Collection.findOne({ key });
    if (existing) {
      return res.status(400).json({ message: 'Collection with this name already exists' });
    }

    const newCollection = new Collection({
      key,
      name,
      description,
      backgroundImage,
      backgroundImagePublicId,
      products: parsedProducts,
      puppies: parsedPuppies,
      services: parsedServices
    });

    await newCollection.save();
    res.status(201).json(newCollection);
  } catch (error) {
    console.error('Error creating collection:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

const updateCollection = async (req, res) => {
  const { id } = req.params;
  const { name, description, products, puppies, services } = req.body;

  try {
    const collection = await Collection.findById(id);
    if (!collection) {
      return res.status(404).json({ message: "Collection not found" });
    }

    const parsedProducts =
      typeof products === "string" ? JSON.parse(products) : products || [];

    const parsedPuppies =
      typeof puppies === "string" ? JSON.parse(puppies) : puppies || [];

    const parsedServices =
      typeof services === "string" ? JSON.parse(services) : services || [];

    const updateData = {
      name: name || collection.name,
      description: description || collection.description,
      products: parsedProducts,
      puppies: parsedPuppies,
      services: parsedServices,
    };

    // ✅ If new image uploaded
    if (req.file) {
      // 1️⃣ Delete old image from Cloudinary
      if (collection.backgroundImagePublicId) {
        await cloudinary.uploader.destroy(
          collection.backgroundImagePublicId
        );
      }

      // 2️⃣ Save new image
      updateData.backgroundImage = req.file.path;
      updateData.backgroundImagePublicId = req.file.filename;
    }

    const updatedCollection = await Collection.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    res.status(200).json(updatedCollection);
  } catch (error) {
    console.error("Error updating collection:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Delete collection
const deleteCollection = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedCollection = await Collection.findById(id);

    if (!deletedCollection) {
      return res.status(404).json({ message: "Collection not found" });
    }

    // ✅ Delete background image from Cloudinary
    if (deletedCollection.backgroundImagePublicId) {
      await cloudinary.uploader.destroy(
        deletedCollection.backgroundImagePublicId
      );
    }

    // ✅ Delete collection from database
    await Collection.findByIdAndDelete(id);

    res.status(200).json({
      message: "Collection deleted successfully",
    });

  } catch (error) {
    console.error("Error deleting collection:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  getAllCollections,
  getCollectionByKey,
  createCollection,
  updateCollection,
  deleteCollection
};
