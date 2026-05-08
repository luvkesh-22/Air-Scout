require('dotenv').config();

console.log("RAZORPAY KEY:", process.env.RAZORPAY_KEY_ID);

const express = require('express');
const app = express();

const cors = require('cors');
const session = require('express-session');
app.set('trust proxy', 1);
const passport = require('./src/config/passport');
const flightRoutes = require("./src/routes/flightRoutes");


// ✅ VIEW ENGINE
app.set('view engine', 'ejs');
app.set('views', './src/views');

// ✅ MIDDLEWARE
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ SESSION
app.use(session({
  secret: process.env.SESSION_SECRET || "secret123",
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false   // IMPORTANT for now
  }
}));

// ✅ PASSPORT
app.use(passport.initialize());
app.use(passport.session());

// ✅ GLOBAL USER
app.use((req, res, next) => {

  // Passport user OR local session user
  res.locals.user = req.user || req.session.user || null;

  next();
});

// ✅ ROUTES

const bookingRoutes = require("./src/routes/bookingRoutes");
const authRoutes = require("./src/routes/authRoutes");

app.use("/auth", authRoutes);
app.use("/flights", flightRoutes);
app.use("/booking", bookingRoutes);


// ✅ HOME (SIMPLE)
app.get("/", (req, res) => {
  res.redirect("/flights");
});
app.get("/hotels", (req, res) => {
  res.render("comingSoon", {
    service: "Hotels"
  });
});

app.get("/trains", (req, res) => {
  res.render("comingSoon", {
    service: "Trains"
  });
});

app.get("/bus", (req, res) => {
  res.render("comingSoon", {
    service: "Bus"
  });
});

// ✅ START
app.listen(3000, () => {
  console.log('Server running on port 3000');
});