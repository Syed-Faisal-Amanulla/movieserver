const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const playlistRoutes = require('./routes/playlist');
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch((err) => console.log('MongoDB connection error:', err));


// Define Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/playlists', playlistRoutes);


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(Server running on port ${PORT});
});
