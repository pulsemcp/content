# Architecting Agentic Engineering Loops With MCP

**Event**: MCP Dev Summit NYC 2026
**Format**: In-person (New York City)
**Presenter**: Tadas Antanavicius · [PulseMCP](https://pulsemcp.com)

## About the Presenter

- **MCP Steering Group** — Maintainer of the MCP Registry and contributor community on GitHub and Discord
- **PulseMCP** — A newsletter & catalog for discovering MCP servers across the growing ecosystem
- **Agentic Engineering** — Hands-on team consulting to help engineering organizations level up with agentic workflows and tooling

## Talk Overview

Many engineers use coding agents in a manual, back-and-forth pattern — paste context, prompt, review, repeat — yielding a modest 10–30% productivity speed-up. But it can look very different: hand off an entire sequence to an agent operating autonomously inside a closed loop. One instruction triggers the full loop, unlocking 100%+ speed-ups.

This talk covers the concepts, demos, and hands-on practice to get there.

## Agenda

| # | Topic | Description |
|---|-------|-------------|
| 01 | **What Is an Agentic Loop** | The foundational concept: "Tools running on a loop to achieve a goal" |
| 02 | **"Aha" #1: Closing the Loop** | How to get an agent to spend 10 minutes productively |
| 03 | **Demo 1: UI Feature Work** | Implement a feature on a Linear clone with a Playwright MCP server |
| 04 | **Demo 2: On-Call Triage** | Triaging a support alert with Slack, AppSignal, Postgres, and Playwright |
| 05 | **"Aha" #2: Parallelization** | What it takes to get multiple loops going at once |
| 06 | **Hands-on Kata Exercises** | Go from app idea to deployed infra, practicing loops along the way |

## Key Concepts

### Open Loop vs. Closed Loop

- **Open Loop** — The human is expected to provide inputs, approvals, or babysitting at key points to keep the agent moving forward.
- **Closed Loop** — The agent self-verifies completion — or iterates with new context — without waiting for a human in the critical path.

### Closing the Loop

1. **Define Done** — Your prompt must include a clear, unambiguous definition of done.
2. **Give Verification Tools** — Equip your agent with the MCP tools it needs to check its own work (Playwright, CI, Slack, etc.).

> **The Golden Rule**: If you are anywhere in the loop — even for something trivial — it doesn't count as a closed loop.

### Keeping Loops Tight: Observability

A closed loop is the happy path. A *tight* loop is the ideal — one where the agent has rich, real-time context at every step. Tools that surface logs, data state, and environment config let agents self-correct faster and with higher confidence.

### Parallelization

Running multiple agents at once requires solving:
- **Conflicting ports** — Containerize or use dynamic port allocation
- **External integrations** — Mock or isolate dependencies
- **ClickOps infrastructure** — Automate infra provisioning
- **Shared git state** — Use separate clones or worktrees per agent

## Demos

### Demo 1: UI Feature Work

Implement a UI feature on a Linear clone app. The agent uses Playwright MCP to navigate the UI, understand the scope, implement the change, and confirm the correct rendered outcome — no human in the loop.

### Demo 2: On-Call Triage

Triage a production support alert end-to-end using:
- **Slack MCP** — Alert entrypoint
- **AppSignal MCP** — Logs and metrics
- **Postgres MCP** — Database state queries
- **Playwright MCP** — UI reproduction and verification

## Kata Exercises

Hands-on exercises for practicing agentic engineering loops: [`kata/`](kata/)

## Slides

*Slides will be added after the session.*

## Contact

Interested in working together? Reach out at **tadas@pulsemcp.com**

Find all PulseMCP presentation materials at [github.com/pulsemcp/content](https://github.com/pulsemcp/content)
