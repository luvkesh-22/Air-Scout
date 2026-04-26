const { Pool } = require("pg");

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "flight_app",
  password: "222004",
  port: 5432,
});

module.exports = pool;