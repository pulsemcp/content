# Demo 2 Setup

Step-by-step instructions to prepare the staging environment for the on-call triage demo.

## Prerequisites

- An Agent Orchestrator session on the PulseMCP staging app with the **Postgres MCP server** connected (read-write access to the staging DB)
- Optionally, **Playwright MCP server** connected for browser verification
- An AppSignal error-count trigger configured for staging that sends to a Slack channel (e.g. `error count > 0` → `#eng-alerts`)

## Choosing a target server

**The target server must have exactly one official mirror record.** This is critical.

Servers with multiple mirrors (like `github`) will NOT properly trigger Bug 2. When Bug 1 is fixed, the corrupted record sorts last and `server_json_name` reads from a different (valid) mirror — so the second crash never happens.

With exactly one mirror, the corrupted record is the only one, so both bugs trigger sequentially.

Find candidates:

```sql
SELECT s.slug, s.id AS server_id, m.id AS mirror_id,
       s.downloads_estimate_total
FROM mcp_servers s
JOIN mcp_servers_official_mirrors m ON m.mcp_server_id = s.id
GROUP BY s.id, s.slug, s.downloads_estimate_total, m.id
HAVING count(m.id) OVER (PARTITION BY s.id) = 1
ORDER BY s.downloads_estimate_total DESC NULLS LAST
LIMIT 10;
```

Good candidates as of March 2026: `sentry` (mirror 10818), `stripe-agent-toolkit`, `browserbase-mcp-server`.

## Step 1: Back up and corrupt the record

```sql
-- Back up (save this output for restore)
SELECT jsonb_data FROM mcp_servers_official_mirrors WHERE id = <MIRROR_ID>;

-- Corrupt: invalid publishedAt (month 13) + numeric name (integer instead of string)
UPDATE mcp_servers_official_mirrors
SET jsonb_data = jsonb_set(
  jsonb_set(
    jsonb_data,
    '{_meta,io.modelcontextprotocol.registry/official,publishedAt}',
    '"2025-13-01T00:00:00Z"'
  ),
  '{server,name}',
  '12345'
)
WHERE id = <MIRROR_ID>
RETURNING
  jsonb_data->'_meta'->'io.modelcontextprotocol.registry/official'->>'publishedAt' AS new_published_at,
  jsonb_typeof(jsonb_data->'server'->'name') AS new_name_type;
```

Verify: `new_published_at = '2025-13-01T00:00:00Z'` and `new_name_type = 'number'`.

## Step 2: Verify and trip the alert

Use Playwright to confirm the 500 and generate enough errors to trip the AppSignal trigger:

```js
const results = [];
for (let i = 0; i < 5; i++) {
  const response = await page.goto('https://staging.pulsemcp.com/servers/<SLUG>');
  results.push(response.status());
}
return results; // Should all be 500
```

Wait 1-2 minutes for the AppSignal trigger to fire and send the Slack notification.

## How the two bugs work

**Bug 1 — Invalid `publishedAt` timestamp** (`_meta...publishedAt` = `"2025-13-01T00:00:00Z"`)
- Crashes `Time.iso8601()` in `McpServer#server_json_files` during sorting (iterates ALL mirrors)
- Error: `ArgumentError: mon out of range`
- Fix: `rescue ArgumentError` around the `Time.iso8601` call

**Bug 2 — Numeric `name` instead of string** (`server.name` = `12345` integer)
- Only reachable after Bug 1 is fixed, because `server_json_files` must complete before `server_json_maintainer_info` is called
- With one mirror, the corrupted record is necessarily the first result, so `server_json_name` returns the integer `12345`
- Crashes `String#split` in `McpServer#server_json_maintainer_info`
- Error: `NoMethodError: undefined method 'split' for 12345:Integer`
- Fix: `.to_s` guard on the name, or type check before calling `split`

**Why single-mirror matters:** With multiple mirrors, Bug 1's fix makes the corrupted record sort last (fallback timestamp = 0). Then `server_json_name` reads from the first (valid) mirror, and Bug 2 never triggers.

## Step 3: Run the demo

Hand the Slack alert to the agent. Expected flow:

1. Read AppSignal alert → `ArgumentError: mon out of range`
2. Query DB → find invalid `publishedAt` value (`2025-13-01T00:00:00Z`)
3. Playwright → confirm 500
4. Fix Bug 1: `rescue ArgumentError` around `Time.iso8601` in `server_json_files`
5. Deploy to staging → Playwright → **still 500** (different error!)
6. Read new AppSignal error → `NoMethodError: undefined method 'split' for 12345:Integer`
7. Query DB → find `name` is an integer, not a string
8. Fix Bug 2: type guard in `server_json_maintainer_info`
9. Deploy to staging → Playwright → page loads
10. Open PR

## Step 4: Restore after demo

```sql
UPDATE mcp_servers_official_mirrors
SET jsonb_data = '<ORIGINAL_JSONB_DATA>'::jsonb
WHERE id = <MIRROR_ID>;
```

Then close/revert the PR branch.

## Timing Notes

- Full agent run: ~10-15 minutes
- Each staging deploy: ~2 minutes
- To speed up: pre-stage the branch with Bug 1 fix already committed, let the agent discover Bug 2 live
