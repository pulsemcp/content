# Milestone 2: Figma Design to Implementation

**Goal**: Turn the Figma design into a working application with a frontend, backend, and Postgres database.

## Context

We have a Figma design from Milestone 1. Now we need to turn it into a real, running application. We're keeping the scope manageable: single-player (no accounts/auth), but with a realistic architecture — frontend, backend, and Postgres. It's a basic CRUD app, but structured in a way that's parallelizable for future work.

## The Loop

The agent reads the Figma design, implements the UI and API, starts the dev server, and uses Chrome DevTools to verify that the rendered app matches the design. GitHub PRs give us review checkpoints. The `/start-dev-server` agent skill handles environment setup with built-in closed-loop tactics — for example, outputting logs to a `.log` file that the agent can read to self-diagnose issues.

```
┌──────────────────────────────────────────────────┐
│                                                  │
│   Figma (read design specs)                      │
│           │                                      │
│           ▼                                      │
│   Implement code (frontend + backend)            │
│           │                                      │
│           ▼                                      │
│   /start-dev-server (run the app)                │
│           │                                      │
│           ▼                                      │
│   Chrome DevTools (compare app ↔ Figma design)   │
│           │                                      │
│       Match? ──── No ──→ loop back               │
│           │                                      │
│          Yes                                     │
│           │                                      │
│   GitHub (open PR)                               │
│           │                                      │
│         Done                                     │
│                                                  │
└──────────────────────────────────────────────────┘
```

## MCP Servers & Tools

| Server / Tool | Role |
|---------------|------|
| **Chrome DevTools** | Verify that the running app visually matches the Figma design |
| **Figma** | Read the design specs to guide implementation |
| **GitHub** | Open PRs for each piece of work |
| `/start-dev-server` **skill** | Start the dev environment with observability built in (log files, health checks) |

## Closed Loop

- **Definition of done**: The running app visually matches the Figma design and all CRUD operations work
- **Verification**: Chrome DevTools compares the rendered UI against the Figma source; the agent confirms API behavior via the running app
- **Observability highlight**: The `/start-dev-server` skill demonstrates tight-loop tactics — structured log output to a `.log` file that the agent reads to self-correct without guessing

## Starting Point

The `start/` directory contains the starting state for this milestone — the Figma design output from Milestone 1. You can jump straight in here without completing Milestone 1.

## What You'll Have When Done

A working Linear clone app (frontend + backend + Postgres) running locally, with CRUD operations and a UI that matches the Figma design.
