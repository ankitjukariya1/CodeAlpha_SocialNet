const mongoose = require('mongoose');

const tagSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true, trim: true }
});

// Index for faster tag lookups
tagSchema.index({ name: 1 });

module.exports = mongoose.model('Tag', tagSchema);