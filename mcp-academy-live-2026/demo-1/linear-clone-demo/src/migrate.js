const pool = require("./db");

const UP = `
CREATE TABLE IF NOT EXISTS issues (
  id SERIAL PRIMARY KEY,
  identifier TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  description TEXT DEFAULT '',
  status TEXT NOT NULL DEFAULT 'backlog'
    CHECK (status IN ('backlog', 'todo', 'in_progress', 'done', 'cancelled')),
  priority TEXT NOT NULL DEFAULT 'none'
    CHECK (priority IN ('none', 'low', 'medium', 'high', 'urgent')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_issues_status ON issues (status);
CREATE INDEX IF NOT EXISTS idx_issues_priority ON issues (priority);

CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS issues_updated_at ON issues;
CREATE TRIGGER issues_updated_at
  BEFORE UPDATE ON issues
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Sequence for issue identifiers (LIN-1, LIN-2, etc.)
CREATE SEQUENCE IF NOT EXISTS issue_identifier_seq START 1;
`;

async function migrate() {
  console.log("Running migrations...");
  await pool.query(UP);
  console.log("Migrations complete.");
  await pool.end();
}

migrate().catch((err) => {
  console.error("Migration failed:", err);
  process.exit(1);
});
