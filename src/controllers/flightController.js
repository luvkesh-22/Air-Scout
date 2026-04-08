const pool = require('../config/db');

exports.searchFlights = async (req, res) => {
  try {
    const { from, to, date } = req.body;

    console.log("BODY:", req.body);
    console.log("Searching:", from, to);

    const result = await pool.query(
      `SELECT * FROM flights 
       WHERE LOWER(from_city) LIKE LOWER($1) 
       AND LOWER(to_city) LIKE LOWER($2)`,
      [`%${from.trim()}%`, `%${to.trim()}%`]
    );

    const flights = result.rows;

    console.log("FILTERED FLIGHTS:", flights);

    // ✅ KEEP render (DO NOT CHANGE)
    return res.render("flights/results", { flights });

  } catch (error) {
    console.error("Search Error:", error.message);

    // ✅ STILL render (not json)
    return res.status(500).render("flights/results", { 
      flights: [],
      error: "Something went wrong"
    });
  }
};