import { useState, useEffect, useCallback } from 'react';
import { useToast } from '../../contexts/ToastContext';

export function useConnectionForm(connection, isOpen, settings, onClose, onSave) {
  const toast = useToast();
  const [testing, setTesting] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    db_type: settings?.default_db_type || 'postgresql',
    host: 'localhost',
    port: 5432,
    database: '',
    username: '',
    password: '',
    ssl_enabled: false,
    ssl_mode: 'require',
  });

  useEffect(() => {
    if (isOpen) {
      if (connection) {
        setFormData({
          name: connection.name || '',
          db_type: connection.db_type || 'postgresql',
          host: connection.host || 'localhost',
          port: connection.port || 5432,
          database: connection.database || '',
          username: connection.username || '',
          password: connection.password || '',
          ssl_enabled: connection.ssl_enabled || false,
          ssl_mode: connection.ssl_mode || 'require',
        });
        setHasChanges(false);
      } else {
        const draft = localStorage.getItem('connection-draft');
        if (draft) {
          try {
            setFormData(JSON.parse(draft));
            setHasChanges(true);
          } catch {
            resetForm();
          }
        } else {
          resetForm();
        }
      }
    }
  }, [connection, isOpen, settings]);

  const resetForm = useCallback(() => {
    setFormData({
      name: '',
      db_type: settings?.default_db_type || 'postgresql',
      host: 'localhost',
      port: 5432,
      database: '',
      username: '',
      password: '',
      ssl_enabled: false,
      ssl_mode: 'require',
    });
    setHasChanges(false);
  }, [settings]);

  const handleChange = useCallback((field, value) => {
    setFormData(prev => {
      const updated = { ...prev, [field]: value };
      if (!connection) {
        localStorage.setItem('connection-draft', JSON.stringify(updated));
      }
      return updated;
    });
    setHasChanges(true);
  }, [connection]);

  const handleTest = useCallback(async () => {
    setTesting(true);
    try {
      const result = await window.electron.ipcRenderer.invoke('connections:test', formData);
      if (result.data.success) {
        toast.success('Connection test successful!');
      } else {
        toast.error(result.data.message || 'Connection test failed');
      }
    } catch (err) {
      toast.error(err.message || 'Connection test failed');
    } finally {
      setTesting(false);
    }
  }, [formData, toast]);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    await onSave(connection ? { ...formData, id: connection.id } : formData);
    localStorage.removeItem('connection-draft');
    setHasChanges(false);
    onClose();
  }, [connection, formData, onSave, onClose]);

  const handleClose = useCallback(() => {
    if (hasChanges) {
      if (window.confirm('You have unsaved changes. Discard them?')) {
        if (!connection) {
          localStorage.removeItem('connection-draft');
        }
        setHasChanges(false);
        onClose();
      }
    } else {
      onClose();
    }
  }, [hasChanges, connection, onClose]);

  return {
    formData,
    setFormData,
    hasChanges,
    setHasChanges,
    testing,
    handleChange,
    handleTest,
    handleSubmit,
    handleClose,
  };
}
