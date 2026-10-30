const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema(
  {
    title: { type: String, required: [true, 'project title is required'], trim: true },
    description: { type: String, required: [true, 'project description is required'] },
    imageUrl: { type: String, default: '' },
    repoUrl: { type: String, default: '' },
    liveUrl: { type: String, default: '' },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Project', projectSchema);
