const express = require("express");
const router = express.Router();
const airports = require("../utils/airports");

const flightController = require("../controllers/flightController");

// 👇 ADD THIS
router.get("/search", (req, res) => {
res.render("flights/search", { airportList: airports.airportList });
});

// 👇 CHANGE THIS
router.get("/search/results", flightController.searchFlights);

module.exports = router;