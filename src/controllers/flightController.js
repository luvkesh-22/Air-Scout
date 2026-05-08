const flightService = require('../services/flightService');
const amadeusService = require('../services/amadeusService');
exports.searchFlights = async (req, res) => {
  console.log("🔥 CONTROLLER HIT");

let { from, to, date } = req.query;

// fallback date (today + 1 day)
if (!date) {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  date = d.toISOString().split("T")[0];
}

  console.log("FROM:", from);
  console.log("TO:", to);

  // ❌ prevent empty search crash
  if (!from || !to) {
    return res.render("flights/search", {
      airportList: require("../utils/airports")
    });
  }

  try {
  const fromCode = from;
  const toCode = to;

  let flights = [];

  try {
    // 🔥 TRY API FIRST
    flights = await amadeusService.searchFlights(fromCode, toCode, date);
    console.log("API FLIGHTS:", flights.length);

  } catch (apiError) {
    console.error("API FAILED → USING DB");

    // 🔥 FALLBACK TO DB
    flights = await flightService.searchFlights(fromCode, toCode);
    console.log("DB FLIGHTS:", flights.length);
  }

  return res.render("flights/results", { flights });

} catch (err) {
  console.error("FINAL ERROR:", err);
  return res.render("flights/results", { flights: [] });
}
};