# AGENTS.md — Linear Clone

A barebones Linear-style issue tracker built with Express, PostgreSQL, and vanilla HTML/CSS/JS. Designed as a hack day demo for testing AI coding agents against a real full-stack app.

## Project Overview

- **Backend**: Express.js (Node), raw SQL via `pg` driver
- **Frontend**: Single-page vanilla app served from `public/index.html`
- **Database**: PostgreSQL (Docker Compose for local dev)
- **No build step**: Plain `.js` files, no TypeScript, no bundler

### Data Model

Single `issues` table with:
- `identifier` (e.g. `LIN-1`), `title`, `description`
- `status`: backlog | todo | in_progress | done | cancelled
- `priority`: none | low | medium | high | urgent

### API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/health` | Health check (DB ping) |
| GET | `/api/issues` | List issues (filterable by `?status=` and `?priority=`) |
| GET | `/api/issues/:id` | Get single issue |
| POST | `/api/issues` | Create issue (requires `title`) |
| PATCH | `/api/issues/:id` | Update issue fields |
| DELETE | `/api/issues/:id` | Delete issue |

### Running Locally

Use the `/skill:start-dev-server` skill to start the app. It handles environment detection, Docker Compose setup, health checks, and status reporting.

## Git Workflow

Keep commits small, focused, and atomic. One logical change per commit.

- **Branch from main** for any non-trivial work. Use short, descriptive branch names: `fix/priority-filter`, `feat/bulk-delete`, `refactor/api-validation`.
- **Commit messages** should be imperative mood, present tense: "Add priority filter" not "Added priority filter". Lead with a verb. Keep the first line under 72 characters.
- **No force-pushing** to shared branches. Rebase locally before pushing if you need a clean history.
- **PRs over direct pushes** for anything beyond trivial fixes. Even in a hack day, reviewable history matters.
- **Don't commit generated files**, node_modules, or environment-specific config. The `.gitignore` covers the basics.

## Testing Philosophy

We don't have tests yet — and that's intentional for a hack day scaffold. But when tests arrive, here's the aspiration:

- **Integration over mocks**: Test against a real PostgreSQL instance (Docker makes this trivial). Mocked DB tests give false confidence — a passing mock suite and a broken migration is worse than no tests at all.
- **API-first testing**: The REST API is the contract. Test endpoints with real HTTP requests, assert on status codes and response shapes. If the API tests pass, the backend works.
- **Visual smoke tests via Playwright**: Use browser automation to verify the UI renders, issues display, and basic CRUD flows work end-to-end. Not pixel-perfect screenshot diffing — just "does clicking Create actually create an issue?"
- **Fast feedback loop**: Tests should run in under 30 seconds locally. If a test suite takes minutes, it won't get run. Optimize for developer willingness to actually run them.
- **No test theatre**: Don't write tests for getters, setters, or trivial logic. Test the boundaries — user input validation, API contracts, database constraints, and UI interactions that touch multiple layers.
