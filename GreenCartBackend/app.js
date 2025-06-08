const express = require('express');
require('dotenv').config();
const session = require("express-session");

const userRoutes = require('./routes/UserRoutes');
const adminRoutes = require('./routes/AdminRoutes');
const customerRoutes = require('./routes/CustomerRoutes');
const productRoutes = require('./routes/ProductRoutes');
const cartItemRoutes = require('./routes/CartItemRoutes');
const shoppingCartRoutes = require('./routes/ShoppingCartRoutes');
const orderDetailRoutes = require('./routes/OrderDetailRoutes');
const orderRoutes = require('./routes/OrderRoutes');
const addressRoutes = require('./routes/AddressRoutes');
const blogRoutes = require('./routes/BlogRouters');
const WishlistRoutes = require("./routes/WishlistRoutes");
const uploadRoutes = require("./utility/uploadController");
const notificationRoutes = require("./routes/NotificationRoutes");
const trackVisitor = require("./middleware/trackVisitors");

const Razorpay = require("razorpay");
const cors = require('cors');

const app = express();

// Configure CORS with specific options
app.use(cors({
  origin: process.env.FRONTEND_URL, // Replace with your frontend URL
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false, maxAge: 1000 * 60 * 60 * 24 }, // 24-hour session
  })
);

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(trackVisitor);

// Razorpay Initialization - Do this once and reuse the instance
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || "rzp_test_90ZGyZNVzzFKRH",
  key_secret: process.env.RAZORPAY_KEY_SECRET || "71W2BO6yJp5w5zwcOmStw8YX"
});

// Routes
app.use('/api/users', userRoutes);
app.use('/api/admins', adminRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart-items', cartItemRoutes);
app.use('/api/shopping-carts', shoppingCartRoutes);
app.use('/api/order-details', orderDetailRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/addresses', addressRoutes);
app.use('/api/blogs', blogRoutes);
app.use("/api/wishlist", WishlistRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/notifications", notificationRoutes);

// Serve static files
app.use("/uploads", express.static("uploads"));

// Create Razorpay Order API
app.post('/api/create-order', async (req, res) => {
  try {
    console.log("Received order request:", req.body);
    
    const { amount, currency = "INR" } = req.body;
    
    // Validate Input
    if (!amount) {
      return res.status(400).json({ error: "Amount is required." });
    }
    
    const options = {
      amount: Math.round(amount * 100), // Convert to paise (₹1 = 100 paise)
      currency: currency,
      receipt: `receipt_${Date.now()}`
    };
    
    const order = await razorpay.orders.create(options);
    console.log("Razorpay order created:", order);
    
    res.json({
      success: true,
      order_id: order.id,
      amount: order.amount,
      currency: order.currency
    });
  } catch (error) {
    console.error("Error creating Razorpay order:", error);
    res.status(500).json({ 
      success: false,
      error: "Failed to create order", 
      details: error.message 
    });
  }
});

// Verify Razorpay Payment API
app.post('/api/verify-payment', async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
    
    // Validate input
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ error: "All payment details are required" });
    }
    
    // Create a signature to verify
    const crypto = require('crypto');
    const secret = process.env.RAZORPAY_KEY_SECRET || "71W2BO6yJp5w5zwcOmStw8YX";

    const generated_signature = crypto
      .createHmac('sha256', secret)
      .update(razorpay_order_id + "|" + razorpay_payment_id)
      .digest('hex');
    
    // Verify signature
    if (generated_signature === razorpay_signature) {
      res.json({ success: true, message: "Payment verified successfully" });
    } else {
      res.status(400).json({ success: false, message: "Payment verification failed" });
    }
  } catch (error) {
    console.error("Error verifying payment:", error);
    res.status(500).json({ 
      success: false,
      error: "Payment verification failed", 
      details: error.message 
    });
  }
});

// Fetch Payment Status API
app.get("/api/payment/:paymentId", async (req, res) => {
  const { paymentId } = req.params;
  
  try {
    if (!paymentId || !paymentId.startsWith("pay_")) {
      return res.status(400).json({ error: "Invalid Payment ID format" });
    }
    
    const payment = await razorpay.payments.fetch(paymentId);
    
    res.json({
      success: true,
      status: payment.status,
      method: payment.method,
      amount: payment.amount / 100, // Convert paise to rupees
      currency: payment.currency
    });
  } catch (error) {
    console.error("Failed to fetch payment:", error);
    res.status(500).json({ 
      success: false,
      error: "Failed to fetch payment", 
      details: error.message 
    });
  }
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));

// MongoDB Connection
const mongoose = require('mongoose');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@greencart-cluster.zlcw4.mongodb.net/greencart?retryWrites=true&w=majority&appName=greencart-cluster`;

mongoose.connect(uri)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log("MongoDB connection error: ", err));