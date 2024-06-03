

const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
  movieId: { type: String, required: true },
  title: { type: String, required: true },
  poster: { type: String, required: true },
});

const playlistSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  name: { type: String, required: true },
  description: { type: String, required: true },
  type: { type: String, enum: ['private', 'public'] },
  movies: [movieSchema], // Store movie details directly
  createdAt: { type: Date, default: Date.now }
});

const Playlist = mongoose.model('Playlist', playlistSchema);

module.exports = Playlist;
