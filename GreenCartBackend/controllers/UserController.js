const Admin = require('../models/Admin');
const Customer = require('../models/Customer');
const ShoppingCart = require('../models/ShoppingCart');
const CartItem = require('../models/CartItem');
const Order = require('../models/Order');
const OrderDetail = require('../models/OrderDetail');
const User = require('../models/User');

// Create a User
exports.createUser = async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    if (user.UserType === 'Customer') {
      await Customer.create({
        CustomerName: user.UserName,
        CustomerEmail: user.UserEmail,
        CustomerAddress: user.UserAddress,
        user: user._id,
      });
    }
    else{
      await Admin.create({
        adminName: user.UserName,
        adminEmail: user.UserEmail,
        adminAddress: user.UserAddress,
        user: user._id,
      });
    }
    
    res.status(201).json({ message: 'User created successfully', user });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Read a User by ID
exports.getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.status(200).json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Update a User
exports.updateUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.status(200).json({ message: 'User updated successfully', user });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete a User
exports.deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;

    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Delete Admin and Customer records
    const adminDeleted = await Admin.deleteMany({ user: userId });
    const customerDeleted = await Customer.deleteMany({ user: userId });

    // Delete ShoppingCart and CartItems
    const carts = await ShoppingCart.find({ user: userId });
    const cartIds = carts.map(cart => cart._id);
    await CartItem.deleteMany({ _id: { $in: cartIds } });
    await ShoppingCart.deleteMany({ user: userId });

    // Delete Orders and OrderDetails
    const orders = await Order.find({ user: userId });
    const orderIds = orders.map(order => order._id);
    await OrderDetail.deleteMany({ order: { $in: orderIds } });
    await Order.deleteMany({ user: userId });

    // Delete the user
    await User.deleteOne({ _id: userId });

    res.status(200).json({
      message: 'User and all associated records deleted successfully',
      recordsDeleted: {
        adminDeleted: adminDeleted.deletedCount,
        customerDeleted: customerDeleted.deletedCount,
        cartDeleted: cartIds.length,
        ordersDeleted: orderIds.length,
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getusers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json({ users });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
