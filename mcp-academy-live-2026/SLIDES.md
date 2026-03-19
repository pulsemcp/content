Title Slide: Closing the Loop: MCP-Powered Agentic Engineering
- Tadas Antanavicius
- PulseMCP

Slide 1: (no title)
- MCP Steering Group: MCP Registry, Contributor Community
- PulseMCP: Catalogs of MCP Servers
- Agentic Engineering: Team Consulting

Slide 2: Many Engineers Using Coding Agents Like This
- Prompt
- Review
- Paste context + prompt
- Review
- ...
- Repeat until PR is open and ready for review
- --> 10-30% productivity speed-up

Slide 3: But It Can Look Like This
- Human -> Agent in a box that performs loops performing the above sequence
- ---> 100%+ productivity speed-up

Slide 4: What We'll Cover
1. What is an agentic loop
2. What does it mean to close an agentic loop
3. Demo 1: fixing a UI bug with Playwright MCP
4. Demo 2: triaging on-call support with Appsignal, Postgres, Playwright, and Slack
5. How to action this in your work

Slide 5: What Is An Agentic Loop
- Agent = "tools running on a loop to achieve a goal" (- Simon Willison)
- Open loop = where the human is expected to provide inputs or babysitting to make progress
- Closed loop = where the agent can self-verify that it completed its job, or otherwise do another iteration on the loop with some new context as to how to accomplish its goal

Slide 6: Closing Agentic Loops - Verification
- Your prompt needs a definition of done as a pre-requisite
- Then give your agent the tool(s) it needs to verify completion

Slide 6a: Examples
- Playwright MCP server to click-test a UI for you
- GitHub Actions-powered CI to ensure your new feature passes your test suite
- Slack MCP server to trigger a message to test your app's Slack integration feature

Slide 6b: Tip
- IMPORTANT: if you are anywhere in the loop, it doesn't count. Even if it's trivial. Example: if you have to auth in manually to a production service to test whether your agent's change is correct, that doesn't count.

Slide 7: Keeping Loops Tight - Observability
- The happy path is a closed loop, but the ideal loop is a tight loop
- Give tools that provide meaningful context along the way

Slide 7a: Examples
- Logging infrastructure to see stack traces
- Database access to understand actual data state
- Environment variables or feature flags to understand what code paths are active

Slide 8: Demo
- Implementing a feature on a UI
- ft: Playwright MCP server

Slide 9: Demo
- Triaging an application monitoring alert
- ft: Appsignal, Postgres, Playwright, and Slack MCP servers

Slide 10: How To Action This
- Identify your external systems -> MCP servers
- Identify infrastructure bottlenecks -> add to your roadmap
- Push yourself: why can't I one-shot this with a closed loop?
- Read our post about agentic engineering

Slide 11: Next Steps
- We work with teams and enterprises to maintain custom catalogs of quality MCP servers (either built from scratch or existing)
- And we do consulting engagements with engineering teams looking to upskill on agentic engineering
- Reach out to tadas@pulsemcp.com if either of those interest you
