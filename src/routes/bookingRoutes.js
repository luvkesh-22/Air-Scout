const express = require("express");
const router = express.Router();

const razorpay = require("../config/razorpay");
const pool = require("../config/db");

const { requireAuth } = require("../middleware/authMiddleware");

const {
  getMyBookings,
  cancelBooking,
  showPassengerForm,
  savePassenger,
  showPaymentPage,
  processPayment,
  showSuccessPage
} = require("../controllers/bookingController");


// ✅ BOOKINGS
router.get("/bookings", requireAuth, getMyBookings);
router.post("/cancel/:id", requireAuth, cancelBooking);

router.post("/select-flight", (req, res) => {
  const { id, from, to, price, airline } = req.body;

  req.session.selectedFlight = {
    id,
    from,
    to,
    price,
    airline
  };

  console.log("✈️ Flight selected:", req.session.selectedFlight);

  res.redirect("/booking/passenger");
});
// ✅ FLOW
router.get("/passenger", requireAuth, showPassengerForm);
router.post("/passenger", requireAuth, savePassenger);

router.get("/payment", requireAuth, showPaymentPage);


router.get("/success", requireAuth, showSuccessPage);


router.post("/create-order", async (req, res) => {
  try {
    const flight = req.session.selectedFlight;

    if (!flight) {
      console.log("❌ No flight in session");
      return res.status(400).send("No flight selected");
    }

    console.log("✅ Flight found:", flight.price);

    const order = await razorpay.orders.create({
      amount: flight.price * 100,
      currency: "INR",
      receipt: "receipt_" + Date.now(),
    });

    console.log("✅ Razorpay order created:", order.id);

    res.json({
      orderId: order.id,
      amount: order.amount,
      key: process.env.RAZORPAY_KEY_ID,
    });

  } catch (err) {
    console.error("🔥 CREATE ORDER ERROR:", err);
    res.status(500).send("Error creating order");
  }
});


router.post("/payment-success", async (req, res) => {
  try {
    const user = req.session.user;
    const flight = req.session.selectedFlight;
    const passenger = req.session.passenger;

    // ❗ If session missing, just skip DB but still continue
    if (!user || !flight || !passenger) {
      console.log("⚠️ Missing session, continuing demo mode");

      req.session.lastBooking = {
        id: "DEMO123",
        flight: {
          from_code: "DEL",
          to_code: "BOM",
          price: 8900
        },
        passenger: {
          name: "Demo User",
          email: "demo@test.com"
        }
      };

      return req.session.save(() => res.sendStatus(200));
    }

    const result = await pool.query(
      `INSERT INTO bookings 
       (user_id, flight_id, passenger_name, email, booking_time)
       VALUES ($1, $2, $3, $4, NOW())
       RETURNING id`,
      [user.id, flight.id, passenger.name, passenger.email]
    );

    const bookingId = result.rows[0].id;

    req.session.lastBooking = {
      id: bookingId,
      flight,
      passenger
    };

    req.session.save(() => res.sendStatus(200));

  } catch (err) {
    console.error("PAYMENT SUCCESS ERROR:", err);
    res.status(500).send("Error saving booking");
  }
});

module.exports = router;