# Milestone 1: Idea to Figma Design

**Goal**: Take Linear's existing interface and produce a high-fidelity Figma design as our starting point.

## Context

We want to build a Linear clone for internal use. Linear is a great starting point from a UX perspective — we want to capture its interface as a foundation, then customize from there (colors, branding, layout opinions). The output of this milestone is a Figma design that a design team can iterate on.

## The Loop

The agent navigates Linear's UI with Playwright, captures the interface, and iterates with Figma to reproduce a high-fidelity design. The loop runs until the Figma design closely matches the source.

```
┌─────────────────────────────────────────┐
│                                         │
│   Playwright (capture Linear UI)        │
│           │                             │
│           ▼                             │
│   Figma (create/update design)          │
│           │                             │
│           ▼                             │
│   Playwright (compare Figma ↔ Linear)   │
│           │                             │
│       Match? ──── No ──→ loop back      │
│           │                             │
│          Yes                            │
│           │                             │
│         Done                            │
│                                         │
└─────────────────────────────────────────┘
```

## MCP Servers

| Server | Role |
|--------|------|
| **Playwright** | Navigate and capture Linear's UI — the agent sees what a human would see |
| **Figma** | Create and iterate on the design until it matches the source |

## Closed Loop

- **Definition of done**: The Figma design is a high-fidelity reproduction of Linear's core interface
- **Verification**: The agent uses Playwright to visually compare the Figma output against the source UI — no human review needed to confirm fidelity
- **Human role**: None during the loop. You review the output after the loop completes.

## Starting Point

The `start/` directory contains the starting state for this milestone.

## What You'll Have When Done

A high-fidelity Figma design of Linear's core UI — ready for your design team to customize.
