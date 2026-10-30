const Project = require('../models/Project');

// GET /api/projects  (public)
exports.getAllProjects = async (req, res, next) => {
  try {
    const projects = await Project.find().sort({ createdAt: -1 }).populate('user', 'username');
    res.json(projects);
  } catch (err) {
    next(err);
  }
};

// GET /api/projects/:id  (public)
exports.getProjectById = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id).populate('user', 'username');
    if (!project) {
      res.status(404);
      throw new Error('Project not found');
    }
    res.json(project);
  } catch (err) {
    next(err);
  }
};

// POST /api/projects  (protected)
exports.createProject = async (req, res, next) => {
  try {
    const { title, description, imageUrl, repoUrl, liveUrl } = req.body;
    const project = await Project.create({
      title,
      description,
      imageUrl,
      repoUrl,
      liveUrl,
      user: req.user._id
    });
    res.status(201).json(project);
  } catch (err) {
    next(err);
  }
};

// PUT /api/projects/:id  (protected)
exports.updateProject = async (req, res, next) => {
  try {
    let project = await Project.findById(req.params.id);
    if (!project) {
      res.status(404);
      throw new Error('Project not found');
    }
    if (project.user.toString() !== req.user._id.toString()) {
      res.status(403);
      throw new Error('You can only edit your own projects');
    }
    project = await Project.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    res.json(project);
  } catch (err) {
    next(err);
  }
};

// DELETE /api/projects/:id  (protected)
exports.deleteProject = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      res.status(404);
      throw new Error('Project not found');
    }
    if (project.user.toString() !== req.user._id.toString()) {
      res.status(403);
      throw new Error('You can only delete your own projects');
    }
    await Project.findByIdAndDelete(req.params.id);
    res.json({ message: 'Project removed', id: req.params.id });
  } catch (err) {
    next(err);
  }
};
