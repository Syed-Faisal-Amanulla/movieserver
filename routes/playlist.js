const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Playlist = require('../models/Playlist');
const Movie = require('../models/Movie'); // Adjust the path as per your file structure

// Get a specific playlist by ID with movies

//
router.get('/:id', async (req, res) => {
  try {
    const playlist = await Playlist.findById(req.params.id).populate('movies', 'title poster');
    res.json(playlist);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
router.get('/users/:uid', async (req, res) => {
  try {
    const playlists = await Playlist.find({ userId: req.params.uid });
    const playlistsWithMovies = await Promise.all(playlists.map(async (playlist) => {
      const movies = await Movie.find({ _id: { $in: playlist.movies } });
      return { ...playlist.toObject(), movies };
    }));
    res.json(playlistsWithMovies);
  } catch (error) {
    console.error('Error fetching playlists:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

//

router.put('/:id/add-movie', async (req, res) => {
  try {
    const { movieId, title, poster } = req.body;
    const playlistId = req.params.id;

    // Ensure playlistId is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(playlistId)) {
      return res.status(400).json({ error: 'Invalid playlist ID' });
    }

    const playlist = await Playlist.findById(playlistId);
    if (!playlist) {
      return res.status(404).json({ error: 'Playlist not found' });
    }

    // Add movie details to the playlist
    playlist.movies.push({ movieId, title, poster });
    await playlist.save();
    res.json(playlist);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create a new playlist
router.post('/', async (req, res) => {
  const { userId, name, description, type } = req.body;
  try {
    const newPlaylist = new Playlist({ userId, name, description, type });
    await newPlaylist.save();
    res.status(201).json(newPlaylist);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all playlists for a user
router.get('/user/:userId', async (req, res) => {
  try {
    const playlists = await Playlist.find({ userId: req.params.userId });
    res.json(playlists);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update a playlist
router.put('/:id', async (req, res) => {
  try {
    const updatedPlaylist = await Playlist.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedPlaylist);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete a playlist
router.delete('/:id', async (req, res) => {
  try {
    await Playlist.findByIdAndDelete(req.params.id);
    res.json({ message: 'Playlist deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
