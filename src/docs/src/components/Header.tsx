export default function Header() {
  return (
    <header className="header">
      <div className="header-content">
        <div className="logo">
          <span className="icon">🗄️</span>
          <span className="title">DB Toolkit Docs</span>
        </div>
        <div className="header-links">
          <a href="https://db-toolkit.vercel.app" target="_blank" rel="noopener noreferrer">
            Home
          </a>
          <a href="https://github.com/Adelodunpeter25/db-toolkit" target="_blank" rel="noopener noreferrer">
            GitHub
          </a>
        </div>
      </div>
    </header>
  );
}
