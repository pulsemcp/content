import express from 'express';
import cors from 'cors';
import { Pool } from 'pg';

const app = express();
const port = parseInt(process.env.PORT || '3001');

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME || 'linearclone',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
});

app.use(cors());
app.use(express.json());

// Get all issues
app.get('/api/issues', async (_req, res) => {
  try {
    const { rows } = await pool.query(
      'SELECT * FROM issues ORDER BY created_at DESC'
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch issues' });
  }
});

// Get single issue
app.get('/api/issues/:id', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM issues WHERE id = $1', [
      req.params.id,
    ]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Issue not found' });
    }
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch issue' });
  }
});

// Create issue
app.post('/api/issues', async (req, res) => {
  try {
    const { title, description, status, priority, assignee, labels, due_date } = req.body;

    // Generate next identifier
    const countResult = await pool.query('SELECT COUNT(*) FROM issues');
    const count = parseInt(countResult.rows[0].count) + 1;
    const identifier = `SAN-${count}`;

    const { rows } = await pool.query(
      `INSERT INTO issues (identifier, title, description, status, priority, assignee, labels, due_date)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING *`,
      [
        identifier,
        title,
        description || '',
        status || 'backlog',
        priority || 'none',
        assignee || null,
        labels || [],
        due_date || null,
      ]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create issue' });
  }
});

// Update issue
app.patch('/api/issues/:id', async (req, res) => {
  try {
    const { title, description, status, priority, assignee, labels, due_date } = req.body;
    const fields: string[] = [];
    const values: any[] = [];
    let idx = 1;

    if (title !== undefined) { fields.push(`title = $${idx++}`); values.push(title); }
    if (description !== undefined) { fields.push(`description = $${idx++}`); values.push(description); }
    if (status !== undefined) { fields.push(`status = $${idx++}`); values.push(status); }
    if (priority !== undefined) { fields.push(`priority = $${idx++}`); values.push(priority); }
    if (assignee !== undefined) { fields.push(`assignee = $${idx++}`); values.push(assignee); }
    if (labels !== undefined) { fields.push(`labels = $${idx++}`); values.push(labels); }
    if (due_date !== undefined) { fields.push(`due_date = $${idx++}`); values.push(due_date); }

    if (fields.length === 0) {
      return res.status(400).json({ error: 'No fields to update' });
    }

    fields.push(`updated_at = NOW()`);
    values.push(req.params.id);

    const { rows } = await pool.query(
      `UPDATE issues SET ${fields.join(', ')} WHERE id = $${idx} RETURNING *`,
      values
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Issue not found' });
    }
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update issue' });
  }
});

// Delete issue
app.delete('/api/issues/:id', async (req, res) => {
  try {
    const { rows } = await pool.query(
      'DELETE FROM issues WHERE id = $1 RETURNING *',
      [req.params.id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Issue not found' });
    }
    res.json({ message: 'Issue deleted', issue: rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete issue' });
  }
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
        due_date DATE DEFAULT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `);
    // Add due_date column if it doesn't exist (for existing databases)
    await client.query(`
      ALTER TABLE issues ADD COLUMN IF NOT EXISTS due_date DATE DEFAULT NULL;
    `);
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
  }
}

migrate()
  .then(() => {
    app.listen(port, '0.0.0.0', () => {
      console.log(`Backend running on port ${port}`);
    });
  })
  .catch((err) => {
    console.error('Migration failed:', err);
    process.exit(1);
  });
