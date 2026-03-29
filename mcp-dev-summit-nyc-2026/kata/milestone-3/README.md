# Milestone 3: Deploying to Remote Infrastructure

**Goal**: Deploy the application to a production box.

## Context

The app is working locally. Now we need to get it running on real infrastructure. We're simplifying for the day: a single DigitalOcean droplet running a container is our "production." In a real scenario you'd likely have staging environments, load balancers, etc. — but the closed-loop principles are the same.

## The Loop

The agent provisions a DigitalOcean droplet, configures it via SSH, deploys the containerized app, and verifies it's running. GitHub Actions provides the CI/CD pipeline.

```
┌──────────────────────────────────────────────┐
│                                              │
│   DigitalOcean (provision droplet)           │
│           │                                  │
│           ▼                                  │
│   SSH (configure server, deploy container)   │
│           │                                  │
│           ▼                                  │
│   GitHub Actions (CI/CD pipeline)            │
│           │                                  │
│           ▼                                  │
│   Verify (hit deployed URL / SSH health)     │
│           │                                  │
│       Live? ──── No ──→ diagnose & fix       │
│           │                                  │
│          Yes                                 │
│           │                                  │
│         Done                                 │
│                                              │
└──────────────────────────────────────────────┘
```

## MCP Servers

| Server | Role |
|--------|------|
| **DigitalOcean** | Provision and manage the droplet |
| **SSH** | Configure the server, deploy containers, verify runtime state |
| **GitHub** | PRs for infra changes; Actions for CI/CD pipeline |

## Closed Loop

- **Definition of done**: The app is live on the public internet and responding to requests
- **Verification**: The agent hits the deployed URL and confirms a successful response — or uses SSH to check container health, logs, etc.
- **Human role**: None. The agent provisions, deploys, and confirms end-to-end.

## Starting Point

The `start/` directory contains the starting state for this milestone — a working app (frontend + backend + Postgres) from Milestone 2. You can jump straight in here without completing Milestones 1–2.

## What You'll Have When Done

The Linear clone app running on a DigitalOcean droplet, accessible via a public URL, with a CI/CD pipeline in GitHub Actions.
