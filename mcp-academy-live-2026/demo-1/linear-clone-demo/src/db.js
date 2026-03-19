const { Pool } = require("pg");

// Local dev only — DATABASE_URL should be set in production.
// The fallback below uses throwaway local dev credentials, not real secrets.
const pool = new Pool({
  connectionString:
    process.env.DATABASE_URL ||
    "postgresql://app:password@localhost:5432/linear_clone_dev",
});

module.exports = pool;
