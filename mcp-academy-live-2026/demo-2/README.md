# Demo 2: On-Call Triage with MCP

Triaging an application monitoring alert using multiple MCP servers.

## MCP Servers Used

- **AppSignal** — error tracking and performance monitoring
- **Postgres** — read-only database access to query production data
- **Playwright** — browser automation for UI verification

## Scenario

Agent receives a page/alert, pulls logs from AppSignal, queries the database to understand actual state, and uses Playwright to verify the fix in the UI.
