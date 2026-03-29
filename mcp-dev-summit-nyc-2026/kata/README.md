# Kata Exercises — Architecting Agentic Engineering Loops With MCP

Hands-on exercises for practicing agentic engineering patterns. We'll go from an app idea all the way to deployed infrastructure with a Slack integration and production alert triage — building a closed agentic loop at every step.

**What we're building**: A Linear clone. The motivation: we have custom opinions on how we want to manage work internally, and Linear is a great starting point from a UX perspective. We want to copy its interface as a foundation, then customize from there.

**Architecture**: This is a single-player app (no accounts/auth) with three components:

- **Frontend** — the UI
- **Backend** — API layer
- **Postgres database** — persistent storage

A basic CRUD application, but with a realistic, parallelizable architecture that mirrors how you'd build something real.

## Prerequisites

- A coding agent with MCP support (e.g., Claude Code)
- Familiarity with the open loop vs. closed loop concepts from the talk

---

## Milestone 1: Idea to Figma Design

**Goal**: Take Linear's existing interface and produce a high-fidelity Figma design as our starting point.

**The loop**: The agent navigates Linear's UI with Playwright, captures the interface, and iterates with Figma to reproduce a high-fidelity design. The loop runs until the Figma design closely matches the source — giving us a starting point that a design team can then tweak (colors, branding, layout opinions, etc.).

### MCP Servers

| Server | Role |
|--------|------|
| **Playwright** | Navigate and capture Linear's UI — the agent sees what a human would see |
| **Figma** | Create and iterate on the design until it matches the source |

### Closed Loop

- **Definition of done**: The Figma design is a high-fidelity reproduction of Linear's core interface
- **Verification**: The agent uses Playwright to visually compare the Figma output against the source UI — no human review needed to confirm fidelity
- **Human role**: None during the loop. You review the output after the loop completes and hand it to your design team for customization.

---

## Milestone 2: Figma Design to Implementation

**Goal**: Turn the Figma design into a working application with a frontend, backend, and Postgres database.

**The loop**: The agent reads the Figma design, implements the UI and API, starts the dev server, and uses Playwright to verify that the rendered app matches the design. GitHub PRs give us a review checkpoint. The `/start-dev-server` agent skill handles environment setup with built-in closed-loop tactics — for example, outputting logs to a `.log` file that the agent can read to self-diagnose issues.

### MCP Servers & Tools

| Server / Tool | Role |
|---------------|------|
| **Playwright** | Verify that the running app visually matches the Figma design |
| **Figma** | Read the design specs to guide implementation |
| **GitHub** | Open PRs for each piece of work |
| `/start-dev-server` **skill** | Start the dev environment with observability built in (log files, health checks) |

### Closed Loop

- **Definition of done**: The running app visually matches the Figma design and all CRUD operations work
- **Verification**: Playwright compares the rendered UI against the Figma source; the agent confirms API behavior via the running app
- **Observability highlight**: The `/start-dev-server` skill demonstrates tight-loop tactics — structured log output to a `.log` file that the agent reads to self-correct without guessing

---

## Milestone 3: Deploying to Remote Infrastructure

**Goal**: Deploy the application to a production box.

**The loop**: The agent provisions a DigitalOcean droplet, configures it via SSH, deploys the containerized app, and verifies it's running. GitHub Actions provides the CI/CD pipeline.

We're simplifying for the day: a single box running a container is our "production." In a real scenario you'd have staging environments, load balancers, etc. — but the closed-loop principles are the same.

**CLI vs. MCP aside**: You could SSH via the CLI, but MCP is where infrastructure investment is heading. CLI has a hard ceiling — it's unstandardized, one-directional, and harder to constrain. If you architect your flows around MCP today, you get structured tool definitions, scoped permissions, and a foundation that scales with the ecosystem.

### MCP Servers

| Server | Role |
|--------|------|
| **DigitalOcean** | Provision and manage the droplet |
| **SSH** | Configure the server, deploy containers, verify runtime state |
| **GitHub** | PRs for infra changes; Actions for CI/CD pipeline |

### Closed Loop

- **Definition of done**: The app is live on the public internet and responding to requests
- **Verification**: The agent hits the deployed URL and confirms a successful response — or SSH-es in to check container health, logs, etc.
- **Human role**: None. The agent provisions, deploys, and confirms end-to-end.

---

## Milestone 4: Adding a Slack Integration

**Goal**: When a ticket is marked complete in our app, post a notification to a Slack channel.

This is an example of integrating with a SaaS tool your company already uses. The Slack MCP server lets the agent build, test, and verify the integration without you manually checking Slack.

### MCP Servers

| Server | Role |
|--------|------|
| **Slack** | Configure the integration and verify that messages are actually delivered |
| **GitHub** | PRs for the feature; Actions for CI/CD |

### Closed Loop

- **Definition of done**: Marking a ticket complete in the app triggers a Slack message in the configured channel
- **Verification**: The agent marks a ticket complete, then uses the Slack MCP server to confirm the message arrived — testing the real delivery path, not just the code path
- **Human role**: None. The agent tests the actual integration end-to-end.

---

## Milestone 5: Triaging an Alert

**Goal**: An error is firing in production. The agent triages it, identifies the root cause, fixes it, and deploys the fix — all in a closed loop.

We'll set up Sentry for error monitoring, contrive an error condition, and then let the agent handle the full incident lifecycle: diagnose via Sentry, fix the code, deploy, and confirm the error stops firing.

### MCP Servers

| Server | Role |
|--------|------|
| **Sentry** | Pull error details, stack traces, and frequency data to diagnose the issue |

### Closed Loop

- **Definition of done**: The error is no longer firing in production
- **Verification**: The agent deploys the fix and confirms via Sentry that the error rate drops to zero
- **Human role**: None. The agent handles the full triage-to-deploy cycle.

---

## Tips for Success

1. **Define "done" before you start** — Write explicit completion criteria in your prompt. If the agent can't tell when it's finished, the loop stays open.
2. **Give verification tools** — Playwright for UI, CI for tests, Slack for integration delivery, Sentry for error rates. The agent needs to check its own work.
3. **Keep the loop tight** — Provide observability (logs, data, config) so the agent self-corrects without spinning.
4. **Stay out of the loop** — If you're manually verifying, approving, or authenticating, the loop is still open.
