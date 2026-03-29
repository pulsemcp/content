# Kata Exercises — Architecting Agentic Engineering Loops With MCP

Hands-on exercises for practicing agentic engineering patterns. Each kata builds on the concepts from the talk — defining done, closing the loop, providing observability, and parallelizing work.

## Prerequisites

- A coding agent with MCP support (e.g., Claude Code)
- Familiarity with the open loop vs. closed loop concepts from the talk

## Exercises

*Exercises will be added ahead of the MCP Dev Summit NYC session.*

## Tips for Success

1. **Define "done" before you start** — Write an explicit completion criteria in your prompt. If the agent can't tell when it's finished, the loop stays open.
2. **Give verification tools** — Playwright for UI, CI for tests, database access for data state. The agent needs to check its own work.
3. **Keep the loop tight** — Provide observability (logs, data, config) so the agent self-corrects without spinning.
4. **Stay out of the loop** — If you're manually verifying, approving, or authenticating, the loop is still open.
