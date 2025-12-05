import { Link, useLocation } from 'react-router-dom';
import { Database, Home, Table, HardDrive, BookOpen, FolderGit2, BarChart3, Code } from 'lucide-react';

function Sidebar() {
  const location = useLocation();

  const navItems = [
    { path: '/', icon: Home, label: 'Overview' },
    { path: '/connections', icon: Database, label: 'Connections' },
    { path: '/query-editor', icon: Code, label: 'Query Editor' },
    { path: '/data-explorer', icon: Table, label: 'Data Explorer' },
    { path: '/analytics', icon: BarChart3, label: 'Analytics' },
    { path: '/migrations', icon: FolderGit2, label: 'Migrations' },
    { path: '/backups', icon: HardDrive, label: 'Backups' },
    { path: '/docs', icon: BookOpen, label: 'Documentation' },
  ];

  const isActive = (path) => {
    const currentPath = location.pathname;
    if (path === '/') {
      return currentPath === '/' || currentPath === '';
    }
    return currentPath.startsWith(path);
  };

  return (
    <aside className="bg-gray-100 dark:bg-gray-950 text-gray-900 dark:text-white h-screen flex flex-col border-r border-gray-200 dark:border-gray-900">
        <div className="p-6 border-b border-gray-200 dark:border-gray-900">
          <div className="flex items-center gap-2">
            <Database size={28} className="text-blue-600 dark:text-blue-500" />
            <h1 className="text-xl font-bold whitespace-nowrap">DB Toolkit</h1>
          </div>
        </div>
        <nav className="flex-1 p-4">
          {navItems.map(({ path, icon: Icon, label }) => (
            <Link
              key={path}
              to={path}
              className={`
                flex items-center gap-3 px-4 py-3 rounded-lg transition
                ${isActive(path)
                  ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                  : 'hover:bg-gray-200 dark:hover:bg-gray-900'
                }
              `}
            >
              <Icon size={20} />
              <span>{label}</span>
            </Link>
          ))}
        </nav>
      </aside>
  );
}

export default Sidebar;
