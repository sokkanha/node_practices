require('dotenv').config();
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');

app.use(express.json());


const productRoute = require('./routes/product.route');
const usersRoute = require('./routes/users.route');
const inventoryRoute = require('./routes/inventory.route');

mongoose.connect('mongodb://localhost:27017/')
.then(() => console.log('MongoDB connected successfully'))
.catch(err => console.error('MongoDB connection error:', err));

// Middleware
app.use(cors({
  origin: 'http://localhost:8080', // Angular dev server
  credentials: true
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req,res) => {
  res.send('app is running!');
});

app.use('/api/products', productRoute);
app.use('/api/users', usersRoute);
app.use('/api/inventory', inventoryRoute);

const PORT = 8000;

app.listen(PORT, () => {
  console.log(`app is running on http://localhost:${PORT}`)
});
