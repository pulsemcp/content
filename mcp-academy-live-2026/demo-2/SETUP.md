# Demo 2 Setup

Step-by-step instructions to prepare the staging environment for the on-call triage demo.

## Prerequisites

- An Agent Orchestrator session on the PulseMCP staging app with the **Postgres MCP server** connected (read-write access to the staging DB)
- Optionally, **Playwright MCP server** connected for browser verification

## Step 1: Corrupt the record

Pick the most recent official mirror for a popular server (e.g. `github`), then inject both bugs in a single SQL update:

```sql
-- Find the target mirror (most recent for the github server)
SELECT m.id, s.slug,
       m.jsonb_data->'server'->>'name' AS json_name,
       m.jsonb_data->'_meta'->'io.modelcontextprotocol.registry/official'->>'publishedAt' AS published_at
FROM mcp_servers_official_mirrors m
JOIN mcp_servers s ON s.id = m.mcp_server_id
WHERE s.slug = 'github'
ORDER BY m.datetime_ingested DESC
LIMIT 1;

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

Verify the output shows `new_published_at = '2025-13-01T00:00:00Z'` and `new_name_type = 'number'`.

> **Save the original `jsonb_data`** before corrupting so you can restore after the demo. Run `SELECT jsonb_data FROM mcp_servers_official_mirrors WHERE id = <MIRROR_ID>` first and save the output.

## Step 2: Verify with Playwright

Use the Playwright MCP server to confirm the 500:

```js
const response = await page.goto('https://staging.pulsemcp.com/servers/github');
return { status: response.status() }; // Should be 500
```

Hit the page 2-3 times so AppSignal captures the error and fires the Slack alert.

## Step 3: Run the demo

Hand the Slack alert to the agent. Expected flow:

1. Read AppSignal alert → `ArgumentError: invalid date`
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
