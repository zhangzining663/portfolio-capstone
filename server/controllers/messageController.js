const Message = require('../models/Message');

// POST /api/contact  (public, saves the contact form message)
exports.sendMessage = async (req, res, next) => {
  try {
    const { name, email, message } = req.body;
    if (!name || !email || !message) {
      res.status(400);
      throw new Error('Name, email and message are all required');
    }
    const saved = await Message.create({ name, email, message });
    res.status(201).json({ message: 'Thanks, your message has been received', data: saved });
  } catch (err) {
    next(err);
  }
};
