const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    message: { type: String, required: true }, // Notification text
    type: { 
      type: String, 
      enum: ["new_user", "new_order", "user_deleted", "new_product", "new_blog", "order_cancelled", "update_admin" , "update_orderstatus", "update_adminrole", "update_product", "product_deleted", "update_blog", "blog_deleted"], 
      required: true 
    }, // Type of notification
    actionBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // User who performed the action
    status: { type: String, enum: ["unread", "read"], default: "unread" }, // Read/unread status
  },
  { timestamps: true }
);

module.exports = mongoose.model("Notification", notificationSchema);
