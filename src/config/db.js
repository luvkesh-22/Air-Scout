const { Pool } = require("pg");

const isProduction = process.env.NODE_ENV === "production";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: isProduction
    ? { rejectUnauthorized: false } // for Neon / Render
    : false // for local PostgreSQL
});
console.log("DB URL:", process.env.DATABASE_URL);
module.exports = pool;