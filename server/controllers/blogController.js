const BlogPost = require('../models/BlogPost');
const Comment = require('../models/Comment');

// GET /api/blog  (public, list every post with author username)
exports.getAllPosts = async (req, res, next) => {
  try {
    const posts = await BlogPost.find()
      .sort({ createdAt: -1 })
      .populate('author', 'username');
    res.json(posts);
  } catch (err) {
    next(err);
  }
};

// GET /api/blog/:id  (public, single post + author + its comments)
exports.getPostById = async (req, res, next) => {
  try {
    const post = await BlogPost.findById(req.params.id).populate('author', 'username');
    if (!post) {
      res.status(404);
      throw new Error('Blog post not found');
    }
    const comments = await Comment.find({ post: req.params.id })
      .sort({ createdAt: 1 })
      .populate('author', 'username');

    const data = post.toObject();
    data.comments = comments;
    res.json(data);
  } catch (err) {
    next(err);
  }
};

// POST /api/blog  (protected)
exports.createPost = async (req, res, next) => {
  try {
    const { title, content } = req.body;
    const post = await BlogPost.create({ title, content, author: req.user._id });
    res.status(201).json(post);
  } catch (err) {
    next(err);
  }
};

// PUT /api/blog/:id  (protected, author only)
exports.updatePost = async (req, res, next) => {
  try {
    let post = await BlogPost.findById(req.params.id);
    if (!post) {
      res.status(404);
      throw new Error('Blog post not found');
    }
    if (post.author.toString() !== req.user._id.toString()) {
      res.status(403);
      throw new Error('Only the author can update this post');
    }
    post = await BlogPost.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    res.json(post);
  } catch (err) {
    next(err);
  }
};

// DELETE /api/blog/:id  (protected, author only)
exports.deletePost = async (req, res, next) => {
  try {
    const post = await BlogPost.findById(req.params.id);
    if (!post) {
      res.status(404);
      throw new Error('Blog post not found');
    }
    if (post.author.toString() !== req.user._id.toString()) {
      res.status(403);
      throw new Error('Only the author can delete this post');
    }
    await BlogPost.findByIdAndDelete(req.params.id);
    // remove the comments attached to this post as well
    await Comment.deleteMany({ post: req.params.id });
    res.json({ message: 'Post removed', id: req.params.id });
  } catch (err) {
    next(err);
  }
};
