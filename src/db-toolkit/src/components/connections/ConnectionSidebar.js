/**
 * Sidebar for creating/editing database connections
 */
import { useState, useCallback } from 'react';
import { X } from 'lucide-react';
import { Input } from '../common/Input';
import { Button } from '../common/Button';
import { useSettingsContext } from '../../contexts/SettingsContext';
import { useToast } from '../../contexts/ToastContext';
import { useConnectionForm } from '../../hooks/connections/useConnectionForm';
import { parseConnectionUrl } from '../../utils/connectionParser';
import { ConnectionFormFields } from './ConnectionFormFields';

export function ConnectionSidebar({ isOpen, onClose, onSave, connection }) {
  const { settings } = useSettingsContext();
  const toast = useToast();
  const [useUrl, setUseUrl] = useState(false);
  const [databaseUrl, setDatabaseUrl] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  const {
    formData,
    setFormData,
    hasChanges,
    setHasChanges,
    testing,
    handleChange,
    handleTest,
    handleSubmit,
    handleClose,
  } = useConnectionForm(connection, isOpen, settings, onClose, onSave);

  const handleUrlParse = useCallback((url) => {
    try {
      const parsed = parseConnectionUrl(url);
      setFormData(prev => ({ ...prev, ...parsed }));
      setUseUrl(false);
      toast.success('URL parsed successfully - review and save');
    } catch (err) {
      toast.error(err.message || 'Invalid database URL format');
    }
  }, [setFormData, setUseUrl, toast]);

  const handleDbTypeChange = useCallback((newType) => {
    const defaultPorts = {
      postgresql: 5432,
      mysql: 3306,
      mariadb: 3306,
      mongodb: 27017,
      sqlite: 0
    };
    
    const updated = {
      ...formData,
      db_type: newType,
      port: defaultPorts[newType],
      ...(newType === 'sqlite' && {
        host: '',
        username: '',
        password: ''
      })
    };
    setFormData(updated);
    setHasChanges(true);
    
    if (!connection) {
      localStorage.setItem('connection-draft', JSON.stringify(updated));
    }
  }, [formData, connection, setFormData, setHasChanges]);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 z-40 transition-opacity"
        onClick={handleClose}
      />
      
      {/* Sidebar */}
      <div className="fixed right-0 top-0 h-screen w-[600px] bg-white dark:bg-gray-900 shadow-2xl z-50 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
            {connection ? 'Edit Connection' : 'New Database Connection'}
          </h2>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
          >
            <X size={20} className="text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-6">
          <form onSubmit={handleSubmit} id="connection-form">
            {/* Basic Information */}
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-3 pb-2 border-b border-gray-200 dark:border-gray-700">
                Basic Information
              </h3>
              <Input
                label="Connection Name"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
              />
            </div>

                {/* Database Type */}
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Database Type
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {['postgresql', 'mysql', 'mariadb', 'mongodb', 'sqlite'].map((type) => (
                      <button
                        key={type}
                        type="button"
                        onClick={() => handleDbTypeChange(type)}
                        className={`py-2 px-3 rounded-lg border-2 text-sm font-medium transition-all ${
                          formData.db_type === type
                            ? 'border-green-500 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400'
                            : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 text-gray-700 dark:text-gray-300'
                        }`}
                      >
                        {type === 'mariadb' ? 'MariaDB' : type.charAt(0).toUpperCase() + type.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Connection URL Toggle */}
                {!connection && formData.db_type !== 'sqlite' && (
                  <div className="mb-6">
                    <button
                      type="button"
                      onClick={() => setUseUrl(!useUrl)}
                      className="text-sm text-green-600 dark:text-green-400 hover:underline"
                    >
                      {useUrl ? 'Use form fields' : 'Use connection URL instead'}
                    </button>
                  </div>
                )}

                {/* Connection URL Input */}
                {useUrl && (
                  <div className="mb-6">
                    <Input
                      label="Database URL"
                      value={databaseUrl}
                      onChange={(e) => setDatabaseUrl(e.target.value)}
                      placeholder="postgresql://user:pass@host:5432/dbname"
                    />
                    <Button
                      type="button"
                      onClick={() => handleUrlParse(databaseUrl)}
                      variant="secondary"
                      className="mt-2"
                    >
                      Parse URL
                    </Button>
                  </div>
                )}

                {/* Connection Form Fields */}
                {!useUrl && (
                  <ConnectionFormFields
                    formData={formData}
                    handleChange={handleChange}
                    showPassword={showPassword}
                    setShowPassword={setShowPassword}
                  />
                )}
          </form>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800" style={{ WebkitAppRegion: 'no-drag' }}>
          <Button
            type="button"
            onClick={handleTest}
            variant="secondary"
            disabled={testing}
          >
            {testing ? 'Testing...' : 'Test Connection'}
          </Button>
          <div className="flex gap-3">
            <Button
              type="button"
              onClick={handleClose}
              variant="secondary"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              form="connection-form"
              disabled={!hasChanges}
            >
              {connection ? 'Save Changes' : 'Create Connection'}
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
