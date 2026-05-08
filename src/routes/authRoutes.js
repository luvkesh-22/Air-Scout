
const express = require('express');
const router = express.Router();
const passport = require('../config/passport');

const { signupUser, loginUser } = require('../controllers/authController');

// SHOW LOGIN
router.get('/login', (req, res) => {

  if (req.user || req.session.user) {
  return res.redirect('/flights/search');
  }

  res.render('auth/login');
});

// SHOW SIGNUP
router.get('/signup', (req, res) => {

  if (req.user || req.session.user) {
    return res.redirect('/flights/search');
  }

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

    // Redirect user back to original page
    if (req.session.redirectAfterLogin) {

      const redirectUrl = req.session.redirectAfterLogin;

      req.session.redirectAfterLogin = null;

      return res.redirect(redirectUrl);
    }

    // Default fallback
    return res.redirect('/flights/search');
  }
);
// LOGOUT
router.get('/logout', (req, res) => {

  req.logout(() => {

    req.session.destroy((err) => {

      if (err) {
        console.log(err);
        return res.redirect('/flights/search');
      }

      res.clearCookie('connect.sid');

      return res.redirect('/auth/login');
    });

  });

});
module.exports = router;