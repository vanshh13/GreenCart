const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const OrderDetailSchema = new Schema({
  order: { type: mongoose.Types.ObjectId,  ref: 'Order' },
  deliveryAddress: { type: mongoose.Types.ObjectId, required: true, ref: 'Address' },
  totalPrice: { type: Number, required: true },
  tax: { type: Number, default: 0 },
  discount: { type: Number, default: 0 },
  finalPrice: { type: Number, required: true }, // totalPrice + tax - discount
}, { collection: 'OrderDetail' });

module.exports = mongoose.model('OrderDetail', OrderDetailSchema);
