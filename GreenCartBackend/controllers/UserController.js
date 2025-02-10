const Admin = require('../models/Admin');
const Customer = require('../models/Customer');
const ShoppingCart = require('../models/ShoppingCart');
const CartItem = require('../models/CartItem');
const Order = require('../models/Order');
const OrderDetail = require('../models/OrderDetail');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Address = require('../models/Address');

exports.oauth = async (req, res) => {
  const provider = req.params.provider;
  res.json({ message: `Logging in with ${provider}` });
};

exports.registerUser = async (req, res) => {
  try {
    const { UserName, UserEmail, Password, UserType } = req.body;

    // Hash the password
    const hashedPassword = await bcrypt.hash(Password, 10); // 10 is the salt rounds
    const existsuser  = await User.findOne({UserEmail: UserEmail}) ;
    
    if(existsuser){
      return res.status(400).json({ message: "Email already exists" });
    }
    
    // Create a new user with the hashed password
    const newUser = new User({
      UserName,
      UserEmail,
      Password: hashedPassword,
      UserType,
    });
    
    await newUser.save();
    if (UserType === 'Customer') {
      await Customer.create({
        CustomerName: UserName,
        CustomerEmail: UserEmail,
        user: newUser._id,
      });
    }
    else{
      await Admin.create({
        adminName: UserName,
        adminEmail: UserEmail,
        adminAddress: UserAddress,
        user: newUser._id,
      });
    }
    
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.loginUser = async (req, res) => {
  try {
    const { UserEmail, Password } = req.body;

    // Find the user
    const user = await User.findOne({ UserEmail: UserEmail });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Compare passwords
    const isPasswordValid = await bcrypt.compare(Password, user.Password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate JWT
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );
    
    res.status(200).json({
      message: 'Login successful',
      token,
      role: user.UserType, // Include role for client-side logic
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create a User
exports.createUser = async (req, res) => {
  try {
    const { UserName, UserEmail, Password, UserType } = req.body;

    // Hash the password
    const hashedPassword = await bcrypt.hash(Password, 10); // 10 is the salt rounds
    
    const existsuser  = await User.findOne({UserEmail: UserEmail}) ;
    if(existsuser){
      return res.status(400).json({ message: "Email already exists" });
    }
    // Create a new user with the hashed password
    const user = new User({
      UserName,
      UserEmail,
      Password: hashedPassword,
      UserType,
    });
    
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
    const userId = req.params.id;
    const updates = req.body;

    // Check if password is being updated
    if (updates.Password) {
      updates.Password = await bcrypt.hash(updates.Password, 10); // Hash the new password
    }

    // Update the user
    const updatedUser = await User.findByIdAndUpdate(userId, updates, { new: true });
    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ message: 'User updated successfully', user: updatedUser });
  } catch (error) {
    res.status(500).json({ error: error.message });
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

    // Delete Address
    const address = await Address.find({ user: userId });
    const addressIds = address.map(address => address);
    const addressDeleted = await Address.deleteMany({ _id: { $in: addressIds } });

    // Delete the user
    await User.deleteOne({ _id: userId });

    res.status(200).json({
      message: 'User and all associated records deleted successfully',
      recordsDeleted: {
        adminDeleted: adminDeleted.deletedCount,
        customerDeleted: customerDeleted.deletedCount,
        cartDeleted: cartIds.length,
        ordersDeleted: orderIds.length,
        addressDeleted: addressDeleted.deletedCount
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
