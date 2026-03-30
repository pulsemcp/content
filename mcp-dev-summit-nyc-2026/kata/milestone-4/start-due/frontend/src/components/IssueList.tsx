import { Issue } from '../types';
import './IssueList.css';

interface IssueListProps {
  issues: Issue[];
  loading: boolean;
  onSelectIssue: (issue: Issue) => void;
  onCreateClick: () => void;
}

const STATUS_ORDER: Issue['status'][] = ['in_progress', 'todo', 'backlog', 'done', 'cancelled'];

const STATUS_LABELS: Record<Issue['status'], string> = {
  backlog: 'Backlog',
  todo: 'Todo',
  in_progress: 'In Progress',
  done: 'Done',
  cancelled: 'Cancelled',
};

function StatusIcon({ status }: { status: Issue['status'] }) {
  const colors: Record<string, string> = {
    backlog: 'var(--status-backlog)',
    todo: 'var(--status-todo)',
    in_progress: 'var(--status-in-progress)',
    done: 'var(--status-done)',
    cancelled: 'var(--status-cancelled)',
  };
  const color = colors[status] || 'var(--text-muted)';

  if (status === 'done') {
    return (
      <svg width="14" height="14" viewBox="0 0 14 14">
        <circle cx="7" cy="7" r="6" fill="none" stroke={color} strokeWidth="1.5" />
        <path d="M4 7l2 2 4-4" fill="none" stroke={color} strokeWidth="1.5" />
      </svg>
    );
  }

  if (status === 'in_progress') {
    return (
      <svg width="14" height="14" viewBox="0 0 14 14">
        <circle cx="7" cy="7" r="6" fill="none" stroke={color} strokeWidth="1.5" />
        <path d="M7 1a6 6 0 0 1 0 12" fill={color} />
      </svg>
    );
  }

  return (
    <svg width="14" height="14" viewBox="0 0 14 14">
      <circle cx="7" cy="7" r="6" fill="none" stroke={color} strokeWidth="1.5" strokeDasharray={status === 'backlog' ? '2.5 2.5' : 'none'} />
    </svg>
  );
}

function PriorityIcon({ priority }: { priority: Issue['priority'] }) {
  if (priority === 'urgent') {
    return (
      <div className="priority-icon urgent" title="Urgent">
        <svg width="14" height="14" viewBox="0 0 14 14">
          <rect x="1" y="1" width="12" height="12" rx="2" fill="var(--priority-urgent)" />
          <text x="7" y="10.5" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold">!</text>
        </svg>
      </div>
    );
  }
  if (priority === 'high') {
    return (
      <div className="priority-icon high" title="High">
        <svg width="14" height="14" viewBox="0 0 14 14" fill="var(--text-muted)">
          <rect x="1" y="8" width="3" height="5" rx="0.5" fill="var(--priority-high)" />
          <rect x="5.5" y="4" width="3" height="9" rx="0.5" fill="var(--priority-high)" />
          <rect x="10" y="1" width="3" height="12" rx="0.5" fill="var(--priority-high)" />
        </svg>
      </div>
    );
  }
  if (priority === 'medium') {
    return (
      <div className="priority-icon medium" title="Medium">
        <svg width="14" height="14" viewBox="0 0 14 14">
          <rect x="1" y="8" width="3" height="5" rx="0.5" fill="var(--priority-medium)" />
          <rect x="5.5" y="4" width="3" height="9" rx="0.5" fill="var(--priority-medium)" />
          <rect x="10" y="1" width="3" height="12" rx="0.5" fill="var(--text-muted)" opacity="0.3" />
        </svg>
      </div>
    );
  }
  if (priority === 'low') {
    return (
      <div className="priority-icon low" title="Low">
        <svg width="14" height="14" viewBox="0 0 14 14">
          <rect x="1" y="8" width="3" height="5" rx="0.5" fill="var(--priority-low)" />
          <rect x="5.5" y="4" width="3" height="9" rx="0.5" fill="var(--text-muted)" opacity="0.3" />
          <rect x="10" y="1" width="3" height="12" rx="0.5" fill="var(--text-muted)" opacity="0.3" />
        </svg>
      </div>
    );
  }
  return (
    <div className="priority-icon none" title="No priority">
      <svg width="14" height="14" viewBox="0 0 14 14" fill="var(--text-muted)">
        <circle cx="3" cy="7" r="1" />
        <circle cx="7" cy="7" r="1" />
        <circle cx="11" cy="7" r="1" />
      </svg>
    </div>
  );
}

