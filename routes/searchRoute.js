const express = require("express");
const Product = require("../models/Product.js");
const router = express.Router();

// GET /api/search?query=chair
router.get("/", async (req, res) => {
  const { query } = req.query;
  console.log(`Received search query: ${query}`);

  if (!query) return res.status(400).json({ success: false, msg: "Query is required" });  

  try {
    // Case-insensitive search on name and description
    const products = await Product.find({
      $text: { $search: query }
    });    
   

    res.json({ success: true, products });
    console.log(`Search performed for query: ${query}`);
    console.log(`Found ${products.length} products`);
    console.log(products);
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, msg: "Server error" });
  }
});

module.exports = router;