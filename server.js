const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

// MongoDB Atlas connection string
const uri = 'mongodb+srv://Nithesh0812:Nithesh0812@cluster0.z3jwmhh.mongodb.net/?retryWrites=true&w=majority';

// Connect to MongoDB using Mongoose
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;


db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Successfully connected to MongoDB Atlas');
});

// Mongoose Schema for User
const userSchema = new mongoose.Schema({
  username: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  phoneNumber: { type: String, required: true },
});


const User = mongoose.model('User', userSchema);




// Route for user registration
app.post('/register', async (req, res) => {
  try {
    // Check if the username or email already exists
    const existingUser = await User.findOne({ $or: [{ username: req.body.username }, { email: req.body.email }] });

    if (existingUser) {
      return res.status(400).json({ error: 'Username or email already exists' });
    }

    // Create a new user using the User model
    const newUser = new User({
      username: req.body.username,
      password: req.body.password,
      email: req.body.email,
      phoneNumber: req.body.phoneNumber,
    });

    // Save the new user to the database
    await newUser.save();

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Error during registration' });
  }
});

// Route for user login
app.post('/login', async (req, res) => {
  try {
    // Find the user in the database
    const user = await User.findOne({ username: req.body.username, password: req.body.password });

    if (user) {
      // Return user data on successful login
      res.status(200).json({ user });
    } else {
      // Invalid credentials
      res.status(401).json({ error: 'Invalid credentials' });
    }
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Error during login' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
