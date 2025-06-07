const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  datePublished: { type: Date, default: Date.now },
  images: { type: [String], default: [] }, // Array of image URLs
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // Users who liked the blog
  comments: [
    {
      userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      text: { type: String},
      date: { type: Date, default: Date.now }
    }
  ]
});

module.exports = mongoose.model('Blog', blogSchema);
