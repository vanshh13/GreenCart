const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const CustomerSchema = new Schema({
  CustomerName: { type: String, required: true },
  CustomerEmail: { type: String, required: true },
  CustomerContact: { type: String },
  Image: { type: String }, 
  CustomerAddress: {
    cityVillage: { type: String, required: true },
    pincode: { type: Number, required: true },
    state: { type: String, required: true },
    country: { type: String, required: true },
    streetOrSociety: { type: String, required: true },
  },
  user: { type: mongoose.Types.ObjectId, required: true, ref: 'User' },
}, { collection: 'Customer' });

module.exports = mongoose.model('Customer', CustomerSchema);
