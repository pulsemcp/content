# Milestone 4: Parallelizing Three Features

**Goal**: Ship three features in parallel — each on its own git clone with its own agent — and merge them all cleanly.

## Context

The app is deployed and working. Now we want to add three features at once. This is where parallelization comes in.

The catch: these features **trample each other**. They touch the same files — the ticket model, the ticket card UI, the creation form, the API routes. If you ran three agents on the same clone, you'd get constant merge conflicts. The solution: **one git clone per agent**, then merge the results.

### The Three Features

1. **Slack notification on ticket complete** — When a ticket is marked done, post a message to a Slack channel. Touches the ticket status change handler and adds a backend integration.

2. **Due dates with overdue highlighting** — Add a due date field to tickets with a date picker in the creation form and visual overdue indicators on the ticket card. Touches the DB schema, ticket card UI, creation form, and API.

3. **Ticket priority levels (P0–P3)** — Add a priority field with color-coded labels. Touches the DB schema, ticket card UI, creation form, and API.

Features 2 and 3 are the trampling showcase: they both modify the same database migration, the same ticket card component, the same form, and the same API serialization. Running them on one clone would be a disaster. Running them on separate clones lets each agent work independently, and the merges resolve cleanly.

## The Parallel Loop

Spin up three git clones. Each agent gets its own clone and works independently.

```
         ┌──── Clone 1 ────┐  ┌──── Clone 2 ────┐  ┌──── Clone 3 ────┐
         │                  │  │                  │  │                  │
         │  Agent 1:        │  │  Agent 2:        │  │  Agent 3:        │
         │  Slack notifs    │  │  Due dates       │  │  Priority levels │
         │                  │  │                  │  │                  │
         │  Chrome DT ✓     │  │  Chrome DT ✓     │  │  Chrome DT ✓     │
         │  Slack MCP ✓     │  │  GitHub MCP ✓    │  │  GitHub MCP ✓    │
         │  GitHub MCP ✓    │  │                  │  │                  │
         │                  │  │                  │  │                  │
         └───────┬──────────┘  └───────┬──────────┘  └───────┬──────────┘
                 │                     │                     │
                 ▼                     ▼                     ▼
                 └─────────────────────┼─────────────────────┘
                                       │
                                Merge all three PRs
                                       │
                                Deploy combined result
```

## MCP Servers & Tools

| Server / Tool | Agent 1 (Slack) | Agent 2 (Due dates) | Agent 3 (Priority) |
|---------------|:---:|:---:|:---:|
| **Chrome DevTools** | ✓ | ✓ | ✓ |
| **Slack** | ✓ | | |
| **GitHub** | ✓ | ✓ | ✓ |

## Closed Loops

### Agent 1: Slack Integration
- **Definition of done**: Marking a ticket complete in the deployed app triggers a Slack message
- **Verification**: The agent deploys, marks a ticket complete, then uses Slack MCP to confirm the message arrived

### Agent 2: Due Dates
- **Definition of done**: Tickets have a due date field with a date picker, and overdue tickets are visually highlighted
- **Verification**: Chrome DevTools confirms the date picker works and overdue tickets are visually highlighted

### Agent 3: Priority Levels
- **Definition of done**: Tickets have a priority field (P0–P3) with color-coded labels
- **Verification**: Chrome DevTools confirms the priority dropdown works and labels render with correct colors

### Combined Verification (Step 3)
- **Definition of done**: All three features work together on the deployed app
- **Verification**: After merging all three PRs, deploy the combined result and verify Slack notifications fire, due dates display correctly, and priority levels render — all on the live app. This step is handled by you or a coordinating agent.

## Parallelization Principles Demonstrated

- **Separate git clones** — Each agent gets its own copy of the code, avoiding merge conflicts during development
- **Why these features trample** — Features 2 and 3 both add DB columns to the tickets table, modify the same ticket card component, the same creation form, and the same API serialization
- **Independent verification** — Each agent closes its own loop before the merge step

## Starting Point

The `start-slack/`, `start-due/`, and `start-prio/` directories each contain a copy of the app from Milestone 3, with a `.mcp.json` tailored to that agent's task. You can jump straight in here without completing Milestones 1–3.

