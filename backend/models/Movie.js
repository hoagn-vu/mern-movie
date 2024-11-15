const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  createAt: { type: Date, default: Date.now },
  content: String,
});

const reportSchema = new mongoose.Schema({
  createAt: { type: Date, default: Date.now },
  content: String,
});

const userActivitySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  rate: Number,
  comment: [commentSchema],
  report: [reportSchema],
});

const movieSchema = new mongoose.Schema({
  title: {
    mainTitle: String,
    subTitle: String,
  },
  description: String,
  country: String,
  releaseYear: Number,
  casts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Actor', default: [] }],
  directors: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Director', default: [] }],
  genres: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Genre', default: [] }],
  userActivity: [{ userActivitySchema, default: [] }],
  createAt: { type: Date, default: Date.now() },
  status: { type: String, default: "Available" },
});

module.exports = mongoose.model('Movie', movieSchema);
