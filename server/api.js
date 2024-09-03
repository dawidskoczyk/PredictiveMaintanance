require('dotenv').config(); // Load environment variables from .env file
const { reply, queryContainerDecybels } = require("./DatabaseApp.js");
const bp = require("body-parser");
const {main} = require("./DatabaseApp.js")
const {mainoo} = require("./mongo/MongoConnect.js")
const jwt = require('jsonwebtoken');
const express = require("express");
const cors = require("cors");
const mongoose = require('mongoose');
const app = express();
const bcrypt = require('bcryptjs'); // Import bcrypt
const { connectToDatabase } = require('./db.js'); // Import the MongoDB connection
app.use(cors());
app.use(bp.json());
app.use(bp.urlencoded({ extended: true }));
const User = mongoose.model('User', new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  email: { type: String, required: true }
}));
const secret = process.env.JWT_SECRET; // Use the secret from environment variables

connectToDatabase();

let starterDate = null;
let enderDate = null;

app.get("/api", async (req, res) => {
  // return res.json({ message: reply });
  const result = await mainoo();
  return res.json({message: result});
});
const options = {
  day: "2-digit", // Dzień z zerem na początku
  month: "2-digit", // Miesiąc bez zera na początku
  year: "numeric", // Rok pełny
};
app.post("/api/data", async (req, res) => {
  const startDate = req.body.startDate;
  const endDate = req.body.endDate;
  const startingDate = new Date(startDate);
  const endingDate = new Date(endDate);
  starterDate = startingDate?.toISOString();
  //console.log(startDate, endDate);
  enderDate = endingDate?.toISOString();
  //console.log("Received data:", data);
  exports.sd = starterDate;
  console.log(`api start ${starterDate}, ${enderDate}`);
  exports.ed = enderDate;
  const result = await main();
  console.log(`wynik${result}`);
  return res.json({ message: result });
});

app.post('/register', async (req, res) => {
  console.log("register clicked!");
  const { username, password, email } = req.body;
  if (!username || !password || !email) {
    return res.status(400).json({ message: 'Please fill in all fields' });
  }
  
  try {
    const hashedPassword = bcrypt.hashSync(password, 8);
    const newUser = new User({ username, email, password: hashedPassword });
    console.log(newUser.username);
    await newUser.save();
    res.status(201).send('User registered');
  } catch (err) {
    console.error('Error during registration:', err);
    res.status(500).json({ message: 'User istnieje' });
  }
});

// Login endpoint
app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  console.log("wpisane login:", username);
  try {
    const user = await User.findOne({ username });
    if (user && bcrypt.compareSync(password, user.password)) {
      const token = jwt.sign({ username }, secret, { expiresIn: '1h' });
      res.json({ token });
      console.log("wszystko działa w loginie")
    } else {
      res.status(401).send('Invalid credentials');
      console.log("zle dane");
    }
  } catch (err) {
    console.error('Error during login:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});
app.listen(5001, () => {
  console.log("listening");
});
