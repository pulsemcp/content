# Demo 1: Implementing a Feature with Playwright MCP

> **Recording**: [Watch on Loom](https://www.loom.com/share/2d08b6ceec42441391c0c7bcb99bdc02)

A Linear clone app used to demonstrate a coding agent implementing a feature, discovering a runtime bug through browser testing, and fixing it autonomously.

## What the audience sees

1. Agent is given a feature ticket (add an assignee field to issues)
2. Agent reads the codebase, implements the full feature in one pass (migration, API, frontend)
3. Agent starts the dev server and begins Playwright acceptance testing
4. Create with assignee works. Detail view works. Then the agent tests **editing** via the detail modal...
5. **Playwright times out.** The edit modal never opens. Both modals are closed. The agent takes a screenshot, sees the broken state, and diagnoses a pre-existing bug: `editFromDetail()` nulls `viewingIssue` before passing it to `openEditModal()`
6. Agent fixes the bug, retests, and all acceptance criteria pass

## The hidden bug

In `public/index.html`, the `editFromDetail` function has a latent null-reference bug:

```js
function editFromDetail() {
  if (viewingIssue) {
    closeDetailModal();        // sets viewingIssue = null
    openEditModal(viewingIssue); // passes null -> crash
  }
}
```

`closeDetailModal()` sets `viewingIssue = null` before `openEditModal` reads it. The edit modal never opens. This bug exists in the codebase before the demo starts — the agent discovers it at runtime while testing its own feature implementation.

The fix is straightforward:

```js
function editFromDetail() {
  if (viewingIssue) {
    const issue = viewingIssue;
    closeDetailModal();
    openEditModal(issue);
  }
}
```

## Why it works as a demo

- The bug is **not visible from reading the code casually** — it looks like a normal sequence of function calls. You only see the problem when you trace the state mutation inside `closeDetailModal`.
- The agent **cannot anticipate it during implementation** — it's in existing code the agent doesn't need to modify.
- It's **discovered through browser testing** — Playwright times out, the agent takes a screenshot, sees the unexpected state, and reasons backward to the root cause.
- The fix is **small and satisfying** — one line (`const issue = viewingIssue`), then everything works.

## Prerequisites

- Docker and Docker Compose
- Claude Code with Playwright MCP configured (already in `.mcp.json`)

## Running the demo

### 1. Reset to clean state

Make sure the `linear-clone-demo/` directory has no modifications from previous runs:

```bash
cd mcp-academy-live-2026/demo-1/linear-clone-demo
git checkout -- .
```

### 2. Open Claude Code in the project directory

```bash
cd mcp-academy-live-2026/demo-1/linear-clone-demo
claude
```

### 3. Give it the ticket

Paste or reference the ticket:

```
Implement the ticket in TICKET.md. Keep iterating until you have started the dev server
and used Playwright MCP to step through the acceptance criteria to verify everything
works end to end. Fix all bugs en route until you achieve this.
```

### 4. Watch the agent work

The agent will:

1. **Read the codebase** — `migrate.js`, `index.js`, `index.html`
2. **Implement the feature** — adds `assignee` column, updates API handlers, adds form field and display in list/detail
3. **Start the dev server** — Docker Compose up, run migrations, seed data, health check
4. **Test with Playwright** — walks through each acceptance criterion with browser automation
5. **Hit the bug at AC3** — clicks Edit from detail modal, Playwright times out, agent sees both modals closed
6. **Diagnose and fix** — reads the code, identifies the null reference, saves the reference before closing
7. **Retest and pass** — all 4 acceptance criteria verified

## Project structure

```
linear-clone-demo/
  src/
    index.js        Express API (routes, CRUD)
    db.js           PostgreSQL pool config
    migrate.js      Schema creation
    seed.js         Sample data
  public/
    index.html      SPA frontend (HTML/CSS/JS in one file)
  .claude/
    settings.json   Permissions and MCP config
    skills/         Dev server startup skill
  .mcp.json         Playwright MCP server config
  CLAUDE.md         Project context for the agent
TICKET.md           Feature request given to the agent
```

## Environment

The app runs via Docker Compose. Port is dynamically assigned. The `/start-dev-server` skill handles all of this automatically.

```bash
# Manual startup (if needed)
cd linear-clone-demo
docker compose -f .agent-containers/docker-compose.dev.yml -p linear-clone-dev up -d --build
docker compose -f .agent-containers/docker-compose.dev.yml -p linear-clone-dev exec app bash .agent-containers/setup.sh
docker compose -f .agent-containers/docker-compose.dev.yml -p linear-clone-dev exec -d app bash .agent-containers/run.sh
```
