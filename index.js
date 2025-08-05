require('dotenv').config();
const express = require('express');
const app = express();
app.use(express.json());
const mongoose = require('mongoose');
const productRoute = require('./routes/product.route');
const usersRoute = require('./routes/users.route');


mongoose.connect(process.env.MONGO_URI)
.then(() => console.log('MongoDB connected successfully'))
.catch(err => console.error('MongoDB connection error:', err));


app.get('/', (req,res) => {
  res.send('app is running!');
});

app.use('/api/products', productRoute);
app.use('/api/auth', usersRoute);



const PORT = 8000;

app.listen(PORT, () => {
  console.log(`app is running on http://localhost:${PORT}`)
});
