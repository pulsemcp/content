# Add Assignee Field to Issues

## Summary

We need to track who's working on each issue. Add a simple assignee field — just a text name, no user accounts or auth needed.

## Requirements

- Add an `assignee` text field to the issue data model
- Show the assignee name in the **issue list** (in the row, after the title or in the meta area)
- Show the assignee in the **issue detail** modal
- Allow setting the assignee when **creating** a new issue
- Allow **changing** the assignee when editing an existing issue
- If no assignee is set, don't show anything (no "Unassigned" placeholder needed)

## Design Notes

Keep it minimal — reuse the existing form field styling (same as title/description). A simple text input is fine; no dropdown or user picker needed.

## Acceptance Criteria

1. I can create an issue with an assignee (e.g., "Alice") and see the name in the issue list
2. I can click an issue, open the detail view, and see the assignee displayed
3. I can open an issue's detail view, click Edit, change the assignee to someone else (e.g., "Bob"), save, and see the updated name persist when I reopen the issue
4. Existing issues without an assignee still display correctly (no broken UI)
