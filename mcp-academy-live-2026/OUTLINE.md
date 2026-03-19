Closing the Loop: MCP-Powered Agentic Engineering

Slide 1 - Who Am I

- Member of the **MCP Steering Committee**
- I'm a co-founder of **PulseMCP** — we're an MCP server directory with an enterprise offering where we build and/or curate custom catalogs of MCP servers
- I also consult on several companies' engineering teams directly with engineers to help them adopt **agentic engineering**

Slide 2 - The Problem

Many engineers use AI as a copilot

- Prompt
- Review
- Paste context + prompt
- Review
- ...
- Repeat until PR is open and ready for review

Slide 3 - The (High Level) Solution

The theory of agentic engineering is that we can collapse those cycles into autonomous loops

Sometimes called verifications loops

Human -> Agent in a box that performs loops performing the above task

Slide 4 - Agenda

1. What is an agentic loop
2. What does it mean to close an agentic loop
3. Demo 1: fixing a UI bug with Playwright MCP
4. Demo 2: triaging on-call support with Appsignal, Postgres, and Playwright
5. How to action this in your work

Slide 5 - What Is An Agentic Loop

Agent = "tools running on a loop to achieve a goal" (Simon Willison)

Open loop = where the human is expected to provide inputs or babysitting to make progress

Closed loop = where the agent can self-verify that it completed its job, or otherwise do another iteration on the loop with some new context as to how to accomplish its goal

--> If the chunk of engineering work you are doing can be assessed and verified by your peer in code review, then it's possible to provide an agent a closed loop to accomplish it

Slide 6 - Closing An Agentic Loop

VERIFICATION

"Definition of done" (and a way to check it)

Enable your coding agent to do the thing you would do manually so it can check its own work

Examples:
- Playwright MCP server to click-test a UI for you
- GitHub Actions-powered CI to ensure your new feature passes your test suite
- Slack MCP server to trigger a message to test your app's Slack integration feature

IMPORTANT: if you are anywhere in the loop, it doesn't count. Even if it's trivial. Example: if you have to auth in manually to a production service to test whether your agent's change is correct, that doesn't count.

Slide 7 - Keeping Agentic Loops Tight

OBSERVABILITY

The happy path is a closed loop, but the ideal loop is a tight loop

One hallmark of a good engineer is to create tight feedback loops. Nobody wants to wait 10 minutes for CI to run to verify that your change fixed the bug.

Slide 8 - Demo 1

**Scenario**: Implement a feature in a UI

- Start with a feature description
- Agent uses MCP tools to grab failure logs from the running system
- Agent reproduces the issue, reads the relevant error context, and solves it
- No pair programming — the agent has the access it needs to work autonomously

Highlight very common: giving access to logs of your server (MCP is not the only way we can close loops)

Slide 9 - Demo 2

## Demo 2: Full-Stack Agent with Production Access

**Tools provided to the agent**:
- **AppSignal** — error tracking and performance monitoring
- **Read-only database access** — query production data to understand state
- **Playwright** — browser automation for UI verification


Slide 10 - How To Action

- Identify all the systems you integrate with, make sure you have an MCP server for each of them
- In some cases, you may have infra blockers. e.g. if you do a lot of infrastructure work, and you don't have reproducible infrastructure-as-code, it's probably not practical for you to automate UI clicks to make changes. You'll want to invest in moving to more reproducible architecture
- If you can't one-shot a task in front of you, ask yourself what auth'd MCP server or architecture refactor is missing and add that to your workload
- In the meantime, you can probably still build loops that aren't quite as far end to end. e.g. if you're missing IaC, maybe you can get a loop going in your local dev server against a mock of the production integration you're building for even if you can't get it into a proper staging environment that is a more "real" loop

Start with on-call / triage
- **On-call and triage is the easiest starting point** — it's a well-defined use case
- Agent gets a page, pulls logs, checks metrics, identifies the issue, proposes a fix
- The workflow is already structured, so it's a natural fit for autonomous agents

## Read Next: Agentic Engineering

- The blog post / deeper content that goes beyond this workshop
- **Importantly: you need to parallelize workflows**
  - Don't just give one agent more tools — run multiple agents on different parts of the problem
  - The real productivity unlock is going from 1 agent to N agents working concurrently
  - This is where the compounding returns happen


Slide 11 - CTA

- We work with teams and enterprises to maintain custom catalogs of quality MCP servers (either built from scratch or existing)
- And we do consulting engagements with engineering teams looking to upskill on agentic engineering
- Reach out to tadas@pulsemcp.com if either of those interest you
