const pool = require("../config/db");

exports.getMyBookings = async (req, res) => {
  try {
   if (!req.session.user) {
  return res.redirect('/login');
}

const user_id = req.session.user.id;

    const result = await pool.query(
      `SELECT b.id, f.from_city, f.to_city, f.departure_time, f.price, b.status
       FROM bookings b
       JOIN flights f ON b.flight_id = f.id
       WHERE b.user_id = $1`,
      [user_id]
    );

return res.render("bookings/myBookings", { bookings: result.rows });

  } catch (error) {
    console.log(error);
    res.send("Error loading bookings");
  }
};  