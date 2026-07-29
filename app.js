import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import connectDB from './config/db.js';

import productRoute from './routes/product_routes.js';
console.log('Current Folder:', process.cwd());
console.log('MONGO_URI loaded:', process.env.MONGO_URI);

const app = express();
const PORT = process.env.PORT || 5000;

connectDB();

// const productRoute = require('./routes/product_routes');

// Middleware to parse JSON data
app.use(express.json());
// Enable CORS for all origins
app.use(cors());
app.use(express.urlencoded({ extended: true }));
// app.use('/uploads', express.static('uploads'));
app.use("/", productRoute);

app.get('/redirect', (req, res) => {
  const url = req.query.url;

  if (!url) {
    return res.status(400).send('URL is required');
  }

  return res.redirect(url);
});

// 1. Connect to MongoDB (Replace with your Atlas URI if using Cloud)
// mongoose.connect('mongodb://localhost:27017/Ag_One')
//   .then(() => console.log('✅ Connected to MongoDB'))
//   .catch(err => console.error('❌ Connection error:', err));

// 2. Define a simple Route
app.get('/', (req, res) => {
  res.send('Server is running!');
});

// 3. Start the Server
app.listen(PORT, () => {
  console.log(`🚀 Server listening on http://localhost:${PORT}`);
});