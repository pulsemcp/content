import { Issue, CreateIssuePayload, UpdateIssuePayload } from './types';

const BASE = '/api';

export async function fetchIssues(): Promise<Issue[]> {
  const res = await fetch(`${BASE}/issues`);
  if (!res.ok) throw new Error('Failed to fetch issues');
  return res.json();
}

export async function fetchIssue(id: number): Promise<Issue> {
  const res = await fetch(`${BASE}/issues/${id}`);
  if (!res.ok) throw new Error('Failed to fetch issue');
  return res.json();
}

export async function createIssue(data: CreateIssuePayload): Promise<Issue> {
  const res = await fetch(`${BASE}/issues`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to create issue');
  return res.json();
}

export async function updateIssue(id: number, data: UpdateIssuePayload): Promise<Issue> {
  const res = await fetch(`${BASE}/issues/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to update issue');
  return res.json();
}

export async function deleteIssue(id: number): Promise<void> {
  const res = await fetch(`${BASE}/issues/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Failed to delete issue');
}
