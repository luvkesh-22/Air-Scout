const express = require('express');
const router = express.Router();
const pool = require('../config/db');

// ✅ IMPORT CONTROLLER (VERY IMPORTANT)
const { searchFlights } = require('../controllers/flightController');

// 🏠 HOME PAGE
router.get('/', (req, res) => {
  console.log("HOME ROUTE HIT");
  res.render('flights/search');
});

// 🎯 DASHBOARD
router.get('/dashboard', async (req, res) => {
  console.log("DASHBOARD HIT 🔥");

  try {
    const result = await pool.query('SELECT * FROM flights');
    res.render('dashboard', { flights: result.rows });
  } catch (err) {
    console.error(err);
    res.send('Error loading dashboard');
  }
});
router.post('/ticket', async (req, res) => {
  const { flight_id } = req.body;

  try {
    const result = await pool.query(
      'SELECT * FROM flights WHERE id = $1',
      [flight_id]
    );

    const flight = result.rows[0];

    res.render('bookings/ticket', { flight });

  } catch (err) {
    console.error(err);
    res.send('Error loading ticket');
  }
});
// ✅🔥 THIS WAS MISSING / WRONG
router.post('/flights/search', searchFlights);

module.exports = router;