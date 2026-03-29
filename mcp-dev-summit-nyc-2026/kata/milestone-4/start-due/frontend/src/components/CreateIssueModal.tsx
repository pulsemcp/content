import { useState } from 'react';
import './CreateIssueModal.css';

interface CreateIssueModalProps {
  onClose: () => void;
  onCreate: (data: { title: string; description?: string; status?: string; priority?: string }) => void;
}

export default function CreateIssueModal({ onClose, onCreate }: CreateIssueModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('backlog');
  const [priority, setPriority] = useState('none');
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [showPriorityDropdown, setShowPriorityDropdown] = useState(false);

  const handleSubmit = () => {
    if (!title.trim()) return;
    onCreate({
      title: title.trim(),
      description: description.trim() || undefined,
      status,
      priority,
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') onClose();
  };

  const statusLabels: Record<string, string> = {
    backlog: 'Backlog',
    todo: 'Todo',
    in_progress: 'In Progress',
    done: 'Done',
    cancelled: 'Cancelled',
  };

  const priorityLabels: Record<string, string> = {
    none: 'Priority',
    urgent: 'Urgent',
    high: 'High',
    medium: 'Medium',
    low: 'Low',
  };

  return (
    <div className="modal-overlay" onClick={onClose} onKeyDown={handleKeyDown}>
      <div className="modal-container" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-header-left">
            <div className="modal-badge">TM</div>
            <span className="modal-chevron">&#8250;</span>
            <span className="modal-header-title">New issue</span>
          </div>
          <div className="modal-header-right">
            <button className="modal-action-btn">&#10530;</button>
            <button className="modal-action-btn" onClick={onClose}>&#10005;</button>
          </div>
        </div>

        <div className="modal-body">
          <input
            className="modal-title-input"
            placeholder="Issue title"
            value={title}
            onChange={e => setTitle(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter') handleSubmit();
              if (e.key === 'Escape') onClose();
            }}
            autoFocus
          />
          <textarea
            className="modal-description-input"
            placeholder="Add description..."
            value={description}
            onChange={e => setDescription(e.target.value)}
          />
        </div>

        <div className="modal-properties">
          <div className="modal-pill-row">
            <div className="modal-pill" onClick={() => setShowStatusDropdown(!showStatusDropdown)}>
              <svg width="12" height="12" viewBox="0 0 14 14">
                <circle cx="7" cy="7" r="6" fill="none" stroke="var(--status-backlog)" strokeWidth="1.5" strokeDasharray="2.5 2.5" />
              </svg>
              <span>{statusLabels[status]}</span>
              {showStatusDropdown && (
                <div className="pill-dropdown" onClick={e => e.stopPropagation()}>
                  {Object.entries(statusLabels).map(([val, label]) => (
                    <button key={val} className="dropdown-item" onClick={() => { setStatus(val); setShowStatusDropdown(false); }}>
                      {label}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <div className="modal-pill" onClick={() => setShowPriorityDropdown(!showPriorityDropdown)}>
              <span className="pill-dots">&#183;&#183;&#183;</span>
              <span>{priorityLabels[priority]}</span>
              {showPriorityDropdown && (
                <div className="pill-dropdown" onClick={e => e.stopPropagation()}>
                  {Object.entries(priorityLabels).map(([val, label]) => (
                    <button key={val} className="dropdown-item" onClick={() => { setPriority(val); setShowPriorityDropdown(false); }}>
                      {label}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <div className="modal-pill disabled">
              <span>&#128100;</span>
              <span>Assignee</span>
            </div>
            <div className="modal-pill disabled">
              <span>&#8857;</span>
              <span>Project</span>
            </div>
            <div className="modal-pill disabled">
              <span>&#8862;</span>
              <span>Labels</span>
            </div>
            <span className="pill-more">&#183;&#183;&#183;</span>
          </div>
        </div>

        <div className="modal-footer">
          <span className="footer-attachment">&#128206;</span>
          <div className="footer-right">
            <label className="create-more-toggle">
              <div className="toggle-track">
                <div className="toggle-dot" />
              </div>
              <span>Create more</span>
            </label>
            <button
              className="create-btn"
              onClick={handleSubmit}
              disabled={!title.trim()}
            >
              Create issue
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
