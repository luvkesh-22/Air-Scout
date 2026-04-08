const express = require('express');
const cors = require('cors');
const session = require('express-session');
const pool = require('./src/config/db');

const app = express();

// ✅ VIEW ENGINE (MUST COME EARLY)
app.set('view engine', 'ejs');
app.set('views', './src/views');

// ✅ MIDDLEWARE
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ SESSION (BEFORE ROUTES)
app.use(
 session({
  secret: 'mysecretkey',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false,
    maxAge: 1000 * 60 * 60 // 1 hour
  }
})
);

// ✅ ROUTES IMPORT
const bookingRoutes = require("./src/routes/bookingRoutes");
const flightRoutes = require("./src/routes/flightRoutes");
const authRoutes = require("./src/routes/authRoutes"); // 🔥 ADDED

// ✅ CONNECT ROUTES
app.use("/", authRoutes);     // 🔥 ADDED
app.use("/", flightRoutes);
app.use("/", bookingRoutes);

// ✅ LOGIN PAGE ROUTE (SAFE NOW)
app.get('/login', (req, res) => {
  res.render('auth/login');
});

app.get('/signup', (req, res) => {
  res.render('auth/signup');
});

// 🔥 TEST DB
app.get('/debug/flights', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM flights');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.send('Error fetching flights');
  }
});

// 🚀 GET FLIGHTS (API)
app.get('/api/flights', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM flights');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error fetching flights');
  }
});

// 🚀 CREATE USER
app.post('/users', async (req, res) => {
  try {
    const { name, email } = req.body;

    const result = await pool.query(
      'INSERT INTO users (name, email) VALUES ($1, $2) RETURNING *',
      [name, email]
    );

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error creating user');
  }
});

// 🚀 BOOK FLIGHT (UPDATED FOR EJS FLOW)
app.post('/book', async (req, res) => {
  try {
    console.log("BODY:", req.body);

    if (!req.session.user) {
      return res.redirect('/login');
    }

    const flight_id = req.body.flight_id;
    const user_id = req.session.user.id; // ✅ THIS WAS MISSING

    await pool.query(
      'INSERT INTO bookings (user_id, flight_id) VALUES ($1, $2)',
      [user_id, flight_id]
    );

    res.redirect('/bookings');

  } catch (err) {
    console.error(err);
    res.send('Error booking flight');
  }
});
// 🚀 CANCEL BOOKING
app.post('/cancel/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const user_id = req.query.user_id;

    await pool.query(
      "UPDATE bookings SET status = 'cancelled' WHERE id = $1",
      [id]
    );

 res.redirect('/bookings');
  } catch (err) {
    console.error(err);
    res.send('Error cancelling booking');
  }
});

// 🚀 BOOKINGS API (JSON)
app.get('/api/bookings/:user_id', async (req, res) => {
  try {
    const user_id = req.params.user_id;

    const result = await pool.query(
      `SELECT b.id, f.from_city, f.to_city, f.price, b.status
       FROM bookings b
       JOIN flights f ON b.flight_id = f.id
       WHERE b.user_id = $1`,
      [user_id]
    );

    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error fetching bookings');
  }
});

// ✅ START SERVER
app.listen(3000, () => {
  console.log('Server running on port 3000');
});