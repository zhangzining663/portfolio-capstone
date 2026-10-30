const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, 'your name is required'] },
    email: { type: String, required: [true, 'your email is required'] },
    message: { type: String, required: [true, 'message content cannot be empty'] }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Message', messageSchema);
