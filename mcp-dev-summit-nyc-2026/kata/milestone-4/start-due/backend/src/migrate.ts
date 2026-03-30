import { Pool } from 'pg';

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME || 'linearclone',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
});

async function migrate() {
  const client = await pool.connect();
  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS issues (
        id SERIAL PRIMARY KEY,
        identifier VARCHAR(10) NOT NULL,
        title VARCHAR(500) NOT NULL,
        description TEXT DEFAULT '',
        status VARCHAR(50) NOT NULL DEFAULT 'backlog',
        priority VARCHAR(50) NOT NULL DEFAULT 'none',
        assignee VARCHAR(100) DEFAULT NULL,
        labels TEXT[] DEFAULT '{}',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `);

    // Insert seed data if table is empty
    const { rows } = await client.query('SELECT COUNT(*) FROM issues');
    if (parseInt(rows[0].count) === 0) {
      await client.query(`
        INSERT INTO issues (identifier, title, description, status, priority, assignee) VALUES
        ('SAN-1', 'Sample Issue 1', '', 'backlog', 'urgent', NULL),
        ('SAN-2', 'Sample Issue 2', '', 'backlog', 'none', 'TA');
      `);
      console.log('Seed data inserted');
    }

    console.log('Migration complete');
  } finally {
    client.release();
    await pool.end();
  }
}

migrate().catch(console.error);
