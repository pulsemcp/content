const { Pool } = require("pg");

const pool = new Pool({
  connectionString:
    process.env.DATABASE_URL ||
    "postgresql://app:password@localhost:5432/linear_clone_dev",
});

module.exports = pool;
