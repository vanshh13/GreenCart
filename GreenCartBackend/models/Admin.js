const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const AdminSchema = new Schema({
  adminName: { type: String, required: true },
  adminEmail: { type: String, required: true },
  adminContact: { type: String },
  Image: { type: String }, 
  adminAddress: { type: mongoose.Types.ObjectId, ref: 'Address' },
  user: { type: mongoose.Types.ObjectId, required: true, ref: 'User' },
  role: {
    type: String,
    enum: ['Manager', 'Admin'],
    required: true,
    default: 'Manager' // Default role
  }
}, { collection: 'Admin' });

module.exports = mongoose.model('Admin', AdminSchema);
