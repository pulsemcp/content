const express = require("express");
const path = require("path");
const pool = require("./db");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, "../public")));

// Health check
app.get("/health", async (_req, res) => {
  try {
    await pool.query("SELECT 1");
    res.json({ status: "ok" });
  } catch (err) {
    res.status(503).json({ status: "error", message: err.message });
  }
});

// List issues
app.get("/api/issues", async (req, res) => {
  const { status, priority } = req.query;
  let query = "SELECT * FROM issues";
  const conditions = [];
  const params = [];

  if (status) {
    params.push(status);
    conditions.push(`status = $${params.length}`);
  }
  if (priority) {
    params.push(priority);
    conditions.push(`priority = $${params.length}`);
  }

  if (conditions.length > 0) {
    query += " WHERE " + conditions.join(" AND ");
  }
  query += " ORDER BY created_at DESC";

  const { rows } = await pool.query(query, params);
  res.json(rows);
});

// Get single issue
app.get("/api/issues/:id", async (req, res) => {
  const { rows } = await pool.query(
    "SELECT * FROM issues WHERE id = $1",
    [req.params.id]
  );
  if (rows.length === 0) return res.status(404).json({ error: "Not found" });
  res.json(rows[0]);
});

// Create issue
app.post("/api/issues", async (req, res) => {
  const { title, description, status, priority } = req.body;
  if (!title) return res.status(400).json({ error: "Title is required" });

  const idResult = await pool.query(
    "SELECT nextval('issue_identifier_seq') AS id"
  );
  const identifier = `LIN-${idResult.rows[0].id}`;

  const { rows } = await pool.query(
    `INSERT INTO issues (identifier, title, description, status, priority)
     VALUES ($1, $2, $3, $4, $5) RETURNING *`,
    [
      identifier,
      title,
      description || "",
      status || "backlog",
      priority || "none",
    ]
  );
  res.status(201).json(rows[0]);
});

// Update issue
app.patch("/api/issues/:id", async (req, res) => {
  const allowed = ["title", "description", "status", "priority"];
  const updates = [];
  const params = [];

  for (const key of allowed) {
    if (req.body[key] !== undefined) {
      params.push(req.body[key]);
      updates.push(`${key} = $${params.length}`);
    }
  }

  if (updates.length === 0) {
    return res.status(400).json({ error: "No valid fields to update" });
  }

  params.push(req.params.id);
  const { rows } = await pool.query(
    `UPDATE issues SET ${updates.join(", ")} WHERE id = $${params.length} RETURNING *`,
    params
  );
  if (rows.length === 0) return res.status(404).json({ error: "Not found" });
  res.json(rows[0]);
});

// Delete issue
app.delete("/api/issues/:id", async (req, res) => {
  const { rowCount } = await pool.query(
    "DELETE FROM issues WHERE id = $1",
    [req.params.id]
  );
  if (rowCount === 0) return res.status(404).json({ error: "Not found" });
  res.status(204).end();
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Linear clone running at http://localhost:${PORT}`);
});
