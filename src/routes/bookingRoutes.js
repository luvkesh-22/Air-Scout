const express = require("express");
const router = express.Router();

const bookingController = require("../controllers/bookingController");

// 📜 MY BOOKINGS PAGE
router.get("/bookings", bookingController.getMyBookings);

module.exports = router;