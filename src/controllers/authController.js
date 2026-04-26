const pool = require('../config/db');
const bcrypt = require('bcrypt');

// ✅ SIGNUP
const signupUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const userCheck = await pool.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );

    if (userCheck.rows.length > 0) {
      return res.send('User already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await pool.query(
      'INSERT INTO users (name, email, password) VALUES ($1, $2, $3)',
      [name, email, hashedPassword]
    );

    res.send('Signup successful');
  } catch (err) {
    console.error(err);
    res.send('Error signing up');
  }
};

// ✅ LOGIN
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const result = await pool.query(
  'INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *',
  [name, email, hashedPassword]
);

    if (result.rows.length === 0) {
      return res.send('User not found');
    }

    const user = result.rows[0];

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.send('Invalid credentials');
    }

    req.session.user = {
      id: user.id,
      name: user.name,
      email: user.email,
    };
// Redirect back to where user came from (search or booking)
if (req.session.redirectAfterLogin) {
  let redirectUrl = req.session.redirectAfterLogin;

  // fix ticket redirect
  if (redirectUrl.includes('/ticket')) {
    redirectUrl = '/flights/ticket';
  }

  req.session.redirectAfterLogin = null;

  return res.redirect(redirectUrl);
}

// fallback
res.redirect('/flights'); // or '/flights/search' if you have it
 } catch (err) {
    console.error(err);
    res.send('Error logging in');
  }
};

module.exports = { signupUser, loginUser };