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
  rate: { type: Number, default: 0 },
  comment: [commentSchema],
  report: [reportSchema],
});

const movieSchema = new mongoose.Schema({
  mainTitle: String,
  subTitle: String,
  description: String,
  country: String,
  releaseDate: { type: Date, required: true },
  duration: { type: Number, default: 0 },
  casts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Actor', default: [] }],
  directors: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Director', default: [] }],
  genres: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Genre', default: [] }],
  userActivity: { type: [userActivitySchema], default: [] },
  status: { type: String, default: "Available" },
  promote: {
    isPromote: { type: Boolean, default: false },
    startDate: { type: Date },
    endDate: { type: Date },
  },
  source: { type: String },
}, { timestamps: true });

movieSchema.pre('save', function (next) {
  if (!this.source && this.subTitle) {
    this.source = this.subTitle.replace(/\s+/g, '-');
  }
  next();
});

module.exports = mongoose.model('Movie', movieSchema);