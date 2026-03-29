# Milestone 5: Triaging an Alert

**Goal**: An error is firing in production. The agent triages it, identifies the root cause, fixes it, and deploys the fix — all in a closed loop.

## Context

The app is deployed with three features from Milestone 4 (Slack notifications, due dates, priority levels). We've set up Sentry for error monitoring and introduced a deliberate error condition. The agent handles the full incident lifecycle: diagnose via Sentry, fix the code, deploy, and confirm the error stops firing.

This is the capstone exercise — it combines everything from previous milestones (code changes, deployment, verification) into a single, realistic on-call triage scenario.

## The Loop

The agent reads the Sentry alert, diagnoses the root cause from stack traces and error data, implements a fix, deploys it, and verifies via Sentry that the error rate drops to zero.

```
┌──────────────────────────────────────────────────┐
│                                                  │
│   Sentry (read alert, stack traces, frequency)   │
│           │                                      │
│           ▼                                      │
│   Diagnose root cause                            │
│           │                                      │
│           ▼                                      │
│   Implement fix                                  │
│           │                                      │
│           ▼                                      │
│   GitHub (open PR, CI passes)                    │
│           │                                      │
│           ▼                                      │
│   Deploy to production (DigitalOcean + SSH)       │
│           │                                      │
│           ▼                                      │
│   Sentry (check: error rate → zero?)             │
│           │                                      │
│     Fixed? ──── No ──→ re-diagnose               │
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
| **Sentry** | Pull error details, stack traces, and frequency data to diagnose the issue |
| **GitHub** | PR for the fix; Actions to run the CI/CD pipeline |
| **DigitalOcean** | Target the existing droplet for deployment |
| **SSH** | Deploy the updated container and verify runtime state post-deploy |

## Closed Loop

- **Definition of done**: The error is no longer firing in production
- **Verification**: The agent deploys the fix and confirms via Sentry that the error rate drops to zero
- **Human role**: None. The agent handles the full triage-to-deploy cycle.

## Starting Point

The `start/` directory contains the starting state for this milestone — a deployed app with Slack notifications, due dates, and priority levels from Milestone 4, plus Sentry monitoring and a deliberate error condition pre-configured for this exercise. You can jump straight in here without completing Milestones 1–4.

## What You'll Have When Done

The production error is resolved, deployed, and confirmed via Sentry — the full incident lifecycle handled autonomously by the agent.
