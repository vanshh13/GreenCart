const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  datePublished: { type: Date, required: true },
  images: { type: [String], default: [] },  // Array of image URLs
});

module.exports = mongoose.model('Blog', blogSchema);
