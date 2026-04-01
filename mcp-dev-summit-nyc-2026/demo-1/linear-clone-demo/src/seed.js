const pool = require("./db");

const SEEDS = [
  {
    title: "Set up project infrastructure",
    description: "Initialize repo, CI/CD, and development environment.",
    status: "done",
    priority: "high",
  },
  {
    title: "Design database schema",
    description: "Define tables for issues, projects, and users.",
    status: "done",
    priority: "high",
  },
  {
    title: "Implement issue creation API",
    description: "POST /api/issues endpoint with validation.",
    status: "in_progress",
    priority: "medium",
  },
  {
    title: "Build issue list view",
    description: "Frontend view showing all issues with filtering.",
    status: "todo",
    priority: "medium",
  },
  {
    title: "Add issue status transitions",
    description: "Allow moving issues between backlog, todo, in progress, done.",
    status: "backlog",
    priority: "low",
  },
];

async function seed() {
  // Check if issues already exist
  const { rows } = await pool.query("SELECT count(*) FROM issues");
  if (parseInt(rows[0].count) > 0) {
    console.log("Issues already seeded, skipping.");
    await pool.end();
    return;
  }

  console.log("Seeding issues...");
  for (const issue of SEEDS) {
    const id = await pool.query("SELECT nextval('issue_identifier_seq') AS id");
    const identifier = `LIN-${id.rows[0].id}`;
    await pool.query(
      `INSERT INTO issues (identifier, title, description, status, priority)
       VALUES ($1, $2, $3, $4, $5)`,
      [identifier, issue.title, issue.description, issue.status, issue.priority]
    );
  }
  console.log(`Seeded ${SEEDS.length} issues.`);
  await pool.end();
}

seed().catch((err) => {
  console.error("Seeding failed:", err);
  process.exit(1);
});
