const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AddressSchema = new Schema({
  cityVillage: { type: String, required: true },
  pincode: { type: Number, required: true },
  state: { type: String, required: true },
  country: { type: String, required: true },
  streetOrSociety: { type: String, required: true },
  
  // Owner can be an Admin, Customer, or used in OrderDetail
  ownerId: { type: mongoose.Schema.Types.ObjectId, required: true, refPath: 'ownerModel' },
  
  // ownerModel dynamically points to 'Admin', 'Customer', or 'OrderDetail'
  ownerModel: { type: String, required: true, enum: ['Admin', 'Customer', 'OrderDetail'] }
}, { collection: 'Address' });

module.exports = mongoose.model('Address', AddressSchema);
