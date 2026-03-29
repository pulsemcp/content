# Milestone 4: Adding a Slack Integration

**Goal**: When a ticket is marked complete in our app, post a notification to a Slack channel.

## Context

The app is deployed and working. Now we're adding an integration with a SaaS tool — Slack. This is an example of a pattern you'll see often: your company uses some external service, and you want your app to talk to it. The Slack MCP server lets the agent build, test, and verify the integration without you manually checking Slack.

## The Loop

The agent implements the Slack integration, deploys the change, then verifies end-to-end that marking a ticket complete actually delivers a message to the configured Slack channel.

```
┌───────────────────────────────────────────────────┐
│                                                   │
│   Implement Slack integration                     │
│           │                                       │
│           ▼                                       │
│   GitHub (open PR, CI passes)                     │
│           │                                       │
│           ▼                                       │
│   Deploy to production (DigitalOcean + SSH)        │
│           │                                       │
│           ▼                                       │
│   Mark a ticket complete in the live app          │
│           │                                       │
│           ▼                                       │
│   Slack MCP (check: did the message arrive?)      │
│           │                                       │
│     Arrived? ──── No ──→ diagnose & fix           │
│           │                                       │
│          Yes                                      │
│           │                                       │
│         Done                                      │
│                                                   │
└───────────────────────────────────────────────────┘
```

## MCP Servers

| Server | Role |
|--------|------|
| **Slack** | Configure the integration and verify that messages are actually delivered |
| **GitHub** | PRs for the feature; Actions for CI/CD |
| **DigitalOcean** | Deploy the updated app to the existing droplet |
| **SSH** | Verify the deployed app is running with the new integration |

## Closed Loop

- **Definition of done**: Marking a ticket complete in the deployed app triggers a Slack message in the configured channel
- **Verification**: The agent deploys the change, marks a ticket complete on the live app, then uses the Slack MCP server to confirm the message arrived — testing the real delivery path, not just the code path
- **Human role**: None. The agent tests the actual integration end-to-end against the deployed environment.

## Starting Point

The `start/` directory contains the starting state for this milestone — a deployed app on DigitalOcean with CI/CD from Milestone 3. You can jump straight in here without completing Milestones 1–3.

## What You'll Have When Done

The Linear clone app with a working Slack integration — completing a ticket posts a notification to a Slack channel, verified against the live deployment.
