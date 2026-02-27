const Order = require('../models/Order.js');
const Cart = require('../models/Cart.js');
const Product = require('../models/Product.js');
const Puppy = require('../models/PuppyModel.js');
const mongoose = require('mongoose');
const sendEmail = require('../utils/sendEmail.js');
const User = require('../models/userModel.js');

const placeOrder = async (req, res) => {
  try {
    const userId = req.user.id;
    const { shippingAddress, paymentMethod } = req.body;

    if (!shippingAddress ||
      !shippingAddress.fullName ||
      !shippingAddress.phone ||
      !shippingAddress.addressLine ||
      !shippingAddress.city ||
      !shippingAddress.region) {

    return res.status(400).json({
      message: "Please provide complete shipping address."
    });
  }

    // Get cart items (products + services only)
    const cartData = await Cart.findOne({ user: userId })
      .populate('items.product')
      .populate('items.service')
      .populate('items.puppy'); // new population for puppies

    const user = await User.findById(userId).select('name email');

    if (!cartData || cartData.items.length === 0) {
      return res.status(400).json({ message: 'Cart is empty' });
    }

    let totalAmount = 0;

    // Prepare order items
    const orderItems = cartData.items.map(item => {
      if (item.product) {
        totalAmount += item.product.price * item.quantity;

        return {
          itemType: "Product",
          product: item.product._id,
          quantity: item.quantity,
          deliveryType: "Pickup"
        };
      }

      if (item.service) {
        totalAmount += item.service.price * item.quantity;

        return {
          itemType: "Service",
          product: item.service._id, // uses refPath in Order
          quantity: item.quantity,
          deliveryType: "Pickup"
        };
      }

      if (item.puppy) {
        totalAmount += item.puppy.price * item.quantity;

        if (!item.puppy.isAvailable) {
          throw new Error(`Puppy ${item.puppy.name} is already sold`);
        }
        
        return {
          itemType: "Puppy",
          product: item.puppy._id,
          quantity: item.quantity,
          deliveryType: "Pickup"
        };
      }


      return null;
    }).filter(Boolean);

    const newOrder = new Order({
      user: userId,
      items: orderItems,
      shippingAddress,
      paymentMethod,
      totalAmount: totalAmount / 100,
      status: 'Pending'
    });

    await newOrder.save();

    for (const item of cartData.items) {
      if (item.puppy) {
        item.puppy.isAvailable = false;
        await item.puppy.save();
      }
    }

    // Generate email HTML
    const orderItemsHtml = cartData.items.map(item => {
      const data = item.product || item.service || item.puppy; // get the correct data based on item type

      const price = data.price;
      const name = data.name;
      const subtotal = (price * item.quantity / 100).toFixed(2);

      return `
        <tr>
          <td style="padding:8px; border:1px solid #ddd;">${name}</td>
          <td style="padding:8px; border:1px solid #ddd; text-align:center;">${item.quantity}</td>
          <td style="padding:8px; border:1px solid #ddd; text-align:right;">$${(price / 100).toFixed(2)}</td>
          <td style="padding:8px; border:1px solid #ddd; text-align:right;">$${subtotal}</td>
        </tr>
      `;
    }).join('');

    try{
      await sendEmail(
        user.email,
        "Your Order Confirmation",
        `<div style="font-family:Arial,sans-serif; max-width:600px; margin:auto; padding:20px;">
          <h2>Thank you for your order, ${user.name || 'Customer'}!</h2>
          <table style="width:100%; border-collapse:collapse; margin-top:15px;">
            <thead>
              <tr>
                <th style="padding:8px; border:1px solid #ddd; text-align:left;">Item</th>
                <th style="padding:8px; border:1px solid #ddd; text-align:center;">Qty</th>
                <th style="padding:8px; border:1px solid #ddd; text-align:right;">Price</th>
                <th style="padding:8px; border:1px solid #ddd; text-align:right;">Subtotal</th>
              </tr>
            </thead>
            <tbody>
              ${orderItemsHtml}
              <tr>
                <td colspan="3" style="padding:8px; border:1px solid #ddd; text-align:right;"><strong>Total</strong></td>
                <td style="padding:8px; border:1px solid #ddd; text-align:right;">
                  <strong>$${newOrder.totalAmount.toFixed(2)}</strong>
                </td>
              </tr>
            </tbody>
          </table>
        </div>`
      );
    } catch(err){
      console.error('Error sending email:', err);
    }    

    // Clear cart
    cartData.items = [];
    await cartData.save();

    res.status(201).json({
      message: 'Order placed successfully',
      order: newOrder
    });

  } catch (error) {
    console.error('Error placing order:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const getMyOrders = async (req, res) => {
  try {
    const userId = req.user.id;
    const orders = await Order.find({ user: userId }).sort({ createdAt: -1 }).populate('items.product', 'name images price');

    res.status(200).json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

const getOrderById = async(req, res) => {
  try{
    const userId = req.user.id;
    const isAdmin = req.user.isAdmin;
    const orderId = req.params.id;   
    
    if (!mongoose.Types.ObjectId.isValid(orderId)) {
      return res.status(400).json({ message: 'Invalid order ID format' });
    }

    let order;

    if (isAdmin) {
      // Allow admin to access any order
      order = await Order.findById(orderId)
        .populate('user', 'name email')
        .populate('items.product', 'name images price');
    } else {
      // Regular user can only access their own order
      order = await Order.findOne({ _id: orderId, user: userId })
        .populate('items.product', 'name images price');
    }


    if (!order) {      
      return res.status(404).json({ message: 'Order not found' });
    }

    res.status(200).json(order);
  }catch(error){
    console.error('Error fetching order:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

const getAllOrders = async(req,res) => {
  try{
    const orders = await Order.find().populate('user', 'name email')
    res.status(200).json(orders);
  }catch(error){
    console.error('Error fetching all orders:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

const updateOrderStatus = async(req, res) => {
  try {
    const orderId = req.params.id;
    const { status } = req.body;    

    if (!mongoose.Types.ObjectId.isValid(orderId)) {
      return res.status(400).json({ message: 'Invalid order ID format' });
    }

    if (!['Pending', 'Shipped', 'Delivered', 'Cancelled'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status value' });
    }

    const order = await Order.findById(orderId).populate('user', 'name email');
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    order.status = status;
    await order.save();

    await sendEmail(
      order.user.email,
      `Your order status has been updated`,
      `<h3>Hello ${order.user.name || "Customer"},</h3>
       <p>Your order <strong>${order._id}</strong> status is now: <strong>${order.status}</strong>.</p>
       <p>Thank you for shopping with us!</p>`
    );

    res.status(200).json({ message: 'Order status updated successfully', order });
  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

const placePuppyOrder = async (req, res) => {
  try {
    const { puppyId, shippingAddress, paymentMethod } = req.body;
    const userId = req.user.id;

    const puppy = await Puppy.findOneAndUpdate(
      { _id: puppyId, isAvailable: true },
      { isAvailable: false },
      { new: true }
    );

    if (!puppy) {
      return res.status(400).json({ message: "Puppy already sold" });
    }

    const newOrder = new Order({
      user: userId,
      items: [{
        itemType: "Puppy",
        product: puppy._id,
        quantity: 1,
        deliveryType: "Pickup"
      }],
      shippingAddress,
      paymentMethod,
      totalAmount: puppy.price
    });

    await newOrder.save();

    res.status(201).json({ order: newOrder });

  } catch (error) {
    res.status(500).json({ message: "Error placing puppy order" });
  }
};

module.exports = {
  placeOrder,
  getMyOrders,
  getOrderById,
  getAllOrders,
  updateOrderStatus,
  placePuppyOrder
}
