const mongoose = require('mongoose');

const blogPostSchema = new mongoose.Schema(
  {
    title: { type: String, required: [true, 'post title is required'], trim: true },
    content: { type: String, required: [true, 'post content is required'] },
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model('BlogPost', blogPostSchema);
