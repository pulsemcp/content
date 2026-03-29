# Kata Exercises — Architecting Agentic Engineering Loops With MCP

Hands-on exercises for practicing agentic engineering patterns. We'll go from an app idea all the way to deployed infrastructure with a Slack integration and production alert triage — building a closed agentic loop at every step.

**What we're building**: A Linear clone. The motivation: we have custom opinions on how we want to manage work internally, and Linear is a great starting point from a UX perspective. We want to copy its interface as a foundation, then customize from there.

**Architecture**: This is a single-player app (no accounts/auth) with three components:

- **Frontend** — the UI
- **Backend** — API layer
- **Postgres database** — persistent storage

A basic CRUD application, but with a realistic, parallelizable architecture that mirrors how you'd build something real.

## Prerequisites

- A coding agent with MCP support (e.g., Claude Code)
- Familiarity with the open loop vs. closed loop concepts from the talk

## Structure

Each milestone is self-contained — you can start from any one without completing the earlier milestones. Every milestone directory has:

- **`README.md`** — What you're doing, which MCP servers you need, and how the closed loop works
- **`start/`** — A snapshot of the codebase at the beginning of that milestone. `cd` in and start working.

There's also a **`final-state/`** directory with the completed state after all 5 milestones, for reference.

```
kata/
├── milestone-1/          # Idea to Figma Design
│   ├── README.md
│   └── start/
├── milestone-2/          # Figma Design to Implementation
│   ├── README.md
│   └── start/
├── milestone-3/          # Deploying to Remote Infrastructure
│   ├── README.md
│   └── start/
├── milestone-4/          # Parallelizing Three Features
│   ├── README.md
│   └── start/
├── milestone-5/          # Triaging an Alert
│   ├── README.md
│   └── start/
└── final-state/          # Completed state after all milestones
    └── README.md
```

## Milestones

| # | Milestone | MCP Servers | Start here |
|---|-----------|-------------|------------|
| 1 | [**Idea to Figma Design**](milestone-1/) | Playwright, Figma | [`milestone-1/start/`](milestone-1/start/) |
| 2 | [**Figma Design to Implementation**](milestone-2/) | Playwright, Figma, GitHub, `/start-dev-server` skill | [`milestone-2/start/`](milestone-2/start/) |
| 3 | [**Deploying to Remote Infrastructure**](milestone-3/) | DigitalOcean, SSH, GitHub | [`milestone-3/start/`](milestone-3/start/) |
| 4 | [**Parallelizing Three Features**](milestone-4/) | Figma, Playwright, Slack, GitHub, DigitalOcean, SSH | [`milestone-4/start/`](milestone-4/start/) |
| 5 | [**Triaging an Alert**](milestone-5/) | Sentry, GitHub, DigitalOcean, SSH | [`milestone-5/start/`](milestone-5/start/) |

## Tips for Success

1. **Define "done" before you start** — Write explicit completion criteria in your prompt. If the agent can't tell when it's finished, the loop stays open.
2. **Give verification tools** — Playwright for UI, CI for tests, Slack for integration delivery, Sentry for error rates. The agent needs to check its own work.
3. **Keep the loop tight** — Provide observability (structured logs, health checks, config) so the agent self-corrects without spinning.
4. **Stay out of the loop** — If you're manually verifying, approving, or authenticating, the loop is still open.
