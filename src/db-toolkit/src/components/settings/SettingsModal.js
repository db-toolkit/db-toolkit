/**
 * Settings modal with tabbed interface
 */
import { useState } from 'react';
import { X, RotateCcw } from 'lucide-react';
import { useSettings } from '../../hooks/useSettings';
import { useToast } from '../../contexts/ToastContext';
import { Button } from '../common/Button';
import { SettingsSidebar } from './SettingsSidebar';
import { AppearanceSettings } from './AppearanceSettings';
import { QuerySettings } from './QuerySettings';
import { EditorSettings } from './EditorSettings';
import { ConnectionSettings } from './ConnectionSettings';
import { WorkspaceSettings } from './WorkspaceSettings';
import { TelemetrySettings } from './TelemetrySettings';



export function SettingsModal({ isOpen, onClose }) {
  const [activeTab, setActiveTab] = useState('appearance');
  const { settings, updateSettings, resetSettings } = useSettings();
  const toast = useToast();
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
    if (window.confirm('Reset all settings to defaults?')) {
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
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">Settings</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <X size={24} />
          </button>
        </div>

        <div className="flex flex-1 overflow-hidden">
          <SettingsSidebar activeTab={activeTab} onTabChange={setActiveTab} />

          <div className="flex-1 overflow-y-auto p-4 sm:p-6">
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
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-2 px-4 sm:px-6 py-4 border-t border-gray-200 dark:border-gray-700">
          <Button variant="secondary" size="sm" icon={<RotateCcw size={16} />} onClick={handleReset}>
            <span className="hidden sm:inline">Reset to Defaults</span>
            <span className="sm:hidden">Reset</span>
          </Button>
          <div className="flex gap-2">
            <Button variant="secondary" onClick={onClose} className="flex-1 sm:flex-none">
              Cancel
            </Button>
            <Button onClick={handleSave} className="flex-1 sm:flex-none">
              Save Changes
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
