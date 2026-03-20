# Demo 2: On-Call Triage with MCP

Debugging a production issue end-to-end — from Slack alert to pull request — using MCP servers for Slack, AppSignal, Postgres, and Playwright.

## MCP Servers Used

- **Slack** — receive the alert, post status updates
- **AppSignal** — error tracking and performance monitoring
- **Postgres** — read-only database access to query application data
- **Playwright** — browser automation for UI verification

## Context Setter

> We're going to watch an AI agent debug a production issue end-to-end — from Slack alert to pull request — using MCP servers for Slack, AppSignal, Postgres, and Playwright.
>
> Here's the scenario: PulseMCP is a directory of MCP servers. One of its data sources is the official MCP Registry. It syncs data from that MCP registry daily.
>
> Let's assume the official MCP Registry had a bug that resulted in a malformed record being ingested. And for PulseMCP visitors, this means a 500 error when they visit a certain page.
>
> The twist: there are actually *two* bugs hiding in that bad data, but you can only see the second one after you fix the first. The first bug crashes the page before it even starts rendering. Once you fix that, the page gets further along but hits a *different* crash from a *different* field in the same corrupt record. The agent has to diagnose and fix both, deploying to staging each time and using Playwright to verify — discovering the second bug only after the first fix is live.
>
> Everything you're about to see is real infrastructure — real codebase, real AppSignal alerts, real Postgres queries, real browser automation. The agent has no advance knowledge of what's wrong.

## What to Highlight for the Audience

- The agent uses **4 different MCP servers** (Slack, AppSignal, Postgres, Playwright) working together
- It has to **triangulate** across logs and data — neither alone is sufficient
- The **two-layer reveal** is natural — fixing the first crash unmasks the second
- Both bugs come from the **same corrupt record** — realistic pipeline failure
- Playwright is essential — the agent can't just check HTTP status codes, it has to actually visit the page
