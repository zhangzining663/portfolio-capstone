const express = require('express');
const router = express.Router();
const {
  getAllProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject
} = require('../controllers/projectController');
const { protect } = require('../middleware/auth');

router.route('/').get(getAllProjects).post(protect, createProject);
router.route('/:id').get(getProjectById).put(protect, updateProject).delete(protect, deleteProject);

module.exports = router;
