# Milestone 3: Deploying to Remote Infrastructure

**Goal**: Deploy the application to a production box.

## Context

The app is working locally. Now we need to get it running on real infrastructure. We're simplifying for the day: a single DigitalOcean droplet running a container is our "production." In a real scenario you'd likely have staging environments, load balancers, etc. — but the closed-loop principles are the same.

## The Loop

The agent provisions a DigitalOcean droplet, deploys the containerized app via CLI, and verifies the app is live.

```
┌──────────────────────────────────────────────────┐
│                                                  │
│   DigitalOcean MCP (provision droplet)           │
│           │                                      │
│           ▼                                      │
│   CLI (configure server, deploy containers)      │
│           │                                      │
│           ▼                                      │
│   Chrome DevTools (test deployed app end-to-end) │
│           │                                      │
│       Live? ──── No ──→ diagnose & fix           │
│           │                                      │
│          Yes                                     │
│           │                                      │
│         Done                                     │
│                                                  │
└──────────────────────────────────────────────────┘
```

## MCP Servers

| Server | Role |
|--------|------|
| **DigitalOcean** | Provision and manage the droplet via the [Droplets MCP endpoint](https://github.com/digitalocean-labs/mcp-digitalocean) |
| **Chrome DevTools** | Verify the deployed app works by navigating and clicking through it in a headless browser |
| **GitHub** | PRs for infra changes |

The agent uses standard CLI tools (`ssh`, `scp`, `curl`) directly for server configuration and deployment - a more mature setup (e.g. after initial deployment) could also more reliably/securely perform functions like these via MCP.

## Closed Loop

- **Definition of done**: The app is live on the public internet and responding to requests
- **Verification**: The agent uses Chrome DevTools to navigate the deployed app and test CRUD operations end-to-end, plus CLI to check container logs if needed
- **Human role**: None. The agent provisions, deploys, and confirms end-to-end.

## Environment Setup

You'll need two tokens set before launching Claude Code:

```
export DIGITALOCEAN_API_TOKEN=dop_v1_...    # from https://cloud.digitalocean.com/account/api/tokens
export GITHUB_TOKEN=$(gh auth token)         # or a fine-grained PAT
```

Create a DigitalOcean API token with **read + write** scope — the agent needs to create and manage droplets.

## Starting Point

The `start/` directory contains the starting state for this milestone — a working app (frontend + backend + Postgres) from Milestone 2. You can jump straight in here without completing Milestones 1–2.

## What You'll Have When Done

The Linear clone app running on a DigitalOcean droplet, accessible via a public URL.

## What changed in `.mcp.json`

Completely different server set from Milestone 2 — we're deploying, not building UI:

```diff
 {
   "mcpServers": {
-    "figma": {
-      "url": "https://mcp.figma.com/mcp",
-      "type": "http"
-    },
     "chrome-devtools": {
       ...
     },
+    "digitalocean": {
+      "type": "http",
+      "url": "https://droplets.mcp.digitalocean.com/mcp",
+      "headers": {
+        "Authorization": "Bearer ${DIGITALOCEAN_API_TOKEN}"
+      }
+    },
     "github": {
       ...
     }
   }
 }
```

1. **Figma is removed**. No design work in this milestone — we're deploying what we already built.
2. **Chrome DevTools stays**. The agent uses it to verify the deployed app works end-to-end by navigating and clicking around in a headless browser — not just curling the URL, but actually testing the UI in production.
3. **DigitalOcean MCP is added**. Uses the [remote Droplets endpoint](https://github.com/digitalocean-labs/mcp-digitalocean) so the agent can provision and manage droplets directly. Auth is via a DO API token passed in the header.

## Guide

### Step 1: Get your tokens

Create a DigitalOcean API token at [cloud.digitalocean.com/account/api/tokens](https://cloud.digitalocean.com/account/api/tokens) with **read + write** scope.

```
export DIGITALOCEAN_API_TOKEN=dop_v1_...
export GITHUB_TOKEN=$(gh auth token)
```

### Step 2: Set up your MCP servers

```
cd start
claude
## Inside Claude Code
/mcp
```

You should see **DigitalOcean**, **Chrome DevTools**, and **GitHub** connected before proceeding.

### Step 3: Loop-closing prompt

```
I have a working Linear clone app (https://github.com/tadasant/demo-mcp-dev-summit-linear) in this directory (React frontend, Node.js backend, Postgres DB, all containerized via Docker Compose).

Deploy it to a DigitalOcean droplet:
- Provision a minimum droplet
- Create a script that can deploy a docker image from my local code's state
- Use the script to deploy

The app should be fully functional on the public internet — I should be able to create, read, update, and delete tickets from my browser.

To accomplish this:
- Use the DigitalOcean MCP to provision the droplet
- Use Chrome DevTools to navigate the deployed app and verify CRUD works
- If anything fails, check the container logs and fix it
- Don't stop until the app is live and working end-to-end
```

**Next up**: [Milestone 4 — Parallelizing Three Features →](../milestone-4/)
