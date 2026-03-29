# Milestone 2: Figma Design to Implementation

**Goal**: Turn the Figma design into a working application with a frontend, backend, and Postgres database.

## Context

We have a Figma design from Milestone 1. Now we need to turn it into a real, running application. We're keeping the scope manageable: single-player (no accounts/auth), but with a realistic architecture — frontend, backend, and Postgres.

## The Loop

The agent reads the Figma design, implements the UI and API, starts the dev server, and uses Chrome DevTools to verify that the rendered app matches the design.

```
┌──────────────────────────────────────────────────┐
│                                                  │
│   Figma (read design specs)                      │
│           │                                      │
│           ▼                                      │
│   Implement code (frontend + backend)            │
│           │                                      │
│           ▼                                      │
│   Start dev server (run the app)                 │
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

## Closed Loop

- **Definition of done**: The running app visually matches the Figma design and all CRUD operations work
- **Verification**: Chrome DevTools compares the rendered UI against the Figma source; the agent confirms API behavior via the running app

## What changed in `.mcp.json`

Two differences from Milestone 1:

```diff
 "chrome-devtools": {
   "command": "npx",
   "args": [
     "-y",
     "chrome-devtools-mcp@latest",
-    "--autoConnect"
+    "--headless",
+    "--isolated"
   ]
-}
+},
+"github": {
+  "type": "http",
+  "url": "https://api.githubcopilot.com/mcp/",
+  "headers": {
+    "X-MCP-Toolsets": "repos,pull_requests",
+    "Authorization": "Bearer ${GITHUB_TOKEN}"
+  }
+}
```

1. **Chrome DevTools switches from `--autoConnect` to `--headless --isolated`**. In Milestone 1 you needed a visible browser with your Linear session. Here the agent is verifying its own app — no existing session needed, so it runs headless in a throwaway profile.
2. **GitHub MCP server is added**. The agent needs to create a branch and open a PR. This uses GitHub's remote MCP server with toolsets scoped to just `repos` and `pull_requests`.

## GitHub MCP Authentication

The `.mcp.json` uses a `GITHUB_TOKEN` env var for auth. Set it before launching Claude Code:

```
export GITHUB_TOKEN=$(gh auth token)
```

Or use a [fine-grained PAT](https://github.com/settings/tokens?type=beta) with `repo` scope directly.

## Starting Point

The `start/` directory contains the starting state for this milestone — the Figma design output from Milestone 1. You can jump straight in here without completing Milestone 1.

## What You'll Have When Done

A working Linear clone app (frontend + backend + Postgres) running locally, with CRUD operations and a UI that matches the Figma design.

## Guide

### Step 1: Create a GitHub repo

Create a new empty repo on GitHub for the Linear clone app. You can do this from [github.com/new](https://github.com/new) — name it something like `linear-clone` and leave it empty (no README, no `.gitignore`). Copy the repo URL — you'll pass it to the agent later.

### Step 2: Set up your MCP servers

`cd` into the `start/` directory, set your GitHub token, and launch Claude Code:

```
cd start
export GITHUB_TOKEN=$(gh auth token)
claude --dangerously-skip-permissions
## Inside Claude Code
/mcp
```

You should see **Chrome DevTools**, **Figma**, and **GitHub** all connected before proceeding.

### Step 3: Loop-closing prompt

```
I have some Figma designs here at
- https://www.figma.com/design/jNMRxmPldjEEwUqwcL9AU9/MCP-Dev-Summit-2026-Workshop?node-id=0-1&p=f&t=dDkk6UbLtwy2BVqH-0
- https://www.figma.com/design/jNMRxmPldjEEwUqwcL9AU9/MCP-Dev-Summit-2026-Workshop?node-id=5-2&p=f&t=dDkk6UbLtwy2BVqH-0
- https://www.figma.com/design/jNMRxmPldjEEwUqwcL9AU9/MCP-Dev-Summit-2026-Workshop?node-id=5-3&p=f&t=dDkk6UbLtwy2BVqH-0


And an empty GitHub repo at https://github.com/tadasant/demo-mcp-dev-summit-linear.git.

Build a working Linear clone app based on the Figma design. The app should have:
- A React frontend
- A TypeScript backend
- A Postgres database
- Full CRUD for tickets (create, read, update, delete)

You can leave off bells and whistles visible in the mocks for now - just focus on core functionality.

To accomplish this:
- Read the Figma design to understand every page and component
- Initialize a git repo in this working directory, start a branch to work on the initial implementation here
- Implement all component pieces of this app. Make it containerizable -- there should be a simple docker-compose file that puts together all the pieces in a de facto dev server that runs on configurable ports
- Start the dev server and use Chrome DevTools to screenshot your running app
- Compare your screenshots against the Figma design
- Iterate until the UI is a close match and all CRUD operations work without issues
- Open a PR with the working implementation and a detailed explanation of all the flows you tested with Chrome DevTools

Make you test for visual parity at least 5 times:
- Take screenshots and grab DOM elements to understand what you have implemented vs. the Figma mocks
- Take a pass at implementing it in code using CSS best practices and responsive web design
- Then, take screenshots of what you have in Figma vs. what you have running in the browser
- Compare the screenshots
- Have a subagent critique how they are still different
- Make yourself a TODO list of fixes and iterate to get closer
- Do this at least 5 times; I want to be as close to pixel perfect (but not hacky -- e.g. no hardcoded pixel layouts) as possible

And make sure you test core functionality end to end to ensure the frontend, backend, and database work nicely together.

Include thorough documentation on system architecture and how to run the dev container, including instructions for how I would run multiple dev containers at once without trampling each other (e.g. set different ports exposed by each one).
```

Have Claude tell you how to try it out

```
Run it locally for me so I can try it out.
```

Here's what ours looks like at the end:

[▶ Demo video](assets/demo.mp4)

**Next up**: [Milestone 3 — Deploying to Remote Infrastructure →](../milestone-3/)
