const Comment = require('../models/Comment');
const BlogPost = require('../models/BlogPost');

// GET /api/blog/:postId/comments  (public)
exports.getCommentsForPost = async (req, res, next) => {
  try {
    const comments = await Comment.find({ post: req.params.postId })
      .sort({ createdAt: 1 })
      .populate('author', 'username');
    res.json(comments);
  } catch (err) {
    next(err);
  }
};

// POST /api/blog/:postId/comments  (protected)
exports.addComment = async (req, res, next) => {
  try {
    const post = await BlogPost.findById(req.params.postId);
    if (!post) {
      res.status(404);
      throw new Error('The post you are commenting on does not exist');
    }
    const comment = await Comment.create({
      body: req.body.body,
      author: req.user._id,
      post: req.params.postId
    });
    await comment.populate('author', 'username');
    res.status(201).json(comment);
  } catch (err) {
    next(err);
  }
};
