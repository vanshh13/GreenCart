const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const ProductSchema = new Schema({
  Name: { type: String, required: true },
  Description: { type: String, required: true },
  Price: { type: Number, required: true },
  Available: { type: Boolean, required: true },
  Stock: { type: Number, required: true },
  Image: { type: String, required: true }, 
  Rating: { type: Number, required: true },
  Category: { type: String, required: true },
  SubCategory: { type: String, required: true },
}, { collection: 'Product' });

module.exports = mongoose.model('Product', ProductSchema);
