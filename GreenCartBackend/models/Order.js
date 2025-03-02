const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema({
  user: { type: mongoose.Types.ObjectId, required: true, ref: "User" },
  orderItems: [
    {
      product: { type: mongoose.Types.ObjectId, required: true, ref: "Product" },
      quantity: { type: Number, required: true },
      price: { type: Number, required: true },
    },
  ],
  totalPrice: { type: Number, required: true },
  orderStatus: {
    type: String,
    enum: ["pending", "processing", "cancelled", "shipped", "in_transit", "delivered"],
    default: "pending",
  },
  orderDate: { type: Date, default: Date.now },
  OrderDetail: { type: mongoose.Types.ObjectId, ref: "OrderDetail" },

  // ✅ NEW: Track timestamps for each status change
  timestamps: {
    ordered: { type: Date, default: Date.now },  // Initial timestamp
    packed: { type: Date },
    shipped: { type: Date },
    in_transit: { type: Date },
    delivered: { type: Date },
    cancelled: { type: Date }  // ✅ New field to track cancellation time
  }
}, { collection: "Order" });

module.exports = mongoose.model("Order", OrderSchema);
