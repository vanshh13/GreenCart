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

const cors = require('cors');

const app = express();

app.use(cors());
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

// Serve static files
app.use("/uploads", express.static("uploads"));
// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));

const mongoose = require('mongoose');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@greencart-cluster.zlcw4.mongodb.net/greencart?retryWrites=true&w=majority&appName=greencart-cluster`;

mongoose.connect(uri)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log("MongoDB connection error: ", err));
