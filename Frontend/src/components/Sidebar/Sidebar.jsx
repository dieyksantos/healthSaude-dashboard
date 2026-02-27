import "./Sidebar.css";

const NAV_ITEMS = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" />
        <rect x="14" y="14" width="7" height="7" rx="1" />
      </svg>
    ),
  },
  {
    id: "records",
    label: "Registros",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2" />
        <rect x="9" y="3" width="6" height="4" rx="1" />
        <line x1="9" y1="12" x2="15" y2="12" />
        <line x1="9" y1="16" x2="12" y2="16" />
      </svg>
    ),
  },
];

export function Sidebar({ activePage, onNavigate, onNewRecord }) {
  return (
    <aside className="sidebar">
      <div className="sidebar__logo">
        Health<span>Track</span>
      </div>

      {NAV_ITEMS.map((item) => (
        <button
          key={item.id}
          className={`sidebar__nav-item ${activePage === item.id ? "active" : ""}`}
          onClick={() => onNavigate(item.id)}
        >
          {item.icon}
          <span className="sidebar__nav-label">{item.label}</span>
        </button>
      ))}

      <button className="sidebar__nav-item" onClick={onNewRecord}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="16" />
          <line x1="8" y1="12" x2="16" y2="12" />
        </svg>
        <span className="sidebar__nav-label">Novo Registro</span>
      </button>
    </aside>
  );
}
