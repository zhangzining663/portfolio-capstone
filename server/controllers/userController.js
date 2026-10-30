const jwt = require('jsonwebtoken');
const User = require('../models/User');

function makeToken(user) {
  return jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
}

// POST /api/users/register
exports.register = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      res.status(400);
      throw new Error('Please provide username, email and password');
    }

    const already = await User.findOne({ $or: [{ email }, { username }] });
    if (already) {
      res.status(400);
      throw new Error('This email or username is already registered');
    }

    const user = await User.create({ username, email, password });

    res.status(201).json({
      _id: user._id,
      username: user.username,
      email: user.email,
      token: makeToken(user)
    });
  } catch (err) {
    next(err);
  }
};

// POST /api/users/login
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      res.status(401);
      throw new Error('Invalid email or password');
    }

    const matched = await user.comparePassword(password);
    if (!matched) {
      res.status(401);
      throw new Error('Invalid email or password');
    }

    res.json({
      _id: user._id,
      username: user.username,
      email: user.email,
      token: makeToken(user)
    });
  } catch (err) {
    next(err);
  }
};
