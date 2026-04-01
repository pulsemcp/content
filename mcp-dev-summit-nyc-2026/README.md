# Architecting Agentic Engineering Loops With MCP

**Event**: MCP Dev Summit NYC 2026
**Presenter**: Tadas Antanavicius · [PulseMCP](https://pulsemcp.com)

This talk covers how to move from manual, back-and-forth coding agent usage to fully autonomous agentic loops — defining "done," giving agents verification tools via MCP, and parallelizing multiple loops at once.

All exercises use **[Claude Code](https://docs.anthropic.com/en/docs/claude-code)** as the coding agent. Claude Code has native MCP support, which lets the agent connect to external tools (Figma, Chrome DevTools, GitHub, etc.) and use them autonomously inside its loop.

## Slides

- [Workshop-Architecting-Agentic-Engineering-Loops-With-MCP.pdf](Workshop-Architecting-Agentic-Engineering-Loops-With-MCP.pdf)

## Demos

Live demos from the session (same demos as [MCP Academy LIVE! 2026](../mcp-academy-live-2026/)):

- [`demo-1/`](demo-1/) — Linear clone app for the UI bug demo (Playwright MCP) — includes [recording](demo-1/README.md)
- [`demo-2/`](demo-2/) — On-call triage demo (AppSignal + Postgres + Playwright + Slack MCP) — includes [recording](demo-2/README.md)

## Kata Exercises

Hands-on exercises for the session: [`kata/`](kata/)
