import { useState } from 'react';
import { Issue } from '../types';
import './IssueDetail.css';

interface IssueDetailProps {
  issue: Issue;
  onBack: () => void;
  onUpdate: (id: number, data: Partial<Issue>) => void;
  onDelete: (id: number) => void;
}

const STATUS_OPTIONS: { value: Issue['status']; label: string }[] = [
  { value: 'backlog', label: 'Backlog' },
  { value: 'todo', label: 'Todo' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'done', label: 'Done' },
  { value: 'cancelled', label: 'Cancelled' },
];

const PRIORITY_OPTIONS: { value: Issue['priority']; label: string }[] = [
  { value: 'none', label: 'No priority' },
  { value: 'urgent', label: 'Urgent' },
  { value: 'high', label: 'High' },
  { value: 'medium', label: 'Medium' },
  { value: 'low', label: 'Low' },
];

function StatusIcon({ status }: { status: Issue['status'] }) {
  const colors: Record<string, string> = {
    backlog: 'var(--status-backlog)',
    todo: 'var(--status-todo)',
    in_progress: 'var(--status-in-progress)',
    done: 'var(--status-done)',
    cancelled: 'var(--status-cancelled)',
  };
  const color = colors[status];
  return (
    <svg width="14" height="14" viewBox="0 0 14 14">
      <circle cx="7" cy="7" r="6" fill="none" stroke={color} strokeWidth="1.5"
        strokeDasharray={status === 'backlog' ? '2.5 2.5' : 'none'} />
    </svg>
  );
}

function PriorityIcon({ priority }: { priority: Issue['priority'] }) {
  if (priority === 'urgent') {
    return (
      <svg width="16" height="16" viewBox="0 0 16 16">
        <rect x="1" y="1" width="14" height="14" rx="3" fill="var(--priority-urgent)" />
        <text x="8" y="12" textAnchor="middle" fill="white" fontSize="11" fontWeight="bold">!</text>
      </svg>
    );
  }
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="var(--text-muted)">
      <circle cx="4" cy="8" r="1" />
      <circle cx="8" cy="8" r="1" />
      <circle cx="12" cy="8" r="1" />
    </svg>
  );
}

function parseDateOnly(dueDateStr: string): Date {
  return new Date(dueDateStr.substring(0, 10) + 'T00:00:00');
}

function isDueDateOverdue(dueDateStr: string | null): boolean {
  if (!dueDateStr) return false;
  return parseDateOnly(dueDateStr) < new Date(new Date().toDateString());
}

function formatTimeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}min ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export default function IssueDetail({ issue, onBack, onUpdate, onDelete }: IssueDetailProps) {
  const [editingTitle, setEditingTitle] = useState(false);
  const [titleValue, setTitleValue] = useState(issue.title);
  const [editingDescription, setEditingDescription] = useState(false);
  const [descValue, setDescValue] = useState(issue.description || '');
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [showPriorityDropdown, setShowPriorityDropdown] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleTitleSave = () => {
    if (titleValue.trim() && titleValue !== issue.title) {
      onUpdate(issue.id, { title: titleValue.trim() });
    }
    setEditingTitle(false);
  };

  const handleDescSave = () => {
    if (descValue !== issue.description) {
      onUpdate(issue.id, { description: descValue });
    }
    setEditingDescription(false);
  };

  return (
    <div className="issue-detail">
      <div className="detail-header-bar">
        <div className="detail-header-left">
          <button className="back-btn" onClick={onBack}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6"/></svg>
          </button>
          <span className="detail-identifier">{issue.identifier}</span>
          <span className="detail-header-title">{issue.title}</span>
        </div>
        <div className="detail-header-right">
          <button className="header-action-btn" title="Favorite">&#9734;</button>
          <button className="header-action-btn" title="More" onClick={() => setShowDeleteConfirm(!showDeleteConfirm)}>&#183;&#183;&#183;</button>
          {showDeleteConfirm && (
            <div className="delete-dropdown">
              <button className="delete-btn" onClick={() => onDelete(issue.id)}>Delete issue</button>
            </div>
          )}
        </div>
      </div>

      <div className="detail-body">
        <div className="detail-content">
          <div className="content-inner">
            {editingTitle ? (
              <input
                className="title-input"
                value={titleValue}
                onChange={e => setTitleValue(e.target.value)}
                onBlur={handleTitleSave}
                onKeyDown={e => e.key === 'Enter' && handleTitleSave()}
                autoFocus
              />
            ) : (
              <h1 className="detail-title" onClick={() => setEditingTitle(true)}>
                {issue.title}
              </h1>
            )}

            {editingDescription ? (
              <textarea
                className="description-input"
                value={descValue}
                onChange={e => setDescValue(e.target.value)}
                onBlur={handleDescSave}
                placeholder="Add description..."
                autoFocus
              />
            ) : (
              <p
                className="detail-description"
                onClick={() => { setDescValue(issue.description || ''); setEditingDescription(true); }}
              >
                {issue.description || 'Add description...'}
              </p>
            )}

            <div className="detail-actions-row">
              <span className="action-icon">&#128512;</span>
              <span className="action-icon">&#128206;</span>
            </div>

            <div className="sub-issues-link">+ Add sub-issues</div>

            <div className="divider" />

            <div className="activity-header">
              <h3>Activity</h3>
              <div className="activity-header-right">
                <span className="unsubscribe-text">Unsubscribe</span>
                <div className="activity-avatar">
                  {(issue.assignee || 'TA').substring(0, 2).toUpperCase()}
                </div>
              </div>
            </div>

            <div className="activity-entry">
              <div className="activity-avatar small">TA</div>
              <span className="activity-user">tadas</span>
              <span className="activity-action">created the issue</span>
              <span className="activity-dot">&#183;</span>
              <span className="activity-time">{formatTimeAgo(issue.created_at)}</span>
            </div>

            <div className="comment-box">
              <input className="comment-input" placeholder="Leave a comment..." readOnly />
              <div className="comment-actions">
                <span className="comment-icon">&#128206;</span>
                <span className="comment-icon send">&#8593;</span>
              </div>
            </div>
          </div>
        </div>

        <div className="detail-separator" />

        <div className="detail-properties">
          <div className="properties-toolbar">
            <span className="prop-toolbar-icon">&#128279;</span>
            <span className="prop-toolbar-icon">&#128512;</span>
            <span className="prop-toolbar-icon">&#127937;</span>
            <span className="prop-toolbar-caret">&#8964;</span>
          </div>

          <div className="properties-section">
            <div className="properties-section-header">
              <span>Properties</span>
              <span className="section-caret">&#9662;</span>
            </div>

            <div className="property-row">
              <div className="property-row-trigger" onClick={() => setShowStatusDropdown(!showStatusDropdown)}>
                <StatusIcon status={issue.status} />
                <span className="property-value">{STATUS_OPTIONS.find(s => s.value === issue.status)?.label}</span>
              </div>
              {showStatusDropdown && (
                <div className="property-dropdown">
                  {STATUS_OPTIONS.map(opt => (
                    <button
                      key={opt.value}
                      className={`dropdown-item ${issue.status === opt.value ? 'active' : ''}`}
                      onClick={() => { setShowStatusDropdown(false); onUpdate(issue.id, { status: opt.value }); }}
                    >
                      <StatusIcon status={opt.value} />
                      {opt.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="property-row">
              <div className="property-row-trigger" onClick={() => setShowPriorityDropdown(!showPriorityDropdown)}>
                <PriorityIcon priority={issue.priority} />
                <span className="property-value">{PRIORITY_OPTIONS.find(p => p.value === issue.priority)?.label}</span>
              </div>
              {showPriorityDropdown && (
                <div className="property-dropdown">
                  {PRIORITY_OPTIONS.map(opt => (
                    <button
                      key={opt.value}
                      className={`dropdown-item ${issue.priority === opt.value ? 'active' : ''}`}
                      onClick={() => { setShowPriorityDropdown(false); onUpdate(issue.id, { priority: opt.value }); }}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="property-row">
              <span className="property-add-icon">&#8853;</span>
              <span className="property-value muted">Assign</span>
            </div>

            <div className="property-row due-date-property">
              <label className="property-row-trigger">
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke={isDueDateOverdue(issue.due_date) ? 'var(--accent-red)' : 'currentColor'} strokeWidth="1.5">
                  <rect x="2" y="3" width="12" height="11" rx="2" />
                  <line x1="2" y1="6" x2="14" y2="6" />
                  <line x1="5" y1="1" x2="5" y2="4" />
                  <line x1="11" y1="1" x2="11" y2="4" />
                </svg>
                <span className={`property-value ${issue.due_date ? '' : 'muted'} ${isDueDateOverdue(issue.due_date) ? 'overdue' : ''}`}>
                  {issue.due_date
                    ? parseDateOnly(issue.due_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                    : 'Set due date'}
                </span>
                <input
                  type="date"
                  className="property-date-input"
                  value={issue.due_date ? issue.due_date.substring(0, 10) : ''}
                  onChange={e => onUpdate(issue.id, { due_date: e.target.value || null } as any)}
                />
              </label>
              {issue.due_date && (
                <button className="clear-due-date" onClick={() => onUpdate(issue.id, { due_date: null } as any)} title="Clear due date">&#10005;</button>
              )}
            </div>
          </div>

          <div className="property-divider" />

          <div className="properties-section">
            <div className="properties-section-header">
              <span>Labels</span>
              <span className="section-caret">&#9662;</span>
            </div>
            <div className="property-row">
              <span className="property-add-icon">&#8853;</span>
              <span className="property-value muted">Add label</span>
            </div>
          </div>

          <div className="property-divider" />

          <div className="properties-section">
            <div className="properties-section-header">
              <span>Project</span>
              <span className="section-caret">&#9662;</span>
            </div>
            <div className="property-row">
              <span className="property-add-icon">&#8853;</span>
              <span className="property-value muted">Add to project</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
