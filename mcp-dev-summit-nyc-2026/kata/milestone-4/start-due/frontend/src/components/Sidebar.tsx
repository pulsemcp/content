import './Sidebar.css';

interface SidebarProps {
  onCreateClick: () => void;
}

export default function Sidebar({ onCreateClick }: SidebarProps) {
  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="sidebar-brand">
          <div className="brand-badge">TM</div>
          <span className="brand-name">Transparent...</span>
          <span className="brand-caret">&#8964;</span>
        </div>
        <div className="sidebar-header-actions">
          <button className="sidebar-icon-btn" title="Search">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
          </button>
          <button className="sidebar-icon-btn" title="Create" onClick={onCreateClick}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
          </button>
        </div>
      </div>

      <nav className="sidebar-nav">
        <div className="nav-item">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
          <span>Inbox</span>
          <span className="nav-badge">6</span>
        </div>
        <div className="nav-item">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 8v4l2 2"/></svg>
          <span>My issues</span>
        </div>

        <div className="nav-section-header">
          <span>Workspace</span>
          <span className="section-caret">&#9662;</span>
        </div>
        <div className="nav-item sub">
          <span>Initiatives</span>
        </div>
        <div className="nav-item sub">
          <span>Projects</span>
        </div>
        <div className="nav-item sub">
          <span>Views</span>
        </div>
        <div className="nav-item sub muted">
          <span className="dots">&#183;&#183;&#183;</span>
          <span>More</span>
        </div>

        <div className="nav-section-header">
          <span>Favorites</span>
          <span className="section-caret">&#9662;</span>
        </div>
        <div className="nav-item sub">
          <span className="fav-icon diamond red">&#9670;</span>
          <span>Tadas's Issues</span>
        </div>
        <div className="nav-item sub">
          <span className="fav-icon diamond blue">&#9670;</span>
          <span>Ready To Assign</span>
        </div>
        <div className="nav-item sub">
          <span className="fav-icon diamond pink">&#9670;</span>
          <span>Non-ideas - Unassig...</span>
        </div>
        <div className="nav-item sub">
          <span className="fav-icon dot green">&#8226;</span>
          <span>Ideas</span>
        </div>
        <div className="nav-item sub">
          <span className="fav-icon avatar-sm">M</span>
          <span>Mike's Issues</span>
        </div>

        <div className="nav-section-header">
          <span>Your teams</span>
          <span className="section-caret">&#9662;</span>
        </div>
        <div className="nav-item sub">
          <span className="team-icon pulse">&#9632;</span>
          <span>Pulse</span>
          <span className="lock-icon">&#128274;</span>
          <span className="section-caret">&#9662;</span>
        </div>
        <div className="nav-item sub">
          <span className="team-icon sandbox">&#9632;</span>
          <span>Sandbox</span>
          <span className="section-caret">&#9662;</span>
        </div>
        <div className="nav-item sub active">
          <span>Issues</span>
        </div>
        <div className="nav-item sub">
          <span>Projects</span>
        </div>
        <div className="nav-item sub">
          <span>Views</span>
        </div>

        <div className="nav-section-header">
          <span>Try</span>
          <span className="section-caret">&#9662;</span>
        </div>
        <div className="nav-item sub">
          <span>Cycles</span>
        </div>
      </nav>
    </aside>
  );
}
