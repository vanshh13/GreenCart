const mongoose = require('mongoose');
const Admin = require('./Admin');
const Customer = require('./Customer');
const ShoppingCart = require('./ShoppingCart');
const CartItem = require('./CartItem');
const Order = require('./Order');
const OrderDetail = require('./OrderDetail');

const Schema = mongoose.Schema;

const UserSchema = new Schema({
  UserName: { type: String, required: true },
  UserEmail: { type: String, required: true },
  UserType: { type: String, required: true},
  Password: { type: String, required: true },
}, { collection: 'User' });

// Middleware to delete associated data when a user is removed
UserSchema.pre('remove', async function (next) {
  try {
    const userId = this._id;

    // Delete Admin and Customer linked to this user
    if (await Admin.findOne({ user: userId })) {
      await Admin.deleteMany({ user: userId });
    } else {
      await Customer.deleteMany({ user: userId });
    }
    
    // Delete ShoppingCart and its associated CartItems
    const carts = await ShoppingCart.find({ user: userId });
    const cartIds = carts.map(cart => cart._id);
    await CartItem.deleteMany({ _id: { $in: cartIds } });
    await ShoppingCart.deleteMany({ user: userId });

    // Delete Orders and their details
    const orders = await Order.find({ user: userId });
    const orderIds = orders.map(order => order._id);
    await OrderDetail.deleteMany({ order: { $in: orderIds } });
    await Order.deleteMany({ user: userId });

    next();
  } catch (error) {
    next(error);
  }
});
module.exports = mongoose.model('User', UserSchema);
