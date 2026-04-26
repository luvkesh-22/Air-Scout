const express = require('express');
const router = express.Router();
const passport = require('../config/passport');

const { signupUser, loginUser } = require('../controllers/authController');

// SHOW LOGIN
router.get('/login', (req, res) => {
  res.render('auth/login');
});

// SHOW SIGNUP
router.get('/signup', (req, res) => {
  res.render('auth/signup');
});

// HANDLE LOGIN
router.post('/login', loginUser);

// HANDLE SIGNUP
router.post('/signup', signupUser);

// 🔐 GOOGLE LOGIN
router.get('/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

// 🔁 CALLBACK
router.get('/google/callback',
  passport.authenticate('google', { failureRedirect: '/auth/login' }),
  (req, res) => {

    req.session.user = {
      id: req.user.id,
      name: req.user.name,
      email: req.user.email
    };

    res.redirect('/flights');
  }
);
module.exports = router;