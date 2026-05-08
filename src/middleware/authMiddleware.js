const requireAuth = (req, res, next) => {

  // Logged in
  if (req.user || req.session.user) {
    return next();
  }

  // Save original URL
  req.session.redirectAfterLogin = req.originalUrl;

  // Redirect to login
  return res.redirect('/auth/login');
};

module.exports = {
  requireAuth
};