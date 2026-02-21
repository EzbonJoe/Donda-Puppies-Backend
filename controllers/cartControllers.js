const Cart = require('../models/Cart.js');

// Create a new cart for a user if it doesn't exist
const createNewCart = async (req, res) => {
  try {
    const userId = req.user.id;
    let cart = await Cart.findOne({ user: userId });
    if (cart) return res.status(200).json(cart);

    cart = new Cart({ user: userId, items: [] });
    await cart.save();
    res.status(201).json(cart);
  } catch (error) {
    console.error('Error creating cart:', error);
    res.status(500).json({ message: error.message });
  }
};

// Get cart by user ID and populate products/services
const getCartById = async (req, res) => {
  try {
    const { userId } = req.params;

    const cart = await Cart.findOne({ user: userId })
      .populate('items.product')
      .populate('items.service');

    if (!cart) return res.status(200).json({ cartItems: [] });

    const cartItems = cart.items.map(item => ({
      _id: item._id,
      product: item.product,
      service: item.service,
      quantity: item.quantity,
      deliveryOptionId: item.deliveryOptionId,
      serviceDate: item.serviceDate,
      serviceOptionId: item.serviceOptionId
    }));

    res.status(200).json({ cartItems });
  } catch (error) {
    console.error('Error fetching cart:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Add product or service to cart
const addItemToCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId, serviceId, quantity = 1, deliveryOptionId, serviceDate, serviceOptionId } = req.body;

    if (!productId && !serviceId) {
      return res.status(400).json({ message: 'Must provide productId or serviceId' });
    }

    let cart = await Cart.findOne({ user: userId });
    if (!cart) cart = new Cart({ user: userId, items: [] });

    // Check if the item already exists
    let itemIndex;
    if (productId) {
      itemIndex = cart.items.findIndex(item => item.product?.toString() === productId);
    } else {
      itemIndex = cart.items.findIndex(item => item.service?.toString() === serviceId);
    }

    if (itemIndex > -1) {
      // Update quantity if already exists
      cart.items[itemIndex].quantity += quantity;
      if (deliveryOptionId) cart.items[itemIndex].deliveryOptionId = deliveryOptionId;
      if (serviceDate) cart.items[itemIndex].serviceDate = serviceDate;
      if (serviceOptionId) cart.items[itemIndex].serviceOptionId = serviceOptionId;
    } else {
      // Add new item
      const newItem = productId
        ? { product: productId, quantity, deliveryOptionId }
        : { service: serviceId, quantity, serviceDate, serviceOptionId };
      cart.items.push(newItem);
    }

    await cart.save();

    const populatedCart = await Cart.findById(cart._id)
      .populate('items.product')
      .populate('items.service');

    res.status(200).json(populatedCart);
  } catch (error) {
    console.error('Error adding item to cart:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Update cart item (quantity, serviceDate, serviceOptionId)
const updateCartItem = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId, serviceId, quantity, serviceDate, serviceOptionId } = req.body;

    const cart = await Cart.findOne({ user: userId });
    if (!cart) return res.status(404).json({ message: 'Cart not found' });

    const itemIndex = productId
      ? cart.items.findIndex(item => item.product?.toString() === productId)
      : cart.items.findIndex(item => item.service?.toString() === serviceId);

    if (itemIndex === -1) return res.status(404).json({ message: 'Item not found in cart' });

    if (quantity) cart.items[itemIndex].quantity = quantity;
    if (serviceDate) cart.items[itemIndex].serviceDate = serviceDate;
    if (serviceOptionId) cart.items[itemIndex].serviceOptionId = serviceOptionId;

    await cart.save();

    const populatedCart = await Cart.findById(cart._id)
      .populate('items.product')
      .populate('items.service');

    res.status(200).json(populatedCart);
  } catch (error) {
    console.error('Error updating cart item:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Remove item from cart
const removeItemFromCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId, serviceId } = req.body;

    const cart = await Cart.findOne({ user: userId });
    if (!cart) return res.status(404).json({ message: 'Cart not found' });

    const itemIndex = productId
      ? cart.items.findIndex(item => item.product?.toString() === productId)
      : cart.items.findIndex(item => item.service?.toString() === serviceId);

    if (itemIndex === -1) return res.status(404).json({ message: 'Item not found in cart' });

    // Reduce quantity or remove
    if (cart.items[itemIndex].quantity > 1) {
      cart.items[itemIndex].quantity -= 1;
    } else {
      cart.items.splice(itemIndex, 1);
    }

    await cart.save();

    const populatedCart = await Cart.findById(cart._id)
      .populate('items.product')
      .populate('items.service');

    res.status(200).json(populatedCart);
  } catch (error) {
    console.error('Error removing cart item:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Clear entire cart
const clearCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const cart = await Cart.findOne({ user: userId });
    if (!cart) return res.status(404).json({ message: 'Cart not found' });

    cart.items = [];
    await cart.save();

    res.status(200).json(cart);
  } catch (error) {
    console.error('Error clearing cart:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Update delivery option (for products only)
const updateDeliveryOptionId = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId, deliveryOptionId } = req.body;

    const cart = await Cart.findOne({ user: userId });
    if (!cart) return res.status(404).json({ message: 'Cart not found' });

    const itemIndex = cart.items.findIndex(item => item.product?.toString() === productId);
    if (itemIndex === -1) return res.status(404).json({ message: 'Item not found in cart' });

    cart.items[itemIndex].deliveryOptionId = deliveryOptionId;
    await cart.save();

    const populatedCart = await Cart.findById(cart._id)
      .populate('items.product')
      .populate('items.service');

    res.status(200).json(populatedCart);
  } catch (error) {
    console.error('Error updating delivery option:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  createNewCart,
  getCartById,
  addItemToCart,
  updateCartItem,
  removeItemFromCart,
  clearCart,
  updateDeliveryOptionId
};