function AssigneeAvatar({ assignee }: { assignee: string | null }) {
  if (!assignee) {
    return (
      <div className="assignee-avatar unassigned" title="Unassigned">
        <svg width="16" height="16" viewBox="0 0 16 16">
          <circle cx="8" cy="8" r="7" fill="none" stroke="var(--text-muted)" strokeWidth="1" strokeDasharray="2 2" />
        </svg>
      </div>
    );
  }
  return (
    <div className="assignee-avatar assigned" title={assignee}>
      {assignee.substring(0, 2).toUpperCase()}
    </div>
  );
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${months[d.getMonth()]} ${d.getDate()}`;
}

function parseDateOnly(dueDateStr: string): Date {
  const dateOnly = dueDateStr.substring(0, 10);
  return new Date(dateOnly + 'T00:00:00');
}

function isOverdue(dueDateStr: string | null): boolean {
  if (!dueDateStr) return false;
  const dueDate = parseDateOnly(dueDateStr);
  const today = new Date(new Date().toDateString());
  return dueDate < today;
}

function formatDueDate(dueDateStr: string): string {
  const d = parseDateOnly(dueDateStr);
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${months[d.getMonth()]} ${d.getDate()}`;
}

export default function IssueList({ issues, loading, onSelectIssue, onCreateClick }: IssueListProps) {
  const grouped = STATUS_ORDER.reduce((acc, status) => {
    const statusIssues = issues.filter(i => i.status === status);
    if (statusIssues.length > 0) {
      acc.push({ status, issues: statusIssues });
    }
    return acc;
  }, [] as { status: Issue['status']; issues: Issue[] }[]);

  return (
    <div className="issue-list-container">
      <div className="issue-list-header">
        <div className="header-left">
          <div className="team-icon-header">
            <svg width="14" height="14" viewBox="0 0 14 14">
              <rect width="14" height="14" rx="3" fill="var(--accent-green)" />
            </svg>
          </div>
          <span className="team-name">Sandbox</span>
        </div>
        <div className="header-right">
          <span className="notification-icon">&#128276;</span>
        </div>
      </div>

      <div className="issue-list-tabs">
        <button className="tab active">All issues</button>
        <button className="tab">Active</button>
        <button className="tab">Backlog</button>
        <button className="tab tab-settings">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
        </button>
        <div className="tab-spacer" />
        <div className="view-toggles">
          <button className="view-btn" title="Grouping">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>
          </button>
          <button className="view-btn" title="List">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
          </button>
          <button className="view-btn" title="Board">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>
          </button>
        </div>
      </div>

      <div className="issue-list-body">
        {loading ? (
          <div className="loading">Loading issues...</div>
        ) : (
          grouped.map(group => (
            <div key={group.status} className="issue-group">
              <div className="group-header">
                <span className="group-caret">&#8964;</span>
                <StatusIcon status={group.status} />
                <span className="group-label">{STATUS_LABELS[group.status]}</span>
                <span className="group-count">{group.issues.length}</span>
                <button className="group-add" onClick={onCreateClick}>+</button>
              </div>
              {group.issues.map(issue => (
                <div
                  key={issue.id}
                  className="issue-row"
                  onClick={() => onSelectIssue(issue)}
                >
                  <div className="issue-row-left">
                    <PriorityIcon priority={issue.priority} />
                    <span className="issue-identifier">{issue.identifier}</span>
                    <StatusIcon status={issue.status} />
                    <span className="issue-title">{issue.title}</span>
                  </div>
                  <div className="issue-row-right">
                    {issue.due_date && (
                      <span className={`issue-due-date ${isOverdue(issue.due_date) ? 'overdue' : ''}`} title={`Due: ${issue.due_date}`}>
                        <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
                          <rect x="2" y="3" width="12" height="11" rx="2" />
                          <line x1="2" y1="6" x2="14" y2="6" />
                          <line x1="5" y1="1" x2="5" y2="4" />
                          <line x1="11" y1="1" x2="11" y2="4" />
                        </svg>
                        {formatDueDate(issue.due_date)}
                      </span>
                    )}
                    <AssigneeAvatar assignee={issue.assignee} />
                    <span className="issue-date">{formatDate(issue.created_at)}</span>
                  </div>
                </div>
              ))}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
