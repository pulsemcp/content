# Linear Clone

A full-stack issue tracker inspired by [Linear](https://linear.app), built with React, TypeScript, Express, and PostgreSQL. The UI is a dark-themed replica of Linear's core views, implemented from Figma designs.

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      Docker Compose                         │
│                                                             │
│  ┌─────────────┐    ┌──────────────┐    ┌───────────────┐  │
│  │  Frontend    │    │   Backend    │    │   Database    │  │
│  │             │    │              │    │               │  │
│  │  React      │───▶│  Express     │───▶│  PostgreSQL   │  │
│  │  Vite       │    │  TypeScript  │    │  16-alpine    │  │
│  │  TypeScript │    │              │    │               │  │
│  │             │    │  Port 3001   │    │  Port 5432    │  │
│  │  Port 5173  │    │              │    │  (internal)   │  │
│  └─────────────┘    └──────────────┘    └───────────────┘  │
│        ▲                                                    │
│        │ host port                                          │
└────────┼────────────────────────────────────────────────────┘
         │
    Browser at
  localhost:5173
```

### Services

| Service    | Technology              | Internal Port | Default Host Port | Role                            |
|------------|-------------------------|---------------|-------------------|---------------------------------|
| `frontend` | React 18, Vite 5, TypeScript | 5173     | 5173              | SPA served with Vite dev server |
| `backend`  | Express 4, TypeScript, tsx   | 3001     | 3001              | REST API for issue CRUD         |
| `db`       | PostgreSQL 16 (Alpine)       | 5432     | 5433              | Persistent data store           |

### Request Flow

1. The browser loads the React SPA from the **frontend** Vite dev server (`localhost:5173`).
2. The frontend makes API calls to `/api/*`. Vite's dev proxy forwards these to the **backend** container at `http://backend:3001`.
3. The backend queries **PostgreSQL** via the `pg` driver using the internal Docker network hostname `db`.
4. The database volume (`pgdata`) persists data across container restarts.

### Hot Reload

Both the frontend and backend mount their `src/` directories as Docker volumes, so file changes on the host are immediately picked up:

- **Frontend**: Vite HMR reflects changes in the browser instantly.
- **Backend**: `tsx watch` restarts the server on every file change.

### Database

On startup, the backend runs an inline migration that:

1. Creates the `issues` table if it does not exist.
2. Inserts two seed issues (`SAN-1`, `SAN-2`) if the table is empty.

There is no separate migration step required.

**Schema (`issues` table):**

| Column       | Type                     | Default     | Notes                                      |
|--------------|--------------------------|-------------|---------------------------------------------|
| `id`         | `SERIAL PRIMARY KEY`     | auto        | Internal numeric ID                         |
| `identifier` | `VARCHAR(10)`            | —           | Display ID (e.g. `SAN-1`)                   |
| `title`      | `VARCHAR(500)`           | —           | Issue title                                 |
| `description`| `TEXT`                   | `''`        | Markdown description                        |
| `status`     | `VARCHAR(50)`            | `'backlog'` | One of: `backlog`, `todo`, `in_progress`, `done`, `cancelled` |
| `priority`   | `VARCHAR(50)`            | `'none'`    | One of: `none`, `urgent`, `high`, `medium`, `low` |
| `assignee`   | `VARCHAR(100)`           | `NULL`      | Assignee initials or name                   |
| `labels`     | `TEXT[]`                 | `'{}'`      | Array of label strings                      |
| `created_at` | `TIMESTAMP WITH TIME ZONE` | `NOW()`  | Creation timestamp                          |
| `updated_at` | `TIMESTAMP WITH TIME ZONE` | `NOW()`  | Last update timestamp                       |

### REST API

All endpoints are prefixed with `/api`.

| Method   | Path              | Description                | Request Body (JSON)                     | Response          |
|----------|-------------------|----------------------------|-----------------------------------------|-------------------|
| `GET`    | `/api/issues`     | List all issues            | —                                       | `Issue[]`         |
| `GET`    | `/api/issues/:id` | Get a single issue         | —                                       | `Issue`           |
| `POST`   | `/api/issues`     | Create a new issue         | `{ title, description?, status?, priority?, assignee?, labels? }` | `Issue` (201) |
| `PATCH`  | `/api/issues/:id` | Update fields on an issue  | Any subset of `{ title, description, status, priority, assignee, labels }` | `Issue` |
| `DELETE` | `/api/issues/:id` | Delete an issue            | —                                       | `{ message, issue }` |

### Frontend Components

```
frontend/src/
├── main.tsx                  # React entry point
├── App.tsx                   # Root component, view routing, state management
├── App.css
├── index.css                 # CSS variables (color palette, tokens)
├── types.ts                  # Issue type definitions
├── api.ts                    # Fetch wrappers for all CRUD endpoints
└── components/
    ├── Sidebar.tsx / .css    # Navigation sidebar (static, matches Linear layout)
    ├── IssueList.tsx / .css  # Issue list grouped by status, with tabs
    ├── IssueDetail.tsx / .css # Issue detail view with properties panel
    └── CreateIssueModal.tsx / .css  # Modal for creating new issues
```

**View routing** is handled with React state (`view: 'list' | 'detail'`), not a router. Clicking an issue sets `view = 'detail'`; clicking back returns to `'list'`. The create modal is an overlay toggled independently.

## Prerequisites

- [Docker](https://www.docker.com/) and Docker Compose (included with Docker Desktop)

No local Node.js, npm, or PostgreSQL installation is needed.

## Quick Start

```bash
# Clone the repo
git clone https://github.com/tadasant/demo-mcp-dev-summit-linear.git
cd demo-mcp-dev-summit-linear

# Start all services
docker compose up -d --build

# Open in browser
open http://localhost:5173
```

To see logs:

```bash
docker compose logs -f           # all services
docker compose logs -f backend   # backend only
docker compose logs -f frontend  # frontend only
```

To stop:

```bash
docker compose down       # stop containers, keep data
docker compose down -v    # stop containers and delete database volume
```

## Configuration

All ports and database credentials are configurable via environment variables. Defaults are set in `docker-compose.yml` so the app works out of the box with no `.env` file.

| Variable         | Default        | Description                          |
|------------------|----------------|--------------------------------------|
| `FRONTEND_PORT`  | `5173`         | Host port for the frontend           |
| `BACKEND_PORT`   | `3001`         | Host port for the backend API        |
| `DB_PORT`        | `5433`         | Host port for PostgreSQL             |
| `DB_NAME`        | `linearclone`  | PostgreSQL database name             |
| `DB_USER`        | `postgres`     | PostgreSQL user                      |
| `DB_PASSWORD`    | `postgres`     | PostgreSQL password                  |

You can set these inline:

```bash
FRONTEND_PORT=5173 BACKEND_PORT=3001 DB_PORT=5433 docker compose up -d --build
```

Or create a `.env` file in the project root (it is gitignored):

```env
FRONTEND_PORT=5173
BACKEND_PORT=3001
DB_PORT=5433
DB_NAME=linearclone
DB_USER=postgres
DB_PASSWORD=postgres
```

## Running Multiple Instances

You can run several independent copies of the stack simultaneously -- for example, to test different branches side by side or to give each developer their own environment. Each instance needs its own **project name** (to isolate Docker resources) and **host ports** (to avoid conflicts).

### Option 1: Environment variables + `-p` flag

The `-p` flag sets the Docker Compose [project name](https://docs.docker.com/compose/project-name/), which namespaces all containers, networks, and volumes.

```bash
# Instance A (defaults)
docker compose -p linear-a up -d --build

# Instance B (different ports)
FRONTEND_PORT=5274 BACKEND_PORT=3002 DB_PORT=5434 \
  docker compose -p linear-b up -d --build

# Instance C (yet another set of ports)
FRONTEND_PORT=5375 BACKEND_PORT=3003 DB_PORT=5435 \
  docker compose -p linear-c up -d --build
```

Each instance gets its own isolated database, containers, and network. Access them at:

- Instance A: `http://localhost:5173`
- Instance B: `http://localhost:5274`
- Instance C: `http://localhost:5375`

To stop a specific instance:

```bash
docker compose -p linear-b down       # stop instance B
docker compose -p linear-b down -v    # stop and delete its database
```

### Option 2: `.env` files per instance

Create separate env files and reference them explicitly:

```bash
# .env.alice
FRONTEND_PORT=5173
BACKEND_PORT=3001
DB_PORT=5433

# .env.bob
FRONTEND_PORT=5274
BACKEND_PORT=3002
DB_PORT=5434
```

```bash
docker compose -p alice --env-file .env.alice up -d --build
docker compose -p bob   --env-file .env.bob   up -d --build
```

### What gets isolated

| Resource             | Isolated by project name? | Notes                                      |
|----------------------|---------------------------|---------------------------------------------|
| Containers           | Yes                       | Named `<project>-frontend-1`, etc.          |
| Docker network       | Yes                       | Each project gets its own bridge network    |
| Database volume      | Yes                       | Named `<project>_pgdata`                    |
| Host ports           | **No** -- you must set different ports | Two instances on the same port will fail to start |

### Port planning cheat sheet

| Instance | `FRONTEND_PORT` | `BACKEND_PORT` | `DB_PORT` |
|----------|-----------------|----------------|-----------|
| Default  | 5173            | 3001           | 5433      |
| 2nd      | 5274            | 3002           | 5434      |
| 3rd      | 5375            | 3003           | 5435      |
| 4th      | 5476            | 3004           | 5436      |

## Development Without Docker

If you prefer running services directly on your host:

```bash
# 1. Start PostgreSQL (must be accessible at localhost:5432)
#    e.g. via Postgres.app, Homebrew, or a standalone container:
docker run -d --name pg-linear -p 5432:5432 \
  -e POSTGRES_DB=linearclone \
  -e POSTGRES_PASSWORD=postgres \
  postgres:16-alpine

# 2. Start the backend
cd backend
npm install
npm run dev     # runs on :3001, auto-migrates the database

# 3. Start the frontend (in a separate terminal)
cd frontend
npm install
npm run dev     # runs on :5173, proxies /api to :3001
```

## Project Structure

```
.
├── docker-compose.yml        # Orchestrates all three services
├── backend/
│   ├── Dockerfile
│   ├── package.json
│   ├── tsconfig.json
│   └── src/
│       ├── index.ts          # Express server, routes, and auto-migration
│       └── migrate.ts        # Standalone migration script (optional)
└── frontend/
    ├── Dockerfile
    ├── package.json
    ├── tsconfig.json
    ├── vite.config.ts        # Vite config with API proxy
    ├── index.html
    └── src/
        ├── main.tsx
        ├── App.tsx
        ├── api.ts
        ├── types.ts
        ├── index.css
        └── components/
            ├── Sidebar.tsx
            ├── IssueList.tsx
            ├── IssueDetail.tsx
            └── CreateIssueModal.tsx
```
