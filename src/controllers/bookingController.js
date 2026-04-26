const pool = require("../config/db");

// ✅ GET BOOKINGS
exports.getMyBookings = async (req, res) => {
  try {
    const user_id = req.session.user.id;

    const result = await pool.query(
      `SELECT 
        b.id,
        b.passenger_name,
        b.email,
        f.from_code AS from_city, 
        f.to_code AS to_city, 
        f.departure_time, 
        f.price, 
        b.status
       FROM bookings b
       JOIN flights f ON b.flight_id = f.id
       WHERE b.user_id = $1`,
      [user_id]
    );

    res.render("bookings/myBookings", { bookings: result.rows });

  } catch (error) {
    console.log(error);
    res.send("Error loading bookings");
  }
};


// ❌ REMOVE OLD bookFlight COMPLETELY (we don't use it anymore)


// ✅ CANCEL BOOKING
exports.cancelBooking = async (req, res) => {
  try {
    const booking_id = req.params.id;
    const user_id = req.session.user.id;

    const result = await pool.query(
      `UPDATE bookings 
       SET status = 'cancelled' 
       WHERE id = $1 AND user_id = $2
       RETURNING *`,
      [booking_id, user_id]
    );

    if (result.rowCount === 0) {
      return res.send("Unauthorized action");
    }

res.redirect('/booking/bookings');

  } catch (err) {
    console.error(err);
    res.send('Error cancelling booking');
  }
};


// ✅ SHOW PASSENGER FORM
exports.showPassengerForm = (req, res) => {
  if (!req.session.user) {
return res.redirect('/auth/login');
  }

  const flight = req.session.selectedFlight;

  if (!flight) {
return res.redirect('/auth/login');
  }

  res.render("bookings/passenger", { flight });
};


// ✅ SAVE PASSENGER DATA
exports.savePassenger = (req, res) => {
  const { name, email, phone } = req.body;

  req.session.passenger = { name, email, phone };

  console.log("✅ Passenger saved:", req.session.passenger);

  // 🔥 FORCE SAVE SESSION BEFORE REDIRECT
  req.session.save(() => {
    res.redirect("/booking/payment");
  });
};

// ✅ SHOW PAYMENT PAGE
exports.showPaymentPage = (req, res) => {
  console.log("📦 SESSION AT PAYMENT:", req.session);

  const flight = req.session.selectedFlight;
  const passenger = req.session.passenger;

  if (!flight || !passenger) {
    console.log("❌ Missing session data → redirecting");
    return res.redirect('/');
  }

  res.render("bookings/payment", { flight, passenger });
};

// ✅ PROCESS PAYMENT (FINAL BOOKING)
exports.processPayment = async (req, res) => {
  try {
    const user_id = req.session.user.id;
    const flight = req.session.selectedFlight;
    const passenger = req.session.passenger;

    if (!flight || !passenger) {
      return res.redirect('/');
    }

    const result = await pool.query(
      `INSERT INTO bookings 
       (user_id, flight_id, passenger_name, email) 
       VALUES ($1, $2, $3, $4) 
       RETURNING id`,
      [
        user_id,
        flight.id,
        passenger.name,
        passenger.email
      ]
    );

    const bookingId = result.rows[0].id;

    req.session.lastBooking = {
      id: bookingId,
      flight,
      passenger
    };

    // clear session
    req.session.selectedFlight = null;
    req.session.passenger = null;

    res.redirect("/booking/success");

  } catch (err) {
    console.error(err);
    res.send("Payment failed");
  }
};


// ✅ SUCCESS PAGE
exports.showSuccessPage = (req, res) => {
  const booking = req.session.lastBooking;

  if (!booking) {
    return res.redirect('/');
  }

  res.render("bookings/success", { booking });
};