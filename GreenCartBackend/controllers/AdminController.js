const Admin = require('../models/Admin');
const Address = require('../models/Address');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Order = require('../models/Order');
const Product = require('../models/Product');
const Notification = require("../models/NotificationModel");
const Customer = require('../models/Customer');
const Visitor = require('../models/Visitor');
const mongoose = require('mongoose');
// Create an Admin along with Address
exports.createAdmin = async (req, res) => {
  try {
    const { adminName, adminEmail, adminContact, adminAddress, Password, ConfirmPassword ,role} = req.body;
    const user = req.user.id;
    // Validate passwords
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

    // Validate adminAddress before saving
    let newAddress = null;
    if (adminAddress && Object.keys(adminAddress).length > 0) {
      newAddress = new Address({
        ...adminAddress,
        ownerId: newUser._id,
        ownerModel: "Admin",
      });
      await newAddress.save();
    }

    // Create Admin with linked Address
    const newAdmin = new Admin({
      adminName,
      adminEmail,
      adminContact,
      role: role || 'Manager',
      adminAddress: newAddress ? newAddress._id : null, // Store address reference if exists
      user: newUser._id, // Linking user to admin
    });

    await newAdmin.save();

    // Create a new notification for the admin
    await Notification.create({
      message: `New user registered: ${newUser.UserName} as admin`,
      type: "new_user",
      actionBy: user,
    });

    res.status(201).json({ message: "Admin created successfully", admin: newAdmin });
  } catch (error) {
    console.error("Error creating admin:", error);
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

    // Create a new notification for the admin
    await Notification.create({
      message: `Update admin profile: ${admin.adminName}`,
      type: "update_admin",
      actionBy: user.id,
    });

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
      { 
        $match: { orderStatus: "delivered" } // Only delivered orders 
      },
      { 
        $group: { _id: null, total: { $sum: "$totalPrice" } } 
      }
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


// Get Admin Role by User ID
exports.getAdminRole = async (req, res) => {
  try {
    const { userId } = req.params;
    const admin = await Admin.findOne({ user: userId });
    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    res.json({ role: admin.role });
  } catch (error) {
    console.error("Error fetching admin role:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Update Admin Role
exports.updateAdminRole = async (req, res) => {
  try {
    const { adminId } = req.params;
    const { role } = req.body;
    console.log(adminId, role);

    // Validate role field
    if (!role || !["Manager", "Admin"].includes(role)) {
      return res.status(400).json({ message: "Invalid or missing role" });
    }
    const admin = await Admin.findOne({ user:adminId });
    console.log("before updating ",admin);
    admin.role = role;
    console.log("after updating ",admin);

    // Find and update the admin
    const updatedAdmin = await Admin.findByIdAndUpdate(
      admin._id,
      admin,
      { new: true }
    );
    console.log(updatedAdmin);
    if (!updatedAdmin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    // Create a new notification for the admin
    await Notification.create({
      message: `Admin role updated: ${admin.adminName} is now assigned the role of ${role}.`,
      type: "update_adminrole",
      actionBy: req.user.id,
    });
    
    res.status(200).json({ message: "Admin role updated successfully", role: updatedAdmin.role });
  } catch (error) {
    console.error("Error updating admin role:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.getOverviewStats = async (req, res) => {
  try {
    const { period } = req.query; // Example: "weekly", "monthly"
    
    // Define time range based on period
    const now = new Date();
    let startDate;
    if (period === "weekly") {
      startDate = new Date(now.setDate(now.getDate() - 7));
    } else if (period === "monthly") {
      startDate = new Date(now.setMonth(now.getMonth() - 1));
    } else {
      startDate = new Date("1970-01-01"); // Default: All-time stats
    }
    console.log("startDate",startDate);
    // 🟢 Total Sales (Sum of all totalPrice)
    const totalSales = await Order.aggregate([
      {
        $match: {
          orderDate: { $gte: startDate },
          orderStatus: "delivered" // Only delivered orders
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$totalPrice" }
        }
      }
    ]);

    
    //  Total Orders (Count of all orders)
    const totalOrders = await Order.countDocuments({ 
      orderDate: { $gte: startDate },
      orderStatus: { $ne: "cancelled" } // $ne = not equal to "Cancelled"
    });
    

    //  Total Customers (Unique customers count)
    const totalCustomers = await Customer.countDocuments();

    //  Average Order Value (totalSales / totalOrders)
    const avgOrderValue = totalOrders > 0 ? (totalSales[0]?.total || 0) / totalOrders : 0;

    //  Conversion Rate (Percentage of 'delivered' orders)
    const totalDeliveredOrders = await Order.countDocuments({ orderStatus: "delivered", orderDate: { $gte: startDate } });
    const conversionRate = totalOrders > 0 ? (totalDeliveredOrders / totalOrders) * 100 : 0;

    //  Calculate Changes Compared to Previous Period
    const prevStartDate = new Date(startDate);
    if (period === "weekly") prevStartDate.setDate(prevStartDate.getDate() - 7);
    else if (period === "monthly") prevStartDate.setMonth(prevStartDate.getMonth() - 1);

    const prevSales = await Order.aggregate([
      { $match: { orderDate: { $gte: prevStartDate, $lt: startDate } } },
      { $group: { _id: null, total: { $sum: "$totalPrice" } } }
    ]);
    const prevOrders = await Order.countDocuments({ orderDate: { $gte: prevStartDate, $lt: startDate } });
    const prevCustomers = await Customer.countDocuments();

    const salesChange = prevSales[0]?.total ? ((totalSales[0]?.total - prevSales[0]?.total) / prevSales[0]?.total) * 100 : 0;
    const ordersChange = prevOrders ? ((totalOrders - prevOrders) / prevOrders) * 100 : 0;
    const customersChange = prevCustomers ? ((totalCustomers - prevCustomers) / prevCustomers) * 100 : 0;

    // 🟢 Response
    res.json({
      totalSales: totalSales[0]?.total || 0,
      totalOrders,
      totalCustomers,
      averageOrderValue: parseFloat(avgOrderValue.toFixed(2)),
      conversionRate: parseFloat(conversionRate.toFixed(2)),
      salesChange: parseFloat(salesChange.toFixed(2)),
      ordersChange: parseFloat(ordersChange.toFixed(2)),
      customersChange: parseFloat(customersChange.toFixed(2)),
    });

  } catch (error) {
    console.error("Error fetching overview stats:", error);
    res.status(500).json({ message: "Failed to fetch statistics." });
  }
};

exports.getVisitorStatistics = async (req, res) => {
  try {
    const { period } = req.query; // e.g., "daily", "weekly", "monthly"
    const today = new Date();
    let startDate;

    if (period === "daily") {
      startDate = new Date(today.setDate(today.getDate() - 7)); // Last 7 days
    } else if (period === "weekly") {
      startDate = new Date(today.setMonth(today.getMonth() - 1)); // Last 1 month
    } else {
      startDate = new Date(today.setMonth(today.getMonth() - 3)); // Last 3 months
    }

    // Fetch visitor stats
    const visitors = await Visitor.aggregate([
      { $match: { date: { $gte: startDate } } },
      { $group: { _id: "$date", visitors: { $sum: "$count" } } },
      { $sort: { _id: 1 } },
    ]);

    // Fetch orders stats
    const orders = await Order.aggregate([
      { $match: { orderDate: { $gte: startDate } } },
      { $group: { _id: "$orderDate", orders: { $sum: 1 } } },
      { $sort: { _id: 1 } },
    ]);

    // Merging the visitors and orders data
    const stats = visitors.map((v) => ({
      date: v._id.toISOString().split("T")[0],
      visitors: v.visitors,
      orders: orders.find((o) => o._id.toISOString().split("T")[0] === v._id.toISOString().split("T")[0])?.orders || 0,
    }));
    console.log("stats",stats);
    res.status(200).json({ stats });
  } catch (error) {
    console.error("Error fetching visitor statistics:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.getTopSellingProducts = async (req, res) => {
  try {
    // Aggregate product sales from orders
    const topProducts = await Order.aggregate([
      { $match: { orderStatus: { $ne: 'cancelled' } } }, // Exclude orders with 'cancelled' status
      { $unwind: "$orderItems" }, // Flatten order items
      {
        $group: {
          _id: "$orderItems.product",
          totalSales: { $sum: "$orderItems.quantity" },
          totalRevenue: { $sum: { $multiply: ["$orderItems.quantity", "$orderItems.price"] } },
        },
      },
      { $sort: { totalSales: -1 } }, // Sort by sales (highest first)
      { $limit: 5 }, // Get top 5 products
    ]);
    

    // Populate product names
    const products = await Product.find({ _id: { $in: topProducts.map((p) => p._id) } });

    const formattedProducts = topProducts.map((p) => {
      const product = products.find((prod) => prod._id.equals(p._id));
      return {
        name: product ? product.Name : "Unknown Product",
        sales: p.totalSales,
        revenue: p.totalRevenue,
      };
    });

    res.status(200).json({ topProducts: formattedProducts });
  } catch (error) {
    console.error("Error fetching top-selling products:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.getSalesByPaymentMethod = async (req, res) => {
  try {
    const salesData = await Order.aggregate([
      {
        $group: {
          _id: "$paymentMethod",
          count: { $sum: 1 },
        },
      },
    ]);

    const formattedSalesData = salesData.map((item) => ({
      name: item._id,
      value: item.count,
      color: getColorForPaymentMethod(item._id),
    }));

    res.status(200).json({ salesByPayment: formattedSalesData });
  } catch (error) {
    console.error("Error fetching sales by payment method:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Helper function to assign colors based on payment method
const getColorForPaymentMethod = (method) => {
  const colors = {
    "Credit Card": "#0088FE",
    "PayPal": "#00C49F",
    "Bank Transfer": "#FFBB28",
    "Cash on Delivery": "#FF8042",
  };
  return colors[method] || "#AAAAAA"; // Default color if not found
};
// analysis
exports.getProductRatings = async (req, res) => {
  try {
    const ratings = await Product.aggregate([
      {
        $group: {
          _id: "$rating",
          count: { $sum: 1 },
        },
      },
    ]);

    const formattedRatings = ratings.map((r) => ({
      rating: r._id,
      count: r.count,
    }));

    res.status(200).json({ ratings: formattedRatings });
  } catch (error) {
    console.error("Error fetching product ratings:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};


exports.getSalesData = async (req, res) => {
  try {
    const timeframe = req.query.timeframe || "weekly";
    const now = new Date();
    let startDate;

    if (timeframe === "weekly") {
      startDate = new Date(now.setDate(now.getDate() - 7)); // Last 7 days
    } else {
      startDate = new Date(now.setMonth(now.getMonth() - 1)); // Last 30 days
    }

    // 🟢 Aggregate sales data from the Order collection
    const salesData = await Order.aggregate([
      { $match: { orderDate: { $gte: startDate } } }, 
      { 
        $group: {
          _id: {
            $dateToString: { format: timeframe === "weekly" ? "%Y-%m-%d" : "%Y-%m-%U", date: "$orderDate" }
          }, 
          sales: { $sum: "$totalPrice" },
          orders: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    // Format the response
    const formattedData = salesData.map(data => ({
      name: data._id,
      sales: data.sales,
      orders: data.orders,
      returns: Math.floor(Math.random() * 5) // Mock return data
    }));

    res.json(formattedData);
  } catch (error) {
    console.error("Error fetching sales data:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.getProductAnalytics = async (req, res) => {
  try {
    const now = new Date();
    const startDate = new Date(now.setMonth(now.getMonth() - 1)); // Last 30 days

    // 🟢 Aggregate product sales from Order collection
    const productStats = await Order.aggregate([
      { $match: { orderDate: { $gte: startDate }, orderStatus: { $ne: 'Cancelled' } } }, // Exclude cancelled orders
      { $unwind: "$orderItems" }, // Split array of items into separate documents
      {
        $group: {
          _id: "$orderItems.product",
          sales: { $sum: "$orderItems.quantity" },
          value: { $sum: { $multiply: ["$orderItems.quantity", "$orderItems.price"] } }
        }
      },
      { $sort: { sales: -1 } }, // Sort by highest sales
      { $limit: 10 } // Limit to top 10 products
    ]);
    

    // 🟢 Fetch product names
    const productIds = productStats.map((item) => item._id);
    const products = await Product.find({ _id: { $in: productIds } }).select("Name");

    // 🟢 Merge product names
    const formattedData = productStats.map((data) => ({
      name: products.find((p) => p._id.toString() === data._id.toString())?.Name || "Unknown",
      sales: data.sales,
      value: data.value
    }));

    res.json(formattedData);
  } catch (error) {
    console.error("Error fetching product analytics:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.getUserStats = async (req, res) => {
  try {
    const now = new Date();
    const last30Days = new Date(now.setDate(now.getDate() - 30)); // Define timeframe

    // 🟢 Total Users Count
    const totalUsers = await User.countDocuments();

    // 🟢 New Users in Last 30 Days
    const newUsers = await User.countDocuments({ createdAt: { $gte: last30Days } });

    // 🟢 Returning Users (Users created before 30 days)
    const returningUsers = totalUsers - newUsers;

    res.json({
      total: totalUsers,
      new: newUsers,
      returning: returningUsers
    });
  } catch (error) {
    console.error("Error fetching user stats:", error);
    res.status(500).json({ message: "Failed to fetch user statistics." });
  }
};
