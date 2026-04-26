const pool = require('../config/db');

// 🔁 Convert DB → Amadeus-like format
function formatFlight(flight) {
  return {
    id: flight.id,

    itineraries: [
      {
        duration: `PT${Math.floor(flight.duration / 60)}H${flight.duration % 60}M`,
        segments: [
          {
            departure: {
              iataCode: flight.from_code,
              at: flight.departure_time
            },
            arrival: {
              iataCode: flight.to_code,
              at: flight.arrival_time
            },
            carrierCode: flight.airline,
            number: "AS123",
            numberOfStops: flight.stops
          }
        ]
      }
    ],

    price: {
      total: flight.price.toString()
    }
  };
}

// 🔍 Search DB (FINAL FIX)
exports.searchFlights = async (from, to) => {
  const result = await pool.query(
    `SELECT * FROM flights 
     WHERE from_code = $1 AND to_code = $2`,
    [from, to]
  );

  return result.rows.map(formatFlight);
};