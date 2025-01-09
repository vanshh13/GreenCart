const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const AdminSchema = new Schema({
  adminName: { type: String, required: true },
  adminEmail: { type: String, required: true },
  adminContact: { type: String},
  Image: { type: String }, 
  adminAddress: {
    cityVillage: { type: String, required: true },
    pincode: { type: Number, required: true },
    state: { type: String, required: true },
    country: { type: String, required: true },
    streetOrSociety: { type: String, required: true },
  },
  user: { type: mongoose.Types.ObjectId, required: true, ref: 'User' },
}, { collection: 'Admin' });

module.exports = mongoose.model('Admin', AdminSchema);
