require('dotenv').config();

console.log("RAZORPAY KEY:", process.env.RAZORPAY_KEY_ID);

const express = require('express');
const app = express();

const cors = require('cors');
const session = require('express-session');
app.set('trust proxy', 1);
const passport = require('./src/config/passport');

// ✅ VIEW ENGINE
app.set('view engine', 'ejs');
app.set('views', './src/views');

// ✅ MIDDLEWARE
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ SESSION
app.use(
  session({
    secret: 'mysecretkey',
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false,
      maxAge: 1000 * 60 * 60
    }
  })
);

// ✅ PASSPORT
app.use(passport.initialize());
app.use(passport.session());

// ✅ GLOBAL USER
app.use((req, res, next) => {
  res.locals.user = req.session.user;
  next();
});

// ✅ ROUTES
const flightRoutes = require("./src/routes/flightRoutes");
const bookingRoutes = require("./src/routes/bookingRoutes");
const authRoutes = require("./src/routes/authRoutes");

app.use("/auth", authRoutes);
app.use("/flights", flightRoutes);
app.use("/booking", bookingRoutes);

app.get('/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/flights');
  });
});
// ✅ HOME (SIMPLE)
app.get("/", (req, res) => {
  res.redirect("/flights");
});

// ✅ START
app.listen(3000, () => {
  console.log('Server running on port 3000');
});