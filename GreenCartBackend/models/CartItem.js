const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const CartItemSchema = new Schema({
  product: { type: mongoose.Types.ObjectId, required: true, ref: 'Product' },
  quantity: { type: Number, required: true },
  totalPrice: { type: Number, required: true }, // Product price * quantity
  shoppingCart: { type: mongoose.Types.ObjectId, ref: 'ShoppingCart', required: true }
}, { collection: 'CartItem' });

module.exports = mongoose.model('CartItem', CartItemSchema);
