# Milestone 4: Parallelizing Three Features

**Goal**: Ship three features in parallel — each on its own git clone with its own agent — and merge them all cleanly.

## Context

The app is deployed and working. Now we want to add three features at once. This is where parallelization comes in: the talk covered the "Aha #2" moment of running multiple agents simultaneously. Here we practice it.

The catch: these features **trample each other**. They touch the same files — the ticket model, the ticket card UI, the creation form, the API routes. If you ran three agents on the same clone, you'd get constant merge conflicts. The solution: **one git clone per agent**, then merge the results.

### The Three Features

1. **Slack notification on ticket complete** — When a ticket is marked done, post a message to a Slack channel. Touches the ticket status change handler and adds a backend integration.

2. **Due dates with overdue highlighting** — Add a due date field to tickets with a date picker in the creation form and visual overdue indicators on the ticket card. Touches the DB schema, ticket card UI, creation form, and API.

3. **Ticket priority levels (P0–P3)** — Add a priority field with color-coded labels. Touches the DB schema, ticket card UI, creation form, and API.

Features 2 and 3 are the trampling showcase: they both modify the same database migration, the same ticket card component, the same form, and the same API serialization. Running them on one clone would be a disaster. Running them on separate clones lets each agent work independently, and the merges resolve cleanly.

## Steps

### Step 1: Design the Visual Features

Before kicking off the parallel agents, create Figma designs for the due dates and priority levels features. This gives agents 2 and 3 a clear visual target — the same way Milestone 2 used a Figma design to drive implementation.

```
┌────────────────────────────────────────────────┐
│                                                │
│   Figma (design due dates + priority UI)       │
│           │                                    │
│           ▼                                    │
│   Playwright (compare Figma ↔ current app)     │
│           │                                    │
│       Good? ──── No ──→ iterate in Figma       │
│           │                                    │
│          Yes                                   │
│           │                                    │
│   Designs ready for agents 2 & 3               │
│                                                │
└────────────────────────────────────────────────┘
```

### Step 2: Run Three Agents in Parallel

Spin up three git clones. Each agent gets its own clone and works independently.

```
         ┌──── Clone 1 ────┐  ┌──── Clone 2 ────┐  ┌──── Clone 3 ────┐
         │                  │  │                  │  │                  │
         │  Agent 1:        │  │  Agent 2:        │  │  Agent 3:        │
         │  Slack notifs    │  │  Due dates       │  │  Priority levels │
         │                  │  │                  │  │                  │
         │  Slack MCP ✓     │  │  Figma MCP ✓     │  │  Figma MCP ✓     │
         │  GitHub MCP ✓    │  │  Playwright ✓    │  │  Playwright ✓    │
         │  DigitalOcean ✓  │  │  GitHub MCP ✓    │  │  GitHub MCP ✓    │
         │  SSH ✓           │  │  /start-dev ✓    │  │  /start-dev ✓    │
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

### Step 3: Merge and Deploy

Once all three agents have opened their PRs, you (or a coordinating agent) merge them into main, resolve any minor conflicts, deploy the combined result, and verify all three features work together on the live app.

## MCP Servers & Tools

| Server / Tool | Agent 1 (Slack) | Agent 2 (Due dates) | Agent 3 (Priority) |
|---------------|:---:|:---:|:---:|
| **Figma** | | ✓ | ✓ |
| **Playwright** | | ✓ | ✓ |
| **Slack** | ✓ | | |
| **GitHub** | ✓ | ✓ | ✓ |
| **DigitalOcean** | ✓ | | |
| **SSH** | ✓ | | |
| `/start-dev-server` **skill** | | ✓ | ✓ |

## Closed Loops

### Agent 1: Slack Integration
- **Definition of done**: Marking a ticket complete in the deployed app triggers a Slack message
- **Verification**: The agent deploys, marks a ticket complete, then uses Slack MCP to confirm the message arrived

### Agent 2: Due Dates
- **Definition of done**: Tickets have a due date field with a date picker, and overdue tickets are visually highlighted
- **Verification**: Playwright confirms the UI matches the Figma design and overdue highlighting renders correctly

### Agent 3: Priority Levels
- **Definition of done**: Tickets have a priority field (P0–P3) with color-coded labels
- **Verification**: Playwright confirms the UI matches the Figma design and priority labels render with correct colors

### Combined Verification (Step 3)
- **Definition of done**: All three features work together on the deployed app
- **Verification**: After merging all three PRs, deploy the combined result and verify Slack notifications fire, due dates display correctly, and priority levels render — all on the live app. This step is handled by you or a coordinating agent.

## Parallelization Principles Demonstrated

- **Separate git clones** — Each agent gets its own copy of the code, avoiding merge conflicts during development
- **Why these features trample** — Features 2 and 3 both add DB columns to the tickets table, modify the same ticket card component, the same creation form, and the same API serialization
- **Design-first for visual features** — Creating Figma designs before kicking off agents gives each a clear, verifiable target
- **Independent verification** — Each agent closes its own loop before the merge step

## Starting Point

The `start/` directory contains the starting state for this milestone — a deployed app on DigitalOcean with CI/CD from Milestone 3. You can jump straight in here without completing Milestones 1–3.

## What You'll Have When Done

The Linear clone app with three new features (Slack notifications, due dates, priority levels), all developed in parallel and deployed together. Plus firsthand experience with the parallelization pattern: separate clones, independent loops, merge and verify.
