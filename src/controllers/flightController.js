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
  try {
   const from = resolveCode(req.query.from);
   const to = resolveCode(req.query.to);
    const date = req.query.date;

    if (!from || !to || !date) {
      return res.send("Missing search parameters");
    }

    console.log("SEARCH DATA:", from, to, date);

    try {
      // 🌐 1. Try API
      const flights = await amadeusService.searchFlights(from, to, date);

      if (flights && flights.length > 0) {
        console.log("✅ API SUCCESS");

        // ✅ FIX 2 (SAVE DATA)
        await saveFlightsToDB(flights);

        return res.render('flights/results', { flights });
      }

      throw new Error("No API flights");

    } catch (apiError) {
      console.log("⚠️ API FAILED → USING DB");

      // 🗄️ 2. Fallback to DB
      const dbFlights = await flightService.searchFlights(from, to);

      return res.render('flights/results', { flights: dbFlights });
    }

  } catch (err) {
    console.error("FINAL ERROR:", err.message);
    res.send("Something went wrong");
  }
};