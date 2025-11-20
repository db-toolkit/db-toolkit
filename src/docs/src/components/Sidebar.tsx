interface SidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

const sections = [
  { id: 'getting-started', label: 'Getting Started' },
  { id: 'connections', label: 'Connections' },
  { id: 'query-editor', label: 'Query Editor' },
  { id: 'schema-explorer', label: 'Schema Explorer' },
  { id: 'data-explorer', label: 'Data Explorer' },
  { id: 'backup-restore', label: 'Backup & Restore' },
  { id: 'settings', label: 'Settings' },
];

export default function Sidebar({ activeSection, onSectionChange }: SidebarProps) {
  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <h2>DB Toolkit</h2>
        <span className="version">v0.3.0</span>
      </div>
      <nav className="sidebar-nav">
        {sections.map((section) => (
          <button
            key={section.id}
            className={`nav-item ${activeSection === section.id ? 'active' : ''}`}
            onClick={() => onSectionChange(section.id)}
          >
            {section.label}
          </button>
        ))}
      </nav>
    </aside>
  );
}
