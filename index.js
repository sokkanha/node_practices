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

app.use('/products', productRoute);
app.use('/users', usersRoute);



const PORT = 8000;

app.listen(PORT, () => {
  console.log(`app is running on http://localhost:${PORT}`)
});

/**
 * {
  "username": "admin1",
  "email": "admin1@email.com",
  "password":"P@ssw0rd",
  "role": "admin"
}
 */