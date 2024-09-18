require('dotenv').config(); // Load environment variables from .env file
const express = require('express');
const mongoose = require('mongoose');
const bp = require('body-parser');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs'); // Import bcrypt
const nodemailer = require('nodemailer'); // Import nodemailer
const validator = require('validator'); // Import validator for email validation
const { connectToDatabase } = require('./db.js'); // Import the MongoDB connection
const { mainFilter } = require('./mongo/MongoConnectFilter.js');
const { mainoo } = require('./mongo/MongoConnect.js');
const { mainFilterCal } = require('./mongo/MongoConnectFilterCalendar.js');
const { Predictive } = require('./mongo/MongoConnectPredictive.js');

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
  role: { type: String, default: 'user' } // Ensure default is set
}));

const secret = process.env.JWT_SECRET; // Use the secret from environment variables

const transporter = nodemailer.createTransport({
  service: 'Gmail', // or another email service provider
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

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

app.post('/check-email', async (req, res) => {
  const { email, username } = req.body;

  try {
    const existingUserByEmail = await User.findOne({ email });
    const existingUserByUsername = await User.findOne({ username });

    if (existingUserByEmail) {
      return res.json({ emailExists: true, usernameExists: false });
    } 
    if (existingUserByUsername) {
      return res.json({ emailExists: false, usernameExists: true });
    } 
    return res.json({ emailExists: false, usernameExists: false });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server error' });
  }
});


app.post('/api/dataPred', async (req, res) => {
  try {
    const result = await Predictive();
    console.log('predictive', result)
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

    startingDate.setHours(startingDate.getHours() );
    endingDate.setHours(endingDate.getHours() +24);
    const result = await mainFilterCal(startingDate.toISOString(), endingDate.toISOString());
    res.json({ message: result });
  } catch (error) {
    console.error('Error processing data:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});


app.post('/register', async (req, res) => {
  const { username, password, email, role } = req.body;  // Ensure role is passed

  if (!username || !password || !email) {
    return res.status(400).json({ message: 'Please fill in all fields' });
  }

  try {
    const hashedPassword = bcrypt.hashSync(password, 8);
    const newUser = new User({ username, email, password: hashedPassword, role: role }); // Set default role if not provided
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
    // Szukamy użytkownika w bazie danych
    const user = await User.findOne({ username });

    // Jeśli użytkownik istnieje i hasło się zgadza
    if (user && bcrypt.compareSync(password, user.password)) {
      const token = jwt.sign(
        { username: user.username, role: user.role, email: user.email }, // Include email in the token
        secret,
        { expiresIn: '1h' }
      );
      // Zwracamy token, nazwę użytkownika i rolę
      res.json({ token, username: user.username, role: user.role, email: user.email });
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
  const { username, email, role } = req.body;

  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { username, role: role },  // Set default role if not provided
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

app.post('/api/send-email', async (req, res) => {
  const { to, subject, text } = req.body;

  if (!to || !subject || !text) {
    console.error('Missing required fields:', { to, subject, text });
    return res.status(400).json({ error: 'Missing required fields: to, subject, or text' });
  }

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject,
    text
  };

  try {
    console.log('Sending email with options:', mailOptions);
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.response);
    res.status(200).json({ message: `Email sent: ${info.response}` });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ error: 'Error sending email' });
  }
});
app.use('/api', userRouter);

app.listen(5001, () => {
  console.log('Server listening on port 5001');
});
