const express = require('express');
const router = express.Router();
const pool = require('../config/db');

const { searchFlights } = require('../controllers/flightController');
const { airportList } = require('../utils/airports');

// ✅ Search page
router.get('/', (req, res) => {
  res.render('flights/search', { airportList });
});

// ✅ Results
router.get('/search', searchFlights);

// ✅ Ticket (POST - from Book Now)
router.post('/ticket', async (req, res) => {
  if (!req.session.user) {
    req.session.redirectAfterLogin = req.originalUrl;

    // ✅ store flight before login
    req.session.pendingFlightId = req.body.flight_id;

    return res.redirect('/auth/login');
  }

  const { flight_id } = req.body;

  try {
    const result = await pool.query(
      'SELECT * FROM flights WHERE id = $1',
      [flight_id]
    );

    const flight = result.rows[0];

    req.session.selectedFlight = flight;

    res.render('bookings/ticket', { flight });

  } catch (err) {
    console.error(err);
    res.send('Error loading ticket');
  }
});

// ✅ Ticket (GET - after login redirect)
router.get('/ticket', async (req, res) => {
  let flight = req.session.selectedFlight;

  // coming after login
  if (!flight && req.session.pendingFlightId) {
    const result = await pool.query(
      'SELECT * FROM flights WHERE id = $1',
      [req.session.pendingFlightId]
    );

    flight = result.rows[0];

    req.session.selectedFlight = flight;
    req.session.pendingFlightId = null;
  }

  if (!flight) {
    return res.redirect('/flights');
  }

  res.render('bookings/ticket', { flight });
});

module.exports = router;