const Wishlist = require("../models/Wishlist.js");

// Add product or puppy to wishlist
const addToWishlist = async (req, res) => {
  try {
    const userId = req.user?.id;
    const { productId, puppyId } = req.body;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (!productId && !puppyId) {
      return res.status(400).json({ message: "Product ID or Puppy ID is required" });
    }

    let wishlist = await Wishlist.findOne({ userId });

    if (!wishlist) {
      wishlist = new Wishlist({ userId, products: [], puppies: [] });
    }

    if (productId) {
      if (wishlist.products.includes(productId)) {
        return res.status(400).json({ message: "Product already in wishlist" });
      }
      wishlist.products.push(productId);
    }

    if (puppyId) {
      if (wishlist.puppies.includes(puppyId)) {
        return res.status(400).json({ message: "Puppy already in wishlist" });
      }
      wishlist.puppies.push(puppyId);
    }

    await wishlist.save();

    // Populate for response
    const populatedWishlist = await Wishlist.findById(wishlist._id)
      .populate('products', 'name images price')
      .populate('puppies', 'name breed age images');

    res.status(200).json({ message: "Item added to wishlist", wishlist: populatedWishlist });

  } catch (error) {
    console.error("Error adding to wishlist:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

// Get user's wishlist
const getWishlist = async (req, res) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const wishlist = await Wishlist.findOne({ userId })
      .populate('products', 'name images price')
      .populate('puppies', 'name breed age images');

    res.status(200).json(wishlist || { products: [], puppies: [] });

  } catch (error) {
    console.error("Error fetching wishlist:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

// Remove product or puppy from wishlist
const removeFromWishlist = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId, puppyId } = req.body;

    const wishlist = await Wishlist.findOne({ userId });
    if (!wishlist) return res.status(404).json({ message: "Wishlist not found" });

    if (productId) {
      if (!wishlist.products.includes(productId)) {
        return res.status(400).json({ message: "Product not in wishlist" });
      }
      wishlist.products = wishlist.products.filter(id => id.toString() !== productId);
    }

    if (puppyId) {
      if (!wishlist.puppies.includes(puppyId)) {
        return res.status(400).json({ message: "Puppy not in wishlist" });
      }
      wishlist.puppies = wishlist.puppies.filter(id => id.toString() !== puppyId);
    }

    await wishlist.save();

    const populatedWishlist = await Wishlist.findById(wishlist._id)
      .populate('products', 'name images price')
      .populate('puppies', 'name breed age images');

    res.status(200).json({ message: "Item removed from wishlist", wishlist: populatedWishlist });

  } catch (error) {
    console.error("Error removing from wishlist:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

module.exports = {
  addToWishlist,
  getWishlist,
  removeFromWishlist
};
