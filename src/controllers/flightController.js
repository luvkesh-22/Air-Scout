const amadeusService = require('../services/amadeusService');
const flightService = require('../services/flightService');
const pool = require('../config/db'); // ✅ FIX 1
const { resolveCode } = require('../utils/airports');
console.log("AIRPORT MODULE:", require('../utils/airports'));


// 💾 Save API flights into DB
async function saveFlightsToDB(flights) {
  for (const f of flights) {
    try {
      const segment = f.itineraries[0].segments[0];

      await pool.query(
        `INSERT INTO flights 
        (from_code, to_code, departure_time, arrival_time, price, airline, duration, stops)
        VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
        ON CONFLICT DO NOTHING`,
        [
          segment.departure.iataCode,
          segment.arrival.iataCode,
          new Date(segment.departure.at), // ✅ FIX 3
          new Date(segment.arrival.at),
          parseInt(f.price.total),
          segment.carrierCode,
          180, // keep simple for now
          segment.numberOfStops || 0
        ]
      );

    } catch (err) {
      console.log("Insert skipped:", err.message);
    }
  }
}

// 🔍 Main search controller
exports.searchFlights = async (req, res) => {

  const { from, to } = req.query;

  const baseTimes = [
    ["06:00 AM", "08:00 AM"],
    ["07:30 AM", "09:45 AM"],
    ["09:00 AM", "11:15 AM"],
    ["11:00 AM", "01:20 PM"],
    ["01:30 PM", "03:50 PM"],
    ["03:00 PM", "05:20 PM"],
    ["05:30 PM", "07:45 PM"],
    ["07:00 PM", "09:20 PM"],
    ["09:30 PM", "11:50 PM"],
    ["11:00 PM", "01:15 AM"]
  ];

  const airlines = ["IndiGo", "Air India", "Vistara", "SpiceJet"];

  const flights = baseTimes.map((time, index) => ({
    id: index + 1,
    airline: airlines[index % airlines.length],
    from: from || "DEL",
    to: to || "BLR",
    departure: time[0],
    arrival: time[1],
    price: 5000 + Math.floor(Math.random() * 3000)
  }));

  res.render('flights/results', { flights });
};