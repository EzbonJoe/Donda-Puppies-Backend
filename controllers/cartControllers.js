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
      .populate('items.service')
      .populate('items.puppy'); // new population for puppies

    if (!cart) return res.status(200).json({ cartItems: [] });

    const cartItems = cart.items.map(item => ({
      _id: item._id,
      product: item.product,
      service: item.service,
      puppy: item.puppy,
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
    const {
      productId,
      serviceId,
      puppyId,
      quantity = 1,
      deliveryOptionId,
      serviceDate,
      serviceOptionId
    } = req.body;

    if (!productId && !serviceId && !puppyId) {
      return res.status(400).json({ message: 'Must provide productId, serviceId, or puppyId' });
    }

    let cart = await Cart.findOne({ user: userId });
    if (!cart) cart = new Cart({ user: userId, items: [] });

    // Determine item type
    let itemIndex;
    if (productId) {
      itemIndex = cart.items.findIndex(item => item.product?.toString() === productId);
    } else if (puppyId) {
      itemIndex = cart.items.findIndex(item => item.puppy?.toString() === puppyId);
      if (itemIndex > -1) {
        return res.status(400).json({ message: 'This puppy is already in your cart.' });
      }
    } else if (serviceId) {
      itemIndex = cart.items.findIndex(item => item.service?.toString() === serviceId);
    }

    if (itemIndex > -1) {
      // Only products and services can increment quantity
      cart.items[itemIndex].quantity += quantity;
      if (deliveryOptionId) cart.items[itemIndex].deliveryOptionId = deliveryOptionId;
      if (serviceDate) cart.items[itemIndex].serviceDate = serviceDate;
      if (serviceOptionId) cart.items[itemIndex].serviceOptionId = serviceOptionId;
    } else {
      // Add new item
      const newItem = productId
        ? { product: productId, quantity, deliveryOptionId }
        : puppyId
        ? { puppy: puppyId, quantity: 1 } // Puppies always quantity 1
        : { service: serviceId, quantity, serviceDate, serviceOptionId };

      cart.items.push(newItem);
    }

    await cart.save();

    const populatedCart = await Cart.findById(cart._id)
      .populate('items.product')
      .populate('items.service')
      .populate('items.puppy');

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
    const { productId, serviceId, puppyId, quantity, serviceDate, serviceOptionId } = req.body;

    const cart = await Cart.findOne({ user: userId });
    if (!cart) return res.status(404).json({ message: 'Cart not found' });

    // Find the item index based on type
    let itemIndex = -1;
    if (productId) itemIndex = cart.items.findIndex(item => item.product?.toString() === productId);
    else if (puppyId) itemIndex = cart.items.findIndex(item => item.puppy?.toString() === puppyId);
    else if (serviceId) itemIndex = cart.items.findIndex(item => item.service?.toString() === serviceId);

    if (itemIndex === -1) return res.status(404).json({ message: 'Item not found in cart' });

    const item = cart.items[itemIndex];

    // Update quantity
    if (item.puppy) {
      item.quantity = 1; // Puppies are always quantity 1
    } else if (quantity && quantity > 0) {
      item.quantity = quantity;
    }

    // Update other optional fields
    if (serviceDate) item.serviceDate = serviceDate;
    if (serviceOptionId) item.serviceOptionId = serviceOptionId;

    await cart.save();

    const populatedCart = await Cart.findById(cart._id)
      .populate('items.product')
      .populate('items.service')
      .populate('items.puppy');

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
    const { productId, serviceId, puppyId } = req.body;

    const cart = await Cart.findOne({ user: userId });
    if (!cart) return res.status(404).json({ message: 'Cart not found' });

    // Find index based on type
    let itemIndex = -1;
    if (productId) itemIndex = cart.items.findIndex(item => item.product?.toString() === productId);
    else if (puppyId) itemIndex = cart.items.findIndex(item => item.puppy?.toString() === puppyId);
    else if (serviceId) itemIndex = cart.items.findIndex(item => item.service?.toString() === serviceId);

    if (itemIndex === -1) return res.status(404).json({ message: 'Item not found in cart' });

    const item = cart.items[itemIndex];

    // Puppies are unique, remove immediately
    if (item.puppy) {
      cart.items.splice(itemIndex, 1);
    } else {
      // Products and services: decrement quantity if more than 1
      if (item.quantity > 1) {
        item.quantity -= 1;
      } else {
        cart.items.splice(itemIndex, 1);
      }
    }

    await cart.save();

    const populatedCart = await Cart.findById(cart._id)
      .populate('items.product')
      .populate('items.service')
      .populate('items.puppy');

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
    const { productId, serviceId, puppyId, deliveryOptionId } = req.body;

    const cart = await Cart.findOne({ user: userId });
    if (!cart) return res.status(404).json({ message: 'Cart not found' });

    // Find item index based on type
    let itemIndex = -1;
    if (productId) itemIndex = cart.items.findIndex(item => item.product?.toString() === productId);
    else if (puppyId) itemIndex = cart.items.findIndex(item => item.puppy?.toString() === puppyId);
    else if (serviceId) itemIndex = cart.items.findIndex(item => item.service?.toString() === serviceId);

    if (itemIndex === -1) return res.status(404).json({ message: 'Item not found in cart' });

    const item = cart.items[itemIndex];

    // Only products and puppies can have delivery options
    if (item.product || item.puppy) {
      item.deliveryOptionId = deliveryOptionId;
    }

    await cart.save();

    const populatedCart = await Cart.findById(cart._id)
      .populate('items.product')
      .populate('items.service')
      .populate('items.puppy');

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
