# Demo 2 Setup

Step-by-step instructions to prepare the staging environment for the on-call triage demo.

## Prerequisites

- Access to the PulseMCP staging Rails console or direct Postgres access to staging DB
- A server with an official mirror record (has `mcp_servers_official_mirrors` data) — pick a popular one that you know has a server.json callout visible on the show page

## Step 1: Identify your target server

Pick a live server that has official mirror data. In staging Rails console:

```ruby
# Find a good candidate — a server with an official mirror and the server.json callout visible
server = McpServer.joins(:mcp_servers_official_mirrors)
  .includes(:mcp_implementation)
  .where(mcp_implementations: { status: "live" })
  .first

puts "Server: #{server.slug} (#{server.name})"
puts "Mirror count: #{server.mcp_servers_official_mirrors.count}"
mirror = server.mcp_servers_official_mirrors.first
puts "Mirror ID: #{mirror.id}"
puts "Current name: #{mirror.server_json_name}"
puts "Current publishedAt: #{mirror.registry_published_at}"
```

Write down the **mirror ID** and the **original jsonb_data** so you can restore it after the demo.

## Step 2: Back up the original data

```ruby
mirror = McpServersOfficialMirror.find(MIRROR_ID)
original_data = mirror.jsonb_data.deep_dup

# Save this somewhere safe — you'll need it to restore after the demo
puts original_data.to_json
```

## Step 3: Corrupt the record (both bugs at once)

```ruby
mirror = McpServersOfficialMirror.find(MIRROR_ID)
data = mirror.jsonb_data.deep_dup

# Bug 1: Invalid publishedAt timestamp (month 13)
# This will crash Time.iso8601() in server_json_files during controller execution
data["_meta"]["io.modelcontextprotocol.registry/official"]["publishedAt"] = "2025-13-01T00:00:00Z"

# Bug 2: Numeric name instead of string
# This will crash String#split in server_json_maintainer_info during template rendering
# (Only visible AFTER Bug 1 is fixed, because Bug 1 crashes earlier in the request lifecycle)
data["server"]["name"] = 12345

mirror.update_column(:jsonb_data, data)

# Verify the corruption
mirror.reload
puts "publishedAt: #{mirror.registry_published_at}"  # => "2025-13-01T00:00:00Z"
puts "name: #{mirror.server_json_name}"               # => 12345
puts "name class: #{mirror.server_json_name.class}"   # => Integer
```

## Step 4: Bust the cache

The show page is fragment-cached for 28 hours. Clear it so the bug is immediately visible:

```ruby
Rails.cache.clear
# Or if you want to be surgical:
# Rails.cache.delete_matched("mcp_server_show*")
```

## Step 5: Verify the bug is live

Visit `https://staging.pulsemcp.com/servers/YOUR_SERVER_SLUG` in a browser. You should see a 500 error page.

## Step 6: Trigger the AppSignal alert

The 500 will automatically report to AppSignal. If you need it to also fire a Slack notification, just visit the page — AppSignal's alert policies should pick it up. If you want it immediately, you can manually trigger the page hit a couple of times to ensure the error is captured:

```bash
curl -s -o /dev/null -w "%{http_code}" https://staging.pulsemcp.com/servers/YOUR_SERVER_SLUG
# Should return: 500
```

## Step 7: Run the demo

Hand the Slack alert to the agent. It should:

1. Read the AppSignal alert → see `ArgumentError: invalid date`
2. Query the DB → find the bad `publishedAt` value
3. Reproduce with Playwright → confirm 500
4. Fix: add `rescue ArgumentError` around `Time.iso8601` in `server_json_files`
5. Push to staging → deploy
6. Test with Playwright → **still 500** (different error!)
7. Read the new AppSignal error → see `NoMethodError: undefined method 'split' for 12345:Integer`
8. Query the DB → find `name` is an integer, not a string
9. Fix: add type guard in `server_json_maintainer_info`
10. Push to staging → deploy
11. Test with Playwright → page loads correctly
12. Open PR for merge

## Step 8: Restore after demo

```ruby
mirror = McpServersOfficialMirror.find(MIRROR_ID)
mirror.update_column(:jsonb_data, ORIGINAL_DATA_JSON_YOU_SAVED)
Rails.cache.clear
```

Then close/revert the PR branch.

## Timing Notes

- The whole agent run should take roughly 10-15 minutes depending on staging deploy speed
- Each staging deploy takes ~2 minutes
- If you want to speed up the demo, you can pre-stage the branch with the first fix already committed, then have the agent "discover" the second bug live