## What You'll Have When Done

The Linear clone app with three new features (Slack notifications, due dates, priority levels), all developed in parallel and deployed together. Plus firsthand experience with the parallelization pattern: separate clones, independent loops, merge and verify.

## Guide

### Step 1: Understand the directory layout

Each agent gets its own directory with its own `.mcp.json` tailored to its task:

- `start-slack/` — Agent 1 (Slack notifications) — has Chrome DevTools + Slack MCP + GitHub
- `start-due/` — Agent 2 (Due dates) — has Chrome DevTools + GitHub
- `start-prio/` — Agent 3 (Priority levels) — has Chrome DevTools + GitHub

### Step 2: Create a Slack bot token

Agent 1 needs a Slack bot token so the app can post messages when tickets are completed. Set this up before starting the loop:

1. Go to [api.slack.com/apps](https://api.slack.com/apps) and create a new app (from scratch)
2. Under **OAuth & Permissions**, add the `chat:write` bot scope
3. Install the app to your workspace
4. Copy the **Bot User OAuth Token** (`xoxb-...`)
5. Create a channel (e.g. `#linear-clone-notifications`) and invite the bot to it

### Step 3: Launch three agents in parallel

Open three terminals. Each agent gets its own clone, its own Claude Code session, and its own prompt.

**Terminal 1 — Slack notifications** (in `start-slack/`):

```
cd start-slack
export SLACK_BOT_TOKEN=xoxb-...
export GITHUB_TOKEN=$(gh auth token)
claude
```

```
Add Slack notifications to the Linear clone app. When a ticket's status is changed to "Done", post a message to the Slack channel #linear-clone-notifications.

The SLACK_BOT_TOKEN env var is set in my shell with a bot that has chat:write scope and is invited to the channel.

- Add a Slack integration to the backend using the bot token from the SLACK_BOT_TOKEN env var
- Test the app running locally and use Chrome DevTools to mark a ticket as done, then use the Slack MCP to confirm the message arrived in the channel. Keep iterating until it works end to end.
- Open a PR on GitHub (https://github.com/tadasant/demo-mcp-dev-summit-linear) with the changes
```

**Terminal 2 — Due dates** (in `start-due/`):

```
cd start-due
export GITHUB_TOKEN=$(gh auth token)
claude
```

```
Add due dates to the Linear clone app.

- Add a date picker to the create/edit ticket form, backed by the database
- Display the due date on ticket cards, with a red overdue indicator for past-due tickets
- Run the app locally with docker compose and use Chrome DevTools to verify the date picker works and overdue highlighting renders correctly
- Iterate until it looks polished, then open a PR on GitHub (https://github.com/tadasant/demo-mcp-dev-summit-linear) with the changes
```

**Terminal 3 — Priority levels** (in `start-prio/`):

```
cd start-prio
export GITHUB_TOKEN=$(gh auth token)
claude
```

```
Add priority levels (P0–P3) to the Linear clone app.

- Add a priority dropdown to the create/edit ticket form, backed by the database
- Display color-coded priority labels on ticket cards (P0 red, P1 orange, P2 yellow, P3 gray)
- Run the app locally with docker compose and use Chrome DevTools to verify the priority dropdown works and labels render with correct colors
- Iterate until it looks polished, then open a PR on GitHub (https://github.com/tadasant/demo-mcp-dev-summit-linear)
```

### Step 4: Merge, deploy, and verify

Once all three agents have opened their PRs, tell the Slack agent (because it has access to your Slack secret that needs to be deployed) to bring it all together:

```
I've reviewed and approve of all three open PRs on this repo, including the one you just prepared. Merge them all into main, resolving any conflicts, and deploy the combined result to the droplet.

After deploying, verify everything works end-to-end on the live app:
- Use Chrome DevTools to create a ticket with a due date and priority level
- Mark a ticket as done and use the Slack MCP to confirm the notification arrived
- Check that overdue highlighting and priority colors render properly and there are no bugs

If there are bugs, get them fixed and deploy until you have verified there are none remaining. Open a PR if this involves any code/script changes.
```

You're done! Check out the [`final-state/`](../final-state/) directory to compare your result.
