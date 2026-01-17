import { useState, useCallback } from 'react';
import { Modal } from '../common/Modal';
import { Input } from '../common/Input';
import { Button } from '../common/Button';
import { useSettingsContext } from '../../contexts/SettingsContext';
import { useToast } from '../../contexts/ToastContext';
import { useConnectionForm } from '../../hooks/useConnectionForm';
import { parseConnectionUrl } from '../../utils/connectionParser';
import { ConnectionFormFields } from './ConnectionFormFields';

export function ConnectionModal({ isOpen, onClose, onSave, connection }) {
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

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title={connection ? 'Edit Connection' : 'New Connection'}>
      <form onSubmit={handleSubmit}>
        {/* Basic Information Section */}
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-3 pb-2 border-b border-gray-200 dark:border-gray-700">
            Basic Information
          </h3>
          <Input
            label="Connection Name"
            value={formData.name}
            onChange={(e) => handleChange('name', e.target.value)}
          />

          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
              Database Type
            </label>
            <select
              value={formData.db_type}
              onChange={(e) => handleDbTypeChange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            >
              <option value="postgresql">PostgreSQL</option>
              <option value="mysql">MySQL</option>
              <option value="sqlite">SQLite</option>
              <option value="mongodb">MongoDB</option>
            </select>
          </div>

          <div className="mb-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={useUrl}
                onChange={(e) => {
                  const checked = e.target.checked;
                  setUseUrl(checked);
                  if (!checked) {
                    setDatabaseUrl('');
                  }
                }}
                className="w-4 h-4 text-green-600 rounded focus:ring-2 focus:ring-green-500"
              />
              <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                Use Database URL
              </span>
            </label>
          </div>
        </div>

        {useUrl ? (
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-3 pb-2 border-b border-gray-200 dark:border-gray-700">
              Database URL
            </h3>
            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                Connection URL
              </label>
              <textarea
                value={databaseUrl}
                onChange={(e) => setDatabaseUrl(e.target.value)}
                onBlur={(e) => {
                  if (e.target.value.trim()) {
                    handleUrlParse(e.target.value);
                  }
                }}
                placeholder="postgresql://user:password@localhost:5432/database"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 font-mono text-sm"
                rows="3"
                required
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Examples:<br/>
                • postgresql://user:pass@host:5432/db<br/>
                • postgresql://user:pass@host:5432/db?sslmode=require<br/>
                • mysql://user:pass@host:3306/db?ssl=true<br/>
                • mongodb://user:pass@host:27017/db?tls=true<br/>
                • sqlite:///path/to/db.sqlite
              </p>
            </div>
          </div>
        ) : (
          <ConnectionFormFields
            formData={formData}
            handleChange={handleChange}
            showPassword={showPassword}
            setShowPassword={setShowPassword}
          />
        )}

        <div className="flex gap-2 justify-between mt-6">
          <Button 
            variant="secondary" 
            onClick={handleTest} 
            type="button"
            disabled={testing || !formData.name || !formData.database}
          >
            {testing ? 'Testing...' : 'Test Connection'}
          </Button>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleClose} type="button">
              Cancel
            </Button>
            <Button type="submit">{connection ? 'Save Changes' : 'Create Connection'}</Button>
          </div>
        </div>
      </form>
    </Modal>
  );
}
