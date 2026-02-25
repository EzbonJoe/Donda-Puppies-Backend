const Product = require('../models/Product.js');
const Collection = require('../models/Collection.js');
const cloudinary = require('../config/cloudinary');

// Get all products with collections
const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();

    // Include collections each product belongs to
    const productsWithCollections = await Promise.all(
      products.map(async (product) => {
        const collections = await Collection.find({ products: product._id });
        return { ...product.toObject(), collections };
      })
    );

    res.status(200).json(productsWithCollections);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get single product by ID with collections
const getProductById = async (req, res) => {
  const { id } = req.params;
  try {
    const product = await Product.findById(id);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    const collections = await Collection.find({ products: product._id });

    res.status(200).json({ ...product.toObject(), collections });
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Create new product
const createProduct = async (req, res) => {
  try {
    const { name, description, category, brand, priceCents, stock } = req.body;

    const images = req.files ? req.files.map(file => file.path) : [];
    const imagesPublicIds = req.files ? req.files.map(file => file.filename) : [];

    const newProduct = new Product({
      name,
      description,
      category,
      brand,
      priceCents: Number(priceCents),
      stock: Number(stock) || 0,
      images,
      imagesPublicIds
    });

    await newProduct.save();
    res.status(201).json(newProduct);
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Update existing product
const updateProduct = async (req, res) => {
  const { id } = req.params;

  try {
    const updates = {
      name: req.body.name,
      description: req.body.description,
      category: req.body.category,
      brand: req.body.brand,
      priceCents: req.body.priceCents ? Number(req.body.priceCents) : undefined,
      stock: req.body.stock ? Number(req.body.stock) : undefined
    };

    // Remove undefined keys
    Object.keys(updates).forEach(key => updates[key] === undefined && delete updates[key]);

    // Handle uploaded images
    if (req.files && req.files.length > 0) {
      const newImages = req.files.map(file => file.path);
      const newImagesPublicIds = req.files.map(file => file.filename);

      // Get existing product to delete old images
      const existingProduct = await Product.findById(id);
      if (!existingProduct) return res.status(404).json({ message: 'Product not found' });

      // Delete old images from Cloudinary
      if (existingProduct.imagesPublicIds && existingProduct.imagesPublicIds.length > 0) {
        for (const publicId of existingProduct.imagesPublicIds) {
          await cloudinary.uploader.destroy(publicId);
        }
      }
      
      updates.images = newImages;
      updates.imagesPublicIds = newImagesPublicIds;
    }


    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      updates,      
      { new: true, runValidators: true }
    );

    if (!updatedProduct) return res.status(404).json({ message: 'Product not found' });

    // Include collections
    const collections = await Collection.find({ products: updatedProduct._id });

    res.status(200).json({ ...updatedProduct.toObject(), collections });
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Delete product
const deleteProduct = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedProduct = await Product.findByIdAndDelete(id);
    if (!deletedProduct) return res.status(404).json({ message: 'Product not found' });

    // Delete images from Cloudinary
    if (deletedProduct.imagesPublicIds && deletedProduct.imagesPublicIds.length > 0) {
      for (const publicId of deletedProduct.imagesPublicIds) {
        await cloudinary.uploader.destroy(publicId);
      }
    }

    

    // Optionally remove product from collections
    await Collection.updateMany(
      { products: id },
      { $pull: { products: id } }
    );

    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
};
