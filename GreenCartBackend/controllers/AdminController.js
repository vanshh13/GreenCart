const Admin = require('../models/Admin');
const Address = require('../models/Address');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Order = require('../models/Order');
const Product = require('../models/Product');

// Create an Admin along with Address
exports.createAdmin = async (req, res) => {
  try {
    const { adminName, adminEmail, adminContact, adminAddress, Password, ConfirmPassword } = req.body;

    if (Password !== ConfirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    // Check if the email already exists
    const existingUser = await User.findOne({ UserEmail: adminEmail });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(Password, 10);

    // Create user account for the admin
    const newUser = new User({
      UserName: adminName,
      UserEmail: adminEmail,
      UserType: "Admin",
      Password: hashedPassword,
    });
    await newUser.save();

    // Create Address linked to the Admin
    const newAddress = new Address({
      ...adminAddress,
      ownerId: newUser._id,
      ownerModel: "Admin",
    });
    await newAddress.save();

    // Create Admin with linked Address
    const newAdmin = new Admin({
      adminName,
      adminEmail,
      adminContact,
      adminAddress: newAddress._id, // Storing address reference
      user: newUser._id, // Linking user to admin
    });

    await newAdmin.save();

    res.status(201).json({ message: "Admin created successfully", admin: newAdmin });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};



// Get Admin by ID with Address populated
exports.getAdmin = async (req, res) => {
  try {
    const admin = await Admin.findById(req.params.id)
      .populate('user')         // Populate user details
      .populate('adminAddress'); // Populate address details

    if (!admin) {
      return res.status(404).json({ message: 'Admin not found' });
    }

    res.status(200).json(admin);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Update Admin and Address
exports.updateAdmin = async (req, res) => {
  try {
    const { adminName, adminEmail, adminContact, Image, adminAddress, user } = req.body;

    // Find the Admin making the request
    const requestingAdmin = await Admin.findOne({ user: req.user.id });

    // Check if the requester is an admin
    if (!requestingAdmin || requestingAdmin.role !== 'admin') {
      return res.status(403).json({ message: 'Unauthorized. Only admins can update admin details.' });
    }

    // Find the target Admin
    const admin = await Admin.findById(req.params.id);
    if (!admin) {
      return res.status(404).json({ message: 'Admin not found' });
    }

    // Update Address if provided
    if (adminAddress) {
      const address = await Address.findByIdAndUpdate(admin.adminAddress, adminAddress, { new: true });
      if (!address) {
        const newAddress = new Address({
          ...adminAddress,
          ownerId: admin._id,
          ownerModel: "Admin",
        });
        await newAddress.save();
        admin.adminAddress = newAddress._id;
      }
    }

    // Update Admin details
    admin.adminName = adminName || admin.adminName;
    admin.adminEmail = adminEmail || admin.adminEmail;
    admin.adminContact = adminContact || admin.adminContact;
    admin.Image = Image || admin.Image;

    await admin.save();

    res.status(200).json({ message: 'Admin updated successfully', admin });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};


// Delete Admin and its Address
exports.deleteAdmin = async (req, res) => {
  try {
    // Find the Admin making the request
    const requestingAdmin = await Admin.findOne({ user: req.user.id });

    // Only admin can delete
    if (!requestingAdmin || requestingAdmin.role !== 'admin') {
      return res.status(403).json({ message: 'Unauthorized. Only admins can delete admin details.' });
    }

    const admin = await Admin.findById(req.params.id);
    if (!admin) {
      return res.status(404).json({ message: 'Admin not found' });
    }

    await Admin.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Admin deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// Get all Admins with their Addresses
exports.getAdmins = async (req, res) => {
  try {
    const admins = await Admin.find()
      .populate('user')
      .populate('adminAddress');

    if (!admins || admins.length === 0) {
      return res.status(404).json({ message: 'No admins found' });
    }

    res.status(200).json(admins);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};


exports.stats  = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalOrders = await Order.countDocuments();
    const totalProducts = await Product.countDocuments();
    const totalSales = await Order.aggregate([
      { $group: { _id: null, total: { $sum: "$totalPrice" } } }
    ]);
console.log(totalUsers, totalOrders, totalProducts, totalSales);
    res.json({
      totalUsers,
      totalOrders,
      totalProducts,
      totalSales: totalSales[0]?.total || 0
    });
  } catch (error) {
    console.error("Error fetching admin stats:", error);
    res.status(500).json({ message: "Server error" });
  }
};