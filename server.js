const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
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

// ===== Routes =====

// Root route to avoid 404
app.get('/', (req, res) => {
  res.send('Server is running!');
});

// Wake-up route for uptime monitoring
app.get('/wake-up', (req, res) => {
  res.send('Server is awake!');
});

// Routers
app.use('/api/auth', require('./routes/auth'));
app.use('/api/playlists', require('./routes/playlist'));

// Optional catch-all route to prevent 404s for undefined routes
app.use((req, res) => {
  res.status(200).send('Server is running!');
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
