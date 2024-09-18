require('dotenv').config(); // Ładujemy zmienne środowiskowe z pliku .env
const express = require('express');
const mongoose = require('mongoose');
const bp = require('body-parser');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs'); // Import bcrypt do haszowania haseł
const nodemailer = require('nodemailer'); // Import nodemailer do wysyłania e-maili
const { OAuth2Client } = require('google-auth-library'); // Import klienta OAuth2 z Google
const { connectToDatabase } = require('./db.js'); // Import połączenia z MongoDB
const { mainFilter } = require('./mongo/MongoConnectFilter.js');
const { mainoo } = require('./mongo/MongoConnect.js');
const { mainFilterCal } = require('./mongo/MongoConnectFilterCalendar.js');
const { Predictive } = require('./mongo/MongoConnectPredictive.js');

// Inicjalizacja aplikacji
const app = express();
app.use(cors());
app.use(bp.json());
app.use(bp.urlencoded({ extended: true }));

// Model użytkownika
const User = mongoose.model('User', new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  email: { type: String, required: true },
  role: { type: String, default: 'user' } // Ustawiamy domyślną rolę
}));

const secret = process.env.JWT_SECRET; // Klucz tajny do JWT z pliku .env

const oauth2Client = new OAuth2Client(
  process.env.OAUTH_CLIENT_ID,
  process.env.OAUTH_CLIENT_SECRET,
  process.env.REDIRECT_URI, // Użyj redirect_uri z pliku .env
);

oauth2Client.setCredentials({
  refresh_token: process.env.OAUTH_REFRESH_TOKEN
});

oauth2Client.getAccessToken((err, accessToken) => {
  if (err) {
    console.error('Error getting access token:', err);
    return;
  }

  const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      type: 'OAuth2',
      user: process.env.EMAIL_USER,
      clientId: process.env.OAUTH_CLIENT_ID,
      clientSecret: process.env.OAUTH_CLIENT_SECRET,
      refreshToken: process.env.OAUTH_REFRESH_TOKEN,
      accessToken: accessToken,
    }
  });

  // Generujemy URL autoryzacji
  const scopes = ['https://mail.google.com/'];
  const authUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline', // 'offline' uzyskuje refresh token
    scope: scopes,
    redirect_uri: process.env.REDIRECT_URI // Używaj redirect_uri z pliku .env
  });

  console.log('Autoryzuj tę aplikację, odwiedzając ten URL:', authUrl);

  // Połączenie z bazą danych
  connectToDatabase();

  // Definicja tras
  app.get('/api', async (req, res) => {
    try {
      const result = await mainoo();
      res.json({ message: result });
    } catch (error) {
      console.error('Błąd podczas pobierania danych:', error);
      res.status(500).json({ message: 'Błąd wewnętrzny serwera' });
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
      console.error('Błąd podczas przetwarzania danych:', error);
      res.status(500).json({ message: 'Błąd wewnętrzny serwera' });
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
      return res.status(500).json({ error: 'Błąd serwera' });
    }
  });

  app.post('/api/dataPred', async (req, res) => {
    try {
      const result = await Predictive();
      console.log('predictive', result)
      res.json({ message: result });
    } catch (error) {
      console.error('Błąd podczas przetwarzania danych:', error);
      res.status(500).json({ message: 'Błąd wewnętrzny serwera' });
    }
  });

  app.post('/api/dataCal', async (req, res) => {
    const { startDate, endDate } = req.body;
    try {
      const startingDate = new Date(startDate);
      const endingDate = new Date(endDate);

      startingDate.setHours(startingDate.getHours() );
      endingDate.setHours(endingDate.getHours() + 24);
      const result = await mainFilterCal(startingDate.toISOString(), endingDate.toISOString());
      res.json({ message: result });
    } catch (error) {
      console.error('Błąd podczas przetwarzania danych:', error);
      res.status(500).json({ message: 'Błąd wewnętrzny serwera' });
    }
  });

  app.post('/register', async (req, res) => {
    const { username, password, email, role } = req.body;  // Upewnij się, że rola jest przekazywana

    if (!username || !password || !email) {
      return res.status(400).json({ message: 'Proszę wypełnić wszystkie pola' });
    }

    try {
      const hashedPassword = bcrypt.hashSync(password, 8);
      const newUser = new User({ username, email, password: hashedPassword, role: role }); // Ustaw domyślną rolę, jeśli nie jest podana
      await newUser.save();
      res.status(201).send('Użytkownik zarejestrowany');
    } catch (err) {
      console.error('Błąd podczas rejestracji:', err);
      res.status(500).json({ message: 'Użytkownik już istnieje lub błąd wewnętrzny' });
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
          { username: user.username, role: user.role, email: user.email }, // Dodajemy email do tokena
          secret,
          { expiresIn: '1h' }
        );
        // Zwracamy token, nazwę użytkownika i rolę
        res.json({ token, username: user.username, role: user.role, email: user.email });
      } else {
        res.status(401).send('Nieprawidłowe dane logowania');
      }
    } catch (err) {
      console.error('Błąd podczas logowania:', err);
      res.status(500).json({ message: 'Błąd wewnętrzny serwera' });
    }
  });

  // Definiujemy router do zarządzania użytkownikami
  const userRouter = express.Router();

  userRouter.put('/users/:id', async (req, res) => {
    const { username, email, role } = req.body;

    try {
      const updatedUser = await User.findByIdAndUpdate(
        req.params.id,
        { username, role: role },  // Ustawiamy domyślną rolę, jeśli nie jest podana
        { new: true }
      );
      res.json(updatedUser);
    } catch (err) {
      console.error('Błąd podczas aktualizacji użytkownika:', err);
      res.status(500).json({ message: 'Błąd podczas aktualizacji użytkownika' });
    }
  });

  userRouter.delete('/users/:id', async (req, res) => {
    try {
      await User.findByIdAndDelete(req.params.id);
      res.json({ message: 'Użytkownik usunięty' });
    } catch (err) {
      console.error('Błąd podczas usuwania użytkownika:', err);
      res.status(500).json({ message: 'Błąd podczas usuwania użytkownika' });
    }
  });

  userRouter.get('/users', async (req, res) => {
    try {
      const users = await User.find();
      res.json(users);
    } catch (err) {
      console.error('Błąd podczas pobierania użytkowników:', err);
      res.status(500).json({ message: 'Błąd podczas pobierania użytkowników' });
    }
  });

  app.post('/api/send-email', async (req, res) => {
    const { to, subject, text } = req.body;

    if (!to || !subject || !text) {
      return res.status(400).json({ error: 'Brak wymaganych pól: do, temat lub treść' });
    }

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to,
      subject,
      text,
    };

    try {
      const info = await transporter.sendMail(mailOptions);
      res.status(200).json({ message: `E-mail wysłany pomyślnie: ${info.response}` });
    } catch (error) {
      if (error.responseCode === 535) {
        res.status(500).json({ error: 'Błąd uwierzytelniania: Nieprawidłowe dane logowania' });
      } else {
        res.status(500).json({ error: 'Błąd podczas wysyłania e-maila' });
      }
      console.error('Błąd podczas wysyłania e-maila:', error);
    }
  });

  app.use('/api', userRouter);

  app.listen(5001, () => {
    console.log('Serwer nasłuchuje na porcie 5001');
  });
});
