/**
 * Settings modal with tabbed interface
 */
import { useState } from 'react';
import { X, RotateCcw, Palette, Code, Settings as SettingsIcon, Database, Layout, BarChart3 } from 'lucide-react';
import { useSettings } from '../../hooks/system/useSettings';
import { useToast } from '../../contexts/ToastContext';
import { Button } from '../common/Button';
import { AppearanceSettings } from './AppearanceSettings';
import { QuerySettings } from './QuerySettings';
import ConfirmDialog from '../common/ConfirmDialog';
import { useConfirmDialog } from '../../hooks/common/useConfirmDialog';
import { EditorSettings } from './EditorSettings';
import { ConnectionSettings } from './ConnectionSettings';
import { WorkspaceSettings } from './WorkspaceSettings';
import { TelemetrySettings } from './TelemetrySettings';

const tabs = [
  { id: 'appearance', label: 'Appearance', icon: Palette },
  { id: 'query', label: 'Query', icon: Code },
  { id: 'editor', label: 'Editor', icon: SettingsIcon },
  { id: 'connection', label: 'Connection', icon: Database },
  { id: 'workspace', label: 'Workspace', icon: Layout },
  { id: 'telemetry', label: 'Telemetry', icon: BarChart3 }
];

export function SettingsModal({ isOpen, onClose }) {
  const [activeTab, setActiveTab] = useState('appearance');
  const { settings, updateSettings, resetSettings } = useSettings();
  const toast = useToast();
  const { dialog, showConfirm, closeDialog } = useConfirmDialog();
  const [localSettings, setLocalSettings] = useState(null);

  if (!isOpen) return null;

  if (!localSettings && settings) {
    setLocalSettings(settings);
  }

  const handleChange = (key, value) => {
    setLocalSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    try {
      await updateSettings(localSettings);
      toast.success('Settings saved');
      onClose();
    } catch (err) {
      toast.error('Failed to save settings');
    }
  };

  const handleReset = async () => {
    const confirmed = await showConfirm({
      title: 'Reset Settings',
      message: 'Reset all settings to defaults?',
      confirmText: 'Reset'
    });
    if (confirmed) {
      try {
        const defaults = await resetSettings();
        setLocalSettings(defaults);
        toast.success('Settings reset');
      } catch (err) {
        toast.error('Failed to reset settings');
      }
    }
  };

  if (!localSettings) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-[9999] p-4" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">Settings</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <X size={24} />
          </button>
        </div>

        {/* Tab Bar */}
        <div className="flex border-b border-gray-200 dark:border-gray-700 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-medium whitespace-nowrap transition-colors ${
                activeTab === tab.id
                  ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
              }`}
            >
              <tab.icon size={16} />
              {tab.label}
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === 'appearance' && (
            <AppearanceSettings settings={localSettings} onChange={handleChange} />
          )}
          {activeTab === 'query' && (
            <QuerySettings settings={localSettings} onChange={handleChange} />
          )}
          {activeTab === 'editor' && (
            <EditorSettings settings={localSettings} onChange={handleChange} />
          )}
          {activeTab === 'connection' && (
            <ConnectionSettings settings={localSettings} onChange={handleChange} />
          )}
          {activeTab === 'workspace' && (
            <WorkspaceSettings settings={localSettings} onChange={handleChange} />
          )}
          {activeTab === 'telemetry' && (
            <TelemetrySettings settings={localSettings} onChange={handleChange} />
          )}
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-2 px-4 sm:px-6 py-4 border-t border-gray-200 dark:border-gray-700">
          <Button variant="secondary" size="sm" icon={<RotateCcw size={16} />} onClick={handleReset}>
            <span className="hidden sm:inline">Reset to Defaults</span>
            <span className="sm:hidden">Reset</span>
          </Button>
          <Button onClick={handleSave}>
            Save Changes
          </Button>
        </div>

        <ConfirmDialog
          isOpen={dialog.isOpen}
          onClose={closeDialog}
          onConfirm={dialog.onConfirm}
          title={dialog.title}
          message={dialog.message}
          confirmText={dialog.confirmText}
          cancelText={dialog.cancelText}
          variant={dialog.variant}
        />
      </div>
    </div>
  );
}
