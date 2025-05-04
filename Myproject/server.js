const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();

// Middleware
app.use(express.json());
app.use(express.static('public'));

// Test route
app.get('/', (req, res) => res.send('API Running 🚀'));

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB connected'))
  .catch((err) => console.error('❌ MongoDB connection error:', err));

const PORT = process.env.PORT || 5500;
app.listen(PORT, () => console.log(`🚀 Server started on port ${PORT}`));
