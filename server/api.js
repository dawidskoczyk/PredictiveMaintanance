require('dotenv').config(); // Load environment variables from .env file
const express = require('express');
const mongoose = require('mongoose');
const bp = require('body-parser');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs'); // Import bcrypt
const validator = require('validator'); // Import validator for email validation
const { connectToDatabase } = require('./db.js'); // Import the MongoDB connection
const { mainFilter } = require('./mongo/MongoConnectFilter.js');
const { mainoo } = require('./mongo/MongoConnect.js');
const { mainFilterCal } = require('./mongo/MongoConnectFilterCalendar.js');

// Initialize app
const app = express();
app.use(cors());
app.use(bp.json());
app.use(bp.urlencoded({ extended: true }));

// Define User model
const User = mongoose.model('User', new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  email: { type: String, required: true },
  role: { type: String, default: 'user' } // Dodaj domyślną rolę
}));

const secret = process.env.JWT_SECRET; // Use the secret from environment variables

// Connect to the database
connectToDatabase();

// Define routes
app.get('/api', async (req, res) => {
  try {
    const result = await mainoo();
    res.json({ message: result });
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.post('/api/data', async (req, res) => {
  const { startDate, endDate } = req.body;
  try {
    const startingDate = new Date(startDate);
    const endingDate = new Date(endDate);

    startingDate.setHours(startingDate.getHours() + 2);
    endingDate.setHours(endingDate.getHours() + 26);

    const result = await mainFilterCal(startingDate.toISOString(), endingDate.toISOString());
    res.json({ message: result });
  } catch (error) {
    console.error('Error processing data:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.post('/api/dataCal', async (req, res) => {
  const { startDate, endDate } = req.body;
  try {
    const startingDate = new Date(startDate);
    const endingDate = new Date(endDate);

    startingDate.setHours(startingDate.getHours() -2);
    endingDate.setHours(endingDate.getHours() +22);
    const result = await mainFilterCal(startingDate.toISOString(), endingDate.toISOString());
    res.json({ message: result });
  } catch (error) {
    console.error('Error processing data:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});


app.post('/register', async (req, res) => {
  const { username, password, email, role } = req.body;  // Dodaj 'role'
  console.log('register');
  if (!username || !password || !email) {
    return res.status(400).json({ message: 'Please fill in all fields' });
  }
  try {
    const hashedPassword = bcrypt.hashSync(password, 8);
    const newUser = new User({ username, email, password: hashedPassword, role }); // Dodaj 'role'
    await newUser.save();
    res.status(201).send('User registered');
  } catch (err) {
    console.error('Error during registration:', err);
    res.status(500).json({ message: 'User already exists or internal error' });
  }
});

app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    if (user && bcrypt.compareSync(password, user.password)) {
      const token = jwt.sign({ username }, secret, { expiresIn: '1h' });
      res.json({ token });
    } else {
      res.status(401).send('Invalid credentials');
    }
  } catch (err) {
    console.error('Error during login:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Define a router for user management
const userRouter = express.Router();

userRouter.put('/users/:id', async (req, res) => {
  const { username, role } = req.body;  // Dodaj 'role'
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { username, role },  // Dodaj 'role'
      { new: true }
    );
    res.json(updatedUser);
  } catch (err) {
    console.error('Error updating user:', err);
    res.status(500).json({ message: 'Error updating user' });
  }
});

userRouter.delete('/users/:id', async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'User deleted' });
  } catch (err) {
    console.error('Error deleting user:', err);
    res.status(500).json({ message: 'Error deleting user' });
  }
});

userRouter.get('/users', async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    console.error('Error fetching users:', err);
    res.status(500).json({ message: 'Error fetching users' });
  }
});

app.use('/api', userRouter);

app.listen(5001, () => {
  console.log('Server listening on port 5001');
});
