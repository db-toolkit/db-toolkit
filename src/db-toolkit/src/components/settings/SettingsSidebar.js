/**
 * Settings Sidebar Navigation
 */
import { Palette, Code, Settings as SettingsIcon, Database, Layout, BarChart3 } from 'lucide-react';

const tabs = [
  { id: 'appearance', label: 'Appearance', icon: Palette },
  { id: 'query', label: 'Query', icon: Code },
  { id: 'editor', label: 'Editor', icon: SettingsIcon },
  { id: 'connection', label: 'Connection', icon: Database },
  { id: 'workspace', label: 'Workspace', icon: Layout },
  { id: 'telemetry', label: 'Telemetry', icon: BarChart3 },
];

export function SettingsSidebar({ activeTab, onTabChange }) {
  return (
    <div className="w-48 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 p-4">
      <nav className="space-y-1">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                isActive
                  ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              <Icon size={16} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}
