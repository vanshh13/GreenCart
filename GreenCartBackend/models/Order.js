const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const OrderSchema = new Schema({
  user: { type: mongoose.Types.ObjectId, required: true, ref: 'User' },
  orderItems: [{
    product: { type: mongoose.Types.ObjectId, required: true, ref: 'Product' },
    quantity: { type: Number, required: true },
    price: { type: Number, required: true },
  }],
  totalPrice: { type: Number, required: true }, // Sum of all orderItems' prices
  orderStatus: { type: String, enum: ['pending', 'confirmed', 'delivered'], default: 'pending' },
  orderDate: { type: Date, default: Date.now },
}, { collection: 'Order' });

module.exports = mongoose.model('Order', OrderSchema);
