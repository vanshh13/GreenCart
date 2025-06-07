const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const ShoppingCartSchema = new Schema({
  user: { type: mongoose.Types.ObjectId, required: true, ref: 'User' },
  cartItems: [{ type: mongoose.Types.ObjectId, ref: 'CartItem' }], // Store only ObjectIds
  totalPrice: { type: Number, default: 0}, // Sum of all cartItems' prices
  lastUpdated: { type: Date, default: Date.now },
}, { collection: 'ShoppingCart' });

module.exports = mongoose.model('ShoppingCart', ShoppingCartSchema);
