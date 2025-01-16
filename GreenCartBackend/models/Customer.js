const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const CustomerSchema = new Schema({
  CustomerName: { type: String, required: true },
  CustomerEmail: { type: String, required: true },
  CustomerContact: { type: String },
  Image: { type: String }, 
  CustomerAddress: { type: mongoose.Types.ObjectId, ref: 'Address' },
  user: { type: mongoose.Types.ObjectId, required: true, ref: 'User' },
}, { collection: 'Customer' });

module.exports = mongoose.model('Customer', CustomerSchema);
