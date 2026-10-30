const express = require('express');
const router = express.Router({ mergeParams: true });
const { getCommentsForPost, addComment } = require('../controllers/commentController');
const { protect } = require('../middleware/auth');

router.route('/').get(getCommentsForPost).post(protect, addComment);

module.exports = router;
